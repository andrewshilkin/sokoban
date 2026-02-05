import { Box } from '../Box/Box.js';

export function PersonageController(pers, gameWorld) {
  this.pers = pers;

  this.moveRight = function () {
    if (tryMoveTo(this.pers.coordX, this.pers.coordY + 1)) {
      gameWorld.movePersonage(this.pers.coordX, this.pers.coordY + 1);
    }
  };

  this.moveLeft = function () {
    if (tryMoveTo(this.pers.coordX, this.pers.coordY - 1)) {
      gameWorld.movePersonage(this.pers.coordX, this.pers.coordY - 1);
    }
  };

  this.moveUp = function () {
    if (tryMoveTo(this.pers.coordX - 1, this.pers.coordY)) {
      gameWorld.movePersonage(this.pers.coordX - 1, this.pers.coordY);
    }
  };

  this.moveDown = function () {
    if (tryMoveTo(this.pers.coordX + 1, this.pers.coordY)) {
      gameWorld.movePersonage(this.pers.coordX + 1, this.pers.coordY);
    }
  };

  function tryMoveTo(coordX, coordY) {
    if (
      coordX < 0 ||
      coordX >= gameWorld.map.tiles.length ||
      coordY < 0 ||
      coordY >= gameWorld.map.tiles[0].length
    ) {
      return false;
    }
    var cellOwner = gameWorld.map.tiles[coordX][coordY].placedObject;
    if (cellOwner && cellOwner instanceof Box) {
      let newCoordX = coordX + (coordX - gameWorld.pers.coordX);
      let newCoordY = coordY + (coordY - gameWorld.pers.coordY);
      tryPushBox(cellOwner, newCoordX, newCoordY);
    }
    return gameWorld.map.isCellFree(coordX, coordY);
  }

  function tryPushBox(box, coordX, coordY) {
    if (
      coordX < 0 ||
      coordX >= gameWorld.map.tiles.length ||
      coordY < 0 ||
      coordY >= gameWorld.map.tiles[0].length
    ) {
      return;
    }
    if (gameWorld.map.isCellFree(coordX, coordY)) {
      gameWorld.moveBox(box, coordX, coordY);
    }
  }
}
