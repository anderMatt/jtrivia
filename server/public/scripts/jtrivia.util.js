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
	}	

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
