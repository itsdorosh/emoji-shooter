class Controls {

	constructor() {
		this.eventStorage = {};
		// here init listeners on some changes via controls

		// click

		// gamepad click

		// mousemove

		// gamepad joystick move
	}

	on(eventName, callback) {
		// add to event storage
	}

	dispatch() {
		// call callback from this.eventStorage
	}

	unsubscribe(eventName) {
		// remove to event storage
	}
}
