(function(window){
	function Timer(duration, interval, opts){
		this.duration = duration;
		this.interval = interval;
		this.running = false;
		this.startTime = null;

		this.onTick = new JTrivia.Event(this);
		this.onTimeout = new JTrivia.Event(this);
	}	

	Timer.prototype = {
		start: function(){
			if(this.running) return;
			this.startTime = new Date().getTime();
			this.running = true;
			this.tick();
		},

		tick: function(){
			if(!this.running) return;
			this.onTick.notify();
			var now = new Date().getTime();
			var elapsed = now - this.startTime;
			if(elapsed < this.duration){
				window.setTimeout(this.tick.bind(this), this.interval);
			}
			else {
				this.onTimeout.notify();
				this.running = false;
			}
		},

		stop: function(){
			//doesn't notify onTimeout.
			this.running = false;
		}
	}


	//export to window.
	window.JTrivia = window.JTrivia || {};
	window.JTrivia.Timer = Timer;
}(window))
