# Bomb Dodger Game

A simple game where you control a player to dodge falling bombs.

## Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari)
*   Node.js and npm (for compiling TypeScript if you want to modify the source code)

## Setup (for development or modifying code)

If you want to modify the TypeScript code and recompile it:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2.  **Install dependencies:**
    This project uses TypeScript. The necessary dependency is listed in `package.json`.
    ```bash
    npm install
    ```

3.  **Compile TypeScript:**
    To compile the TypeScript code located in the `src` directory into JavaScript in the `dist` directory:
    ```bash
    npx tsc
    ```
    Or, if you installed TypeScript locally without `npx`:
    ```bash
    ./node_modules/.bin/tsc
    ```

## Running the Game

You have a couple of options to run the game:

1.  **Directly open `index.html`:**
    Simply open the `index.html` file in your web browser. The game is pre-compiled in the `dist` folder.

2.  **Using the `run.sh` script (Linux/macOS):**
    If you are on Linux or macOS, you can use the provided shell script:
    ```bash
    ./run.sh
    ```
    This script will attempt to open `index.html` in your default web browser. You might need to make it executable first if it isn't: `chmod +x run.sh`.

## How to Play

*   Use the **Left Arrow Key** to move the player left.
*   Use the **Right Arrow Key** to move the player right.
*   Avoid the falling red bombs.
*   Your score increases for every bomb you successfully dodge that goes off-screen.
*   If a bomb hits you, the game is over.
*   Press **"R"** to restart the game after a game over.
