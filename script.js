document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("gameBoard");
    const status = document.getElementById("status");
    const restartBtn = document.getElementById("restartBtn");
    const twoPlayerBtn = document.getElementById("twoPlayerBtn");
    const vsComputerBtn = document.getElementById("vsComputerBtn");

    let cells, currentPlayer, isGameOver, gameMode, boardState;

    function initializeGame(mode) {
        board.innerHTML = "";
        cells = [];
        currentPlayer = "X";
        isGameOver = false;
        gameMode = mode;
        boardState = Array(9).fill(null);
        status.textContent = `Player ${currentPlayer}'s turn`;

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.index = i;
            cell.addEventListener("click", handleCellClick);
            board.appendChild(cell);
            cells.push(cell);
        }

        restartBtn.style.display = "block";
    }

    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (boardState[index] || isGameOver) return;

        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;

        if (checkWinner()) {
            status.textContent = `Player ${currentPlayer} wins!`;
            isGameOver = true;
            return;
        }

        if (boardState.every(cell => cell)) {
            status.textContent = "It's a draw!";
            isGameOver = true;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Player ${currentPlayer}'s turn`;

        if (gameMode === "computer" && currentPlayer === "O" && !isGameOver) {
            setTimeout(computerMove, 500); // Delay for realism
        }
    }

    function computerMove() {
        let move = findBestMove();
        boardState[move] = "O";
        cells[move].textContent = "O";

        if (checkWinner()) {
            status.textContent = `Player O wins!`;
            isGameOver = true;
            return;
        }

        if (boardState.every(cell => cell)) {
            status.textContent = "It's a draw!";
            isGameOver = true;
            return;
        }

        currentPlayer = "X";
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    function findBestMove() {
        // Check if there's a winning move for the computer
        for (let i = 0; i < 9; i++) {
            if (!boardState[i]) {
                boardState[i] = "O";
                if (checkWinner()) {
                    boardState[i] = null;
                    return i;
                }
                boardState[i] = null;
            }
        }

        // Check if there's a move to block the player from winning
        for (let i = 0; i < 9; i++) {
            if (!boardState[i]) {
                boardState[i] = "X";
                if (checkWinner()) {
                    boardState[i] = null;
                    return i;
                }
                boardState[i] = null;
            }
        }

        // Otherwise, choose a random available move
        let availableCells = boardState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
        return availableCells[Math.floor(Math.random() * availableCells.length)];
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
        });
    }

    twoPlayerBtn.addEventListener("click", () => initializeGame("twoPlayer"));
    vsComputerBtn.addEventListener("click", () => initializeGame("computer"));
    restartBtn.addEventListener("click", () => initializeGame(gameMode));

    // Initialize with two player mode by default
    initializeGame("twoPlayer");
});
