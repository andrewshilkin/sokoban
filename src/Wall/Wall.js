import { GameObjectModel } from '../GameObjectModel.js';

export function Wall(coordX, coordY) {
  GameObjectModel.apply(this, arguments);
}
Wall.prototype = Object.create(GameObjectModel.prototype);
Wall.prototype.constructor = Wall;
