(function(window){
	function JTriviaUI(){
		this.dom = {
			score: document.getElementById('score'),
			board: document.getElementById('board')
		};	
	}

	JTriviaUI.prototype.renderBoard = function(game){
		var html = Handlebars.templates.board({game: game});
		this.dom.board.innerHTML = html;
	}

	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaUI = JTriviaUI;
}(window))
