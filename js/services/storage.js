// Substitua pela URL gerada na publicação do seu Google Apps Script
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyh1J3qZDX3mV7wocHCuiA8Sx3xBTcca4fIv7V5aP0NIAkms6B2JS7yFVt6WOp5z7Nupg/exec";

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
                resolve(data); // Retorna os pontos reais para a aplicação
            };

            // Monta a URL injetando o e-mail e o nome da nossa função de callback
            const url = `${SHEET_API_URL}?email=${encodeURIComponent(userEmail)}&callback=${callbackName}`;

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
            date: punchData.date,
            hours: punchData.hours,
            location: punchData.location,
            userEmail: userEmail // Enviado para salvar na coluna D
        };

        try {
            await fetch(SHEET_API_URL, {
                method: "POST",
                mode: "no-cors", 
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (error) {
            console.error("Erro ao enviar ponto:", error);
            throw error;
        }
    }
};