class BoggleGame {
    
    constructor(boardId, time=60){
        console.log("Before the ")
        this.board = $('#' + boardId);
        this.time = time;
        this.words = new Set();
        
        $('.guess-form', this.board).on("submit", this.handleSubmitForm.bind(this));
    }
    
    async handleSubmitForm(evt){
        evt.preventDefault();
        console.log("JS is this printing?")
        const $word = $('.guess', this.board);

        let word = $word.val();

        if(!word) return;

        if(this.words.has(word)) {
            return this.showMessage(`${ word } has already been found.`, 'error')
        }
        
        const response = await axios.get('/check-word', { params: { word: word } });

        if(response.data.result === "ok"){
            this.words.add(word);
            const wordsList = $(".words-list", this.board);
            let li = $("<li>").text(word);
            wordsList.append(li);

            return this.showMessage(`You found ${ word } on the board! Good Job!!`, 'success');
        }

        if(response.data.result === "not-on-board"){
            return this.showMessage(`${ word } is not on the board.  Try Again!`, 'error');
        }

        if(response.data.result === "not-word"){
            return this.showMessage(`${ word } is not a valid word.  Try Again!`, 'error');
        }

        $word.val("");
    }

    showMessage(msg, cls){
        $('.msg', this.board)
            .text(msg)
            .removeClass()
            .addClass(`.msg .${cls}`);
    }


}

