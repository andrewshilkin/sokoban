var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

function Tile(coordX, coordY, view, placedObject){
	this.coordX = coordX;
	this.coordY = coordY;
	this._view = view;
	this.placedObject = placedObject;
	Object.defineProperty(this, "view", {
		get: function(){
			return this._view;
		},
		set: function(value){
			this._view = value;
		}
	});

}
