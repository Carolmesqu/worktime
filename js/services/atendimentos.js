// Substitua pela URL gerada na publicação do seu Google Apps Script
const SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyh1J3qZDX3mV7wocHCuiA8Sx3xBTcca4fIv7V5aP0NIAkms6B2JS7yFVt6WOp5z7Nupg/exec";

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
                resolve(data);
            };

            // Adiciona timestamp para evitar cache
            const cacheBuster = new Date().getTime();
            const url = `${SHEET_API_URL}?type=atendimentos&email=${encodeURIComponent(userEmail)}&callback=${callbackName}&_=${cacheBuster}`;

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
     * Finaliza um atendimento
     */
    async finalizarAtendimento(userEmail, atendimentoId) {
        const data = {
            action: "finalizarAtendimento",
            id: atendimentoId,
            dataFim: new Date().toISOString()
        };

        try {
            await fetch(SHEET_API_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(data)
            });

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
