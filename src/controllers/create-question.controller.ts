import { Controller, Post, UseGuards } from '@nestjs/common'; // Importa os decoradores e exceções necessários do pacote '@nestjs/common'.
import { CurrentUser } from 'src/auth/current-user.decorator'; // Importa o decorator personalizado para obter o usuário atual da requisição.
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Importa o guard de autenticação JWT.
import { UserPayload } from 'src/auth/jwt.strategy'; // Importa a tipagem do payload do JWT.

@Controller('/questions') // Declara a classe como um controlador responsável pelo endpoint '/questions'.
@UseGuards(JwtAuthGuard) // Aplica o guard JWT a todas as rotas deste controlador, protegendo-as.
export class CreateQuestionController {
  constructor() {} // Construtor padrão. Não há injeção de dependências no momento.

  @Post() // Declara que este método responde a requisições HTTP POST.
  async handle(@CurrentUser() user: UserPayload) {
    // O decorator @CurrentUser injeta o usuário autenticado (extraído do token JWT) no método.
    console.log(user);
    return 'ok';
  }
}
