export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

export function convertCoordinatesToPixels(width, height, x = 0, y = 0) {
  return {
    x: ((width / 2) + ((width / 2) * x)),
    y: ((height / 2) + ((height / 2) * y)),
  };
}

export function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(_ => {});
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(_ => {});
    }
  }
}
