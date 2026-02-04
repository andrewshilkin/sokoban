function GameObserver() {
	this.handlers = [];
	this.subscribe = function(sub){
		this.handlers.push(sub);
		if(!sub)
			console.log(sub);
	}
	this.unsubscribe = function(sub){
		this.handlers = this.handlers.filter(
			function(item){
				if(item !== sub){
					return item;
				}
			}
		)
	}
	this.update = function(obj, thisObj){
		var scope = thisObj || window;
		this.handlers.forEach(function(item){
			item.call(scope, obj);
			}
		);
	}
}
