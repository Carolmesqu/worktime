// Substitua pela URL gerada na publicação do seu Google Apps Script
//const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyh1J3qZDX3mV7wocHCuiA8Sx3xBTcca4fIv7V5aP0NIAkms6B2JS7yFVt6WOp5z7Nupg/exec";
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbx5yHCGXI96pW42x5YW0V2RgSSRSNbmSeYL-_0yocWoHescYVkFWXDH0vAEzqLYYp8TYQ/exec";

function normalizeDate(value) {
    if (!value) return "";

    const raw = String(value).trim();
    if (!raw) return "";

    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
        return raw.slice(0, 10);
    }

    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed.toISOString().slice(0, 10);
    }

    return raw;
}

function normalizeDuration(value, horaSaida = "") {
    if (value == null) return "";

    const raw = String(value).trim();
    if (!raw) return "";

    // Proteção: se por engano vier um e-mail (ou algo sem nenhum número) na
    // coluna de duração, não exibe esse lixo como se fosse hora.
    if (raw.includes("@") || !/\d/.test(raw)) return "";

    // Formato já esperado (HH:MM)
    if (/^\d{1,2}:\d{2}$/.test(raw)) {
        const [h, m] = raw.split(":").map(Number);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }

    // Estrutura de entrada/saída (HH:MM - HH:MM)
    if (/^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/.test(raw)) {
        return raw;
    }

    // Quando o Sheets devolve duração como data (ex.: 1899-12-30T03:38:28.000Z)
    if (raw.includes("T")) {
        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
            let h = parsed.getHours();
            let m = parsed.getMinutes();
            // Arredonda os segundos para o minuto mais próximo, evitando que
            // "03:00" retorne como "02:59" por causa dos segundos quebrados.
            if (parsed.getSeconds() >= 30) m += 1;
            if (m >= 60) { m -= 60; h += 1; }
            return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
        }

        const isoTimeMatch = raw.match(/T(\d{2}):(\d{2})/);
        if (isoTimeMatch) {
            return `${isoTimeMatch[1]}:${isoTimeMatch[2]}`;
        }
    }

    // Valor numérico decimal (ex.: 1.5 horas)
    if (/^\d+(\.\d+)?$/.test(raw)) {
        const totalMinutes = Math.round(Number(raw) * 60);
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    }

    // Fallback para modelo antigo com horaEntrada/horaSaida
    if (horaSaida) {
        return `${raw} - ${horaSaida}`;
    }

    return raw;
}

function normalizePunch(item) {
    const date = normalizeDate(item.date || item.data);
    const location = item.location || item.local || "";

    let hours = item.hours || item.duracao || "";
    if (!hours && item.horaEntrada) {
        hours = normalizeDuration(item.horaEntrada, item.horaSaida || "");
    } else {
        hours = normalizeDuration(hours, item.horaSaida || "");
    }

    return {
        id: item.id || Date.now().toString(),
        date,
        hours,
        location,
        usuario: item.usuario || item.userEmail || ""
    };
}

export const storageService = {   
    // Obter os registros da planilha usando JSONP para aniquilar o erro de CORS
    async getPunches(userEmail) {
        if (!userEmail) return [];
        
        return new Promise((resolve) => {
            // CORRIGIDO: De Math.now() para Date.now()
            const callbackName = "jsonp_callback_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
            
            // Define a função globalmente para o Google Apps Script conseguir chamar
            window[callbackName] = (data) => {
                // Limpa o script e a função da memória após receber os dados
                document.getElementById(callbackName).remove();
                delete window[callbackName];
                const normalized = Array.isArray(data) ? data.map(normalizePunch) : [];

                if (normalized.length > 0) {
                    // Guarda a última cópia conhecida para servir de reserva quando o
                    // servidor do Google estiver "frio" e devolver vazio numa chamada.
                    try {
                        localStorage.setItem("worktime_punches", JSON.stringify(normalized));
                    } catch (e) { /* ignora limite de armazenamento */ }
                    resolve(normalized);
                } else {
                    // Sem registros do servidor: usa a reserva local, se existir,
                    // para o Dashboard não mostrar 00h00m com dados já lançados.
                    const backup = localStorage.getItem("worktime_punches");
                    resolve(backup ? JSON.parse(backup) : normalized);
                }
            };

            // Monta a URL injetando o e-mail e o nome da nossa função de callback
            const cacheBuster = Date.now();
            const url = `${SHEET_API_URL}?action=getJornadas&userEmail=${encodeURIComponent(userEmail)}&callback=${callbackName}&_=${cacheBuster}`;

            // Injeta dinamicamente a tag script no HTML para carregar o arquivo do Google
            const script = document.createElement("script");
            script.src = url;
            script.id = callbackName;
            
            // Trata caso aconteça algum erro de rede gritante
            script.onerror = () => {
                if (window[callbackName]) delete window[callbackName];
                const backup = localStorage.getItem("worktime_punches");
                resolve(backup ? JSON.parse(backup) : []);
            };

            document.body.appendChild(script);
        });
    },

    // Enviar o ponto atrelando o e-mail do usuário ativo
    async savePunch(punchData, userEmail) {
        const payload = {
            action: "saveJornada",
            id: Date.now().toString(),
            data: punchData.date,
            duracao: punchData.hours,
            local: punchData.location || '',
            userEmail: userEmail
        };

        try {
            await fetch(SHEET_API_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload)
            });

            // Atualiza a reserva local imediatamente para o novo lançamento já
            // aparecer no Dashboard/Histórico sem depender da próxima busca.
            try {
                const backup = localStorage.getItem("worktime_punches");
                const list = backup ? JSON.parse(backup) : [];
                list.push(normalizePunch({
                    id: payload.id,
                    date: payload.data,
                    hours: payload.duracao,
                    location: payload.local,
                    usuario: payload.userEmail
                }));
                localStorage.setItem("worktime_punches", JSON.stringify(list));
            } catch (e) { /* ignora falha de armazenamento local */ }

            return true;
        } catch (error) {
            console.error("Erro ao enviar ponto:", error);
            throw error;
        }
    }
};