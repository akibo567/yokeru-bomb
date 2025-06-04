// Import the Game class if you decided to export it from game.ts
// If Game is not exported as default, use:
// import { Game } from './game';
// For now, assuming Game is a global class available after game.ts is loaded,
// or that game.ts and app.ts will be compiled into a single bundle
// where Game is accessible.

window.onload = () => {
    const game = new Game('gameCanvas');
    game.startGame(); // Add a method to explicitly start the game if needed
};
