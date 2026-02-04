function LevelLabel(){
  this.container = new PIXI.Container();
  this.label = new PIXI.Text('Basic text in pixi');
  this.container.addChild(this.label);

  this.setText = function(text){
    this.label.text = text;
  }
}
