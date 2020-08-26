class Raycaster {
	_onIntersectionCallback;

	constructor() {
	}

	/**
	 * @method intersect
	 * @param intersectionParams - object with three fields: coordinates, container & types
	 */
	intersect(intersectionParams) {
		// ray by coordinates and check intersections, if any -> call this.__onIntersectionCallback(intersectionUUID)
	}

	onIntersection(callback) {
		this.__onIntersectionCallback = callback;
	}
}
