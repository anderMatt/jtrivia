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

	function numericOnly(event){
		var k = event.keyCode;
		//allow arrow keys.
		if( (k >= 48 && k <= 57) || //numbers (TODO: numpad)
			(k >= 37 && k <= 40) || //arrow keys
			( [8, 9, 27, 17, 13].indexOf(k) != -1) //backspace, tab, escape, ctrl, enter.
		){
			return;
		} else {
			event.preventDefault();
		}
	}

	function toArray(collection){
		return Array.prototype.slice.call(collection);
	}


	var util = {
		shuffleArray: shuffleArray,
		numericOnly: numericOnly,
		toArray: toArray
	};

	//export to window
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.util = util;
}(window))
