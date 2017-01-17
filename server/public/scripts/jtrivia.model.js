(function(window){
	function JTriviaModel(){
		this.round = null;
		this.currentRoundName = null;
		this.activeClue = null;
		this.score = 0;

		this.timer = new JTrivia.Timer(5000, 1000); //5 second duration, 1 sec interval.
		this.timerTimeout = null;

		this.gameConfig = {
			"jeopardy": {
				clueValues: [200, 400, 600, 800, 1000],
				numDailyDoubles: 1,
				maxDailyDoubleWager: 1000 //max is current score ('true daily double') OR max clue value, whichever is greater.
			},
			"double jeopardy": {
				clueValues: [400, 800, 1200, 1600, 2000],
				numDailyDoubles: 2,
				maxDailyDoubleWager: 2000
			}
		};

	}


	JTriviaModel.prototype.reset = function(){
		this.round = null;
		this.activeClue = null;
		this.currentRoundName = null;
		this.score = 0;
	};


	JTriviaModel.prototype.getTimer = function(){
		return this.timer;
	};

	
	JTriviaModel.prototype.startClueTimer = function(delay){
		if(delay){
			this.timerTimeout = window.setTimeout( ()=> {
				this.timerTimeout = null;			
				this.timer.start()
			}, delay);
		} else {
			this.timer.start();
		}	
	};

	JTriviaModel.prototype._stopClueTimer = function(){
		if(this.timerTimeout){
			//ctrl called startClueTimer with a delay - answer submitted before timer started. Clear the timeout.
			window.clearTimeout(this.timerTimeout);
			this.timerTimeout = null;
		} else {
			this.timer.stop();
		}
	};


	JTriviaModel.prototype._assignClueValues = function(roundObj, clueValues){

		Object.keys(roundObj).forEach(category => {
			roundObj[category].forEach( (clue, clueIndex) => {
				clue.value = clueValues[clueIndex];
			});
		});
		//TODO: set daily doubles.
	};

	JTriviaModel.prototype._assignDailyDoubles = function(roundObj, numDailyDoubles){
		
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

		var clue = this.round[category][index];
		this.activeClue = Object.assign({}, clue);
		this.activeClue.category = category;

		return this.activeClue;
	};


	JTriviaModel.prototype.validateWager = function(wager){
		if(wager < 5){
			return "Wager must be at least five dollars."	
		}

		var defaultMaxWager = this.gameConfig[this.currentRoundName].maxDailyDoubleWager;
		var maxValidWager = ( (this.currentScore >= defaultMaxWager) ?
			this.currentScore :
			defaultMaxWager);

		if(wager > maxValidWager){
			return `The maximum wager is ${maxValidWager}`;
		} else {
		return null; //valid wager.	
	}
	};


	JTriviaModel.prototype.answerClue = function(submittedAnswer){
		//returns: {outcome, correctAnswer}	
		this._stopClueTimer();

		var outcome,
			correctAnswer;

		if(submittedAnswer === null){
			outcome = "timeout";
		}
		else{
			outcome = (submittedAnswer === this.activeClue.answer ?
				'correct':
				'incorrect'
			)
		}

		//update stats, passing outcome.

		return {
			outcome: outcome,
			correctAnswer: this.activeClue.answer
		};

	};

	JTriviaModel.prototype.loadRound = function(){
		var self = this;
		this.currentRoundName = this._determineNextGameRound(); //j, dj, or fj

		return this._getGameRound()
			.then(round => {
				var clueValues = this.gameConfig[this.currentRoundName].clueValues;
				var numDailyDoubles = this.gameConfig[this.currentRoundName].numDailyDoubles;
				
				//add clue values and daily doubles to the round.
				self._assignClueValues(round, clueValues);
				self._assignDailyDoubles(round, numDailyDoubles);

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

			//TODO: req.onerror

			req.send();
		}

		return new Promise(roundPromise);
	};

	
	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaModel = JTriviaModel;

}(window))
