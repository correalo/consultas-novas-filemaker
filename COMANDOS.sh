#!/bin/bash

# Script de inicialização rápida
# Execute: chmod +x COMANDOS.sh && ./COMANDOS.sh

echo "🚀 Configurando aplicação de gerenciamento de pacientes..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo -e "${BLUE}Verificando Node.js...${NC}"
if command_exists node; then
    echo -e "${GREEN}✓ Node.js $(node -v) instalado${NC}"
else
    echo -e "${YELLOW}✗ Node.js não encontrado. Instale em https://nodejs.org/${NC}"
    exit 1
fi

# Verificar MongoDB
echo -e "${BLUE}Verificando MongoDB...${NC}"
if command_exists mongosh || command_exists mongo; then
    echo -e "${GREEN}✓ MongoDB instalado${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB não encontrado. Certifique-se de que está instalado e rodando.${NC}"
fi

echo ""
echo -e "${BLUE}=== Configurando Backend ===${NC}"
cd backend

# Instalar dependências do backend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do backend..."
    npm install
else
    echo -e "${GREEN}✓ Dependências do backend já instaladas${NC}"
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    echo "Criando arquivo .env..."
    cp .env.example .env
    echo -e "${YELLOW}⚠ Configure o arquivo backend/.env com suas credenciais do MongoDB${NC}"
else
    echo -e "${GREEN}✓ Arquivo .env já existe${NC}"
fi

cd ..

echo ""
echo -e "${BLUE}=== Configurando Frontend ===${NC}"
cd frontend

# Instalar dependências do frontend
if [ ! -d "node_modules" ]; then
    echo "Instalando dependências do frontend..."
    npm install
else
    echo -e "${GREEN}✓ Dependências do frontend já instaladas${NC}"
fi

# Criar arquivo .env.local se não existir
if [ ! -f ".env.local" ]; then
    echo "Criando arquivo .env.local..."
    cp .env.local.example .env.local
    echo -e "${GREEN}✓ Arquivo .env.local criado${NC}"
else
    echo -e "${GREEN}✓ Arquivo .env.local já existe${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Configuração concluída!${NC}"
echo ""
echo -e "${BLUE}Para iniciar a aplicação:${NC}"
echo ""
echo "Terminal 1 (Backend):"
echo -e "${YELLOW}  cd backend && npm run start:dev${NC}"
echo ""
echo "Terminal 2 (Frontend):"
echo -e "${YELLOW}  cd frontend && npm run dev${NC}"
echo ""
echo "Depois acesse: http://localhost:3000"
echo ""
echo -e "${BLUE}📚 Documentação:${NC}"
echo "  - INICIO-RAPIDO.md - Guia de 5 minutos"
echo "  - CONEXAO-BANCO-EXISTENTE.md - Configuração do banco"
echo "  - SETUP.md - Guia completo"
echo ""
