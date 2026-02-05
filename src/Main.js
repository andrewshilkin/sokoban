import { Application, Assets, Graphics } from 'pixi.js';
import { GameWorld } from './GameWorld.js';
import { UI } from './ui/UI.js';
import { Keyboard } from './Keyboard.js';
import { animationManager } from './AnimationManager.js';
import { LevelCompleteOverlay } from './ui/LevelCompleteOverlay.js';
import { TitleScreen } from './ui/TitleScreen.js';

var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var app = new Application();
var gameWorld = null;
var ui = null;
var overlay = null;
var titleScreen = null;
var fadeOverlay = null;
var inputEnabled = false;
var gameStarted = false;

async function init() {
  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    background: 0x1a1a2e,
  });
  document.body.appendChild(app.canvas);

  await Assets.load([
    'img/box.png',
    'img/wall.png',
    'img/character.png',
    'img/ground.png',
    'img/goalPoint.png',
  ]);

  var response = await fetch('data/levels.json');
  var levelsData = await response.json();

  overlay = new LevelCompleteOverlay(CANVAS_WIDTH, CANVAS_HEIGHT);
  titleScreen = new TitleScreen(CANVAS_WIDTH, CANVAS_HEIGHT);

  fadeOverlay = new Graphics();
  fadeOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  fadeOverlay.fill({ color: 0x1a1a2e });
  fadeOverlay.visible = false;

  gameWorld = new GameWorld(
    levelsData,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    onLevelComplete
  );
  ui = new UI(CANVAS_WIDTH);

  gameWorld.observer.subscribe(function () {
    ui.updateLevelCount(gameWorld.currentLevel, gameWorld.totalLevels);
    ui.updateMoveCount(gameWorld.moveCounter);
  });

  gameWorld.initMap();
  gameWorld.loadLevel(1);

  app.stage.addChild(gameWorld.container);
  app.stage.addChild(ui.container);
  app.stage.addChild(fadeOverlay);
  app.stage.addChild(overlay.container);
  app.stage.addChild(titleScreen.container);

  initControl();

  app.ticker.add(function (ticker) {
    animationManager.update(ticker.deltaMS);
    titleScreen.updatePulse(ticker.deltaMS);
  });

  await titleScreen.show();
}

async function onLevelComplete(moveCount) {
  inputEnabled = false;
  await waitForAnimations();
  await overlay.show(moveCount);

  await new Promise(function (resolve) {
    var timeout = setTimeout(resolve, 3000);
    var handler = function () {
      clearTimeout(timeout);
      window.removeEventListener('keydown', handler);
      resolve();
    };
    window.addEventListener('keydown', handler);
  });

  await overlay.hide();

  await animationManager.fadeIn(fadeOverlay, 300);
  gameWorld.nextLevel();
  await animationManager.fadeOut(fadeOverlay, 300);

  inputEnabled = true;
}

function waitForAnimations() {
  return new Promise(function (resolve) {
    if (!animationManager.isAnimating) {
      resolve();
      return;
    }
    var check = function () {
      if (!animationManager.isAnimating) {
        app.ticker.remove(check);
        resolve();
      }
    };
    app.ticker.add(check);
  });
}

function initControl() {
  var left = Keyboard(37),
    up = Keyboard(38),
    right = Keyboard(39),
    down = Keyboard(40),
    keyR = Keyboard(82),
    keyZ = Keyboard(90);

  var startHandler = async function () {
    if (!gameStarted) {
      gameStarted = true;
      window.removeEventListener('keydown', startHandler);
      await titleScreen.hide();
      inputEnabled = true;
    }
  };
  window.addEventListener('keydown', startHandler);

  left.press = function () {
    if (!inputEnabled || animationManager.isAnimating) return;
    gameWorld.persController.moveLeft();
  };
  up.press = function () {
    if (!inputEnabled || animationManager.isAnimating) return;
    gameWorld.persController.moveUp();
  };
  right.press = function () {
    if (!inputEnabled || animationManager.isAnimating) return;
    gameWorld.persController.moveRight();
  };
  down.press = function () {
    if (!inputEnabled || animationManager.isAnimating) return;
    gameWorld.persController.moveDown();
  };
  keyR.press = function () {
    if (!inputEnabled) return;
    gameWorld.restart();
  };
  keyZ.press = function () {
    if (!inputEnabled || animationManager.isAnimating) return;
    gameWorld.undoMove();
  };
}

init();
