/*
	Generic ship constructor
*/
class Ship extends GameObject {
	constructor(shipType, shipName, role) {
		super(GameObjectTypes.SHIP, shipType, shipName, role);
		this._player = role instanceof Player ? role : null;
		this._flightAssist = this._player ? false : true;
		this._heading = this._player ? 270 : rand(359);
		this._thrust = 0;
		this._direction = this._heading;
		this._role = this._player ? ShipRoles.PLAYER : role;
		this._fsm = this._player ? null : new FSM(this, this.role.initialState);
		this._status = this._role.initialStatus;
		this._contacts = [];
		this._currentTarget = null;
		this._scanner = new Scanner(this);
		this._shield = new Shield(this);
		this._armour = shipType.armour;
		this._hullIntegrity = 100;
		this._coordinates = new Point2d(
			this._player ? game.viewport.centre.x - (this._model.width / 2) : rand(game.maxSpawnDistanceX, true),
			this._player ? game.viewport.centre.y - (this._model.height / 2) : rand(game.maxSpawnDistanceY, true)	
		);		
		this._sprite = new Sprite(0, 0, shipType.width, shipType.height, shipType.name, shipType.cells);
		this._sprite.loadImage();		
		this._hardpoints = [];
		this._hardpointGeometry = shipType.hardpointGeometry;
		this.randomiseWeaponHardpoints = function(self) {
			for (const sizeGroup in this._hardpointGeometry[HardpointTypes.WEAPON]) {
				for (const slot in this._hardpointGeometry[HardpointTypes.WEAPON][sizeGroup]) {
					const loadSlot = randInt(100) > 32;
					if (loadSlot) {
						const i = Number(slot);
						const sz = Size[sizeGroup].value;
						const mnt = HardpointMountTypes[Object.keys(HardpointMountTypes)[Math.floor(rand(Object.keys(HardpointMountTypes).length))]];
						const wpn = WeaponTypes[Object.keys(WeaponTypes)[Math.floor(rand(Object.keys(WeaponTypes).length))]];
						const hpt = new WeaponHardpoint(self, sz, i, wpn, mnt, sz);
						self._hardpoints.push(hpt);
					}
				}
			}	    
		};
		if (this._player){
			this._model.loadHardpoints(this);
			this._player.ship = this;
		} else {
			this.randomiseWeaponHardpoints(this);
		}
	}
	/* Getters */
	get model() {
		return this._model;
	}
	get scanner() {
		return this._scanner;
	}
	get shield() {
		return this._shield;
	}
	get coordinates() {
		return this._coordinates;
	}
	get drawOriginCentre() {
		return new Point2d(
			this._player ? game.viewport.width / 2 : this.centre.x + -game.viewport.coordinates.x,
			this._player ? game.viewport.height / 2 : this.centre.y + -game.viewport.coordinates.y
		);	
	}
	get drawOrigin() {
		const originCentre = this.drawOriginCentre;
		return {
			x: originCentre.x - (this._model.width / 2),
			y: originCentre.y - (this._model.height / 2)
		}
	}
	get hardpointGeometry() {
		return this._hardpointGeometry;
	}
	get threats() {
		const scannedThreats = this._contacts ? this._contacts.filter(function(ping){return ping.threat;}) : [];
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
		const scannedTargets = this._contacts ? this._contacts.filter(function(ping){return ping.target;}) : [];
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
	get currentTarget() {
		return this._currentTarget;
	}
	get thrustVector() {
		return (this._heading + 180) - 360;
	}
	get engageRadius() {
		return this.maximumWeaponRange * 3;
	}
	get accelerationRate() {
		return (this._model.agility / this._model.mass) * Math.abs(this._thrust) * 10;
	}
	get yawRate() {
		return this._model.agility * 5.0;
	}
	get maximumWeaponRange() {
		var range = null;
		for (const w in this._hardpoints) {
			if (this._hardpoints[w].weapon && this._hardpoints[w].loaded) {
				if (range) {
					if (range > this._hardpoints[w].weapon.range) {
						range = this._hardpoints[w].weapon.range;
					}
				} else {
					range = this._hardpoints[w].weapon.range;
				}
			}
		}
		return range;
	}
	get role() {
		return this._role;
	}
	get heading() {
		return this._heading;
	}
	get status() {
		return this._status;
	}
	get armour() {
		return this._armour;
	}
	get hullIntegrity() {
		return this._hullIntegrity;
	}
	get contacts() {
		return this._contacts;
	}
	get fsm() {
		return this._fsm;
	}
	
	/* Setters */

	set contacts(pings) {
		this._contacts = pings;
	}
	set currentTarget(ping) {
		this._currentTarget = ping;
	}
};

Ship.prototype.updateAndDraw = function(debug) {
	this._scanner.scan();
	if (this._player) {
		this.playerUpdate();
		this.draw(debug);
	} else {
		this.npcUpdate();
		if (this.isOnScreen(debug)) {
			this.draw(debug);
		}
	}
	this.collisionDetect();
};

Ship.prototype.npcUpdate = function () {
	if (this._fsm) {
		this.updateMomentum();
		this.updatePosition();
		this._fsm.execute();
	}
};
	
Ship.prototype.playerUpdate = function() {
	if (game.keys.up) {
		this.increaseThrust();
	}
	if (game.keys.down) {
		this.decreaseThrust();
	}
	if (game.keys.left) {
		this.yaw('ccw');
	}
	if (game.keys.right) {
		this.yaw('cw');
	}
	if (game.keys.boost) {
		this.boost();
	}
	if (game.keys.fire) {
		this.fireWeapons();
	}
	if (game.keys.flightAssist) {
		this._flightAssist = !this._flightAssist;
	}
	if (game.keys.thrust) {
		this.thrustOn();
	} else {
		this.thrustOff();
	}
	if (game.keys.stop) {
		this.allStop();
	}
	if (this._thrust != 0) {
		this.updateMomentum();
	}
	this.updatePosition();
};

Ship.prototype.accelerate = function() {
	const rate = this._thrust / this._model.agility * 0.01;
	const dx = dir_x(rate, this._heading);
	const dy = dir_y(rate, this._heading);	
	
	// speed limiter
	var apply_dx = true;
	var apply_dy = true;
	const maxLimit = this._model.maxSpeed / fps;
	const minLimit = maxLimit * -1;

	if (dx > 0 && this._velocity.x > 0 && (this._velocity.x + dx > maxLimit)) {
		apply_dx = false;
	}
	if (dx < 0 && this._velocity.x < 0 && (this._velocity.x + dx < minLimit)) {
		apply_dx = false;
	}
	if (dy > 0 && this._velocity.y > 0 && (this._velocity.y + dy > maxLimit)) {
		apply_dy = false;
	}
	if (dy < 0 && this._velocity.y < 0 && (this._velocity.y + dy < minLimit)) {
		apply_dy = false;
	}

	if (apply_dx) {
		this._velocity.x += dx;
	}
	if (apply_dy) {
		this._velocity.y += dy;
	}
};

Ship.prototype.updateMomentum = function() {
	const dA = angleDifference(this._heading, this._direction);
	if (Math.abs(this._thrust) != 0) {
		this._direction += dA * this.yawRate * 0.1; //(this.yawRate * (1 / (this.thrust != 0 ? Math.abs(this.thrust) : 1)));	
	}
	if (this._direction > 359) {
		this._direction -= 359;
	}
	if (this._direction < 0) {
		this._direction += 359;
	}
};

Ship.prototype.updatePosition = function() {
	this._coordinates.x += this._velocity.x;
	this._coordinates.y += this._velocity.y;
	if (this._player) {
		if (game.midground.scrollData.anchor !== this) {
			game.midground.scrollData.anchor = this;
		}
		game.midground.scrollData.velocity.x = -this._velocity.x;
		game.midground.scrollData.velocity.y = -this._velocity.y;
		if (game.midground.scrollData.velocity.x !== 0 || game.midground.scrollData.velocity.y !== 0) {
			game.midground.scroll();
		}
		game.viewport.focus(this);
	}
};

Ship.prototype.isOnScreen = function(debug) {
	return game.viewport.contains(
		this._coordinates.x - (debug ? this.maximumWeaponRange : 0), 
		this._coordinates.y - (debug ? this.maximumWeaponRange : 0), 
		this._model.width + (debug ? this.maximumWeaponRange : 0), 
		this._model.height + (debug ? this.maximumWeaponRange : 0)
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
	for (var s = 0; s < game.objects.length; s++) {
		for (var t = 0; t < game.objects[s].targets.length; t++) {
			if (game.objects[s].targets[t] === this) {
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
	for (var c = 0; c < this._contacts.length; c++) {
		if (this._role && this._contacts[c].ship.role) {
			this._contacts[c].target = this._role.opponents.filter(function(opp){
				return opp.roleName = this._contacts[c].ship.roleName;
			}).length > 0 ? true : false;
		}
	}
};

Ship.prototype.selectClosestTarget = function() {
	return this._targets.length > 0 ? this._targets[0] : null;
};

Ship.prototype.isInFrontOf = function(ship) {
	const dA = angleBetween(this._coordinates.x, this._coordinates.y, ship.coordinates.x, ship.coordinates.y);
	return Math.abs(dA) >= 150;
};
	
Ship.prototype.isBehind = function(ship) {
	return !this.isInFrontOf(ship);
};

Ship.prototype.isHostile = function() {
	// TODO
	return this._player ? true : false;
};

Ship.prototype.thrustOn = function() {
	this._thrust = 100;
	this.accelerate();
};

Ship.prototype.thrustOff = function() {
	this._thrust = 0;
};

Ship.prototype.increaseThrust = function() {
	this._thrust += 2;
	if (this._thrust > 100) this._thrust = 100;	
	if (this._thrust > 0) this.accelerate();
};
	
Ship.prototype.decreaseThrust = function() {
	this._thrust -= 2;
	if (this._thrust < -100) this._thrust = -100;	
	if (this._thrust < 0) this.decelerate();
};
	
Ship.prototype.allStop = function() {
	this._thrust = 0;
	this._velocity.x = 0;
	this._velocity.y = 0;
};
	
Ship.prototype.npcAccelerate = function() {	
	this._speed += this.accelerationRate;
	if (this._speed > this._model.maxSpeed) {
		this._speed = this._model.maxSpeed;
	}
};
	
Ship.prototype.decelerate = function() {
	this._speed -= this.accelerationRate;
	if (this._speed < -this._model.maxSpeed) {
		this._speed = -this._model.maxSpeed;
	}
};
	
Ship.prototype.yaw = function(dir) {
	var degsToAdd = 0;
	switch (dir) {
		case 'cw':
			degsToAdd = angleDifference(this._heading, this._heading - this.yawRate);
			break;
		case 'ccw':
			degsToAdd = angleDifference(this._heading, this._heading + this.yawRate);
			break;
	}	
	this._heading += degsToAdd;
	if (this._heading > 359) {
		this._heading -= 359;
	}
	if (this._heading < 0) {
		this._heading += 359;
	}
};
	
Ship.prototype.boost = function() {
	this._speed = this._boostSpeed;	
};
	
Ship.prototype.setTarget = function(ship) {
	this._currentTarget = ship;
};
	
Ship.prototype.fireWeapons = function() {
	for (hardpoint in this._hardpoints) {
		if (this._hardpoints[hardpoint].loaded && this._hardpoints[hardpoint].weapon) {
			this._hardpoints[hardpoint].weapon.fire();
		}
	}	
};
	
Ship.prototype.takeDamage = function(source) {
	// what hit us?
	if (source instanceof Munition) {
		source.shooter.registerHit(this);
		if (this._shield && this._shield.charge > 0) {
			this._shield.impact(source);
		} else if (this._model.armour && this._model.armour > 0) {
			this._model.armour -= source.strength * 10;
		} else if (this._hullIntegrity && this._hullIntegrity > 0) {
			this._hullIntegrity -= source.strength * 10;
		}
	}
	if (this._hullIntegrity <= 0) {
		if (this._player) {
			// nearly game over - detach the player and attach an FSM to handle the final moments
			this._player = null;
			this._fsm = new FSM(this, this._role.initialState);
		}
		this._fsm.transition(FSMState.EXPLODING);
	}
};

Ship.prototype.registerHit = function(obj) {
	if (obj.status !== PilotStatus.WANTED) {
		this._status = PilotStatus.WANTED;
	}
	this._currentTarget = obj;
};

Ship.prototype.matchTargetVector = function(ship) {
	if (!ship) return;
	if (ship.speed > this._speed) this.increaseThrust();
	if (ship.speed < this._speed) this.decreaseThrust();
	if (ship.direction > this._direction) this.yaw('cw');
	if (ship.direction < this._direction) this.yaw('ccw');
};

Ship.prototype.dumpWeapons = function() {
	for (hardpoint in this._hardpoints) {
		if (this._hardpoints[hardpoint].loaded && this._hardpoints[hardpoint].weapon) {
			const pickup = new Pickup(this._hardpoints[hardpoint].weapon);
			pickup.coordinates = this._hardpoints[hardpoint].coordinates;
			pickup.velocity = new Vector2d(Math.random(this._velocity.x * 0.8), Math.random(this._velocity.y * 0.8));
			game.objects.push(pickup);
		}
	}		
}

Ship.prototype.collectWeapon = function(pickup) {
	const wpn = pickup.payload;
	for (hardpoint in this._hardpoints) {
		const hpt = this._hardpoints[hardpoint];
		if (hpt.type === HardpointTypes.WEAPON && 
			hpt.size >= wpn.size &&
			!hpt.loaded()) {
			wpn.parent = hpt;
			hpt.weapon = wpn;
			break;
		}
	}	
}

Ship.prototype.draw = function(debug) {
	if (!game.viewport || !game.viewport.context) {
		return;
	}
	const origin = this.drawOriginCentre;
	game.viewport.context.save();
	game.viewport.context.translate(origin.x, origin.y);
	game.viewport.context.rotate(degreesToRadians(this._heading + 90));
	try {
	  game.viewport.context.drawImage(this._sprite.image, -this._model.width / 2, -this._model.height / 2, this._model.width, this._model.height);
	} catch(e) {
	  game.viewport.context.fillRect(-this._model.width / 2, -this._model.height / 2, this._model.width, this._model.height);
	}
	game.viewport.context.restore();
	  
  if (this._player && this._contacts.length > 0) {
  	this.drawHud();
  }
  if (debug) {
  	this.drawDebug();
  }
};

Ship.prototype.drawHud = function() {
	if (!game.viewport || !game.viewport.context) {
		return;
	}
	var origin = null;
	game.viewport.context.save();	
	// draw threat pointers
	for (var i=0; i < this._contacts.length; i++) {
		const ping = this._contacts[i];
		const angle = angleBetween(this._coordinates.x, this._coordinates.y, ping.ship.centre.x, ping.ship.centre.y);
		const distance = distanceBetweenObjects(this, ping.ship);
		const threatLevel = ping.target || ping.ship.currentTarget && ping.ship.currentTarget === this ? 2 : ping.threat ? 1 : 0;
		if (ping.ship.isOnScreen() && threatLevel > 0) {
			origin = ping.ship.drawOriginCentre;
			// draw threat ring
			game.viewport.context.moveTo(origin.x, origin.y);
			game.viewport.context.beginPath();
			game.viewport.context.strokeStyle = threatLevel < 2 ? 'orange' : 'red';
			game.viewport.context.arc(origin.x, origin.y, ping.ship.model.width, 0, Math.PI * 2, false);
			game.viewport.context.stroke();
		} else if (!ping.ship.isOnScreen()) {
			// show off-screen marker
			origin = this.drawOriginCentre;
			game.viewport.context.fillStyle = threatLevel < 2 ? (threatLevel < 1 ? 'gray' : 'orange') : 'red';
			game.viewport.context.font = '24px serif';
			const symbol = threatLevel < 1 ? '[]' : '!';
			var symbol_x = origin.x - dir_x(distance, angle);
			if (symbol_x < 0) symbol_x = ScreenBorder.HORIZONTAL;
			if (symbol_x > game.viewport.width) symbol_x = game.viewport.width - ScreenBorder.HORIZONTAL;

			var symbol_y = origin.y - dir_y(distance, angle);
			if (symbol_y < 0) symbol_y = ScreenBorder.VERTICAL;
			if (symbol_y > game.viewport.height) symbol_y = game.viewport.height - ScreenBorder.VERTICAL;
			
			game.viewport.context.fillText(symbol, symbol_x, symbol_y);		
		}
	}
	game.viewport.context.restore();
};

Ship.prototype.drawDebug = function() {
	if (!game.viewport || !game.viewport.context) {
		return;
	}
	var origin = this.drawOriginCentre;
	game.viewport.context.save();	
	// draw centre mark
	game.viewport.context.moveTo(origin.x, origin.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = "blue";
	game.viewport.context.arc(origin.x, origin.y, 2, 0, Math.PI * 2, false);
	game.viewport.context.stroke();
	// draw momentum vector
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(origin.x, origin.y);
	game.viewport.context.lineTo(origin.x + dir_x(this.speed, this._direction), origin.y + dir_y(this.speed, this._direction));
	game.viewport.context.strokeStyle = "blue";
	game.viewport.context.stroke();
	// draw direction marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(origin.x, origin.y);
	game.viewport.context.lineTo(origin.x + dir_x(this.engageRadius * 0.1, this._direction), origin.y + dir_y(this.engageRadius * 0.1, this._direction));
	game.viewport.context.strokeStyle = "orange";
	game.viewport.context.stroke();
	// draw heading marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(origin.x, origin.y);
	game.viewport.context.lineTo(origin.x + dir_x(this.engageRadius * 0.1, this._heading), origin.y + dir_y(this.engageRadius * 0.1, this._heading));
	game.viewport.context.strokeStyle = "green";
	game.viewport.context.stroke();
	// draw speed marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(origin.x, origin.y);
	game.viewport.context.lineTo(origin.x - dir_x(this.speed, this._heading), origin.y - dir_y(this.speed, this.heading));
	game.viewport.context.strokeStyle = "red";
	game.viewport.context.stroke();
	// draw thrust marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(origin.x, origin.y);
	game.viewport.context.lineTo(origin.x - dir_x(this._thrust, this._heading), origin.y - dir_y(this._thrust, this._heading));
	game.viewport.context.strokeStyle = "yellow";
	game.viewport.context.stroke();
	// draw weapon range ring
	game.viewport.context.beginPath();
	game.viewport.context.arc(origin.x, origin.y, this.maximumWeaponRange, 0, 2 * Math.PI, false);
	game.viewport.context.lineWidth = 1;
	game.viewport.context.strokeStyle = "red";
	game.viewport.context.stroke();
	// draw collision centres
	for (const collCtrGrp in this.collisionCentres) {
		const collCtr = this.collisionCentres[collCtrGrp];
		game.viewport.context.beginPath();
		game.viewport.context.arc(collCtr.x, collCtr.y, collCtr.radius, 0, 2 * Math.PI, false);
		game.viewport.context.lineWidth = 1;
		game.viewport.context.strokeStyle = "yellow";
		game.viewport.context.stroke();
	}
	game.viewport.context.restore();

  for (var i = 0; i < this._hardpoints.length; i++) {
  	this._hardpoints[i].draw();
  }

}

const ShipTypes = {
	SIDEWINDER: SideWinder,
	COBRA3: Cobra3,
	COBRA4: Cobra4,
	PYTHON: Python,
	ANACONDA: Anaconda,
	TYPE6: Type6,
	VIPER3: Viper3
}

const PilotStatus = {
	CLEAN: 'clean',
	VIGILANTE: 'vigilante',
	SECURITY: 'security',
	WANTED: 'wanted'
}

const NonPilotStatus = {
	CARGO: 'cargo',
	MINERAL: 'mineral'
}

const ShipRoles = {
	TRADER: {
		roleName: 'Trader',
		initialState: FSMState.NEUTRAL,
		initialStatus: PilotStatus.CLEAN,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [NonPilotStatus.CARGO]
	},
	MINER: {
		roleName: 'Miner',
		initialState: FSMState.NEUTRAL,
		initialStatus: PilotStatus.CLEAN,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [NonPilotStatus.MINERAL]
	},
	BOUNTYHUNTER: {
		roleName: 'Bounty Hunter',
		initialState: FSMState.HUNT,
		initialStatus: PilotStatus.VIGILANTE,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [PilotStatus.WANTED]
	},
	SECURITY: {
		roleName: 'Security Service',
		initialState: FSMState.HUNT,
		initialStatus: PilotStatus.SECURITY,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [PilotStatus.WANTED]
	},
	PIRATE: {
		roleName: 'Pirate',
		initialState: FSMState.HUNT,
		initialStatus: PilotStatus.WANTED,
		threatStatus: [PilotStatus.SECURITY, PilotStatus.VIGILANTE],
		targetStatus: [PilotStatus.CLEAN, PilotStatus.WANTED]
	},
	PLAYER: {
		// always last in the list
		roleName: 'Player',
		initialState: FSMState.PLAYER,
		initialStatus: PilotStatus.CLEAN,
		threatStatus: [PilotStatus.WANTED],
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
  if (!this.lastScan || Date.now() - this.lastScan >= this.interval) {
    this.ship.contacts = [];
		const nonMunitions = game.objects.filter(function(obj)	{
			return !(obj instanceof Munition);
		});
		const scanLimit = this.ship.maximumWeaponRange * 10;	//todo - use a better scan limit
    for (var i = 0; i < nonMunitions.length; i++) {
   		const range = distanceBetweenObjects(this.ship, game.objects[i]);
   		if (game.objects[i] !== this.ship && range <= scanLimit) {
				var threat = false;				
				var target = false;
				if (this.ship.role) {
					threat = game.objects[i].currentTarget === this.ship || this.ship.role.threatStatus.filter(function(t) {
						return t == game.objects[i].status;
					}).length > 0 ? true : false;
					target = this.ship.role.targetStatus.filter(function(t) {
						return t == game.objects[i].status;
					}).length > 0 ? true : this.ship.currentTarget === game.objects[i] ? true : false;
				}
      	const ping = {
      		ship: game.objects[i],
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

class Shield {
	constructor(ship) {
		this.ship = ship;
		this.charge = 100;
	}
}

Shield.prototype.impact = function(source) {
	this.charge -= source.strength * 3;
}

