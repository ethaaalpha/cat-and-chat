import { Module } from "@nestjs/common";
import { WSocketHandler } from "./events.gateway";

@Module({
  providers: [WSocketHandler]
})
export class GatewayModule {}