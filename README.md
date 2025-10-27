# Sistema de Gerenciamento de Pacientes

Aplicação fullstack moderna para gerenciamento de consultas e pacientes com interface de cards deslizantes.

## 🚀 Tecnologias

### Backend
- **NestJS** - Framework Node.js progressivo
- **MongoDB** - Banco de dados NoSQL
- **JWT** - Autenticação segura
- **Mongoose** - ODM para MongoDB

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Framer Motion** - Animações suaves
- **Lucide React** - Ícones modernos

## 📁 Estrutura do Projeto

```
consultas-novas-filemaker/
├── backend/                 # API NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── patients/       # Módulo de pacientes
│   │   ├── common/         # Utilitários compartilhados
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/    # Componentes React
│   │   ├── lib/          # Utilitários
│   │   └── types/        # Tipos TypeScript
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔧 Configuração

### Pré-requisitos
- Node.js 18+
- MongoDB 6+
- npm ou yarn

### Backend

1. Navegue até a pasta backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (`.env`):
```env
MONGODB_URI=mongodb://localhost:27017/consultas_db
JWT_SECRET=seu_secret_super_seguro_aqui
JWT_EXPIRATION=7d
PORT=3001
```

4. Execute o servidor:
```bash
npm run start:dev
```

O backend estará disponível em `http://localhost:3001`

### Frontend

1. Navegue até a pasta frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## 🎯 Funcionalidades

### Autenticação
- Login com JWT
- Proteção de rotas
- Refresh token automático
- Logout seguro

### Gerenciamento de Pacientes
- Visualização em cards deslizantes
- Navegação com setas (← →)
- Suporte a gestos de swipe
- Design responsivo
- Cores suaves e modernas

### Interface
- Cards com informações do paciente
- Animações suaves de transição
- Indicador de posição
- Layout responsivo para mobile/tablet/desktop

## 🗄️ Estrutura do MongoDB

**Database:** `consultas_db`  
**Collection:** `consultas-novas-filemaker`

Estrutura de documento do paciente:
```json
{
  "_id": "ObjectId",
  "nome": "Nome do Paciente",
  "idade": 35,
  "telefone": "(11) 98765-4321",
  "email": "paciente@email.com",
  "cpf": "123.456.789-00",
  "endereco": "Rua Exemplo, 123",
  "dataConsulta": "2024-10-26T10:00:00Z",
  "status": "agendado",
  "observacoes": "Observações sobre o paciente"
}
```

## 🎨 Design

- **Cores principais:** Tons suaves de azul, verde e roxo
- **Tipografia:** Inter (sistema)
- **Espaçamento:** Sistema consistente baseado em 4px
- **Responsividade:** Mobile-first approach

## 📝 API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de novo usuário
- `GET /auth/profile` - Perfil do usuário autenticado

### Pacientes
- `GET /patients` - Lista todos os pacientes
- `GET /patients/:id` - Busca paciente por ID
- `POST /patients` - Cria novo paciente
- `PUT /patients/:id` - Atualiza paciente
- `DELETE /patients/:id` - Remove paciente

## 🔐 Segurança

- Senhas hasheadas com bcrypt
- JWT com expiração configurável
- CORS configurado
- Validação de dados com class-validator
- Guards de autenticação em rotas protegidas

## 🚀 Deploy

### Backend
- Recomendado: Railway, Render ou Heroku
- Configure as variáveis de ambiente
- MongoDB Atlas para produção

### Frontend
- Recomendado: Vercel ou Netlify
- Configure a URL da API
- Build automático do Next.js

## 📄 Licença

MIT
