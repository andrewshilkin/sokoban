import { Container, Graphics, Text } from 'pixi.js';
import { animationManager } from '../AnimationManager.js';

export class TitleScreen {
  constructor(width, height) {
    this.container = new Container();
    this.container.visible = false;

    var bg = new Graphics();
    bg.rect(0, 0, width, height);
    bg.fill({ color: 0x1a1a2e });
    this.container.addChild(bg);

    this.titleText = new Text({
      text: 'SOKOBAN',
      style: {
        fontFamily: 'monospace',
        fontSize: 72,
        fontWeight: 'bold',
        fill: 0xe2e8f0,
        letterSpacing: 8,
        dropShadow: {
          color: 0x4ade80,
          blur: 8,
          distance: 0,
        },
      },
    });
    this.titleText.anchor.set(0.5);
    this.titleText.x = width / 2;
    this.titleText.y = height / 2 - 40;
    this.container.addChild(this.titleText);

    this.promptText = new Text({
      text: 'Press any key to start',
      style: {
        fontFamily: 'monospace',
        fontSize: 20,
        fill: 0x888888,
      },
    });
    this.promptText.anchor.set(0.5);
    this.promptText.x = width / 2;
    this.promptText.y = height / 2 + 40;
    this.container.addChild(this.promptText);

    this._pulseTime = 0;
  }

  updatePulse(deltaMs) {
    if (!this.container.visible) return;
    this._pulseTime += deltaMs * 0.003;
    this.promptText.alpha = 0.4 + Math.sin(this._pulseTime) * 0.4;
  }

  async show() {
    await animationManager.fadeIn(this.container, 500);
  }

  async hide() {
    await animationManager.fadeOut(this.container, 500);
  }
}
