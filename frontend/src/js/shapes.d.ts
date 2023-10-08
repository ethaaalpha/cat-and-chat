declare class Rectangle {
    #private;
    X: number;
    Y: number;
    width: number;
    height: number;
    ctx: CanvasRenderingContext2D;
    constructor(iX: number, iY: number, width: number, height: number, context: CanvasRenderingContext2D);
    moveTo(nX: number, nY: number): void;
}
