(function(window){
	function Event(sender){
		this._sender = sender;
		this._listeners = [];
	}	

	Event.prototype.attach = function(listener){
		// console.log('attaching');
		this._listeners.push(listener);
	}

	Event.prototype.notify = function(args){
		var args = Array.prototype.slice.apply(arguments);
		// console.log("Event.notify function got these args: " + JSON.stringify(args));
		for(var i=0, max=this._listeners.length; i<max; i++){
			// this._listeners[i](args);
			this._listeners[i].apply(null, args);
		}
	}

	//export to window;
	
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.Event = Event;
}(window))
