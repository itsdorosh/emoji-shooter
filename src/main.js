import {Engine, BACKGROUND_COLOR, DEADLINE} from './game';
import {Controls, CONTROLS_MODES, UiMagicTrick, Raycaster, toggleFullScreen, Viewer} from './core';

const canvasContainer = document.getElementById('canvasContainer');
const viewer = new Viewer(canvasContainer);

viewer.init({
  backgroundColor: BACKGROUND_COLOR,
  cameraPosition: {x: 0, y: 1, z: DEADLINE + 5},
  cameraLookAt: {x: 0, y: 2.5, z: 0}
});

const controls = new Controls(canvasContainer);
const raycaster = new Raycaster(viewer.camera);
const engine = new Engine(viewer, controls, raycaster);

controls.on('gamepadconnected', () => controls.switchControlsMode(CONTROLS_MODES.MOUSE_MODE));
controls.on('gamepaddisconnected', () => controls.switchControlsMode(CONTROLS_MODES.NO_MODE));
controls.on('controlsModeSwitched', (mode) => UiMagicTrick.switchState(mode));

engine.onPointCountUpdate((count) => document.getElementById('pointsCount').innerText = `Count: ${count}`);
engine.onGameOver(() => UiMagicTrick.switchState('gameOver'));

UiMagicTrick.registerElements([
  {id: 'headerContainer', visible: false},
  {id: 'menuContainer', visible: true},
  {id: 'gameOverCaption', visible: false},
  {id: 'greetingCaption', visible: true},
  {id: 'playButton', visible: true, onclick: () => { UiMagicTrick.switchState('play'); engine.play(); }},
  {id: 'pauseButton', visible: true, onclick: () => { UiMagicTrick.switchState('pause'); engine.pause(); }},
  {id: 'restartButton', onclick: () => { UiMagicTrick.switchState('restart'); engine.restart(); }},
  {id: 'fullscreen', visible: true, onclick: () => toggleFullScreen()},
  {id: 'gamepad', visible: false, onclick: () => controls.switchControlsMode(CONTROLS_MODES.GAMEPAD_MODE)},
  {id: 'mouse', visible: false, onclick: () => controls.switchControlsMode(CONTROLS_MODES.MOUSE_MODE)},
]);

UiMagicTrick.createState('play', {headerContainer: true, menuContainer: false});
UiMagicTrick.createState('pause', {gameOverCaption: false, restartButton: true, playButton: true, menuContainer: true});
UiMagicTrick.createState('restart', {gameOverCaption: false, greetingCaption: true, menuContainer: false});
UiMagicTrick.createState(CONTROLS_MODES.MOUSE_MODE, {mouseButton: false, gamepadButton: true});
UiMagicTrick.createState(CONTROLS_MODES.GAMEPAD_MODE, {mouseButton: true, gamepadButton: false});
UiMagicTrick.createState(CONTROLS_MODES.NO_MODE, {mouseButton: false, gamepadButton: false});

UiMagicTrick.createState('gameOver', {
  greetingCaption: false,
  playButton: false,
  menuContainer: true,
  gameOverCaption: true,
  restartButton: true,
  headerContainer: false
});
