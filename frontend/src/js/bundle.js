(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapMaxY = exports.mapMaxX = void 0;
const keyhandler_js_1 = __importDefault(require("./keyhandler.js"));
const player_js_1 = require("./player.js");
const serverconnection_1 = require("./serverconnection");
const floor_color = '#9d858d';
const background_color = '#BFB8B8';
const velocity = 7;
exports.mapMaxX = 1280;
exports.mapMaxY = 720;
const ImageLoader = (path) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => { resolve(img); };
        img.onerror = e => { reject(e); };
    });
};
class Game {
    constructor(width, height, context) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.xRatio = width / exports.mapMaxX;
        this.yRatio = height / exports.mapMaxY;
        this.player = new player_js_1.Player(exports.mapMaxX / 2, exports.mapMaxY * 0.91);
        this.players = new Map;
        this.players.set(-1, this.player);
        this.keyHandler = new keyhandler_js_1.default();
    }
    render() {
        this.actualizePosition();
        this.createBackGround();
        this.createFloor();
        this.createPlayers();
        /* thing to here to render, like actualize position or things like that */
        window.requestAnimationFrame(this.render.bind(this));
    }
    initEventsListeners() {
        try {
            this.wbSocket = new serverconnection_1.SocketServer(this.players, this.player);
        }
        catch (e) {
            console.log(e);
        }
        document.addEventListener("keyup", (event) => this.keyHandler.keyUp(event));
        document.addEventListener("keydown", (event) => this.keyHandler.keyDown(event));
    }
    initDataLoaders() {
        return __awaiter(this, void 0, void 0, function* () {
            this.imgPlayer = yield ImageLoader("../data/png/player.png");
            this.imgTree = yield ImageLoader("../data/png/tree.png");
        });
    }
    resizementActualizing() {
        let canvas = document.getElementById("game-canvas");
        if (canvas == null)
            return;
        canvas.width = document.getElementsByClassName("body-first-block").item(0).clientWidth;
        canvas.height = document.getElementsByClassName("body-first-block").item(0).clientHeight * 0.9;
        this.width = canvas.width;
        this.height = canvas.height;
        this.xRatio = this.width / exports.mapMaxX;
        this.yRatio = this.height / exports.mapMaxY;
    }
    actualizePosition() {
        // -50 cause image size
        if (this.keyHandler.keyW && this.player.Y - 1 > 0)
            this.player.Y = this.player.Y - velocity;
        if (this.keyHandler.keyD && this.player.X + 1 < exports.mapMaxX * 0.95)
            this.player.X = this.player.X + velocity;
        if (this.keyHandler.keyS && this.player.Y + 1 < exports.mapMaxY * 0.95)
            this.player.Y = this.player.Y + velocity;
        if (this.keyHandler.keyA && this.player.X - 1 > 0)
            this.player.X = this.player.X - velocity;
        if (this.keyHandler.keySpace)
            this.player.jump();
    }
    createFloor() {
        this.context.fillStyle = floor_color;
        this.context.fillRect(0, this.height - 20 * this.yRatio, this.width, 20 * this.yRatio);
    }
    createPlayers() {
        this.players.forEach((player) => {
            this.context.drawImage(this.imgPlayer, player.X * this.xRatio, player.Y * this.yRatio, 50 * this.xRatio, 50 * this.yRatio);
        });
    }
    createBackGround() {
        this.context.fillStyle = background_color;
        this.context.fillRect(0, 0, this.width, this.height);
        for (let i = -50; i < this.width - 50; i = i + 60)
            this.context.drawImage(this.imgTree, i, this.height - 173 * this.yRatio, 200 * this.xRatio, 200 * this.yRatio);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = document.getElementById("game-canvas");
        if (canvas == null)
            return;
        // canvas.width = document.getElementsByClassName("body-first-block").item(0)!.clientWidth;
        // canvas.height = canvas.width * (16 / 9);
        canvas.height = document.getElementsByClassName("body-first-block").item(0).clientHeight * 0.8;
        canvas.width = canvas.height * (16 / 9);
        let game = new Game(canvas.width, canvas.height, canvas.getContext("2d"));
        window.onresize = () => {
            game.resizementActualizing();
        };
        game.initEventsListeners();
        yield game.initDataLoaders();
        game.render();
    });
}
main();

},{"./keyhandler.js":2,"./player.js":3,"./serverconnection":4}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class KeyHandler {
    constructor() {
        this.keyW = false;
        this.keyD = false;
        this.keyS = false;
        this.keyA = false;
        this.keySpace = false;
    }
    keyDown(e) {
        switch (e.key) {
            // case "s":
            //     this.keyS = true;
            //     break;
            // case "w":
            //     this.keyW = true;
            //     break;
            case "a":
                this.keyA = true;
                break;
            case "d":
                this.keyD = true;
                break;
            case " ":
                this.keySpace = true;
                break;
        }
    }
    keyUp(e) {
        switch (e.key) {
            // case "s":
            //     this.keyS = false;
            //     break;
            // case "w":
            //     this.keyW = false;
            //     break;
            case "d":
                this.keyD = false;
                break;
            case "a":
                this.keyA = false;
                break;
            case " ":
                this.keySpace = false;
                break;
        }
    }
}
exports.default = KeyHandler;

},{}],3:[function(require,module,exports){
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(X, Y) {
        this.name = "default";
        this.X = X;
        this.Y = Y;
        this.isJumping = false;
    }
    changeCoords(nX, nY) {
        this.X = nX;
        this.Y = nY;
    }
    jump() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isJumping == true)
                return;
            const baseY = this.Y;
            let jumpForce = 3;
            let gravity = 2.5; // 1 = forte 10 pas forte
            let velocity = 1;
            this.isJumping = true;
            while (1) {
                if (velocity > 0) {
                    this.Y = this.Y - (velocity * jumpForce * (1));
                    velocity -= 1 / (30 * gravity);
                }
                else if (velocity < 0) {
                    while (velocity < 1) {
                        this.Y = this.Y + (velocity * jumpForce * (1));
                        velocity += 1 / (30 * gravity);
                        yield new Promise(resolve => setTimeout(resolve, 1));
                    }
                    this.Y = baseY;
                    break;
                }
                yield new Promise(resolve => setTimeout(resolve, 1));
            }
            this.isJumping = false;
        });
    }
}
exports.Player = Player;

},{}],4:[function(require,module,exports){
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

},{"./game":1,"./player":3}],5:[function(require,module,exports){
"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Rectangle_instances, _Rectangle_refresh;
class Rectangle {
    constructor(iX, iY, width, height, context) {
        _Rectangle_instances.add(this);
        this.X = iX;
        this.Y = iY;
        this.width = width;
        this.height = height;
        this.ctx = context;
        __classPrivateFieldGet(this, _Rectangle_instances, "m", _Rectangle_refresh).call(this);
    }
    moveTo(nX, nY) {
        this.ctx.clearRect(this.X, this.Y, this.width, this.height);
        this.X = nX;
        this.Y = nY;
        __classPrivateFieldGet(this, _Rectangle_instances, "m", _Rectangle_refresh).call(this);
    }
}
_Rectangle_instances = new WeakSet(), _Rectangle_refresh = function _Rectangle_refresh() { this.ctx.fillRect(this.X, this.Y, this.width, this.height); };

},{}]},{},[1,2,3,4,5]);
