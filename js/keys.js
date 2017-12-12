
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
      TARGET: 'KEYT',
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
    this._keySwitchTarget = false;
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
  get switchTarget() {
    return this._keySwitchTarget;
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
  switch (e.keyCode) {
    case 211:  // GamepadLeftThumbstickUp
    case 203:  // GamepadDPadUp
      break;

    case 212:  // GamepadLeftThumbstickDown
    case 204:  // GamepadDPadDown
      break;

    case 214:  // GamepadLeftThumbstickLeft
    case 205:  // GamepadDPadLeft
      this._keyLeft = true;
      e.preventDefault();
    break;

    case 213:  // GamepadLeftThumbstickRight
    case 206:  // GamepadDPadRight
      this._keyRight = true;
      e.preventDefault();
      break;

    case 195:  // A Button
      this._keyThrust = true;
      e.preventDefault();
      break;

    case 196: // B button
      break;

    case 197: // X Button
      this._keyStop = true;
      e.preventDefault;
      break;

    case 198: // Y Button
      break;

    case 208: // View button
      break;

    case 207: // Menu button
      break;

    case 200: // Left Bumper
      break;

    case 199: // Right Bumper
      break;

    case 201: // Left Trigger
      break;

    case 202: // Right Trigger
      this._keyFire = true;
      break;

  }

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
    case this._keys.TARGET:
      this._keySwitchTarget = true;
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
    case this._keys.TARGET:
      this._keySwitchTarget = false;
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
