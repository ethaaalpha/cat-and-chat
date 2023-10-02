export class Player {
    constructor(X, Y) {
        this.X = X;
        this.Y = Y;
        this.isJumping = false;
    }
    async jump() {
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
                    await new Promise(resolve => setTimeout(resolve, 2));
                }
                this.Y = baseY;
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 2));
        }
        this.isJumping = false;
    }
}
