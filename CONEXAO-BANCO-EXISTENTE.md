# Conectando ao Banco de Dados Existente

## 📊 Banco de Dados Existente

O projeto já possui um banco de dados MongoDB configurado:
- **Database:** `consultas_db`
- **Collection:** `consultas-novas-filemaker`

## ⚙️ Configuração Rápida

### 1. Configure o Backend para usar o banco existente

Edite o arquivo `backend/.env`:

```bash
cd backend
cp .env.example .env
nano .env  # ou use seu editor preferido
```

### 2. Configure a string de conexão

No arquivo `.env`, ajuste a variável `MONGODB_URI` para apontar para seu banco existente:

#### Se o MongoDB está rodando localmente:

```env
MONGODB_URI=mongodb://localhost:27017/consultas_db
```

#### Se o MongoDB está em outro servidor:

```env
MONGODB_URI=mongodb://HOST:PORTA/consultas_db
```

#### Se está usando MongoDB Atlas ou outro serviço cloud:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/consultas_db?retryWrites=true&w=majority
```

### 3. Outras configurações importantes

```env
# Gere uma chave secreta forte para JWT
JWT_SECRET=sua_chave_secreta_aqui_mude_em_producao

# Tempo de expiração do token (7 dias)
JWT_EXPIRATION=7d

# Porta do servidor backend
PORT=3001

# URL do frontend para CORS
CORS_ORIGIN=http://localhost:3000
```

## 🔍 Verificando a Conexão

### Teste a conexão com o MongoDB:

```bash
# Usando mongosh
mongosh "mongodb://localhost:27017/consultas_db"

# Verifique se a coleção existe
use consultas_db
db.getCollectionNames()

# Deve mostrar: [ 'consultas-novas-filemaker', ... ]

# Veja quantos documentos existem
db['consultas-novas-filemaker'].countDocuments()

# Veja alguns documentos de exemplo
db['consultas-novas-filemaker'].find().limit(2).pretty()
```

## 📋 Estrutura de Dados Esperada

O backend está configurado para trabalhar com a seguinte estrutura de documentos:

```javascript
{
  _id: ObjectId("..."),
  nome: "Nome do Paciente",           // Obrigatório
  idade: 35,                          // Opcional
  telefone: "(11) 98765-4321",       // Opcional
  email: "paciente@email.com",       // Opcional
  cpf: "123.456.789-00",             // Opcional
  endereco: "Rua Exemplo, 123",      // Opcional
  dataConsulta: ISODate("..."),      // Opcional
  status: "agendado",                // Opcional
  observacoes: "Texto livre",        // Opcional
  convenio: "Nome do Convênio",      // Opcional
  especialidade: "Especialidade",    // Opcional
  medico: "Nome do Médico",          // Opcional
  createdAt: ISODate("..."),         // Automático
  updatedAt: ISODate("...")          // Automático
}
```

### Campos Obrigatórios vs Opcionais

- **Obrigatório:** apenas `nome`
- **Opcionais:** todos os outros campos
- **Automáticos:** `createdAt` e `updatedAt` (adicionados pelo Mongoose se não existirem)

## 🚀 Iniciando a Aplicação

### 1. Instale as dependências do backend:

```bash
cd backend
npm install
```

### 2. Inicie o backend:

```bash
npm run start:dev
```

Você verá:
```
🚀 Backend running on http://localhost:3001
📚 API available at http://localhost:3001/api
```

Se a conexão com o MongoDB for bem-sucedida, o servidor iniciará normalmente.

### 3. Em outro terminal, configure e inicie o frontend:

```bash
cd frontend
npm install

# Configure o .env.local
cp .env.local.example .env.local
# O arquivo já está configurado com: NEXT_PUBLIC_API_URL=http://localhost:3001

npm run dev
```

## 🔐 Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Clique em **"Registrar"**
3. Crie sua conta de usuário
4. Após o login, você verá os pacientes do banco existente!

## 🔧 Solução de Problemas

### Erro: "MongoServerError: Authentication failed"

Seu MongoDB requer autenticação. Atualize a string de conexão:

```env
MONGODB_URI=mongodb://usuario:senha@localhost:27017/consultas_db?authSource=admin
```

### Erro: "MongooseServerSelectionError: connect ECONNREFUSED"

O MongoDB não está rodando ou não está acessível:

1. Verifique se o MongoDB está rodando:
   ```bash
   # macOS
   brew services list | grep mongodb
   
   # Linux
   sudo systemctl status mongod
   ```

2. Inicie o MongoDB se necessário:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

3. Verifique a porta e host na string de conexão

### Erro: "Collection not found"

A coleção será criada automaticamente quando você adicionar o primeiro paciente via API. Se você já tem dados no banco, verifique:

```bash
mongosh
use consultas_db
show collections
```

Se a coleção tiver um nome diferente, ajuste em `backend/src/patients/schemas/patient.schema.ts`:

```typescript
@Schema({ 
  timestamps: true,
  collection: 'nome-da-sua-colecao-aqui'  // Ajuste aqui
})
```

### Dados não aparecem no frontend

1. Verifique se há pacientes no banco:
   ```bash
   mongosh
   use consultas_db
   db['consultas-novas-filemaker'].countDocuments()
   ```

2. Verifique os logs do backend para erros

3. Abra o console do navegador (F12) e veja se há erros de API

4. Teste a API diretamente:
   ```bash
   # Faça login primeiro
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"seu@email.com","password":"suasenha"}'
   
   # Use o token para buscar pacientes
   curl http://localhost:3001/api/patients \
     -H "Authorization: Bearer SEU_TOKEN_AQUI"
   ```

## 📊 Migrando Dados do FileMaker

Se você precisa migrar dados do FileMaker para o MongoDB:

### Opção 1: Exportar do FileMaker para JSON

1. No FileMaker, exporte os dados como JSON ou CSV
2. Use um script para importar no MongoDB

### Opção 2: Script de Importação

Crie um arquivo `import-data.js`:

```javascript
// Exemplo de script de importação
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

async function importData() {
  try {
    await client.connect();
    const db = client.db('consultas_db');
    const collection = db.collection('consultas-novas-filemaker');
    
    // Seus dados aqui
    const pacientes = [
      {
        nome: "Exemplo",
        idade: 30,
        // ... outros campos
      }
    ];
    
    const result = await collection.insertMany(pacientes);
    console.log(`${result.insertedCount} pacientes importados!`);
  } finally {
    await client.close();
  }
}

importData();
```

Execute:
```bash
node import-data.js
```

## ✅ Checklist de Configuração

- [ ] MongoDB está rodando
- [ ] Arquivo `backend/.env` configurado com a string de conexão correta
- [ ] Dependências do backend instaladas (`npm install`)
- [ ] Backend iniciado sem erros (`npm run start:dev`)
- [ ] Arquivo `frontend/.env.local` configurado
- [ ] Dependências do frontend instaladas (`npm install`)
- [ ] Frontend iniciado (`npm run dev`)
- [ ] Conta de usuário criada
- [ ] Pacientes aparecem no dashboard

## 🎉 Pronto!

Agora você está usando o banco de dados existente com a nova interface moderna!
