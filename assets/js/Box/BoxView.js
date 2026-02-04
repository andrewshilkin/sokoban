function BoxView(box){
  this.box = box;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/box.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (box.coordY * (TILE_WIDTH));
	this.sprite.y = (box.coordX * (TILE_HEIGHT));

  this.makeBoxUpdateCallback = function(obj){
    return function(){
      console.log("onBoxUpdate");
      obj.sprite.x = (obj.box.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.box.coordX * (TILE_HEIGHT));
      if(obj.box.isInGoalPoint === true){
        var filter = new PIXI.filters.ColorMatrixFilter();
        filter.desaturate();
        obj.sprite.filters = [filter];
      }else{
        obj.sprite.filters = undefined;
      }
      redrawScene();
    }
  }
  this.onBoxUpdate = this.makeBoxUpdateCallback(this);

  this.box.observer.subscribe(this.onBoxUpdate);
}
