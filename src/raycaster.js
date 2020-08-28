class Raycaster {
	_onIntersectionCallback;

	constructor(camera) {
		this.camera = camera;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
	}

	/**
	 * @method intersect
	 * @param intersectionParams - object with three fields: coordinates, container & types
	 */
	intersect(intersectionParams) {
		this.mouse.x = (intersectionParams.coordinates.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(intersectionParams.coordinates.clientY / window.innerHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.mouse, this.camera);
		const intersects = this.raycaster.intersectObjects(intersectionParams.container.children);

		if (intersects.length) {
			this._onIntersectionCallback(intersects[0].object.uuid);
		}
	}

	onIntersection(callback) {
		this._onIntersectionCallback = callback;
	}
}
