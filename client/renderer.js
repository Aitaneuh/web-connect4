export default class Renderer {
    constructor(boardEl, statusEl) {
        this.boardEl = boardEl;
        this.statusEl = statusEl;
    }

    createBoard(rows, cols, onCellClick) {
        this.boardEl.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.col = c;
                cell.dataset.row = r;
                cell.addEventListener('click', () => onCellClick(c));
                this.boardEl.appendChild(cell);
            }
        }
    }

    updateBoard(board) {
        const rows = board.length;
        const cols = board[0].length;
        const cells = this.boardEl.querySelectorAll('.cell');
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = cells[r * cols + c];
                cell.classList.remove('player1', 'player2', 'player1gray', 'player2gray');
                if (board[r][c] === 1) cell.classList.add('player1');
                if (board[r][c] === 2) cell.classList.add('player2');
            }
        }
    }

    setStatus(text) {
        this.statusEl.textContent = text;
    }

    _highlightWin(winningCells) {
    const boardCells = this.boardEl.querySelectorAll('.cell');

    boardCells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        const isWinningCell = winningCells.some(([r, c]) => r === row && c === col);

        if (!isWinningCell) {
            if (cell.classList.contains("player1")) {
                cell.classList.remove("player1");
                cell.classList.add("player1gray");
            } else if (cell.classList.contains("player2")) {
                cell.classList.remove("player2");
                cell.classList.add("player2gray");
            }
        }
    });
}

}
