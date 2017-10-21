// js/game.js

var debug = true;

var minNPC = 5;
var fps = 30;

var imageService = new ImageService();

class Game {
  constructor(playerName, shipName) {   
    this._gameObjects = [];
    this._background = new Background();
    // size and style background wrapper div
    var bgWrapper = document.querySelector('#bgdiv');
    if (bgWrapper) {
        bgWrapper.style.left = this._background.coordinates.x.toString() + 'px';
        bgWrapper.style.top = this._background.coordinates.y.toString() + 'px';
        bgWrapper.style.width = this._background.width.toString() + 'px';
        bgWrapper.style.height = this._background.height.toString() + 'px';
        bgWrapper.style.backgroundColor = '#000000';
    }
    // size background container element to match canvas dimensions
    var bgCanvasElement = document.querySelector(this._background.selector);
    if (bgCanvasElement) {
        bgCanvasElement.style.left = this._background.coordinates.x.toString() + 'px';
        bgCanvasElement.style.top = this._background.coordinates.y.toString() + 'px';
        bgCanvasElement.width = this._background.width;
        bgCanvasElement.height = this._background.height;
    }

    this._midground = new Midground();
    var mgWrapper = document.querySelector('#mgdiv');
    if (mgWrapper) {
        mgWrapper.style.left = this._midground.coordinates.x.toString() + 'px';
        mgWrapper.style.top = this._midground.coordinates.y.toString() + 'px';
        mgWrapper.style.width = this._midground.width.toString() + 'px';
        mgWrapper.style.height = this._midground.height.toString() + 'px';
        mgWrapper.style.background = 'transparent';
    }
    // size mid-ground container element to match canvas dimensions
    var mgCanvasElement = document.querySelector(this._midground.selector);
    if (mgCanvasElement) {
        mgCanvasElement.style.left = this._midground.coordinates.x.toString() + 'px';
        mgCanvasElement.style.top = this._midground.coordinates.y.toString() + 'px';
        mgCanvasElement.width = this._midground.width;
        mgCanvasElement.height = this._midground.height;
    }

    this._viewport = new Viewport();
    var vpWrapper = document.querySelector('#fgdiv');
    if (vpWrapper) {
        vpWrapper.style.left = this._viewport.coordinates.x.toString() + 'px';
        vpWrapper.style.top = this._viewport.coordinates.y.toString() + 'px';
        vpWrapper.style.width = this._viewport.width.toString() + 'px';
        vpWrapper.style.height = this._viewport.height.toString() + 'px';
        vpWrapper.style.background = 'transparent';
    }
    // size mid-ground container element to match canvas dimensions
    var vpCanvasElement = document.querySelector(this._viewport.selector);
    if (vpCanvasElement) {
        vpCanvasElement.style.left = this._viewport.coordinates.x.toString() + 'px';
        vpCanvasElement.style.top = this._viewport.coordinates.y.toString() + 'px';
        vpCanvasElement.width = this._viewport.width;
        vpCanvasElement.height = this._viewport.height;
    }
    
    this._player = new Player(playerName);
    this._playerShip = null;
    this._playerShipName = shipName;
  }

  /* getters */

  get isReady() {
    return this._background.ready && this._midground.ready;
  }

  get background() {
    return this._background;
  }

  get midground() {
    return this._midground;
  }

  get viewport() {
    return this._viewport;
  }

  get playerShip() {
    return this._playerShip;
  }

  get maxSpawnDistanceX() {
    return this._viewport.width * 1;
  }

  get maxSpawnDistanceY() {
    return this._viewport.height * 1;
  }

  get objects() {
    return this._gameObjects;
  }

  /* setters */

  set playerShip(ship) {
    this._playerShip = ship;
  }
}

Game.prototype.tick = function() {
  if (!this.isReady) {
    return;
  }
  this._viewport.clear();  
  var deadAndAlive = this._gameObjects.partition(function(obj) {
    return obj.disposable;
  });
  this._gameObjects = deadAndAlive[1];
  var npcCount = 0;
  for (var i = 0; i < this._gameObjects.length; i++) {
    if (this._gameObjects[i].type === GameObjectTypes.SHIP && this._gameObjects[i].role !== ShipRoles.PLAYER) {
      npcCount++;
    }
    this._gameObjects[i].updateAndDraw(debug);
    if (this._gameObjects[i] === this._playerShip) {
      var uiCoord = document.querySelector(".ui.debug.coord");
      if (uiCoord) {
        uiCoord.innerHTML = "<p>x:" + (this._playerShip.coordinates.x ? this._playerShip.coordinates.x.toFixed(1) : " ") + " y:" + (this._playerShip.coordinates.y ? this._playerShip.coordinates.y.toFixed(1) : " ") + "</p>";
      }
      var uiVector = document.querySelector(".ui.debug.vector");
      if (uiVector) {
        uiVector.innerHTML = "<p>spd:" + (this._playerShip.speed ? this._playerShip.speed.toFixed(1) : " ") + " hdg:" + (this._playerShip.heading ? this._playerShip.heading.toFixed(1) : " ") + "</p>";
      }
      var uiStatus = document.querySelector(".ui.debug.status");
      if (uiStatus) {
        uiStatus.innerHTML = "<p>status:" + this._playerShip.status + "</p>";
      }
      var uiCondition = document.querySelector(".ui.debug.condition");
      if (uiCondition) {
        uiCondition.innerHTML = "<p>shields:" + this._playerShip.shield.charge + "% armour:" + this._playerShip.armour + " hull:" + this._playerShip.hullIntegrity + "%</p>";
      }
      var uiInputs = document.querySelector(".ui.debug.inputs");
      if (uiInputs) {
        uiInputs.innerHTML = "<p>thrust:" + (this._playerShip.thrust ? this._playerShip.thrust.toFixed(1) : " ") + "</p>";
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
    //newShip.coordinates.x = this._playerShip.coordinates.x + rand(this.maxSpawnDistanceX, incNegatives = true);
    //newShip.coordinates.y = this._playerShip.coordinates.y + rand(this.maxSpawnDistanceY, incNegatives = true);
    this._gameObjects.push(newShip);
  }

  this._midground.draw();
}

Game.prototype.start = function() {
  // pre-load larger images
  imageService.loadImage('../image/Explosion01_5x5.png');
  this._background.init();
  this._midground.init('../image/star-tile-transparent.png', game.midground.draw.bind(game.midground));
  this._viewport.init();
  // create player's ship
  this._playerShip = new Ship(ShipTypes.COBRA3, this._playerShipName, this._player);
  //this._playerShip.coordinates = new Point2d(
  //  this._viewport.centre.x - (this._playerShip.model.width / 2),
  //  this._viewport.centre.y - (this._playerShip.model.height / 2)
  //)
  this._gameObjects.push(this._playerShip);
  // all systems go!
	setInterval(main, 1000/fps);
}

var game = new Game();

function main() {
  requestAnimationFrame(game.tick.bind(game));
};

//requestAnimationFrame(game.tick.bind(game));

(function() {
  game.start();
})();