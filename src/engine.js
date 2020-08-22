class Engine {

  /**
    @constructor
    throw here dependencies
  */
  constructor(viewer, controls) {
    this.viewer = viewer;
    this.controls = controls;
  }

  init() {
    // init subscriptions on user actions
  }
  
  /**
   * @method generateEnemies - check amount of existig enemies and genetares new, some of them may have special effect
  */
  generateEnemies() {}
  
  
  updateExistingEnemiesPosition() {}
  
  produceSpecialEnemyEffect() {}

  // say to viewer that we shoud start make some actions
  start() {
    this.viewer.setAnimationAction(() => {
      this.updateExistingEnemiesPosition();
      this.generateEnemies();
    });
    this.viewer.animate();
  }

  pause() {
    this.viewer.stopAnimation();
  }

  stop() {}
  
  onShot(enemyId) {
    if (!this.someStore[enemyId].specialEffecrProduced) {
      this.produceSpecialEnemyEffect(enemyId);
    } else {
      destroyEnemy(enemyId);
    }
  }

  onDead() {}

  gameOver() {}
  
  restart() {}
}