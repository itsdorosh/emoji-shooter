class Viewer {

	_objContainer;
	_animationFrameId;
	_animationAction = null;

	constructor(HTMLContainer) {
		this.HTMLContainer = HTMLContainer;
		this._objContainer = new THREE.Object3D();

		this.init();
	}

	init() {
		const { offsetWidth, offsetHeight } = this.HTMLContainer;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(70, offsetWidth / offsetHeight, 0.1, 1000);
		this.camera.position.set(0, 1, DEADLINE + 5);
		this.camera.lookAt(0, 2.5, 0);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(offsetWidth, offsetHeight);
		this.renderer.setClearColor('#ffc0cb');
		this.HTMLContainer.appendChild(this.renderer.domElement);
		this.scene.add(this._objContainer);

		const grid = new THREE.GridHelper( 100, 20, 0x000000, 0x000000 );
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		this.scene.add( grid );

		this.animate();

		window.addEventListener('resize', this.onWindowResize);
	}

	setAnimationAction(callback) {
		this._animationAction = callback;
	}

	removeAnimationAction() {
		this._animationAction = null;
	}

	animate() {
		this.__animationFrameId = requestAnimationFrame(() => {
			if (this._animationAction) { this._animationAction(this._objContainer.children); }
			this.renderFrame();
			this.animate();
		});
	}

	onWindowResize = () => {
		this.camera.aspect = this.HTMLContainer.offsetWidth / this.HTMLContainer.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.HTMLContainer.offsetWidth, this.HTMLContainer.offsetHeight);
	}

	renderFrame() {
		this.renderer.render(this.scene, this.camera);
	}

	get objContainer() {
		return this._objContainer;
	}

	/**
	 * @method drawObject
	 * @param config - {object with params like: type: 'text', content: 'text', }
	 */
	drawObject(config) {
		const obj = this._makeEmojiSprite(config.look);

		obj.position.set(
			this.getRandomInt(-RANGE_X, RANGE_X),
			this.getRandomFloat(0, RANGE_Y),
			-DEADLINE
		);

		this._objContainer.add(obj);

		return obj.uuid;
	}

	_makeEmojiSprite(look, emojiTextureSize = 100) {
		const emojiCanvas = document.createElement('canvas');

		emojiCanvas.width = emojiTextureSize;
		emojiCanvas.height = emojiTextureSize;

		const fontFace = 'Arial';
		const fontSize = emojiTextureSize * 0.75;

		const context = emojiCanvas.getContext("2d");
		context.font = `Bold ${fontSize}px ${fontFace}`;
		context.lineWidth = 1;
		context.fillText(look, -2, fontSize - 3);

		const emojiTexture = new THREE.Texture(emojiCanvas);
		emojiTexture.needsUpdate = true;

		const spriteMaterial = new THREE.SpriteMaterial({
			map: emojiTexture,
			transparent: false,
			alphaTest: 0.5
		});

		let sprite = new THREE.Sprite(spriteMaterial);

		sprite.scale.set(3, 3, 3);

		return sprite;
	}

	removeObject(uuid) {
		const objForRemove = this._objContainer.getObjectByProperty('uuid', uuid);
		this._objContainer.remove(objForRemove);
	}

	removeAllObjects() {
		while(this._objContainer.children.length > 0){
			this._objContainer.remove(this._objContainer.children[0]);
		}
	}

	getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	getRandomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}
}
