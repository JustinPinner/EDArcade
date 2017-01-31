// js/keys.js
window.addEventListener('keydown', handleKeyDown, false);
window.addEventListener('keyup', handleKeyUp, false);

var Keys = {
	UP: 38,		// up arrow
	DOWN: 40,	// down arrow
	LEFT: 37,	// left arrow
	RIGHT: 39,	// right arrow
	BOOST: 16,	// l-shift
	FIRE: 32,	// space
	FLIGHTASSIST: 90	// z
}

var keyUp = false;
var keyDown = false;
var keyLeft = false;
var keyRight = false;
var keyBoost = false;
var keyFire = false;
var keyFlightAssist = false;

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
      break;
    case Keys.FIRE:
      keyFire = true;
      break;
    case Keys.FLIGHTASSIST:
      keyFlightAssist = true;
      break;  
  }
}

function handleKeyUp(e) {
  switch (e.keyCode) {
    case Keys.UP:
      keyUp = false;
      break;
    case Keys.DOWN:
      keyDown = false;
      break;
    case Keys.LEFT:
      keyLeft = false;
      break;
    case Keys.RIGHT:
      keyRight = false;
      break;
    case Keys.BOOST:
      keyBoost = false;
      break;
    case Keys.FIRE:
      keyFire = false;
      break;
    case Keys.FLIGHTASSIST:
      keyFlightAssist = false;
      break;  
  }
}
