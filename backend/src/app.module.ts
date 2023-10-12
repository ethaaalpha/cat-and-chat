import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeController } from './home/home.controller';
import { GatewayModule } from "./websocket/gateway.module";
import { GameModule } from "./game/game.module";

@Module({
  imports: [GatewayModule, GameModule],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
