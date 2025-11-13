from flask import Flask, request, jsonify
from flask_cors import CORS
from heuristic_agent import HeuristicAgent
from evaluation import Evaluator

app = Flask(__name__)
CORS(app)

heuristic_agent = HeuristicAgent()
evaluator = Evaluator()

@app.route("/api/heuristic", methods=["POST"])
def get_move():
    data = request.get_json()

    if not data or "board" not in data or "valid_moves" not in data:
        return jsonify({"error": "Invalid request format"}), 400

    board = data["board"]
    valid_moves = data["valid_moves"]
    depth = data["depth"]
    alphabeta = data["alphabeta"]

    result = heuristic_agent.play(board, valid_moves, int(depth), alphabeta)

    return jsonify({"move": result[0], "resTime": result[1], "resCount": result[2]}) # type: ignore

@app.route("/api/eval/quick", methods=["POST"])
def get_quick_eval():
    data = request.get_json()

    if not data or "board" not in data:
        return jsonify({"error": "Invalid request format"}), 400

    board = data["board"]
    piece = data["piece"]

    result = evaluator.evaluate(board, 5, piece)

    return jsonify({"score": result}) # type: ignore

@app.route("/api/eval/deep", methods=["POST"])
def get_deep_eval():
    data = request.get_json()

    if not data or "board" not in data:
        return jsonify({"error": "Invalid request format"}), 400

    board = data["board"]
    piece = data["piece"]

    result = evaluator.evaluate(board, 7, piece)

    return jsonify({"score": result}) # type: ignore

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
