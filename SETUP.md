# Guia de Instalação e Configuração

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** 18 ou superior ([Download](https://nodejs.org/))
- **MongoDB** 6 ou superior ([Download](https://www.mongodb.com/try/download/community))
- **npm** ou **yarn** (vem com Node.js)

## 🚀 Instalação Rápida

### 1. Clone ou navegue até o projeto

```bash
cd /Volumes/JOSEPH-CASA/consultas-novas-filemaker
```

### 2. Configure o Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.example .env

# Edite o arquivo .env com suas configurações
# Use seu editor preferido (nano, vim, code, etc.)
nano .env
```

**Configurações importantes no `.env`:**

```env
# URL do MongoDB - ajuste se necessário
MONGODB_URI=mongodb://localhost:27017/consultas_db

# Gere um secret seguro para JWT (use uma string aleatória longa)
JWT_SECRET=sua_chave_secreta_super_segura_aqui_mude_em_producao

# Tempo de expiração do token
JWT_EXPIRATION=7d

# Porta do servidor
PORT=3001

# Origem CORS (URL do frontend)
CORS_ORIGIN=http://localhost:3000
```

### 3. Configure o Frontend

```bash
# Volte para a raiz e entre na pasta frontend
cd ../frontend

# Instale as dependências
npm install

# Copie o arquivo de exemplo de variáveis de ambiente
cp .env.local.example .env.local

# Edite o arquivo .env.local
nano .env.local
```

**Configurações no `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 🗄️ Configuração do MongoDB

### Opção 1: MongoDB Local

1. Inicie o MongoDB:

```bash
# macOS (com Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Inicie o serviço MongoDB pelo Painel de Serviços
```

2. Verifique se está rodando:

```bash
mongosh
# Deve conectar ao MongoDB
```

### Opção 2: MongoDB Atlas (Cloud)

1. Crie uma conta gratuita em [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure o acesso de rede (adicione seu IP ou 0.0.0.0/0 para desenvolvimento)
4. Crie um usuário de banco de dados
5. Obtenha a string de conexão e atualize no `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/consultas_db?retryWrites=true&w=majority
```

### Estrutura do Banco de Dados

O banco de dados `consultas_db` será criado automaticamente. A coleção `consultas-novas-filemaker` será usada para armazenar os pacientes.

**Exemplo de documento:**

```json
{
  "_id": "ObjectId",
  "nome": "João Silva",
  "idade": 35,
  "telefone": "(11) 98765-4321",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "endereco": "Rua Exemplo, 123 - São Paulo, SP",
  "dataConsulta": "2024-10-30T14:00:00.000Z",
  "status": "agendado",
  "observacoes": "Paciente com histórico de hipertensão",
  "convenio": "Unimed",
  "especialidade": "Cardiologia",
  "medico": "Dr. Carlos Santos",
  "createdAt": "2024-10-26T10:00:00.000Z",
  "updatedAt": "2024-10-26T10:00:00.000Z"
}
```

## ▶️ Executando a Aplicação

### Iniciar o Backend

```bash
# Na pasta backend
cd backend
npm run start:dev
```

O backend estará rodando em `http://localhost:3001`

Você verá:
```
🚀 Backend running on http://localhost:3001
📚 API available at http://localhost:3001/api
```

### Iniciar o Frontend

Em outro terminal:

```bash
# Na pasta frontend
cd frontend
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 👤 Primeiro Acesso

1. Abra o navegador em `http://localhost:3000`
2. Clique em "Registrar"
3. Crie sua conta com:
   - Nome completo
   - Email
   - Senha (mínimo 6 caracteres)
4. Após o registro, você será redirecionado ao dashboard

## 📊 Populando o Banco de Dados

### Opção 1: Via MongoDB Shell

```bash
mongosh

use consultas_db

db['consultas-novas-filemaker'].insertMany([
  {
    nome: "Maria Santos",
    idade: 28,
    telefone: "(11) 98765-4321",
    email: "maria@email.com",
    cpf: "123.456.789-00",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    dataConsulta: new Date("2024-11-01T10:00:00"),
    status: "agendado",
    observacoes: "Primeira consulta",
    convenio: "Unimed",
    especialidade: "Clínico Geral",
    medico: "Dr. João Silva"
  },
  {
    nome: "Pedro Oliveira",
    idade: 45,
    telefone: "(11) 91234-5678",
    email: "pedro@email.com",
    cpf: "987.654.321-00",
    endereco: "Av. Paulista, 1000 - São Paulo, SP",
    dataConsulta: new Date("2024-11-02T14:00:00"),
    status: "confirmado",
    observacoes: "Retorno",
    convenio: "Bradesco Saúde",
    especialidade: "Cardiologia",
    medico: "Dr. Carlos Santos"
  }
])
```

### Opção 2: Via API (após criar conta)

Use ferramentas como Postman, Insomnia ou curl:

```bash
# Primeiro faça login para obter o token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"suasenha"}'

# Use o token retornado para criar pacientes
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Ana Costa",
    "idade": 32,
    "telefone": "(11) 99999-8888",
    "email": "ana@email.com",
    "cpf": "111.222.333-44",
    "endereco": "Rua ABC, 456",
    "dataConsulta": "2024-11-05T09:00:00",
    "status": "agendado",
    "especialidade": "Dermatologia"
  }'
```

## 🔧 Solução de Problemas

### Backend não inicia

- Verifique se o MongoDB está rodando
- Confirme as variáveis de ambiente no `.env`
- Verifique se a porta 3001 está disponível

### Frontend não conecta ao backend

- Confirme que o backend está rodando
- Verifique a URL no `.env.local`
- Limpe o cache do navegador

### Erro de autenticação

- Verifique se o JWT_SECRET está configurado
- Limpe os cookies do navegador
- Tente fazer logout e login novamente

### MongoDB não conecta

- Verifique se o serviço está rodando: `mongosh`
- Confirme a string de conexão no `.env`
- Para MongoDB Atlas, verifique as configurações de rede

## 📝 Scripts Úteis

### Backend

```bash
npm run start:dev    # Modo desenvolvimento com hot-reload
npm run build        # Build para produção
npm run start:prod   # Executar build de produção
npm run lint         # Verificar código
```

### Frontend

```bash
npm run dev          # Modo desenvolvimento
npm run build        # Build para produção
npm run start        # Executar build de produção
npm run lint         # Verificar código
```

## 🎨 Personalização

### Cores

Edite `frontend/tailwind.config.ts` para alterar o esquema de cores:

```typescript
colors: {
  primary: { /* suas cores */ },
  secondary: { /* suas cores */ },
}
```

### Logo e Título

Edite `frontend/src/app/layout.tsx` para alterar metadados.

## 📚 Próximos Passos

- Explore a API em `http://localhost:3001/api`
- Adicione mais pacientes
- Customize as cores e layout
- Implemente funcionalidades adicionais

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verifique os logs do console
2. Revise as configurações de ambiente
3. Consulte a documentação do MongoDB, NestJS e Next.js
