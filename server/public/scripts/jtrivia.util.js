(function(window){
	function shuffleArray(arr){ //in-place mutation.
		var counter = arr.length;
		while(counter > 0){
			var index = Math.floor(Math.random() * counter);
			counter -= 1;
			var temp = arr[counter];
			arr[counter] = arr[index];
			arr[index] = temp;
		}
	};

	function getRandomNumbers(min, max, sampleSize){
		//TODO: TypeErrors.
		var numbers = [];
		for(var i=min; i<sampleSize; i++){
			numbers.push(i);
		}

		shuffleArray(numbers);
		var randomNumbers = numbers.slice(0, sampleSize);
		return randomNumbers;

		//stackoverflow.com/questions.2380019/generate-uunique-random-numbers-between-1-and-100;

	};


	function toArray(collection){
		return Array.prototype.slice.call(collection);
	}

	var util = {
		shuffleArray: shuffleArray,
		toArray: toArray
	};

	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.util = util;
}(window))
