import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importa o módulo de configuração do pacote '@nestjs/config'.

import { envSchema } from './env'; // Importa o schema de validação do ambiente do arquivo 'env.ts'.
import { AuthModule } from './auth/auth.module'; // Importa o módulo de autenticação do caminho especificado.

import { CreateQuestionController } from './controllers/create-question.controller';
import { FetchRecenteQuestionController } from './controllers/fetch-recent-questions.controller';
import { PrismaModule } from './common/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env), // Valida as variáveis de ambiente usando o schema 'envSchema'.
      isGlobal: true, // Define o módulo de configuração como global, tornando-o acessível em toda a aplicação.
    }),
    AuthModule, // Importa o módulo de autenticação.
    PrismaModule,
  ],
  controllers: [
    // CreateAccountController,
    // AuthenticateController,
    CreateQuestionController,
    FetchRecenteQuestionController,
  ],
  providers: [],
})
export class AppModule {} // Define a classe 'AppModule' como um módulo do NestJS.
