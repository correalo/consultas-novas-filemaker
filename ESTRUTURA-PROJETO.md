# 📁 Estrutura do Projeto

## Visão Geral da Arquitetura

```
consultas-novas-filemaker/
├── backend/                          # API NestJS
│   ├── src/
│   │   ├── auth/                    # Módulo de Autenticação
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── guards/              # Guards de autenticação
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── strategies/          # Estratégias Passport
│   │   │   │   └── jwt.strategy.ts
│   │   │   ├── auth.controller.ts   # Rotas de autenticação
│   │   │   ├── auth.service.ts      # Lógica de autenticação
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── patients/                # Módulo de Pacientes
│   │   │   ├── dto/
│   │   │   │   ├── create-patient.dto.ts
│   │   │   │   └── update-patient.dto.ts
│   │   │   ├── schemas/
│   │   │   │   └── patient.schema.ts    # Schema MongoDB
│   │   │   ├── patients.controller.ts   # Rotas CRUD
│   │   │   ├── patients.service.ts      # Lógica de negócio
│   │   │   └── patients.module.ts
│   │   │
│   │   ├── users/                   # Módulo de Usuários
│   │   │   ├── schemas/
│   │   │   │   └── user.schema.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   │
│   │   ├── app.module.ts            # Módulo raiz
│   │   └── main.ts                  # Entry point
│   │
│   ├── .env.example                 # Exemplo de variáveis de ambiente
│   ├── nest-cli.json                # Configuração do Nest CLI
│   ├── package.json                 # Dependências do backend
│   └── tsconfig.json                # Configuração TypeScript
│
├── frontend/                         # Aplicação Next.js
│   ├── src/
│   │   ├── app/                     # App Router (Next.js 14)
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # Dashboard principal
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Página de login/registro
│   │   │   ├── globals.css          # Estilos globais
│   │   │   ├── layout.tsx           # Layout raiz
│   │   │   └── page.tsx             # Página inicial (redirect)
│   │   │
│   │   ├── components/              # Componentes React
│   │   │   ├── Navbar.tsx           # Barra de navegação
│   │   │   ├── PatientCard.tsx      # Card individual do paciente
│   │   │   └── PatientCarousel.tsx  # Carrossel de navegação
│   │   │
│   │   ├── lib/                     # Utilitários
│   │   │   ├── api.ts               # Cliente Axios configurado
│   │   │   ├── auth.ts              # Funções de autenticação
│   │   │   └── utils.ts             # Funções auxiliares
│   │   │
│   │   ├── services/                # Serviços de API
│   │   │   ├── authService.ts       # Chamadas de autenticação
│   │   │   └── patientService.ts    # Chamadas de pacientes
│   │   │
│   │   └── types/                   # Tipos TypeScript
│   │       └── index.ts             # Interfaces e tipos
│   │
│   ├── .env.local.example           # Exemplo de variáveis de ambiente
│   ├── next.config.js               # Configuração do Next.js
│   ├── package.json                 # Dependências do frontend
│   ├── postcss.config.js            # Configuração PostCSS
│   ├── tailwind.config.ts           # Configuração Tailwind
│   └── tsconfig.json                # Configuração TypeScript
│
├── .gitignore                       # Arquivos ignorados pelo Git
├── COMANDOS.sh                      # Script de setup automático
├── CONEXAO-BANCO-EXISTENTE.md      # Guia de conexão ao banco
├── ESTRUTURA-PROJETO.md            # Este arquivo
├── INICIO-RAPIDO.md                # Guia rápido de 5 minutos
├── README.md                        # Documentação principal
└── SETUP.md                         # Guia completo de instalação
```

## 🔧 Tecnologias por Camada

### Backend (NestJS)
- **Framework:** NestJS 10.x
- **Linguagem:** TypeScript
- **Banco de Dados:** MongoDB com Mongoose
- **Autenticação:** JWT com Passport
- **Validação:** class-validator, class-transformer
- **Segurança:** bcrypt para hash de senhas

### Frontend (Next.js)
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **UI:** React 18
- **Estilização:** Tailwind CSS
- **Animações:** Framer Motion
- **Ícones:** Lucide React
- **HTTP Client:** Axios
- **Gerenciamento de Estado:** Cookies (js-cookie)

## 📊 Fluxo de Dados

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────────┐
│   Next.js       │
│   Frontend      │
│   (Port 3000)   │
└──────┬──────────┘
       │
       │ API Calls (Axios)
       │ JWT Token
       │
┌──────▼──────────┐
│   NestJS        │
│   Backend       │
│   (Port 3001)   │
└──────┬──────────┘
       │
       │ Mongoose ODM
       │
┌──────▼──────────┐
│   MongoDB       │
│   Database      │
│   consultas_db  │
└─────────────────┘
```

## 🔐 Fluxo de Autenticação

```
1. Usuário faz login/registro
   ↓
2. Backend valida credenciais
   ↓
3. Backend gera JWT token
   ↓
4. Frontend armazena token em cookie
   ↓
5. Requisições incluem token no header
   ↓
6. Backend valida token via JWT Strategy
   ↓
7. Acesso concedido aos recursos protegidos
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/profile` - Perfil do usuário (protegido)

### Pacientes
- `GET /api/patients` - Listar todos os pacientes
- `GET /api/patients?search=termo` - Buscar pacientes
- `GET /api/patients/:id` - Buscar paciente por ID
- `POST /api/patients` - Criar novo paciente
- `PATCH /api/patients/:id` - Atualizar paciente
- `DELETE /api/patients/:id` - Deletar paciente

*Todas as rotas de pacientes requerem autenticação JWT*

## 🎨 Componentes Principais

### PatientCard
Exibe informações detalhadas de um paciente em formato de card moderno com:
- Informações pessoais (nome, idade, CPF)
- Contatos (telefone, email)
- Dados da consulta (data, médico, especialidade)
- Status visual com cores
- Layout responsivo

### PatientCarousel
Gerencia a navegação entre pacientes com:
- Animações de transição suaves (Framer Motion)
- Botões de navegação anterior/próximo
- Indicadores de posição
- Suporte a gestos de swipe
- Contador de pacientes

### Navbar
Barra de navegação com:
- Logo e título da aplicação
- Informações do usuário logado
- Botão de logout
- Design responsivo

## 🗄️ Schema do MongoDB

### Collection: consultas-novas-filemaker

```typescript
{
  _id: ObjectId,              // Gerado automaticamente
  nome: String,               // Obrigatório
  idade: Number,              // Opcional
  telefone: String,           // Opcional
  email: String,              // Opcional
  cpf: String,                // Opcional
  endereco: String,           // Opcional
  dataConsulta: Date,         // Opcional
  status: String,             // Opcional (default: 'agendado')
  observacoes: String,        // Opcional
  convenio: String,           // Opcional
  especialidade: String,      // Opcional
  medico: String,             // Opcional
  createdAt: Date,            // Automático (Mongoose)
  updatedAt: Date             // Automático (Mongoose)
}
```

### Collection: users

```typescript
{
  _id: ObjectId,
  email: String,              // Único, obrigatório
  password: String,           // Hash bcrypt, obrigatório
  name: String,               // Obrigatório
  role: String,               // Default: 'user'
  isActive: Boolean,          // Default: true
  createdAt: Date,
  updatedAt: Date
}
```

## 🎯 Funcionalidades Implementadas

### ✅ Backend
- [x] Autenticação JWT completa
- [x] CRUD completo de pacientes
- [x] Validação de dados
- [x] Tratamento de erros
- [x] CORS configurado
- [x] Conexão com MongoDB existente
- [x] Busca de pacientes
- [x] Guards de proteção de rotas

### ✅ Frontend
- [x] Interface moderna e responsiva
- [x] Sistema de login/registro
- [x] Dashboard com cards deslizantes
- [x] Animações suaves
- [x] Busca de pacientes
- [x] Gerenciamento de autenticação
- [x] Tratamento de erros
- [x] Loading states
- [x] Design com cores suaves

## 🚀 Próximas Melhorias Sugeridas

### Backend
- [ ] Paginação de resultados
- [ ] Filtros avançados
- [ ] Upload de arquivos/documentos
- [ ] Logs estruturados
- [ ] Testes unitários e E2E
- [ ] Rate limiting
- [ ] Refresh tokens

### Frontend
- [ ] Formulário de criação/edição de pacientes
- [ ] Modal de confirmação para ações
- [ ] Exportação de dados (PDF, Excel)
- [ ] Gráficos e estatísticas
- [ ] Notificações toast
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Testes com Jest/React Testing Library

## 📝 Convenções de Código

### Backend
- Usar decorators do NestJS
- DTOs para validação de entrada
- Services para lógica de negócio
- Controllers apenas para roteamento
- Schemas do Mongoose para modelos

### Frontend
- Componentes funcionais com hooks
- TypeScript strict mode
- Tailwind para estilização
- Framer Motion para animações
- Nomenclatura clara e descritiva

## 🔒 Segurança

- Senhas hasheadas com bcrypt (salt rounds: 10)
- JWT com expiração configurável
- CORS restrito ao frontend
- Validação de entrada em todas as rotas
- Guards de autenticação em rotas protegidas
- Tokens armazenados em cookies httpOnly (recomendado para produção)

## 📦 Dependências Principais

### Backend
```json
{
  "@nestjs/common": "^10.3.0",
  "@nestjs/mongoose": "^10.0.2",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/passport": "^10.0.3",
  "mongoose": "^8.0.3",
  "bcrypt": "^5.1.1"
}
```

### Frontend
```json
{
  "next": "14.0.4",
  "react": "^18.2.0",
  "typescript": "^5.3.3",
  "tailwindcss": "^3.4.0",
  "framer-motion": "^10.18.0",
  "axios": "^1.6.5"
}
```
