//dependency: JTrivia.util

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
		this._fadeInClueValues().then( ()=> {
			console.log('Done fading in values');
		});
	}

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
	}

	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaUI = JTriviaUI;
}(window))
