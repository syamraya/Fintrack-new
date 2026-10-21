// import { NestFactory } from "@nestjs/core";
// import { ValidationPipe } from "@nestjs/common";
// import { AppModule } from "./app.module";

// async function bootstrap() {
//   // Paksa IPv4 agar koneksi SMTP Gmail tidak timeout
//   const { setDefaultResultOrder } = require('dns');
//   setDefaultResultOrder('ipv4first');

//   const app = await NestFactory.create(AppModule);
//   app.enableCors({
//     origin: [
//       "http://localhost:3000", 
//       "https://fintrack-new-pi.vercel.app",
//       "https://fintrack-qajd3eo2e-syamrayas-projects.vercel.app",
//       "https://fintrack-new-backend.vercel.app/"
//     ],
//     credentials: true,
//   });


//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//       transform: true,
//     })
//   );

//   await app.listen(3001);
// }

// bootstrap();




import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { setDefaultResultOrder } from "node:dns";
import { AppModule } from "./app.module";

async function bootstrap() {
  setDefaultResultOrder("ipv4first");

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      "http://localhost:3000",
      "https://fintrack-new-pi.vercel.app",
    ],
    credentials: true,
    methods: [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000, "0.0.0.0");
}

bootstrap().catch((error) => {
  console.error("NestJS startup failed:", error);
  process.exitCode = 1;
});

