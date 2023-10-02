import Keyhandler from './keyhandler.js';
import { Player } from './player.js';
import keyhandler from './keyhandler.js';

const floor_color: string = '#9d858d';
const background_color: string = '#BFB8B8';
const velocity: number = 2;

const ImageLoader = (path: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = path;
        img.onload = () => { resolve(img); };
        img.onerror = e => { reject(e); };
    });
}
class Game {
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    player: Player;
    keyHandler: keyhandler;

    imgPlayer!: HTMLImageElement;
    imgTree!: HTMLImageElement;
    constructor(width: number, height: number, context: CanvasRenderingContext2D) {
        this.width = width;
        this.height = height;
        this.context = context;
        this.player = new Player(width / 2 - 25, height - 66);
        this.keyHandler = new Keyhandler();
    }

    render() {
        this.actualizePosition();
        this.createBackGround();
        this.createFloor();
        this.createPlayer();
        /* thing to here to render, like actualize position or things like that */
        window.requestAnimationFrame(this.render.bind(this));
    }
    initEventsListeners() {
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
        if (this.keyHandler.keyW == true && this.player.Y - 1 > 0)
            this.player.Y = this.player.Y - 1 * velocity;
        if (this.keyHandler.keyD == true && this.player.X + 1 < this.width - 50)
            this.player.X = this.player.X + 1 * velocity;
        if (this.keyHandler.keyS == true && this.player.Y + 1 < this.height - 70)
            this.player.Y = this.player.Y + 1 * velocity;
        if (this.keyHandler.keyA == true && this.player.X - 1 > 0)
            this.player.X = this.player.X - 1 * velocity;
        if (this.keyHandler.keySpace == true)
            this.player.jump();
    }
    createFloor() {
        this.context.fillStyle = floor_color;
        this.context.fillRect(0, this.height - 20, this.width, 20);
    }

    createPlayer() {
        this.context.drawImage(this.imgPlayer, this.player.X, this.player.Y, 50, 50);
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

const foo = async () => {
    const bar = await main();
};