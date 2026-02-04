function PersonageController(pers){
  this.pers = pers;
  this.moveRight = function(){
    console.log("R");
    if(tryMoveTo(this.pers.coordX, this.pers.coordY+1)){
      gameWorld.movePersonage(this.pers.coordX, this.pers.coordY+1);
      this.pers.observer.update();
    }
  }
  this.moveLeft = function(){
    console.log("L");
    if(tryMoveTo(this.pers.coordX, this.pers.coordY-1)){
      gameWorld.movePersonage(this.pers.coordX, this.pers.coordY-1);
      this.pers.observer.update();
    }
  }
  this.moveUp = function(){
    console.log("U");
    if(tryMoveTo(this.pers.coordX-1, this.pers.coordY)){
      gameWorld.movePersonage(this.pers.coordX-1, this.pers.coordY);
      this.pers.observer.update();
    }
  }
  this.moveDown = function(){
    console.log("D");
    if(tryMoveTo(this.pers.coordX+1, this.pers.coordY)){
      gameWorld.movePersonage(this.pers.coordX+1, this.pers.coordY);
      this.pers.observer.update();
    }
  }

  function tryMoveTo (coordX, coordY){
    var cellOwner = gameWorld.map.tiles[coordX][coordY].placedObject;
    if(cellOwner && cellOwner instanceof Box){
      let newCoordX = coordX + (coordX - gameWorld.pers.coordX);
      let newCoordY = coordY + (coordY - gameWorld.pers.coordY);
      tryPushBox(cellOwner, newCoordX, newCoordY);
    }
    return gameWorld.map.isCellFree(coordX, coordY);
  }
  function tryPushBox(box, coordX, coordY){
    if(gameWorld.map.isCellFree(coordX, coordY)){
      gameWorld.moveBox(box, coordX, coordY);
      box.observer.update();
    }
  }
}
