# ⏰ WorkTime - Controle de Horas Extras & Banco de Horas

> 🚀 **[Acesse o app agora: https://carolmesqu.github.io/worktime/](https://carolmesqu.github.io/worktime/)**

O **WorkTime** é um Progressive Web App (PWA) desenvolvido sob o modelo de Single Page Application (SPA), projetado para oferecer um gerenciamento inteligente, dinâmico e totalmente personalizado de horas de trabalho e atendimentos de forma isolada por usuário.

---

## 🎯 O Intuito do Projeto

O grande propósito por trás do WorkTime é atuar como uma ferramenta de **conferência transparente e auditoria pessoal** contra a folha de ponto de empresas. 

O projeto nasceu com o objetivo inicial focado em permitir que o usuário configure seu modelo de ganho (seja para calcular o valor financeiro estimado de horas extras a receber no mês ou para gerenciar o acúmulo de banco de horas para compensação posterior). Com isso, o usuário tem o controle total na palma da mão para validar se a empresa está realizando os pagamentos e computando as horas de forma 100% correta no fim do mês.

Além disso, o app evoluiu para incluir **gestão de atendimentos**, permitindo organizar e acompanhar atendimentos em aberto e finalizados com registro de datas.

---

## 🚀 Funcionalidades Principais

### 📊 Controle de Horas
* **Autenticação Segura (Firebase Auth):** Login unificado via Google, garantindo que o ambiente seja seguro e privado.
* **Privacidade de Dados por Usuário:** O sistema vincula as marcações ao e-mail do usuário ativo; usuários externos que acessarem o app não têm visibilidade sobre os dados da sua planilha.
* **Dashboard Dinâmico e Customizável:** 
  * Exibe o total acumulado do período selecionado.
  * Altera dinamicamente as métricas com base nas configurações do perfil (Modo *Hora Extra Paga em Dinheiro* com cálculo de valor por hora ou Modo *Banco de Horas*).
* **Histórico com Filtro de Período:** Listagem em tempo real dos lançamentos estruturados por mês e ano através de um seletor de período persistente entre telas.
* **Lançamento Manual de Pontos:** Interface intuitiva para registrar data, duração e local das horas trabalhadas.

### 📋 Gestão de Atendimentos
* **Criar Atendimentos:** Registre atendimentos com título e descrição opcional.
* **Controle de Status:** Visualize atendimentos em aberto e finalizados separadamente.
* **Registro de Datas:** Acompanhe data de início e finalização de cada atendimento.
* **Filtro por Período:** Organize atendimentos por mês para melhor visualização.
* **Sincronização Automática:** Dados salvos automaticamente no Google Sheets.

### ⚙️ Configurações Personalizadas
* **Perfil do Usuário:** Configure seu tipo de controle (Dinheiro ou Banco de Horas).
* **Valor da Hora Extra:** Defina quanto vale sua hora extra para cálculos automáticos.
* **Persistência de Preferências:** Configurações salvas por usuário.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Gradientes Modernos, Backdrop Blur, Animações) e JavaScript Moderno (ES6+ Vanilla).
* **Arquitetura:** Single Page Application (SPA) com roteamento dinâmico baseado em estado global.
* **Backend como Serviço (BaaS):** Firebase Authentication (Login com Google).
* **Banco de Dados & API:** Google Sheets, Google Apps Script (MimeType JavaScript/JSONP, no-cors mode).
* **Hospedagem:** GitHub Pages - [https://carolmesqu.github.io/worktime/](https://carolmesqu.github.io/worktime/)
* **PWA:** Service Workers para funcionamento offline e instalação nativa.

---

## 🎨 Design & Interface

* **UI Moderna:** Interface com gradientes vibrantes (roxo/azul), sombras coloridas e animações suaves.
* **Tema Claro:** Fundo gradiente alegre com efeitos de profundidade.
* **Responsivo:** Otimizado para celular, tablet e desktop.
* **Experiência Nativa:** Instalável como app no dispositivo.
* **Navbar Intuitiva:** Navegação fluida entre Dashboard, Histórico, Atendimentos e Perfil.

---

## 📱 Estrutura de Páginas

1. **Login** - Tela de autenticação com Google
2. **Dashboard** - Visão geral das horas do período com métricas dinâmicas
3. **Histórico** - Lista detalhada de todos os lançamentos de horas
4. **Atendimentos** - Gerenciamento de atendimentos em aberto e finalizados
5. **Perfil** - Configurações do usuário e preferências

---

## ⚙️ Como o projeto foi blindado (Segurança)

Embora as chaves estruturais de inicialização do Firebase (`apiKey`, `authDomain`) e a URL do Apps Script estejam visíveis no repositório público para viabilizar a hospedagem no GitHub Pages, o sistema é protegido por duas barreiras rígidas:

1. **Regras de Negócio no Servidor:** O script do Google filtra os registros na nuvem estritamente combinando o e-mail autenticado com a coluna de dados da planilha. Se um e-mail não cadastrado requisitar os dados, a API retorna uma lista vazia.
2. **Políticas de Origem:** A comunicação é blindada para responder apenas às requisições autenticadas pelo fluxo interno do app.
3. **Isolamento por Usuário:** Cada usuário só acessa seus próprios dados através do filtro por e-mail no backend.

---

## 🗂️ Estrutura do Google Sheets

O app utiliza duas abas na planilha:

### Aba "Pontos"
| Coluna | Descrição |
|--------|-----------|
| Data | Data do lançamento |
| Duração | Quantidade de horas (formato 00:00) |
| Local | Descrição/Local do trabalho |
| Usuario | E-mail do usuário (filtro de segurança) |

### Aba "Atendimentos"
| Coluna | Descrição |
|--------|-----------|
| ID | Identificador único |
| Titulo | Nome do atendimento |
| Descricao | Detalhes opcionais |
| DataInicio | Data/hora de criação |
| Finalizado | Status (true/false) |
| DataFim | Data/hora de finalização |
| Usuario | E-mail do usuário (filtro de segurança) |

---

## 🚀 Acesse o App

**Link do app:** [https://carolmesqu.github.io/worktime/](https://carolmesqu.github.io/worktime/)

---

## 📄 Licença

Projeto desenvolvido para uso pessoal e auditoria de horas trabalhadas.
