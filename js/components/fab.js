export function FAB() {
    // Pegar a data de hoje no formato YYYY-MM-DD para colocar como padrão no input
    const today = new Date().toISOString().split('T')[0];

    return `
        <button class="fab" id="fabPunchClock" title="Lançar Horas Extras">
            ⏱️
        </button>

        <div class="modal-overlay" id="punchModal">
            <div class="modal-content">
                <h3>Lançar Ponto Manual</h3>
                <form id="punchForm">
                    <div class="form-group">
                        <label for="punchDate">Data</label>
                        <input type="date" id="punchDate" value="${today}" required>
                    </div>

                    <div class="form-group">
                        <label for="punchHours">Quantidade de Horas</label>
                        <!-- MODIFICADO: type="tel", placeholder e maxlength="5" para a máscara funcionar perfeitamente -->
                        <input type="tel" id="punchHours" placeholder="00:00" maxlength="5" autocomplete="off" required>
                    </div>

                    <div class="form-group">
                        <label for="punchLocation">Local / Observação</label>
                        <input type="text" id="punchLocation" placeholder="Ex: Escritório, Home Office" required>
                    </div>

                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" id="btnCancelModal">Cancelar</button>
                        <button type="submit" class="btn-primary">Salvar Registro</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}