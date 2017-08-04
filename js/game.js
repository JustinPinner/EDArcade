// js/game.js

var debug = false;
var minNPC = 10;
var npcCount = 0;
var gameObjects = [];
var fps = 30;
var imageRoot = '../image/';
var imageService = new ImageService();
var playerName = null;  //TODO: get from user
var shipName = null;  //TODO: get from user
var player;
var playerShip;
var cursors;
var ships;
var shipCollisionGroup;
var game = new Phaser.Game("100", "100", Phaser.CANVAS, '', { preload: preload, create: create, update: update });

function preload() {
  // pre-load images
  game.load.image('explosion', imageRoot + 'Explosion01_5x5.png');
  for (shipType = 0; shipType < Object.keys(ShipTypes).length; shipType++) {
    var st = ShipTypes[Object.keys(ShipTypes)[shipType]];
    game.load.image(st.name, imageRoot + st.name + '.png');
  }
}

function create() {  
  game.physics.startSystem(Phaser.Physics.P2JS);
  //  Turn on impact events for the world, without this we get no collision callbacks
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.restitution = 0.8;
  shipCollisionGroup = game.physics.p2.createCollisionGroup();

  ships = game.add.group();
  ships.enableBody = true;
  ships.physicsBodyType = Phaser.Physics.P2JS;

  player = new Player(playerName);
  playerShip = new Ship(ShipTypes.COBRA3, shipName, player);
  playerShip.phaserObject = ships.create(game.world.randomX, game.world.randomY, playerShip.shipType.name);
  playerShip.phaserObject.body.setCollisionGroup(shipCollisionGroup);
  playerShip.phaserObject.body.collides([shipCollisionGroup]);
  playerShip.phaserObject.anchor.x = 0.5;
  playerShip.phaserObject.anchor.y = 0.5;
  gameObjects.push(playerShip);

  game.camera.follow(playerShip.phaserObject, Phaser.Camera.FOLLOW_LOCKON, 0.1);

  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  maintainNpcs();
}

function update() {
  var deadAndAlive = gameObjects.partition(function(obj) {
    return !obj.phaserObject.alive;
  });
  gameObjects = deadAndAlive[1];

	if (cursors.up.isDown) {
		playerShip.increaseThrust();
	}
	if (cursors.down.isDown) {
		playerShip.decreaseThrust();
	}
	if (cursors.left.isDown) {
		playerShip.yaw('ccw');
	}
	if (cursors.right.isDown) {
		playerShip.yaw('cw');
	}
  
  maintainNpcs();

  updateHud();
}

function maintainNpcs() {
  npcCount = 0;
  // spawn new / maintain min. NPC ships
  for (var i = 0; i < gameObjects.length; i++) {
    if (gameObjects[i].oType === GameObjectTypes.SHIP && gameObjects[i].role !== ShipRoles.PLAYER) {
      npcCount++;
    }
  }
  for (var i = npcCount; i < minNPC; i++) {
    var spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
    var spawnShipRole = ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length - 1))]];
    var npcShip = new Ship(spawnShipType, 'NPC' + i, spawnShipRole);
    npcShip.phaserObject = ships.create(game.world.randomX, game.world.randomY, npcShip.shipType.name);
    npcShip.phaserObject.body.setCollisionGroup(shipCollisionGroup);
    npcShip.phaserObject.body.collides([shipCollisionGroup]);
    npcShip.phaserObject.anchor.x = 0.5;
    npcShip.phaserObject.anchor.y = 0.5;
    gameObjects.push(npcShip);
  }  
}

function updateHud() {
  var uiNpcs = document.querySelector(".ui.debug.npcs");
  if (uiNpcs) {
    uiNpcs.innerHTML = "<p>NPCs:" + npcCount + "</p>";
  }
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

function randInt(max) {
  return Math.floor(rand(max));
}

function rand(max, incNegatives) {
  return (Math.random() * max) * (incNegatives ? (Math.random() * 2 > 1 ? -1 : 1) : 1);
}
