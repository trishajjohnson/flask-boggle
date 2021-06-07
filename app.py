from flask import Flask, request, render_template, jsonify, session 
from boggle import Boggle

app = Flask(__name__)
app.config['SECRET_KEY'] = "secretkey"

boggle_game = Boggle()


@app.route('/')
def homepage():

    """Shows boggle board"""

    board = boggle_game.make_board()
    session["board"] = board
    highscore = session.get("highscore", 0)
    numPlays = session.get('numPlays', 0)

    return render_template('base.html', board=board, highscore=highscore, numPlays=numPlays )
    

@app.route('/check-word')
def check_word():
    
    """Upon submission of a word guess by user, JS sends an axios.get request to this route
    to check if word is valid and exists on the board"""

    guess = request.args["guess"]
    board = session["board"]
    result = boggle_game.check_valid_word(board, guess)

    return jsonify({"result": result})
    

@app.route('/post-score', methods=["POST"])
def post_score():

    """Upon timer running out, JS function scoreGame() is executed, inside which an 
    axios.post request is sent to this route to check if newRecord is achieved and to 
    post score/newRecord on page and increment numPlays."""

    score = request.json["score"]
    highscore = session.get('highscore', 0)
    numPlays = session.get('numPlays', 0)

    session['numPlays'] = numPlays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(newRecord = score > highscore)