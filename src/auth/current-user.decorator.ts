import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Cria um decorator personalizado para obter o usuário atual da requisição
export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    // Obtém a requisição HTTP do contexto de execução
    const request = context.switchToHttp().getRequest();

    // Retorna o objeto 'user' que foi anexado à requisição pelo guard de autenticação JWT
    return request.user;
  },
);
