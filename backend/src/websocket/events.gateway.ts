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
import { createInvalidObservableTypeError } from "rxjs/internal/util/throwUnobservableError";

function getIndexByKey(map: any, keyToFind: any) {
  let index = 0;
  for (let [key] of map) {
    if (key === keyToFind) {
      return index;
    }
    index++;
  }
  return -1;
}

@WebSocketGateway( {
  cors: true,
  credentials: true,
  transports: "websockets"
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: any;
  clients: Map<Socket, string>;
  afterInit() {
    console.log("Initialized");
    this.clients = new Map<Socket, string>;
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.clients.set(client, JSON.stringify({name: "default", x: "default", y: "default"}));
    console.log(`Client connected : ${this.clients.get(client)}`);

    // update others players
    for (let [c, id] of this.clients){
      if (c != client) {
        c.send(JSON.stringify({event: "add", data: this.clients.get(client), id: getIndexByKey(this.clients, client)}));
      }
    }

    // init new player
    client.send(JSON.stringify({event: "init", id: getIndexByKey(this.clients, client)}))

    // update new player
    for (let [c, id] of this.clients){
      if (c != client) {
        client.send(JSON.stringify({event: "add", data: this.clients.get(client), id: getIndexByKey(this.clients, c)}));
      }
    }
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected : ${this.clients.get(client)}`);
    for (let [c, id] of this.clients){
        c.send(JSON.stringify({event: "remove", data: this.clients.get(client), id: getIndexByKey(this.clients, client)}));
    }
    this.clients.delete(client);
  }

  @SubscribeMessage("update")
  handleMessage(client: any, data: any) {
    // update others players
    this.clients.set(client, JSON.stringify({name: data.name, x: data.x, y: data.y}))
    for (let [c, id] of this.clients){
      if (c != client) {
        c.send(JSON.stringify({event: "update", data: this.clients.get(client), id: getIndexByKey(this.clients, client)}));
      }
    }
    // return {
    //   event: "ok",
    //   data: "this is the return value for connect",
    // };
  }
}