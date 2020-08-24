class Engine {

  enemyStore = [];

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
   * @method generateEnemies - check amount of existing enemies and generates new, some of them may have special effect
  */
  generateEnemies() {}
  
  
  updateExistingEnemiesPosition() {}
  
  produceSpecialEnemyEffect() {}

  // say to viewer that we should start make some actions
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
  
  onShot(enemyId) {
    if (!this.enemyStore[enemyId].specialEffecrProduced) {
      this.produceSpecialEnemyEffect(enemyId);
    } else {
      this.destroyEnemy(enemyId);
    }
  }

  gameOver() {
    this.viewer.stopAnimation();
    this.viewer.removeAnimationAction();
  }
  
  restart() {}

  destroyEnemy() {}
}
