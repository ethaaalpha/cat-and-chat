import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from "@nestjs/platform-ws";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({
    origin: "http://localhost:63342/cat_and_chat/frontend/src/html/game.html",
    credentials: true
  });
  await app.listen(3000);
}
bootstrap();
