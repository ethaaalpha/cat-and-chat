import KeyHandler from './keyhandler.js';
import { Player } from './player.js';
import { SocketServer } from "./serverconnection";
// import { io } from "socket.io-client";

const floor_color: string = '#9d858d';
const background_color: string = '#BFB8B8';
const velocity: number = 7;

const ImageLoader = (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => { resolve(img); };
        img.onerror = e => { reject(e); };
    });
}
class Game {
    players: Map<number, Player>;
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    player: Player;
    keyHandler: KeyHandler;

    imgPlayer!: HTMLImageElement;
    imgTree!: HTMLImageElement;
    wbSocket!: SocketServer;
    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.player = new Player(250, 250);
        this.players = new Map<number, Player>;
        this.players.set(-1, this.player);
        this.keyHandler = new KeyHandler();
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
            this.wbSocket = new SocketServer(this.players, this.player);
        } catch (e) {
            console.log(e);
        }
        document.addEventListener("keyup", (event) => this.keyHandler.keyUp(event));
        document.addEventListener("keydown", (event) => this.keyHandler.keyDown(event));
    }

    async initDataLoaders() {
        this.imgPlayer = await ImageLoader("../data/png/player.png");
        this.imgTree = await ImageLoader("../data/png/tree.png");
    }
    resizementActualizing() {
        let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
        if (canvas == null)
            return ;
        canvas.width = document.getElementsByClassName("body-first-block").item(0)!.clientWidth;
        canvas.height = document.getElementsByClassName("body-first-block").item(0)!.clientHeight * 0.9;

        this.width = canvas!.width;
        this.height = canvas!.height;
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
        for (let i = 0; i < this.players.size; i++)
        {
            const player = this.players.get(i);
            console.log(player);
            this.context.drawImage(this.imgPlayer, player!.X, player!.Y, 50, 50);
        }
    }

    createBackGround() {
        this.context.fillStyle = background_color;
        this.context.fillRect(0, 0, this.width, this.height);
        for (let i = -50; i < this.width - 50; i = i + 60)
            this.context.drawImage(this.imgTree, i, this.height - 135, 150, 150);
    }

}
async function main() {
    let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    if (canvas == null)
        return ;
    canvas.width = document.getElementsByClassName("body-first-block").item(0)!.clientWidth;
    canvas.height = document.getElementsByClassName("body-first-block").item(0)!.clientHeight * 0.9;

    let game = new Game(canvas.width, canvas.height, canvas.getContext("2d")!);
    window.onresize = () => {
        game.resizementActualizing()
    };
    game.initEventsListeners();
    await game.initDataLoaders();
    game.render();
}
main();