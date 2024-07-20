import { PipeTransform, BadRequestException } from '@nestjs/common'; // Importa as interfaces 'PipeTransform' e 'BadRequestException' do pacote '@nestjs/common'.
import { ZodError, ZodSchema } from 'zod'; // Importa as classes 'ZodError' e 'ZodSchema' do pacote 'zod'.
import { fromZodError } from 'zod-validation-error'; // Importa a função 'fromZodError' do pacote 'zod-validation-error'.

export class ZodValidationPipe implements PipeTransform {
  // Define uma classe 'ZodValidationPipe' que implementa a interface 'PipeTransform'.
  constructor(private schema: ZodSchema) {} // Construtor que aceita um schema do tipo 'ZodSchema' e o armazena na propriedade 'schema'.

  transform(value: unknown) {
    // Método 'transform' que recebe um valor desconhecido.
    try {
      const parsedValue = this.schema.parse(value); // Tenta parsear o valor usando o schema fornecido.
      return parsedValue; // Retorna o valor parseado se não houver erros.
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se o erro é uma instância de 'ZodError'.
        throw new BadRequestException({
          // Lança uma exceção 'BadRequestException' com detalhes do erro de validação.
          message: 'Validation failed',
          statusCode: 400,
          error: fromZodError(error), // Usa 'fromZodError' para formatar o erro.
        });
      }

      throw new BadRequestException('Validation failed'); // Lança uma exceção genérica 'BadRequestException' se o erro não for um 'ZodError'.
    }
  }
}
