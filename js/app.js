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
            let hourValue = document.querySelector("#userHourValue") ? document.querySelector("#userHourValue").value : "0.00";

            // Validar e formatar o valor da hora
            hourValue = hourValue.replace(',', '.'); // Aceita vírgula também
            const numValue = parseFloat(hourValue) || 0;
            if (numValue < 0) {
                alert("O valor não pode ser negativo!");
                return;
            }
            hourValue = numValue.toFixed(2); // Formata com 2 casas decimais

            // Salva individualmente usando o e-mail do usuário como chave única
            localStorage.setItem(`worktime_type_${user.email}`, typeValue);
            localStorage.setItem(`worktime_val_hr_${user.email}`, hourValue);

            alert("Configurações salvas com sucesso! ⚙️");
            
            const { render } = await import("./router.js");
            await render(app, user);
            setupEventListeners(user);
        });
    }

    // Eventos para a página de Atendimentos
    const btnNovoAtendimento = document.querySelector("#btnNovoAtendimento");
    const modalAtendimento = document.querySelector("#modalAtendimento");
    const btnCancelarAtendimento = document.querySelector("#btnCancelarAtendimento");
    const btnSalvarAtendimento = document.querySelector("#btnSalvarAtendimento");

    if (btnNovoAtendimento && modalAtendimento) {
        // Abrir modal de novo atendimento
        btnNovoAtendimento.addEventListener("click", () => {
            // Resetar modo de edição
            modalAtendimento.setAttribute("data-editing-id", "");
            document.querySelector("#modalAtendimentoTitle").textContent = "Novo Atendimento";
            document.querySelector("#atendimentoTitulo").value = "";
            document.querySelector("#atendimentoDataPrevista").value = "";
            document.querySelector("#atendimentoDescricao").value = "";
            
            modalAtendimento.classList.add("active");
        });

        // Cancelar e fechar modal
        if (btnCancelarAtendimento) {
            btnCancelarAtendimento.addEventListener("click", () => {
                modalAtendimento.classList.remove("active");
                modalAtendimento.setAttribute("data-editing-id", "");
                document.querySelector("#atendimentoTitulo").value = "";
                document.querySelector("#atendimentoDataPrevista").value = "";
                document.querySelector("#atendimentoDescricao").value = "";
            });
        }

        // Salvar novo/editar atendimento
        if (btnSalvarAtendimento) {
            btnSalvarAtendimento.addEventListener("click", async () => {
                const titulo = document.querySelector("#atendimentoTitulo").value.trim();
                const dataPrevista = document.querySelector("#atendimentoDataPrevista").value;
                const descricao = document.querySelector("#atendimentoDescricao").value.trim();
                const editingId = modalAtendimento.getAttribute("data-editing-id");

                if (!titulo || !dataPrevista) {
                    alert("Por favor, preencha o título e a data prevista!");
                    return;
                }

                try {
                    const { atendimentosService } = await import("./services/atendimentos.js");
                    
                    if (editingId) {
                        // Modo de edição
                        await atendimentosService.editarAtendimento(editingId, { titulo, dataPrevista, descricao });
                        alert("Atendimento atualizado com sucesso! ✏️");
                    } else {
                        // Modo de criação
                        await atendimentosService.saveAtendimento(user.email, { titulo, dataPrevista, descricao });
                        alert("Atendimento criado com sucesso! 📋");
                    }

                    modalAtendimento.classList.remove("active");
                    modalAtendimento.setAttribute("data-editing-id", "");
                    document.querySelector("#atendimentoTitulo").value = "";
                    document.querySelector("#atendimentoDataPrevista").value = "";
                    document.querySelector("#atendimentoDescricao").value = "";

                    await render(app, user);
                    setupEventListeners(user);
                } catch (err) {
                    alert("Erro ao salvar atendimento.");
                    console.error(err);
                }
            });
        }
    }

    // Editar atendimento
    const btnsEditar = document.querySelectorAll(".btn-editar");
    btnsEditar.forEach(btn => {
        btn.addEventListener("click", () => {
            const atendimentoId = btn.getAttribute("data-id");
            const titulo = btn.getAttribute("data-titulo");
            const descricao = btn.getAttribute("data-descricao");
            const dataPrevista = btn.getAttribute("data-dataprevista");

            // Preencher o modal com os dados do atendimento
            modalAtendimento.setAttribute("data-editing-id", atendimentoId);
            document.querySelector("#modalAtendimentoTitle").textContent = "Editar Atendimento";
            document.querySelector("#atendimentoTitulo").value = titulo;
            document.querySelector("#atendimentoDataPrevista").value = dataPrevista;
            document.querySelector("#atendimentoDescricao").value = descricao;

            modalAtendimento.classList.add("active");
        });
    });

    // Finalizar atendimento
    const btnsFinalizar = document.querySelectorAll(".btn-finalizar");
    btnsFinalizar.forEach(btn => {
        btn.addEventListener("click", async () => {
            const atendimentoId = btn.getAttribute("data-id");
            
            if (confirm("Deseja finalizar este atendimento?")) {
                try {
                    const { atendimentosService } = await import("./services/atendimentos.js");
                    await atendimentosService.finalizarAtendimento(user.email, atendimentoId);

                    alert("Atendimento finalizado! ✅");

                    // Aguarda 1 segundo para o Google Sheets processar
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    await render(app, user);
                    setupEventListeners(user);
                } catch (err) {
                    alert("Erro ao finalizar atendimento.");
                    console.error(err);
                }
            }
        });
    });

    // Ouvinte para o filtro da página de Atendimentos
    const atendimentoMonthFilter = document.querySelector("#atendimentoMonthFilter");
    if (atendimentoMonthFilter) {
        atendimentoMonthFilter.addEventListener("change", async (e) => {
            state.currentPeriod = e.target.value; // Salva o mês escolhido no estado global!
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