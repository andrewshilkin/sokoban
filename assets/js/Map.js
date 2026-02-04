function Map(){

	this.container = new PIXI.Container();
  this.tilesContainer = new PIXI.Container();
  this.objectsContainer = new PIXI.Container();
  this.tiles = [];
  this.tilesViews = [];


  this.buildLevel = function(mWidth, mHeight){
    this.container.addChild(this.tilesContainer);
    this.container.addChild(this.objectsContainer);

    for(var cellX = 0; cellX < mWidth; cellX++){
  		this.tiles[cellX] = [];
      this.tilesViews[cellX] = [];
  		for(var cellY = 0; cellY < mHeight; cellY++){
  			let tile = new Tile(cellX, cellY, 0);
        let tileView = new TileView(tile);

  			this.tilesContainer.addChild(tileView.container);
  			this.tiles[cellX][cellY] = tile;
        this.tilesViews[cellX][cellY] = tileView;
  		}
  	}
  }

  this.takeCell = function(coordX, coordY, owner){
    this.tiles[coordX][coordY].placedObject = owner;
  }
  this.freeCell = function(coordX, coordY){
    this.tiles[coordX][coordY].placedObject = null;
  }
  this.isCellFree = function(coordX,coordY){
    return (this.tiles[coordX][coordY].placedObject == null);
  }
  this.clean = function(){
    this.tilesViews = [];
    this.tiles = [];
    clearContainer(this.container);
    clearContainer(this.tilesContainer);
    clearContainer(this.objectsContainer);
    this.tilesContainer = new PIXI.Container();
    this.objectsContainer = new PIXI.Container();
  }
  function clearContainer(container){
    while(container.children.length > 0){
      container.removeChildAt(0);
    }
  }
}
