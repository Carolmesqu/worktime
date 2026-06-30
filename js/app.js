import { checkLogin, login, logout } from "./auth.js"; // Supondo que você tenha uma função logout em auth.js ou implemente depois
import { render } from "./router.js";
import { state, navigateTo } from "./state.js";

const app = document.querySelector("#app");

// Função para gerenciar os eventos dinâmicos da interface
function setupEventListeners(user) {
    if (!user) {
        // Evento do botão de Login
        const loginBtn = document.querySelector("#loginButton");
        if (loginBtn) loginBtn.addEventListener("click", login);
        return;
    }

// Eventos da Navbar (Troca de abas)
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            const targetPage = e.currentTarget.getAttribute("data-page");
            navigateTo(targetPage, async () => {
                await render(app, user);
                setupEventListeners(user); 
            });
        });
    });
   
// Gerenciar a abertura e fechamento do Modal de Ponto Manual
    const fabBtn = document.querySelector("#fabPunchClock");
    const punchModal = document.querySelector("#punchModal");
    const btnCancelModal = document.querySelector("#btnCancelModal");
    const punchForm = document.querySelector("#punchForm");

    if (fabBtn && punchModal) {
        // Abrir o modal ao clicar no FAB
        fabBtn.addEventListener("click", () => {
            punchModal.classList.add("active");
        });

        // Fechar o modal ao clicar em Cancelar
        if (btnCancelModal) {
            btnCancelModal.addEventListener("click", () => {
                punchModal.classList.remove("active");
                punchForm.reset();
            });
        }

        // Enviar os dados digitados manualmente pelo usuário
        if (punchForm) {
            punchForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                
                const selectedDate = document.querySelector("#punchDate").value;
                const insertedHours = document.querySelector("#punchHours").value;
                const insertedLocation = document.querySelector("#punchLocation").value;

                try {
                    const { storageService } = await import("./services/storage.js");
                    
                    await storageService.savePunch({
                        date: selectedDate,
                        hours: insertedHours,
                        location: insertedLocation
                    }, state.user.email); // <--- Adicionado aqui!

                    // Agora o código vai chegar aqui sem travar!
                    punchModal.classList.remove("active");
                    punchForm.reset();

                    alert("Lançamento efetuado com sucesso! 🎉");

                    await render(app, user);
                    setupEventListeners(user);
                } catch (err) {
                    alert("Erro ao salvar o ponto. Verifique a conexão.");
                    console.error(err);
                }
            });
        }
    }

// Evento do botão de Logout (se estiver na página de perfil)
    const logoutButton = document.querySelector("#logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            try {
                // Chama o encerramento de sessão real do Firebase
                await logout(); 
                
                // Opcional: Limpa o estado local do usuário por segurança
                const { state } = await import("./state.js");
                state.user = null;
                state.currentPage = "dashboard"; // Reseta para a página inicial padrão
                
                // O checkLogin do app.js vai detectar automaticamente que o usuário deslogou
                // e vai renderizar a tela de Login sozinha. Mas podemos forçar o render aqui:
                const { render } = await import("./router.js");
                await render(app, null);
                setupEventListeners(null);
                
                alert("Você saiu da conta! Até logo. 👋");
            } catch (error) {
                alert("Erro ao tentar sair da conta.");
            }
        });
    }

    // Ouvinte para o filtro da página de Histórico
    const monthFilter = document.querySelector("#monthFilter");
    if (monthFilter) {
        monthFilter.addEventListener("change", async (e) => {
            state.currentPeriod = e.target.value; // Salva o mês escolhido no estado global!
            await render(app, user);
            setupEventListeners(user);
        });
    }

    // Ouvinte para o filtro da página de Dashboard
    const dashMonthFilter = document.querySelector("#dashMonthFilter");
    if (dashMonthFilter) {
        dashMonthFilter.addEventListener("change", async (e) => {
            state.currentPeriod = e.target.value; // Salva o mês escolhido no estado global!
            await render(app, user);
            setupEventListeners(user);
        });
    }

    // Máscara inteligente para o campo de Duração (Formato 00:00)
    const punchHoursInput = document.querySelector("#punchHours");
    if (punchHoursInput) {
        punchHoursInput.addEventListener("input", (e) => {
            let value = e.target.value;

            // 1. Remove qualquer caractere que não seja número
            value = value.replace(/\D/g, "");

            // 2. Se tiver mais de 2 números, injeta os dois pontos automaticamente
            if (value.length > 2) {
                value = value.substring(0, 2) + ":" + value.substring(2, 4);
            }

            // Atualiza o valor do campo na tela com a máscara aplicada
            e.target.value = value;
        });

        // Validação extra caso a pessoa deixe o campo incompleto ao sair dele
        punchHoursInput.addEventListener("blur", (e) => {
            const value = e.target.value;
            if (value && value.length < 5) {
                alert("Por favor, insira a duração completa no formato 00:00");
                e.target.value = ""; // Limpa para evitar envio incorreto
            }
        });
    }

    // Monitorar a troca do tipo de controle no Perfil para esconder/mostrar o valor por hora
    const userJobType = document.querySelector("#userJobType");
    const valHoraGroup = document.querySelector("#valHoraGroup");
    if (userJobType && valHoraGroup) {
        userJobType.addEventListener("change", (e) => {
            valHoraGroup.style.display = e.target.value === "dinheiro" ? "block" : "none";
        });
    }

    // Ação do botão de salvar preferências no Perfil
    const btnSaveConfig = document.querySelector("#btnSaveConfig");
    if (btnSaveConfig && user) {
        btnSaveConfig.addEventListener("click", async () => {
            const typeValue = document.querySelector("#userJobType").value;
            const hourValue = document.querySelector("#userHourValue") ? document.querySelector("#userHourValue").value : "0.00";

            // Salva individualmente usando o e-mail do usuário como chave única
            localStorage.setItem(`worktime_type_${user.email}`, typeValue);
            localStorage.setItem(`worktime_val_hr_${user.email}`, hourValue);

            alert("Configurações salvas com sucesso! ⚙️");
            
            const { render } = await import("./router.js");
            await render(app, user);
            setupEventListeners(user);
        });
    }
}

// Inicialização da Aplicação
checkLogin(async (user) => {
    state.user = user;
    await render(app, user);
    setupEventListeners(user);
});