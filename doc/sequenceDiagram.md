# Diagrama de sequência das classes controller

## Fluxo de criação de conta no método handle da classe CreateAccountController

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

## Fluxo de autenticação no método handle da classe AuthenticateController

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

## Fluxo de criação de pergunta no método handle da classe CreateQuestionController

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

## Fluxo de listagem de perguntas no método handle da classe FetchRecenteQuestionController

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
