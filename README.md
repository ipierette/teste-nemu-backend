<div align="center">

# 🔧 Backend - API de Análise de Jornadas

### API RESTful em Node.js + TypeScript para processamento de dados de jornada

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Zod](https://img.shields.io/badge/Zod-3.22-3E67B1?style=flat-square&logo=zod&logoColor=white)](https://zod.dev/)

</div>

---

## 📖 Sobre

Backend API construído com Clean Architecture e princípios SOLID. Processa arquivos XLSX contendo dados de jornada de usuário, aplica regras de negócio e expõe endpoints RESTful.

## ⚡ Início Rápido

```bash
# Instalar dependências
npm install

# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Produção
npm start

# Verificação de tipos
npm run type-check
```

O servidor iniciará em `http://localhost:3001`

---

## 📂 Estrutura do Projeto

```
src/
├── controllers/
│   └── journeys.controller.ts    # Manipula requisições HTTP
├── middlewares/
│   └── errorHandler.ts           # Tratamento global de erros
├── routes/
│   └── journeys.routes.ts        # Definição de rotas
├── services/
│   └── journeys.service.ts       # Lógica de negócio
├── types/
│   ├── Journey.ts                # Interfaces TypeScript
│   └── RawEvent.ts               # Schemas Zod
├── utils/
│   ├── parseXlsx.ts              # Parse de XLSX
│   ├── groupBySession.ts         # Agrupamento
│   ├── sortByDate.ts             # Ordenação
│   └── removeMiddleDuplicates.ts # Deduplicação
└── server.ts                     # Servidor Express
```

---

## 🚀 Stack Tecnológica

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **TypeScript** | 5.3 | Type safety e IntelliSense |
| **Express** | 4.18 | Framework web |
| **XLSX** | 0.18 | Parser de arquivos Excel |
| **Zod** | 3.22 | Validação de schema |
| **CORS** | 2.8 | Cross-Origin Resource Sharing |
| **TSX** | Latest | TypeScript execution (dev) |

---

## 🌐 Endpoints da API

### `GET /health`

Verificação de saúde do servidor.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-28T12:00:00.000Z"
}
```

**Status Codes:**
- `200` - Servidor funcionando normalmente

---

### `GET /api/journeys`

Retorna todas as jornadas de usuário processadas.

**Response de Sucesso:**
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "session-abc123",
      "userId": "user-xyz456",
      "touchpoints": [
        {
          "channel": "email",
          "timestamp": "2025-11-28T10:00:00.000Z"
        },
        {
          "channel": "web",
          "timestamp": "2025-11-28T10:15:00.000Z"
        }
      ],
      "startTime": "2025-11-28T10:00:00.000Z",
      "endTime": "2025-11-28T10:15:00.000Z",
      "duration": 900000,
      "totalTouchpoints": 2
    }
  ],
  "metadata": {
    "totalJourneys": 150,
    "totalTouchpoints": 450,
    "processedAt": "2025-11-28T12:00:00.000Z"
  }
}
```

**Response de Erro:**
```json
{
  "success": false,
  "error": {
    "message": "Descrição do erro",
    "details": "Detalhes adicionais (apenas em desenvolvimento)"
  }
}
```

**Status Codes:**
- `200` - Sucesso
- `500` - Erro interno do servidor

---

## 🔄 Pipeline de Processamento

### 1. Parse XLSX
```typescript
// utils/parseXlsx.ts
XLSX File → Validação Zod → RawEvent[]
```

### 2. Agrupamento por Sessão
```typescript
// utils/groupBySession.ts
RawEvent[] → Map<sessionId, RawEvent[]>
```

### 3. Ordenação Cronológica
```typescript
// utils/sortByDate.ts
Events por sessão → Ordenados por created_at
```

### 4. Deduplicação Inteligente
```typescript
// utils/removeMiddleDuplicates.ts
// Regras de Negócio:
// 1. Posição 0 (primeiro) SEMPRE mantida
// 2. Posição N-1 (último) SEMPRE mantida
// 3. Posições intermediárias (1 a N-2): remove se:
//    - Canal coincide com posição 0 (primeiro)
//    - Canal coincide com posição N-1 (último)
//    - Canal já foi visto no meio (duplicata)

Exemplo:
Original: [facebook, google, facebook, instagram, google, facebook]
Processado: [facebook, instagram, facebook]

Explicação:
- facebook[0] → Mantido (posição 0)
- google[1] → Removido (coincide com último facebook[5])
- facebook[2] → Removido (coincide com primeiro facebook[0])
- instagram[3] → Mantido (único no meio)
- google[4] → Removido (coincide com último facebook[5])
- facebook[5] → Mantido (posição N-1)
```

### 5. Transformação
```typescript
// services/journeys.service.ts
Map<sessionId, RawEvent[]> → Journey[]
```

---

## 📐 Arquitetura

### Clean Architecture

```
┌─────────────────────────────────┐
│   Controllers (HTTP Layer)      │ ← Requisições HTTP
├─────────────────────────────────┤
│   Services (Business Logic)     │ ← Orquestração
├─────────────────────────────────┤
│   Utils (Pure Functions)        │ ← Transformações
├─────────────────────────────────┤
│   Types (Schemas & Interfaces)  │ ← Validação
└─────────────────────────────────┘
```

### Princípios SOLID

- **S** - Single Responsibility: Cada função faz uma coisa
- **O** - Open/Closed: Extensível sem modificação
- **L** - Liskov Substitution: Substituição transparente
- **I** - Interface Segregation: Interfaces mínimas
- **D** - Dependency Inversion: Depende de abstrações

---

## 🔒 Validação de Dados

### Schema Zod (RawEvent)

```typescript
const RawEventSchema = z.object({
  userId: z.string().min(1, "userId não pode estar vazio"),
  sessionId: z.string().min(1, "sessionId não pode estar vazio"),
  channel: z.string().min(1, "channel não pode estar vazio"),
  created_at: z.string().datetime("Formato de data inválido")
});
```

**Benefícios:**
- ✅ Validação em runtime
- ✅ Type inference automático
- ✅ Mensagens de erro descritivas
- ✅ Integração com TypeScript

---

## ⚙️ Configuração

### Variáveis de Ambiente

```env
PORT=3001
NODE_ENV=development
```

### TypeScript Config

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

---

## 🐛 Tratamento de Erros

### Middleware Global

```typescript
// middlewares/errorHandler.ts
app.use((err, req, res, next) => {
  console.error(err);
  
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { 
        details: err 
      })
    }
  });
});
```

---

## 📊 Dados de Entrada

### Formato do XLSX

O arquivo deve estar em `./data/nemu-base-de-dados.xlsx` com as colunas:

| Coluna | Tipo | Obrigatório | Descrição |
|--------|------|-------------|-----------|
| `userId` | string | ✅ | ID do usuário |
| `sessionId` | string | ✅ | ID da sessão |
| `channel` | string | ✅ | Canal de interação |
| `created_at` | datetime | ✅ | Timestamp ISO 8601 |

**Exemplo:**
```
userId    | sessionId  | channel | created_at
user-001  | session-01 | email   | 2025-11-28T10:00:00.000Z
user-001  | session-01 | web     | 2025-11-28T10:15:00.000Z
```

---

## 🧪 Testes

### Teste Manual

```bash
# Health check
curl http://localhost:3001/health

# Obter jornadas
curl http://localhost:3001/api/journeys

# Com formatação JSON (requer jq)
curl http://localhost:3001/api/journeys | jq
```

### Response de Exemplo

```json
{
  "success": true,
  "data": [...],
  "metadata": {
    "totalJourneys": 150,
    "totalTouchpoints": 450,
    "processedAt": "2025-11-28T12:00:00.000Z"
  }
}
```

---

## ✅ Validação e Transparência

### Comparação: Jornada Original vs Tratada

O frontend oferece dois botões para cada jornada:

**1. "Ver mais" (Jornada Tratada - Tema Azul):**
- Mostra `journey.touchpoints` processados
- removeMiddleDuplicates foi aplicado
- Dados limpos para análise

**2. "Ver completo" (Jornada Original - Tema Verde):**
- Busca dados originários via `GET /api/journeys`
- Mostra touchpoints sem tratamento
- Permite validação do processamento
- Banner de aviso: "⚠️ Dados brutos sem tratamento de duplicatas"

**Por que isso é importante:**
- Transparência total do processamento
- Avaliadores podem validar regras de negócio
- Comparação lado a lado
- Debugging facilitado

---

## 🚨 Solução de Problemas

### Servidor não inicia

```bash
# Verificar se a porta 3001 está em uso
lsof -i :3001

# Matar processo se necessário
kill -9 <PID>
```

### Erro de parse XLSX

```bash
# Verificar se o arquivo existe
ls -la ../data/nemu-base-de-dados.xlsx

# Verificar permissões
chmod 644 ../data/nemu-base-de-dados.xlsx
```

### Erro de validação Zod

Verifique se o XLSX tem todas as colunas obrigatórias e formatos corretos.

---

## 📚 Referências

- [Express Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [XLSX Documentation](https://docs.sheetjs.com/)

---

<div align="center">

**Desenvolvido com 💙 por Izadora Cury Pierette**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Conectar-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/izadora-cury-pierette-7a7754253/)
[![GitHub](https://img.shields.io/badge/GitHub-Seguir-181717?style=flat-square&logo=github)](https://github.com/ipierette)
[![Email](https://img.shields.io/badge/Email-Contato-EA4335?style=flat-square&logo=gmail)](mailto:ipierette2@gmail.com)

</div>
