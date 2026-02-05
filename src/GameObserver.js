export function GameObserver() {
  this.handlers = [];

  this.subscribe = function (sub) {
    this.handlers.push(sub);
  };

  this.unsubscribe = function (sub) {
    this.handlers = this.handlers.filter(function (item) {
      return item !== sub;
    });
  };

  this.update = function (obj, thisObj) {
    var scope = thisObj || window;
    this.handlers.forEach(function (item) {
      item.call(scope, obj);
    });
  };
}
