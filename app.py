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

    return render_template('base.html', board=board )
    

@app.route('/check-word')
def check_word():
    print("Print this!")
    word = request.args["guess"]
    board = session["board"]
    result = boggle_game.check_valid_word(board, word)

    return jsonify({"result": result})
    