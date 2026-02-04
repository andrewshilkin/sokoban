function WallView(wall){
  this.wall = wall;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/wall.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (wall.coordY * (TILE_WIDTH));
	this.sprite.y = (wall.coordX * (TILE_HEIGHT));

  this.makeBoxUpdateCallback = function(obj){
    return function(){
      console.log("onBoxUpdate");
      obj.sprite.x = (obj.wall.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.wall.coordX * (TILE_HEIGHT));
      redrawScene();
    }
  }
  this.onBoxUpdate = this.makeBoxUpdateCallback(this);
  this.wall.observer.subscribe(this.onBoxUpdate);
}
