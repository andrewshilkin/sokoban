function GameObjectModel(coordX, coordY){
  this.observer = new GameObserver();
  this.coordX = coordX;
  this.coordY = coordY;
}

function GameObserver() {
	this.handlers = [];
	this.subscribe = function(sub){
		this.handlers.push(sub);
		if(!sub)
			console.log(sub);
	}
	this.unsubscribe = function(sub){
		this.handlers = this.handlers.filter(
			function(item){
				if(item !== sub){
					return item;
				}
			}
		)
	}
	this.update = function(obj, thisObj){
		var scope = thisObj || window;
		this.handlers.forEach(function(item){
			item.call(scope, obj);
			}
		);
	}
}

function GameWorld(){
  this.container = new PIXI.Container();
  this.map = null;
  this.pers = null;
  this.boxes = [];
  this.walls = [];
  this.goals = [];
  this.persController = null;
  this.observer = new GameObserver();
  this.currentLevel = 0 ;
  this.levelsData = PIXI.loader.resources["data/levels.json"].data;

  this.history = new History();
  this.moveCounter = 0;

  this.initMap = function(){
    this.map = new Map();
    this.container.addChild(this.map.container);
  }

  this.addPersonage = function(coordX, coordY){
    this.pers = new Personage(coordX,coordY);
    var persView = new PersonageView(this.pers);
    this.persController = new PersonageController(this.pers);
    this.map.objectsContainer.addChild(persView.sprite);
    this.map.takeCell(coordX, coordY, this.pers);
  }

  this.addBox = function(coordX, coordY){
    let box = new Box(coordX, coordY);
    var boxView = new BoxView(box);
    this.map.objectsContainer.addChild(boxView.sprite);
    this.map.takeCell(coordX, coordY, box);
    this.boxes.push(box);
    if(this.isGoalCoords(coordX, coordY)){
      box.isInGoalPoint = true;
    }else{
      box.isInGoalPoint = false;
    }
  }

  this.movePersonage = function(coordX, coordY, needLog=true){
    if(needLog){
      this.history.addMove(this.moveCounter, this.pers.coordX, this.pers.coordY, this.pers);
      this.moveCounter++;
    }
    this.map.freeCell(this.pers.coordX, this.pers.coordY);
    this.pers.coordX = coordX;
    this.pers.coordY = coordY;
    this.pers.observer.update();
    this.map.takeCell(coordX, coordY, this.pers);
  }
  this.moveBox = function(box, coordX, coordY, needLog=true){
    if(needLog){
      this.history.addMove(this.moveCounter, box.coordX, box.coordY, box);
    }
    this.map.freeCell(box.coordX, box.coordY);
    box.coordX = coordX;
    box.coordY = coordY;
    box.observer.update();
    this.map.takeCell(coordX, coordY, box);
    if(this.isGoalCoords(coordX, coordY)){
      box.isInGoalPoint = true;
    }else{
      box.isInGoalPoint = false;
    }
    if(this.isAllGoalsDone()){
      setTimeout(()=>{
          alert("Level Complete");
          this.nextLevel();
      },100);
    }
  }
  this.addWall = function(coordX, coordY){
    let wall = new Wall(coordX, coordY);
    var wallView = new WallView(wall);
    this.map.objectsContainer.addChild(wallView.sprite);
    this.map.takeCell(coordX, coordY, wall);
  }
  this.addGoalPoint = function(coordX, coordY){
    let goal = new GoalPoint(coordX, coordY);
    var goalView = new GoalPointView(goal);
    this.map.objectsContainer.addChildAt(goalView.sprite, 0);
  }
  this.loadLevel = function(level){
    if(!this.levelsData[level]){
      level = 1;
    }
    this.currentLevel = level;
    this.observer.update();

    console.log(this.levelsData[level]);
    let levelData = this.levelsData[level].data;
    let levelGoals = this.goals = this.levelsData[level].goals;
    let mWidth = levelData.length;
    let mHeight = levelData[0].length;
    this.map.clean();
    this.map.buildLevel(mWidth, mHeight);

    for(let cellX = 0; cellX < mWidth; cellX++){
    	for(let cellY = 0; cellY < mHeight; cellY++){
        switch (levelData[cellX][cellY]) {
          case 1:
            this.addWall(cellX, cellY);
            break;
          case 2:
            this.addPersonage(cellX, cellY);
            break;
          case 3:
            this.addBox(cellX, cellY);
            break;
          default:
            console.log("Warning error level data");
            break;
        }
      }
    }
    levelGoals.forEach((goalCoords, i, levelGoals) => {
      this.addGoalPoint(goalCoords[0], goalCoords[1]);
    });
  }
  this.isGoalCoords = function(coordX, coordY){
    for(let i = 0; i < this.goals.length; i++){
      if(coordX == this.goals[i][0] && coordY == this.goals[i][1]){
        return true;
      }
    }
    return false;
  }
  this.isAllGoalsDone = function(){
    let result = true;
    for(let i = 0; i < this.goals.length; i++){
      var isBoxInGoal = this.boxes.some((box)=>{
        return (box.coordX == this.goals[i][0] && box.coordY == this.goals[i][1])
      });
      if(isBoxInGoal==false){
        result = false;
        break;
      }
    }
    return result;
  }
  this.restart = function(){
    this.clean();
    this.loadLevel(this.currentLevel);
    redrawScene();
  }
  this.clean = function(){
    this.pers = null;
    this.boxes = [];
    this.walls = [];
    this.goals = [];
    this.history.clean();
    this.moveCounter = 0;
  }
  this.nextLevel = function(){
    this.clean();
    this.loadLevel(this.currentLevel+1);
    redrawScene();
  }
  this.undoMove = function(){
    this.history.undoMove();
    this.moveCounter--;
    if(this.moveCounter < 0) this.moveCounter = 0;
    redrawScene();
  }
}

function History(){
  this.actions = [];
  this.addMove = function(moveIndex, coordX, coordY, target){
    if(!this.actions[moveIndex]){
      this.actions[moveIndex] = [];
    }
    this.actions[moveIndex].push([target, coordX, coordY]);
  }
  this.undoMove = function(){
    if(this.actions.length <= 0){
        return;
    }
    let actions = this.actions.pop().reverse();
    actions.forEach((item, i, actions)=>{
      if(item[0] instanceof Box){
        gameWorld.moveBox(item[0], item[1], item[2], false);
      }else{
        gameWorld.movePersonage(item[1], item[2], false);
      }
    });
  }
  this.clean = function(){
    this.actions = [];
  }
}

function Keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

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

function Map(){

	this.container = new PIXI.Container();
  this.tilesContainer = new PIXI.Container();
  this.objectsContainer = new PIXI.Container();
  this.tiles = [];
  this.tilesViews = [];


  this.buildLevel = function(mWidth, mHeight){
    this.container.addChild(this.tilesContainer);
    this.container.addChild(this.objectsContainer);

    for(var cellX = 0; cellX < mWidth; cellX++){
  		this.tiles[cellX] = [];
      this.tilesViews[cellX] = [];
  		for(var cellY = 0; cellY < mHeight; cellY++){
  			let tile = new Tile(cellX, cellY, 0);
        let tileView = new TileView(tile);

  			this.tilesContainer.addChild(tileView.container);
  			this.tiles[cellX][cellY] = tile;
        this.tilesViews[cellX][cellY] = tileView;
  		}
  	}
  }

  this.takeCell = function(coordX, coordY, owner){
    this.tiles[coordX][coordY].placedObject = owner;
  }
  this.freeCell = function(coordX, coordY){
    this.tiles[coordX][coordY].placedObject = null;
  }
  this.isCellFree = function(coordX,coordY){
    return (this.tiles[coordX][coordY].placedObject == null);
  }
  this.clean = function(){
    this.tilesViews = [];
    this.tiles = [];
    clearContainer(this.container);
    clearContainer(this.tilesContainer);
    clearContainer(this.objectsContainer);
    this.tilesContainer = new PIXI.Container();
    this.objectsContainer = new PIXI.Container();
  }
  function clearContainer(container){
    while(container.children.length > 0){
      container.removeChildAt(0);
    }
  }
}

var TILE_WIDTH = 32;
var TILE_HEIGHT = 32;

function Tile(coordX, coordY, view, placedObject){
	this.coordX = coordX;
	this.coordY = coordY;
	this._view = view;
	this.placedObject = placedObject;
	Object.defineProperty(this, "view", {
		get: function(){
			return this._view;
		},
		set: function(value){
			this._view = value;
		}
	});

}

function TileView(tile){
	this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/ground.png');
	var sprite = new PIXI.Sprite(texture);
	this.container.addChild(sprite);
	this.container.x = (tile.coordY * (TILE_WIDTH));
	this.container.y = (tile.coordX * (TILE_HEIGHT));

	this.onTileUpdated = function(){
		console.log("onTileUpdated");
	}

	this.tile = tile;

	this.dispose = function(){
		this.tile.unsubscribe(this.onTileUpdated);
	}
}

function Box(coordX, coordY){
  GameObjectModel.apply(this, arguments);
  this._isInGoalPoint = false;
  Object.defineProperty(this, "isInGoalPoint", {
		get: function(){
			return this._isInGoalPoint;
		},
		set: (value)=>{
			this._isInGoalPoint = value;
			this.observer.update();
		}
	});
}
Box.prototype = Object.create(GameObjectModel.prototype);
Box.prototype.constructor = Box;

function BoxView(box){
  this.box = box;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/box.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (box.coordY * (TILE_WIDTH));
	this.sprite.y = (box.coordX * (TILE_HEIGHT));

  this.makeBoxUpdateCallback = function(obj){
    return function(){
      console.log("onBoxUpdate");
      obj.sprite.x = (obj.box.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.box.coordX * (TILE_HEIGHT));
      if(obj.box.isInGoalPoint === true){
        var filter = new PIXI.filters.ColorMatrixFilter();
        filter.desaturate();
        obj.sprite.filters = [filter];
      }else{
        obj.sprite.filters = undefined;
      }
      redrawScene();
    }
  }
  this.onBoxUpdate = this.makeBoxUpdateCallback(this);

  this.box.observer.subscribe(this.onBoxUpdate);
}

function GoalPoint(coordX, coordY){
  GameObjectModel.apply(this, arguments);
}
GoalPoint.prototype = Object.create(GameObjectModel.prototype);
GoalPoint.prototype.constructor = GoalPoint;

function GoalPointView(goalPoint){
  this.goalPoint = goalPoint;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/goalPoint.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (goalPoint.coordY * (TILE_WIDTH));
	this.sprite.y = (goalPoint.coordX * (TILE_HEIGHT));

  this.makeGoalUpdateCallback = function(obj){
    return function(){
      console.log("onGoalPointUpdate");
      obj.sprite.x = (obj.goalPoint.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.goalPoint.coordX * (TILE_HEIGHT));
      redrawScene();
    }
  }
  this.onGoalPointUpdate = this.makeGoalUpdateCallback(this);

  this.goalPoint.observer.subscribe(this.onGoalPointUpdate);
}

function Personage(coordX, coordY){
  GameObjectModel.apply(this, arguments);
}
Personage.prototype = Object.create(GameObjectModel.prototype);
Personage.prototype.constructor = Personage;

function PersonageController(pers){
  this.pers = pers;
  this.moveRight = function(){
    console.log("R");
    if(tryMoveTo(this.pers.coordX, this.pers.coordY+1)){
      gameWorld.movePersonage(this.pers.coordX, this.pers.coordY+1);
      this.pers.observer.update();
    }
  }
  this.moveLeft = function(){
    console.log("L");
    if(tryMoveTo(this.pers.coordX, this.pers.coordY-1)){
      gameWorld.movePersonage(this.pers.coordX, this.pers.coordY-1);
      this.pers.observer.update();
    }
  }
  this.moveUp = function(){
    console.log("U");
    if(tryMoveTo(this.pers.coordX-1, this.pers.coordY)){
      gameWorld.movePersonage(this.pers.coordX-1, this.pers.coordY);
      this.pers.observer.update();
    }
  }
  this.moveDown = function(){
    console.log("D");
    if(tryMoveTo(this.pers.coordX+1, this.pers.coordY)){
      gameWorld.movePersonage(this.pers.coordX+1, this.pers.coordY);
      this.pers.observer.update();
    }
  }

  function tryMoveTo (coordX, coordY){
    var cellOwner = gameWorld.map.tiles[coordX][coordY].placedObject;
    if(cellOwner && cellOwner instanceof Box){
      let newCoordX = coordX + (coordX - gameWorld.pers.coordX);
      let newCoordY = coordY + (coordY - gameWorld.pers.coordY);
      tryPushBox(cellOwner, newCoordX, newCoordY);
    }
    return gameWorld.map.isCellFree(coordX, coordY);
  }
  function tryPushBox(box, coordX, coordY){
    if(gameWorld.map.isCellFree(coordX, coordY)){
      gameWorld.moveBox(box, coordX, coordY);
      box.observer.update();
    }
  }
}

function PersonageView(pers){
  this.pers = pers;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/character.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (pers.coordY * (TILE_WIDTH));
	this.sprite.y = (pers.coordX * (TILE_HEIGHT));

  this.makePersonageUpdateCallback = function(obj){
    return function(){
      console.log("onPersonageUpdate");
      obj.sprite.x = (obj.pers.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.pers.coordX * (TILE_HEIGHT));
      redrawScene();
    }
  }
  this.onPersonageUpdate = this.makePersonageUpdateCallback(this);

  this.pers.observer.subscribe(this.onPersonageUpdate);
}

function LevelLabel(){
  this.container = new PIXI.Container();
  this.label = new PIXI.Text('Basic text in pixi');
  this.container.addChild(this.label);

  this.setText = function(text){
    this.label.text = text;
  }
}

function UI(){
  this.container = new PIXI.Container();
  this.levelLabel = new LevelLabel();
  this.container.addChild(this.levelLabel.container);
  this.levelLabel.container.x = 50;
  this.levelLabel.container.y = 350;
  addInfo(this.container);

  this.updateLevelCount = function(levelIndex){
    this.levelLabel.setText("Current level: " + levelIndex);
  }

  function addInfo(container){
    let label = new PIXI.Text('Restart->R Undo->B');
    container.addChild(label);
    label.x = 20;
    label.y = 380;
  }
}

function Wall(coordX, coordY){
  GameObjectModel.apply(this, arguments);
}
Wall.prototype = Object.create(GameObjectModel.prototype);
Wall.prototype.constructor = Wall;

function WallView(wall){
  this.wall = wall;

  this.container = new PIXI.Container();
	var texture = PIXI.Texture.fromImage('img/wall.png');
	this.sprite = new PIXI.Sprite(texture);

	this.sprite.x = (wall.coordY * (TILE_WIDTH));
	this.sprite.y = (wall.coordX * (TILE_HEIGHT));

  this.makeBoxUpdateCallback = function(obj){
    return function(){
      console.log("onBoxUpdate");
      obj.sprite.x = (obj.wall.coordY * (TILE_WIDTH));
      obj.sprite.y = (obj.wall.coordX * (TILE_HEIGHT));
      redrawScene();
    }
  }
  this.onBoxUpdate = this.makeBoxUpdateCallback(this);
  this.wall.observer.subscribe(this.onBoxUpdate);
}
