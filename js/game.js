// js/game.js

var debug = false;

var minNPC = 10;
var gameObjects = [];
var fps = 30;

var imageService = new ImageService();
var environment = new GameEnv();

var playerName = null;  //TODO: get from user
var shipName = null;  //TODO: get from user
var player = new Player(playerName);
var playerShip = null;

var maxSpawnDistX = environment.viewport.width * 5;
var maxSpawnDistY = environment.viewport.height * 5;

function setup() {
  environment.init();
  playerShip = new ShipTypes['cobra3'](shipName, player);
  playerShip.x = environment.viewport.cx - (playerShip.width / 2);
  playerShip.y = environment.viewport.cy - (playerShip.height / 2);
  gameObjects.push(playerShip);
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
  var deadAndAlive = gameObjects.partition(function(obj) {
    return obj.disposable;
  });
  gameObjects = deadAndAlive[1];
  var npcCount = 0;
  for (var i = 0; i < gameObjects.length; i++) {
    if (gameObjects[i].oType === GameObjectTypes.SHIP && gameObjects[i].role !== ShipRoles['player']) {
      npcCount++;
    }
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
      var uiStatus = document.querySelector(".ui.debug.status");
      if (uiStatus) {
        uiStatus.innerHTML = "<p>status:" + playerShip.status + "</p>";
      }
      var uiCondition = document.querySelector(".ui.debug.condition");
      if (uiCondition) {
        uiCondition.innerHTML = "<p>shields:" + playerShip.shield.charge + "% armour:" + playerShip.armour + " hull:" + playerShip.hullIntegrity + "%</p>";
      }
      var uiInputs = document.querySelector(".ui.debug.inputs");
      if (uiInputs) {
        uiInputs.innerHTML = "<p>thrust:" + (playerShip.thrust ? playerShip.thrust.toFixed(1) : " ") + "</p>";
      }      
    }
  }
  var uiNpcs = document.querySelector(".ui.debug.npcs");
  if (uiNpcs) {
    uiNpcs.innerHTML = "<p>NPCs:" + npcCount + "</p>";
  }
  // spawn new / maintain min. NPC ships
  for (var i = npcCount; i < minNPC; i++) {
    var spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
    var spawnShipRole = ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length - 1))]];
    var newShip = new spawnShipType('NPC' + i, spawnShipRole);
    newShip.x = rand(maxSpawnDistX, true);
    newShip.y = rand(maxSpawnDistY, true);
    gameObjects.push(newShip);
  }
};

function main() {
  requestAnimationFrame(refresh);
};

(function() {
  setup();
})();