class BoggleGame {
    
    constructor(boardId, time=60){
        this.score = 0;
        this.board = $('#' + boardId);
        this.words = new Set();
        
        this.time = time;
        this.showTimeLeft();

        this.timer = setInterval(this.countDown.bind(this), 1000);

        $('.guess-form', this.board).on("submit", this.handleSubmitForm.bind(this));
        
    }
    
    async countDown(){
        this.time -= 1;
        this.showTimeLeft();

        if(this.time === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    showMessage(msg, cls){
        $('.msg', this.board)
            .text(msg)
            .removeClass()
            .addClass(`msg ${cls}`);
    }

    addWordToList(word){
        const wordsList = $(".words-list", this.board);
        let li = $("<li>").text(word);
        console.log(li);
        wordsList.append(li);
    }

    showScore(){
        $('.score', this.board).text(this.score);
    }

    showTimeLeft(){
        $('.time', this.board).text(this.time);
    }

    async handleSubmitForm(evt){
        evt.preventDefault();
        console.log("JS is this printing?")
        const $word = $('.guess', this.board);
        console.log($word);
        console.log($word.val());
        let word = $word.val();
        console.log(word);
        if(!word) return;
        console.log("after first if")
        console.log(this.words);
        if(this.words.has(word)) {
            this.showMessage(`'${ word }' has already been found.`, 'error');
            return;
        }
        console.log("after second if statement");
        const response = await axios.get('/check-word', { params: { guess: word } });
        console.log(response.data.result);
        if(response.data.result === "not-word") {
            this.showMessage(`'${ word }' is not a valid word.  Try Again!`, 'error');
        }
        else if(response.data.result === "not-on-board") {
            this.showMessage(`'${ word }' is not on the board.  Try Again!`, 'error');
        }
        else {

            this.score += word.length;
            this.showScore();

            this.words.add(word);
            this.addWordToList(word);

            this.showMessage(`You found '${ word }' on the board! Good Job!!`, 'success');

        }



        $word.val("");
    }

    async scoreGame(){
        $('.guess-form', this.board).hide()

        const response = await axios.post('/post-score', { score: this.score });
        if(response.data.newRecord){
            this.showMessage(`New Record: ${ this.score }`, 'success');
        }
        else {
            this.showMessage(`Final Score: ${ this.score }`, 'success');
        }
    }

}

