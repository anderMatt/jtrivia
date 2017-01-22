(function(){
	function JTriviaGameBuilder(){
		this.url = '/game';
		this.roundRequestInProgress = false; //flag backend action.

		this.gameConfig = {
			'jeopardy': {
				clueValues: [200, 400, 600, 800, 1000],
				numDailyDoubles: 1
			},
			'double jeopardy': {
				clueValues: [400, 800, 1200, 1600, 2000],
				numDailyDoubles: 2
			}
		};

	}	

	JTriviaGameBuilder.prototype._loadRound = function(){
		var self = this;
		this.roundRequestInProgress = true;

		var roundPromise = function(resolve, reject){
			var req = new XMLHttpRequest();
			req.open('GET', self.url);
			req.onload = function(){
				self.roundRequestInProgress = false;
				if(this.status === 200){
					var round = JSON.parse(req.response);
					resolve(round);
				} else {
					reject({
						status: this.status,
						statusText: req.statusText
					});
				}
			};

			req.onerror = function(){
				reject({
					status: this.status,
					statusText: req.statusText
				});
			};

			req.send();
		}

		return new Promise(roundPromise);
	};

	JTriviaGameBuilder.prototype.buildRound = function(roundName){
		var self = this;
		return this._loadRound()
			.then(round => {
				var clueValues = this.gameConfig[roundName].clueValues;
				var numDailyDoubles = this.gameConfig[roundName].numDailyDoubles;

				self._assignClueValues(round, clueValues);
				self._assignDailyDoubles(round, numDailyDoubles);

				return round;
			});
	};

	JTriviaGameBuilder.prototype._assignClueValues = function(roundObj, clueValues){
		Object.keys(roundObj).forEach(category => {
			roundObj[category].forEach( (clue, clueIndex) => {
				clue.value = clueValues[clueIndex];
			});
		});
	};


	JTriviaGameBuilder.prototype._assignDailyDoubles = function(roundObj, numDailyDoubles){
		var categories = Object.keys(roundObj);
		var clueIndices = [0, 1, 2, 3, 4];

		JTrivia.util.shuffleArray(categories);
		JTrivia.util.shuffleArray(clueIndices);

		for(var i=0, max=numDailyDoubles; i<max; i++){
			let randomCategory = categories[i];
			let randomClue = clueIndices[i];
			roundObj[randomCategory][randomClue].dailyDouble = true;
		}
	};

	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaGameBuilder = JTriviaGameBuilder;

}())
