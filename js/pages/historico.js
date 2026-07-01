import { Header } from "../components/header.js";

export function Historico(user, punches = [], selectedMonth = "") {
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const cleanDate = dateString.split('T')[0];
        const [year, month, day] = cleanDate.split('-');
        return `${day}/${month}/${year}`;
    };

    // Filtra usando o período escolhido
    const filteredPunches = punches.filter(p => p.date && p.date.startsWith(selectedMonth));

    const tableRows = filteredPunches.length > 0 
        ? filteredPunches.map(p => `
            <tr>
                <td>${formatDate(p.date)}</td>
                <td><strong>${p.hours || "—"}</strong></td>
                <td><span class="badge">${p.location}</span></td>
            </tr>
          `).join('')
        : `<tr><td colspan="3" style="text-align: center; color: var(--text-secondary); padding: 20px;">Nenhum lançamento para este período.</td></tr>`;

    return `
        ${Header(user)}
        <main class="historico">
            <div class="filter-container">
                <label for="monthFilter">Filtrar por Período:</label>
                <input type="month" id="monthFilter" value="${selectedMonth}">
            </div>

            <div class="card-historico">
                <h3>Lançamentos do Período</h3>
                <table class="punch-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Duração</th>
                            <th>Local</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </main>
    `;
}