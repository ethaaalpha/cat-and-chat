import KeyHandler from './keyhandler.js';
import { Player } from './player.js';
import { SocketServer } from "./serverconnection";

const floor_color: string = '#9d858d';
const background_color: string = '#BFB8B8';
const velocity: number = 7;

export const mapMaxX: number = 1280;
export const mapMaxY: number = 720;

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
    xRatio: number;
    yRatio: number;

    imgPlayer!: HTMLImageElement;
    imgTree!: HTMLImageElement;
    wbSocket!: SocketServer;
    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.xRatio = width / mapMaxX;
        this.yRatio = height / mapMaxY;
        this.player = new Player(mapMaxX / 2, mapMaxY * 0.91);
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
        this.xRatio = this.width / mapMaxX;
        this.yRatio = this.height / mapMaxY;
    }

    actualizePosition() {
        // -50 cause image size
        if (this.keyHandler.keyW && this.player.Y - 1 > 0)
            this.player.Y = this.player.Y - velocity;
        if (this.keyHandler.keyD && this.player.X + 1 < mapMaxX * 0.95)
            this.player.X = this.player.X + velocity;
        if (this.keyHandler.keyS && this.player.Y + 1 < mapMaxY * 0.95)
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
async function main() {
    let canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
    if (canvas == null)
        return ;
    // canvas.width = document.getElementsByClassName("body-first-block").item(0)!.clientWidth;
    // canvas.height = canvas.width * (16 / 9);
    canvas.height = document.getElementsByClassName("body-first-block").item(0)!.clientHeight * 0.8;
    canvas.width = canvas.height * (16 / 9);

    let game = new Game(canvas.width, canvas.height, canvas.getContext("2d")!);
    window.onresize = () => {
        game.resizementActualizing()
    };
    game.initEventsListeners();
    await game.initDataLoaders();
    game.render();
}
main();