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
