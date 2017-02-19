// js/keys.js
window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

var Keys = {
	UP: 38,		// up arrow
	DOWN: 40,	// down arrow
	LEFT: 37,	// left arrow
	RIGHT: 39,	// right arrow
	BOOST: 16,	// l-shift
	THRUST: 32,	// space
  FIRE: 13, // enter
	FLIGHTASSIST: 90	// z
}

var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;
var keyBoost = false;
var keyFire = false;
var keyFlightAssist = false;
var keyThrust = false;

function handleKeyDown(e) {
  switch (e.keyCode) {
    case Keys.UP:
      keyUp = true;
      e.preventDefault();
      break;
    case Keys.DOWN:
      keyDown = true;
      e.preventDefault();
      break;
    case Keys.LEFT:
      keyLeft = true;
      e.preventDefault();
      break;
    case Keys.RIGHT:
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
      keyThrust = true;
      e.preventDefault();
      break;  
  }
}

function handleKeyUp(e) {
  switch (e.keyCode) {
    case Keys.UP:
      keyUp = false;
      e.preventDefault();
      break;
    case Keys.DOWN:
      keyDown = false;
      e.preventDefault();
      break;
    case Keys.LEFT:
      keyLeft = false;
      e.preventDefault();
      break;
    case Keys.RIGHT:
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
      keyThrust = false;
      e.preventDefault();
      break;  
  }
}
