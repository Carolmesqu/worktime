import { Header } from "../components/header.js";
import { formatDateTime, formatDate } from "../utils/format.js";

export function Atendimentos(user, atendimentos = [], selectedPeriod = null) {
    const servicoOptions = [
        "Manutencao de Ar Condicionado",
        "Instalacao de Ar Condicionado",
        "Limpeza de Ar Condicionado",
        "Recarga de Gas",
        "Instalacao de Tomadas",
        "Troca de Disjuntor",
        "Instalacao Eletrica Residencial",
        "Instalacao Eletrica Comercial",
        "Reparo de Curto-Circuito",
        "Troca de Fiacao",
        "Outro"
    ];

    const toYmd = (value) => {
        if (!value) return "";

        const raw = String(value).trim();
        if (!raw) return "";

        // ISO parcial/completa: YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            return raw.slice(0, 10);
        }

        // Formato brasileiro: DD/MM/YYYY
        const brDate = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (brDate) {
            const [, day, month, year] = brDate;
            return `${year}-${month}-${day}`;
        }

        const parsed = new Date(raw);
        if (Number.isNaN(parsed.getTime())) return "";

        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const getLocalToday = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const sortByPriorityDate = (a, b) => {
        const aDate = toYmd(a.dataPrevista) || toYmd(a.dataInicio);
        const bDate = toYmd(b.dataPrevista) || toYmd(b.dataInicio);

        if (aDate && bDate) return aDate.localeCompare(bDate);
        if (aDate) return -1;
        if (bDate) return 1;
        return (a.titulo || "").localeCompare(b.titulo || "", "pt-BR");
    };

    const today = getLocalToday();

    // Pega o mês/ano atual no formato YYYY-MM se não tiver período selecionado
    const currentPeriod = selectedPeriod || new Date().toISOString().slice(0, 7);
    
    // Filtra atendimentos pelo mês selecionado
    const atendimentosFiltrados = atendimentos.filter(a => {
        const dataBase = a.dataInicio || a.dataPrevista || "";
        const atendimentoMonth = dataBase.slice(0, 7); // Extrai YYYY-MM
        return atendimentoMonth === currentPeriod;
    });
    
    // Separa atendimentos em aberto e finalizados e ordena por prioridade (data mais proxima primeiro)
    const emAberto = atendimentosFiltrados
        .filter(a => !a.finalizado)
        .sort(sortByPriorityDate);
    const finalizados = atendimentosFiltrados
        .filter(a => a.finalizado)
        .sort(sortByPriorityDate);

    return `
        ${Header(user)}
        <main class="atendimentos">
            <!-- Filtro de Mês -->
            <div class="filter-container">
                <label for="atendimentoMonthFilter">📅 Período</label>
                <input type="month" id="atendimentoMonthFilter" value="${currentPeriod}">
            </div>

            <div class="card-historico" style="margin-bottom: 16px;">
                <div class="atendimentos-topbar">
                    <h3 class="atendimentos-topbar-title">Atendimentos em Aberto</h3>
                    <button id="btnNovoAtendimento" class="btn-primary btn-novo-atendimento">
                        ➕ Novo
                    </button>
                </div>
                
                ${emAberto.length === 0 ? `
                    <p style="color: var(--text-secondary); text-align: center; padding: 20px;">
                        Nenhum atendimento em aberto 📋
                    </p>
                ` : `
                    <div class="atendimentos-lista">
                        ${emAberto.map(atendimento => {
                            const atendimentoPrevistoDate = toYmd(atendimento.dataPrevista);
                            const isToday = atendimentoPrevistoDate === today;

                            return `
                            <div class="atendimento-card ${isToday ? 'atendimento-card-hoje' : ''}" data-id="${atendimento.id}">
                                <div class="atendimento-header">
                                    <strong>${atendimento.titulo}</strong>
                                    <span class="badge ${isToday ? 'badge-hoje' : 'badge-aberto'}">${isToday ? 'Hoje' : 'Em Aberto'}</span>
                                </div>
                                ${atendimento.servico ? `<p class="atendimento-servico">🛠️ Serviço: ${atendimento.servico}</p>` : ''}
                                ${atendimento.descricao ? `<p class="atendimento-desc">${atendimento.descricao}</p>` : ''}
                                ${atendimento.dataPrevista ? `<p class="atendimento-data-prevista">🎯 Previsto para: ${formatDate(atendimento.dataPrevista)}</p>` : ''}
                                <div class="atendimento-footer">
                                    <small>📅 Criado: ${formatDateTime(atendimento.dataInicio)}</small>
                                    <div class="atendimento-actions">
                                        <button class="btn-editar" data-id="${atendimento.id}" 
                                            data-titulo="${atendimento.titulo}" 
                                            data-descricao="${atendimento.descricao || ''}" 
                                            data-servico="${atendimento.servico || ''}"
                                            data-dataprevista="${atendimento.dataPrevista || ''}">
                                            ✏️ Editar
                                        </button>
                                        <button class="btn-finalizar" data-id="${atendimento.id}">
                                            ✅ Finalizar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                        }).join('')}
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
                                ${atendimento.servico ? `<p class="atendimento-servico">🛠️ Serviço: ${atendimento.servico}</p>` : ''}
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
        <div class="modal-overlay" id="modalAtendimento" data-editing-id="">
            <div class="modal-content">
                <h3 id="modalAtendimentoTitle">Novo Atendimento</h3>
                <div class="form-group">
                    <label for="atendimentoTitulo">Título *</label>
                    <input type="text" id="atendimentoTitulo" placeholder="Ex: Cliente XYZ - Suporte" required>
                </div>
                <div class="form-group">
                    <label for="atendimentoDataPrevista">Data Prevista *</label>
                    <input type="date" id="atendimentoDataPrevista" required>
                </div>
                <div class="form-group">
                    <label for="atendimentoServico">Serviço *</label>
                    <select id="atendimentoServico" required>
                        <option value="" selected disabled>Selecione o tipo de serviço</option>
                        ${servicoOptions.map(servico => `<option value="${servico}">${servico}</option>`).join('')}
                    </select>
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
