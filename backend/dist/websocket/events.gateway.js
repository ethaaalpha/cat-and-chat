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
exports.EventsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const console = require("console");
function getIndexByKey(map, keyToFind) {
    let index = 0;
    for (let [key] of map) {
        if (key === keyToFind) {
            return index;
        }
        index++;
    }
    return -1;
}
let EventsGateway = class EventsGateway {
    afterInit() {
        console.log("Initialized");
        this.clients = new Map;
    }
    handleConnection(client, ...args) {
        this.clients.set(client, JSON.stringify({ name: "default", x: "default", y: "default" }));
        console.log(`Client connected : ${this.clients.get(client)}`);
        for (let [c, id] of this.clients) {
            if (c != client) {
                c.send(JSON.stringify({ event: "add", data: this.clients.get(client), id: getIndexByKey(this.clients, client) }));
            }
        }
        client.send(JSON.stringify({ event: "init", id: getIndexByKey(this.clients, client) }));
        for (let [c, id] of this.clients) {
            if (c != client) {
                client.send(JSON.stringify({ event: "add", data: this.clients.get(client), id: getIndexByKey(this.clients, c) }));
            }
        }
    }
    handleDisconnect(client) {
        console.log(`Client disconnected : ${this.clients.get(client)}`);
        for (let [c, id] of this.clients) {
            c.send(JSON.stringify({ event: "remove", data: this.clients.get(client), id: getIndexByKey(this.clients, client) }));
        }
        this.clients.delete(client);
    }
    handleMessage(client, data) {
        this.clients.set(client, JSON.stringify({ name: data.name, x: data.x, y: data.y }));
        for (let [c, id] of this.clients) {
            if (c != client) {
                c.send(JSON.stringify({ event: "update", data: this.clients.get(client), id: getIndexByKey(this.clients, client) }));
            }
        }
    }
};
exports.EventsGateway = EventsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", Object)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("update"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleMessage", null);
exports.EventsGateway = EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: true,
        credentials: true,
        transports: "websockets"
    })
], EventsGateway);
//# sourceMappingURL=events.gateway.js.map