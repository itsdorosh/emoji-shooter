class Engine {

	_pointCount = 0;
	_onPointCountUpdateCallback;
	_onGameOverCallback;
	gameEventCallbackMap;

	/**
	 * @constructor throw dependencies here
	 * @param viewer
	 * @param controls
	 * @param raycaster
	 */
	constructor(viewer, controls, raycaster) {
		this.viewer = viewer;
		this.controls = controls;
		this.raycaster = raycaster;

		this.gameEventCallbackMap = {
			'shot': () => this.onShot(),
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

		this.raycaster.onIntersection((UUID) => {
			this.onHit(UUID);
		});
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

	onShot(coordinates) {
		this.raycaster.intersect({
			coordinates: coordinates,
			container: this.viewer.objContainer,
			types: ['enemy'],
		});
	}

	onHit(enemyId) {
		this.destroyEnemy(enemyId);
	}

	gameOver() {
		this.viewer.stopAnimation();
		this.viewer.removeAnimationAction();
		this._onGameOverCallback();
	}

	restart() {
		// TODO: remove all existing objects
		// TODO: reset count
		this.play();
	}

	destroyEnemy(enemyId) {
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

}
