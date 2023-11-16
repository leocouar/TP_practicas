import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.NESTJS_API_PORT || 3300;

const subPathSwaggerDoc = 'api/docs';

async function bootstrap() {
  // Cargar las variables de entorno antes de crear la aplicación
  config();

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });

  const options = new DocumentBuilder()
    .setTitle('User-manager')
    .setDescription('Manejador de usuarios')
    .setVersion('1.0')
    .addTag('UserManager')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(subPathSwaggerDoc, app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: false,
    }),
  );

  await app.listen(port);
  console.log('---------------');
  console.log(`swagger doc on http://localhost:${port}/${subPathSwaggerDoc}`);
  console.log(
    'documentation swagger doc on https://docs.nestjs.com/openapi/types-and-parameters',
  );
  console.log('---------------');

  console.log('---------------');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log('---------------');
}
bootstrap();
