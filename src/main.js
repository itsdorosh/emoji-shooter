// noinspection ES6PreferShortImport
import {Engine, DEFAULT_VIEWER_SETTINGS} from './game/index.js';
// noinspection ES6PreferShortImport
import {Controls, CONTROLS_MODES, UiMagicTrick, Raycaster, toggleFullScreen, Viewer} from './core/index.js';

const canvasContainer = document.getElementById('canvasContainer');
const viewer = new Viewer(canvasContainer);
viewer.init(DEFAULT_VIEWER_SETTINGS);

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
  {id: 'restartButton', visible: false, onclick: () => { UiMagicTrick.switchState('play'); engine.restart(); }},
  {id: 'fullscreen', visible: true, onclick: () => toggleFullScreen()},
  {id: 'gamepad', visible: false, onclick: () => controls.switchControlsMode(CONTROLS_MODES.GAMEPAD_MODE)},
  {id: 'mouse', visible: false, onclick: () => controls.switchControlsMode(CONTROLS_MODES.MOUSE_MODE)},
]);

UiMagicTrick.createState('pause', {menuContainer: true});
UiMagicTrick.createState(CONTROLS_MODES.MOUSE_MODE, {mouseButton: false, gamepadButton: true});
UiMagicTrick.createState(CONTROLS_MODES.GAMEPAD_MODE, {mouseButton: true, gamepadButton: false});
UiMagicTrick.createState(CONTROLS_MODES.NO_MODE, {mouseButton: false, gamepadButton: false});

UiMagicTrick.createState('play', {
  gameOverCaption: false,
  greetingCaption: true,
  playButton: true,
  restartButton: true,
  headerContainer: true,
  menuContainer: false
});

UiMagicTrick.createState('gameOver', {
  gameOverCaption: true,
  greetingCaption: false,
  playButton: false,
  restartButton: true,
  menuContainer: true,
  headerContainer: false
});
