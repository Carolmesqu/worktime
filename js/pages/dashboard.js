import { Header } from "../components/header.js";
import { Card } from "../components/card.js";

// Converte um valor de horas em minutos, de forma resistente a formatos variados.
// Aceita "HH:MM", faixa "HH:MM - HH:MM" (entrada - saída), número decimal ("1.5")
// e sempre retorna um número válido (0 quando não conseguir interpretar).
function parseHoursToMinutes(rawValue) {
    if (rawValue == null) return 0;

    const value = String(rawValue).trim();
    if (!value) return 0;

    // Faixa de entrada e saída: "08:00 - 12:30"
    const rangeMatch = value.match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
    if (rangeMatch) {
        const start = Number(rangeMatch[1]) * 60 + Number(rangeMatch[2]);
        let end = Number(rangeMatch[3]) * 60 + Number(rangeMatch[4]);
        // Se a saída for "menor" que a entrada, assume que virou o dia
        if (end < start) end += 24 * 60;
        const diff = end - start;
        return Number.isFinite(diff) && diff > 0 ? diff : 0;
    }

    // Duração simples: "HH:MM"
    const durationMatch = value.match(/^(\d{1,2}):(\d{2})$/);
    if (durationMatch) {
        const minutes = Number(durationMatch[1]) * 60 + Number(durationMatch[2]);
        return Number.isFinite(minutes) ? minutes : 0;
    }

    // Número decimal em horas: "1.5" ou "1,5"
    const decimal = parseFloat(value.replace(",", "."));
    if (Number.isFinite(decimal)) {
        return Math.round(decimal * 60);
    }

    return 0;
}

export function Dashboard(user, punches = [], selectedMonth = "") {
    let totalMinutes = 0;

    // Carrega as configurações customizadas do usuário logado
    const userType = localStorage.getItem(`worktime_type_${user.email}`) || "banco";
    const userValue = parseFloat(localStorage.getItem(`worktime_val_hr_${user.email}`) || "0.00");

    punches.forEach(p => {
        if (p.date && p.date.startsWith(selectedMonth) && p.hours) {
            totalMinutes += parseHoursToMinutes(p.hours);
        }
    });

    // Garante que nunca vamos exibir "NaN" caso algo inesperado aconteça
    if (!Number.isFinite(totalMinutes)) totalMinutes = 0;

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