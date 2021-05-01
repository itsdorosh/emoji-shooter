function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function hide(...elements) {
  elements.forEach(element => element.classList.add('hide'));
}

function show(...elements) {
  elements.forEach(element => element.classList.remove('hide'));
}

function convertCoordinatesToPixels(width, height, x = 0, y = 0) {
  return {
    x: ((width / 2) + ((width / 2) * x)),
    y: ((height / 2) + ((height / 2) * y)),
  };
}
