// model/player.js

var Player = function(name) {
	this.name = 'Cmdr ' + name ? name : 'Jameson';
	this.rank = 'Harmless';
	this.credits = 100;
	this.ship = null;
	this.increaseThrust = function() {
		if (this.ship) {
			this.ship.increaseThrust();
		}
	}
	this.decreaseThrust = function() {
		if (this.ship) {
			this.ship.decreaseThrust();
		}
	}
	this.yawRight = function() {
		if (this.ship) {
			this.ship.yaw('cw');
		}
	}
	this.yawLeft = function() {
		if (this.ship) {
			this.ship.yaw('ccw');
		}
	}
	this.boost = function() {
		if (this.ship) {
			this.ship.boost();
		}
	}
	this.fire = function() {
		if (this.ship) {
			this.ship.fireWeapons();
		}
	}
	this.toggleFlightAssist = function() {
		if (this.ship) {
			this.ship.flightAssist = !this.ship.flightAssist;
		}
	}
	this.visibleRegion = function() {
	  return {
	  	x1: playerShip.cx - environment.viewport.width / 2,
			y1: playerShip.cy - environment.viewport.height / 2,
			x2: playerShip.cx + environment.viewport.width / 2,
			y2: playerShip.cy + environment.viewport.height / 2
	  };
	}
};
