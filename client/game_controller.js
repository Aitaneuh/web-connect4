import Connect4 from "./game.js";

export default class GameController {
    constructor(modeSel, resetBtn, renderer, checkbox, firstCheckBox) {
        this.modeSel = modeSel;
        this.resetBtn = resetBtn;
        this.renderer = renderer;
        this.checkbox = checkbox;
        this.firstCheckBox = firstCheckBox;
        this.game = new Connect4();
        this.mode = modeSel.value;
        this.isHumanTurn = true;
        this.isIAFirstMove = false;

        this.renderer.createBoard(this.game.rows, this.game.cols, col => this.handleMove(col));
        this.renderer.updateBoard(this.game.board);
        this.renderer.setStatus(`${this.modeSel.value === 'local' ? "Player Red's" : 'Your'} turn`);

        this.resetBtn.addEventListener('click', () => this.reset());
        this.modeSel.addEventListener('change', () => this.changeMode());
        this.firstCheckBox.addEventListener('change', () => this.reset());
    }

    handleMove(col) {
        if (this.game.gameOver || !this.isHumanTurn) return;

        if (!this.isIAFirstMove) {
            const result = this.game.playMove(col);
            if (!result) return;
            this.renderer.updateBoard(this.game.board);

            if (result.winner) {
                this.renderer.setStatus(this.mode === 'local'
                    ? `Player ${this.game.currentPlayer === 1 ? 'Red' : 'Yellow'} wins!`
                    : this.game.currentPlayer === 1 ? 'You won!' : 'AI wins!');
                this.renderer.highlightWin(result.cells)
                return;
            }

            var valid_moves = this._getValidMoves()
            if (valid_moves.length == 0) {
                this.renderer.highlightDraw()
                this.renderer.setStatus("Draw !")
                return
            }

        }
        this.isIAFirstMove = false
        


        if (this.mode === 'local') {
            this.renderer.setStatus(`Player ${this.game.currentPlayer === 1 ? 'Red' : 'Yellow'}'s turn`);
        } else if (this.mode === 'random' && this.game.currentPlayer === 2) {
            this.isHumanTurn = false;
            this.renderer.setStatus(`AI's turn...`);
            setTimeout(() => this.randomAIMove(), 300);
        } else if (typeof this.mode === "string" && this.mode.startsWith('heuristic') && this.game.currentPlayer === 2) {
            this.isHumanTurn = false;
            this.renderer.setStatus("AI's turn...");
            setTimeout(() => this.heuristicAlgorithm(this.mode[9]), 300);
        } else if (this.mode !== 'random' && this.mode !== 'local' && this.game.currentPlayer === 2) {
            this.renderer.setStatus("AI's turn...");
        } else {
            this.renderer.setStatus('Your turn');
        }
    }

    randomAIMove() {
        const validCols = this.game.board[0]
            .map((v, i) => v === 0 ? i : null)
            .filter(i => i !== null);

        const col = validCols[Math.floor(Math.random() * validCols.length)];
        this.isHumanTurn = true;
        this.handleMove(col);
    }

    _getFormatedBoardForAPI() {
        return this.game.board.map(row =>
            row.map(cell => cell === 1 ? 'X' : cell === 2 ? 'O' : ' ')
        );
    }

    _getValidMoves() {
        return this.game.board[0]
            .map((v, i) => v === 0 ? i : null)
            .filter(i => i !== null);
    }

    async heuristicAlgorithm(depth) {
        let boardFormatted = this._getFormatedBoardForAPI()
        let alphabetaBool = false

        const validMoves = this._getValidMoves()

        if (this.checkbox.checked) {
            alphabetaBool = true
        }

        const response = await fetch('http://157.26.121.153:8000/api/heuristic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board: boardFormatted, valid_moves: validMoves, depth: depth, alphabeta: alphabetaBool })
        });

        const data = await response.json();
        const col = data.move;
        this.renderer.updateRes(data.resTime, data.resCount)

        this.isHumanTurn = true;
        this.handleMove(col);
    }


    reset() {
        this.game.reset();
        this.renderer.updateBoard(this.game.board);
        this.renderer.setStatus(this.mode === 'local' ? "Player Red's turn" : 'Your turn');
        const resTimeVal = document.getElementById("resTimeVal");
        const resCountVal = document.getElementById("resCountVal");
        resTimeVal.textContent = "-"
        resCountVal.textContent = "-"
        this.playFirstMove()
    }

    changeMode() {
        this.mode = this.modeSel.value;
        this.reset();
    }

    playFirstMove() {
        if (this.firstCheckBox.checked) {
            return
        }

        this.game.currentPlayer = 2
        this.isIAFirstMove = true
        this.handleMove(0)
    }
}
