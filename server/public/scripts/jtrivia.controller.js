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


	JTriviaController.prototype.onAnswerSubmission = function(submittedAnswer){
		//null answer = timeout.
		var answerOutcome = this.model.answerClue(submittedAnswer);
		this.ui.revealAnswer(answerOutcome.outcome, answerOutcome.correctAnswer);
	}


	JTriviaController.prototype.attachListeners = function(){
		var self = this;


		this.model.getTimer().onTimeout.attach(function(){
			self.onAnswerSubmission(null); //'submitting' a null answer means the timer ran out.
		});


		this.ui.clueSelected.attach(function(category, index){
			var clue = self.model.setActiveClue(category, index);
			self.model.startClueTimer(2000); //TODO: buffer to give time to read clue. 1-2sec?
			self.ui.openClue(category, clue); //TODO: pass category here.
		});

		this.ui.answerSubmitted.attach(function(submittedAnswer){
			self.onAnswerSubmission(submittedAnswer);
		});
	};
	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaController = JTriviaController;


}(window))
