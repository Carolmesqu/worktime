# ⏳ WorkTime - Controle de Horas Extras & Banco de Horas

O **WorkTime** é um Progressive Web App (PWA) desenvolvido sob o modelo de Single Page Application (SPA), projetado para oferecer um gerenciamento inteligente, dinâmico e totalmente personalizado de horas de trabalho de forma isolada por usuário.

---

## 🎯 O Intuito do Projeto

O grande propósito por trás do WorkTime é atuar como uma ferramenta de **conferência transparente e auditoria pessoal** contra a folha de ponto de empresas. 

O projeto nasceu com o objetivo inicial focado em permitir que o usuário configure seu modelo de ganho (seja para calcular o valor financeiro estimado de horas extras a receber no mês ou para gerenciar o acúmulo de banco de horas para compensação posterior). Com isso, o usuário tem o controle total na palma da mão para validar se a empresa está realizando os pagamentos e computando as horas de forma 100% correta no fim do mês.

---

## 🚀 Funcionalidades Principais

* **Autenticação Segura (Firebase Auth):** Login unificado via Google, garantindo que o ambiente seja seguro e privado.
* **Privacidade de Dados por Usuário:** O sistema vincula as marcações ao e-mail do usuário ativo; usuários externos que acessarem o app não têm visibilidade sobre os dados da sua planilha.
* **Dashboard Dinâmico e Customizável:** 
  * Exibe o total acumulado do período selecionado.
  * Altera dinamicamente as métricas com base nas configurações do perfil (Modo *Hora Extra Paga em Dinheiro* com cálculo de valor por hora ou Modo *Banco de Horas*).
* **Histórico com Filtro de Período:** Listagem em tempo real dos lançamentos estruturados por mês e ano através de um seletor de período persistente entre telas.
* **Arquitetura Nuvem (Google Sheets API):** Persistência dos dados diretamente em uma planilha do Google Sheets através do Google Apps Script com comunicação via JSONP (aniquilando problemas de CORS).
* **Experiência Nativa (PWA):** Aplicativo totalmente instalável no celular ou desktop, com carregamento rápido de interface otimizado por Service Workers.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** HTML5, CSS3 (Custom Variables/Design Responsivo) e JavaScript Moderno (ES6+ Vanilla).
* **Arquitetura:** Single Page Application (SPA) com roteamento dinâmico baseado em estado global.
* **Backend como Serviço (BaaS):** Firebase Authentication (Login com Google).
* **Banco de Dados & API:** Google Sheets, Google Apps Script (MimeType JavaScript/JSONP).
* **Hospedagem:** GitHub Pages.

---

## ⚙️ Como o projeto foi blindado (Segurança)

Embora as chaves estruturais de inicialização do Firebase (`apiKey`, `authDomain`) e a URL do Apps Script estejam visíveis no repositório público para viabilizar a hospedagem no GitHub Pages, o sistema é protegido por duas barreiras rígidas:
1. **Regras de Negócio no Servidor:** O script do Google filtra os registros na nuvem estritamente combinando o e-mail autenticado com a coluna de dados da planilha. Se um e-mail não cadastrado requisitar os dados, a API retorna uma lista vazia.
2. **Políticas de Origem:** A comunicação é blindada para responder apenas às requisições autenticadas pelo fluxo interno do app.
