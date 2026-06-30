export function Navbar() {
    return `
        <nav class="navbar">
            <button class="nav-item" data-page="dashboard">
                <span class="icon">📊</span>
                <span class="label">Dashboard</span>
            </button>
            <button class="nav-item" data-page="historico">
                <span class="icon">📅</span>
                <span class="label">Histórico</span>
            </button>
            <button class="nav-item" data-page="atendimentos">
                <span class="icon">📋</span>
                <span class="label">Atendimentos</span>
            </button>
            <button class="nav-item" data-page="perfil">
                <span class="icon">👤</span>
                <span class="label">Perfil</span>
            </button>
        </nav>
    `;
}