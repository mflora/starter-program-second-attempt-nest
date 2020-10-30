import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { request } from 'express';
import { URL } from 'url';

async function bootstrap() {
  const path = 'swagger-ui';
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path, app, document);

  await app.listen(process.env.PORT, () => {
    console.log("Server started at: http://localhost:" + process.env.PORT);
    console.log("Swagger UI: http://localhost:" + process.env.PORT + document.servers + path);
    console.log("Swagger JSON: http://localhost:" + process.env.PORT + document.servers + path + '-json');


  });
  console.log(app.getUrl());
}
bootstrap();
