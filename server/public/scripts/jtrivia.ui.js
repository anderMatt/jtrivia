//dependency: JTrivia.util, JTrivia.event

(function(window){
	function JTriviaUI(){
		this.dom = {
			score: document.getElementById('score'),
			board: document.getElementById('board'),
			clueWindow: document.getElementById('clue-window'),
			clueWindowCategory: document.getElementById('clue-window-category'),
			clueWindowQuestion: document.getElementById('clue-window-question'),
			clueWindowAnswers: document.getElementById('clue-window-answers'),
			clueWindowTimer: document.getElementById('clue-window-timer'),
			clueWindowFeedback: document.getElementById('clue-window-feedback'),
			closeClueBtn: document.getElementById('close-clue')
		};	
		
		this._previousScrollPosition = null;
		this.clueSelected = new JTrivia.Event(this);
		this.answerSubmitted = new JTrivia.Event(this);

		this.attachEventListeners();
	}

	JTriviaUI.prototype.handleBoardClick = function(event){
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
		var html = Handlebars.templates.board({game: game});
		this.dom.board.innerHTML = html;
		this._fadeInClueValues().then(()=> {
			this.dom.board.addEventListener('click', this.handleBoardClick.bind(this));
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

	JTriviaUI.prototype.openClue = function(category, clue){
		this._populateClueWindow(category, clue);
		this.dom.clueWindow.classList.add('open');
		this._scrollWithClueWindow();
	};

	JTriviaUI.prototype._populateClueWindow = function(category, clue){
		this.dom.clueWindowCategory.textContent = category;	
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
				var correctedScrollPosition = this.dom.board.offsetParent.offsetTop;
				window.scroll(0, correctedScrollPosition);
			}
			
		}

	};

	JTriviaUI.prototype.submitAnswer = function(event){
		//TODO: state.answerRevealed: ignore click.
		event.stopPropagation();
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

		// var answerNodes = this.dom.clueWindowAnswers.querySelectorAll('li');
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
		this._styleAnswers(outcome, correctAnswer);
		var feedbackMessage = this.dom.clueWindowFeedback.querySelector(`[data-outcome="${outcome}"]`);
		feedbackMessage.classList.add('visible');
		//TODO: show continue btn.
		// document.getElementById('clue-window-timer').style.display='none';
		this.dom.clueWindowTimer.classList.add('none');
	};


	JTriviaUI.prototype._resetClueWindow = function(){
		//remove correct/incorrect style classes from answer nodes.
		let answerNodes = this.dom.clueWindowAnswers.children;
		for(var i=0, max=answerNodes.length; i<max; i++){
			answerNodes[i].className=''; 
		}
	
		//hide feedback message from last answer.
		let feedback = this.dom.clueWindowFeedback.querySelector('.visible');
		feedback.classList.remove('visible');
	
		//show the timer for the next clue
		this.dom.clueWindowTimer.classList.remove('none');
		return;
	};

	JTriviaUI.prototype.closeClue = function(){
		this._resetClueWindow();
		this.dom.clueWindow.classList.remove('open');
		this._scrollWithClueWindow();
	};


	JTriviaUI.prototype.attachEventListeners = function(){
		//attach listeners; board event is attached in _fadeIn...put it here, but have a flag set to False before game is loaded?	
		this.dom.clueWindowAnswers.addEventListener('click', this.submitAnswer.bind(this));
		this.dom.closeClueBtn.addEventListener('click', this.closeClue.bind(this));
	};


	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaUI = JTriviaUI;
}(window))
