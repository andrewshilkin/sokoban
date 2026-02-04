function PersonageView(pers){
  this.pers = pers;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/character.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (pers.coordY * (TILE_WIDTH));
	this.sprite.y = (pers.coordX * (TILE_HEIGHT));

  this.makePersonageUpdateCallback = function(obj){
    return function(){
      console.log("onPersonageUpdate");
      obj.sprite.x = (obj.pers.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.pers.coordX * (TILE_HEIGHT));
      redrawScene();
    }
  }
  this.onPersonageUpdate = this.makePersonageUpdateCallback(this);

  this.pers.observer.subscribe(this.onPersonageUpdate);
}
