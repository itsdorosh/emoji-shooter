import {Engine, BACKGROUND_COLOR, DEADLINE} from "./game";
import {Controls, CONTROLS_MODES, hide, Raycaster, show, toggleFullScreen, Viewer} from "./core";

// containers
const canvasContainer = document.getElementById('canvasContainer');
const inGameButtons = document.getElementById('inGameButtons');
const gameButtons = document.getElementById('gameButtons');

// buttons
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const restartButton = document.getElementById('restartButton');
const fullscreenButton = document.getElementById('fullscreen');
const gamepadButton = document.getElementById('gamepad');
const mouseButton = document.getElementById('mouse');

// captions
const greetingCaption = document.getElementById('greetingCaption');
const gameOverCaption = document.getElementById('gameOverCaption');

const viewer = new Viewer(canvasContainer);

viewer.init({
  backgroundColor: BACKGROUND_COLOR,
  cameraPosition: {x: 0, y: 1, z: DEADLINE + 5},
  cameraLookAt: {x: 0, y: 2.5, z: 0}
});

const controls = new Controls(canvasContainer);
const raycaster = new Raycaster(viewer.camera);
const engine = new Engine(viewer, controls, raycaster);

engine.onPointCountUpdate((count) => {
  document.getElementById('pointsCount').innerText = `Count: ${count}`;
});

engine.onGameOver(() => {
  hide(greetingCaption, playButton);
  show(gameButtons, gameOverCaption, restartButton);
});

playButton.addEventListener('click', () => {
  hide(gameButtons);
  show(inGameButtons);
  engine.play();
});

pauseButton.addEventListener('click', () => {
  show(gameButtons, restartButton, playButton);
  engine.pause();
});

restartButton.addEventListener('click', () => {
  hide(gameOverCaption, gameButtons);
  show(greetingCaption);
  engine.restart();
});

gamepadButton.addEventListener('click', () => controls.switchControlsMode(CONTROLS_MODES.GAMEPAD_MODE));
mouseButton.addEventListener('click', () => controls.switchControlsMode(CONTROLS_MODES.MOUSE_MODE));
fullscreenButton.addEventListener('click', () => toggleFullScreen());

controls.on('gamepadconnected', () => {
  controls.switchControlsMode(CONTROLS_MODES.MOUSE_MODE);
});

controls.on('gamepaddisconnected', () => {
  controls.switchControlsMode(CONTROLS_MODES.NO_MODE);
});

controls.on('controlsModeSwitched', (mode) => {
  switch (mode) {
    case CONTROLS_MODES.MOUSE_MODE: {
      hide(mouseButton);
      show(gamepadButton);
      break;
    }

    case CONTROLS_MODES.GAMEPAD_MODE: {
      hide(gamepadButton);
      show(mouseButton);
      break;
    }

    case CONTROLS_MODES.NO_MODE: {
      hide(mouseButton, gamepadButton);
      break;
    }
  }
});
