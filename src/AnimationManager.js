export class AnimationManager {
  constructor() {
    this.tweens = [];
  }

  animateTo(sprite, targetX, targetY, duration = 100) {
    // Cancel any existing position tween on this sprite
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      if (this.tweens[i].sprite === sprite && !this.tweens[i].type) {
        this.tweens[i].sprite.x = this.tweens[i].targetX;
        this.tweens[i].sprite.y = this.tweens[i].targetY;
        this.tweens[i].resolve();
        this.tweens.splice(i, 1);
      }
    }
    return new Promise((resolve) => {
      this.tweens.push({
        sprite,
        startX: sprite.x,
        startY: sprite.y,
        targetX,
        targetY,
        duration,
        elapsed: 0,
        resolve,
      });
    });
  }

  scalePulse(sprite, scale = 1.15, duration = 200) {
    const originalScaleX = sprite.scale.x;
    const originalScaleY = sprite.scale.y;
    return new Promise((resolve) => {
      this.tweens.push({
        sprite,
        type: 'scalePulse',
        originalScaleX,
        originalScaleY,
        targetScale: scale,
        duration,
        elapsed: 0,
        resolve,
      });
    });
  }

  fadeIn(container, duration = 300) {
    container.alpha = 0;
    container.visible = true;
    return new Promise((resolve) => {
      this.tweens.push({
        sprite: container,
        type: 'fade',
        startAlpha: 0,
        targetAlpha: 1,
        duration,
        elapsed: 0,
        resolve,
      });
    });
  }

  fadeOut(container, duration = 300) {
    return new Promise((resolve) => {
      this.tweens.push({
        sprite: container,
        type: 'fade',
        startAlpha: container.alpha,
        targetAlpha: 0,
        duration,
        elapsed: 0,
        resolve,
      });
    });
  }

  update(deltaMs) {
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tween = this.tweens[i];
      tween.elapsed += deltaMs;
      const t = Math.min(tween.elapsed / tween.duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      if (tween.type === 'scalePulse') {
        if (t < 0.5) {
          const halfEase = 1 - Math.pow(1 - t * 2, 3);
          tween.sprite.scale.x =
            tween.originalScaleX +
            (tween.targetScale - tween.originalScaleX) * halfEase;
          tween.sprite.scale.y =
            tween.originalScaleY +
            (tween.targetScale - tween.originalScaleY) * halfEase;
        } else {
          const halfEase = 1 - Math.pow(1 - (t - 0.5) * 2, 3);
          tween.sprite.scale.x =
            tween.targetScale +
            (tween.originalScaleX - tween.targetScale) * halfEase;
          tween.sprite.scale.y =
            tween.targetScale +
            (tween.originalScaleY - tween.targetScale) * halfEase;
        }
      } else if (tween.type === 'fade') {
        tween.sprite.alpha =
          tween.startAlpha + (tween.targetAlpha - tween.startAlpha) * ease;
      } else {
        tween.sprite.x =
          tween.startX + (tween.targetX - tween.startX) * ease;
        tween.sprite.y =
          tween.startY + (tween.targetY - tween.startY) * ease;
      }

      if (t >= 1) {
        if (tween.type === 'scalePulse') {
          tween.sprite.scale.x = tween.originalScaleX;
          tween.sprite.scale.y = tween.originalScaleY;
        } else if (tween.type === 'fade') {
          tween.sprite.alpha = tween.targetAlpha;
          if (tween.targetAlpha === 0) tween.sprite.visible = false;
        } else {
          tween.sprite.x = tween.targetX;
          tween.sprite.y = tween.targetY;
        }
        tween.resolve();
        this.tweens.splice(i, 1);
      }
    }
  }

  get isAnimating() {
    return this.tweens.some((t) => !t.type || t.type === 'fade');
  }
}

export const animationManager = new AnimationManager();
