// model/ship.js
var nextShipId = 0;

/*
	Generic ship constructor
*/
class Ship {
	constructor(shipType, shipName, player, cx, cy) {
		this.id = nextShipId += 1;
		this.cx = cx;
		this.cy = cy;
		this.vx = 0;
		this.vy = 0;
		this.player = player;
		this.flightAssist = true;
		this.heading = this.player ? 270 : rand(359);
		this.thrust = 0;
		this.direction = this.heading;
		this.targets = [];
		this.role = this.player ? ShipRoles['Player'] : ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length))]];
		this.fsm = this.player ? null : new FSM(this, this.role.initialState);
		this.sprite = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			image: null
		};
	}
	get x() {
		return this.cx - (this.width / 2);
	}
	get y() {
		return this.cy - (this.height / 2);
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

Ship.prototype.maximumWeaponRange = function() {
	var range = null;
	for (w in this.hardpoints) {
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
	this.updateMomentum();
	this.updatePosition();
};
	
Ship.prototype.updateMomentum = function() {
	if (this.thrust != 0) {
		this.thrust > 0 ? this.accelerate() : this.decelerate();
	}
	//if (!this.flightAssist) return;
	var dA = angleDifference(this.heading, this.direction);
	//if (Math.abs(this.thrust) != 0) {
	//	this.vector.direction += dA * (this.yawRate() * (1 / Math.abs(this.thrust)));	
	//} else {
		this.direction += dA * this.yawRate();
	//}
	if (this.direction > 359) {
		this.direction -= 359;
	}
	if (this.direction < 0) {
		this.direction += 359;
	}
};

Ship.prototype.updatePosition = function() {
	if (this.speed == 0) return;
	var moveX = dir_x(this.speed * 0.025, this.direction);
	var moveY = dir_y(this.speed * 0.025, this.direction);
	if (this.player) {
		var scrollData = {
			obj: this,
			moveX: moveX,
			moveY: moveY
		};
		environment.viewport.scroll(scrollData);
	}
	this.x -= moveX;
	this.y -= moveY;
};

Ship.prototype.isOnScreen = function() {
	playerVisibleRegion = {
		x1: playerShip.cx - environment.viewport.width / 2,
		y1: playerShip.cy - environment.viewport.height / 2,
		x2: playerShip.cx + environment.viewport.width / 2,
		y2: playerShip.cy + environment.viewport.width / 2
	};
	return this.x > playerVisibleRegion.x1 && 
					this.y > playerVisibleRegion.y1 &&
					this.x < playerVisibleRegion.x2 &&
					this.y < playerVisibleRegion.y2;
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
			if (distanceBetween(this, this.targets[i]) < distanceBetween(this, closest)) {
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

Ship.prototype.boost = function(topSpeed) {
	console.log('boosting to ' + topSpeed + 'm/s');
};

Ship.prototype.isHostile = function() {
	// TODO
	return this.player ? true : false;
};

Ship.prototype.engageRadius = function() {
	return this.height * 10;
};

Ship.prototype.accelerationRate = function() {
	return (this.agility / this.mass) * Math.abs(this.thrust) * 10;
}

Ship.prototype.yawRate = function() {
	return (this.agility * this.mass) / 100;
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
	
Ship.prototype.accelerate = function() {	
	this.speed += this.accelerationRate();
	if (this.speed > this.maxSpeed) {
		this.speed = this.maxSpeed;
	}
};
	
Ship.prototype.decelerate = function() {
	this.speed -= this.accelerationRate();
	if (this.speed < -this.maxSpeed) {
		this.speed = -this.maxSpeed;
	}
};
	
Ship.prototype.yaw = function(dir) {
	var degsToAdd = 0;
	switch (dir) {
		case 'cw':
			degsToAdd = angleDifference(this.heading, this.heading - this.yawRate());
			break;
		case 'ccw':
			degsToAdd = angleDifference(this.heading, this.heading + this.yawRate());
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
	this.vector.speed = this.boostSpeed;	
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
	
Ship.prototype.draw = function() {
	var drawOffsetX = this.player ? environment.viewport.x : playerShip.x;
	var drawOffsetY = this.player ? environment.viewport.y : playerShip.y;
	environment.viewport.ctx.save();
	environment.viewport.ctx.translate(
	  this.cx - drawOffsetX, 
	  this.cy - drawOffsetY
	);
	environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
	try {
	  environment.viewport.ctx.drawImage(this.sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
	} catch(e) {
	  environment.viewport.ctx.restore();
	  environment.viewport.ctx.fillRect(this.x - drawOffsetX, this.y - drawOffsetY, this.width, this.height);
	}
	environment.viewport.ctx.restore();
};

Ship.prototype.drawDebug = function() {
	var drawOffsetX = this.player ? environment.viewport.x : playerShip.x;
	var drawOffsetY = this.player ? environment.viewport.y : playerShip.y;

	environment.viewport.ctx.save();
	
	// draw momentum vector
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(this.cx - drawOffsetX, this.cy - drawOffsetY);
	environment.viewport.ctx.lineTo((this.cx - drawOffsetX) + dir_x(this.engageRadius() * 0.1, this.direction), (this.cy - drawOffsetY) + dir_y(this.engageRadius() * 0.1, this.direction));
	environment.viewport.ctx.strokeStyle = "blue";
	environment.viewport.ctx.stroke();
	// draw heading marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(this.cx - drawOffsetX, this.cy - drawOffsetY);
	environment.viewport.ctx.lineTo((this.cx - drawOffsetX) + dir_x(this.engageRadius() * 0.1, this.heading), (this.cy - drawOffsetY) + dir_y(this.engageRadius() * 0.1, this.heading));
	environment.viewport.ctx.strokeStyle = "green";
	environment.viewport.ctx.stroke();
	// draw speed marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(this.cx - drawOffsetX, this.cy - drawOffsetY);
	environment.viewport.ctx.lineTo((this.cx - drawOffsetX) + dir_x(this.speed, this.heading), (this.cy - drawOffsetY) + dir_y(this.speed, this.heading));
	environment.viewport.ctx.strokeStyle = "red";
	environment.viewport.ctx.stroke();
	// draw thrust marker
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(this.cx - drawOffsetX, this.cy - drawOffsetY);
	environment.viewport.ctx.lineTo((this.cx - drawOffsetX) + dir_x(this.thrust, this.heading), (this.cy - drawOffsetY) + dir_y(this.thrust, this.heading));
	environment.viewport.ctx.strokeStyle = "yellow";
	environment.viewport.ctx.stroke();

	environment.viewport.ctx.restore();
}

/*
	SIDEWINDER
*/
var Sidewinder = function(shipName, player, cx, cy) {
	Ship.call(this);
	this.shipName = shipName ? shipName : 'Sidewinder';
	this.maxSpeed = 220;
	this.boostSpeed = 321;
	this.mass = 25;
	this.agility = 0.8;
	this.armour = 108;
	this.hardpoints = Defaults.Hardpoints.Sidewinder;
	this.width = 44;
	this.height = 30;
	this.player = player;
	this.rank = 0;
	this.sprite = {
			x: 0,
			y: 0,
			width: 44,
			height: 30,
			image: null		
	};
};
Sidewinder.prototype = Object.create(Ship.prototype);

/*
	COBRA III
*/
class Cobra3 extends Ship {
	constructor(shipName, player, cx, cy) {
		super('Cobra3', shipName, player, cx, cy);
		this.shipName = shipName ? shipName : 'Cobra MkIII';
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
		this.sprite.image = imageService.loadImage('../image/' + this.shipType + '.png');
	}
};

var ShipTypes = {
	Sidewinder: {
		id: 'Sidewinder',
		name: 'Sidewinder',
		mass: 25,
		agility: 0.8,
		armour: 108,
		maxSpeed: 220,
		boostSpeed: 321,
		hardpoints: Defaults.Hardpoints.Sidewinder,
		geometry: {
			width: 44,
			height: 30
		},
		sprite: {
			x: 0,
			y: 0,
			width: 44,
			height: 30,
			image: null
		},
		cellAnims: {
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
		}
	},
	Cobra3: {
		id: 'Cobra3',
		name: 'Cobra MkIII',
		mass: 180,
		agility: 0.6,
		armour: 216,
		maxSpeed: 282,
		boostSpeed: 402,
		hardpoints: Defaults.Hardpoints.Cobra['3'],
		geometry: {
			width: 88,
			height: 54
		},
		sprite: {
			x: 0,
			y: 0,
			width: 88,
			height: 54,
			image: null
		}
	},
	Cobra4: {
		id: 'Cobra4',
		name: 'Cobra MkIV',
		mass: 180,
		agility: 0.6,
		armour: 216,
		maxSpeed: 282,
		boostSpeed: 402,
		hardpoints: Defaults.Hardpoints.Cobra['4'],
		geometry: {
			width: 96,
			height: 66
		},
		sprite: {
			x: 0,
			y: 0,
			width: 966,
			height: 690,
			image: null
		}
	},
	Python: {
		id: 'Python',
		name: 'Python',
		mass: 350,
		agility: 0.6,
		armour: 468,
		maxSpeed: 234,
		boostSpeed: 305,
		hardpoints: Defaults.Hardpoints.Python,
		geometry: {
			width: 116,
			height: 175
		},
		sprite: {
			x: 0,
			y: 0,
			width: 116,
			height: 175,
			image: null
		}  
	}
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
	},
	player: {
		roleName: 'Player',
		initialState: null
	}
}

