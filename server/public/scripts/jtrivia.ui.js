//dependency: JTrivia.util, JTrivia.event

(function(window){
	function JTriviaUI(){
		this.dom = {
			score: document.getElementById('score'),
			board: document.getElementById('board'),
			clueWindow: document.getElementById('clue-window')
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
		if(!selected.classList.contains('clue') || selected.classList.contains('seen')){
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
		var selectedClue = event.target;
		if(!this._isValidClueSelection(selectedClue)){
			return;
		}
	
		selectedClue.classList.add('seen');
		var clueData = this._getClueData(selectedClue);
		this.clueSelected.notify(clueData.category, clueData.index);
	}

	JTriviaUI.prototype.openClue = function(clue){
		//this.populateClueWindow(clue) ---> sets Q, Answers, etc.
		this.dom.clueWindow.classList.add('open');
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
