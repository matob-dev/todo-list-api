import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './AppModule'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Todo List API')
    .setDescription('API de tarefas armazenadas apenas em memória.')
    .setVersion('1.0')
    .build()
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig))

  await app.listen(process.env.API_PORT ?? 3000)
}

bootstrap().catch((error: unknown) => {
  console.error('Erro ao iniciar a aplicação:', error)
  process.exit(1)
})
