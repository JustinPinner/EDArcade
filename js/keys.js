
class KeyHandler {
  constructor() {
    this._keys = {
      ARROWUP: 'ARROWUP',
      W: 'KEYW',
      ARROWDOWN: 'ARROWDOWN',
      S: 'KEYS',
      ARROWLEFT: 'ARROWLEFT',
      A: 'KEYA',
      ARROWRIGHT: 'ARROWRIGHT',
      D: 'KEYD',
      Q: 'KEYQ',
      Z: 'KEYZ',
      BOOST: 'SHIFTLEFT',
      THRUST: 'SPACE',
      SHIFTRIGHT: 'SHIFTRIGHT',
      TARGET: 'KEYT',
      FIRE: 'ENTER',
      FLIGHTASSIST: 'KEYZ',
      STOP: 'BACKSPACE',
      DEBUGBREAK: 'ESCAPE'
    };
    this._enabled = false;
    this._keyUp = false;
    this._keyDown = false;
    this._keyLeft = false;
    this._keyRight = false;
    this._keyAscend = false;
    this._keyDescend = false;
    this._keyBoost = false;
    this._keySwitchTarget = false;
    this._keyFire = false;
    this._keyFlightAssist = false;
    this._keyThrust = false;
    this._keyStop = false;
    this._keyDebugBreak = false;
    this._ignored = [];
    this._queue = []; 
  }
  get enabled() {
    return this._enabled;
  }
  get up() {
    return this._keyUp || this._keyThrust;
  }
  get down() {
    return this._keyDown;
  }
  get left() {
    return this._keyLeft;
  }
  get right() {
    return this._keyRight;
  }
  get ascend() {
    return this._keyAscend;
  }
  get descend() {
    return this._keyDescend;
  }
  get boost() {
    return this._keyBoost;
  }
  get switchTarget() {
    return this._keySwitchTarget;
  }
  get fire() {
    return this._keyFire;
  }
  get flightAssist() {
    return this._keyFlightAssist;
  }
  get stop() {
    return this._keyStop;
  }
  get debugBreak() {
    return this._keyDebugBreak;
  }
  
  set enabled(val) {
    this._enabled = val;
  }

}

KeyHandler.prototype.ignore = function(key, ms) {
  const now = new Date().getTime();
  const active = this._ignored.partition(function(k) {
    return k.timeout > now;
  })[0];
  const index = active.findIndex(function(k) {
    return k == key;
  });
  const expires = now + ms;
  if(index < 0) {
    active.push({
      key: key, 
      timeout: expires
    });
  } else {
    active[index].timeout = expires;
  }
  this._ignored = active;
}


KeyHandler.prototype.ignored = function(key) {
  const now = new Date().getTime();
  const active = this._ignored.partition(function(k) {
    return k.timeout > now;
  })[0];
  this._ignored = active;
  return active.findIndex(function(k) {
    return k.key == key;
  }) > -1;
}

KeyHandler.prototype.queued = function(key) {
  return this._queue.partition(function(k) {
    return k == key;
  })[0].length > 0;
}

KeyHandler.prototype.enQueue = function(key) {
  if(!this.queued(key)) {
    this._queue.push(key);
  }
}

KeyHandler.prototype.deQueue = function(key) {
  this._queue = this._queue.partition(function(k) {
    return k != key;
  })[0];
}

KeyHandler.prototype.handleKeyDown = function(e) {
  e.preventDefault();
  this._enabled = true;
  const pressed = e.code.toUpperCase();
  // if (this.queued(pressed)) {
  //   debugger;
  //   return;
  // }
  // this.enQueue(pressed);
  switch (pressed) {
    case this._keys.ARROWUP:
    case this._keys.W:
      this._keyUp = true;
      break;
    case this._keys.ARROWDOWN:
    case this._keys.S:
      this._keyDown = true;
      break;
    case this._keys.ARROWLEFT:
    case this._keys.A:
      this._keyLeft = true;
      break;
    case this._keys.ARROWRIGHT:
    case this._keys.D:
      this._keyRight = true;
      break;
    case this._keys.Q:
      if (!this.ignored(this._keys.Q)){
        this._keyAscend = true;
        this.ignore(this._keys.Q, 1000);
      } else {
        this._keyAscend = false;
      }
      break;
    case this._keys.Z:
      if (!this.ignored(this._keys.Z)){
        this._keyDescend = true;
        this.ignore(this._keys.Z, 1000);
      } else {
        this._keyDescend = false;
      }
      break;
    case this._keys.BOOST:
      this._keyBoost = true;
      break;
    case this._keys.TARGET:
      this._keySwitchTarget = true;
      break;
    case this._keys.FIRE:
      this._keyFire = true;
      break;
    case this._keys.FLIGHTASSIST:
      this._keyFlightAssist = true;
      break;  
    case this._keys.THRUST:
    case this._keys.SHIFTRIGHT: 
      this._keyThrust = true;
      break;
    case this._keys.STOP:
      this._keyStop = true;
      break;    
    case this._keys.DEBUGBREAK:
      debugger;
      break;  
  }
}

KeyHandler.prototype.handleKeyUp = function(e) {
  e.preventDefault();
  const pressed = e.code.toUpperCase();
  switch (pressed) {
    case this._keys.ARROWUP:
    case this._keys.W:
      this._keyUp = false;
      break;
    case this._keys.ARROWDOWN:
    case this._keys.S:
      this._keyDown = false;
      break;
    case this._keys.ARROWLEFT:
    case this._keys.A:
      this._keyLeft = false;
      break;
    case this._keys.ARROWRIGHT:
    case this._keys.D:
      this._keyRight = false;
      break;
    case this._keys.Q:
      this._keyAscend = false;
      break;
    case this._keys.Z:
      this._keyDescend = false;
      break;
    case this._keys.BOOST:
      this._keyBoost = false;
      break;
    case this._keys.TARGET:
      this._keySwitchTarget = false;
      break;
    case this._keys.FIRE:
      this._keyFire = false;
      break;
    case this._keys.FLIGHTASSIST:
      this._keyFlightAssist = false;
      break;  
    case this._keys.THRUST:
    case this._keys.SHIFTRIGHT:
      this._keyThrust = false;
      break;
    case this._keys.STOP:
      this._keyStop = false;
      break;    
  }
  // this.deQueue(pressed);
}
