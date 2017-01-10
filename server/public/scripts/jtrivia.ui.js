//dependency: JTrivia.util, JTrivia.event

(function(window){
	function JTriviaUI(){
		this.dom = {
			score: document.getElementById('score'),
			board: document.getElementById('board')
		};	

		this.clueSelected = new JTrivia.Event(this);
	}

	JTriviaUI.prototype.renderBoard = function(game){
		var html = Handlebars.templates.board({game: game});
		this.dom.board.innerHTML = html;
		this._fadeInClueValues().then(()=> {
			this.dom.board.addEventListener('click', this.handleBoardClick.bind(this));
		});
	}

	JTriviaUI.prototype._isValidClueSelection = function(selected){
		if(!selected.classList.contains('clue') || selected.classList.contains('answered')){
			return false;
		}
		return true;
	}

	JTriviaUI.prototype._getClueData = function(clueNode){
		return {
			category: clueNode.dataset.category,
			index: clueNode.dataset.index
		};
	}

	JTriviaUI.prototype.handleBoardClick = function(event){
		var selected = event.target;
		if(!this._isValidClueSelection(selected)){
			return;
		}

		var clueData = this._getClueData(selected);
		this.clueSelected.notify(clueData.category, clueData.index);
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
