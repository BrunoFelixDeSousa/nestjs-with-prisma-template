import { z } from 'zod'; // Importa a biblioteca 'zod' para validação de esquemas.

export const envSchema = z
  .object({
    DATABASE_URL: z.string().url(), // Define que a variável de ambiente 'DATABASE_URL' deve ser uma string contendo uma URL válida.
    JWT_PRIVATE_KEY: z.string(), // Define que a variável de ambiente 'JWT_PRIVATE_KEY' deve ser uma string.
    JWT_PUBLIC_KEY: z.string(), // Define que a variável de ambiente 'JWT_PUBLIC_KEY' deve ser uma string.
    PORT: z.coerce.number().optional().default(3333), // Define que a variável de ambiente 'PORT' deve ser um número opcional, com valor padrão de 3333.
  })
  .required(); // Indica que todas as propriedades do objeto são obrigatórias.

export type Env = z.infer<typeof envSchema>; // Define um tipo 'Env' que é inferido a partir do schema 'envSchema'.
