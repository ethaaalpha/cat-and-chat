import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: any;
    clients: Map<Socket, string>;
    afterInit(): void;
    handleConnection(client: Socket, ...args: any[]): void;
    handleDisconnect(client: any): void;
    handleMessage(client: any, data: any): void;
}
