// js/game.js

var debug = false;

var maxNPC = 5;
var gameObjects = [];
var fps = 30;

var imageService = new ImageService();
var environment = new GameEnv();

var playerName = null;  //TODO: get from user
var shipName = null;  //TODO: get from user
var player = new Player(playerName);
var playerShip = null;

var maxSpawnDistX = 500; //environment.viewport.width * 4;
var maxSpawnDistY = 500; //environment.viewport.height * 4;

function setup() {
  environment.init();
  playerShip = new ShipTypes['cobra3'](shipName, player);
  playerShip.x = environment.viewport.cx - (playerShip.width / 2);
  playerShip.y = environment.viewport.cy - (playerShip.height / 2);
  gameObjects.push(playerShip);
  for (var i = 0; i < maxNPC; i++) {
		var spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
    var spawnShipRole = ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length - 1))]];
    var newShip = new spawnShipType('NPC' + i, spawnShipRole);
    newShip.x = rand(maxSpawnDistX, true);
    newShip.y = rand(maxSpawnDistY, true);
    gameObjects.push(newShip);
	}
	setInterval(main, 1000/fps);
};

function randInt(max) {
  return Math.floor(rand(max));
};

function rand(max, incNegatives) {
  return (Math.random() * max) * (incNegatives ? (Math.random() * 2 > 1 ? -1 : 1) : 1);
};

function refresh() {
  if (!environment.isReady()) {
    return;
  }
  environment.viewport.clear();  
  for (var i = 0; i < gameObjects.length; i++) {
    gameObjects[i].updateAndDraw(debug);
    if (gameObjects[i] === playerShip) {
      var uiCoord = document.querySelector(".ui.debug.coord");
      if (uiCoord) {
        uiCoord.innerHTML = "<p>x:" + (playerShip.x ? playerShip.x.toFixed(1) : " ") + " y:" + (playerShip.y ? playerShip.y.toFixed(1) : " ") + "</p>";
      }
      var uiVector = document.querySelector(".ui.debug.vector");
      if (uiVector) {
        uiVector.innerHTML = "<p>spd:" + (playerShip.speed ? playerShip.speed.toFixed(1) : " ") + " hdg:" + (playerShip.heading ? playerShip.heading.toFixed(1) : " ") + "</p>";
      }
      var uiInputs = document.querySelector(".ui.debug.inputs");
      if (uiInputs) {
        uiInputs.innerHTML = "<p>thrust:" + (playerShip.thrust ? playerShip.thrust.toFixed(1) : " ") + "</p>";
      }      
    }
  }
};

function main() {
  requestAnimationFrame(refresh);
};

(function() {
  setup();
})();