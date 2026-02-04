function GoalPoint(coordX, coordY){
  GameObjectModel.apply(this, arguments);
}
GoalPoint.prototype = Object.create(GameObjectModel.prototype);
GoalPoint.prototype.constructor = GoalPoint;
