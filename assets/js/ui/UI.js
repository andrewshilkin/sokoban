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
