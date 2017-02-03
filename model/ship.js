// model/ship.js
var nextShipId = 0;

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
	}
}

// Generic ship constructor
var Ship = function(shipType, shipName, player, centreX, centreY) {
	var _shipType = ShipTypes[shipType];
	this.id = nextShipId += 1;
	this.shipType = _shipType.id;
	this.shipName = shipName ? shipName : _shipType.name;
	this.maxSpeed = _shipType.maxSpeed;
	this.boostSpeed = _shipType.boostSpeed;
	this.mass = _shipType.mass;
	this.agility = _shipType.agility;
	this.armour = _shipType.armour;
	this.hardpoints = _shipType.hardpoints;
	this.geometry = _shipType.geometry;
	this.player = player;
	this.rank = 0;
	this.sprite = _shipType.sprite;
	this.sprite.image = imageService.loadImage('../image/' + _shipType.id + '.png');
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
	this.position = {
		x: centreX - (this.geometry.width / 2),
		y: centreY - (this.geometry.height / 2),
	};
	this.position.global = {
		x: centreX - (this.geometry.width / 2),
		y: centreY - (this.geometry.height / 2),
	};
	this.centre = {
		x: this.position.x + (this.geometry.width / 2),
		y: this.position.y + (this.geometry.height / 2)
	}
	this.flightAssist = true;
	this.heading = this.player ? 270 : rand(359);
	this.thrust = 0;
	this.vector = {
		speed: 0,
		direction: this.heading
	};
	if (this.player) {
		this.player.ship = this;
	}
	this.targets = [];
	this.role = ShipRoles[Object.keys(ShipRoles)[Math.floor(rand(Object.keys(ShipRoles).length))]];
	this.fsm = this.player ? null : new FSM(this, this.role.initialState);
	this.maximumWeaponRange = function() {
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
	this.playerUpdate = function() {
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
	this.updateMomentum = function() {
		if (this.thrust != 0) {
			this.thrust > 0 ? this.accelerate() : this.decelerate();
		}
		//if (!this.flightAssist) return;
		var dA = angleDifference(this.heading, this.vector.direction);
		//if (Math.abs(this.thrust) != 0) {
		//	this.vector.direction += dA * (this.yawRate() * (1 / Math.abs(this.thrust)));	
		//} else {
			this.vector.direction += dA * this.yawRate();
		//}
		if (this.vector.direction > 359) {
			this.vector.direction -= 359;
		}
		if (this.vector.direction < 0) {
			this.vector.direction += 359;
		}
	};
	this.updatePosition = function() {
		if (this.vector.speed == 0) return;
		var moveX = dir_x(this.vector.speed * 0.025, this.vector.direction);
		var moveY = dir_y(this.vector.speed * 0.025, this.vector.direction);
		if (this.player) {
			var scrollData = {
				obj: this,
				moveX: moveX,
				moveY: moveY
			};
			environment.viewport.scroll(scrollData);
		}
		this.position.x -= moveX;
		this.position.y -= moveY;
	};
	this.npcUpdate = function () {
    this.fsm.execute();
	};
	this.updateAndDraw = function() {
		if (this.player) {
			this.playerUpdate();
			this.draw();
		} else {
			this.npcUpdate();
	    if (this.isOnScreen()) {
	    	this.draw();
	    }
    }
	}
	this.isOnScreen = function() {
		playerVisibleRegion = {
			x1: playerShip.centre.x - environment.viewport.width / 2,
			y1: playerShip.centre.y - environment.viewport.height / 2,
			x2: playerShip.centre.x + environment.viewport.width / 2,
			y2: playerShip.centre.y + environment.viewport.width / 2
		};
		return this.position.x > playerVisibleRegion.x1 && 
						this.position.y > playerVisibleRegion.y1 &&
						this.position.x < playerVisibleRegion.x2 &&
						this.position.y < playerVisibleRegion.y2;
	}
	this.isKnown = function(ship) {
		for (var n = 0; n < this.targets.length; n++) {
			if (this.targets[n] === ship) {
				return true;
			}
		}
		return false;
	};
	this.isTargetedBy = function(ship) {
		for (var n = 0; n < ship.targets.length; n++) {
			if (ship.targets[n] === this) {
				return true;
			}
		}
		return false;
	};
	this.selectClosestTarget = function() {
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
	this.isInFrontOf = function(ship) {
		var dA = angleBetween(this.centre.x, this.centre.y, ship.centre.x, ship.centre.y);
		return Math.abs(dA) >= 150;
	};
	this.isBehind = function(ship) {
		return !this.isInFrontOf(ship);
	};
	this.fire = function(weapon) {
		console.log(this.shipName + ':' + weapon + ' pewpew');
	};
	this.boost = function(topSpeed) {
		console.log('boosting to ' + topSpeed + 'm/s');
	};
	this.isHostile = function() {
		return this.player ? true : false;
	};
	this.engageRadius = function() {
		return this.geometry.height * 10;
	};
	this.accelerationRate = function() {
		return (this.agility / this.mass) * Math.abs(this.thrust) * 10;
	}
	this.yawRate = function() {
		return (this.agility * this.mass) / 100;
	};
	this.increaseThrust = function() {
		this.thrust += 2;
		if (this.thrust > 100) this.thrust = 100;	
		if (this.thrust > 0) this.accelerate();
	};
	this.decreaseThrust = function() {
		this.thrust -= 2;
		if (this.thrust < -100) this.thrust = -100;	
		if (this.thrust < 0) this.decelerate();
	};
	this.allStop = function() {
		this.thrust = 0;
	};
	this.accelerate = function() {	
		this.vector.speed += this.accelerationRate();
		if (this.vector.speed > this.maxSpeed) {
			this.vector.speed = this.maxSpeed;
		}
	};
	this.decelerate = function() {
		this.vector.speed -= this.accelerationRate();
		if (this.vector.speed < -this.maxSpeed) {
			this.vector.speed = -this.maxSpeed
		}
	};
	this.yaw = function(dir) {
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
	this.boost = function() {
		this.vector.speed = this.boostSpeed;	
	};
	this.setTarget = function(ship) {
		this.target = ship;
	};
	this.fireWeapons = function() {
		for (hardpoint in this.hardpoints) {
			if (this.hardpoints[hardpoint].loaded && this.hardpoints[hardpoint].weapon) {
				//this.hardpoints[hardpoint].weapon.fire();
			}
		}	
	};
	this.matchTargetVector = function(ship) {
		if (!ship) return;
		if (ship.vector.speed > this.vector.speed) this.increaseThrust();
		if (ship.vector.speed < this.vector.speed) this.decreaseThrust();
		if (ship.vector.direction > this.vector.direction) this.yaw('cw');
		if (ship.vector.direction < this.vector.direction) this.yaw('ccw');
	};
	this.draw = function() {
		var drawOffsetX = this.player ? environment.viewport.x : playerShip.position.x;
		var drawOffsetY = this.player ? environment.viewport.y : playerShip.position.y;
		environment.viewport.ctx.save();
		environment.viewport.ctx.translate(
		  this.centre.x - drawOffsetX, 
		  this.centre.y - drawOffsetY
		);
		environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
		try {
		  environment.viewport.ctx.drawImage(this.sprite.image, -this.geometry.width / 2, -this.geometry.height / 2, this.geometry.width, this.geometry.height);
		} catch(e) {
		  environment.viewport.ctx.restore();
		  environment.viewport.ctx.fillRect(this.position.x - drawOffsetX, this.position.y - drawOffsetY, this.geometry.width, this.geometry.height);
		}
		environment.viewport.ctx.restore();
		// draw momentum vector
		environment.viewport.ctx.beginPath();
		environment.viewport.ctx.moveTo(this.centre.x - drawOffsetX, this.centre.y - drawOffsetY);
		environment.viewport.ctx.lineTo((this.centre.x - drawOffsetX) + dir_x(this.engageRadius() * 0.1, this.vector.direction), (this.centre.y - drawOffsetY) + dir_y(this.engageRadius() * 0.1, this.vector.direction));
		environment.viewport.ctx.strokeStyle = "blue";
		environment.viewport.ctx.stroke();
		// draw heading marker
		environment.viewport.ctx.beginPath();
		environment.viewport.ctx.moveTo(this.centre.x - drawOffsetX, this.centre.y - drawOffsetY);
		environment.viewport.ctx.lineTo((this.centre.x - drawOffsetX) + dir_x(this.engageRadius() * 0.1, this.heading), (this.centre.y - drawOffsetY) + dir_y(this.engageRadius() * 0.1, this.heading));
		environment.viewport.ctx.strokeStyle = "green";
		environment.viewport.ctx.stroke();
		// draw speed marker
		environment.viewport.ctx.beginPath();
		environment.viewport.ctx.moveTo(this.centre.x - drawOffsetX, this.centre.y - drawOffsetY);
		environment.viewport.ctx.lineTo((this.centre.x - drawOffsetX) + dir_x(this.vector.speed, this.heading), (this.centre.y - drawOffsetY) + dir_y(this.vector.speed, this.heading));
		environment.viewport.ctx.strokeStyle = "red";
		environment.viewport.ctx.stroke();
		// draw thrust marker
		environment.viewport.ctx.beginPath();
		environment.viewport.ctx.moveTo(this.centre.x - drawOffsetX, this.centre.y - drawOffsetY);
		environment.viewport.ctx.lineTo((this.centre.x - drawOffsetX) + dir_x(this.thrust, this.heading), (this.centre.y - drawOffsetY) + dir_y(this.thrust, this.heading));
		environment.viewport.ctx.strokeStyle = "yellow";
		environment.viewport.ctx.stroke();
	};
};

