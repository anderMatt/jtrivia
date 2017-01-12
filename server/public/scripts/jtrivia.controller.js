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

	JTriviaController.prototype.attachListeners = function(){
		var self = this;

		this.ui.clueSelected.attach(function(category, index){
			var clue = self.model.setActiveClue(category, index);
			// console.log('Clue from model: ' + JSON.stringify(clue));
			self.ui.openClue(category, clue); //TODO: pass category here.
		});

		this.ui.answerSubmitted.attach(function(submittedAnswer){
			self.onAnswerSubmission(submittedAnswer);
		});
	};


	JTriviaController.prototype.onAnswerSubmission = function(submittedAnswer){
		//null answer = timeout.
		var answerOutcome = this.model.answerClue(submittedAnswer);
		this.ui.revealAnswer(answerOutcome.outcome, answerOutcome.correctAnswer);
	}


	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaController = JTriviaController;


}(window))
