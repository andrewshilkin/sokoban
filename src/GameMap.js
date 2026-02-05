import { Container } from 'pixi.js';
import { Tile } from './Tile.js';
import { TileView } from './TileView.js';

export function GameMap() {
  this.container = new Container();
  this.tilesContainer = new Container();
  this.objectsContainer = new Container();
  this.tiles = [];

  this.buildLevel = function (mWidth, mHeight) {
    this.container.addChild(this.tilesContainer);
    this.container.addChild(this.objectsContainer);

    for (var cellX = 0; cellX < mWidth; cellX++) {
      this.tiles[cellX] = [];
      for (var cellY = 0; cellY < mHeight; cellY++) {
        let tile = new Tile(cellX, cellY, 0);
        let tileView = new TileView(tile);
        this.tilesContainer.addChild(tileView.container);
        this.tiles[cellX][cellY] = tile;
      }
    }
  };

  this.takeCell = function (coordX, coordY, owner) {
    if (
      coordX >= 0 &&
      coordX < this.tiles.length &&
      coordY >= 0 &&
      coordY < this.tiles[coordX].length
    ) {
      this.tiles[coordX][coordY].placedObject = owner;
    }
  };

  this.freeCell = function (coordX, coordY) {
    if (
      coordX >= 0 &&
      coordX < this.tiles.length &&
      coordY >= 0 &&
      coordY < this.tiles[coordX].length
    ) {
      this.tiles[coordX][coordY].placedObject = null;
    }
  };

  this.isCellFree = function (coordX, coordY) {
    if (
      coordX < 0 ||
      coordX >= this.tiles.length ||
      coordY < 0 ||
      coordY >= this.tiles[coordX].length
    ) {
      return false;
    }
    return this.tiles[coordX][coordY].placedObject == null;
  };

  this.clean = function () {
    this.tiles = [];
    clearContainer(this.container);
    clearContainer(this.tilesContainer);
    clearContainer(this.objectsContainer);
    this.tilesContainer = new Container();
    this.objectsContainer = new Container();
  };

  function clearContainer(container) {
    while (container.children.length > 0) {
      container.removeChildAt(0);
    }
  }
}
