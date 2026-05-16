import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  // Paksa IPv4 agar koneksi SMTP Gmail tidak timeout
  const { setDefaultResultOrder } = require('dns');
  setDefaultResultOrder('ipv4first');

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: "http://localhost:3001",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  await app.listen(3000);
}

bootstrap();