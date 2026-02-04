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
