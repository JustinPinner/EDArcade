/*
	Generic ship constructor
*/
class Ship extends GameObject {
	constructor(model, isPlayer) {
		super(GameObjectTypes.SHIP, model);
		this._isPlayer = isPlayer;
		this._role = null;
		this._flightAssist = isPlayer ? false : true;
		this._heading = isPlayer ? 270 : rand(359);
		this._thrust = 0;
		this._direction = this._heading;
		this._fsm = null;
		this._status = null;
		this._contacts = [];
		this._attackers = [];
		this._currentTarget = null;
		this._scanner = new Scanner(this);
		this._shield = new Shield(this);
		this._armour = model.armour;
		this._hullIntegrity = 100;
		this._hardpoints = [];
		this._vertices = [];
		this._sprite = null;
		this._thrusters = [];
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
	get isLocalPlayerShip() {
		return this === game.localPlayer.ship;
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
		return this._model.agility * 6.0;
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
	get thrust() {
		return this._thrust;
	}
	get player() {
		return this._player;
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
	set player(player) {
		this._player = player;
	}
};

Ship.prototype.loadHardpoints = function() {
	if (!this._model || !this._model.hardpointGeometry) {
		game.log(new LoggedEvent('ship.prototype.randomiseWeaponHardpoints', 'called when no _model or _model.hardpointGeometry'));
		return;
	}
	if (this._isPlayer){
		this._model.loadHardpoints(this);
		return;
	}
	// randomise weapon loadout
	for (const sizeGroup in this._model.hardpointGeometry[HardpointTypes.WEAPON]) {
		for (const slot in this._model.hardpointGeometry[HardpointTypes.WEAPON][sizeGroup]) {
			const loadSlot = randInt(100) > 32;
			if (loadSlot) {
				const i = Number(slot);
				const sz = Size[sizeGroup].value;
				const mnt = HardpointMountTypes[Object.keys(HardpointMountTypes)[Math.floor(rand(Object.keys(HardpointMountTypes).length))]];
				const wpn = WeaponTypes[Object.keys(WeaponTypes)[Math.floor(rand(Object.keys(WeaponTypes).length))]];
				const hpt = new WeaponHardpoint(this, sz, i, wpn, mnt, sz);
				this._hardpoints.push(hpt);
			}
		}
	}	    
};

Ship.prototype.loadThrusters = function() {
	if (!this._model || !this._model.thrusters) {
		game.log(new LoggedEvent('ship.prototype.loadThrusters', 'called when no _model or _model.thrusters'));
		return;
	}
	this._thrusters = [];
	for (const thrusterGroup in this._model.thrusters) {
		for (const thruster in this._model.thrusters[thrusterGroup]) {
			const thrusterData = {
				orientation: thrusterGroup,
				coordinates: new Point2d(
					this._model.thrusters[thrusterGroup][thruster].x, 
					this._model.thrusters[thrusterGroup][thruster].y
				)
			};
			this._thrusters.push(new Thruster(this, thrusterData));
		}		
	}			
}

Ship.prototype.loadFiniteStateMachine = function () {
	if (this._isPlayer) {
		// no FSM for player!
		return;
	}
	if (!this._isPlayer && (!this._role || !this._role.initialState)) {
		game.log(new LoggedEvent('ship.prototype.loadFiniteStateMachine', 'called for NPC with no _role or _role.initialState'))
		return;
	}
	this._fsm = new FSM(this, this._role.initialState);
}

Ship.prototype.init = function() {
	this._coordinates.centre = new Coordinate3d(
		x = this._player ? 0 : game.localPlayer.ship.coordinates.centre.x + rand(game.maxSpawnDistanceX, true),
		y = this._player ? 0 : game.localPlayer.ship.coordinates.centre.y + rand(game.maxSpawnDistanceY, true),	
		z = 0
	);
	this.loadVertices();
	this.loadCollisionCentres();
	this.loadHardpoints();
	this.loadThrusters();
	this.reScale();
	this._coordinates.origin = new Coordinate3d(
		x = this._coordinates.centre.x - this._width / 2,
		y = this._coordinates.centre.y - this._height / 2,
		z = this._coordinates.centre.z
	);
	this.rotate();
	this._role = this._isPlayer ? 
		PilotRoles['PLAYER'] : 
		PilotRoles[Object.keys(PilotRoles)[Math.floor(rand(Object.keys(PilotRoles).length - 1))]];
	this.loadStatus();
	this.loadFiniteStateMachine();
	this._ready = true;
}

Ship.prototype.ascend = function() {
	if (!this._ready || !this._model || !this._model.scale || this._coordinates.z > 0) {
		return;
	}
	this._model.scale.x *= 1.5;
	this._model.scale.y *= 1.5;
	this._coordinates.z += 1;
	this.reScale();
}

Ship.prototype.descend = function() {
	if (!this._ready || !this._model || !this._model.scale || this._coordinates.z < 0) {
		return;
	}
	this._model.scale.x = this._model.scale.x / 1.5;
	this._model.scale.y = this._model.scale.y / 1.5;
	this._coordinates.z -= 1;
	this.reScale();
}

Ship.prototype.reScale = function(x,y) {
	if (!this._model.scale) {
		return;
	}
	const startCentre = new Point2d(this._coordinates.centre.x, this._coordinates.centre.y);
	const startWidth = this._width;
	const startHeight = this._height;
	this._model.scale.x = x || this._model.scale.x || 1;
	this._model.scale.y = y || this._model.scale.y || 1;
	this._width = this.scaleWidth(this._model.width);
	this._height = this.scaleHeight(this._model.height);	
	// scale vertices
	this._vertices = [];
	for (let v = 0; v < this._model.vertices.length; v += 1) {
		const vertex = this._model.vertices[v];
		const scaled = {
			connectsTo: vertex.connectsTo,
			id: vertex.id,
			x: this.scaleWidth(vertex.x),
			y: this.scaleHeight(vertex.y)
		};
		this.vertices.push(scaled);
	}
	// scale collision centres
	this._collisionCentres = [];
	for (const collCtrGrp in this._model.collisionCentres) {
		const collCtr = this._model.collisionCentres[collCtrGrp];
		const scaled = {
			x: this.scaleWidth(collCtr.x),
			y: this.scaleHeight(collCtr.y),
			radius: this.scaleWidth(collCtr.radius)
		};
		this._collisionCentres.push(scaled);
	}
	// scale hardpoints
	for (let h = 0; h < this._hardpoints.length; h += 1) {
		this._hardpoints[h].reScale();
	}
	// scale thrusters
	for (let t = 0; t < this._thrusters.length; t += 1) {
		this._thrusters[t].reScale();
	}
	// reset origin
	this._coordinates.origin = new Point3d(
		this._coordinates.centre.x - this._width / 2,
		this._coordinates.centre.y - this._height / 2
	);
	this.rotate();
} 

Ship.prototype.rotate = function(degrees) {
	// rotate vertices
	const startTime = new Date().getTime();
	const centreRef = new Point2d(this._width / 2, this._height / 2);
	for (v in this._vertices) {
		//const vertex = this._vertices[v];
		const rotated = rotatePoint(
			centreRef.x,
			centreRef.y,
			this._vertices[v].x,
			this._vertices[v].y,
			degrees || this._heading + 90 
		);
		this._vertices[v].x = rotated.x;
		this._vertices[v].y = rotated.y;
	}	
	for (c in this._collisionCentres) {
		//const ctr = this._collisionCentres[c];
		const rotated = rotatePoint(
			centreRef.x,
			centreRef.y,
			this._collisionCentres[c].x,
			this._collisionCentres[c].y,
			degrees || this._heading + 90
		);
		this._collisionCentres[c].x = rotated.x;
		this._collisionCentres[c].y = rotated.y;
	}
	const endTime = new Date().getTime();
	game.log(new LoggedEvent('ship.prototype.rotate', `duration: ${endTime - startTime}ms`));
}

Ship.prototype.updateAndDraw = function(debug) {
	if (this.disposable) return;
	this._scanner.scan();
	if (this._thrust !== 0) {
		if (this.isOnScreen(debug)) {
			for (let t = 0; t < this._thrusters.length; t++) {
				if (this._thrusters[t].orientation == (this._thrust < 0 ? ORIENTATION.fore : ORIENTATION.aft)) {
					this._thrusters[t].thrust();
				}
			}		
		}
		this.accelerate();
	}
	this._player ? this.playerUpdate() : this.npcUpdate();

	this.draw(debug);

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
	if (game.gamepad) {
		const status = game.gamepad.status;
		const buttons = game.gamepad.buttons;
		const sticks = game.gamepad.sticks;
		const triggers = game.gamepad.triggers;
		if (buttons.start) {
			debugger;
		}
		if (triggers.right) {
			this.fireWeapons();
		}
		if (sticks.left.up) {
			//this.increaseThrust();
		}
		if (sticks.left.down) {
			//this.decreaseThrust();
		}
		if (sticks.left.left) {
			this.yaw('ccw');
		}
		if (sticks.left.right) {
			this.yaw('cw');
		}
		if (buttons.b) {
			this.boost();
		}
		if (buttons.y) {
			this.selectClosestTarget();
		}
		if (buttons.a) {
			this.increaseThrust();
		} else if (buttons.x) {
			this.decreaseThrust();
		} else {
			this.thrustOff();
		}
	}
	
	if (game.touch) {
		if (game.touchHandler.buttons['thrustButton'].touched) {
			this.increaseThrust();
		} else {
			this.thrustOff();
		}
		if (game.touchHandler.buttons['leftButton'].touched) {
			this.yaw('ccw');
		}
		if (game.touchHandler.buttons['rightButton'].touched) {
			this.yaw('cw');
		}
		if (game.touchHandler.buttons['fireButton'].touched) {
			this.fireWeapons();
		}
	}

	if (!game.gamepad && !game.touch) {
		if (game.keys.up) {
			this.increaseThrust();
		} else if (game.keys.down) {
			this.decreaseThrust();
		} else {
			this.thrustOff();
		}
		if (game.keys.ascend) {
			this.ascend();
		}
		if (game.keys.descend) {
			this.descend();
		}
	}
	
	if (!game.touch) {
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
			this.increaseThrust();
		}
		if (game.keys.stop) {
			this.allStop();
		}
		if (this._thrust != 0) {
			this.updateMomentum();
		}
	}

	this.updatePosition();
};

Ship.prototype.accelerate = function() {
	// a=F/m
	if (!this._player && practiceMode) return;
	const maxPower = 2 * this._model.mass; // TODO: use ship- & thruster-specific values
	const a = (this._thrust * (maxPower / 100)) / this._model.mass;
	const xComp = dir_x(a, this.thrustVector);
	const yComp = dir_y(a, this.thrustVector);
	const accVec = new Vector2d(-xComp, -yComp);
	const newVel = this._velocity.clone();
	newVel.add(accVec);
	// limit acceleration
	if (newVel.length > this._model.maxSpeed / 100) {
		accVec.scale(0.3);
	}
	this._velocity.add(accVec);
};

Ship.prototype.updateMomentum = function() {
	const dA = angleDifference(this._heading, this._direction);
	if (this._thrust !== 0) {
		this._direction += dA * this.yawRate * 0.1;
	}
	if (this._direction > 359) {
		this._direction -= 359;
	}
	if (this._direction < 0) {
		this._direction += 359;
	}
};

Ship.prototype.updatePosition = function() {	
	this._coordinates.centre.x += this._velocity.x;
	this._coordinates.origin.x += this._velocity.x;
	this._coordinates.centre.y += this._velocity.y;
	this._coordinates.origin.y += this._velocity.y;
	
	if (this === game.localPlayer.ship) {
		if (game.midground.scrollData.anchor !== this) {
			game.midground.scrollData.anchor = this;
		}
		game.midground.scrollData.velocity.x = -this._velocity.x;
		game.midground.scrollData.velocity.y = -this._velocity.y;
		if (game.midground.scrollData.velocity.x !== 0 || game.midground.scrollData.velocity.y !== 0) {
			game.midground.scroll();
		}
		// if (game.viewport.focussedObject !== this) {
		// 	game.viewport.focus(this);
		// }
	}
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
	this._thrust = 50;
};

Ship.prototype.thrustOff = function() {
	this._thrust = 0;
};

Ship.prototype.increaseThrust = function() {
	this._thrust += 4;
	if (this._thrust > 100) this._thrust = 100;	
};
	
Ship.prototype.decreaseThrust = function() {
	this._thrust -= 4;
	if (this._thrust < -100) this._thrust = -100;
};
	
Ship.prototype.allStop = function() {
	this._thrust = 0;
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
	this.rotate(degsToAdd);
};
	
Ship.prototype.boost = function() {
	const maxBoost = 80;
	this._thrust = Math.max(maxBoost, Math.min(this._thrust * 1.3, maxBoost));	
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
		if (this._fsm) {
			this._fsm.underAttack();
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
		this._fsm.transition(FSMState.EXPLODE);
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
	if(!this._ready || !game.viewport || !game.viewport.context || !this.isOnScreen) {
		return;
	}
	game.viewport.context.save();
	if (this._vertices && this._vertices.length > 0) {
		this.drawWithVertices();
	} else {
		game.viewport.context.translate(
			drawOrigin.x, 
			drawOrigin.y
		);
		game.viewport.context.rotate(degreesToRadians(this._heading + 90));	
		try {
			game.viewport.context.drawImage(this._sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
		} catch(e) {
			game.viewport.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
		}		
	}
	game.viewport.context.restore();
	if (game.viewport.focussedObject === this && this._contacts.length > 0) {
		this.drawHud();
	}
	if (debug) {
		this.drawDebug();
	}
};

Ship.prototype.drawWithVertices = function() {
	const drawOrigin = game.viewport.drawOrigin(this);
	game.viewport.context.moveTo(drawOrigin.x, drawOrigin.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = "white";
	for (v0 = 0; v0 < this._vertices.length; v0++) {
		const connects = this._vertices[v0].connectsTo;
		const vertex = this._vertices[v0];
		game.viewport.context.moveTo(
			drawOrigin.x + vertex.x, //(vertex.x - this.width / 2), 
			drawOrigin.y + vertex.y //(vertex.y - this.height / 2)
		);
		for (v1 = 0; v1 < connects.length; v1 += 1) {
			const dest = this._vertices[connects[v1]];
			game.viewport.context.lineTo(
				drawOrigin.x + dest.x, //(dest.x - this.width / 2), 
				drawOrigin.y + dest.y //(dest.y - this.height / 2)
			);
			game.viewport.context.moveTo(
				drawOrigin.x + vertex.x, //(vertex.x - this.width / 2), 
				drawOrigin.y + vertex.y //(vertex.y - this.height / 2)
			);
		}
	}
	game.viewport.context.stroke();
};

Ship.prototype.drawHud = function() {
	if (!game.viewport || !game.viewport.context) {
		return;
	}
	let origin;
	game.viewport.context.save();	
	// draw threat pointers
	for (var i=0; i < this._contacts.length; i++) {
		const ping = this._contacts[i];
		const angle = angleBetween(
			this._coordinates.x + this.centre.x, 
			this._coordinates.y + this.centre.y, 
			ping.echo.coordinates.x + ping.echo.centre.x, 
			ping.echo.coordinates.y + ping.echo.centre.y
		);
		const distance = distanceBetweenObjects(this, ping.echo);
		let threatType = ping.target || ping.echo.currentTarget && ping.echo.currentTarget.echo === this ? ThreatTypes.MEDIUM : ping.threat ? ThreatTypes.LOW : ThreatTypes.NONE;
		if (game.localPlayer.ship.currentTarget && game.localPlayer.ship.currentTarget.echo === ping.echo) {
			threatType = ThreatTypes.TARGET;
		}
		if (ping.echo.isOnScreen() && threatType !== ThreatTypes.NONE) {
			origin = ping.echo.drawOriginCentre;
			// draw threat ring
			game.viewport.context.moveTo(origin.x, origin.y);
			game.viewport.context.beginPath();
			game.viewport.context.strokeStyle = ThreatColour[threatType];
			game.viewport.context.arc(origin.x, origin.y, ping.echo.width, 0, Math.PI * 2, false);
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
	const drawCentre = game.viewport.drawCentre(this);
	const drawOrigin = rotatePoint(drawCentre.x, drawCentre.y, game.viewport.drawOrigin(this).x, game.viewport.drawOrigin(this).y, this._heading + 90);
	game.viewport.context.save();	
	// origin mark
	game.viewport.context.moveTo(drawOrigin.x, drawOrigin.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = "white";
	game.viewport.context.arc(drawOrigin.x, drawOrigin.y, 2, 0, Math.PI * 2, false);
	game.viewport.context.stroke();		
	// centre mark
	game.viewport.context.moveTo(drawCentre.x, drawCentre.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = "white";
	game.viewport.context.arc(drawCentre.x, drawCentre.y, 2, 0, Math.PI * 2, false);
	game.viewport.context.stroke();
	// momentum vector
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(drawCentre.x, drawCentre.y);
	game.viewport.context.lineTo(drawCentre.x + dir_x(this.speed, this._direction), drawCentre.y + dir_y(this.speed, this._direction));
	game.viewport.context.strokeStyle = "blue";
	game.viewport.context.stroke();
	// direction marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(drawCentre.x, drawCentre.y);
	game.viewport.context.lineTo(drawCentre.x + dir_x(this.engageRadius * 0.1, this._direction), drawCentre.y + dir_y(this.engageRadius * 0.1, this._direction));
	game.viewport.context.strokeStyle = "orange";
	game.viewport.context.stroke();
	// heading marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(drawCentre.x, drawCentre.y);
	game.viewport.context.lineTo(drawCentre.x + dir_x(this.engageRadius * 0.1, this._heading), drawCentre.y + dir_y(this.engageRadius * 0.1, this._heading));
	game.viewport.context.strokeStyle = "green";
	game.viewport.context.stroke();
	// draw speed marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(drawCentre.x, drawCentre.y);
	game.viewport.context.lineTo(drawCentre.x - dir_x(this.speed, this._heading), drawCentre.y - dir_y(this.speed, this.heading));
	game.viewport.context.strokeStyle = "red";
	game.viewport.context.stroke();
	// thrust marker
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(drawCentre.x, drawCentre.y);
	game.viewport.context.lineTo(drawCentre.x - dir_x(this._thrust, this._heading), drawCentre.y - dir_y(this._thrust, this._heading));
	game.viewport.context.strokeStyle = "yellow";
	game.viewport.context.stroke();
	// weapon range ring
	game.viewport.context.beginPath();
	game.viewport.context.arc(drawCentre.x, drawCentre.y, this.maximumWeaponRange, 0, 2 * Math.PI, false);
	game.viewport.context.lineWidth = 1;
	game.viewport.context.strokeStyle = "red";
	game.viewport.context.stroke();
	// collision centres
	for (let ctr = 0; ctr < this._collisionCentres.length; ctr += 1) {
		const collCtr = this._collisionCentres[ctr];
		game.viewport.context.beginPath();
		game.viewport.context.arc(
			drawOrigin.x + collCtr.x, 
			drawOrigin.y + collCtr.y, 
			collCtr.radius, 
			0, 
			2 * Math.PI, 
			false);
		game.viewport.context.lineWidth = 1;
		game.viewport.context.strokeStyle = "yellow";
		game.viewport.context.stroke();
	}

	// // thrusters
	// for (let t = 0; t < this._thrusters.length; t += 1) {
	// 	this._thrusters[t].draw();
	// }
	// // hardpoints
	// for (let i = 0; i < this._hardpoints.length; i++) {
	// 	this._hardpoints[i].draw();
	// }

	// bounding box
	game.viewport.context.beginPath();
	const pointsToRotate = [];
	pointsToRotate.push(new Point2d(game.viewport.drawOrigin(this).x + this._width, game.viewport.drawOrigin(this).y));
	pointsToRotate.push(new Point2d(game.viewport.drawOrigin(this).x + this._width, game.viewport.drawOrigin(this).y + this._height));
	pointsToRotate.push(new Point2d(game.viewport.drawOrigin(this).x, game.viewport.drawOrigin(this).y + this._height));
	pointsToRotate.push(new Point2d(game.viewport.drawOrigin(this).x, game.viewport.drawOrigin(this).y));
	game.viewport.context.moveTo(drawOrigin.x, drawOrigin.y);
	for (p in pointsToRotate) {
		const point = pointsToRotate[p];
		const r = rotatePoint(drawCentre.x, drawCentre.y, point.x, point.y, this._heading + 90);
		game.viewport.context.lineTo(r.x, r.y);
	}
	game.viewport.context.strokeStyle = "gray";
	game.viewport.context.stroke();

	game.viewport.context.restore();
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

const SHIPS = {
	SIDEWINDER: SideWinder,
	COBRA3: Cobra3,
	COBRA4: Cobra4,
	PYTHON: Python,
	ANACONDA: Anaconda,
	TYPE6: Type6,
	VIPER3: Viper3
}

const SHIPS_84 = {
	ADDER: Adder_84,
	ANACONDA: Anaconda_84,
	ASP2: Asp2_84,
	BOA: Boa_84,	
	COBRA1: Cobra1_84,
	COBRA3: Cobra3_84,
	FERDELANCE: FerdeLance_84,
	GECKO: Gecko_84,
	KRAIT: Krait_84,
	MAMBA: Mamba_84,
	MORAY: Moray_84,
	PYTHON: Python_84,
	SHUTTLE: Shuttle_84,
	SIDEWINDER: SideWinder_84,
	THARGOID: Thargoid_84,
	TRANSPORTER: Transporter_84,
	VIPER: Viper_84,
	WORM: Worm_84
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
	const scannableItems = game.filterObjects([Ship,Pickup]);
	const scanLimit = this.ship.maximumScanRange;	//todo - use a better scan limit
    for (var i = 0; i < scannableItems.length; i++) {
   		const range = distanceBetweenObjects(this.ship, scannableItems[i]);
   		if (scannableItems[i] !== this.ship && range <= scanLimit) {
			let threat = false;				
			let target = false;
			if (this.ship.role) {
				threat = (scannableItems[i].currentTarget && scannableItems[i].currentTarget.echo === this.ship) || 
					(this.ship.role.threatStatus.filter(function(t) {
						return t == scannableItems[i].status;
					}).length > 0 ? true : false);
				target = (this.ship.currentTarget && this.ship.currentTarget.echo === scannableItems[i]) || 
					(scannableItems[i].currentTarget && scannableItems[i].currentTarget.echo === this.ship) || 
					(this.ship.role.targetStatus.filter(function(t) {
						return t == scannableItems[i].status;
					}).length > 0 ? true : false);
			}
			const pickup = scannableItems[i] instanceof Pickup;
			const ping = {
				echo: scannableItems[i],
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

