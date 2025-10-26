const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const xScoreText = document.getElementById('xScore');
const oScoreText = document.getElementById('oScore');
const drawScoreText = document.getElementById('drawScore');
const pvpBtn = document.getElementById('pvpBtn');
const aiBtn = document.getElementById('aiBtn');
const restartBtn = document.getElementById('restartBtn');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let aiMode = true;
let xScore = 0, oScore = 0, drawScore = 0;

const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

startGame();

function startGame() {
    cells.forEach(cell =>{
        cell.innerText = "";
        cell.addEventListener("click", cellClicked);
    });

    board = ["", "", "", "", "", "", "", "", ""];
    running = true;
    currentPlayer = "X";
    statusText.innerText = aiMode ? "Player vs AI — X goes first" : "Player vs Player — X goes first";
}

pvpBtn.addEventListener("click", () => {
    aiMode = false;
    aiBtn.classList.remove("active");
    pvpBtn.classList.add("active");
    restartGame();
});

aiBtn.addEventListener("click", () => {
    aiMode = true;
    pvpBtn.classList.remove("active");
    aiBtn.classList.add("active");
    restartGame();
});

restartBtn.addEventListener("click", restartGame);

function cellClicked() {
    const index = this.id;

    if (!running || board[index] !== "") return;

    // Human plays X in AI mode
    if (aiMode && currentPlayer !== "X") return;

    updateCell(this, index);

    if (aiMode && running) {
        setTimeout(() => {
            aiMove();
        }, 500);
    }
}



function updateCell(cell, index) {
    board[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add("filled");

    checkWinner();

    if (running) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}


function checkWinner() {
    for (let combo of winCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {

            // Highlight winning cells
            document.getElementById(a).classList.add("win");
            document.getElementById(b).classList.add("win");
            document.getElementById(c).classList.add("win");

            running = false;
            statusText.innerText = `${board[a]} Wins!`;

            if (board[a] === "X") xScore++;
            else oScore++;

            updateScore();
            return;
        }
    }

    if (!board.includes("")) {
        running = false;
        drawScore++;
        updateScore();
        statusText.innerText = "Draw!";
    }
}


function updateScore() {
    xScoreText.innerText = xScore;
    oScoreText.innerText = oScore;
    drawScoreText.innerText = drawScore;
}

function aiMove() {
    if (!aiMode || !running || currentPlayer !== "O") return;

    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    const cell = document.getElementById(bestMove);
    updateCell(cell, bestMove);
}


function minimax(board, depth, isMaximizing) {
    const winner = evaluateBoard();
    if (winner !== null) return winner;

    if(isMaximizing) {
        let best = -Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === "") {
                board[i] = "O";
                best = Math.max(best, minimax(board, depth+1, false));
                board[i] = "";
            }
        }
        return best;
    } else {
        let best = Infinity;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === "") {
                board[i] = "X";
                best = Math.min(best, minimax(board, depth+1, true));
                board[i] = "";
            }
        }
        return best;
    }
}

function evaluateBoard() {
    for(let combo of winCombos) {
        const [a,b,c] = combo;
        if(board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === "O" ? 10 : -10;
        }
    }
    return board.includes("") ? null : 0;
}

function restartGame() {
    board.fill("");
    cells.forEach(c => c.innerText = "");
    currentPlayer = "X";
    running = true;
    statusText.innerText = aiMode ? "Player vs AI — X goes first" : "Player vs Player — X goes first";
cells.forEach(c => {
    c.innerText = "";
    c.classList.remove("win");
    c.classList.remove("filled");
});
}
