import { Login } from "./pages/login.js";
import { Dashboard } from "./pages/dashboard.js";
import { Historico } from "./pages/historico.js";
import { Atendimentos } from "./pages/atendimentos.js";
import { Perfil } from "./pages/perfil.js";
import { Navbar } from "./components/navbar.js";
import { FAB } from "./components/fab.js";
import { state } from "./state.js";
import { storageService } from "./services/storage.js";
import { atendimentosService } from "./services/atendimentos.js";

export async function render(app, user) {
    if (!user) {
        app.innerHTML = Login();
        return;
    }

    let pageContent = "";

    if (state.currentPage === "dashboard") {
        const punches = await storageService.getPunches(user.email);
        // Passa o período guardado no estado global
        pageContent = Dashboard(user, punches, state.currentPeriod);
    } else if (state.currentPage === "historico") {
        const punches = await storageService.getPunches(user.email);
        // Passa o período guardado no estado global
        pageContent = Historico(user, punches, state.currentPeriod);
    } else if (state.currentPage === "atendimentos") {
        const atendimentos = await atendimentosService.getAtendimentos(user.email);
        pageContent = Atendimentos(user, atendimentos, state.currentPeriod);
    } else if (state.currentPage === "perfil") {
        pageContent = Perfil(user);
    }

    app.innerHTML = `
        <div class="app-container">
            ${pageContent}
            ${FAB()}
            ${Navbar()}
        </div>
    `;

    const activeBtn = app.querySelector(`[data-page="${state.currentPage}"]`);
    if (activeBtn) activeBtn.classList.add("active");
}