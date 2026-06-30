import { Header } from "../components/header.js";

export function Perfil(user) {
    // Busca as configurações salvas desse usuário localmente (ou assume o padrão)
    const savedValue = localStorage.getItem(`worktime_val_hr_${user.email}`) || "0.00";
    const savedType = localStorage.getItem(`worktime_type_${user.email}`) || "banco";

    return `
        ${Header(user)}
        <main class="perfil">
            <div class="card-historico" style="margin-bottom: 16px;">
                <h3>Minhas Configurações</h3>
                
                <div class="form-group">
                    <label for="userJobType">Tipo de Controle</label>
                    <select id="userJobType" style="width:100%; padding:12px; border:1px solid var(--border-color); border-radius:10px; font-family:var(--font-sans); background:var(--bg-primary); color:var(--text-primary);">
                        <option value="dinheiro" ${savedType === 'dinheiro' ? 'selected' : ''}>Hora Extra Paga (Dinheiro)</option>
                        <option value="banco" ${savedType === 'banco' ? 'selected' : ''}>Banco de Horas (Acúmulo)</option>
                    </select>
                </div>

                <div class="form-group" id="valHoraGroup" style="display: ${savedType === 'dinheiro' ? 'block' : 'none'};">
                    <label for="userHourValue">Valor da sua Hora Extra (R$)</label>
                    <input type="number" id="userHourValue" step="0.01" value="${savedValue}" placeholder="Ex: 25.50">
                </div>

                <button id="btnSaveConfig" class="btn-primary" style="margin-top: 10px; width:100%;">Salvar Preferências</button>
            </div>

            <div class="card-historico">
                <h3>Conta Google Autenticada</h3>
                <p style="margin-bottom: 8px;"><strong>Nome:</strong> ${user.displayName}</p>
                <p><strong>E-mail:</strong> ${user.email}</p>
                <button id="logoutButton" class="btn-danger" style="margin-top: 15px;">Sair da Conta</button>
            </div>
        </main>
    `;
}