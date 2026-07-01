// Substitua pela URL gerada na publicação do seu Google Apps Script
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbx5yHCGXI96pW42x5YW0V2RgSSRSNbmSeYL-_0yocWoHescYVkFWXDH0vAEzqLYYp8TYQ/exec";

function executeJsonpAction(action, params = {}) {
    return new Promise((resolve, reject) => {
        const callbackName = `jsonp_action_${action}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const query = new URLSearchParams({
            action,
            callback: callbackName,
            _: Date.now().toString(),
            ...Object.fromEntries(
                Object.entries(params).map(([key, value]) => [key, value == null ? "" : String(value)])
            )
        });

        window[callbackName] = (data) => {
            const script = document.getElementById(callbackName);
            if (script) script.remove();
            delete window[callbackName];
            resolve(data);
        };

        const script = document.createElement("script");
        script.src = `${SHEET_API_URL}?${query.toString()}`;
        script.id = callbackName;

        script.onerror = () => {
            const current = document.getElementById(callbackName);
            if (current) current.remove();
            delete window[callbackName];
            reject(new Error(`Erro ao executar ação ${action}.`));
        };

        document.head.appendChild(script);
    });
}

function normalizeAtendimento(item) {
    const normalized = {
        id: item.id || "",
        titulo: item.titulo || "",
        descricao: item.descricao || "",
        dataPrevista: item.dataPrevista || "",
        dataInicio: item.dataInicio || "",
        finalizado: item.finalizado === true || String(item.finalizado).toLowerCase() === "true",
        dataFim: item.dataFim || "",
        usuario: item.usuario || item.userEmail || ""
    };

    const previstaPareceCriacao = typeof normalized.dataPrevista === "string" && normalized.dataPrevista.includes("T");
    const inicioVazio = !normalized.dataInicio;

    if (inicioVazio && previstaPareceCriacao) {
        normalized.dataInicio = normalized.dataPrevista;
        normalized.dataPrevista = "";
    }

    return normalized;
}

// Serviço para gerenciar atendimentos no Google Sheets
export const atendimentosService = {
    /**
     * Busca todos os atendimentos do usuário
     */
    async getAtendimentos(userEmail) {
        if (!userEmail) return [];
        
        return new Promise((resolve) => {
            const callbackName = "jsonp_atendimentos_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
            
            window[callbackName] = (data) => {
                document.getElementById(callbackName).remove();
                delete window[callbackName];
                const normalized = Array.isArray(data) ? data.map(normalizeAtendimento) : [];
                resolve(normalized);
            };

            // Adiciona timestamp para evitar cache
            const cacheBuster = new Date().getTime();
            const url = `${SHEET_API_URL}?action=getAtendimentos&userEmail=${encodeURIComponent(userEmail)}&callback=${callbackName}&_=${cacheBuster}`;

            const script = document.createElement("script");
            script.src = url;
            script.id = callbackName;
            
            script.onerror = () => {
                document.getElementById(callbackName).remove();
                delete window[callbackName];
                console.error("Erro ao carregar atendimentos da planilha.");
                resolve([]);
            };

            document.head.appendChild(script);
        });
    },

    /**
     * Salva um novo atendimento
     */
    async saveAtendimento(userEmail, atendimento) {
        const novoAtendimento = {
            action: "saveAtendimento",
            id: Date.now().toString(),
            titulo: atendimento.titulo,
            descricao: atendimento.descricao || '',
            dataPrevista: atendimento.dataPrevista || '',
            dataInicio: new Date().toISOString(),
            userEmail: userEmail
        };

        try {
            await fetch(SHEET_API_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(novoAtendimento)
            });

            return {
                id: novoAtendimento.id,
                titulo: novoAtendimento.titulo,
                descricao: novoAtendimento.descricao,
                dataPrevista: novoAtendimento.dataPrevista,
                dataInicio: novoAtendimento.dataInicio,
                finalizado: false,
                dataFim: null
            };
        } catch (error) {
            console.error("Erro ao salvar atendimento:", error);
            throw error;
        }
    },

    /**
     * Edita um atendimento existente
     */
    async editarAtendimento(atendimentoId, atendimento) {
        try {
            const response = await executeJsonpAction("editarAtendimento", {
                id: atendimentoId,
                titulo: atendimento.titulo,
                descricao: atendimento.descricao || "",
                dataPrevista: atendimento.dataPrevista || ""
            });

            if (!response || response.success !== true) {
                throw new Error(response?.error || "Não foi possível editar o atendimento.");
            }

            return { status: "success" };
        } catch (error) {
            console.error("Erro ao editar atendimento:", error);
            throw error;
        }
    },

    /**
     * Finaliza um atendimento
     */
    async finalizarAtendimento(userEmail, atendimentoId) {
        try {
            const response = await executeJsonpAction("finalizarAtendimento", {
                id: atendimentoId,
                dataFim: new Date().toISOString(),
                userEmail
            });

            if (!response || response.success !== true) {
                throw new Error(response?.error || "Não foi possível finalizar o atendimento.");
            }

            return { status: "success" };
        } catch (error) {
            console.error("Erro ao finalizar atendimento:", error);
            throw error;
        }
    },

    /**
     * Deleta um atendimento (não implementado no backend ainda)
     */
    async deleteAtendimento(userEmail, atendimentoId) {
        // TODO: Implementar se necessário
        console.log("Delete não implementado ainda");
    }
};
