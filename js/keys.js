
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
      BOOST: 'SHIFTLEFT',
      THRUST: 'SPACE',
      SHIFTRIGHT: 'SHIFTRIGHT',
      FIRE: 'ENTER',
      FLIGHTASSIST: 'KEYZ',
      STOP: 'BACKSPACE',
      DEBUGBREAK: 'ESCAPE'
    };
    this._keyUp = false;
    this._keyDown = false;
    this._keyLeft = false;
    this._keyRight = false;
    this._keyBoost = false;
    this._keyFire = false;
    this._keyFlightAssist = false;
    this._keyThrust = false;
    this._keyStop = false;
    this._keyDebugBreak = false; 
  }
  get up() {
    return this._keyUp;
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
  get boost() {
    return this._keyBoost;
  }
  get fire() {
    return this._keyFire;
  }
  get flightAssist() {
    return this._keyFlightAssist;
  }
  get thrust() {
    return this._keyThrust;
  }
  get stop() {
    return this._keyStop;
  }
  get debugBreak() {
    return this._keyDebugBreak;
  }
}

KeyHandler.prototype.handleKeyDown = function(e) {
  switch (e.code.toUpperCase()) {
    case this._keys.ARROWUP:
    case this._keys.W:
      this._keyUp = true;
      e.preventDefault();
      break;
    case this._keys.ARROWDOWN:
    case this._keys.S:
      this._keyDown = true;
      e.preventDefault();
      break;
    case this._keys.ARROWLEFT:
    case this._keys.A:
      this._keyLeft = true;
      e.preventDefault();
      break;
    case this._keys.ARROWRIGHT:
    case this._keys.D:
      this._keyRight = true;
      e.preventDefault();
      break;
    case this._keys.BOOST:
      this._keyBoost = true;
      e.preventDefault();
      break;
    case this._keys.FIRE:
      this._keyFire = true;
      e.preventDefault();
      break;
    case this._keys.FLIGHTASSIST:
      this._keyFlightAssist = true;
      e.preventDefault();
      break;  
    case this._keys.THRUST:
    case this._keys.SHIFTRIGHT: 
      this._keyThrust = true;
      e.preventDefault();
      break;
    case this._keys.STOP:
      this._keyStop = true;
      e.preventDefault;
      break;    
    case this._keys.DEBUGBREAK:
      debugger;
      e.preventDefault();
      break;  
  }  
}

KeyHandler.prototype.handleKeyUp = function(e) {
  switch (e.code.toUpperCase()) {
    case this._keys.ARROWUP:
    case this._keys.W:
      this._keyUp = false;
      e.preventDefault();
      break;
    case this._keys.ARROWDOWN:
    case this._keys.S:
      this._keyDown = false;
      e.preventDefault();
      break;
    case this._keys.ARROWLEFT:
    case this._keys.A:
      this._keyLeft = false;
      e.preventDefault();
      break;
    case this._keys.ARROWRIGHT:
    case this._keys.D:
      this._keyRight = false;
      e.preventDefault();
      break;
    case this._keys.BOOST:
      this._keyBoost = false;
      e.preventDefault();
      break;
    case this._keys.FIRE:
      this._keyFire = false;
      e.preventDefault();
      break;
    case this._keys.FLIGHTASSIST:
      this._keyFlightAssist = false;
      e.preventDefault();
      break;  
    case this._keys.THRUST:
    case this._keys.SHIFTRIGHT:
      this._keyThrust = false;
      e.preventDefault();
      break;
    case this._keys.STOP:
      this._keyStop = false;
      e.preventDefault;
      break;    
  }
}
