//dependency: JTrivia.util, JTrivia.event

//detect touch devices.
function addTouchClass(){
	document.documentElement.classList.add('can-touch');
	document.documentElement.removeEventListener('touchstart', addTouchClass, false);
}

document.documentElement.addEventListener('touchstart', addTouchClass, false);

(function(window){
	function JTriviaUI(){
		this.dom = {
			startNewGame: document.getElementById('play'), //menu, playAgain
			gameMessage: document.getElementById('game-message'),
			spinner: document.getElementById('spinner'),
			score: document.getElementById('score'),
			board: document.getElementById('board'),
			dailyDoubleWindow: document.getElementById('dailydouble-window'),
			submitWager: document.getElementById('submit-wager'),
			dailyDoubleWager: document.getElementById('dailydouble-wager'),
			dailyDoubleErr: document.getElementById('dailydouble-err'),
			clueWindow: document.getElementById('clue-window'),
			clueWindowCategory: document.getElementById('clue-window-category'),
			clueWindowQuestion: document.getElementById('clue-window-question'),
			clueWindowAnswers: document.getElementById('clue-window-answers'),
			clueWindowTimer: document.getElementById('clue-window-timer'),
			clueWindowFeedback: document.getElementById('clue-window-feedback'),
			closeClueBtn: document.getElementById('close-clue')
		};	

		 this.state = {
			gameMessage: false,
			loadingSpinner: false,
		 	boardDisabled:false,
		 	answerRevealed: false
		 };
		
		this._previousScrollPosition = null;

		this.startNewGame = new JTrivia.Event(this);
		this.clueSelected = new JTrivia.Event(this);
		this.wagerSubmitted = new JTrivia.Event(this);
		this.answerSubmitted = new JTrivia.Event(this);
		this.finishedWithClue = new JTrivia.Event(this);

		this.attachEventListeners();
	}


	JTriviaUI.prototype.showGameMessage = function(title, msg){
		var messageEls = this.dom.gameMessage.querySelectorAll('div');
		var titleEl = messageEls[0];
		var msgEl = messageEls[1];

		if(!this.state.gameMessage){ //Not replacing a current message, need to show element first.
			this.state.gameMessage = true;
			this.dom.gameMessage.classList.add('open');
		}
		titleEl.textContent = title;
		msgEl.textContent = msg;
	};

	JTriviaUI.prototype.hideGameMessage = function(){
		this.state.gameMessage = false;
		this.dom.gameMessage.classList.remove('open');
	};

	JTriviaUI.prototype.showSpinner = function(){
		this.state.loadingSpinner = true;
		this.dom.spinner.classList.add('visible');
	};


	JTriviaUI.prototype.hideSpinner = function(){
		this.state.loadingSpinner = false;
		this.dom.spinner.classList.remove('visible');
	};


	JTriviaUI.prototype.updateScore = function(score){
		this.dom.score.textContent = score;
		if(score < 0){
			this.dom.score.classList.add('negative');
		}
		else {
			this.dom.score.classList.remove('negative');
		}

	};

	JTriviaUI.prototype.handleBoardClick = function(event){
		if(this.state.boardDisabled){
			return;
		}

		var selectedClue = event.target;
		if(!this._isValidClueSelection(selectedClue)){
			return;
		}
	
		selectedClue.classList.add('seen');
		var clueData = this._getClueData(selectedClue);
		this.clueSelected.notify(clueData.category, clueData.index);
	};

	JTriviaUI.prototype._fadeInClueValues = function(){
		var valueNodes = this.dom.board.querySelectorAll('.clue>span');
		var hiddenValues = valueNodes.length;

		valueNodes = JTrivia.util.toArray(valueNodes); //convert to array so it can be shuffled.
		JTrivia.util.shuffleArray(valueNodes);

		return new Promise(resolve => {
			valueNodes.forEach((node, index) => {
				window.setTimeout( ()=> {
					node.style.opacity = 1;
					hiddenValues -= 1;
					if(hiddenValues == 0){ //finished fading in clues.
						resolve();
					}
				}, index*50) //stagger by 50ms
			});
		});
	};

	JTriviaUI.prototype.renderBoard = function(game){
		this.state.boardDisabled = true;

		if(this.state.loadingSpinner){
			this.hideSpinner();
		}
		if(this.state.gameMessage){
			this.hideGameMessage();
		}

		this.dom.score.classList.remove('hidden');
		this.dom.startNewGame.style.display = "none";

		var html = Handlebars.templates.board({game: game});
		this.dom.board.innerHTML = html;
		this._fadeInClueValues().then(()=> {
			this.state.boardDisabled = false;
		});
	};

	JTriviaUI.prototype._isValidClueSelection = function(selected){
		if(!selected.classList.contains('clue') || selected.classList.contains('seen')){
			return false;
		}
		return true;
	};

	JTriviaUI.prototype._getClueData = function(clueNode){
		return {
			category: clueNode.dataset.category,
			index: clueNode.dataset.index
		};
	};

	JTriviaUI.prototype.openClue = function(clue){
		this.state.boardDisabled = true;
		this._populateClueWindow(clue);
		this.dom.clueWindow.classList.add('open');
		this._scrollWithClueWindow();
	};

	JTriviaUI.prototype._populateClueWindow = function(clue){
		this.dom.clueWindowCategory.textContent = clue.category;	
		this.dom.clueWindowQuestion.textContent = clue.question;

		var answers = clue.falseAnswers.slice(0);
		answers.push(clue.answer); //combine correct and false answers into single array for shuffling.
		JTrivia.util.shuffleArray(answers); //shuffle answers so they appear in a random order.

		var answerNodes = this.dom.clueWindowAnswers.children;
		for(var i=0, max=answerNodes.length; i<max; i++){
			answerNodes[i].textContent = answers[i];
		}
	};

	JTriviaUI.prototype._scrollWithClueWindow = function(){
		if(this._previousScrollPosition){
			window.scroll(0, this._previousScrollPosition);
			this._previousScrollPosition = null;
		}
		else{
			var scrollCorrection = this.dom.board.getBoundingClientRect().top;
			if(scrollCorrection < 0){
				this._previousScrollPosition = window.scrollY; //save current scroll position to return on close.
				var correctedScrollPosition = this.dom.board.offsetParent.offsetTop; //offsetParent is the last relative ancestor before window. We want this distance to the top of window.
				window.scroll(0, correctedScrollPosition);
			}
			
		}

	};


	JTriviaUI.prototype.getDailyDoubleWager = function(){
		//TODO: reset.
		this.state.boardDisabled = true;
		this.dom.board.classList.add('faded');
		this.dom.dailyDoubleWindow.classList.add('flipped');
		this.dom.dailyDoubleWager.focus();
	};


	JTriviaUI.prototype.dailyDoubleWagerError = function(err){
		this.dom.dailyDoubleErr.textContent = err;
		this.dom.dailyDoubleWager.focus();
	};


	JTriviaUI.prototype.submitWager = function(){
		var wager = parseInt(this.dom.dailyDoubleWager.value);
		if(isNaN(wager)){
			return;
		}
		this.wagerSubmitted.notify(wager);
	};


	JTriviaUI.prototype.submitAnswer = function(event){
		//TODO: state.answerRevealed: ignore click.
		event.stopPropagation();
		if(this.state.answerRevealed){
			return;
		}
		var selected = event.target;
		if(!(selected.tagName === 'LI')){ //something other than an answer was clicked; ignore.
			return;
		}
		var selectedAnswer = selected.textContent;
		this.answerSubmitted.notify(selectedAnswer);
	};

	JTriviaUI.prototype._styleAnswers = function(outcome, correctAnswer){
		function styleIncorrectAnswer(answerNode){
			if(outcome === 'correct'){
				answerNode.classList.add('hidden');
			} else {
				answerNode.classList.add('incorrect');
			}
		}

		var answerNodes = this.dom.clueWindowAnswers.children;
		for(var i=0, max=answerNodes.length; i<max; i++){
			let answerNode = answerNodes[i];
			let isCorrect = (answerNode.textContent === correctAnswer);
			if(isCorrect){
				answerNode.classList.add('correct');
			} else{
				styleIncorrectAnswer(answerNode);	
			}
		}
	};

	JTriviaUI.prototype.revealAnswer = function(outcome, correctAnswer){
		//outcome: correct, incorrect, timeout.	
		this.state.answerRevealed = true;
		this._styleAnswers(outcome, correctAnswer);
		var feedbackMessage = this.dom.clueWindowFeedback.querySelector(`[data-outcome="${outcome}"]`);
		feedbackMessage.classList.add('visible');
		//TODO: show continue btn.
		this.dom.clueWindowTimer.classList.add('none');
		this.dom.closeClueBtn.classList.add('show');
	};


	JTriviaUI.prototype._resetClueWindow = function(){
		//remove correct/incorrect style classes from answer nodes.
		this.state.answerRevealed = false;

		let answerNodes = this.dom.clueWindowAnswers.children;
		for(var i=0, max=answerNodes.length; i<max; i++){
			answerNodes[i].className=''; 
		}
	
		//hide feedback message from last answer.
		let feedback = this.dom.clueWindowFeedback.querySelector('.visible');
		feedback.classList.remove('visible');
	
		//show the timer for the next clue
		this.dom.clueWindowTimer.classList.remove('none');
		this.dom.closeClueBtn.classList.remove('show');
		return;
	};


	JTriviaUI.prototype.closeWindow = function(winName){
		this.state.boardDisabled = false;
		this.dom.board.classList.remove('faded');

		switch(winName){
			case "clue":
				this._resetClueWindow();
				this.dom.clueWindow.classList.remove('open');
				this._scrollWithClueWindow();
				this.finishedWithClue.notify();
				//notify finished with clue.
				break;

			case "dailydouble wager":
				this.dom.dailyDoubleWindow.classList.remove('flipped');
				this.dom.dailyDoubleWager.value = "";
				//TODO: reset DD wager input, errs.
				break;
		}	
	};


	JTriviaUI.prototype.endOfGame = function(data){
		var html = Handlebars.templates.report({percentCorrect: data.percentCorrect, largestWager: data.largestWager});
		this.dom.startNewGame.style.display = "block";
		this.dom.board.innerHTML = html;
	};


	JTriviaUI.prototype.attachEventListeners = function(){
		//attach listeners; board event is attached in _fadeIn...put it here, but have a flag set to False before game is loaded?	
		var self = this;

		this.dom.startNewGame.addEventListener('click', function(){
			self.startNewGame.notify();
		});

		this.dom.board.addEventListener('click', this.handleBoardClick.bind(this));

		this.dom.submitWager.addEventListener('click', this.submitWager.bind(this));
		this.dom.clueWindowAnswers.addEventListener('click', this.submitAnswer.bind(this));
		this.dom.closeClueBtn.addEventListener('click', function(){
			self.closeWindow('clue');
		});

		this.dom.dailyDoubleWager.addEventListener('keydown', JTrivia.util.numericOnly);
	};


	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaUI = JTriviaUI;
}(window))
