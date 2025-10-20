# LicitaFácil Platform

LicitaFácil é um sistema de gestão de licitações desenvolvido especificamente para MEI (Microempreendedores Individuais), Micro e Pequenas Empresas, oferecendo funcionalidades completas para gerenciamento de documentos, acompanhamento de licitações e controle de prazos.

## 🚀 Funcionalidades

- ✅ Cadastro e gestão de dados da empresa
- 📄 Gerenciamento de documentos com controle de validade
- 🏢 Acompanhamento de licitações
- 📊 Dashboard com indicadores importantes
- ⏰ Sistema de alertas para documentos e prazos

## 🛠️ Tecnologias

- **Frontend**: React 18 + Vite + Tailwind CSS + Shadcn/UI
- **Backend**: Python Flask + SQLite
- **Deploy**: Vercel (Frontend e Backend)

## 📋 Pré-requisitos

- Node.js 16+ 
- Python 3.9+
- Git

## 🔧 Instalação e Execução

### Frontend

1. Clone o repositório:
   ```bash
   git clone https://github.com/meuservicoonline/licita-online-platform.git
   cd licita-online-platform
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Execute o projeto em modo desenvolvimento:
   ```bash
   npm run dev
   ```

O frontend estará disponível em `http://localhost:3000`

### Backend

1. Crie e ative um ambiente virtual Python:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate  # Windows
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o servidor Flask:
   ```bash
   python -m flask run
   ```

O backend estará disponível em `http://localhost:5000`

## 🔧 Desenvolvimento com GitHub Codespaces

1. Abra o projeto no Codespaces
2. O ambiente será configurado automaticamente
3. Execute o frontend:
   ```bash
   npm run dev
   ```
4. Em outro terminal, execute o backend:
   ```bash
   python -m flask run
   ```

## 📦 Estrutura do Projeto

```
licita-online-platform/
├── api/                    # Backend Flask
│   ├── models/            # Modelos de dados
│   ├── routes/            # Rotas da API
│   └── main.py           # Configuração principal
├── src/                   # Frontend React
│   ├── components/       # Componentes React
│   ├── lib/             # Utilitários
│   └── App.jsx          # Componente principal
└── README.md
```

## 🌐 Deployment

O projeto está configurado para deploy automático na Vercel:

1. Frontend: Deploy automático a partir da branch main
2. Backend: Serverless Functions da Vercel

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.