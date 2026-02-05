import { Sprite, Texture } from 'pixi.js';
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile.js';

export function WallView(wall) {
  this.wall = wall;
  var texture = Texture.from('img/wall.png');
  this.sprite = new Sprite(texture);

  this.sprite.x = wall.coordY * TILE_WIDTH;
  this.sprite.y = wall.coordX * TILE_HEIGHT;

  this.makeWallUpdateCallback = function (obj) {
    return function () {
      obj.sprite.x = obj.wall.coordY * TILE_WIDTH;
      obj.sprite.y = obj.wall.coordX * TILE_HEIGHT;
    };
  };
  this.onWallUpdate = this.makeWallUpdateCallback(this);
  this.wall.observer.subscribe(this.onWallUpdate);
}
