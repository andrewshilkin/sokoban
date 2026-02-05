import { GameObjectModel } from '../GameObjectModel.js';

export function Box(coordX, coordY) {
  GameObjectModel.apply(this, arguments);
  this._isInGoalPoint = false;
  Object.defineProperty(this, 'isInGoalPoint', {
    get: function () {
      return this._isInGoalPoint;
    },
    set: function (value) {
      this._isInGoalPoint = value;
    },
  });
}
Box.prototype = Object.create(GameObjectModel.prototype);
Box.prototype.constructor = Box;
