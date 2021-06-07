class BoggleGame {

    // BoggleGame class instantiates a new Boggle Game with every play  
    constructor(boardId, time=60){

        this.score = 0;
        this.board = $('#' + boardId);
        this.words = new Set();
        
        this.time = time;
        this.showTimeLeft();
        // Binds timer to countDown function 
        this.timer = setInterval(this.countDown.bind(this), 1000);
        // Catches form submit event and binds to handleSubmitForm function 
        $('.guess-form', this.board).on("submit", this.handleSubmitForm.bind(this));
        
    }

    // decrementing countDown timer 
    async countDown(){
        this.time -= 1;
        this.showTimeLeft();

        if(this.time === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }
    }

    // Displays message and changes class of msg html element on base.html depending on whether word is valid and exists on board 
    showMessage(msg, cls){
        $('.msg', this.board)
            .text(msg)
            .removeClass()
            .addClass(`msg ${cls}`);
    }

    // Once word has been validated and confirmed to be on board, word is added to list of found words
    addWordToList(word){
        const wordsList = $(".words-list", this.board);
        let li = $("<li>").text(word);
        wordsList.append(li);
    }

    // Score on page is updated when valid word is found on board 
    showScore(){
        $('.score', this.board).text(this.score);
    }

    // Displays timer dynamically on page 
    showTimeLeft(){
        $('.time', this.board).text(this.time);
    }

    // Handles form submission, send axios.get request to appy.py to check word, then facilitates posting of word and updating of score etc  
    async handleSubmitForm(evt){
        evt.preventDefault();
        
        const $word = $('.guess', this.board);
        let word = $word.val();
        
        if(!word) return;
       
        if(this.words.has(word)) {
            this.showMessage(`'${ word }' has already been found.`, 'error');
            return;
        }
    
        const response = await axios.get('/check-word', { params: { guess: word } });
        
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

    // Once timer is === 0, this function runs, posting score, determining if newRecord is achieved and posting to page 
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

