// js/game.js

var debug = false;

var maxNPC = 5;
var allShips = [];
var fps = 30;

var imageService = new ImageService();
var environment = new GameEnv();

var playerName = null;  //TODO: get from user
var shipName = null;  //TODO: get from user
var player = new Player(playerName);
var playerShip = null;

function setup() {
  environment.init();
  playerShip = new ShipTypes['cobra3'](shipName, player);
  playerShip.x = environment.viewport.cx - (playerShip.width / 2);
  playerShip.y = environment.viewport.cy - (playerShip.height / 2);
  allShips.push(playerShip);
	var maxSpawnDistX = 1000; //environment.viewport.width * 4;
  var maxSpawnDistY = 1000; //environment.viewport.height * 4;
  for (var i = 0; i < maxNPC; i++) {
		var spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
    var spawnShipRole = ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length - 1))]];
    var newShip = new spawnShipType('NPC' + i, spawnShipRole);
    newShip.x = rand(maxSpawnDistX, true);
    newShip.y = rand(maxSpawnDistY, true);
    allShips.push(newShip);
	}
	setInterval(main, 1000/fps);
}

function playerVisibleRegion() {
  return {
    x1: playerShip.cx - environment.viewport.width / 2,
    y1: playerShip.cy - environment.viewport.height / 2,
    x2: playerShip.cx + environment.viewport.width / 2,
    y2: playerShip.cy + environment.viewport.height / 2
  };
}

function randInt(max) {
  return Math.floor(rand(max));
}

function rand(max, incNegatives) {
  return (Math.random() * max) * (incNegatives ? (Math.random() * 2 > 1 ? -1 : 1) : 1);
}

function distanceBetween(objA, objB) {
  var dx = objA.cx - objB.cx;
  var dy = objA.cy - objB.cy;
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
  return length * Math.cos(degreesToRadians(angle));
}

function dir_y(length, angle) {
  return length * Math.sin(degreesToRadians(angle));
}

function refresh() {
  if (!environment.isReady()) {
    return;
  }
  environment.viewport.clear();  
  for (var i = 0; i < allShips.length; i++) {
    allShips[i].updateAndDraw(debug);
    if (allShips[i] === playerShip) {
      var uiCoord = document.querySelector(".ui.debug.coord");
      if (uiCoord) {
        uiCoord.innerHTML = "<p>x:" + (playerShip.x ? playerShip.x.toFixed(1) : " ") + " y:" + (playerShip.y ? playerShip.y.toFixed(1) : " ") + "</p>";
      }
      var uiVector = document.querySelector(".ui.debug.vector");
      if (uiVector) {
        uiVector.innerHTML = "<p>spd:" + (playerShip.speed ? playerShip.speed.toFixed(1) : " ") + " dir:" + (playerShip.direction ? playerShip.direction.toFixed(1) : " ") + "</p>";
      }
      var uiInputs = document.querySelector(".ui.debug.inputs");
      if (uiInputs) {
        uiInputs.innerHTML = "<p>thrust:" + (playerShip.thrust ? playerShip.thrust.toFixed(1) : " ") + "</p>";
      }      
    }
  }
}

function main() {
  requestAnimationFrame(refresh);
}

(function() {
  setup();
})();