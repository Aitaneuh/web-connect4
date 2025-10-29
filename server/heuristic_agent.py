from cmath import inf
import random
import time

class HeuristicAgent:
    def __init__(self, max_depth=2):
        self.max_depth = max_depth
        self.simulated_moves = 0

    def get_next_open_row(self, board: list[list[str]], col: int, ROWS: int):
        for r in range(ROWS - 1, -1, -1):
            if board[r][col] == " ":
                return r
        return None

    def is_winning_move(self, board, piece):
        ROWS, COLUMNS = len(board), len(board[0])
        # Check horizontal
        for r in range(ROWS):
            for c in range(COLUMNS - 3):
                if all(board[r][c + i] == piece for i in range(4)):
                    return True

        # Check vertical
        for r in range(ROWS - 3):
            for c in range(COLUMNS):
                if all(board[r + i][c] == piece for i in range(4)):
                    return True

        # Check diagonals
        for r in range(ROWS - 3):
            for c in range(COLUMNS - 3):
                if all(board[r + i][c + i] == piece for i in range(4)):
                    return True
        for r in range(3, ROWS):
            for c in range(COLUMNS - 3):
                if all(board[r - i][c + i] == piece for i in range(4)):
                    return True

        return False

    def simulate_move(self, board, col, piece):
        self.simulated_moves += 1
        temp_board = [row[:] for row in board]
        row = self.get_next_open_row(temp_board, col, len(board))
        if row is not None:
            temp_board[row][col] = piece
        return temp_board
    
    def evaluate_window(self, window: list[str], piece: str) -> int:
        score = 0
        opp_piece = 'O' if piece == 'X' else 'X'

        if window.count(piece) == 4:
            score += 100
        elif window.count(piece) == 3 and window.count(' ') == 1:
            score += 5
        elif window.count(piece) == 2 and window.count(' ') == 2:
            score += 2

        if window.count(opp_piece) == 3 and window.count(' ') == 1:
            score -= 4

        return score

    def evaluate_board(self, board: list[list[str]], piece: str) -> int:
        score = 0
        ROWS = len(board)
        COLUMNS = len(board[0])

        center_array = [board[r][COLUMNS//2] for r in range(ROWS)]
        center_count = center_array.count(piece)
        score += center_count * 3

        for r in range(ROWS):
            row_array = board[r]
            for c in range(COLUMNS - 3):
                window = row_array[c:c+4]
                score += self.evaluate_window(window, piece)

        for c in range(COLUMNS):
            col_array = [board[r][c] for r in range(ROWS)]
            for r in range(ROWS - 3):
                window = col_array[r:r+4]
                score += self.evaluate_window(window, piece)

        for r in range(ROWS - 3):
            for c in range(COLUMNS - 3):
                window = [board[r+i][c+i] for i in range(4)]
                score += self.evaluate_window(window, piece)

        for r in range(ROWS - 3):
            for c in range(COLUMNS - 3):
                window = [board[r+3-i][c+i] for i in range(4)]
                score += self.evaluate_window(window, piece)

        return score

    def minimax(self, board, valid_moves, alpha, beta, depth, maximizingPlayer, alphabeta):
        if depth == 0 or self.is_winning_move(board, 'O') or self.is_winning_move(board, 'X'):
            if self.is_winning_move(board, 'O'):
                return 1_000_000
            elif self.is_winning_move(board, 'X'):
                return -1_000_000
            else:
                return self.evaluate_board(board, 'O')

        if maximizingPlayer:
            maxEval = -inf
            for col in valid_moves:
                new_board = self.simulate_move(board, col, 'O')
                eval = self.minimax(new_board, valid_moves, alpha, beta, depth - 1, False, alphabeta)
                maxEval = max(maxEval, eval)
                if alphabeta:
                    alpha = max(alpha, eval)
                    if beta <= alpha:
                        break
            return maxEval

        else:
            minEval = +inf
            for col in valid_moves:
                new_board = self.simulate_move(board, col, 'X')
                eval = self.minimax(new_board, valid_moves, alpha, beta, depth - 1, True, alphabeta)
                minEval = min(minEval, eval)
                if alphabeta:
                    beta = max(beta, eval)
                    if beta <= alpha:
                        break
            return minEval



    def play(self, board: list[list[str]], valid_moves: list[int], depth: int, alphabeta: bool):
        self.simulated_moves = 0
        start = time.time()
        ROWS = len(board)
        COLUMNS = len(board[0])

        critic_move = self.check_critic_move(board, ROWS, COLUMNS, valid_moves, "O")
        if critic_move[0]:
            print("Critical move detected.")
            execTime = time.time() - start
            print("Execution time:", execTime, "s")
            return critic_move[1], execTime, 7 # type: ignore

        best_score = float("-inf")
        best_col = random.choice(valid_moves)

        for col in valid_moves:
            new_board = self.simulate_move(board, col, "O")
            score = self.minimax(new_board, valid_moves, float("-inf"), float("inf"), depth - 1, False, alphabeta)
            if score > best_score or (score == best_score and random.random() < 0.3):
                best_score = score
                best_col = col



        print(f"Depth: {depth} | Best move: {best_col} | Score: {best_score} | Simulated Moves : {self.simulated_moves}")
        execTime = time.time() - start
        print("Execution time:", execTime, "s")
        return best_col, execTime, self.simulated_moves

    def check_critic_move(self, board, ROWS, COLUMNS, valid_moves, piece):
        for piece_loop in [0, 1]:
            critic_moves = []
            for col in valid_moves:
                temp_board = [row[:] for row in board]  # deep copy
                next_row = self.get_next_open_row(temp_board, col, ROWS)
                if next_row is None:
                    continue
                temp_board[next_row][col] = piece

                for r in range(ROWS):
                    for c in range(COLUMNS - 3):
                        if all(temp_board[r][c + i] == piece for i in range(4)):
                            critic_moves.append(col)

                for r in range(ROWS - 3):
                    for c in range(COLUMNS):
                        if all(temp_board[r + i][c] == piece for i in range(4)):
                            critic_moves.append(col)

                for r in range(ROWS - 3):
                    for c in range(COLUMNS - 3):
                        if all(temp_board[r + i][c + i] == piece for i in range(4)):
                            critic_moves.append(col)

                for r in range(3, ROWS):
                    for c in range(COLUMNS - 3):
                        if all(temp_board[r - i][c + i] == piece for i in range(4)):
                            critic_moves.append(col)
            if len(critic_moves) > 0:
                return (True, random.choice(critic_moves))
            if piece == "X":
                piece = "O"
            else:
                piece = "X"
        return (False, None)
