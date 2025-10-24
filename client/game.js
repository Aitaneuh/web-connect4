export default class Connect4 {
    constructor(rows = 6, cols = 7) {
        this.rows = rows;
        this.cols = cols;
        this.board = this._createEmptyBoard();
        this.currentPlayer = 1;
        this.gameOver = false;
    }

    _createEmptyBoard() {
        return Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
    }

    reset() {
        this.board = this._createEmptyBoard();
        this.currentPlayer = 1;
        this.gameOver = false;
    }

    playMove(col) {
        if (this.gameOver) return false;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) {
                this.board[r][col] = this.currentPlayer;
                const winner = this.checkWinner(r, col);
                if (winner) {
                    this.gameOver = true;
                    return { winner };
                }
                this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                return { row: r, col, player: this.currentPlayer };
            }
        }
        return false;
    }

    checkWinner(row, col) {
        const dirs = [[0,1],[1,0],[1,1],[1,-1]];
        for (const [dr, dc] of dirs) {
            let count = 1;
            count += this._countDirection(row, col, dr, dc);
            count += this._countDirection(row, col, -dr, -dc);
            if (count >= 4) return this.currentPlayer;
        }
        return null;
    }

    _countDirection(row, col, dr, dc) {
        let count = 0;
        let r = row + dr, c = col + dc;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === this.currentPlayer) {
            count++; r += dr; c += dc;
        }
        return count;
    }
}
