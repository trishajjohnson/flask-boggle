from flask import Flask, request, render_template, jsonify, session 
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "secretkey"

boggle_game = Boggle()


@app.route('/')
def homepage():
    """Shows boggle board"""
    print("Homepage")
    board = boggle_game.make_board()
    session["board"] = board
    highscore = session.get("highscore", 0)
    numPlays = session.get('numPlays', 0)

    return render_template('base.html', board=board, highscore=highscore, numPlays=numPlays )
    

@app.route('/check-word')
def check_word():
    print("Print this!")
    guess = request.args["guess"]
    print(guess)
    board = session["board"]
    result = boggle_game.check_valid_word(board, guess)

    return jsonify({"result": result})
    

@app.route('/post-score', methods=["POST"])
def post_score():
    score = request.json["score"]
    highscore = session.get('highscore', 0)
    numPlays = session.get('numPlays', 0)

    session['numPlays'] = numPlays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(newRecord = score > highscore)