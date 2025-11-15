#!/bin/bash

# Script para iniciar todos os serviços (MongoDB, Backend e Frontend)
# Execute: chmod +x start-all.sh && ./start-all.sh

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar se uma porta está em uso
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

echo -e "${BLUE}🚀 Iniciando aplicação de gerenciamento de pacientes...${NC}"
echo ""

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if command_exists node; then
    echo -e "${GREEN}✓ Node.js $(node -v) instalado${NC}"
else
    echo -e "${RED}✗ Node.js não encontrado. Instale em https://nodejs.org/${NC}"
    exit 1
fi

# Verificar MongoDB
echo -e "${BLUE}Verificando MongoDB...${NC}"
if command_exists mongod; then
    echo -e "${GREEN}✓ MongoDB instalado${NC}"
else
    echo -e "${RED}✗ MongoDB não encontrado. Instale em https://www.mongodb.com/try/download/community${NC}"
    exit 1
fi

echo ""

# 1. Iniciar MongoDB
echo -e "${BLUE}=== Iniciando MongoDB ===${NC}"
if port_in_use 27017; then
    echo -e "${GREEN}✓ MongoDB já está rodando na porta 27017${NC}"
else
    echo "Iniciando MongoDB..."
    # Tentar iniciar MongoDB em background
    if command_exists brew; then
        # macOS com Homebrew
        brew services start mongodb-community >/dev/null 2>&1 || mongod --fork --logpath /tmp/mongodb.log --dbpath /usr/local/var/mongodb >/dev/null 2>&1
    else
        # Linux ou outro sistema
        sudo systemctl start mongod >/dev/null 2>&1 || mongod --fork --logpath /tmp/mongodb.log >/dev/null 2>&1
    fi
    
    # Aguardar MongoDB iniciar
    sleep 3
    
    if port_in_use 27017; then
        echo -e "${GREEN}✓ MongoDB iniciado com sucesso${NC}"
    else
        echo -e "${RED}✗ Falha ao iniciar MongoDB. Inicie manualmente.${NC}"
        exit 1
    fi
fi

echo ""

# 2. Iniciar Backend
echo -e "${BLUE}=== Iniciando Backend ===${NC}"
cd backend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do backend..."
    npm install
fi

# Verificar se .env existe
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Arquivo .env criado. Verifique as configurações se necessário.${NC}"
fi

# Verificar se a porta 3001 está em uso
if port_in_use 3001; then
    echo -e "${YELLOW}⚠ Porta 3001 já está em uso. Matando processo...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo "Iniciando servidor backend na porta 3001..."
npm run start:dev > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Aguardar backend iniciar
sleep 5

if port_in_use 3001; then
    echo -e "${GREEN}✓ Backend iniciado com sucesso (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}✗ Falha ao iniciar backend. Verifique /tmp/backend.log${NC}"
    exit 1
fi

cd ..

echo ""

# 3. Iniciar Frontend
echo -e "${BLUE}=== Iniciando Frontend ===${NC}"
cd frontend

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
fi

# Verificar se .env.local existe
if [ ! -f ".env.local" ]; then
    echo "Criando arquivo .env.local..."
    cp .env.local.example .env.local
fi

# Verificar se a porta 3000 está em uso
if port_in_use 3000; then
    echo -e "${YELLOW}⚠ Porta 3000 já está em uso. Matando processo...${NC}"
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
fi

echo "Iniciando servidor frontend na porta 3000..."
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Aguardar frontend iniciar
sleep 5

if port_in_use 3000; then
    echo -e "${GREEN}✓ Frontend iniciado com sucesso (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}✗ Falha ao iniciar frontend. Verifique /tmp/frontend.log${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${GREEN}✅ Todos os serviços iniciados com sucesso!${NC}"
echo ""
echo -e "${BLUE}📊 Status dos serviços:${NC}"
echo -e "  ${GREEN}✓${NC} MongoDB:  http://localhost:27017"
echo -e "  ${GREEN}✓${NC} Backend:  http://localhost:3001"
echo -e "  ${GREEN}✓${NC} Frontend: http://localhost:3000"
echo ""
echo -e "${BLUE}🌐 Acesse a aplicação em:${NC} ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo "  Backend:  tail -f /tmp/backend.log"
echo "  Frontend: tail -f /tmp/frontend.log"
echo ""
echo -e "${BLUE}🛑 Para parar todos os serviços:${NC}"
echo "  ./stop-all.sh"
echo ""
echo -e "${YELLOW}Pressione Ctrl+C para sair (os serviços continuarão rodando)${NC}"
echo ""

# Manter o script rodando para mostrar logs
trap 'echo ""; echo "Script finalizado. Serviços continuam rodando."; exit 0' INT

# Mostrar logs em tempo real
tail -f /tmp/backend.log /tmp/frontend.log
