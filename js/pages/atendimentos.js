import { Header } from "../components/header.js";
import { formatDateTime } from "../utils/format.js";

export function Atendimentos(user, atendimentos = [], selectedPeriod = null) {
    // Pega o mês/ano atual no formato YYYY-MM se não tiver período selecionado
    const currentPeriod = selectedPeriod || new Date().toISOString().slice(0, 7);
    
    // Filtra atendimentos pelo mês selecionado
    const atendimentosFiltrados = atendimentos.filter(a => {
        const atendimentoMonth = a.dataInicio.slice(0, 7); // Extrai YYYY-MM
        return atendimentoMonth === currentPeriod;
    });
    
    // Separa atendimentos em aberto e finalizados
    const emAberto = atendimentosFiltrados.filter(a => !a.finalizado);
    const finalizados = atendimentosFiltrados.filter(a => a.finalizado);

    return `
        ${Header(user)}
        <main class="atendimentos">
            <!-- Filtro de Mês -->
            <div class="filter-container">
                <label for="atendimentoMonthFilter">📅 Período</label>
                <input type="month" id="atendimentoMonthFilter" value="${currentPeriod}">
            </div>

            <div class="card-historico" style="margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 12px;">
                    <h3 style="margin: 0;">Atendimentos em Aberto</h3>
                    <button id="btnNovoAtendimento" class="btn-primary" style="padding: 6px 12px; font-size: 0.8rem; white-space: nowrap;">
                        ➕ Novo
                    </button>
                </div>
                
                ${emAberto.length === 0 ? `
                    <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                        Nenhum atendimento em aberto 📋
                    </p>
                ` : `
                    <div class="atendimentos-lista">
                        ${emAberto.map(atendimento => `
                            <div class="atendimento-card" data-id="${atendimento.id}">
                                <div class="atendimento-header">
                                    <strong>${atendimento.titulo}</strong>
                                    <span class="badge badge-aberto">Em Aberto</span>
                                </div>
                                ${atendimento.descricao ? `<p class="atendimento-desc">${atendimento.descricao}</p>` : ''}
                                <div class="atendimento-footer">
                                    <small>📅 ${formatDateTime(atendimento.dataInicio)}</small>
                                    <button class="btn-finalizar" data-id="${atendimento.id}">
                                        ✅ Finalizar
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <div class="card-historico">
                <h3>Atendimentos Finalizados</h3>
                ${finalizados.length === 0 ? `
                    <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                        Nenhum atendimento finalizado ainda ✅
                    </p>
                ` : `
                    <div class="atendimentos-lista">
                        ${finalizados.map(atendimento => `
                            <div class="atendimento-card finalizado" data-id="${atendimento.id}">
                                <div class="atendimento-header">
                                    <strong>${atendimento.titulo}</strong>
                                    <span class="badge badge-finalizado">Finalizado</span>
                                </div>
                                ${atendimento.descricao ? `<p class="atendimento-desc">${atendimento.descricao}</p>` : ''}
                                <div class="atendimento-footer">
                                    <small>📅 ${formatDateTime(atendimento.dataInicio)}</small>
                                    ${atendimento.dataFim ? `<small>✅ ${formatDateTime(atendimento.dataFim)}</small>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        </main>

        <!-- Modal para Novo Atendimento -->
        <div class="modal-overlay" id="modalAtendimento">
            <div class="modal-content">
                <h3>Novo Atendimento</h3>
                <div class="form-group">
                    <label for="atendimentoTitulo">Título *</label>
                    <input type="text" id="atendimentoTitulo" placeholder="Ex: Cliente XYZ - Suporte" required>
                </div>
                <div class="form-group">
                    <label for="atendimentoDescricao">Descrição (opcional)</label>
                    <textarea id="atendimentoDescricao" rows="3" placeholder="Detalhes do atendimento..." style="width:100%; padding:12px; border:1px solid var(--border-color); border-radius:10px; font-family:var(--font-sans); background:var(--bg-primary); color:var(--text-primary); resize:vertical;"></textarea>
                </div>
                <div class="modal-actions">
                    <button class="btn-secondary" id="btnCancelarAtendimento">Cancelar</button>
                    <button class="btn-primary" id="btnSalvarAtendimento">Salvar</button>
                </div>
            </div>
        </div>
    `;
}
