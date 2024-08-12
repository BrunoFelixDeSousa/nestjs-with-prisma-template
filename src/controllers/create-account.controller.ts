import {
  Body,
  Controller,
  HttpCode,
  Post,
  ConflictException,
  UsePipes,
} from '@nestjs/common'; // Importa os decoradores e exceções necessários do pacote '@nestjs/common'.
import { PrismaService } from '@/common/prisma/prisma.service'; // Importa o serviço Prisma.
import { hash } from 'bcryptjs'; // Importa a função 'hash' do pacote 'bcryptjs' para criptografar senhas.
import { z } from 'zod'; // Importa a biblioteca 'zod' para validação de esquemas.
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe'; // Importa o pipe de validação personalizado baseado em Zod.

// Definindo o esquema de validação do corpo da requisição
const createAccountBodySchema = z
  .object({
    name: z.string().min(1, 'Name is required'), // Adiciona uma mensagem de erro para o campo 'name'.
    email: z.string().email('Invalid email format'), // Adiciona uma mensagem de erro para o campo 'email'.
    password: z.string().min(8, 'Password must be at least 8 characters long'), // Adiciona uma validação mínima para o campo 'password'.
  })
  .required();

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>; // Define um tipo 'CreateAccountBodySchema' inferido a partir do schema 'createAccountBodySchema'.

@Controller('/accounts') // Declara a classe como um controlador responsável pelo endpoint '/accounts'.
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {} // Construtor que aceita uma instância do serviço Prisma.

  @Post() // Declara que este método responde a requisições HTTP POST.
  @HttpCode(201) // Define o código de status HTTP para 201 (Created).
  @UsePipes(new ZodValidationPipe(createAccountBodySchema)) // Aplica o pipe de validação baseado no schema 'createAccountBodySchema'.
  async handle(@Body() body: CreateAccountBodySchema) {
    // Método que lida com a requisição, recebendo o corpo da requisição validado.
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    }); // Verifica se já existe um usuário com o mesmo e-mail no banco de dados.

    if (userWithSameEmail) {
      throw new ConflictException('User with same e-mail already exists.'); // Lança uma exceção de conflito se o e-mail já estiver em uso.
    }

    const hashedPassword = await hash(password, 8); // Criptografa a senha fornecida.

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword, // Armazena a senha criptografada.
      },
    }); // Cria um novo usuário no banco de dados com os dados fornecidos.
  }
}
