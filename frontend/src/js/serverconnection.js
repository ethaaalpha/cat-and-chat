"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SocketServer_instances, _SocketServer_makeServerRuntime, _SocketServer_sendMessage, _SocketServer_handleServerListener, _SocketServer_makeLoopUpdate;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const player_1 = require("./player");
const game_1 = require("./game");
class SocketServer {
    constructor(players, localPlayer) {
        _SocketServer_instances.add(this);
        this.wbSocket = new WebSocket("ws://localhost:3000");
        this.players = players;
        this.localPlayer = localPlayer;
        this.id = -1;
        __classPrivateFieldGet(this, _SocketServer_instances, "m", _SocketServer_makeServerRuntime).call(this);
    }
}
exports.SocketServer = SocketServer;
_SocketServer_instances = new WeakSet(), _SocketServer_makeServerRuntime = function _SocketServer_makeServerRuntime() {
    this.wbSocket.addEventListener('open', (event) => {
        console.log("Browser connected to server !");
        __classPrivateFieldGet(this, _SocketServer_instances, "m", _SocketServer_makeLoopUpdate).call(this);
        __classPrivateFieldGet(this, _SocketServer_instances, "m", _SocketServer_handleServerListener).call(this);
    });
}, _SocketServer_sendMessage = function _SocketServer_sendMessage(message) {
    this.wbSocket.send(JSON.stringify(message));
}, _SocketServer_handleServerListener = function _SocketServer_handleServerListener() {
    this.wbSocket.onmessage = (event) => {
        var _a;
        const message = JSON.parse(event.data);
        console.log(message);
        switch (message.event) {
            case "init":
                this.players.set(message.id, this.players.get(-1));
                this.id = message.id;
                this.players.delete(-1);
                break;
            case "add":
                const values = JSON.parse(message.data);
                if (values.x === "default") {
                    this.players.set(message.id, new player_1.Player(game_1.mapMaxX / 2, game_1.mapMaxY * 0.91));
                }
                else {
                    this.players.set(message.id, new player_1.Player(values.x, values.y));
                }
                break;
            case "remove":
                console.log("to delete " + message);
                this.players.delete(message.id);
                console.log(this.players);
                break;
            case "update":
                const value = JSON.parse(message.data);
                (_a = this.players.get(message.id)) === null || _a === void 0 ? void 0 : _a.changeCoords(value.x, value.y);
                break;
        }
    };
}, _SocketServer_makeLoopUpdate = function _SocketServer_makeLoopUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            yield new Promise(resolve => setTimeout(resolve, 1));
            // console.log("SENDED");
            this.wbSocket.send(JSON.stringify({ event: "update", data: {
                    name: this.localPlayer.name,
                    x: this.localPlayer.X,
                    y: this.localPlayer.Y,
                    id: this.id
                } }));
        }
    });
};
