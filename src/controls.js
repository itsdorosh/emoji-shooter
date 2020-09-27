/**
 * @class Controls
 * @description this class provide API for interaction with several controls for example mouse or gamepad
 * you can simply subscribe on some of AVAILABLE_DOM_EVENTS
 */
class Controls {

	constructor(rootObject = document.body) {
		this.eventStorage = {};
		this.gamepads = [];
		this.rootObject = rootObject;
		this.currentControlsMode = CONTROLS_MODES.MOUSE_MODE;

		this.init();
	}

	/**
	 * @method init
	 */
	init() {
		window.addEventListener("gamepadconnected", ({ gamepad }) => {
			this.gamepads.push(gamepad);
			this.dispatch('gamepadconnected', gamepad);
		});

		window.addEventListener("gamepaddisconnected", ({ gamepad }) => {
			this.gamepads = this.gamepads.filter(savedGamepad => savedGamepad.id !== gamepad.id);
			this.dispatch('gamepaddisconnected', gamepad);
		});

		AVAILABLE_DOM_EVENTS.forEach((eventName) => {
			this.rootObject.addEventListener(eventName, (event) => {
				this.dispatch(eventName, event);
			});
		});
	}

	switchControlsMode(mode) {
		if (mode in CONTROLS_MODES) {
			this.currentControlsMode = mode;
			this.dispatch('controlsModeSwitched', mode);
		}
	}

	/**
	 * @method on
	 * @description this method should assign some callback to eventName and prevent secondary assignment
	 * @param eventName
	 * @param callback
	 */
	on(eventName, callback) {
		if (!(eventName in this.eventStorage)) {
			this.eventStorage[eventName] = callback;
		} else {
			throw 'callback for this eventName already exists';
		}
	}

	/**
	 * @method dispatch
	 * @description this method should provide way for trigger some callback by eventName
	 * @param eventName
	 * @param data
	 */
	dispatch(eventName, data) {
		if (eventName in this.eventStorage) {
			this.eventStorage[eventName](data);
		} else {
			throw(`there is no callback for ${eventName} event name`);
		}
	}

	/**
	 * @method unsubscribe
	 * @description this method allows you remove subscription assigned to the eventName
	 * @param eventName
	 */
	unsubscribe(eventName) {
		if (eventName in this.eventStorage) {
			delete this.eventStorage[eventName];
		}
	}
}
