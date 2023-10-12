import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from "@nestjs/websockets";
import * as console from "console";
import { Socket } from 'socket.io';

@WebSocketGateway( {
  cors: true,
  credentials: true,
  transports: "websockets"
})
export class WSocketHandler implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: any;
  clients: Map<Socket, string>;
  ids: Map<Socket, number>;
  connectionsHandled: number;
  afterInit() {
    console.log("Initialized");
    this.clients = new Map<Socket, string>;
    this.ids = new Map<Socket, number>;
    this.connectionsHandled = 0;
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.clients.set(client, JSON.stringify({name: "default", x: "default", y: "default"}));
    this.ids.set(client, this.connectionsHandled);
    this.connectionsHandled++;

    console.log(`Client connected : ${this.clients.get(client)}`);

    // update others players
    for (let [c, id] of this.clients){
      if (c != client) {
        c.send(JSON.stringify({event: "add", data: this.clients.get(client), id: this.ids.get(client)}));
      }
    }

    // init new player
    client.send(JSON.stringify({event: "init", id: this.ids.get(client)}))

    // update new player
    for (let [c, id] of this.clients){
      if (c != client) {
        client.send(JSON.stringify({event: "add", data: this.clients.get(client), id: this.ids.get(c)}));
      }
    }
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected : ${this.clients.get(client)}`);
    for (let [c, id] of this.clients){
        c.send(JSON.stringify({event: "remove", data: this.clients.get(client), id: this.ids.get(client)}));
    }
    this.clients.delete(client);
    this.ids.delete(client);
  }

  @SubscribeMessage("update")
  handleMessage(client: any, data: any) {
    // update others players
    this.clients.set(client, JSON.stringify({name: data.name, x: data.x, y: data.y}))
    for (let [c, id] of this.clients){
      if (c != client) {
        c.send(JSON.stringify({event: "update", data: this.clients.get(client), id: this.ids.get(client)}));
      }
    }
    // return {
    //   event: "ok",
    //   data: "this is the return value for connect",
    // };
  }
}