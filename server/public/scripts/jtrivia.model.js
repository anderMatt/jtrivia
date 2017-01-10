(function(window){
	function JTriviaModel(){
		this.round = null;
		this.currentRoundName = null;
		this.activeClue = null;
		this.score = 0;

		this.gameConfig = {
			"jeopardy": {
				clueValues: [200, 400, 600, 800, 1000],
				numDailyDoubles: 1
			},
			"double jeopardy": {
				clueValues: [400, 800, 1200, 1600, 2000],
				numDailyDoubles: 2
			}
		};
	}


	JTriviaModel.prototype.reset = function(){
		this.round = null;
		this.activeClue = null;
		this.currentRoundName = null;
		this.score = 0;
	};


	JTriviaModel.prototype._assignClueValues = function(gameObj, roundName){
		var clueValues = this.gameConfig[roundName].clueValues;

		Object.keys(gameObj).forEach(category => {
			gameObj[category].forEach( (clue, clueIndex) => {
				clue.value = clueValues[clueIndex];
			});
		});
		//TODO: set daily doubles.
	};

	JTriviaModel.prototype._determineNextGameRound = function(){
		switch(this.currentRoundName){
			case null:
				return 'jeopardy';
			case 'jeopardy':
				return 'double jeopardy';
			case 'double jeopardy':
				return 'final jeopardy'
		}
	};


	JTriviaModel.prototype.setActiveClue = function(category, index){
		this.activeClue = this.round[category][index];
		return this.activeClue;
	}


	JTriviaModel.prototype.loadRound = function(){
		var self = this;
		this.currentRoundName = this._determineNextGameRound(); //j, dj, or fj
		return this._getGameRound()
			.then(round => {
				self._assignClueValues(round, this.currentRoundName);
				self.round = round;
				return self.round;
			}); //where to catch?
	};

	JTriviaModel.prototype._getGameRound = function(){
		var roundPromise = function(resolve, reject){
			var req = new XMLHttpRequest();
			req.open('GET', '/game');
			req.onload = function(){
				if(this.status == 200){
					var game = JSON.parse(req.response);
					resolve(game);

				}
				else {
					reject({
						status: this.status,
						statusText: req.statusText
					});
				}
			}

			req.send();
		}

		return new Promise(roundPromise);
	};

	
	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaModel = JTriviaModel;

}(window))
