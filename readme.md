# URL Shortener API

API para encurtamento de URLs com autenticação, aliases personalizados, expiração de links e analytics básicos.

---

## Visão geral

Este projecto implementa uma API REST para:

* registar e autenticar utilizadores
* criar URLs curtas a partir de URLs originais
* redirecionar a partir de um `shortCode`
* contar cliques
* listar e gerir URLs do utilizador autenticado
* consultar analytics básicos por URL

Exemplo:

* URL original: `https://www.google.com/search?q=prisma`
* URL curta: `http://localhost:3000/aB91xz`

Quando alguém acede a `http://localhost:3000/aB91xz`, a API procura o código curto, valida o link e redireciona para a URL original.

---

## Funcionalidades

### Núcleo

* criação de short URLs
* redirecionamento por `shortCode`
* contagem de cliques
* listagem de URLs por utilizador
* remoção de short URLs

### Autenticação

* registo de utilizador
* login com JWT
* proteção de rotas privadas

### Extras

* alias personalizado
* data de expiração
* analytics básicos
* arquitetura em camadas

---

## Stack

* **Node.js**
* **TypeScript**
* **Express**
* **Prisma ORM**
* **PostgreSQL**
* **JWT** para autenticação
* **bcrypt** para hash de passwords
* **Zod** para validação
* **Helmet** para headers de segurança
* **CORS**
* **Morgan** para logs HTTP

---

## Arquitetura

O projeto segue uma arquitetura em camadas:

* **Routes**: definem os endpoints
* **Controllers**: recebem a request e devolvem a response
* **Services**: concentram a regra de negócio
* **Repositories**: falam com o Prisma/base de dados
* **Lib**: utilitários e clientes partilhados
* **Middlewares**: autenticação, erros, validação, etc.

### Fluxo

`Route -> Controller -> Service -> Repository -> Prisma -> Database`

---

## Estrutura de pastas

```bash
src/
  controllers/
    auth.controller.ts
    short-url.controller.ts
  middlewares/
    auth.middleware.ts
    error-handler.middleware.ts
    not-found.middleware.ts
    validate-request.middleware.ts
  repositories/
    user.repository.ts
    short-url.repository.ts
  routes/
    auth.routes.ts
    short-url.routes.ts
    health.routes.ts
    index.ts
  services/
    auth.service.ts
    short-url.service.ts
  lib/
    prisma.ts
    jwt.ts
    hash.ts
    generate-short-code.ts
  schemas/
    auth.schema.ts
    short-url.schema.ts
  types/
    auth.types.ts
    short-url.types.ts
  app.ts
  server.ts

prisma/
  schema.prisma
```

---

## Modelos principais

### User

* `id`
* `email`
* `name`
* `password`
* `createdAt`

### ShortUrl

* `id`
* `originalUrl`
* `shortCode`
* `customAlias`
* `clickCount`
* `expiresAt`
* `createdAt`
* `userId`

---

## Schema Prisma exemplo

```prisma
model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique
  name      String
  password  String
  createdAt DateTime   @default(now())
  shortUrls ShortUrl[]
}

model ShortUrl {
  id          Int       @id @default(autoincrement())
  originalUrl String
  shortCode   String    @unique
  customAlias String?   @unique
  clickCount  Int       @default(0)
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())

  userId      Int
  user        User      @relation(fields: [userId], references: [id])
}
```

---

## Endpoints

### Auth

#### `POST /api/auth/register`

Cria um novo utilizador.

**Body**

```json
{
  "name": "Marlon",
  "email": "marlon@example.com",
  "password": "12345678"
}
```

**Response**

```json
{
  "sucess": "true"
  "user": {
    "id": 1,
    "name": "Marlon",
    "email": "marlon@example.com"
  }
}
```

#### `POST /api/auth/login`

Autentica um utilizador e devolve token.

**Body**

```json
{
  "email": "johndoe@example.com",
  "password": "12345678"
}
```

**Response**

```json
{
  "success": "true",
  "data": {
    "user": {
      "id": 2,
      "username": "John Doe",
      "email": "johndoe@example.com"
    },
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzaGxleW1hbGF0ZUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6IkFzaGxleSBNYWxhdGUiLCJ1c2VySWQiOjIsImlhdCI6MTc3NDc0NDYzMywiZXhwIjoxNzc3MzM2NjMzfQ.VchC-8HG2pTMerb1CpUB3G3fJhsONCFRyVphsqBRV-Q"
  }
}
```

#### `GET /api/auth/me`

Devolve o utilizador autenticado.

**Headers**

```http
Authorization: Bearer <token>
```

---

### Short URLs

#### `POST /api/short-urls`

Cria uma nova URL curta.

**Headers**

```http
Authorization: Bearer <token>
```

**Body**

```json
{
  "originalUrl": "https://www.google.com",
  "customAlias": "google-mz",
  "expiresAt": "2026-04-30T23:59:59.000Z"
}
```

**Response**

```json
{
  "id": 1,
  "originalUrl": "https://www.google.com",
  "shortCode": "google-mz",
  "clickCount": 0,
  "expiresAt": "2026-04-30T23:59:59.000Z",
  "createdAt": "2026-03-29T10:00:00.000Z"
}
```

#### `GET /api/short-urls`

Lista todas as URLs do utilizador autenticado.

#### `GET /api/short-urls/:id`

Devolve os detalhes de uma short URL.

#### `PATCH /api/short-urls/:id`

Atualiza alias ou expiração.

#### `DELETE /api/short-urls/:id`

Remove uma short URL.

#### `GET /:shortCode`

Redireciona para a URL original.

**Comportamento**

* se o código existir e não estiver expirado: `302 Redirect`
* se o código não existir: `404 Not Found`
* se o código estiver expirado: `404 Not Found`

#### `GET /api/short-urls/:id/analytics`

Devolve analytics básicos da URL.

**Response**

```json
{
  "id": 1,
  "shortCode": "google-mz",
  "originalUrl": "https://www.google.com",
  "clickCount": 25,
  "createdAt": "2026-03-29T10:00:00.000Z",
  "expiresAt": null
}
```

#### `GET /health`

Health check da API.

---

## Middlewares

### `express.json()`

Permite ler JSON no `req.body`.

### `cors()`

Permite comunicação com frontend separado.

### `helmet()`

Adiciona headers de segurança HTTP.

### `morgan()`

Faz logging das requests.

### `authMiddleware`

Valida o JWT e injeta o utilizador autenticado na request.

### `validateRequest`

Valida `body`, `params` e `query` com Zod.

### `notFoundMiddleware`

Captura rotas inexistentes.

### `errorHandlerMiddleware`

Centraliza erros da aplicação.

---

## Variáveis de ambiente

Cria um ficheiro `.env` com:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/url_shortener"
JWT_SECRET="super_secret_key"
BASE_URL="http://localhost:3000"
JWT_EXPIRES_IN=
```

---

## Scripts

Exemplo de scripts no `package.json`:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

---

## Instalação

### 1. Clonar o projeto

```bash
git clone <repo-url>
cd url-shortener-api
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Instalar dependências principais

```bash
npm install express cors helmet morgan zod jsonwebtoken bcrypt @prisma/client
npm install -D typescript tsx ts-node-dev prisma @types/express @types/node @types/jsonwebtoken @types/bcrypt @types/morgan
```

### 4. Inicializar Prisma

```bash
npx prisma init
```

### 5. Configurar o schema

Editar `prisma/schema.prisma`.

### 6. Criar migrações

```bash
npx prisma migrate dev --name init
```

### 7. Gerar Prisma Client

```bash
npx prisma generate
```

### 8. Executar o projeto

```bash
npm run dev
```

---

## Exemplo de `app.ts`

```ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { notFoundMiddleware } from './middlewares/not-found.middleware';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
```

---

## Exemplo de `routes/index.ts`

```ts
import express from 'express';
import authRoutes from './auth.routes';
import shortUrlRoutes from './short-url.routes';
import healthRoutes from './health.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/short-urls', shortUrlRoutes);
router.use('/health', healthRoutes);

export default router;
```

---

## Fluxos principais

### 1. Registo

1. cliente envia `POST /api/auth/register`
2. controller recebe os dados
3. service valida e faz hash da password
4. repository cria o utilizador
5. resposta `201 Created`

### 2. Login

1. cliente envia `POST /api/auth/login`
2. service procura user por email
3. service valida password
4. service gera JWT
5. resposta `200 OK`

### 3. Criar short URL

1. cliente envia `POST /api/short-urls`
2. service valida URL
3. service gera `shortCode` ou usa alias
4. repository persiste na base
5. resposta `201 Created`

### 4. Redirect

1. cliente acede a `GET /:shortCode`
2. service procura short URL
3. service valida expiração
4. repository incrementa `clickCount`
5. controller devolve redirect `302`

---

## Diagrama de sequência

```mermaid
sequenceDiagram
    actor Client
    participant Route as Routes
    participant AuthController as AuthController
    participant ShortUrlController as ShortUrlController
    participant AuthService as AuthService
    participant ShortUrlService as ShortUrlService
    participant UserRepo as UserRepository
    participant UrlRepo as ShortUrlRepository
    participant Prisma as Prisma Client
    participant DB as Database

    Client->>Route: POST /api/auth/register
    Route->>AuthController: register(req, res)
    AuthController->>AuthService: register(data)
    AuthService->>UserRepo: createUser(data)
    UserRepo->>Prisma: user.create(...)
    Prisma->>DB: INSERT INTO users
    DB-->>Prisma: user criada
    Prisma-->>UserRepo: resultado
    UserRepo-->>AuthService: user
    AuthService-->>AuthController: user criada
    AuthController-->>Client: 201 Created

    Client->>Route: POST /api/short-urls
    Route->>ShortUrlController: create(req, res)
    ShortUrlController->>ShortUrlService: create(data, userId)
    ShortUrlService->>UrlRepo: createShortUrl(data)
    UrlRepo->>Prisma: shortUrl.create(...)
    Prisma->>DB: INSERT INTO short_urls
    DB-->>Prisma: short_url criada
    Prisma-->>UrlRepo: resultado
    UrlRepo-->>ShortUrlService: short_url
    ShortUrlService-->>ShortUrlController: short_url
    ShortUrlController-->>Client: 201 Created

    Client->>Route: GET /:shortCode
    Route->>ShortUrlController: redirect(req, res)
    ShortUrlController->>ShortUrlService: redirect(shortCode)
    ShortUrlService->>UrlRepo: findByShortCode(shortCode)
    UrlRepo->>Prisma: shortUrl.findUnique(...)
    Prisma->>DB: SELECT * FROM short_urls
    DB-->>Prisma: short_url
    Prisma-->>UrlRepo: resultado
    UrlRepo-->>ShortUrlService: short_url
    ShortUrlService->>UrlRepo: incrementClickCount(id)
    UrlRepo->>Prisma: shortUrl.update(...)
    Prisma->>DB: UPDATE click_count
    DB-->>Prisma: ok
    Prisma-->>UrlRepo: ok
    UrlRepo-->>ShortUrlService: ok
    ShortUrlService-->>ShortUrlController: originalUrl
    ShortUrlController-->>Client: 302 Redirect
```

---

## Melhorias futuras

* Redis para cache de redirects
* geração de QR code
* password protection por link
* batch shortening
* analytics detalhado por IP, país e user-agent
* testes unitários e de integração
* Swagger/OpenAPI
* Docker
* CI/CD

---

## Commits sugeridos

```bash
chore: initialize express and typescript project
chore: configure prisma and postgres
feat: add auth routes and controllers
feat: add short url creation flow
feat: add redirect endpoint
feat: add analytics endpoint
chore: add middlewares and error handling
refactor: centralize api routes
```

---

## Licença

MIT
