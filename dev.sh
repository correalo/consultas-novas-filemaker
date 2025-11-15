#!/bin/bash

# Script auxiliar para gerenciar o ambiente de desenvolvimento
# Uso: ./dev.sh [start|stop|restart|status]

PROJECT_DIR="/Volumes/JOSEPH-CASA/consultas-novas-filemaker"

case "$1" in
  start)
    echo "🚀 Iniciando todos os serviços..."
    cd "$PROJECT_DIR" && ./start-all.sh
    ;;
  stop)
    echo "🛑 Parando todos os serviços..."
    cd "$PROJECT_DIR" && ./stop-all.sh
    ;;
  restart)
    echo "🔄 Reiniciando todos os serviços..."
    cd "$PROJECT_DIR" && ./stop-all.sh
    sleep 2
    cd "$PROJECT_DIR" && ./start-all.sh
    ;;
  status)
    echo "📊 Status dos serviços:"
    echo ""
    if lsof -i :27017 >/dev/null 2>&1; then
      echo "✅ MongoDB (27017) - Rodando"
    else
      echo "❌ MongoDB (27017) - Parado"
    fi
    
    if lsof -i :3001 >/dev/null 2>&1; then
      echo "✅ Backend (3001) - Rodando"
    else
      echo "❌ Backend (3001) - Parado"
    fi
    
    if lsof -i :3000 >/dev/null 2>&1; then
      echo "✅ Frontend (3000) - Rodando"
    else
      echo "❌ Frontend (3000) - Parado"
    fi
    ;;
  *)
    echo "Uso: $0 {start|stop|restart|status}"
    echo ""
    echo "Comandos:"
    echo "  start   - Inicia todos os serviços"
    echo "  stop    - Para todos os serviços"
    echo "  restart - Reinicia todos os serviços"
    echo "  status  - Mostra status dos serviços"
    exit 1
    ;;
esac