import { Container, Sprite, Texture } from 'pixi.js';
import { TILE_WIDTH, TILE_HEIGHT } from './Tile.js';

export function TileView(tile) {
  this.container = new Container();
  var texture = Texture.from('img/ground.png');
  var sprite = new Sprite(texture);
  this.container.addChild(sprite);
  this.container.x = tile.coordY * TILE_WIDTH;
  this.container.y = tile.coordX * TILE_HEIGHT;
  this.tile = tile;
}
