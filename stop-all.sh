#!/bin/bash

# Script para parar todos os serviços (MongoDB, Backend e Frontend)
# Execute: chmod +x stop-all.sh && ./stop-all.sh

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

echo -e "${BLUE}🛑 Parando todos os serviços...${NC}"
echo ""

# 1. Parar Frontend (porta 3000)
echo -e "${BLUE}Parando Frontend...${NC}"
if port_in_use 3000; then
    lsof -ti:3000 | xargs kill -9 2>/dev/null
    sleep 1
    if port_in_use 3000; then
        echo -e "${RED}✗ Falha ao parar Frontend${NC}"
    else
        echo -e "${GREEN}✓ Frontend parado${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Frontend não está rodando${NC}"
fi

echo ""

# 2. Parar Backend (porta 3001)
echo -e "${BLUE}Parando Backend...${NC}"
if port_in_use 3001; then
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
    if port_in_use 3001; then
        echo -e "${RED}✗ Falha ao parar Backend${NC}"
    else
        echo -e "${GREEN}✓ Backend parado${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Backend não está rodando${NC}"
fi

echo ""

# 3. Parar MongoDB (porta 27017)
echo -e "${BLUE}Parando MongoDB...${NC}"
if port_in_use 27017; then
    if command_exists brew; then
        # macOS com Homebrew
        brew services stop mongodb-community >/dev/null 2>&1
    else
        # Linux ou outro sistema
        sudo systemctl stop mongod >/dev/null 2>&1 || mongod --shutdown >/dev/null 2>&1
    fi
    
    sleep 2
    
    if port_in_use 27017; then
        echo -e "${YELLOW}⚠ MongoDB ainda está rodando. Tentando forçar...${NC}"
        lsof -ti:27017 | xargs kill -9 2>/dev/null
        sleep 1
        if port_in_use 27017; then
            echo -e "${RED}✗ Falha ao parar MongoDB${NC}"
        else
            echo -e "${GREEN}✓ MongoDB parado${NC}"
        fi
    else
        echo -e "${GREEN}✓ MongoDB parado${NC}"
    fi
else
    echo -e "${YELLOW}⚠ MongoDB não está rodando${NC}"
fi

echo ""

# Limpar logs
if [ -f "/tmp/backend.log" ]; then
    rm /tmp/backend.log
    echo -e "${GREEN}✓ Log do backend removido${NC}"
fi

if [ -f "/tmp/frontend.log" ]; then
    rm /tmp/frontend.log
    echo -e "${GREEN}✓ Log do frontend removido${NC}"
fi

echo ""
echo -e "${GREEN}✅ Todos os serviços foram parados!${NC}"
echo ""
