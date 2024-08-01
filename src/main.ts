import { NestFactory } from '@nestjs/core'; // Importa a fábrica do NestJS para criar a aplicação.
import { AppModule } from './app.module'; // Importa o módulo principal da aplicação.
import { ConfigService } from '@nestjs/config'; // Importa o serviço de configuração do NestJS.
import { Env } from './env'; // Importa o tipo 'Env' definido no arquivo 'env'.

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'warn', 'log', 'fatal', 'verbose'],
  }); // Cria a aplicação NestJS usando o módulo principal 'AppModule'.

  const configService = app.get<ConfigService<Env, true>>(ConfigService); // Obtém uma instância do serviço de configuração com o tipo 'ConfigService' parametrizado com 'Env'.
  const port = configService.get('PORT', { infer: true }); // Obtém a porta da configuração, inferindo o tipo da variável.

  await app.listen(port); // Faz a aplicação escutar na porta especificada.
}

bootstrap(); // Chama a função 'bootstrap' para iniciar a aplicação.
