class Viewer {

	_animationAction = undefined;

	constructor(HTMLContainer) {
		this.HTMLContainer = HTMLContainer;

		this.init();

		this.animate();
	}

	init() {
		const { offsetWidth, offsetHeight } = this.HTMLContainer;

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(70, offsetWidth / offsetHeight, 0.1, 1000);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });

		this.renderer.setSize(offsetWidth, offsetHeight);

		this.renderer.setClearColor('#FFC0CB');

		this.HTMLContainer.appendChild(this.renderer.domElement);

		document.addEventListener('resize', this.onWindowsResize);

	}

	setAnimationAction() {
	}

	removeAnimationAction() {
	}

	animate() {
		this.renderer.render(this.scene, this.camera);
	}

	stopAnimation() {
	}

	drawObject() {
	}

	removeObject() {
	}

	onWindowsResize = () => {
		this.camera.aspect = this.renderer.domElement.offsetWidth / this.renderer.domElement.offsetHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.renderer.domElement.offsetWidth, this.renderer.domElement.offsetHeight);
	}
}
