// model/ship.js
var nextShipId = 0;

/*
	Generic ship constructor
*/
class Ship {
	constructor(shipType, shipName, role) {
		this.id = nextShipId += 1;
		this.shipName = shipName ? shipName : shipType + this.id;
		this.shipType = shipType;
		this.player = role instanceof Player ? role : null;
		this.flightAssist = this.player ? false : true;
		//this.speed = 0;
		this.heading = this.player ? 270 : rand(359);
		this.thrust = 0;
		this.direction = this.heading;
		this.targets = [];
		this.role = this.player ? null : role;
		this.fsm = this.player ? null : new FSM(this, this.role.initialState);
		this.vx = 0;
		this.vy = 0;
		this.coordinates = {
			x: null,
			y: null
		}
		this.sprite = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			image: imageService.loadImage('../image/' + this.shipType + '.png')
		};
		this.cellAnims = {
			shieldStrike: {
				src: null,
				frames: null,
				frameRate: null
			},
			hullStrike: {
				src: null,
				frames: null,
				frameRate: null
			},
			boostEngage: {
				src: null,
				frames: null,
				frameRate: null
			},
			explode: {
				src: null,
				frames: null,
				frameRate: null
			}
		};
	}
	/* 
			getters
	*/
	get x() {
		return this.coordinates.x;
	}
	get y() {
		return this.coordinates.y;
	}
	get cx() {
		return this.coordinates.x + this.width / 2;
	}
	get cy() {
		return this.coordinates.y + this.height / 2;
	}
	get thrustVector() {
		return (this.heading + 180) - 360;
	}
	get engageRadius() {
		return this.maximumWeaponRange * 3;
	}
	get accelerationRate() {
		return (this.agility / this.mass) * Math.abs(this.thrust) * 10;
	}
	get yawRate() {
		return (this.agility * this.mass) / 100;
	}
	get maximumWeaponRange() {
		var range = null;
		for (var w in this.hardpoints) {
			if (this.hardpoints[w].weapon && this.hardpoints[w].loaded) {
				if (range) {
					if (range > this.hardpoints[w].weapon.range) {
						range = this.hardpoints[w].weapon.range;
					}
				} else {
					range = this.hardpoints[w].weapon.range;
				}
			}
		}
		return range;
	}
	get speed() {
		return Math.abs(this.vx + this.vy) * fps;
	}
	/* 
			setters
	*/
	set x(val) {
		this.coordinates.x = val;
	}
	set y(val) {
		this.coordinates.y = val;
	}
};

Ship.prototype.updateAndDraw = function() {
	if (this.player) {
		this.playerUpdate();
		this.draw();
	} else {
		this.npcUpdate();
    if (this.isOnScreen()) {
    	this.draw();
    }
  }
};

Ship.prototype.npcUpdate = function () {
  if (this.fsm) {
	  this.fsm.execute();
	}
};
	
Ship.prototype.playerUpdate = function() {
	if (keyUp) {
		this.increaseThrust();
	}
	if (keyDown) {
		this.decreaseThrust();
	}
	if (keyLeft) {
		this.yaw('ccw');
	}
	if (keyRight) {
		this.yaw('cw');
	}
	if (keyBoost) {
		this.boost();
	}
	if (keyFire) {
		this.fireWeapons();
	}
	if (keyFlightAssist) {
		this.flightAssist = !this.flightAssist;
	}
	if (keyThrust) {
		this.thrustOn();
	} else {
		this.thrustOff();
	}
	if (this.thrust != 0) {
		this.updateMomentum();
	}
	this.updatePosition();
};

Ship.prototype.accelerate = function() {
	var rate = this.thrust * 0.01;
	var new_x = dir_x(rate, this.heading);
	var new_y = dir_y(rate, this.heading);
	this.vx += new_x;
	this.vy += new_y;
};

Ship.prototype.updateMomentum = function() {
	var dA = angleDifference(this.heading, this.direction);
	if (Math.abs(this.thrust) != 0) {
		this.direction += dA * this.yawRate * 0.1; //(this.yawRate * (1 / (this.thrust != 0 ? Math.abs(this.thrust) : 1)));	
	}
	if (this.direction > 359) {
		this.direction -= 359;
	}
	if (this.direction < 0) {
		this.direction += 359;
	}
};

Ship.prototype.updatePosition = function() {
	if (this.player) {
		var scrollData = {
			obj: this,
			vx: this.vx,
			vy: this.vy
		};
		environment.viewport.scroll(scrollData);
	}
	this.x -= this.vx;
	this.y -= this.vy;
};

Ship.prototype.isOnScreen = function() {
	return environment.viewport.contains(this.x, this.y, this.width, this.height);
};

Ship.prototype.isKnown = function(ship) {
	for (var n = 0; n < this.targets.length; n++) {
		if (this.targets[n] === ship) {
			return true;
		}
	}
	return false;
};

Ship.prototype.isTargetedBy = function(ship) {
	for (var n = 0; n < ship.targets.length; n++) {
		if (ship.targets[n] === this) {
			return true;
		}
	}
	return false;
};

Ship.prototype.selectClosestTarget = function() {
	var closest = null;
	for (var n = 0; n < this.targets.length; n++) {
		if (closest) {
			if (distance_between(this, this.targets[i]) < distanceBetween(this, closest)) {
				closest = this.targets[i];
			}
		} else {
			closest = this.targets[n];
		}
	}
	this.target = closest;
};

Ship.prototype.isInFrontOf = function(ship) {
	var dA = angleBetween(this.cx, this.cy, ship.cx, ship.cy);
	return Math.abs(dA) >= 150;
};
	
Ship.prototype.isBehind = function(ship) {
	return !this.isInFrontOf(ship);
};

Ship.prototype.fire = function(weapon) {
	console.log(this.shipName + ':' + weapon + ' pewpew');
};

Ship.prototype.isHostile = function() {
	// TODO
	return this.player ? true : false;
};

Ship.prototype.thrustOn = function() {
	this.thrust = 100;
	this.accelerate();
};

Ship.prototype.thrustOff = function() {
	this.thrust = 0;
};

Ship.prototype.increaseThrust = function() {
	this.thrust += 2;
	if (this.thrust > 100) this.thrust = 100;	
	if (this.thrust > 0) this.accelerate();
};
	
Ship.prototype.decreaseThrust = function() {
	this.thrust -= 2;
	if (this.thrust < -100) this.thrust = -100;	
	if (this.thrust < 0) this.decelerate();
};
	
Ship.prototype.allStop = function() {
	this.thrust = 0;
};
	
Ship.prototype.npcAccelerate = function() {	
	this.speed += this.accelerationRate;
	if (this.speed > this.maxSpeed) {
		this.speed = this.maxSpeed;
	}
};
	
Ship.prototype.decelerate = function() {
	this.speed -= this.accelerationRate;
	if (this.speed < -this.maxSpeed) {
		this.speed = -this.maxSpeed;
	}
};
	
Ship.prototype.yaw = function(dir) {
	var degsToAdd = 0;
	switch (dir) {
		case 'cw':
			degsToAdd = angleDifference(this.heading, this.heading - this.yawRate * 3);
			break;
		case 'ccw':
			degsToAdd = angleDifference(this.heading, this.heading + this.yawRate * 3);
			break;
	}	
	this.heading += degsToAdd;
	if (this.heading > 359) {
		this.heading -= 359;
	}
	if (this.heading < 0) {
		this.heading += 359;
	}
};
	
Ship.prototype.boost = function() {
	this.speed = this.boostSpeed;	
};
	
Ship.prototype.setTarget = function(ship) {
	this.target = ship;
};
	
Ship.prototype.fireWeapons = function() {
	for (hardpoint in this.hardpoints) {
		if (this.hardpoints[hardpoint].loaded && this.hardpoints[hardpoint].weapon) {
			//this.hardpoints[hardpoint].weapon.fire();
		}
	}	
};
	
Ship.prototype.matchTargetVector = function(ship) {
	if (!ship) return;
	if (ship.speed > this.speed) this.increaseThrust();
	if (ship.speed < this.speed) this.decreaseThrust();
	if (ship.direction > this.direction) this.yaw('cw');
	if (ship.direction < this.direction) this.yaw('ccw');
};

Ship.prototype.calculateDrawOrigin = function() {
	return {
		x: this.player ? environment.viewport.cx : playerShip.cx - (environment.viewport.width / 2) + this.cx,
		y: this.player ? environment.viewport.cy : playerShip.cy - (environment.viewport.height / 2) + this.cy
	};
};
	
Ship.prototype.draw = function() {
	var origin = this.calculateDrawOrigin();
	environment.viewport.ctx.save();
	environment.viewport.ctx.translate(origin.x, origin.y);
	environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
	try {
	  environment.viewport.ctx.drawImage(this.sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
	} catch(e) {
	  environment.viewport.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
	environment.viewport.ctx.restore();
};

Ship.prototype.drawDebug = function() {
	var origin = this.calculateDrawOrigin();
	environment.viewport.ctx.save();	
	// draw momentum vector
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(origin.x, origin.y);
	environment.viewport.ctx.lineTo(origin.x + dir_x(this.speed, this.direction), origin.y + dir_y(this.speed, this.direction));
	environment.viewport.ctx.strokeStyle = "blue";
	environment.viewport.ctx.stroke();
	// draw direction marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(origin.x, origin.y);
	environment.viewport.ctx.lineTo(origin.x + dir_x(this.engageRadius * 0.1, this.direction), origin.y + dir_y(this.engageRadius * 0.1, this.direction));
	environment.viewport.ctx.strokeStyle = "orange";
	environment.viewport.ctx.stroke();
	// draw heading marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(origin.x, origin.y);
	environment.viewport.ctx.lineTo(origin.x + dir_x(this.engageRadius * 0.1, this.heading), origin.y + dir_y(this.engageRadius * 0.1, this.heading));
	environment.viewport.ctx.strokeStyle = "green";
	environment.viewport.ctx.stroke();
	// draw speed marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(origin.x, origin.y);
	environment.viewport.ctx.lineTo(origin.x - dir_x(this.speed, this.heading), origin.y - dir_y(this.speed, this.heading));
	environment.viewport.ctx.strokeStyle = "red";
	environment.viewport.ctx.stroke();
	// draw thrust marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(origin.x, origin.y);
	environment.viewport.ctx.lineTo(origin.x - dir_x(this.thrust, this.heading), origin.y - dir_y(this.thrust, this.heading));
	environment.viewport.ctx.strokeStyle = "yellow";
	environment.viewport.ctx.stroke();

	environment.viewport.ctx.restore();
}

/*
	SIDEWINDER
*/
class Sidewinder extends Ship {
	constructor(shipName, player, cx, cy) {
		super('Sidewinder', shipName, player, cx, cy);
		this.mass = 25;
		this.agility = 0.8;
		this.armour = 108;
		this.maxSpeed = 220;
		this.boostSpeed = 321;
		this.hardpoints = Defaults.Hardpoints.Sidewinder,
		this.width = 44;
		this.height = 30;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
	}
};

/*
	COBRA III
*/
class Cobra3 extends Ship {
	constructor(shipName, player, cx, cy) {
		super('Cobra3', shipName, player, cx, cy);
		this.mass = 180;
		this.agility = 0.6;
		this.armour = 216;
		this.maxSpeed = 282;
		this.boostSpeed = 402;
		this.hardpoints = Defaults.Hardpoints.Cobra['3'],
		this.width = 88;
		this.height = 54;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
	}
};

/*
	COBRA IV
*/
class Cobra4 extends Ship {
	constructor(shipName, player, cx, cy) {
		super('Cobra4', shipName, player, cx, cy);
		this.mass = 180;
		this.agility = 0.6;
		this.armour = 216;
		this.maxSpeed = 282;
		this.boostSpeed = 402;
		this.hardpoints = Defaults.Hardpoints.Cobra['4'],
		this.width = 96;
		this.height = 66;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
	}
};

/*
	PYTHON
*/
class Python extends Ship {
	constructor(shipName, player, cx, cy) {
		super('Python', shipName, player, cx, cy);
		this.mass = 350;
		this.agility = 0.6;
		this.armour = 468;
		this.maxSpeed = 234;
		this.boostSpeed = 305;
		this.hardpoints = Defaults.Hardpoints.Python,
		this.width = 116;
		this.height = 175;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
	}
}

var ShipTypes = {
	sidewinder: Sidewinder,
	cobra3: Cobra3,
	cobra4: Cobra4,
	python: Python
}

var ShipRoles = {
	trader: {
		roleName: 'Trader',
		initialState: 'neutral'
	},
	miner: {
		roleName: 'Miner',
		initialState: 'neutral'
	},
	bountyHunter: {
		roleName: 'Bounty Hunter',
		initialState: 'hunt'
	},
	security: {
		roleName: 'Security Service',
		initialState: 'neutral'
	},
	pirate: {
		roleName: 'Pirate',
		initialState: 'hunt'
	}
}

