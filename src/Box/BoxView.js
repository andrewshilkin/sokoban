import { Sprite, Texture } from 'pixi.js';
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile.js';
import { animationManager } from '../AnimationManager.js';

export function BoxView(box) {
  this.box = box;
  var texture = Texture.from('img/box.png');
  this.sprite = new Sprite(texture);
  this.sprite.anchor.set(0.5);

  this.sprite.x = box.coordY * TILE_WIDTH + TILE_WIDTH / 2;
  this.sprite.y = box.coordX * TILE_HEIGHT + TILE_HEIGHT / 2;

  // Apply initial goal state
  if (box._isInGoalPoint) {
    this.sprite.tint = 0x4ade80;
  }

  this.makeBoxUpdateCallback = function (obj) {
    return function () {
      var targetX = obj.box.coordY * TILE_WIDTH + TILE_WIDTH / 2;
      var targetY = obj.box.coordX * TILE_HEIGHT + TILE_HEIGHT / 2;
      animationManager.animateTo(obj.sprite, targetX, targetY, 100);

      if (obj.box.isInGoalPoint === true) {
        obj.sprite.tint = 0x4ade80;
        animationManager.scalePulse(obj.sprite, 1.15, 200);
      } else {
        obj.sprite.tint = 0xffffff;
      }
    };
  };
  this.onBoxUpdate = this.makeBoxUpdateCallback(this);

  this.box.observer.subscribe(this.onBoxUpdate);
}
