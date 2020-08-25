class Engine {

	_enemyStore = [];
	_pointCount = 0;
	_onPointCountUpdateCallback;
	_onGameOverCallback;

	/**
	 * @constructor throw dependencies here
	 * @param viewer
	 * @param controls
	 */
	constructor(viewer, controls) {
		this.viewer = viewer;
		this.controls = controls;

		this.init();
	}

	init() {
		// init subscriptions on user actions
		// here we should map game events to the DOM events and subscribe
	}

	/**
	 * @method generateEnemies - check amount of existing enemies and generates new, some of them may have special effect
	 */
	generateEnemies() {
	}


	updateExistingEnemiesPosition() {
	}

	play() {
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
		this.destroyEnemy(enemyId);
	}

	gameOver() {
		this.viewer.stopAnimation();
		this.viewer.removeAnimationAction();
		this._onGameOverCallback();
	}

	restart() {
	}

	destroyEnemy() {
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

}
