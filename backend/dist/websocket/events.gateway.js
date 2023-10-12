"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSocketHandler = void 0;
const websockets_1 = require("@nestjs/websockets");
const console = require("console");
let WSocketHandler = class WSocketHandler {
    afterInit() {
        console.log("Initialized");
        this.clients = new Map;
        this.ids = new Map;
        this.connectionsHandled = 0;
    }
    handleConnection(client, ...args) {
        this.clients.set(client, JSON.stringify({ name: "default", x: "default", y: "default" }));
        this.ids.set(client, this.connectionsHandled);
        this.connectionsHandled++;
        console.log(`Client connected : ${this.clients.get(client)}`);
        for (let [c, id] of this.clients) {
            if (c != client) {
                c.send(JSON.stringify({ event: "add", data: this.clients.get(client), id: this.ids.get(client) }));
            }
        }
        client.send(JSON.stringify({ event: "init", id: this.ids.get(client) }));
        for (let [c, id] of this.clients) {
            if (c != client) {
                client.send(JSON.stringify({ event: "add", data: this.clients.get(client), id: this.ids.get(c) }));
            }
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected : ${this.clients.get(client)}`);
        for (let [c, id] of this.clients) {
            c.send(JSON.stringify({ event: "remove", data: this.clients.get(client), id: this.ids.get(client) }));
        }
        this.clients.delete(client);
        this.ids.delete(client);
    }
    handleMessage(client, data) {
        this.clients.set(client, JSON.stringify({ name: data.name, x: data.x, y: data.y }));
        for (let [c, id] of this.clients) {
            if (c != client) {
                c.send(JSON.stringify({ event: "update", data: this.clients.get(client), id: this.ids.get(client) }));
            }
        }
    }
};
exports.WSocketHandler = WSocketHandler;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], WSocketHandler.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WSocketHandler.prototype, "handleMessage", null);
exports.WSocketHandler = WSocketHandler = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        credentials: true,
        transports: "websockets"
    })
], WSocketHandler);
//# sourceMappingURL=events.gateway.js.map