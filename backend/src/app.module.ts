import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeController } from './home/home.controller';
import { GatewayModule } from "./websocket/gateway.module";



@Module({
  imports: [GatewayModule],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
