export const state = {
    user: null,
    currentPage: "dashboard",
    // Inicia o filtro global com o ano e mês atual (Ex: "2026-06")
    currentPeriod: new Date().toISOString().substring(0, 7) 
};

export function navigateTo(page, callback) {
    state.currentPage = page;
    if (callback) callback();
}