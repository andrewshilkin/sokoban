import { Sprite, Texture } from 'pixi.js';
import { TILE_WIDTH, TILE_HEIGHT } from '../Tile.js';

export function GoalPointView(goalPoint) {
  this.goalPoint = goalPoint;
  var texture = Texture.from('img/goalPoint.png');
  this.sprite = new Sprite(texture);

  this.sprite.x = goalPoint.coordY * TILE_WIDTH;
  this.sprite.y = goalPoint.coordX * TILE_HEIGHT;

  this.makeGoalUpdateCallback = function (obj) {
    return function () {
      obj.sprite.x = obj.goalPoint.coordY * TILE_WIDTH;
      obj.sprite.y = obj.goalPoint.coordX * TILE_HEIGHT;
    };
  };
  this.onGoalPointUpdate = this.makeGoalUpdateCallback(this);

  this.goalPoint.observer.subscribe(this.onGoalPointUpdate);
}
