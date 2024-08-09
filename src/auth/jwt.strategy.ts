import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Env } from 'src/env';
import { z } from 'zod';

// Definindo um schema de validação para o payload do JWT usando Zod
const tokenPayloadSchema = z.object({
  sub: z.string().uuid(), // O campo 'sub' deve ser uma string com formato UUID
});

// Tipagem para o schema de token, baseada na inferência de tipos do Zod
export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
// Implementação da estratégia JWT com a biblioteca Passport
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    // Recupera a chave pública do JWT a partir das variáveis de ambiente
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true });

    // Configura a estratégia JWT
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o JWT do cabeçalho de autorização do Bearer Token
      secretOrKey: Buffer.from(publicKey, 'base64'), // Decodifica a chave pública de base64 para um buffer
      algorithms: ['RS256'], // Define o algoritmo de assinatura como RS256 para a validação do JWT
    });
  }

  // Método chamado automaticamente para validar o payload do JWT após o token ser decodificado
  async validate(payload: UserPayload) {
    // Valida o payload do token de acordo com o schema definido
    return tokenPayloadSchema.parse(payload);
  }
}
