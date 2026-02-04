var renderer = PIXI.autoDetectRenderer(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
stage.interactive = true;
stage.position.x = 0;
stage.position.y = 0;

function redrawScene(){
  renderer.render(stage);
}
var gameWorld = null;
var ui = null;

PIXI.loader
  .add("img/box.png")
  .add("img/wall.png")
  .add("img/character.png")
  .add("img/ground.png")
  .add("data/levels.json")
  .add("img/goalPoint.png")
  .load(onInit);

function onInit(){
  gameWorld = new GameWorld();
  ui = new UI();
  gameWorld.observer.subscribe(function(){
    ui.updateLevelCount(gameWorld.currentLevel);
  });

  gameWorld.initMap();
  gameWorld.loadLevel(1);

	stage.addChild(gameWorld.container);
  stage.addChild(ui.container);

  InitControl();
  redrawScene();
}

function InitControl(){
  let left = Keyboard(37),
      up = Keyboard(38),
      right = Keyboard(39),
      down = Keyboard(40);
      keyR = Keyboard(82);
      keyB = Keyboard(66);
  //Left arrow key `press` method
  left.press = () => {
    gameWorld.persController.moveLeft();
  };
  //Left arrow key `release` method
  left.release = () => {
  };

  //Up
  up.press = () => {
    gameWorld.persController.moveUp();
  };
  up.release = () => {

  };

  //Right
  right.press = () => {
    gameWorld.persController.moveRight();
  };
  right.release = () => {
  };

  //Down
  down.press = () => {
    gameWorld.persController.moveDown();
  };
  down.release = () => {
  };

  //R
  keyR.press = () => {
    gameWorld.restart();
  };
  keyR.release = () => {
  };

  //B
  keyB.press = () => {
    gameWorld.undoMove();
  };
  keyB.release = () => {
  };
}
