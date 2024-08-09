import { AuthGuard } from '@nestjs/passport';

// Cria uma classe de guarda de autenticação utilizando a estratégia 'jwt' definida anteriormente
export class JwtAuthGuard extends AuthGuard('jwt') {}
