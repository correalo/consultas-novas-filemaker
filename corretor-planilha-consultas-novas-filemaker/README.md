# Importador de Consultas Excel para MongoDB

Este projeto importa dados da planilha `consultas-novas-filemaker.xlsx` para um banco de dados MongoDB usando Node.js.

## 📋 Pré-requisitos

1. **Node.js 14+** instalado
2. **MongoDB** instalado e rodando localmente (ou acesso a um servidor MongoDB)
3. **npm** (gerenciador de pacotes Node.js)

## 🚀 Instalação

### 1. Instalar MongoDB (se ainda não tiver)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

**Windows:**
Baixe e instale de: https://www.mongodb.com/try/download/community

### 2. Instalar dependências Node.js

```bash
npm install
```

## 📊 Como Usar

### Importação Básica

Execute o script no mesmo diretório da planilha Excel:

```bash
node import-to-mongodb.js
```

Ou use o npm:

```bash
npm start
```

### Configurações Personalizadas

O script usa as seguintes configurações padrão:
- **Arquivo Excel:** `consultas-novas-filemaker.xlsx`
- **String de Conexão:** `mongodb://localhost:27017/`
- **Banco de Dados:** `consultas_db`
- **Coleção:** `consultas-novas-filemaker`

Para usar um servidor MongoDB remoto, defina a variável de ambiente:

```bash
export MONGODB_URI="mongodb://usuario:senha@host:porta/"
node import-to-mongodb.js
```

## 🔍 Verificar os Dados Importados

### Usando mongosh (MongoDB Shell)

```bash
# Conectar ao banco
mongosh consultas_db

# Ver primeiros 5 documentos
db['consultas-novas-filemaker'].find().limit(5)

# Contar documentos
db['consultas-novas-filemaker'].countDocuments()

# Ver estrutura de um documento
db['consultas-novas-filemaker'].findOne()
```

### Usando Node.js

```javascript
const { MongoClient } = require('mongodb');

async function viewData() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  
  const db = client.db('consultas_db');
  const collection = db.collection('consultas-novas-filemaker');
  
  // Contar documentos
  const count = await collection.countDocuments();
  console.log(`Total de documentos: ${count}`);
  
  // Ver primeiros 5 documentos
  const docs = await collection.find().limit(5).toArray();
  console.log(docs);
  
  await client.close();
}

viewData();
```

## 📁 Estrutura dos Arquivos

```
.
├── consultas-novas-filemaker.xlsx  # Planilha Excel com os dados
├── import-to-mongodb.js            # Script de importação Node.js
├── package.json                    # Dependências Node.js
└── README.md                       # Este arquivo
```

## ⚙️ Funcionalidades

- ✅ Lê automaticamente todas as colunas da planilha Excel
- ✅ Converte tipos de dados apropriadamente (datas, números, texto)
- ✅ Trata valores vazios (NaN) como `null` no MongoDB
- ✅ Adiciona timestamp de importação (`_imported_at`) em cada documento
- ✅ Pergunta antes de sobrescrever dados existentes
- ✅ Cria índices para melhor performance
- ✅ Exibe progresso e estatísticas da importação

## 🔧 Solução de Problemas

### Erro: "Cannot find module 'xlsx'"

```bash
npm install
```

### Erro: "Connection refused" ao conectar ao MongoDB
- Verifique se o MongoDB está rodando: `brew services list` (macOS) ou `sudo systemctl status mongodb` (Linux)
- Inicie o MongoDB: `brew services start mongodb-community` (macOS) ou `sudo systemctl start mongodb` (Linux)

### Erro: "File not found"
- Certifique-se de executar o script no mesmo diretório da planilha Excel
- Ou forneça o caminho completo do arquivo no script

## 📝 Notas

- O script adiciona um campo `_imported_at` com a data/hora da importação
- Por padrão, o script pergunta se deseja limpar dados existentes antes de importar
- Os índices são criados automaticamente para melhorar a performance de consultas

## 🤝 Suporte

Para problemas ou dúvidas, verifique:
- Documentação do MongoDB: <https://docs.mongodb.com/>
- Documentação do MongoDB Node.js Driver: <https://mongodb.github.io/node-mongodb-native/>
- Documentação do SheetJS (xlsx): <https://docs.sheetjs.com/>
