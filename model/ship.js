// model/ship.js

/*
	Generic ship constructor
*/
class Ship extends GameObject {
	constructor(shipType, shipName, role) {
		super('ship', shipName, player);
		this.shipName = shipName ? shipName : shipType + this.id;
		this.shipType = shipType;
		this.player = role instanceof Player ? role : null;
		this.flightAssist = this.player ? false : true;
		this.heading = this.player ? 270 : rand(359);
		this.thrust = 0;
		this.direction = this.heading;
		this.role = this.player ? ShipRoles['player'] : role;
		this.fsm = this.player ? null : new FSM(this, this.role.initialState);
		this.status = this.player ? 'clean' : this.role.initialStatus;
		this.hardpoints = [];
		this.contacts = [];
		this.currentTarget = null;
		this.scanner = new Scanner(this);
		this.sprite.image = imageService.loadImage('../image/' + this.shipType + '.png');
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
	get drawOriginCentre() {
		return {
			x: this.player ? environment.viewport.cx : this.cx + -environment.viewport.x,
			y: this.player ? environment.viewport.cy : this.cy + -environment.viewport.y
		};	
	}
	get drawOrigin() {
		var originCentre = this.drawOriginCentre;
		return {
			x: originCentre.x - (this.width / 2),
			y: originCentre.y - (this.height / 2)
		}
	}
	get threats() {
		var scannedThreats = this.contacts ? this.contacts.filter(function(ping){return ping.threat;}) : [];
		scannedThreats.sort(function(a, b) {
			if (a.range < b.range) {
				return -1;
			}
			if (a.range > b.range) {
				return 1;
			}
			return 0;
		});
		return scannedThreats; 
	}
	get targets() {
		var scannedTargets = this.contacts ? this.contacts.filter(function(ping){return ping.target;}) : [];
		scannedTargets.sort(function(a, b) {
			if (a.range < b.range) {
				return -1;
			}
			if (a.range > b.range) {
				return 1;
			}
			return 0;
		});
		return scannedTargets;
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
};

Ship.prototype.updateAndDraw = function(debug) {
	this.scanner.scan();
	if (this.player) {
		this.playerUpdate();
		this.draw(debug);
	} else {
		this.npcUpdate();
    if (this.isOnScreen(debug)) {
    	this.draw(debug);
    }
  }
};

Ship.prototype.npcUpdate = function () {
  if (this.fsm) {
	  this.updateMomentum();
		this.updatePosition();
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
	if (keyStop) {
		this.allStop();
	}
	if (this.thrust != 0) {
		this.updateMomentum();
	}
	this.updatePosition();
};

Ship.prototype.accelerate = function() {
	var rate = this.thrust * 0.01;
	var dx = dir_x(rate, this.heading);
	var dy = dir_y(rate, this.heading);	
	
	// speed limiter
	var apply_dx = true;
	var apply_dy = true;
	var maxLimit = this.maxSpeed / fps;
	var minLimit = maxLimit * -1;

	if (dx > 0 && this.vx > 0 && (this.vx + dx > maxLimit)) {
		apply_dx = false;
	}
	if (dx < 0 && this.vx < 0 && (this.vx + dx < minLimit)) {
		apply_dx = false;
	}
	if (dy > 0 && this.vy > 0 && (this.vy + dy > maxLimit)) {
		apply_dy = false;
	}
	if (dy < 0 && this.vy < 0 && (this.vy + dy < minLimit)) {
		apply_dy = false;
	}

	if (apply_dx) {
		this.vx += dx;
	}
	if (apply_dy) {
		this.vy += dy;
	}

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
	this.x += this.vx;
	this.y += this.vy;
	this.syncHardpoints();
};

Ship.prototype.isOnScreen = function(debug) {
	return environment.viewport.contains(
		this.x - (debug ? this.maximumWeaponRange : 0), 
		this.y - (debug ? this.maximumWeaponRange : 0), 
		this.width + (debug ? this.maximumWeaponRange : 0), 
		this.height + (debug ? this.maximumWeaponRange : 0)
	);
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
	for (var s = 0; s < gameObjects.length; s++) {
		for (var t = 0; t < gameObjects[s].targets.length; t++) {
			if (gameObjects[s].targets[t] === this) {
				return true;
			}
		}
	}
	return false;
};

Ship.prototype.isTargetting = function(ship) {
	for (var t = 0; t < this.targets.length; t++) {
		if (this.targets[t] === ship) {
			return true;
		}
	}
	return false;
}

Ship.prototype.identifyTargets = function() {
	for (var c = 0; c < this.contacts.length; c++) {
		if (this.role && this.contacts[c].ship.role) {
			this.contacts[c].target = this.role.opponents.filter(function(opp){
				return opp.roleName = this.contacts[c].ship.roleName;
			}).length > 0 ? true : false;
		}
	}
};

Ship.prototype.selectClosestTarget = function() {
	return this.targets.length > 0 ? this.targets[0] : null;
};

Ship.prototype.isInFrontOf = function(ship) {
	var dA = angleBetween(this.cx, this.cy, ship.cx, ship.cy);
	return Math.abs(dA) >= 150;
};
	
Ship.prototype.isBehind = function(ship) {
	return !this.isInFrontOf(ship);
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
	this.vx = 0;
	this.vy = 0;
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
			degsToAdd = angleDifference(this.heading, this.heading - (this.yawRate * 2));
			break;
		case 'ccw':
			degsToAdd = angleDifference(this.heading, this.heading + (this.yawRate * 2));
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
	
Ship.prototype.syncHardpoints = function() {
	var originCentre = this.drawOriginCentre;
	var origin = this.drawOrigin;

	for (hardpoint in this.hardpoints) {
		var hp = this.hardpoints[hardpoint], 
				x = origin.x + this.hardpointGeometry[hp.type][hp.sizeName][hp.index].x,
				y = origin.y + this.hardpointGeometry[hp.type][hp.sizeName][hp.index].y,
				rotated = rotatePoint(originCentre.x, originCentre.y, x, y, this.heading + 90);
		hp.x = rotated.x;
		hp.y = rotated.y;
	}
}

Ship.prototype.boost = function() {
	this.speed = this.boostSpeed;	
};
	
Ship.prototype.setTarget = function(ship) {
	this.target = ship;
};
	
Ship.prototype.fireWeapons = function() {
	for (hardpoint in this.hardpoints) {
		if (this.hardpoints[hardpoint].loaded && this.hardpoints[hardpoint].weapon) {
			this.hardpoints[hardpoint].weapon.fire(this);
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

Ship.prototype.draw = function(debug) {
	var origin = this.drawOriginCentre;
	environment.viewport.ctx.save();
	if (!this.player && (origin.x != this.x || origin.y != this.y)) {
		//debug here
	}
	environment.viewport.ctx.translate(origin.x, origin.y);
	environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
	try {
	  environment.viewport.ctx.drawImage(this.sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
	} catch(e) {
	  environment.viewport.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
	environment.viewport.ctx.restore();
	
	// draw centre mark
	environment.viewport.ctx.moveTo(origin.x, origin.y);
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.strokeStyle = 'blue';
	environment.viewport.ctx.arc(origin.x, origin.y, 2, 0, Math.PI * 2, false);
	environment.viewport.ctx.stroke();
  
  for (hardpoint in this.hardpoints) {
  	this.hardpoints[hardpoint].draw();
  }
  if (this.player && this.threats) {
  	this.drawHud();
  }
  if (debug) {
  	this.drawDebug();
  }

	

};

Ship.prototype.drawHud = function() {
	var origin = null;
	environment.viewport.ctx.save();	
	// draw threat pointers
	for (var t=0; t < this.threats.length; t++) {
		var threat = this.threats[t];
		var angle = angleBetween(this.cx, this.cy, threat.ship.cx, threat.ship.cy);
		var distance = distanceBetween(this, threat.ship);
		if (threat.ship.isOnScreen()) {
			origin = threat.ship.drawOriginCentre;
			// draw threat ring
			environment.viewport.ctx.moveTo(origin.x, origin.y);
			environment.viewport.ctx.beginPath();
			environment.viewport.ctx.strokeStyle = (this.currentTarget && this.currentTarget === threat.ship) ? 'red' : 'orange';
			environment.viewport.ctx.arc(origin.x, origin.y, threat.ship.width, 0, Math.PI * 2, false);
			environment.viewport.ctx.stroke();
		} else {
			// show off-screen threat marker
			origin = this.drawOriginCentre;
			environment.viewport.ctx.fillStyle =  (this.currentTarget && this.currentTarget === threat.ship) ? 'red' : 'orange';
			environment.viewport.ctx.font = '24px serif';
			var symbol_x = origin.x - dir_x(distance, angle);
			if (symbol_x < 0) symbol_x = 10;
			if (symbol_x > environment.viewport.width) symbol_x = environment.viewport.width - 10;

			var symbol_y = origin.y - dir_y(distance, angle);
			if (symbol_y < 0) symbol_y = 20;
			if (symbol_y > environment.viewport.height) symbol_y = environment.viewport.height - 10;
			
			environment.viewport.ctx.fillText('!', symbol_x, symbol_y);		
		}
	}
	environment.viewport.ctx.restore();
};

Ship.prototype.drawDebug = function() {
	var origin = this.drawOriginCentre;
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
	// draw weapon range ring
  environment.viewport.ctx.beginPath();
  environment.viewport.ctx.arc(origin.x, origin.y, this.maximumWeaponRange, 0, 2 * Math.PI, false);
  environment.viewport.ctx.lineWidth = 1;
  environment.viewport.ctx.strokeStyle = 'red';
  environment.viewport.ctx.stroke();

	environment.viewport.ctx.restore();
}

/*
	SIDEWINDER
*/
class Sidewinder extends Ship {
	constructor(shipName, role) {
		super('Sidewinder', shipName, role);
		this.mass = 25;
		this.agility = 0.8;
		this.armour = 108;
		this.maxSpeed = 220;
		this.boostSpeed = 321;
		this.width = 44;
		this.height = 30;
		this.coordinates = {
			x: role instanceof Player ? environment.viewport.cx - (this.width / 2) : rand(maxSpawnDistX, true),
			y: role instanceof Player ? environment.viewport.cy - (this.height / 2) : rand(maxSpawnDistY, true),
			z: null
		};
		this.sprite.width = this.width;
		this.sprite.height = this.height;
		this.hardpointGeometry = {
			weapon: {
				small: {
					1: {x: 17, y: 8, z: 1},
					2: {x: 26, y: 8, z: 1}				
				}
			},
			utility: {
				small: {
					1: {x: 8, y: 21, z: -1},
					2: {x: 35, y: 21,	z: -1}
				}
			}
		};
		Defaults.Hardpoints.Sidewinder.load(this);
	}
};

/*
	COBRA III
*/
class Cobra3 extends Ship {
	constructor(shipName, role) {
		super('Cobra3', shipName, role);
		this.mass = 180;
		this.agility = 0.6;
		this.armour = 216;
		this.maxSpeed = 282;
		this.boostSpeed = 402;
		this.width = 88;
		this.height = 54;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
		this.coordinates = {
			x: role instanceof Player ? environment.viewport.cx - (this.width / 2) : rand(maxSpawnDistX, true),
			y: role instanceof Player ? environment.viewport.cy - (this.height / 2) : rand(maxSpawnDistY, true),
			z: 1
		};
		this.hardpointGeometry = {
			weapon: {
				medium: {
					1: {x: 36, y: 7, z: 1},
					2: {x: 49, y: 7, z: 1}					
				},
				small: {
					1: {x: 32, y: 15, z: -1},
					2: {x: 55, y: 15, z: -1}				
				}
			},
			utility: {
				small: {
					1: {x: 17, y: 43, z: -1},
					2: {x: 70, y: 43, z: -1}
				}
			}
		};
		Defaults.Hardpoints.Cobra['3'].load(this);
	}
};

/*
	COBRA IV
*/
class Cobra4 extends Ship {
	constructor(shipName, role) {
		super('Cobra4', shipName, role);
		this.mass = 180;
		this.agility = 0.6;
		this.armour = 216;
		this.maxSpeed = 282;
		this.boostSpeed = 402;
		this.width = 96;
		this.height = 66;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
		this.coordinates = {
			x: role instanceof Player ? environment.viewport.cx - (this.width / 2) : rand(maxSpawnDistX, true),
			y: role instanceof Player ? environment.viewport.cy - (this.height / 2) : rand(maxSpawnDistY, true),
			z: null
		};
		this.hardpointGeometry = {
			weapon: {
				medium: {
					1: {x: 36, y: 7, z: 1},
					2: {x: 49, y: 7, z: 1}					
				},
				small: {
					1: {x: 32, y: 15, z: -1},
					2: {x: 55, y: 15, z: -1},
					3: {x: 44, y: 19, z: 1}				
				}
			},
			utility: {
				small: {
					1: {x: 17, y: 43, z: -1},
					2: {x: 70, y: 43, z: -1}
				}
			}
		};
		Defaults.Hardpoints.Cobra['4'].load(this);
	}
};

/*
	PYTHON
*/
class Python extends Ship {
	constructor(shipName, role) {
		super('Python', shipName, role);
		this.mass = 350;
		this.agility = 0.6;
		this.armour = 468;
		this.maxSpeed = 234;
		this.boostSpeed = 305;
		this.width = 116;
		this.height = 175;
		this.sprite.width = this.width;
		this.sprite.height = this.height;
		this.coordinates = {
			x: role instanceof Player ? environment.viewport.cx - (this.width / 2) : rand(maxSpawnDistX, true),
			y: role instanceof Player ? environment.viewport.cy - (this.height / 2) : rand(maxSpawnDistY, true),
			z: null
		};
		this.hardpointGeometry = {
			weapon: {
				large: { 
					1: {x: 56, y: 25,	z: -1},
					2: {x: 48, y: 86, z: -1},
					3: {x: 67, y: 86,	x: -1}
				},
				medium: {
					1: {x: 39, y: 81, z: 1},
					2: {x: 77, y: 81, z: 1}					
				},
				small: {
					1: {x: 44, y: 44, z: -1},
					2: {x: 71, y: 44, z: -1}				
				}
			},
			utility: {
				small: {
					1: {x: 17, y: 43, z: -1},
					2: {x: 70, y: 43, z: -1},
					3: {x: 17, y: 43, z: 1,},
					4: {x: 70, y: 43, z: 1}
				}
			}
		};
		Defaults.Hardpoints.Python.load(this);
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
		initialState: 'neutral',
		initialStatus: 'clean',
		threatStatus: ['wanted'],
		targetStatus: ['cargo']
	},
	miner: {
		roleName: 'Miner',
		initialState: 'neutral',
		initialStatus: 'clean',
		threatStatus: ['wanted'],
		targetStatus: ['mineral']
	},
	bountyHunter: {
		roleName: 'Bounty Hunter',
		initialState: 'hunt',
		initialStatus: 'vigilante',
		threatStatus: ['wanted'],
		targetStatus: ['wanted']
	},
	security: {
		roleName: 'Security Service',
		initialState: 'hunt',
		initialStatus: 'security',
		threatStatus: ['wanted'],
		targetStatus: ['wanted']
	},
	pirate: {
		roleName: 'Pirate',
		initialState: 'hunt',
		initialStatus: 'wanted',
		threatStatus: ['security', 'vigilante'],
		targetStatus: ['clean', 'wanted']
	},
	player: {
		// always last in the list
		roleName: 'Player',
		initialState: 'player',
		initialStatus: 'player',
		threatStatus: ['wanted'],
		targetStatus: []
	}
}

class Scanner {
	constructor(ship) {
		this.ship = ship;
		this.interval = 500;
	}
}

Scanner.prototype.scan = function() {
  if (!this.lastScan || Date.now() - this.lastScan >= this.interval){
    this.ship.contacts = [];
		var scanLimit = this.ship.maximumWeaponRange * 10;	//todo - use a better scan limit
    for (var j = 0; j < gameObjects.length; j++) {
   		var range = distanceBetween(this.ship, gameObjects[j]);
   		if (gameObjects[j] !== this.ship && range <= scanLimit) {
				var threat = false;				
				var target = false;
				if (this.ship.role) {
					threat = gameObjects[j].currentTarget === this.ship || this.ship.role.threatStatus.filter(function(t) {
						return t == gameObjects[j].status;
					}).length > 0 ? true : false;
					target = this.ship.role.targetStatus.filter(function(t) {
						return t == gameObjects[j].status;
					}).length > 0 ? true : false;
				}
      	var ping = {
      		ship: gameObjects[j],
      		threat: threat,
      		target: target,
      		range: range
      	};
      	this.ship.contacts.push(ping);
      }
		}    	
  	this.lastScan = Date.now();
  }
}

