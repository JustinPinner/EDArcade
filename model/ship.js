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
		this._role = this._player ? PilotRoles.PLAYER : role;
		this._fsm = this._player ? null : new FSM(this, this.role.initialState);
		this._status = this._role.initialStatus;
		this._contacts = [];
		this._attackers = [];
		this._currentTarget = null;
		this._scanner = new Scanner(this);
		this._shield = new Shield(this);
		this._armour = shipType.armour;
		this._hullIntegrity = 100;
		this._coordinates = new Point2d(
			this._player ? game.viewport.centre.x - (this._model.width / 2) : game.playerShip.coordinates.x + rand(game.maxSpawnDistanceX, true),
			this._player ? game.viewport.centre.y - (this._model.height / 2) : game.playerShip.coordinates.y + rand(game.maxSpawnDistanceY, true)	
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
	get attackers() {
		return this._attackers;
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
	get maximumScanRange() {
		return this.maximumWeaponRange * 10;
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
	set armour(val) {
		this._armour = val;
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
	if (game.keys.switchTarget) {
		this.selectClosestTarget();
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
	if (this === game.playerShip) {
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
		if (this.targets[n].echo === ship) {
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
		if (this.targets[t].echo === ship) {
			return true;
		}
	}
	return false;
}

Ship.prototype.selectClosestTarget = function() {
	for (var i = 0; i < this.attackers.length; i++) {
		if (distanceBetweenObjects(this, this.attackers[i].echo) <= this.maximumScanRange) {
			this.currentTarget = this.attackers[i];
			break;
		}	
	}
	if (!this.currentTarget) {
		for (var i = 0; i < this.targets.length; i++) {
			if (distanceBetweenObjects(this, this.targets[i].echo) <= this.maximumScanRange) {
				this.currentTarget = this.targets[i];
				break;
			}	
		}
	}
	if (!this.currentTarget) {
		for (var i = 0; i < this.threats.length; i++) {
			if (distanceBetweenObjects(this, this.threats[i].echo) <= this.maximumScanRange) {
				this.currentTarget = this.threats[i];
				break;
			}	
		}
	}
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
	
Ship.prototype.takeHit = function(source) {
	// what hit us?
	if (source instanceof Munition) {
		source.shooter.registerHit(this);
		for (var i = 0; i < this.contacts.length; i++) {
			if (this.contacts[i].echo === source.shooter) {
				let identified = false;
				for (j = 0; j < this.attackers.length; j++) {
					if(this.attackers[j].echo === source.shooter) {
						identified = true;
						break;
					}
				}
				if (!identified) {
					this.attackers.push(this.contacts[i]);
				}
			}
		}		
		if (this.fsm) {
			this.fsm.underAttack();
		}
		if (this._shield && this._shield.charge > 0) {
			this._shield.impact(source);
		} else if (this._armour && this._armour > 0) {
			this._armour -= source.strength;
		} else if (this._hullIntegrity && this._hullIntegrity > 0) {
			this._hullIntegrity -= source.strength;
		}
	}
	if (this._hullIntegrity <= 0) {
		if (this._player) {
			// nearly game over - detach the player and attach an FSM to handle the final moments
			this._player = null;
			this._fsm = new FSM(this, this._role.initialState);
		}
		this.fsm.transition(FSMState.EXPLODE);
	}
};

Ship.prototype.registerHit = function(obj) {
	if (obj.status !== PilotStatus.WANTED) {
		this._status = PilotStatus.WANTED;
	}
	if ((!this._currentTarget) || this._currentTarget.echo !== obj) {
		this._currentTarget = this.scanner.identify(obj);
	}
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
			pickup.source = this;
			const ttl = randInt(30);
			if (ttl > pickup.TTL) {
				pickup.TTL = ttl;
			}
			pickup.coordinates = this._hardpoints[hardpoint].coordinates;
			pickup.velocity = new Vector2d(rand(this._velocity.x * 0.8, true), rand(this._velocity.y * 0.8, true));
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

Ship.prototype.collectPowerUp = function(pickup) {
	pickup.payload.execute(this);
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
		const angle = angleBetween(this._coordinates.x, this._coordinates.y, ping.echo.centre.x, ping.echo.centre.y);
		const distance = distanceBetweenObjects(this, ping.echo);
		let threatType;
		threatType = ping.target || ping.echo.currentTarget && ping.echo.currentTarget.echo === this ? ThreatTypes.MEDIUM : ping.threat ? ThreatTypes.LOW : ThreatTypes.NONE;
		if (game.playerShip.currentTarget && game.playerShip.currentTarget.echo === ping.echo) {
			threatType = ThreatTypes.TARGET;
		}
		if (ping.echo.isOnScreen() && threatType !== ThreatTypes.NONE) {
			origin = ping.echo.drawOriginCentre;
			// draw threat ring
			game.viewport.context.moveTo(origin.x, origin.y);
			game.viewport.context.beginPath();
			game.viewport.context.strokeStyle = ThreatColour[threatType];
			game.viewport.context.arc(origin.x, origin.y, ping.echo.model.width, 0, Math.PI * 2, false);
			game.viewport.context.stroke();
		} else if (!ping.echo.isOnScreen()) {
			// show off-screen marker
			origin = this.drawOriginCentre;
			game.viewport.context.fillStyle = ThreatColour[threatType];
			game.viewport.context.font = '24px serif';
			const symbol = ThreatMarker[threatType];
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

const ThreatTypes = {
	NONE: 'NONE',
	LOW: 'LOW',
	MEDIUM: 'MEDIUM',
	TARGET: 'TARGET'
}

const ThreatColour = {
	NONE: 'gray',
	LOW: 'yellow',
	MEDIUM: 'orange',
	TARGET: 'red' 
}

const ThreatMarker = {
	NONE: '[]',
	LOW: '!',
	MEDIUM: 'X',
	TARGET: '0'
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
	const scanLimit = this.ship.maximumScanRange;	//todo - use a better scan limit
    for (var i = 0; i < nonMunitions.length; i++) {
   		const range = distanceBetweenObjects(this.ship, nonMunitions[i]);
   		if (nonMunitions[i] !== this.ship && range <= scanLimit) {
			let threat = false;				
			let target = false;
			if (this.ship.role) {
				threat = (nonMunitions[i].currentTarget && nonMunitions[i].currentTarget.echo === this.ship) || 
					(this.ship.role.threatStatus.filter(function(t) {
						return t == nonMunitions[i].status;
					}).length > 0 ? true : false);
				target = (this.ship.currentTarget && this.ship.currentTarget.echo === nonMunitions[i]) || 
					(nonMunitions[i].currentTarget && nonMunitions[i].currentTarget.echo === this.ship) || 
					(this.ship.role.targetStatus.filter(function(t) {
						return t == nonMunitions[i].status;
					}).length > 0 ? true : false);
			}
			const pickup = nonMunitions[i] instanceof Pickup;
			const ping = {
				echo: nonMunitions[i],
				threat: threat,
				target: target,
				pickup: pickup,
				range: range
			};
			this.ship.contacts.push(ping);
		}
	}    	
  	this.lastScan = Date.now();
  }
}

Scanner.prototype.identify = function(obj) {
	let match;
	for (i = 0; i < this.ship.contacts.length; i++) {
		if (this.ship.contacts[i].echo === obj) {
			match = this.ship.contacts[i];
			break;
		}
	}
	return match;
}

class Shield {
	constructor(ship) {
		this.ship = ship;
		this.charge = 100;
	}
}

Shield.prototype.impact = function(source) {
	const newCharge = this.charge - source.strength;
	this.charge = newCharge < 0 ? 0 : newCharge
}

