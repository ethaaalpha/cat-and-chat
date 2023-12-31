import {Player} from "./player.js";
class KeyHandler {
    keyW: boolean;
    keyS: boolean;
    keyD: boolean;
    keyA: boolean;
    keySpace: boolean;
    constructor() {
        this.keyW = false;
        this.keyD = false;
        this.keyS = false;
        this.keyA = false;
        this.keySpace = false;
    }
    keyDown(e: KeyboardEvent) {
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

    keyUp(e: KeyboardEvent) {
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
export default KeyHandler;
