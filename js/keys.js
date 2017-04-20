// js/keys.js
window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

var Keys = {
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
}

var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;
var keyBoost = false;
var keyFire = false;
var keyFlightAssist = false;
var keyThrust = false;
var keyStop = false;
var keyDebugBreak = false;

function handleKeyDown(e) {
  switch (e.code.toUpperCase()) {
    case Keys.ARROWUP:
    case Keys.W:
      keyUp = true;
      e.preventDefault();
      break;
    case Keys.ARROWDOWN:
    case Keys.S:
      keyDown = true;
      e.preventDefault();
      break;
    case Keys.ARROWLEFT:
    case Keys.A:
      keyLeft = true;
      e.preventDefault();
      break;
    case Keys.ARROWRIGHT:
    case Keys.D:
      keyRight = true;
      e.preventDefault();
      break;
    case Keys.BOOST:
      keyBoost = true;
      e.preventDefault();
      break;
    case Keys.FIRE:
      keyFire = true;
      e.preventDefault();
      break;
    case Keys.FLIGHTASSIST:
      keyFlightAssist = true;
      e.preventDefault();
      break;  
    case Keys.THRUST:
    case Keys.SHIFTRIGHT: 
      keyThrust = true;
      e.preventDefault();
      break;
    case Keys.STOP:
      keyStop = true;
      e.preventDefault;
      break;    
    case Keys.DEBUGBREAK:
      debugger;
      e.preventDefault();
      break;  
  }
}

function handleKeyUp(e) {
  switch (e.code.toUpperCase()) {
    case Keys.ARROWUP:
    case Keys.W:
      keyUp = false;
      e.preventDefault();
      break;
    case Keys.ARROWDOWN:
    case Keys.S:
      keyDown = false;
      e.preventDefault();
      break;
    case Keys.ARROWLEFT:
    case Keys.A:
      keyLeft = false;
      e.preventDefault();
      break;
    case Keys.ARROWRIGHT:
    case Keys.D:
      keyRight = false;
      e.preventDefault();
      break;
    case Keys.BOOST:
      keyBoost = false;
      e.preventDefault();
      break;
    case Keys.FIRE:
      keyFire = false;
      e.preventDefault();
      break;
    case Keys.FLIGHTASSIST:
      keyFlightAssist = false;
      e.preventDefault();
      break;  
    case Keys.THRUST:
    case Keys.SHIFTRIGHT:
      keyThrust = false;
      e.preventDefault();
      break;
    case Keys.STOP:
      keyStop = false;
      e.preventDefault;
      break;    
  }
}
