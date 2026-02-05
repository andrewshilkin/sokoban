import { GameObjectModel } from '../GameObjectModel.js';

export function Personage(coordX, coordY) {
  GameObjectModel.apply(this, arguments);
}
Personage.prototype = Object.create(GameObjectModel.prototype);
Personage.prototype.constructor = Personage;
