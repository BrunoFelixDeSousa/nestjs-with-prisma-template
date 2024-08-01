import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'; // Importa os decoradores e exceções necessários do pacote '@nestjs/common'.
import { JwtService } from '@nestjs/jwt'; // Importa o serviço JWT do pacote '@nestjs/jwt'.
import { compare } from 'bcryptjs'; // Importa a função 'compare' do pacote 'bcryptjs' para comparar senhas.
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe'; // Importa o pipe de validação personalizado baseado em Zod.
import { PrismaService } from 'src/common/prisma/prisma.service'; // Importa o serviço Prisma do caminho especificado.
import { z } from 'zod'; // Importa a biblioteca 'zod' para validação de esquemas.

const authenticateBodySchema = z.object({
  email: z.string().email(), // Define que o campo 'email' deve ser uma string contendo um e-mail válido.
  password: z.string(), // Define que o campo 'password' deve ser uma string.
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>; // Define um tipo 'AuthenticateBodySchema' inferido a partir do schema 'authenticateBodySchema'.

@Controller('/sessions') // Declara a classe como um controlador responsável pelo endpoint '/sessions'.
export class AuthenticateController {
  constructor(
    private readonly prisma: PrismaService, // Injeta o serviço Prisma.
    private readonly jwt: JwtService, // Injeta o serviço JWT.
  ) {}

  @Post() // Declara que este método responde a requisições HTTP POST.
  @HttpCode(201) // Define o código de status HTTP para 201 (Created).
  @UsePipes(new ZodValidationPipe(authenticateBodySchema)) // Aplica o pipe de validação baseado no schema 'authenticateBodySchema'.
  async handle(@Body() body: AuthenticateBodySchema) {
    // Método que lida com a requisição, recebendo o corpo da requisição validado.
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    }); // Verifica se existe um usuário com o e-mail fornecido no banco de dados.

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.'); // Lança uma exceção de autorização se o usuário não for encontrado.
    }

    const isPasswordValid = await compare(password, user.password); // Compara a senha fornecida com a senha armazenada no banco de dados.

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.'); // Lança uma exceção de autorização se a senha estiver incorreta.
    }

    const accessToken = this.jwt.sign({ sub: user.id }); // Gera um token JWT com o ID do usuário como payload.

    return {
      access_token: accessToken, // Retorna o token de acesso.
    };
  }
}
