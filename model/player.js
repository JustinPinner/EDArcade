
class Player {
	constructor(name) {
		this._name = name ? 'Cmdr ' + name : 'Cmdr Jameson';
		this._rank = 'Harmless';
		this._credits = 100;
		this._ship = null;
		this._ready = null;
	}
	// getters
	get name() {
		return this._name;
	}
	get rank() {
		return this._rank;
	}
	get credits() {
		return this._credits;
	}
	get ship() {
		return this._ship;
	}
	get ready() {
		return this.ready;
	}
	// setters
	set name(val) {
		this._name = val;
	}
	set rank(val) {
		this._rank = val;
	}
	set credits(val) {
		this._credits = val;
	}
	set ship(val) {
		this._ship = val;
	}
	set ready(val) {
		this._ready = val;
	}
}

Player.prototype.init = function() {
	this.ready = true;
}

Player.prototype.increaseThrust = function() {
	if (this.ship) {
		this.ship.increaseThrust();
	}
}

Player.prototype.decreaseThrust = function() {
	if (this.ship) {
		this.ship.decreaseThrust();
	}
}

Player.prototype.yawRight = function() {
	if (this.ship) {
		this.ship.yaw('cw');
	}
}

Player.prototype.yawLeft = function() {
	if (this.ship) {
		this.ship.yaw('ccw');
	}
}

Player.prototype.boost = function() {
	if (this.ship) {
		this.ship.boost();
	}
}

Player.prototype.fire = function() {
	if (this.ship) {
		this.ship.fireWeapons();
	}
}

Player.prototype.toggleFlightAssist = function() {
	if (this.ship) {
		this.ship.flightAssist = !this.ship.flightAssist;
	}
}
