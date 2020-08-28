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
		this.camera.position.set(0, 1, DEADLINE + 2);
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
	 * @param obj - {object with params like: type: 'text', content: 'text', }
	 */
	drawObject(obj) {
		const enemy = this._makeEmojiSprite(obj.look, .3);

		enemy.position.set(this.getRandomIntInclusive(-RANGE_X, RANGE_X), 0.5, -DEADLINE);
		this._objContainer.add(enemy);

		return enemy.uuid;
	}

	_makeEmojiSprite(message, emojiSize = 2.5) {
		let url = window.location.search.substring(1);
		let emojiwidth = new URLSearchParams(url).get("emojiWidth")
			? new URLSearchParams(url).get("emojiWidth")
			: 80;
		let fontface = "Arial";
		let fontsize = emojiwidth * 0.75;

		let canvas = document.createElement("canvas");
		canvas.width = emojiwidth;
		canvas.height = emojiwidth;
		let context = canvas.getContext("2d");
		context.font = `Bold ${fontsize}px ${fontface}`;
		context.font = `Bold ${fontsize}px ${fontface}`;
		context.lineWidth = 1;
		context.fillText(message, -2, fontsize - 3);

		let texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;

		let spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
			transparent: false,
			alphaTest: 0.5
		});

		let sprite = new THREE.Sprite(spriteMaterial);
		sprite.scale.set(
			emojiSize * 0.5 * fontsize,
			emojiSize * 0.45 * fontsize,
			0.25 * fontsize
		);
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

	getRandomIntInclusive(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}
