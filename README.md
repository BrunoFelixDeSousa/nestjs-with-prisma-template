# Projeto de API com NestJS, Prisma, JWT, e Zod

Este projeto é uma API desenvolvida com **NestJS**, que inclui funcionalidades de criação de contas, autenticação, criação e listagem de perguntas. A API utiliza **Prisma** como ORM, **JWT** para autenticação, e **Zod** para validação de dados.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js para construção de aplicações server-side eficientes e escaláveis.
- **Prisma**: ORM que facilita o acesso ao banco de dados e manipulação de dados.
- **JWT (JSON Web Token)**: Utilizado para autenticação segura entre cliente e servidor.
- **Zod**: Biblioteca de validação de esquemas para validação de dados de entrada.
- **Bcryptjs**: Biblioteca para hashing de senhas de forma segura.

## Funcionalidades

### 1. Criação de Conta

- Endpoint: `POST /accounts`
- Descrição: Permite a criação de uma nova conta de usuário.
- Validação: O corpo da requisição é validado com **Zod**. Se a validação falhar, uma resposta `400 Bad Request` é retornada.
- Segurança: Se o e-mail já estiver cadastrado, uma resposta `409 Conflict` é retornada.
- Diagrama de sequência:

```mermaid
sequenceDiagram
    participant Client
    participant CreateAccountController
    participant PrismaService
    participant Bcryptjs

    Client->>CreateAccountController: POST /accounts (name, email, password)
    CreateAccountController->>CreateAccountController: Validate body (ZodValidationPipe)
    alt Validation fails
        CreateAccountController-->>Client: 400 Bad Request
    else Validation succeeds
        CreateAccountController->>PrismaService: findUnique({ where: { email } })
        PrismaService-->>CreateAccountController: userWithSameEmail or null
        
        alt User with same email exists
            CreateAccountController-->>Client: 409 Conflict (User with same e-mail already exists)
        else Email available
            CreateAccountController->>Bcryptjs: hash(password, 8)
            Bcryptjs-->>CreateAccountController: hashedPassword
            CreateAccountController->>PrismaService: create({ name, email, password: hashedPassword })
            PrismaService-->>CreateAccountController: New User object
            CreateAccountController-->>Client: 201 Created (New User object)
        end
    end
```

### 2. Autenticação de Usuário

- Endpoint: `POST /sessions`
- Descrição: Permite a autenticação de um usuário e retorna um token JWT.
- Validação: O corpo da requisição é validado com **Zod**. Se a validação falhar, uma resposta `400 Bad Request` é retornada.
- Segurança: Se as credenciais estiverem incorretas, uma resposta `401 Unauthorized` é retornada.
- Diagrama de sequência:

```mermaid
sequenceDiagram
    participant Client
    participant AuthenticateController
    participant PrismaService
    participant JwtService

    Client->>AuthenticateController: POST /sessions (email, password)
    AuthenticateController->>AuthenticateController: Validate body (ZodValidationPipe)
    alt Validation fails
        AuthenticateController-->>Client: 400 Bad Request
    else Validation succeeds
        AuthenticateController->>PrismaService: findUnique({ where: { email } })
        PrismaService-->>AuthenticateController: User object or null
        
        alt User not found
            AuthenticateController-->>Client: 401 Unauthorized
        else User found
            AuthenticateController->>AuthenticateController: compare(password, user.password)
            alt Password invalid
                AuthenticateController-->>Client: 401 Unauthorized
            else Password valid
                AuthenticateController->>JwtService: sign({ sub: user.id })
                JwtService-->>AuthenticateController: accessToken
                AuthenticateController-->>Client: 201 Created (access_token)
            end
        end
    end
```

### 3. Criação de Pergunta

- Endpoint: `POST /questions`
- Descrição: Permite a criação de uma nova pergunta por um usuário autenticado.
- Validação: O corpo da requisição é validado com **Zod**. Se a validação falhar, uma resposta `400 Bad Request` é retornada.
- Segurança: Requer autenticação JWT.
- Diagrama de sequência:

```mermaid
sequenceDiagram
    participant Client
    participant CreateQuestionController
    participant JwtAuthGuard
    participant ZodValidationPipe
    participant PrismaService

    Client->>CreateQuestionController: POST /questions (title, content) with JWT
    CreateQuestionController->>JwtAuthGuard: Verify authentication
    JwtAuthGuard-->>CreateQuestionController: Authenticated User

    CreateQuestionController->>ZodValidationPipe: Validate body (title, content)
    alt Validation fails
        CreateQuestionController-->>Client: 400 Bad Request
    else Validation succeeds
        CreateQuestionController->>CreateQuestionController: convertToSlug(title)
        CreateQuestionController-->>CreateQuestionController: slug

        CreateQuestionController->>PrismaService: create({ authorId, title, content, slug })
        PrismaService-->>CreateQuestionController: New Question object
        CreateQuestionController-->>Client: 201 Created (New Question object)
    end
```

### 4. Listagem de Perguntas

- Endpoint: `GET /questions?page=1`
- Descrição: Permite a listagem de perguntas com paginação.
- Validação: O parâmetro de query `page` é validado com **Zod**. Se a validação falhar, uma resposta `400 Bad Request` é retornada.
- Segurança: Requer autenticação JWT.
- Diagrama de sequência:

```mermaid
sequenceDiagram
    participant Client
    participant FetchRecenteQuestionController
    participant JwtAuthGuard
    participant ZodValidationPipe
    participant PrismaService

    Client->>FetchRecenteQuestionController: GET /questions?page=1 with JWT
    FetchRecenteQuestionController->>JwtAuthGuard: Verify authentication
    JwtAuthGuard-->>FetchRecenteQuestionController: Authenticated User

    FetchRecenteQuestionController->>ZodValidationPipe: Validate query parameter (page)
    alt Validation fails
        FetchRecenteQuestionController-->>Client: 400 Bad Request
    else Validation succeeds
        FetchRecenteQuestionController->>PrismaService: findMany({ take, skip, orderBy })
        PrismaService-->>FetchRecenteQuestionController: List of Questions
        FetchRecenteQuestionController-->>Client: 200 OK (List of Questions)
    end
```

## Como Executar o Projeto

### Pré-requisitos

- Node.js instalado
- Banco de dados configurado (MySQL, PostgreSQL, etc.)
- Dependências instaladas via `pnpm` ou `npm`

### Passos

1. Clone o repositório:
   ```bash
   git clone https://github.com/BrunoFelixDeSousa/project-with-prisma-template.git
   ```
2. Instale as dependências:
   ```bash
   pnpm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Execute as migrações do banco de dados:
   ```bash
   pnpm prisma migrate dev
   ```
5. Inicie o servidor de desenvolvimento:
   ```bash
   pnpm start:dev
   ```
   