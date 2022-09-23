import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AllExceptionsFilter } from './utils/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  (app as any).set("etag", false);

  const config = new DocumentBuilder()
    .setTitle("Todo List")
    .setDescription("ABC Todo List Simple Application 1")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  app.use((req, res, next) => {
    res.removeHeader("x-powered-by");
    res.removeHeader("date");
    next();
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.useGlobalFilters(new AllExceptionsFilter());


  await app.listen(8080);
}
bootstrap();
