from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):

    # TODO -- write tests for every view function / feature!

    def test_homepage(self):

        """Testing that homepage loads correctly"""

        with app.test_client() as client:
            res = client.get('/')
            html = res.get_data(as_text=True)

            self.assertIn("board", session)
            self.assertIn("<h1>The Boggle Game</h1>", html)
            self.assertEqual(res.status_code, 200)

    def test_valid_word(self):

        """Testing whether check_word with valid word yields a json['result'] of 'ok'"""

        with app.test_client() as client:
            with client.session_transaction() as change_session:
                change_session['board'] = [['T', 'R', 'I', 'M', 'M'],
                                           ['T', 'R', 'I', 'M', 'M'],
                                           ['T', 'R', 'I', 'M', 'M'],
                                           ['T', 'R', 'I', 'M', 'M'],
                                           ['T', 'R', 'I', 'M', 'M']]
            res = client.get('/check-word?guess=trim')
            self.assertEqual(res.json['result'], 'ok')

    def test_invalid_word(self):

        """Tests if word is not on board, json response is 'not-on-board'"""

        with app.test_client() as client:

            client.get('/')
            res = client.get('/check-word?guess=pneumonia')
            self.assertEqual(res.json["result"], "not-on-board")

    def test_nonenglish_word(self):

        """Testing that a non-english words yields a json['result'] equal to 'not-word'"""

        with app.test_client() as client:
            client.get('/')
            res = client.get('/check-word?guess=asdasdf')
            self.assertEqual(res.json["result"], "not-word")
