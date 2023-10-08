export declare class Player {
    X: number;
    Y: number;
    isJumping: boolean;
    constructor(X: number, Y: number);
    jump(): Promise<void>;
}
