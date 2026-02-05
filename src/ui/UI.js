import { Container, Graphics, Text } from 'pixi.js';

export function UI(canvasWidth) {
  this.container = new Container();

  var panelHeight = 50;
  var panel = new Graphics();
  panel.rect(0, 0, canvasWidth, panelHeight);
  panel.fill({ color: 0x0f0f23, alpha: 0.85 });
  this.container.addChild(panel);

  this.levelText = new Text({
    text: 'Level 1',
    style: {
      fontFamily: 'monospace',
      fontSize: 18,
      fontWeight: 'bold',
      fill: 0xe2e8f0,
    },
  });
  this.levelText.x = 16;
  this.levelText.y = 14;
  this.container.addChild(this.levelText);

  this.moveText = new Text({
    text: 'Moves: 0',
    style: {
      fontFamily: 'monospace',
      fontSize: 18,
      fill: 0xa0a0b0,
    },
  });
  this.moveText.x = 200;
  this.moveText.y = 14;
  this.container.addChild(this.moveText);

  var hintText = new Text({
    text: '\u2190\u2191\u2192\u2193 Move  |  Z Undo  |  R Restart',
    style: {
      fontFamily: 'monospace',
      fontSize: 14,
      fill: 0x666680,
    },
  });
  hintText.x = canvasWidth - hintText.width - 16;
  hintText.y = 17;
  this.container.addChild(hintText);

  this.container.y = 550;

  this.updateLevelCount = function (levelIndex, totalLevels) {
    this.levelText.text = 'Level ' + levelIndex + '/' + totalLevels;
  };

  this.updateMoveCount = function (count) {
    this.moveText.text = 'Moves: ' + count;
  };
}
