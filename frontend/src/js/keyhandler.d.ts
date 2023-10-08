declare class KeyHandler {
    keyW: boolean;
    keyS: boolean;
    keyD: boolean;
    keyA: boolean;
    keySpace: boolean;
    constructor();
    keyDown(e: KeyboardEvent): void;
    keyUp(e: KeyboardEvent): void;
}
export default KeyHandler;
