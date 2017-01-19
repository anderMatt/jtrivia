(function(window){
	function JTriviaModel(){

		this.gameBuilder = new JTrivia.JTriviaGameBuilder();
		this.round = null;
		this.roundName = null;
		this.activeClue = null;
		this._score = 0;
		this.totalClueAttempts = 0;
		this.cluesAnsweredCorrectly;
		this.roundLoadingInProgress = false;

		this.scoreChanged = new JTrivia.Event(this);

		this.timer = new JTrivia.Timer(5000, 1000); //5 second duration, 1 sec interval.
		this.timerTimeout = null;

		this.maxDailyDoubleWagers = {
			"jeopardy": 1000,
			"double jeopardy": 2000
		};

	}

	JTriviaModel.prototype = {
		set score(newScore){
			this._score = newScore;
			this.scoreChanged.notify(this._score);
		},

		get score(){
			return this._score;
		}
	};


	JTriviaModel.prototype.reset = function(){
		this.round = null;
		this.activeClue = null;
		this.roundName = null;
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
		switch(this.roundName){
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


	JTriviaModel.prototype.getActiveClue = function(){
		return this.activeClue;
	};


	JTriviaModel.prototype.makeWager = function(wager){
		var err = this._validateWager(wager);
		if(err){
			return err;
		}
		this._setWager(wager);
		return null; //valid wager.
	};


	JTriviaModel.prototype._validateWager = function(wager){
		if(wager < 5){
			return "Wager must be at least five dollars."	
		}

		var defaultMaxWager = this.maxDailyDoubleWagers[this.roundName];
		var maxValidWager = ( (this.score >= defaultMaxWager) ?
			this.score :
			defaultMaxWager);

		if(wager > maxValidWager){
			return `The maximum wager is ${maxValidWager}`;
		} else {
		return null; //valid wager.	
		}
	};


	JTriviaModel.prototype._setWager = function(wager){
		this.activeClue.value = wager;
	};


	JTriviaModel.prototype._updateStats = function(outcome){
		var deltaScore;
		this.clueAttempts += 1;

		if(outcome === "correct"){
			deltaScore = this.activeClue.value;
			this.cluesAnsweredCorrectly += 1;
		}
		else {
			deltaScore = -1 * this.activeClue.value;
		}

		this.score = this.score + deltaScore;
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
			);
		}

		this._updateStats(outcome);

		return {
			outcome: outcome,
			correctAnswer: this.activeClue.answer
		};

	};

	JTriviaModel.prototype.isRequestInProgress = function(){
		return this.gameBuilder.roundRequestInProgress;	
	};

	JTriviaModel.prototype.loadRound = function(){
		var self = this;
		this.roundName = this._determineNextGameRound(); //j, dj, or fj

		return this.gameBuilder.buildRound(this.roundName)
			.then(round => {
				self.round = round;
				return self.round;
			});

	};

	
	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.JTriviaModel = JTriviaModel;

}(window))
