import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:3000',
  });

  const swagger = new DocumentBuilder()
    .setTitle('Nest JS Course - App API')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('http://localhost:5000')
    .setTermsOfService('http://localhost:5000/terms-of-service')
    .setLicense('MIT License', 'https://google.com')
    .build();
  const documentation = SwaggerModule.createDocument(app, swagger);
  // http://localhost:5000/abc
  // SwaggerModule.setup('abc', app, documentation);
  SwaggerModule.setup('swagger', app, documentation);

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
