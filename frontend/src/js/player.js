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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(X, Y) {
        this.name = "default";
        this.X = X;
        this.Y = Y;
        this.isJumping = false;
    }
    changeCoords(nX, nY) {
        this.X = nX;
        this.Y = nY;
    }
    jump() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isJumping == true)
                return;
            const baseY = this.Y;
            let jumpForce = 3;
            let gravity = 3;
            let velocity = 1;
            this.isJumping = true;
            while (1) {
                if (velocity > 0) {
                    this.Y = this.Y - (velocity * jumpForce * (1));
                    velocity -= 1 / (30 * gravity);
                }
                else if (velocity < 0) {
                    while (velocity < 1) {
                        this.Y = this.Y + (velocity * jumpForce * (1));
                        velocity += 1 / (30 * gravity);
                        yield new Promise(resolve => setTimeout(resolve, 1));
                    }
                    this.Y = baseY;
                    break;
                }
                yield new Promise(resolve => setTimeout(resolve, 1));
            }
            this.isJumping = false;
        });
    }
}
exports.Player = Player;
