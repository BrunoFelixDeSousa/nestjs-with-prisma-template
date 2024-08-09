import { Body, Controller, Post, UseGuards } from '@nestjs/common'; // Importa os decoradores e exceções necessários do pacote '@nestjs/common'.
import { CurrentUser } from 'src/auth/current-user.decorator'; // Importa o decorator personalizado para obter o usuário atual da requisição.
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Importa o guard de autenticação JWT.
import { UserPayload } from 'src/auth/jwt.strategy'; // Importa a tipagem do payload do JWT.
import { ZodValidationPipe } from 'src/common/pipes/zod-validation-pipe'; // Importa um Pipe personalizado para validação usando Zod.
import { PrismaService } from 'src/common/prisma/prisma.service'; // Importa o serviço Prisma para interações com o banco de dados.
import { z } from 'zod'; // Importa o Zod para validação de dados.

// Define o schema de validação do corpo da requisição utilizando Zod
const createQuestionBodySchema = z.object({
  title: z.string(), // Campo 'title' deve ser uma string
  content: z.string(), // Campo 'content' deve ser uma string
});

// Cria uma instância do ZodValidationPipe utilizando o schema definido
const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

// Tipagem inferida a partir do schema Zod
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions') // Declara a classe como um controlador responsável pelo endpoint '/questions'.
@UseGuards(JwtAuthGuard) // Aplica o guard JWT a todas as rotas deste controlador, protegendo-as.
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {} // Injeta o serviço Prisma para manipulação de dados no banco.

  @Post() // Declara que este método responde a requisições HTTP POST.
  async handle(
    // @Body(new ZodValidationPipe(createQuestionBodySchema))
    // body: CreateQuestionBodySchema,
    // ou
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema, // Valida o corpo da requisição utilizando o Pipe criado
    @CurrentUser() user: UserPayload, // Injeta o usuário autenticado no método
  ) {
    const { title, content } = body; // Desestrutura o corpo da requisição para obter o título e o conteúdo
    const userId = user.sub; // Obtém o ID do usuário autenticado a partir do payload do JWT

    // Gera um slug a partir do título da questão
    const slug = this.convertToSlug(title);

    // Cria uma nova questão no banco de dados usando o Prisma
    await this.prisma.question.create({
      data: {
        authorId: userId, // ID do autor vinculado à questão
        title, // Título da questão
        content, // Conteúdo da questão
        slug, // Slug gerado a partir do título
      },
    });
  }

  // Método privado para converter o título em um slug amigável para URLs
  private convertToSlug(title: string): string {
    return title
      .toLowerCase() // Converte o título para minúsculas
      .normalize('NFD') // Normaliza o texto para remover acentos
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos restantes
      .replace(/[^\w\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-'); // Substitui espaços por hífens
  }
}
