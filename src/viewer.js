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
		this.camera.position.set(10, 2.5, 0);
		this.camera.lookAt(0, 0, 0);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(offsetWidth, offsetHeight);
		this.renderer.setClearColor('#ffc0cb');
		this.HTMLContainer.appendChild(this.renderer.domElement);
		this.scene.add(this._objContainer);

		const grid = new THREE.GridHelper( 100, 20, 0x000000, 0x000000 );
		grid.material.opacity = 0.2;
		grid.material.transparent = true;
		this.scene.add( grid );

		this.renderFrame();

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
			if (this._animationAction) { this._animationAction(); }
			this.renderFrame();
			this.animate();
		});
	}

	stopAnimation() {
		cancelAnimationFrame(this.__animationFrameId);
	}

	onWindowResize = () => {
		this.animate();
		this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight);
		this.stopAnimation();
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
		// TODO: make some method for generating random position
		const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		this.scene.add(cube);

		return cube.uuid;
	}

	removeObject(uuid) {
	}
}
