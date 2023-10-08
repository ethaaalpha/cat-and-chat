class Rectangle {
    X: number;
    Y: number;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    constructor(iX: number, iY: number, width: number, height: number, context: CanvasRenderingContext2D) {
        this.X = iX;
        this.Y = iY;
        this.width = width;
        this.height = height;
        this.ctx = context;

        this.#refresh();
    }
    #refresh(){ this.ctx.fillRect(this.X, this.Y, this.width, this.height); }

    moveTo(nX: number, nY: number) {
        this.ctx.clearRect(this.X, this.Y, this.width, this.height);
        this.X = nX;
        this.Y = nY;
        this.#refresh();
    }
}

