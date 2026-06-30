import { Header } from "../components/header.js";
import { Card } from "../components/card.js";

export function Dashboard(user, punches = [], selectedMonth = "") {
    let totalMinutes = 0;

    // Carrega as configurações customizadas do usuário logado
    const userType = localStorage.getItem(`worktime_type_${user.email}`) || "banco";
    const userValue = parseFloat(localStorage.getItem(`worktime_val_hr_${user.email}`) || "0.00");

    punches.forEach(p => {
        if (p.date && p.date.startsWith(selectedMonth) && p.hours) {
            if (p.hours.includes(':')) {
                const [h, m] = p.hours.split(':').map(Number);
                totalMinutes += (h * 60) + (m || 0);
            } else {
                totalMinutes += parseFloat(p.hours) * 60;
            }
        }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const formattedTotal = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m`;

    // Lógica condicional customizada por usuário
    let terceiroCardTitulo = "Banco Acumulado";
    let terceiroCardValor = formattedTotal;

    if (userType === "dinheiro") {
        terceiroCardTitulo = "Valor Estimado";
        const totalHorasDecimais = totalMinutes / 60;
        const valorEstimado = totalHorasDecimais * userValue;
        terceiroCardValor = valorEstimado > 0 
            ? `R$ ${valorEstimado.toFixed(2).replace('.', ',')}`
            : "R$ 0,00";
    }

    return `
        ${Header(user)}
        <main class="dashboard">
            <div class="filter-container">
                <label for="dashMonthFilter">Visualizar Mês:</label>
                <input type="month" id="dashMonthFilter" value="${selectedMonth}">
            </div>

            ${Card("Total do Período", formattedTotal)}
            ${Card("Horas Extras", formattedTotal)}
            ${Card(terceiroCardTitulo, terceiroCardValor)}
        </main>
    `;
}