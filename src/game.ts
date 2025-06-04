// Interfaces
interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    draw(ctx: CanvasRenderingContext2D): void;
    update?(...args: any[]): void;
}

interface Player extends GameObject {
    speed: number;
    checkCollision(bomb: Bomb): boolean;
}

interface Bomb extends GameObject {
    speed: number;
}

// Player Class
class PlayerImpl implements Player {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;

    constructor(canvasWidth: number, canvasHeight: number) {
        this.width = 50;
        this.height = 50;
        this.x = (canvasWidth - this.width) / 2;
        this.y = canvasHeight - this.height - 10;
        this.color = 'blue';
        this.speed = 15; // Increased speed
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(direction: 'left' | 'right' | null, canvasWidth: number): void {
        if (direction === 'left') {
            this.x -= this.speed;
        } else if (direction === 'right') {
            this.x += this.speed;
        }

        // Keep player within canvas bounds
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvasWidth) {
            this.x = canvasWidth - this.width;
        }
    }

    checkCollision(bomb: Bomb): boolean {
        return (
            this.x < bomb.x + bomb.width &&
            this.x + this.width > bomb.x &&
            this.y < bomb.y + bomb.height &&
            this.y + this.height > bomb.y
        );
    }
}

// Bomb Class
class BombImpl implements Bomb {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;

    constructor(canvasWidth: number) {
        this.width = 30;
        this.height = 30;
        this.x = Math.random() * (canvasWidth - this.width);
        this.y = -this.height; // Start above the screen
        this.color = 'red';
        this.speed = 3 + Math.random() * 3; // Vary bomb speed
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update(canvasHeight: number): void {
        this.y += this.speed;
    }
}

// Game Class
class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    player: Player;
    bombs: Bomb[];
    score: number;
    gameOver: boolean;
    bombSpawnTimer: number;
    bombSpawnInterval: number; // milliseconds
    animationFrameId: number | null = null;
    currentDirection: 'left' | 'right' | null = null;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.player = new PlayerImpl(this.canvas.width, this.canvas.height);
        this.bombs = [];
        this.score = 0;
        this.gameOver = false;
        this.bombSpawnTimer = 0;
        this.bombSpawnInterval = 1000; // Spawn a bomb every 1 second

        this.handleInput();
        this.gameLoop = this.gameLoop.bind(this); // Ensure 'this' is correct in gameLoop
    }

    spawnBomb(): void {
        const newBomb = new BombImpl(this.canvas.width);
        this.bombs.push(newBomb);
    }

    updateGame(deltaTime: number): void {
        if (this.gameOver) return;

        this.player.update!(this.currentDirection, this.canvas.width); // Pass direction and canvas width

        // Update bombs and check for collisions
        for (let i = this.bombs.length - 1; i >= 0; i--) {
            const bomb = this.bombs[i];
            bomb.update!(this.canvas.height);

            if (this.player.checkCollision(bomb)) {
                this.gameOver = true;
                return;
            }

            // Remove bombs that go off-screen
            if (bomb.y > this.canvas.height) {
                this.bombs.splice(i, 1);
                this.score++;
            }
        }

        // Spawn new bombs
        this.bombSpawnTimer += deltaTime;
        if (this.bombSpawnTimer > this.bombSpawnInterval) {
            this.spawnBomb();
            this.bombSpawnTimer = 0;
            // Decrease spawn interval to increase difficulty, but not too fast
            if (this.bombSpawnInterval > 300) {
                 this.bombSpawnInterval -= 20;
            }
        }
    }

    drawGame(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.player.draw(this.ctx);

        for (const bomb of this.bombs) {
            bomb.draw(this.ctx);
        }

        // Draw score
        this.ctx.fillStyle = 'black';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        // Draw game over message
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2 - 30);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Final Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
            this.ctx.fillText('Press "R" to Restart', this.canvas.width / 2, this.canvas.height / 2 + 70);
        }
    }

    lastTime: number = 0;
    gameLoop(timestamp: number = 0): void {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if (!this.gameOver) {
            this.updateGame(deltaTime);
        }
        this.drawGame();

        this.animationFrameId = requestAnimationFrame(this.gameLoop);
    }

    handleInput(): void {
        document.addEventListener('keydown', (event) => {
            if (this.gameOver && event.key.toLowerCase() === 'r') {
                this.resetGame();
            } else if (!this.gameOver) {
                if (event.key === 'ArrowLeft') {
                    this.currentDirection = 'left';
                } else if (event.key === 'ArrowRight') {
                    this.currentDirection = 'right';
                }
            }
        });

        document.addEventListener('keyup', (event) => {
            if (!this.gameOver) {
                if (event.key === 'ArrowLeft' && this.currentDirection === 'left') {
                    this.currentDirection = null;
                } else if (event.key === 'ArrowRight' && this.currentDirection === 'right') {
                    this.currentDirection = null;
                }
            }
        });
    }

    resetGame(): void {
        this.player = new PlayerImpl(this.canvas.width, this.canvas.height);
        this.bombs = [];
        this.score = 0;
        this.gameOver = false;
        this.bombSpawnTimer = 0;
        this.bombSpawnInterval = 1000;
        this.currentDirection = null;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.lastTime = 0; // Reset lastTime for deltaTime calculation
        this.gameLoop();
    }

    startGame(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId); // Clear any existing loop
        }
        this.lastTime = 0; // Reset lastTime for deltaTime calculation
        this.gameLoop();
    }
}

// Export the Game class if it's going to be imported by app.ts
// If app.ts just instantiates it, this might not be strictly necessary
// depending on how you structure app.ts and compile.
// For now, let's assume app.ts will create the instance.
// export default Game; // This line might be needed if app.ts imports Game
