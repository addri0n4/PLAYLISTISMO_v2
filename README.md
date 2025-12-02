# ReadmeGenius (Vanilla JS)

**ReadmeGenius** é uma ferramenta leve construída com **JavaScript Puro (Vanilla JS)** e **Google Gemini 2.5 Flash** para gerar arquivos `README.md` profissionais instantaneamente.

## 📁 Estrutura do Projeto

O projeto foi refatorado para não depender de frameworks. A estrutura atual é:

```
/
├── index.html          # Entrada principal e UI (Tailwind CSS)
├── style.css           # Estilos globais e customizações do Markdown
├── js/
│   ├── main.js             # Ponto de entrada da lógica (Controller)
│   ├── gemini-service.js   # Integração com a API do Google Gemini
│   ├── ui-handler.js       # Manipulação do DOM e Eventos
│   ├── markdown-renderer.js # Conversor simples de Markdown para HTML
│   └── constants.js        # Configurações e textos padrão
└── metadata.json       # Metadados do projeto
```

## 🚀 Como usar

1.  Abra o arquivo `index.html` no navegador (usando um servidor local é recomendado, ex: Live Server).
2.  Preencha os detalhes do projeto no painel esquerdo.
3.  Clique em **Generate Readme**.
4.  Copie o código ou baixe o arquivo `.md`.

## 🛠️ Tecnologias

-   **JavaScript (ES6 Modules)**: Sem build step necessário.
-   **Tailwind CSS**: Estilização rápida via CDN.
-   **Google GenAI SDK**: Para comunicação com o modelo Gemini 2.5 Flash.

## ⚠️ Configuração da API

O projeto espera que a variável `process.env.API_KEY` esteja disponível ou injetada pelo ambiente de execução.

---
*Refatorado para Vanilla JS em 2025.*