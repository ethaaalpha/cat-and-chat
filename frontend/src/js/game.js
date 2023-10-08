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
const keyhandler_js_1 = __importDefault(require("./keyhandler.js"));
const player_js_1 = require("./player.js");
const serverconnection_1 = require("./serverconnection");
// import { io } from "socket.io-client";
const floor_color = '#9d858d';
const background_color = '#BFB8B8';
const velocity = 7;
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
        this.player = new player_js_1.Player(250, 250);
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
    }
    actualizePosition() {
        // -50 cause image size
        if (this.keyHandler.keyW && this.player.Y - 1 > 0)
            this.player.Y = this.player.Y - velocity;
        if (this.keyHandler.keyD && this.player.X + 1 < this.width - 50)
            this.player.X = this.player.X + velocity;
        if (this.keyHandler.keyS && this.player.Y + 1 < this.height - 70)
            this.player.Y = this.player.Y + velocity;
        if (this.keyHandler.keyA && this.player.X - 1 > 0)
            this.player.X = this.player.X - velocity;
        if (this.keyHandler.keySpace)
            this.player.jump();
    }
    createFloor() {
        this.context.fillStyle = floor_color;
        this.context.fillRect(0, this.height - 20, this.width, 20);
    }
    createPlayers() {
        for (let i = 0; i < this.players.size; i++) {
            const player = this.players.get(i);
            console.log(player);
            this.context.drawImage(this.imgPlayer, player.X, player.Y, 50, 50);
        }
    }
    createBackGround() {
        this.context.fillStyle = background_color;
        this.context.fillRect(0, 0, this.width, this.height);
        for (let i = -50; i < this.width - 50; i = i + 60)
            this.context.drawImage(this.imgTree, i, this.height - 135, 150, 150);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let canvas = document.getElementById("game-canvas");
        if (canvas == null)
            return;
        canvas.width = document.getElementsByClassName("body-first-block").item(0).clientWidth;
        canvas.height = document.getElementsByClassName("body-first-block").item(0).clientHeight * 0.9;
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
