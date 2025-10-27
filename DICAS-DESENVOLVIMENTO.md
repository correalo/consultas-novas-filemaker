# 💡 Dicas de Desenvolvimento

## 🔥 Atalhos e Comandos Úteis

### Backend (NestJS)

```bash
# Desenvolvimento com hot-reload
npm run start:dev

# Build para produção
npm run build

# Executar produção
npm run start:prod

# Verificar código
npm run lint

# Gerar novo módulo
nest g module nome-modulo

# Gerar novo controller
nest g controller nome-controller

# Gerar novo service
nest g service nome-service
```

### Frontend (Next.js)

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm run start

# Verificar código
npm run lint

# Limpar cache do Next.js
rm -rf .next
```

---

## 🐛 Debug e Logs

### Backend

Adicione logs para debug:

```typescript
// Em qualquer service ou controller
import { Logger } from '@nestjs/common';

export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  async findAll() {
    this.logger.log('Buscando todos os pacientes');
    // seu código
  }
}
```

### Frontend

Use o console do navegador:

```typescript
// Em qualquer componente
console.log('Dados:', data);
console.error('Erro:', error);
console.table(patients); // Visualização em tabela
```

---

## 🔍 Testando a API

### Com curl

```bash
# Salve o token em uma variável
TOKEN="seu_token_aqui"

# Teste endpoints
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/patients
```

### Com Postman/Insomnia

1. Crie uma collection
2. Configure variável `{{token}}`
3. Use Bearer Token authentication
4. Importe os exemplos de `EXEMPLOS-API.md`

---

## 📊 Monitorando o MongoDB

### Via mongosh

```bash
# Conectar
mongosh "mongodb://localhost:27017/consultas_db"

# Ver coleções
show collections

# Contar documentos
db['consultas-novas-filemaker'].countDocuments()

# Ver últimos documentos
db['consultas-novas-filemaker'].find().sort({_id: -1}).limit(5)

# Buscar por campo
db['consultas-novas-filemaker'].find({nome: /Maria/i})

# Ver índices
db['consultas-novas-filemaker'].getIndexes()
```

### MongoDB Compass (GUI)

1. Baixe em: https://www.mongodb.com/products/compass
2. Conecte com: `mongodb://localhost:27017`
3. Navegue visualmente pelo banco

---

## 🎨 Personalizando o Frontend

### Alterar Cores

Edite `frontend/tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#sua-cor',
    // ... até 900
  },
}
```

### Adicionar Novo Componente

```bash
cd frontend/src/components
```

Crie `MeuComponente.tsx`:

```typescript
'use client';

export default function MeuComponente() {
  return (
    <div className="p-4">
      Meu componente
    </div>
  );
}
```

Use em qualquer página:

```typescript
import MeuComponente from '@/components/MeuComponente';

export default function Page() {
  return <MeuComponente />;
}
```

---

## 🔐 Adicionando Novos Endpoints

### Backend

1. **Adicione método no service:**

```typescript
// patients.service.ts
async findByStatus(status: string): Promise<Patient[]> {
  return this.patientModel.find({ status }).exec();
}
```

2. **Adicione rota no controller:**

```typescript
// patients.controller.ts
@Get('status/:status')
findByStatus(@Param('status') status: string) {
  return this.patientsService.findByStatus(status);
}
```

### Frontend

1. **Adicione função no service:**

```typescript
// patientService.ts
async getByStatus(status: string): Promise<Patient[]> {
  const response = await api.get<Patient[]>(`/patients/status/${status}`);
  return response.data;
}
```

2. **Use no componente:**

```typescript
const patients = await patientService.getByStatus('agendado');
```

---

## 🚀 Melhorias Sugeridas

### Backend

#### 1. Adicionar Paginação

```typescript
// patients.controller.ts
@Get()
async findAll(
  @Query('page') page: number = 1,
  @Query('limit') limit: number = 10,
) {
  return this.patientsService.findAll(page, limit);
}

// patients.service.ts
async findAll(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    this.patientModel.find().skip(skip).limit(limit).exec(),
    this.patientModel.countDocuments(),
  ]);
  
  return {
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
```

#### 2. Adicionar Filtros

```typescript
@Get()
async findAll(
  @Query('status') status?: string,
  @Query('especialidade') especialidade?: string,
) {
  const filters: any = {};
  if (status) filters.status = status;
  if (especialidade) filters.especialidade = especialidade;
  
  return this.patientModel.find(filters).exec();
}
```

#### 3. Upload de Arquivos

```bash
npm install @nestjs/platform-express multer
npm install -D @types/multer
```

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```

### Frontend

#### 1. Adicionar Modal

```typescript
'use client';

import { useState } from 'react';

export default function PatientModal({ patient, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-4">{patient.nome}</h2>
        {/* Conteúdo do modal */}
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Fechar
        </button>
      </div>
    </div>
  );
}
```

#### 2. Adicionar Notificações Toast

```bash
npm install react-hot-toast
```

```typescript
import toast, { Toaster } from 'react-hot-toast';

// No layout
<Toaster position="top-right" />

// Uso
toast.success('Paciente salvo!');
toast.error('Erro ao salvar');
```

#### 3. Adicionar Loading Skeleton

```typescript
export default function PatientSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
  );
}
```

---

## 🧪 Adicionando Testes

### Backend (Jest)

```bash
npm install --save-dev @nestjs/testing
```

```typescript
// patients.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';

describe('PatientsService', () => {
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsService],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### Frontend (Jest + React Testing Library)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

```typescript
// PatientCard.test.tsx
import { render, screen } from '@testing-library/react';
import PatientCard from './PatientCard';

test('renders patient name', () => {
  const patient = { nome: 'João Silva', /* ... */ };
  render(<PatientCard patient={patient} />);
  expect(screen.getByText('João Silva')).toBeInTheDocument();
});
```

---

## 📱 Tornando PWA

### Frontend

Crie `frontend/public/manifest.json`:

```json
{
  "name": "Consultas - Gerenciamento de Pacientes",
  "short_name": "Consultas",
  "description": "Sistema de gerenciamento de pacientes",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

Adicione no `layout.tsx`:

```typescript
<link rel="manifest" href="/manifest.json" />
```

---

## 🔒 Melhorando Segurança

### Backend

1. **Rate Limiting:**

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
```

2. **Helmet (Headers de Segurança):**

```bash
npm install helmet
```

```typescript
// main.ts
import helmet from 'helmet';
app.use(helmet());
```

### Frontend

1. **Sanitizar Inputs:**

```bash
npm install dompurify
```

```typescript
import DOMPurify from 'dompurify';

const clean = DOMPurify.sanitize(userInput);
```

---

## 📊 Monitoramento e Analytics

### Backend

```typescript
// Middleware de logging
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

### Frontend

```typescript
// Google Analytics
// Adicione no layout.tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_ID" />
```

---

## 🎯 Dicas Finais

1. **Sempre valide dados** no backend e frontend
2. **Use TypeScript** para evitar erros
3. **Teste localmente** antes de fazer deploy
4. **Mantenha dependências atualizadas**
5. **Faça commits frequentes** com mensagens claras
6. **Documente mudanças importantes**
7. **Use variáveis de ambiente** para configurações
8. **Nunca commite** arquivos `.env`
9. **Faça backup** do banco de dados
10. **Monitore logs** em produção

---

## 📚 Recursos Úteis

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Docs](https://docs.mongodb.com/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**Bom desenvolvimento! 🚀**
