# 📡 Exemplos de Uso da API

## Base URL
```
http://localhost:3001/api
```

## 🔐 Autenticação

### 1. Registrar Novo Usuário

**Endpoint:** `POST /auth/register`

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha123",
    "name": "Nome do Usuário"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456789",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

### 2. Login

**Endpoint:** `POST /auth/login`

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha123"
  }'
```

**Resposta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def456789",
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

### 3. Obter Perfil do Usuário

**Endpoint:** `GET /auth/profile`

```bash
curl -X GET http://localhost:3001/api/auth/profile \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "id": "65abc123def456789",
  "email": "usuario@email.com",
  "name": "Nome do Usuário"
}
```

---

## 👥 Pacientes

**Nota:** Todas as rotas de pacientes requerem autenticação. Inclua o header:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

### 1. Listar Todos os Pacientes

**Endpoint:** `GET /patients`

```bash
curl -X GET http://localhost:3001/api/patients \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
[
  {
    "_id": "65abc123def456789",
    "nome": "Maria Santos",
    "idade": 28,
    "telefone": "(11) 98765-4321",
    "email": "maria@email.com",
    "cpf": "123.456.789-00",
    "endereco": "Rua das Flores, 123",
    "dataConsulta": "2024-11-01T10:00:00.000Z",
    "status": "agendado",
    "observacoes": "Primeira consulta",
    "convenio": "Unimed",
    "especialidade": "Cardiologia",
    "medico": "Dr. João Silva",
    "createdAt": "2024-10-26T10:00:00.000Z",
    "updatedAt": "2024-10-26T10:00:00.000Z"
  }
]
```

### 2. Buscar Pacientes

**Endpoint:** `GET /patients?search=termo`

```bash
# Buscar por nome
curl -X GET "http://localhost:3001/api/patients?search=Maria" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Buscar por CPF
curl -X GET "http://localhost:3001/api/patients?search=123.456" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Buscar por email
curl -X GET "http://localhost:3001/api/patients?search=maria@email" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### 3. Buscar Paciente por ID

**Endpoint:** `GET /patients/:id`

```bash
curl -X GET http://localhost:3001/api/patients/65abc123def456789 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:**
```json
{
  "_id": "65abc123def456789",
  "nome": "Maria Santos",
  "idade": 28,
  "telefone": "(11) 98765-4321",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "endereco": "Rua das Flores, 123",
  "dataConsulta": "2024-11-01T10:00:00.000Z",
  "status": "agendado",
  "observacoes": "Primeira consulta",
  "convenio": "Unimed",
  "especialidade": "Cardiologia",
  "medico": "Dr. João Silva",
  "createdAt": "2024-10-26T10:00:00.000Z",
  "updatedAt": "2024-10-26T10:00:00.000Z"
}
```

### 4. Criar Novo Paciente

**Endpoint:** `POST /patients`

```bash
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "nome": "Pedro Oliveira",
    "idade": 35,
    "telefone": "(11) 91234-5678",
    "email": "pedro@email.com",
    "cpf": "987.654.321-00",
    "endereco": "Av. Paulista, 1000",
    "dataConsulta": "2024-11-05T14:00:00.000Z",
    "status": "agendado",
    "observacoes": "Paciente novo",
    "convenio": "Bradesco Saúde",
    "especialidade": "Ortopedia",
    "medico": "Dr. Carlos Santos"
  }'
```

**Campos obrigatórios:**
- `nome` (string)

**Campos opcionais:**
- `idade` (number)
- `telefone` (string)
- `email` (string)
- `cpf` (string)
- `endereco` (string)
- `dataConsulta` (ISO date string)
- `status` (string)
- `observacoes` (string)
- `convenio` (string)
- `especialidade` (string)
- `medico` (string)

**Resposta:**
```json
{
  "_id": "65xyz789abc123456",
  "nome": "Pedro Oliveira",
  "idade": 35,
  "telefone": "(11) 91234-5678",
  "email": "pedro@email.com",
  "cpf": "987.654.321-00",
  "endereco": "Av. Paulista, 1000",
  "dataConsulta": "2024-11-05T14:00:00.000Z",
  "status": "agendado",
  "observacoes": "Paciente novo",
  "convenio": "Bradesco Saúde",
  "especialidade": "Ortopedia",
  "medico": "Dr. Carlos Santos",
  "createdAt": "2024-10-26T15:00:00.000Z",
  "updatedAt": "2024-10-26T15:00:00.000Z"
}
```

### 5. Atualizar Paciente

**Endpoint:** `PATCH /patients/:id`

```bash
curl -X PATCH http://localhost:3001/api/patients/65abc123def456789 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "status": "confirmado",
    "observacoes": "Consulta confirmada pelo paciente"
  }'
```

**Nota:** Você pode enviar apenas os campos que deseja atualizar.

**Resposta:**
```json
{
  "_id": "65abc123def456789",
  "nome": "Maria Santos",
  "idade": 28,
  "telefone": "(11) 98765-4321",
  "email": "maria@email.com",
  "cpf": "123.456.789-00",
  "endereco": "Rua das Flores, 123",
  "dataConsulta": "2024-11-01T10:00:00.000Z",
  "status": "confirmado",
  "observacoes": "Consulta confirmada pelo paciente",
  "convenio": "Unimed",
  "especialidade": "Cardiologia",
  "medico": "Dr. João Silva",
  "createdAt": "2024-10-26T10:00:00.000Z",
  "updatedAt": "2024-10-26T16:00:00.000Z"
}
```

### 6. Deletar Paciente

**Endpoint:** `DELETE /patients/:id`

```bash
curl -X DELETE http://localhost:3001/api/patients/65abc123def456789 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Resposta:** Status 200 (sem corpo)

---

## 🔴 Tratamento de Erros

### Erro 400 - Bad Request
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### Erro 401 - Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

### Erro 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "Patient with ID 65abc123def456789 not found",
  "error": "Not Found"
}
```

### Erro 409 - Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## 🧪 Testando com Postman/Insomnia

### Configuração Inicial

1. **Criar uma Collection/Workspace**
2. **Configurar variável de ambiente:**
   - `base_url`: `http://localhost:3001/api`
   - `token`: (será preenchido após login)

### Fluxo de Teste

1. **Registrar/Login**
   - Copie o `access_token` da resposta
   - Salve na variável `token`

2. **Configurar Authorization**
   - Type: Bearer Token
   - Token: `{{token}}`

3. **Testar endpoints de pacientes**

---

## 📝 Exemplo Completo em JavaScript

```javascript
// Configuração
const API_URL = 'http://localhost:3001/api';
let token = '';

// 1. Login
async function login() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'usuario@email.com',
      password: 'senha123'
    })
  });
  
  const data = await response.json();
  token = data.access_token;
  return data;
}

// 2. Listar pacientes
async function getPatients() {
  const response = await fetch(`${API_URL}/patients`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  return await response.json();
}

// 3. Criar paciente
async function createPatient(patientData) {
  const response = await fetch(`${API_URL}/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(patientData)
  });
  
  return await response.json();
}

// 4. Atualizar paciente
async function updatePatient(id, updates) {
  const response = await fetch(`${API_URL}/patients/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  
  return await response.json();
}

// Uso
(async () => {
  await login();
  const patients = await getPatients();
  console.log('Pacientes:', patients);
})();
```

---

## 🐍 Exemplo em Python

```python
import requests

API_URL = 'http://localhost:3001/api'
token = ''

# 1. Login
def login():
    global token
    response = requests.post(f'{API_URL}/auth/login', json={
        'email': 'usuario@email.com',
        'password': 'senha123'
    })
    data = response.json()
    token = data['access_token']
    return data

# 2. Listar pacientes
def get_patients():
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{API_URL}/patients', headers=headers)
    return response.json()

# 3. Criar paciente
def create_patient(patient_data):
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    response = requests.post(
        f'{API_URL}/patients',
        json=patient_data,
        headers=headers
    )
    return response.json()

# Uso
login()
patients = get_patients()
print('Pacientes:', patients)
```

---

## 💡 Dicas

1. **Sempre inclua o token** nas requisições protegidas
2. **Verifique os status codes** para tratamento de erros
3. **Use variáveis de ambiente** para armazenar o token
4. **Valide os dados** antes de enviar
5. **Trate erros de rede** adequadamente
