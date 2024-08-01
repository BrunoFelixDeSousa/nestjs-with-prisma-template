import { Controller, Post } from '@nestjs/common'; // Importa os decoradores e exceções necessários do pacote '@nestjs/common'.

@Controller('/questions') // Declara a classe como um controlador responsável pelo endpoint '/accounts'.
export class CreateQuestionController {
  constructor() {} // Construtor que aceita uma instância do serviço Prisma.

  @Post() // Declara que este método responde a requisições HTTP POST.
  async handle() {
    return 'ok';
  }
}
