# 🚀 Scripts de Inicialização

Scripts para facilitar o desenvolvimento e inicialização da aplicação.

## 📋 Scripts Disponíveis

### 1. `start-all.sh` - Iniciar Todos os Serviços

Inicia automaticamente MongoDB, Backend e Frontend.

```bash
./start-all.sh
```

**O que faz:**
- ✅ Verifica se Node.js e MongoDB estão instalados
- ✅ Inicia MongoDB na porta 27017
- ✅ Instala dependências do backend (se necessário)
- ✅ Inicia backend na porta 3001
- ✅ Instala dependências do frontend (se necessário)
- ✅ Inicia frontend na porta 3000
- ✅ Mostra logs em tempo real

**Após executar:**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- MongoDB: mongodb://localhost:27017

**Logs:**
```bash
# Ver logs do backend
tail -f /tmp/backend.log

# Ver logs do frontend
tail -f /tmp/frontend.log
```

---

### 2. `stop-all.sh` - Parar Todos os Serviços

Para todos os serviços rodando.

```bash
./stop-all.sh
```

**O que faz:**
- 🛑 Para o frontend (porta 3000)
- 🛑 Para o backend (porta 3001)
- 🛑 Para o MongoDB (porta 27017)
- 🧹 Remove arquivos de log temporários

---

### 3. `COMANDOS.sh` - Configuração Inicial

Script de configuração inicial do projeto (já existente).

```bash
./COMANDOS.sh
```

**O que faz:**
- ✅ Verifica dependências do sistema
- ✅ Instala dependências do backend e frontend
- ✅ Cria arquivos .env se não existirem
- ℹ️ Mostra instruções de uso

---

## 🔧 Uso Rápido

### Primeira vez (configuração):
```bash
# 1. Configurar projeto
./COMANDOS.sh

# 2. Iniciar todos os serviços
./start-all.sh
```

### Desenvolvimento diário:
```bash
# Iniciar
./start-all.sh

# Parar quando terminar
./stop-all.sh
```

---

## 🐛 Solução de Problemas

### Porta já em uso
Se alguma porta estiver em uso, o script tentará matar o processo automaticamente.

**Verificar manualmente:**
```bash
# Ver o que está usando a porta 3000
lsof -i :3000

# Ver o que está usando a porta 3001
lsof -i :3001

# Ver o que está usando a porta 27017
lsof -i :27017

# Matar processo manualmente
kill -9 <PID>
```

### MongoDB não inicia
```bash
# macOS com Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Manual
mongod --dbpath /caminho/para/dados
```

### Backend não inicia
```bash
# Ver logs
tail -f /tmp/backend.log

# Iniciar manualmente
cd backend
npm run start:dev
```

### Frontend não inicia
```bash
# Ver logs
tail -f /tmp/frontend.log

# Iniciar manualmente
cd frontend
npm run dev
```

---

## 📝 Notas

- Os serviços rodam em **background** após o script iniciar
- Use `Ctrl+C` para sair do script (serviços continuam rodando)
- Use `./stop-all.sh` para parar todos os serviços
- Logs são salvos em `/tmp/backend.log` e `/tmp/frontend.log`

---

## 🔐 Configuração

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/consultas_db
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 📚 Documentação Adicional

- [INICIO-RAPIDO.md](INICIO-RAPIDO.md) - Guia de 5 minutos
- [SETUP.md](SETUP.md) - Guia completo de instalação
- [CONEXAO-BANCO-EXISTENTE.md](CONEXAO-BANCO-EXISTENTE.md) - Configuração do banco
- [README.md](README.md) - Visão geral do projeto
