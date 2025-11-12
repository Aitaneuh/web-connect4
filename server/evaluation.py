from math import inf

class Evaluator:
    def __init__(self):
        pass

    def get_next_open_row(self, board, col):
        for r in range(len(board) - 1, -1, -1):
            if board[r][col] == " ":
                return r
        return None

    def simulate_move(self, board, col, piece):
        temp_board = [row[:] for row in board]
        row = self.get_next_open_row(temp_board, col)
        if row is not None:
            temp_board[row][col] = piece
        return temp_board

    def is_winning_move(self, board, piece):
        ROWS, COLUMNS = len(board), len(board[0])

        # Horizontal
        for r in range(ROWS):
            for c in range(COLUMNS - 3):
                if all(board[r][c+i] == piece for i in range(4)):
                    return True

        # Vertical
        for r in range(ROWS - 3):
            for c in range(COLUMNS):
                if all(board[r+i][c] == piece for i in range(4)):
                    return True

        # Diagonal /
        for r in range(3, ROWS):
            for c in range(COLUMNS - 3):
                if all(board[r-i][c+i] == piece for i in range(4)):
                    return True

        # Diagonal \
        for r in range(ROWS - 3):
            for c in range(COLUMNS - 3):
                if all(board[r+i][c+i] == piece for i in range(4)):
                    return True

        return False

    def get_valid_moves(self, board):
        return [c for c in range(len(board[0])) if board[0][c] == " "]


    def evaluate_window(self, window, piece):
        score = 0
        opp = "O" if piece == "X" else "X"

        if window.count(piece) == 4: score += 10000
        elif window.count(piece) == 3 and window.count(" ") == 1: score += 50
        elif window.count(piece) == 2 and window.count(" ") == 2: score += 5

        if window.count(opp) == 3 and window.count(" ") == 1: score -= 80

        return score

    def static_eval(self, board, piece):
        score = 0
        ROWS, COLS = len(board), len(board[0])

        # Center
        center = [board[r][COLS//2] for r in range(ROWS)]
        score += center.count(piece) * 15

        # Horizontal
        for r in range(ROWS):
            for c in range(COLS - 3):
                score += self.evaluate_window(board[r][c:c+4], piece)

        # Vertical
        for c in range(COLS):
            col_array = [board[r][c] for r in range(ROWS)]
            for r in range(ROWS - 3):
                score += self.evaluate_window(col_array[r:r+4], piece)

        # Pos diag
        for r in range(ROWS - 3):
            for c in range(COLS - 3):
                diag = [board[r+i][c+i] for i in range(4)]
                score += self.evaluate_window(diag, piece)

        # Neg diag
        for r in range(3, ROWS):
            for c in range(COLS - 3):
                diag = [board[r-i][c+i] for i in range(4)]
                score += self.evaluate_window(diag, piece)

        return score

    # --- NegaMax ---------------------------------------------------------------

    def negamax(self, board, depth, player, alpha, beta):
        opponent = "O" if player == "X" else "X"
        valid_moves = self.get_valid_moves(board)

        if self.is_winning_move(board, player):
            return 1_000_000 + depth
        if self.is_winning_move(board, "O" if player == "X" else "X"):
            return -1_000_000 - depth
        if depth == 0 or len(valid_moves) == 0:
            return self.static_eval(board, player)

        max_score = -inf
        order = [3, 2, 4, 1, 5, 0, 6]
        moves = [c for c in order if c in valid_moves]

        for col in moves:
            new_board = self.simulate_move(board, col, player)
            score = -self.negamax(new_board, depth - 1, opponent, -beta, -alpha)

            max_score = max(max_score, score)
            alpha = max(alpha, score)

            if alpha >= beta:
                break

        return max_score

    def evaluate(self, board, depth, current_player, root_player="X"):
        """
        Evaluates the board from the perspective of root_player ("X" by default),
        even if it's not their turn to play.
        """
        score = self.negamax(board, depth, current_player, -inf, inf)

        if current_player != root_player:
            score = -score

        return score
