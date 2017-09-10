// js/game.js

var debug = false;
var minNPC = 0;
var npcCount = 0;
var gameObjects = [];
var fps = 30;
var imageRoot = '../image/';
var imageService = new ImageService();
var playerName = null;  //TODO: get from user
var shipName = null;  //TODO: get from user
var player, playerShip, ships, shipCollisionGroup;
var cursors, pauseButton, fireButton;
var game = new Phaser.Game("100", "100", Phaser.CANVAS, '', { preload: preload, create: create, update: update });

// PRELOAD FUNCTIONS
function preload() {
  // pre-load images
  game.load.image('explosion', imageRoot + 'Explosion01_5x5.png');
  for (shipType = 0; shipType < Object.keys(ShipTypes).length; shipType++) {
    var st = ShipTypes[Object.keys(ShipTypes)[shipType]];
    game.load.image(st.name, imageRoot + st.name + '.png');
  }
}

// CREATE FUNCTIONS
function create() {  
  createPhysics();
  createKeys();
  createPlayer();
  createNpcs();
}

function createPhysics() {
  game.physics.startSystem(Phaser.Physics.P2JS);
  //  Turn on impact events for the world, without this we get no collision callbacks
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.restitution = 0.8;
  shipCollisionGroup = game.physics.p2.createCollisionGroup();

  ships = game.add.group();
  ships.enableBody = true;
  ships.physicsBodyType = Phaser.Physics.P2JS;
}

function createKeys() {
  cursors = game.input.keyboard.createCursorKeys();
  fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  pauseButton = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
}

function createPlayer() {
  player = new Player(playerName);
  playerShip = new Ship(ShipTypes.COBRA3, shipName, player);
  phaserShipObject = game.add.sprite(game.world.centerX, game.world.centerY, playerShip.shipType.name);
  phaserShipObject.anchor.set(0.5);
  phaserShipObject.fixedToCamera = true;
  phaserShipObject.setCollisionGroup([shipCollisionGroup]);
  phaserShipObject.collides([shipCollisionGroup]);
  game.physics.p2.enable([phaserShipObject]);
  game.camera.follow(phaserShipObject);
  // playerShip.phaserObject = ships.create(game.world.centerX, game.world.centerY, playerShip.shipType.name);
  // playerShip.phaserObject.body.setCollisionGroup(shipCollisionGroup);
  // playerShip.phaserObject.body.collides([shipCollisionGroup]);
  // playerShip.phaserObject.anchor.x = 0.5;
  // playerShip.phaserObject.anchor.y = 0.5;
  playerShip.phaserObject = phaserShipObject;
  gameObjects.push(playerShip);
  // game.camera.follow(playerShip.phaserObject);
}

function createNpcs() {
  // spawn new NPCs if needed
  for (var i = npcCount; i < minNPC; i++) {
    createNpc(i);
  }  
}

function createNpc(ident) {
  var spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
  var spawnShipRole = ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length - 1))]];
  var npcShip = new Ship(spawnShipType, 'NPC' + ident, spawnShipRole);
  npcShip.phaserObject = ships.create(game.world.randomX, game.world.randomY, npcShip.shipType.name);
  npcShip.phaserObject.body.setCollisionGroup(shipCollisionGroup);
  npcShip.phaserObject.body.collides([shipCollisionGroup]);
  npcShip.phaserObject.anchor.x = 0.5;
  npcShip.phaserObject.anchor.y = 0.5;
  gameObjects.push(npcShip);
}

// UPDATE FUNCTIONS
function update() {
  updateKeys();
  var deadAndAlive = gameObjects.partition(function(obj) {
    return obj.phaserObject && !obj.phaserObject.alive;
  });
  gameObjects = deadAndAlive[1];
  updateNpcs();
  createNpcs();
}

function updateKeys() {
  // pause
  if (pauseButton.isDown) {
    game.physics.p2.paused = (game.physics.p2.paused ? false : true);
    return;
  }
  // rotate
  if (cursors.left.isDown) {
    playerShip.yaw(YAWLEFT);
  } else if (cursors.right.isDown) {
    playerShip.yaw(YAWRIGHT);
  } else {
    playerShip.yaw(YAWSTOP);
  }
  // thrust
	if (cursors.up.isDown) {
		playerShip.thrustOn();
	} else {
    playerShip.thrustOff();
  }
  // fire
  if (fireButton.isDown) {
    playerShip.fireWeapons();
  }
}

function updateNpcs() {
  npcCount = 0;
  // update remaining NPC ships
  for (var i = 0; i < gameObjects.length; i++) {
    if (gameObjects[i].oType === GameObjectTypes.SHIP && gameObjects[i].role !== ShipRoles.PLAYER) {
      npcCount++;
      gameObjects[i].npcUpdate();
    }
  }  
}

// RENDER FUNCTIONS
function render() {
  renderHud();
}

function renderHud() {
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
