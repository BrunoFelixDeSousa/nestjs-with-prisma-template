import { Controller, Get, Query, UseGuards } from '@nestjs/common'; // Importa os decoradores e exceções necessários do pacote '@nestjs/common'.
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'; // Importa o guard de autenticação JWT.
import { ZodValidationPipe } from '@/common/pipes/zod-validation-pipe'; // Importa um Pipe personalizado para validação usando Zod.
import { PrismaService } from '@/common/prisma/prisma.service'; // Importa o serviço Prisma para interações com o banco de dados.
import { z } from 'zod'; // Importa o Zod para validação de dados.

// Define o schema de validação para o parâmetro de query 'page' utilizando Zod
const pageQueryBodySchema = z
  .string() // O valor da query deve ser uma string
  .optional() // A query é opcional, ou seja, não precisa estar presente
  .default('1') // Caso não esteja presente, o valor padrão será '1'
  .transform(Number) // Transforma a string em número
  .pipe(z.number().min(1)); // Valida se o número é no mínimo 1

// Cria uma instância do ZodValidationPipe utilizando o schema definido
const queryValidationPipe = new ZodValidationPipe(pageQueryBodySchema);

// Tipagem inferida a partir do schema Zod
type PageQueryBodySchema = z.infer<typeof pageQueryBodySchema>;

@Controller('/questions') // Declara a classe como um controlador responsável pelo endpoint '/questions'.
@UseGuards(JwtAuthGuard) // Aplica o guard JWT a todas as rotas deste controlador, protegendo-as.
export class FetchRecenteQuestionController {
  constructor(private readonly prisma: PrismaService) {} // Injeta o serviço Prisma para manipulação de dados no banco.

  @Get() // Declara que este método responde a requisições HTTP GET.
  async handle(@Query('page', queryValidationPipe) page: PageQueryBodySchema) {
    const perPage = 2; // Define o número de perguntas por página

    // Busca as perguntas no banco de dados, paginando e ordenando por data de criação
    const questions = await this.prisma.question.findMany({
      take: perPage, // Limita o número de perguntas retornadas
      skip: (page - 1) * perPage, // Calcula o offset para a paginação
      orderBy: {
        createdAt: 'desc', // Ordena as perguntas pela data de criação, da mais recente para a mais antiga
      },
    });

    return { questions }; // Retorna as perguntas encontradas
  }
}
