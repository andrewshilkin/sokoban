import { Sprite, Texture } from 'pixi.js';
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile.js';
import { animationManager } from '../AnimationManager.js';

export function PersonageView(pers) {
  this.pers = pers;
  var texture = Texture.from('img/character.png');
  this.sprite = new Sprite(texture);

  this.sprite.x = pers.coordY * TILE_WIDTH;
  this.sprite.y = pers.coordX * TILE_HEIGHT;

  this.makePersonageUpdateCallback = function (obj) {
    return function () {
      var targetX = obj.pers.coordY * TILE_WIDTH;
      var targetY = obj.pers.coordX * TILE_HEIGHT;
      animationManager.animateTo(obj.sprite, targetX, targetY, 100);
    };
  };
  this.onPersonageUpdate = this.makePersonageUpdateCallback(this);

  this.pers.observer.subscribe(this.onPersonageUpdate);
}
