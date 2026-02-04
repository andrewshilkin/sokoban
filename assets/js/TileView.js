function TileView(tile){
	this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/ground.png');
	var sprite = new PIXI.Sprite(texture);
	this.container.addChild(sprite);
	this.container.x = (tile.coordY * (TILE_WIDTH));
	this.container.y = (tile.coordX * (TILE_HEIGHT));

	this.onTileUpdated = function(){
		console.log("onTileUpdated");
	}

	this.tile = tile;

	this.dispose = function(){
		this.tile.unsubscribe(this.onTileUpdated);
	}
}
