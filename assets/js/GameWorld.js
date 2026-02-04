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
