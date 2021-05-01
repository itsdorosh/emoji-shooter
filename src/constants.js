const GAME_EVENT_MAP = {
  'shot': ['click', 'gamepad-click'],
  'aim': ['mousemove', 'gamepad-move'],
};

const CONTROLS_MODES = {
  NO_MODE: 'NO_MODE',
  MOUSE_MODE: 'MOUSE_MODE',
  GAMEPAD_MODE: 'GAMEPAD_MODE',
}

const AVAILABLE_DOM_EVENTS = ['click'];

// GAME SPECIFIC CONSTANTS
const MAX_COUNT_OF_ENEMIES_AT_MOMENT = 10;

const GENERATE_ENEMIES_INTERVAL_TIME = 350;

const DEADLINE = 10;

const RANGE_X = 10;

const RANGE_Y = 2;
