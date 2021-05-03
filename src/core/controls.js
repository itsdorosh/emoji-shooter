import {AVAILABLE_DOM_EVENTS, CONTROLS_MODES} from "./constants.js";
import {convertCoordinatesToPixels} from "./helpers.js";
import {UiMagicTrick} from "./ui-magic-trick.js";

export class Controls {

  constructor(rootObject = document.body) {
    this.eventStorage = {};
    this.rootObject = rootObject;
    this.currentControlsMode = CONTROLS_MODES.MOUSE_MODE;

    this.aim = document.createElement('p');
    this.aim.innerText = '+';
    this.aim.classList.add('aim', 'position-absolute');
    UiMagicTrick.hide(this.aim);
    this.rootObject.appendChild(this.aim);

    this.init();
  }

  init() {
    window.addEventListener("gamepadconnected", ({gamepad}) => {
      this.dispatch('gamepadconnected', gamepad);
    });

    window.addEventListener("gamepaddisconnected", ({gamepad}) => {
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
    if (mode === CONTROLS_MODES.GAMEPAD_MODE) {
      UiMagicTrick.show(this.aim);
      this.aim.style.marginLeft = `-${39.59 / 2}px`;
      this.moveAimToCoordinates(0, 0);
    } else if (mode === CONTROLS_MODES.MOUSE_MODE || mode === CONTROLS_MODES.NO_MODE) {
      UiMagicTrick.hide(this.aim);
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
          gp.axes[0].toFixed(1),
          gp.axes[1].toFixed(1)
        ));
      }

      this.moveAimToCoordinates(gp.axes[0].toFixed(1), gp.axes[1].toFixed(1));
    }
  }

  on(eventName, callback) {
    if (!(eventName in this.eventStorage)) {
      this.eventStorage[eventName] = callback;
      return () => this.unsubscribe(eventName);
    } else {
      throw 'callback for this eventName already exists';
    }
  }

  dispatch(eventName, data) {
    if (eventName in this.eventStorage) {
      this.eventStorage[eventName](data);
    } else {
      throw(`there is no callback for ${eventName} event name`);
    }
  }

  unsubscribe(eventName) {
    if (eventName in this.eventStorage) {
      delete this.eventStorage[eventName];
    }
  }
}
