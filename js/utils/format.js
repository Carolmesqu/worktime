/**
 * Formata uma data ISO para o formato brasileiro com hora
 * @param {string} isoDate - Data no formato ISO (ex: "2026-06-30T14:30:00.000Z")
 * @returns {string} - Data formatada (ex: "30/06/2026 às 14:30")
 */
export function formatDateTime(isoDate) {
    if (!isoDate) return "";
    
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

/**
 * Formata uma data ISO para o formato brasileiro (apenas data)
 * @param {string} isoDate - Data no formato ISO
 * @returns {string} - Data formatada (ex: "30/06/2026")
 */
export function formatDate(isoDate) {
    if (!isoDate) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
        const [year, month, day] = isoDate.split('-');
        return `${day}/${month}/${year}`;
    }

    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "";
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}
