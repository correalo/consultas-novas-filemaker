# 🚀 Início Rápido

## Seu banco de dados já existe! Vamos conectar em 5 minutos.

### Passo 1: Instalar Dependências

```bash
# Backend
cd backend
npm install

# Frontend (em outro terminal)
cd frontend
npm install
```

### Passo 2: Configurar Backend

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e configure:

```env
# Sua conexão MongoDB existente
MONGODB_URI=mongodb://localhost:27017/consultas_db

# Gere uma chave secreta (pode ser qualquer string longa)
JWT_SECRET=minha_chave_super_secreta_123456789

JWT_EXPIRATION=7d
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Passo 3: Configurar Frontend

```bash
cd frontend
cp .env.local.example .env.local
```

O arquivo `.env.local` já vem configurado:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Passo 4: Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

Aguarde ver: `🚀 Backend running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Aguarde ver: `Ready - started server on 0.0.0.0:3000`

### Passo 5: Acessar

1. Abra o navegador em: **http://localhost:3000**
2. Clique em **"Registrar"**
3. Crie sua conta
4. Pronto! Seus pacientes do banco existente aparecerão! 🎉

---

## 📱 Usando a Interface

### Navegação entre Pacientes
- Use as **setas** ou clique nos **indicadores** na parte inferior
- Deslize com o mouse ou toque (em dispositivos móveis)

### Buscar Pacientes
- Use a barra de busca no topo
- Busque por: nome, CPF ou email

### Atualizar Lista
- Clique no botão **"Atualizar"** para recarregar os dados

---

## ❓ Problemas?

### MongoDB não conecta?
```bash
# Verifique se está rodando
mongosh

# Se não estiver, inicie:
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Porta 3001 ou 3000 já em uso?
```bash
# Encontre o processo
lsof -i :3001
lsof -i :3000

# Mate o processo
kill -9 PID
```

### Pacientes não aparecem?
```bash
# Verifique se há dados no banco
mongosh
use consultas_db
db['consultas-novas-filemaker'].countDocuments()
db['consultas-novas-filemaker'].find().limit(1).pretty()
```

---

## 📚 Documentação Completa

- **SETUP.md** - Guia completo de instalação
- **CONEXAO-BANCO-EXISTENTE.md** - Detalhes sobre o banco de dados
- **README.md** - Visão geral do projeto

---

## 🎨 Recursos da Interface

✅ Cards modernos e responsivos  
✅ Navegação por deslize com animações suaves  
✅ Cores suaves e design moderno  
✅ Busca em tempo real  
✅ Indicadores de status coloridos  
✅ Layout adaptável para mobile/tablet/desktop  

---

**Desenvolvido com React, TypeScript, Next.js, NestJS e MongoDB** 💙
