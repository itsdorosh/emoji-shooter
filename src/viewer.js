class Viewer {

	_animationFrameId;
	_animationAction = null;

	constructor(HTMLContainer) {
		this.HTMLContainer = HTMLContainer;

		this.init();
	}

	init() {
		const { offsetWidth, offsetHeight } = this.HTMLContainer;
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(70, offsetWidth / offsetHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(offsetWidth, offsetHeight);
		this.renderer.setClearColor('#ffc0cb');
		this.HTMLContainer.appendChild(this.renderer.domElement);

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
			this.renderer.render(this.scene, this.camera);
			this.animate();
			this._animationAction && this._animationAction();
		});
	}

	stopAnimation() {
		cancelAnimationFrame(this.__animationFrameId);
	}

	onWindowResize = () => {
		this.animate();
		this._animationAction();
		this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight);
		this.stopAnimation();
	}

	drawObject() {
	}

	removeObject() {
	}
}
