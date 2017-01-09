(function(window){

	function JTriviaController(model, ui){
		this.model = model;
		this.ui = ui;
	}	


	JTriviaController.prototype.loadRound = function(startNewGame){
		if(startNewGame){
			this.model.reset();
		}
		this.model.loadRound()
			.then(game => {
				console.log(JSON.stringify(game));
				this.ui.renderBoard(game);
			});
			//TODO: .catch ui.msg(err)
	}

	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaController = JTriviaController;


}(window))
