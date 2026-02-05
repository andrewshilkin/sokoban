export function History() {
  this.actions = [];

  this.addMove = function (moveIndex, coordX, coordY, target) {
    if (!this.actions[moveIndex]) {
      this.actions[moveIndex] = [];
    }
    this.actions[moveIndex].push([target, coordX, coordY]);
  };

  this.undoMove = function () {
    if (this.actions.length <= 0) {
      return null;
    }
    return this.actions.pop().reverse();
  };

  this.clean = function () {
    this.actions = [];
  };
}
