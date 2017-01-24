(function(window){

	function JTriviaController(model, ui){
		this.model = model;
		this.ui = ui;
		
		this.attachListeners();
	}	


	JTriviaController.prototype.loadRound = function(startNewGame){
		if(startNewGame){
			this.model.reset();
		}

		if(this.model.isRequestInProgress()){
			return;
		}
		
		var spinnerTimeout = window.setTimeout(() => {
			this.ui.showGameMessage("Loading...", null);
			this.ui.showSpinner();
		}, 1600);
		this.model.loadRound()
			.then(game => {
				JTrivia.util.clearTimeout(spinnerTimeout);

				this.ui.renderBoard(game);
			});
		//	//TODO: .catch ui.msg(err)
	};


	JTriviaController.prototype._onClueSelection = function(clueCategory, clueIndex){
		var clue = this.model.setActiveClue(clueCategory, clueIndex);
		if(clue.dailyDouble){
			this.ui.getDailyDoubleWager();
		} else{
			this._openActiveClue();
		}
	};


	JTriviaController.prototype._openActiveClue = function(){
		var clue = this.model.getActiveClue();
		this.model.startClueTimer(1000);
		this.ui.openClue(clue);
	};


	JTriviaController.prototype._onWagerSubmission = function(wager){
		var err = this.model.makeWager(wager);
		if(err){
			this.ui.dailyDoubleWagerError(err);
		} else {
			this.ui.closeWindow('dailydouble wager');
			this._openActiveClue();
		}
	};


	JTriviaController.prototype._onRoundEnd = function(){
		var nextRoundName = this.model.determineNextGameRound();
		if(nextRoundName === 'game over'){
			console.log("GAME IS OVER!!!");
			var data = this.model.getEndOfGameReport();
			this.ui.endOfGame(data);
			return;
		}
		this.ui.showGameMessage("Round Over!", `Prepare for ${nextRoundName.toUpperCase()}...`);
		window.setTimeout(()=>{
			this.loadRound();
		}, 1500);
	};

	JTriviaController.prototype._onAnswerSubmission = function(submittedAnswer){
		//null answer = timeout.
		var answerOutcome = this.model.answerClue(submittedAnswer);
		this.ui.revealAnswer(answerOutcome.outcome, answerOutcome.correctAnswer);
	};


	JTriviaController.prototype.attachListeners = function(){
		var self = this;

		this.model.getTimer().onTimeout.attach(function(){
			self._onAnswerSubmission(null); //'submitting' a null answer means the timer ran out.
		});

		this.model.scoreChanged.attach(function(score){
			self.ui.updateScore(score);
		});

		this.ui.startNewGame.attach(function(){
			self.loadRound(true);
		});

		this.ui.clueSelected.attach(function(category, index){
			self._onClueSelection(category, index);
		});

		this.ui.wagerSubmitted.attach(function(wager){
			self._onWagerSubmission(wager);
		});

		this.ui.answerSubmitted.attach(function(submittedAnswer){
			self._onAnswerSubmission(submittedAnswer);
		});

		this.ui.finishedWithClue.attach(function(){
			if(self.model.roundOver()){
				self._onRoundEnd();
			}
		});
	};
	
	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaController = JTriviaController;


}(window))
