// js/game.js
const version = '0.1.16';
const params = document.location.search.substr(1).toString();
const debug = params.includes("debug");
const oldSchool = !params.includes("dangerous");
const practiceMode = params.includes("practice");
const minNPC = 0;
const fps = 30;
const imageService = new ImageService();
const gamepadSupport = "getGamepads" in navigator;
const MAX_SPAWN_SCREENS_WIDE = 1;
const MAX_SPAWN_SCREENS_HIGH = 1;

class Game {
  constructor() {
    this._loggedEvents = [];
    this._ticks = 0;   
    this._touchSupport = window.navigator.maxTouchPoints > 0;
    this._shipSet = oldSchool ? SHIPS_84 : SHIPS;
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

    if (this._touchSupport) {
      // size touch interface container
      this._touchInterface = new TouchInterface();
      const tiWrapper = document.querySelector('#touchdiv');
      if (tiWrapper) {
        tiWrapper.style.left = this._viewport.coordinates.x.toString() + 'px';
        tiWrapper.style.top = this._viewport.coordinates.y.toString() + 'px';
        tiWrapper.style.width = this._viewport.width.toString() + 'px';
        tiWrapper.style.height = this._viewport.height.toString() + 'px';
        tiWrapper.style.background = 'transparent';
      }
      // size touch interface canvas
      if (this._touchInterface.element) {
        this._touchInterface.element.style.left = this._viewport.coordinates.x.toString() + 'px';
        this._touchInterface.element.style.top = this._viewport.coordinates.y.toString() + 'px';
        this._touchInterface.element.width = this._viewport.width;
        this._touchInterface.element.height = this._viewport.height;
      }
    }

    const uiVersion = document.querySelector(".ui.debug.version");      
    if (uiVersion) {
      uiVersion.innerHTML = "<p>version:" + version + "</p>";
    }

    this._keyHandler = new KeyHandler();
    this._gamepadHandler = new GamepadHandler();
      
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

  get localPlayer() {
    return this._localPlayer;
  }

  get maxSpawnDistanceX() {
    return (this._viewport.width / 2) * MAX_SPAWN_SCREENS_WIDE;
  }

  get maxSpawnDistanceY() {
    return (this._viewport.height / 2) * MAX_SPAWN_SCREENS_HIGH;
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

  get gamepad() {
    return this._gamepadHandler.gamepad;
  }

  get touch() {
    return this._touchSupport;
  }

  get touchHandler() {
    return this._touchSupport && this._touchInterface.touchHandler;
  }
  
  get shipSet() {
    return this._shipSet;
  }

  /* setters */

  set localPlayer(player) {
    this._localPlayer = player;
  }

}

Game.prototype.logEvent = function(ev) {
  this._loggedEvents.push(ev);
}

Game.prototype.tick = function() {
  this._ticks += 1;
  if (!this.isReady) {
    return;
  }
  if (this._ticks % 10 == 0) {
    this.flushLoggedEvents();
  }
  this._viewport.clear();  
  const deadAndAlive = this._gameObjects.partition(function(obj) {
    return obj.TTL ? obj.TTL <= 0 : obj.disposable;
  });
  this._gameObjects = deadAndAlive[1];
  var npcCount = 0;
  for (var i = 0; i < this._gameObjects.length; i++) {
    const gameObject = this._gameObjects[i];
    if (gameObject.TTL && gameObject.TTL > 0) {
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
    if (gameObject === this.localPlayer.ship) {
      const uiCoord = document.querySelector(".ui.debug.coord");
      if (uiCoord) {
        uiCoord.innerHTML = "<p>x:" + (this._localPlayer.ship.coordinates.centre.x ? this._localPlayer.ship.coordinates.centre.x.toFixed(1) : " ") + " y:" + (this._localPlayer.ship.coordinates.centre.y ? this._localPlayer.ship.coordinates.centre.y.toFixed(1) : " ") + "</p>";
      }
      const uiVector = document.querySelector(".ui.debug.vector");
      if (uiVector) {
        uiVector.innerHTML = "<p>vel:" + (this._localPlayer.ship.velocity ? this._localPlayer.ship.velocity.length : " N/A ") + " hdg:" + (this._localPlayer.ship.heading ? this._localPlayer.ship.heading.toFixed(1) : " ") + "</p>";
      }
      const uiStatus = document.querySelector(".ui.debug.status");
      if (uiStatus) {
        uiStatus.innerHTML = "<p>status:" + this._localPlayer.ship.status + "</p>";
      }
      const uiCondition = document.querySelector(".ui.debug.condition");
      if (uiCondition) {
        uiCondition.innerHTML = "<p>shields:" + this._localPlayer.ship.shield.charge + "% armour:" + this._localPlayer.ship.armour + " hull:" + this._localPlayer.ship.hullIntegrity + "%</p>";
      }
      const uiInputs = document.querySelector(".ui.debug.inputs");
      if (uiInputs) {
        uiInputs.innerHTML = "<p>thrust:" + (this._localPlayer.ship.thrust ? this._localPlayer.ship.thrust.toFixed(1) : " ") + "</p>";
      }
    }
  }
  const uiNpcs = document.querySelector(".ui.debug.npcs");
  if (uiNpcs) {
    uiNpcs.innerHTML = "<p>NPCs:" + npcCount + "</p>";
  }
  // spawn new / maintain min. NPC ships
  for (var i = npcCount; i < minNPC; i++) {
    const spawnShipType = this._shipSet[Object.keys(this._shipSet)[Math.floor(rand(Object.keys(this._shipSet).length))]];
    const newShip = new Ship(spawnShipType, false);
    newShip.init();
    this._gameObjects.push(newShip);
  }

  this._viewport.trackFocussedObject();

  this._midground.draw();
  
  this._touchSupport && this._touchInterface.draw();
}

Game.prototype.start = function() {
  window.addEventListener('keydown', this._keyHandler.handleKeyDown.bind(this._keyHandler), false);
  window.addEventListener('keyup', this._keyHandler.handleKeyUp.bind(this._keyHandler), false);    
  // pre-load larger images
  imageService.loadImage('../image/Explosion01_5x5.png');
  
  this._background.init();
  this._midground.init('../image/star-tile-transparent.png', game.midground.draw.bind(game.midground));
  this._viewport.init();
  this._touchSupport && this._touchInterface.init();

  // create local player
  this.localPlayer = new Player();
  this.localPlayer.init();

  // create local player's ship
  this.localPlayer.ship = new Ship(this._shipSet.COBRA3, true);
  this.localPlayer.ship.player = this.localPlayer;
  this.localPlayer.ship.init();

  // set viewport focus
  this._viewport.focus(this.localPlayer.ship);

  // push player's ship to the object stack 
  this._gameObjects.push(this.localPlayer.ship);

  // all systems go!
	setInterval(main, 1000/fps);
}

Game.prototype.filterObjects = function(objectTypeOrTypes) {
  if (objectTypeOrTypes) {
    return this.objects.filter(function(obj) {
      return objectTypeOrTypes instanceof Array ? 
        objectTypeOrTypes.includes(obj.constructor) : 
        obj instanceof objectTypeOrTypes;
    })
  }
  return this.objects;
}

Game.prototype.log = function(loggedEvent) {
  this._loggedEvents.push(loggedEvent.dump);
}

Game.prototype.flushLoggedEvents = function() {
  for (let ev=0; ev < this._loggedEvents.length; ev += 1) {
    console.log(this._loggedEvents[ev]);
  }
  this._loggedEvents = [];
}

const game = new Game();

function main() {
  requestAnimationFrame(game.tick.bind(game));
};

(function() {
  game.start();
})();

