const board = document.querySelector('#board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('#reset');

let gameBoard = ['', '', '', '', '', '', '', '', ''];
const player = 'X';
const ai = 'O';

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetGame);

function handleClick(e) {
    const index = e.target.getAttribute('data-index');
    if (gameBoard[index] === '') {
        gameBoard[index] = player;
        e.target.textContent = player;

        if (checkWin(gameBoard, player)) {
            setTimeout(() => alert('You win!'), 100);
            return;
        } else if (isBoardFull(gameBoard)) {
            setTimeout(() => alert('Draw!'), 100);
            return;
        }

        aiMove();
    }
}

function aiMove() {
    const bestMove = getBestMove(gameBoard, ai);
    gameBoard[bestMove] = ai;
    cells[bestMove].textContent = ai;

    if (checkWin(gameBoard, ai)) {
        setTimeout(() => alert('AI wins!'), 100);
    } else if (isBoardFull(gameBoard)) {
        setTimeout(() => alert('Draw!'), 100);
    }
}

function getBestMove(board, player) {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = player;
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = { X: -1, O: 1, tie: 0 };
    const winner = checkWin(board, ai) ? ai : checkWin(board, player) ? player : null;

    if (winner !== null) return scores[winner];
    if (isBoardFull(board)) return scores.tie;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = ai;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = player;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWin(board, player) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === player);
    });
}

function isBoardFull(board) {
    return board.every(cell => cell !== '');
}

function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => (cell.textContent = ''));
}
