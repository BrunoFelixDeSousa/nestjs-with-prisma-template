import { Module } from '@nestjs/common'; // Importa o decorador 'Module' do pacote '@nestjs/common'.
import { ConfigService } from '@nestjs/config'; // Importa o serviço de configuração do pacote '@nestjs/config'.
import { JwtModule } from '@nestjs/jwt'; // Importa o módulo JWT do pacote '@nestjs/jwt'.
import { PassportModule } from '@nestjs/passport'; // Importa o módulo Passport do pacote '@nestjs/passport'.
import { AuthenticateController } from 'src/controllers/authenticate.controller';
import { CreateAccountController } from 'src/controllers/create-account.controller';
import { Env } from 'src/env'; // Importa o tipo 'Env' do caminho especificado.
import { JwtStrategy } from './jwt.strategy';
import { PrismaModule } from '@/common/prisma/prisma.module';

@Module({
  imports: [
    PassportModule, // Importa o módulo Passport para autenticação.
    JwtModule.registerAsync({
      inject: [ConfigService], // Injeta o serviço de configuração.
      global: true, // Define o módulo JWT como global, tornando-o acessível em toda a aplicação.
      useFactory(config: ConfigService<Env, true>) {
        // Usa uma fábrica para configurar o módulo JWT de forma assíncrona.
        const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true }); // Obtém a chave privada das variáveis de ambiente, inferindo seu tipo.
        const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true }); // Obtém a chave pública das variáveis de ambiente, inferindo seu tipo.

        return {
          signOptions: {
            algorithm: 'RS256', // Define a opção de assinatura usando o algoritmo 'RS256'.
            expiresIn: '1d', // Tempo para expiração do token jwt definido.
          }, // Define a opção de assinatura usando o algoritmo 'RS256'.
          privateKey: Buffer.from(privateKey, 'base64'), // Converte a chave privada de base64 para um buffer.
          publicKey: Buffer.from(publicKey, 'base64'), // Converte a chave pública de base64 para um buffer.
        };
      },
    }),
    PrismaModule,
  ],
  controllers: [CreateAccountController, AuthenticateController],
  providers: [JwtStrategy], // Registra o serviço 'PrismaService' como provedor.
})
export class AuthModule {} // Declara e exporta a classe 'AuthModule' como um módulo do NestJS.
