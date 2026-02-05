import { Container } from 'pixi.js';
import { GameMap } from './GameMap.js';
import { Personage } from './Personage/Personage.js';
import { PersonageView } from './Personage/PersonageView.js';
import { PersonageController } from './Personage/PersonageController.js';
import { Box } from './Box/Box.js';
import { BoxView } from './Box/BoxView.js';
import { Wall } from './Wall/Wall.js';
import { WallView } from './Wall/WallView.js';
import { GoalPoint } from './GoalPoint/GoalPoint.js';
import { GoalPointView } from './GoalPoint/GoalPointView.js';
import { GameObserver } from './GameObserver.js';
import { History } from './History.js';
import { TILE_WIDTH, TILE_HEIGHT } from './Tile.js';

export function GameWorld(levelsData, canvasWidth, canvasHeight, onLevelComplete) {
  this.container = new Container();
  this.map = null;
  this.pers = null;
  this.boxes = [];
  this.walls = [];
  this.goals = [];
  this.persController = null;
  this.observer = new GameObserver();
  this.currentLevel = 0;
  this.levelsData = levelsData;
  this.totalLevels = Object.keys(levelsData).length;
  this.history = new History();
  this.moveCounter = 0;
  this.canvasWidth = canvasWidth;
  this.canvasHeight = canvasHeight;
  this.onLevelComplete = onLevelComplete;

  this.initMap = function () {
    this.map = new GameMap();
    this.container.addChild(this.map.container);
  };

  this.addPersonage = function (coordX, coordY) {
    this.pers = new Personage(coordX, coordY);
    var persView = new PersonageView(this.pers);
    this.persController = new PersonageController(this.pers, this);
    this.map.objectsContainer.addChild(persView.sprite);
    this.map.takeCell(coordX, coordY, this.pers);
  };

  this.addBox = function (coordX, coordY) {
    let box = new Box(coordX, coordY);
    box._isInGoalPoint = this.isGoalCoords(coordX, coordY);
    var boxView = new BoxView(box);
    this.map.objectsContainer.addChild(boxView.sprite);
    this.map.takeCell(coordX, coordY, box);
    this.boxes.push(box);
  };

  this.movePersonage = function (coordX, coordY, needLog = true) {
    if (needLog) {
      this.history.addMove(
        this.moveCounter,
        this.pers.coordX,
        this.pers.coordY,
        this.pers
      );
      this.moveCounter++;
      this.observer.update();
    }
    this.map.freeCell(this.pers.coordX, this.pers.coordY);
    this.pers.coordX = coordX;
    this.pers.coordY = coordY;
    this.pers.observer.update();
    this.map.takeCell(coordX, coordY, this.pers);
  };

  this.moveBox = function (box, coordX, coordY, needLog = true) {
    if (needLog) {
      this.history.addMove(this.moveCounter, box.coordX, box.coordY, box);
    }
    this.map.freeCell(box.coordX, box.coordY);
    box.coordX = coordX;
    box.coordY = coordY;
    this.map.takeCell(coordX, coordY, box);

    box._isInGoalPoint = this.isGoalCoords(coordX, coordY);
    box.observer.update();

    if (this.isAllGoalsDone()) {
      if (this.onLevelComplete) {
        // +1 because movePersonage (which increments counter) is called after moveBox
        this.onLevelComplete(this.moveCounter + 1);
      }
    }
  };

  this.addWall = function (coordX, coordY) {
    let wall = new Wall(coordX, coordY);
    var wallView = new WallView(wall);
    this.map.objectsContainer.addChild(wallView.sprite);
    this.map.takeCell(coordX, coordY, wall);
  };

  this.addGoalPoint = function (coordX, coordY) {
    let goal = new GoalPoint(coordX, coordY);
    var goalView = new GoalPointView(goal);
    this.map.objectsContainer.addChildAt(goalView.sprite, 0);
  };

  this.loadLevel = function (level) {
    if (!this.levelsData[level]) {
      level = 1;
    }
    this.currentLevel = level;
    this.observer.update();

    let levelData = this.levelsData[level].data;
    let levelGoals = (this.goals = this.levelsData[level].goals);
    let mWidth = levelData.length;
    let mHeight = levelData[0].length;
    this.map.clean();
    this.map.buildLevel(mWidth, mHeight);

    for (let cellX = 0; cellX < mWidth; cellX++) {
      for (let cellY = 0; cellY < mHeight; cellY++) {
        switch (levelData[cellX][cellY]) {
          case 0:
            break;
          case 1:
            this.addWall(cellX, cellY);
            break;
          case 2:
            this.addPersonage(cellX, cellY);
            break;
          case 3:
            this.addBox(cellX, cellY);
            break;
        }
      }
    }
    levelGoals.forEach((goalCoords) => {
      this.addGoalPoint(goalCoords[0], goalCoords[1]);
    });

    // Center the map in the canvas
    let mapPixelWidth = mHeight * TILE_WIDTH;
    let mapPixelHeight = mWidth * TILE_HEIGHT;
    let hudHeight = 50;
    this.map.container.x = (this.canvasWidth - mapPixelWidth) / 2;
    this.map.container.y =
      (this.canvasHeight - hudHeight - mapPixelHeight) / 2;
  };

  this.isGoalCoords = function (coordX, coordY) {
    for (let i = 0; i < this.goals.length; i++) {
      if (coordX == this.goals[i][0] && coordY == this.goals[i][1]) {
        return true;
      }
    }
    return false;
  };

  this.isAllGoalsDone = function () {
    for (let i = 0; i < this.goals.length; i++) {
      var isBoxInGoal = this.boxes.some((box) => {
        return (
          box.coordX == this.goals[i][0] && box.coordY == this.goals[i][1]
        );
      });
      if (!isBoxInGoal) return false;
    }
    return true;
  };

  this.restart = function () {
    this.clean();
    this.loadLevel(this.currentLevel);
  };

  this.clean = function () {
    this.pers = null;
    this.boxes = [];
    this.walls = [];
    this.goals = [];
    this.history.clean();
    this.moveCounter = 0;
  };

  this.nextLevel = function () {
    this.clean();
    this.loadLevel(this.currentLevel + 1);
  };

  this.undoMove = function () {
    let actions = this.history.undoMove();
    if (!actions) return;
    actions.forEach((item) => {
      if (item[0] instanceof Box) {
        this.moveBox(item[0], item[1], item[2], false);
      } else {
        this.movePersonage(item[1], item[2], false);
      }
    });
    this.moveCounter--;
    if (this.moveCounter < 0) this.moveCounter = 0;
    this.observer.update();
  };
}
