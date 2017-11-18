// js/game.js

const debug = document.location.search.substr(1).indexOf("debug") > -1;

const minNPC = 10;
const fps = 30;

const imageService = new ImageService();

class Game {
  constructor(playerName, shipName) {   
    this._gameObjects = [];
    this._background = new Background();
    // size and style background wrapper div
    const bgWrapper = document.querySelector('#bgdiv');
    if (bgWrapper) {
        bgWrapper.style.left = this._background.coordinates.x.toString() + 'px';
        bgWrapper.style.top = this._background.coordinates.y.toString() + 'px';
        bgWrapper.style.width = this._background.width.toString() + 'px';
        bgWrapper.style.height = this._background.height.toString() + 'px';
        bgWrapper.style.backgroundColor = '#000000';
    }
    // size background container element to match canvas dimensions
    const bgCanvasElement = document.querySelector(this._background.selector);
    if (bgCanvasElement) {
        bgCanvasElement.style.left = this._background.coordinates.x.toString() + 'px';
        bgCanvasElement.style.top = this._background.coordinates.y.toString() + 'px';
        bgCanvasElement.width = this._background.width;
        bgCanvasElement.height = this._background.height;
    }

    this._midground = new Midground();
    const mgWrapper = document.querySelector('#mgdiv');
    if (mgWrapper) {
        mgWrapper.style.left = this._midground.coordinates.x.toString() + 'px';
        mgWrapper.style.top = this._midground.coordinates.y.toString() + 'px';
        mgWrapper.style.width = this._midground.width.toString() + 'px';
        mgWrapper.style.height = this._midground.height.toString() + 'px';
        mgWrapper.style.background = 'transparent';
    }
    // size mid-ground container element to match canvas dimensions
    const mgCanvasElement = document.querySelector(this._midground.selector);
    if (mgCanvasElement) {
        mgCanvasElement.style.left = this._midground.coordinates.x.toString() + 'px';
        mgCanvasElement.style.top = this._midground.coordinates.y.toString() + 'px';
        mgCanvasElement.width = this._midground.width;
        mgCanvasElement.height = this._midground.height;
    }

    this._viewport = new Viewport();
    const vpWrapper = document.querySelector('#fgdiv');
    if (vpWrapper) {
        vpWrapper.style.left = this._viewport.coordinates.x.toString() + 'px';
        vpWrapper.style.top = this._viewport.coordinates.y.toString() + 'px';
        vpWrapper.style.width = this._viewport.width.toString() + 'px';
        vpWrapper.style.height = this._viewport.height.toString() + 'px';
        vpWrapper.style.background = 'transparent';
    }
    // size mid-ground container element to match canvas dimensions
    const vpCanvasElement = document.querySelector(this._viewport.selector);
    if (vpCanvasElement) {
        vpCanvasElement.style.left = this._viewport.coordinates.x.toString() + 'px';
        vpCanvasElement.style.top = this._viewport.coordinates.y.toString() + 'px';
        vpCanvasElement.width = this._viewport.width;
        vpCanvasElement.height = this._viewport.height;
    }
    
    this._player = new Player(playerName);
    this._playerShip = null;
    this._playerShipName = shipName;
    this._keyHandler = new KeyHandler();
  
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
    return (this._viewport.width / 2) * 5;
  }

  get maxSpawnDistanceY() {
    return (this._viewport.height / 2) * 5;
  }

  get despawnRange() {
    const maxX = this.maxSpawnDistanceX * 2;
    const maxY = this.maxSpawnDistanceY * 2
    return Math.sqrt((maxX * maxX)+(maxY * maxY));
  }

  get objects() {
    return this._gameObjects;
  }

  get keys() {
    return this._keyHandler;
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
  const deadAndAlive = this._gameObjects.partition(function(obj) {
    return obj.disposable;
  });
  this._gameObjects = deadAndAlive[1];
  var npcCount = 0;
  for (var i = 0; i < this._gameObjects.length; i++) {
    const gameObject = this._gameObjects[i];
    if (gameObject.TTL) {
      const now = Date.now();
      if (!gameObject.lastTTLTick || (gameObject.lastTTLTick && now - gameObject.lastTTLTick >= 1000)) {
        gameObject.lastTTLTick = Date.now();
        gameObject.TTL -= 1;
        if (gameObject.TTL <= 0) {
          gameObject.disposable = true;
        }
      }
    }
    if (gameObject.type === GameObjectTypes.SHIP && gameObject.role !== PilotRoles.PLAYER) {
      npcCount++;
    }
    gameObject.updateAndDraw(debug);
    if (gameObject === this._playerShip) {
      const uiCoord = document.querySelector(".ui.debug.coord");
      if (uiCoord) {
        uiCoord.innerHTML = "<p>x:" + (this._playerShip.coordinates.x ? this._playerShip.coordinates.x.toFixed(1) : " ") + " y:" + (this._playerShip.coordinates.y ? this._playerShip.coordinates.y.toFixed(1) : " ") + "</p>";
      }
      const uiVector = document.querySelector(".ui.debug.vector");
      if (uiVector) {
        uiVector.innerHTML = "<p>spd:" + (this._playerShip.speed ? this._playerShip.speed.toFixed(1) : " ") + " hdg:" + (this._playerShip.heading ? this._playerShip.heading.toFixed(1) : " ") + "</p>";
      }
      const uiStatus = document.querySelector(".ui.debug.status");
      if (uiStatus) {
        uiStatus.innerHTML = "<p>status:" + this._playerShip.status + "</p>";
      }
      const uiCondition = document.querySelector(".ui.debug.condition");
      if (uiCondition) {
        uiCondition.innerHTML = "<p>shields:" + this._playerShip.shield.charge + "% armour:" + this._playerShip.armour + " hull:" + this._playerShip.hullIntegrity + "%</p>";
      }
      const uiInputs = document.querySelector(".ui.debug.inputs");
      if (uiInputs) {
        uiInputs.innerHTML = "<p>thrust:" + (this._playerShip.thrust ? this._playerShip.thrust.toFixed(1) : " ") + "</p>";
      }      
    }
  }
  const uiNpcs = document.querySelector(".ui.debug.npcs");
  if (uiNpcs) {
    uiNpcs.innerHTML = "<p>NPCs:" + npcCount + "</p>";
  }
  // spawn new / maintain min. NPC ships
  for (var i = npcCount; i < minNPC; i++) {
    const spawnShipType = ShipTypes[Object.keys(ShipTypes)[Math.floor(rand(Object.keys(ShipTypes).length))]];
    const spawnShipRole = PilotRoles[Object.keys(PilotRoles)[Math.floor(rand(Object.keys(PilotRoles).length - 1))]];
    const newShip = new Ship(spawnShipType, 'NPC' + i, spawnShipRole);
    this._gameObjects.push(newShip);
  }

  this._midground.draw();
}

Game.prototype.start = function() {
  window.addEventListener('keydown', this._keyHandler.handleKeyDown.bind(this._keyHandler), false);
  window.addEventListener('keyup', this._keyHandler.handleKeyUp.bind(this._keyHandler), false);    
  // pre-load larger images
  imageService.loadImage('../image/Explosion01_5x5.png');
  this._background.init();
  this._midground.init('../image/star-tile-transparent.png', game.midground.draw.bind(game.midground));
  this._viewport.init();
  // create player's ship
  this._playerShip = new Ship(ShipTypes.COBRA3, this._playerShipName, this._player);
  this._gameObjects.push(this._playerShip);
  // all systems go!
	setInterval(main, 1000/fps);
}

const game = new Game();

function main() {
  requestAnimationFrame(game.tick.bind(game));
};

(function() {
  game.start();
})();