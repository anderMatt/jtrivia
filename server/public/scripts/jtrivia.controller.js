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
		this.model.loadRound()
			.then(game => {
				this.ui.renderBoard(game);
			});
			//TODO: .catch ui.msg(err)
	};


	JTriviaController.prototype._onClueSelection = function(clueCategory, clueIndex){
		var clue = this.model.setActiveClue(clueCategory, clueIndex);
		if(clue.dailyDouble){
			this.ui.getDailyDoubleWager();
			return;
		}
		this.model.startClueTimer(1000); //delay timer by one second, for time to start reading clue question.
		this.ui.openClue(clue);
	};


	JTriviaController.prototype._onWagerSubmission = function(wager){
		var err = this.model.validateWager(wager);
		console.log('ERR given to ctrl: ' + err);
		if(err){
			this.ui.dailyDoubleWagerError(err);
			return;
		}
		//No err = wager was valid. ui.openClue()
		return;
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
	};
	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaController = JTriviaController;


}(window))
