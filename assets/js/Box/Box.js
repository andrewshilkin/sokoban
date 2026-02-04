function Box(coordX, coordY){
  GameObjectModel.apply(this, arguments);
  this._isInGoalPoint = false;
  Object.defineProperty(this, "isInGoalPoint", {
		get: function(){
			return this._isInGoalPoint;
		},
		set: (value)=>{
			this._isInGoalPoint = value;
			this.observer.update();
		}
	});
}
Box.prototype = Object.create(GameObjectModel.prototype);
Box.prototype.constructor = Box;
