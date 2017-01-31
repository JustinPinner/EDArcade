// js/game.js

var maxNPC = 10;
var allShips = [];

var playerName = null;  //TODO: get from user
var shipName = null;  //TODO: get from user
var player = new Player(playerName);
var fps = 30;

var imageService = new ImageService();
var environment = new GameEnv();

function setup() {
  environment.init();
  allShips.push(new Ship('Cobra3', shipName, player, environment.viewport.getCentre().x, environment.viewport.getCentre().y));
	var maxSpawnDistX = environment.viewport.width * 4;
  var maxSpawnDistY = environment.viewport.height * 4;
  for (var i = 0; i < maxNPC; i++) {
		var spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
    allShips.push(new Ship(spawnShipType.id, 'NPC' + i, null, rand(maxSpawnDistX), rand(maxSpawnDistY)));
	}
	setInterval(main, 1000/fps);
}

function randInt(max) {
  return Math.floor(rand(max));
}

function rand(max) {
  return Math.random() * max;
}

function distanceBetween(objA, objB) {
  var dx = objA.centre.x - objB.centre.x;
  var dy = objA.centre.y - objB.centre.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y1 - y2, x1 - x2) * (180.0 / Math.PI);
}

function angleDifference(a1, a2) {
  return ((((a1 - a2) % 360) + 540) % 360) - 180;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function dir_x(length, angle) {
  return Math.ceil(length * Math.cos(degreesToRadians(angle)));
}

function dir_y(length, angle) {
  return Math.ceil(length * Math.sin(degreesToRadians(angle)));
}

function refresh() {
  if (!environment.isReady()) {
    return;
  }
  environment.viewport.clear();  
  for (var i = 0; i < allShips.length; i++) {
    allShips[i].updateAndDraw();
  }
}

function main() {
  requestAnimationFrame(refresh);
}

(function() {
  setup();
})();