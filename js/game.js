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
  // pre-load larger images
  imageService.loadImage('../image/Explosion01_5x5.png');
  imageService.loadImage('../image/star-tile-transparent.png');
  // create player's ship
  playerShip = new Ship(ShipTypes.COBRA3, shipName, player);
  playerShip.coord = new Point2d(
    environment.viewport.cx - (playerShip.model.width / 2),
    environment.viewport.cy - (playerShip.model.height / 2)
  )
  // playerShip.x = environment.viewport.cx - (playerShip.model.width / 2);
  // playerShip.y = environment.viewport.cy - (playerShip.model.height / 2);
  gameObjects.push(playerShip);
  // all systems go!
	setInterval(main, 1000/fps);
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
        uiCoord.innerHTML = "<p>x:" + (playerShip.coordinates.x ? playerShip.coordinates.x.toFixed(1) : " ") + " y:" + (playerShip.coordinates.y ? playerShip.coordinates.y.toFixed(1) : " ") + "</p>";
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
    var newShip = new Ship(spawnShipType, 'NPC' + i, spawnShipRole);
    newShip.x = playerShip.x + rand(maxSpawnDistX, incNegatives = true);
    newShip.y = playerShip.y + rand(maxSpawnDistY, incNegatives = true);
    gameObjects.push(newShip);
  }
};

function main() {
  requestAnimationFrame(refresh);
};

(function() {
  setup();
})();