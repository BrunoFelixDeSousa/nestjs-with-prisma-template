import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Importa a classe 'PrismaClient' do pacote '@prisma/client'.

@Injectable()
// Estende a classe 'PrismaClient' para herdar suas funcionalidades.
// Implementa as interfaces 'OnModuleInit' e 'OnModuleDestroy'.
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: ['error', 'info', 'query', 'warn'], // Configura o PrismaClient para registrar diferentes níveis de log.
    });
  }

  onModuleInit() {
    return this.$connect(); // Método chamado quando o módulo é inicializado; conecta o PrismaClient ao banco de dados.
  }

  onModuleDestroy() {
    return this.$disconnect(); // Método chamado quando o módulo é destruído; desconecta o PrismaClient do banco de dados.
  }
}
