/**
 * @class Controls
 * @description this class provide API for interaction with several controls for example mouse or gamepad
 * you can simply subscribe on some of AVAILABLE_DOM_EVENTS
 */
class Controls {

	constructor(rootObject = document.body) {
		this.eventStorage = {};
		this.rootObject = rootObject;
		this.currentControlsMode = CONTROLS_MODES.MOUSE_MODE;

		this.aim = document.createElement('p');
		this.aim.innerText = '+';
		this.aim.classList.add('aim', 'position-absolute');
		hide(this.aim);
		this.rootObject.appendChild(this.aim);

		this.init();
	}

	/**
	 * @method init
	 */
	init() {
		window.addEventListener("gamepadconnected", ({ gamepad }) => {
			this.dispatch('gamepadconnected', gamepad);
		});

		window.addEventListener("gamepaddisconnected", ({ gamepad }) => {
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
			this.handleSwitchControlsMode(mode);
			this.dispatch('controlsModeSwitched', mode);
		}
	}

	handleSwitchControlsMode(mode) {
		if(mode === CONTROLS_MODES.GAMEPAD_MODE) {
			show(this.aim);
			this.aim.style.marginLeft = `-${39.59 / 2}px`;
			this.moveAimToCoordinates(0, 0);
		}

		else if(mode === CONTROLS_MODES.MOUSE_MODE || mode === CONTROLS_MODES.NO_MODE) {
			hide(this.aim);
		}
	}

	moveAimToCoordinates(x, y) {
		const pos = convertCoordinatesToPixels(
			this.rootObject.offsetWidth,
			this.rootObject.offsetHeight,
			x, y
		);

		this.aim.style.left = `${pos.x}px`;
		this.aim.style.top = `${pos.y}px`;
	}

	handleGamepadButtons() {
		if (this.currentControlsMode === CONTROLS_MODES.GAMEPAD_MODE) {

			const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
			if (!gamepads) {
				return;
			}

			const gp = gamepads[0];
			if (gp.buttons[0].pressed) {
				this.dispatch('shot1', convertCoordinatesToPixels(
					this.rootObject.offsetWidth,
					this.rootObject.offsetHeight,
					gp.axes[0],
					gp.axes[1]
				));
			}

			this.moveAimToCoordinates(gp.axes[0], gp.axes[1])
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
