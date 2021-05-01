class Engine {

  _pointCount = 0;
  existingEnemies = [];
  _onPointCountUpdateCallback;
  _generateEnemiesIntervalId;
  _onGameOverCallback;
  gameEventCallbackMap;
  _updateEnemiesDefaultAnimationAction = (enemyMeshes) => this.updateExistingEnemiesPosition(enemyMeshes);
  _handleGamepadButtonsDefaultAnimationAction = () => this.controls.handleGamepadButtons();

  constructor(viewer, controls, raycaster) {
    this.viewer = viewer;
    this.controls = controls;
    this.raycaster = raycaster;
    this.viewer.addAnimationActions(this._handleGamepadButtonsDefaultAnimationAction);

    this.gameEventCallbackMap = {
      'shot': ({clientX, clientY}) => this.onShot({x: clientX, y: clientY}),
    };

    this.init();
  }

  init() {
    for (let gameEvent in GAME_EVENT_MAP) {
      GAME_EVENT_MAP[gameEvent].forEach((mappedDOMEvent) => {
        this.controls.on(mappedDOMEvent, (event) => {
          this.gameEventCallbackMap[gameEvent](event);
        });
      });
    }

    this.controls.on('shot1', (pos) => {
      this.onShot(pos);
    });

    this.raycaster.onIntersection((UUID) => {
      this.onHit(UUID);
    });
  }

  generateEnemies() {
    if (this.existingEnemies.length < MAX_COUNT_OF_ENEMIES_AT_MOMENT) {
      const enemyConfig = enemies[Math.floor((enemies.length) * Math.random())];
      const enemyCanvas = this._makeEmojiCanvas(enemyConfig.look);
      const enemyId = this.viewer.drawObject({
        type: "SPRITE",
        data: enemyCanvas,
        position: {x: getRandomInt(-RANGE_X, RANGE_X), y: getRandomFloat(0, RANGE_Y), z: -DEADLINE},
        scale: {x: ENEMY_SIZE, y: ENEMY_SIZE, z: ENEMY_SIZE},
      });

      this.existingEnemies.push({
        id: enemyId,
        value: enemyConfig.value,
      });
    }
  }

  updateExistingEnemiesPosition(enemyMeshes) {
    enemyMeshes.forEach((enemyMesh) => {
      enemyMesh.position.z += 0.1;
      if (enemyMesh.position.z > DEADLINE) {
        this.gameOver();
      }
    });
  }

  play() {
    this.viewer.addAnimationActions(
      this._updateEnemiesDefaultAnimationAction,
      this._handleGamepadButtonsDefaultAnimationAction
    );

    this.viewer.startAnimation();

    this._generateEnemiesIntervalId = setInterval(
      () => this.generateEnemies(),
      GENERATE_ENEMIES_INTERVAL_TIME
    );
  }

  pause() {
    clearInterval(this._generateEnemiesIntervalId);
    this.viewer.clearAnimationActions();
    this.viewer.stopAnimation();
  }

  onShot(coordinates) {
    this.raycaster.intersect({
      coordinates,
      container: this.viewer.objContainer,
      types: ['enemy'],
    });
  }

  onHit(enemyId) {
    this.destroyEnemy(enemyId);
  }

  gameOver() {
    clearInterval(this._generateEnemiesIntervalId);
    this.viewer.clearAnimationActions();
    this.viewer.stopAnimation();
    this._onGameOverCallback();
  }

  restart() {
    this.viewer.removeAllObjects();
    this.existingEnemies.length = 0;
    this.updatePointCount(0);
    this.play();
  }

  destroyEnemy(enemyId) {
    const reward = this.existingEnemies.find(({id}) => id === enemyId).value;
    this.updatePointCount(this._pointCount += reward);
    this.existingEnemies = this.existingEnemies.filter(({id}) => id !== enemyId);
    this.viewer.removeObject(enemyId);
  }

  updatePointCount(count) {
    this._pointCount = count;
    this._onPointCountUpdateCallback(count);
  }

  onPointCountUpdate(callback) {
    this._onPointCountUpdateCallback = callback;
  }

  onGameOver(callback) {
    this._onGameOverCallback = callback;
  }

  _makeEmojiCanvas(look, emojiTextureSize = 100) {
    const emojiCanvas = document.createElement('canvas');

    emojiCanvas.width = emojiTextureSize;
    emojiCanvas.height = emojiTextureSize;

    const fontFace = 'Arial';
    const fontSize = emojiTextureSize * 0.75;

    const context = emojiCanvas.getContext("2d");
    context.font = `Bold ${fontSize}px ${fontFace}`;
    context.lineWidth = 1;
    context.fillText(look, -2, fontSize - 3);

    return emojiCanvas;
  }
}
