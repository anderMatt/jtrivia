//https://terlici.com/2015/04/03/mongodb-node-express.html
var MongoClient = require('mongodb').MongoClient;

var state = {
	db: null
};

function shuffleArray(arr){ //Fischer-Yates. Returns shuffled array.
	var arr = arr.slice(0);
	var counter = arr.length;
	while(counter > 0){
		var index = Math.floor(Math.random() * counter);
		counter -= 1;
		var temp = arr[counter];
		arr[counter] = arr[index];
		arr[index] = temp;
	}
	return arr;
}

function getRandomSample(arr, size){
	if(!arr){
		throw new TypeError(`Cannot take a random sample from an empty array!`);
	}
	if(size <= 0 || size > arr.length){
		throw new TypeError(`${size} is not a valid sample size. Sample size must be between 1 and ${arr.length}.`)
	}

	var shuffled = shuffleArray(arr);
	return shuffled.slice(0, size);
}


function generateCategoryAnswerPool(category){
	return category.clues.map(clue => {
		return clue.answer;
	});
}


function addFalseAnswers(game){  // game is array of category docs from Mongo.
	game.forEach(category => {
		answerPool = generateCategoryAnswerPool(category);
		category.clues.forEach((clue, clueIndex) => {
			clueAnswerPool = answerPool.slice(0);
			clueAnswerPool.splice(clueIndex, 1);
			falseAnswers = getRandomSample(clueAnswerPool, 2);
			clue.falseAnswers = falseAnswers;
		});
	});

	return game;
}


function constructGame(){
	var gamePromise = function(resolve, reject){
		state.db.collection('categories')
			.aggregate([
				{"$sample": {"size": 6}},
				{"$project": {_id:0, "clues":1, "category":1}}
			], function(err, categories){
				if(err) reject(err);
				addFalseAnswers(categories);
				var game = categories.reduce((gameObj, categoryObj) => {  //merge category objects into a single game object. Keys are category titles, values are array of clue objects for that category.
					gameObj[categoryObj.category] = categoryObj.clues;
					return gameObj;
				}, {});
				resolve(game)
			});
	}

	return new Promise(gamePromise);
}


module.exports.connect = function(url, done){
	if(state.db) return done(null)

	MongoClient.connect(url, function(err, db){
		if(err) return done(err);
		state.db = db;
		done()
	});
}

module.exports.constructGame = constructGame;
