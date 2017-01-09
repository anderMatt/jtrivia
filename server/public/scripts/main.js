(function(window){
	function JTriviaApp(){
		this.model = new JTrivia.JTriviaModel();
		this.ui = new JTrivia.JTriviaUI();
		this.controller = new JTrivia.JTriviaController(this.model, this.ui);
	}

	var app = new JTriviaApp();
	app.controller.loadRound(); //newGame=T/F

}(window))
