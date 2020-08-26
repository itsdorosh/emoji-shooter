class Engine {

	_pointCount = 0;
	existingEnemies = [];
	_onPointCountUpdateCallback;
	_generateEnemiesIntervalId;
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
	 * @method generateEnemies - check amount of existing enemies and generates new
	 */
	generateEnemies() {
		if (this.existingEnemies.length < MAX_COUNT_OF_ENEMIES_AT_MOMENT) {
			const enemyConfig = enemies[Math.floor((enemies.length) * Math.random())];
			const enemyId = this.viewer.drawObject({});

			this.existingEnemies.push({
				id: enemyId,
				value: enemyConfig.value,
			});
		}
	}

	updateExistingEnemiesPosition() {
		// TODO: if enemy cross the deadline => call this.gameOver();
	}

	play() {
		this.viewer.setAnimationAction(() => this.updateExistingEnemiesPosition());
		this.viewer.animate();
		this._generateEnemiesIntervalId = setInterval(
			() => this.generateEnemies(),
			GENERATE_ENEMIES_INTERVAL_TIME
		);
	}

	pause() {
		clearInterval(this._generateEnemiesIntervalId);
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
		clearInterval(this._generateEnemiesIntervalId);
		this.viewer.stopAnimation();
		this.viewer.removeAnimationAction();
		this._onGameOverCallback();
	}

	restart() {
		this.existingEnemies.length = 0;
		this._pointCount = 0;
		this.play();
	}

	destroyEnemy(enemyId) {
		this.existingEnemies.filter(({ id, value }) => {
			this.updatePointCount(this._pointCount += value);
			return id !== enemyId;
		});
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
