import { Container, Graphics, Text } from 'pixi.js';
import { animationManager } from '../AnimationManager.js';

export class LevelCompleteOverlay {
  constructor(width, height) {
    this.container = new Container();
    this.container.visible = false;

    var bg = new Graphics();
    bg.rect(0, 0, width, height);
    bg.fill({ color: 0x000000, alpha: 0.7 });
    this.container.addChild(bg);

    this.titleText = new Text({
      text: 'Level Complete!',
      style: {
        fontFamily: 'monospace',
        fontSize: 48,
        fontWeight: 'bold',
        fill: 0x4ade80,
        dropShadow: {
          color: 0x000000,
          blur: 4,
          distance: 2,
        },
      },
    });
    this.titleText.anchor.set(0.5);
    this.titleText.x = width / 2;
    this.titleText.y = height / 2 - 30;
    this.container.addChild(this.titleText);

    this.movesText = new Text({
      text: '',
      style: {
        fontFamily: 'monospace',
        fontSize: 24,
        fill: 0xcccccc,
      },
    });
    this.movesText.anchor.set(0.5);
    this.movesText.x = width / 2;
    this.movesText.y = height / 2 + 30;
    this.container.addChild(this.movesText);

    this.hintText = new Text({
      text: 'Press any key to continue',
      style: {
        fontFamily: 'monospace',
        fontSize: 16,
        fill: 0x888888,
      },
    });
    this.hintText.anchor.set(0.5);
    this.hintText.x = width / 2;
    this.hintText.y = height / 2 + 80;
    this.container.addChild(this.hintText);
  }

  async show(moveCount) {
    this.movesText.text = 'Moves: ' + moveCount;
    await animationManager.fadeIn(this.container, 400);
  }

  async hide() {
    await animationManager.fadeOut(this.container, 300);
  }
}
