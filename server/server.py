from flask import Flask, request, jsonify
from flask_cors import CORS
from heuristic_agent import HeuristicAgent

app = Flask(__name__)
CORS(app)

heuristic_agent = HeuristicAgent()

@app.route("/api/heuristic", methods=["POST"])
def get_move():
    data = request.get_json()

    if not data or "board" not in data or "valid_moves" not in data:
        return jsonify({"error": "Invalid request format"}), 400

    board = data["board"]
    valid_moves = data["valid_moves"]
    depth = data["depth"]

    move = heuristic_agent.play(board, valid_moves, int(depth))

    return jsonify({"move": move})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
