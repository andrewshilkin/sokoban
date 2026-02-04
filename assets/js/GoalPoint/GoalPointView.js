function GoalPointView(goalPoint){
  this.goalPoint = goalPoint;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/goalPoint.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (goalPoint.coordY * (TILE_WIDTH));
	this.sprite.y = (goalPoint.coordX * (TILE_HEIGHT));

  this.makeGoalUpdateCallback = function(obj){
    return function(){
      console.log("onGoalPointUpdate");
      obj.sprite.x = (obj.goalPoint.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.goalPoint.coordX * (TILE_HEIGHT));
      redrawScene();
    }
  }
  this.onGoalPointUpdate = this.makeGoalUpdateCallback(this);

  this.goalPoint.observer.subscribe(this.onGoalPointUpdate);
}
