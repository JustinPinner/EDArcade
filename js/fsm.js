const FSMState = {
	PLAYER: 'player',
	NEUTRAL: 'neutral',
	HUNT: 'hunt',
	ENGAGE: 'engage',
	CHASE: 'chase',
	EVADE: 'evade',
	ESCAPE: 'escape',
	HEAL: 'heal',
	EXPLODE: 'explode',
	EXPLODING: 'exploding',
	DIE: 'die',
	DESPAWN: 'despawn',
	LOADED: 'munitionLoaded',
	LAUNCH: 'munitionLaunch',
	UNLOAD: 'munitionUnload',
	INFLIGHT: 'munitionInFlight',
	IMPACT: 'munitionImpact',
	EFFECT: 'effectPlay'
}

const fsmStates = {
	player: {
		mode: FSMState.PLAYER,
		nextState: [],
		detectCollisions: true,
		execute: function(self) {}
	},
	neutral: {
		mode: FSMState.NEUTRAL,
		nextState: [FSMState.ENGAGE, FSMState.CHASE, FSMState.EVADE, FSMState.ESCAPE],
		detectCollisions: true,
		execute: function(self) {
			if (self.threats.length > 0) {
				self.fsm.transition(randInt(10) > 5 ? FSMState.ENGAGE : FSMState.EVADE);
			} else {
				const newHeading = randInt(360);
				const deltaA = angleDifference(self.heading, newHeading);
		  		if (deltaA < 0) self.yaw('ccw');
			 	if (deltaA > 0) self.yaw('cw');
			 	const newSpeed = randInt(self.model.maxSpeed);
			 	if (newSpeed > self.speed) self.increaseThrust();
			 	if (newSpeed < self.speed) self.decreaseThrust();
			}
		}
	},
	hunt: {
		mode: FSMState.HUNT,
		nextState: [FSMState.CHASE, FSMState.ENGAGE, FSMState.EVADE, FSMState.ESCAPE],
		detectCollisions: true,
		execute: function(self) {
			self.selectClosestTarget();
			if (self.currentTarget) {
				self.fsm.transition(FSMState.CHASE);
			}
		}
	},
	engage: {
		mode: FSMState.ENGAGE,
		nextState: [FSMState.CHASE, FSMState.HUNT, FSMState.EVADE, FSMState.ESCAPE],
		detectCollisions: true,
		execute: function(self) {
			if (self.targets.length < 1) {
				self.fsm.transition(FSMState.HUNT);
				return;
			}
			self.selectClosestTarget();
			const combatSpeedRange = {
				min: self.model.maxSpeed * 0.4,
				max: self.model.maxSpeed * 0.6
			}
			if (self.speed < combatSpeedRange.min) {
				self.increaseThrust();
			} else if (self.speed > combatSpeedRange.max) {
				self.decreaseThrust();
			}
	    
			const aTmin = angleBetween(self.centre.x, self.centre.y, self.currentTarget.echo.centre.x, self.currentTarget.echo.centre.y);

			const deltaMin = angleDifference(self.heading, aTmin);

			if (Math.abs(deltaMin >= 5)) {
				self.yaw(deltaMin < 0 ? 'ccw' : 'cw');
			}

			const dT = distanceBetweenObjects(self, self.currentTarget.echo);
			if (dT <= self.maximumWeaponRange) {
				self.fireWeapons();
			}
			if (dT > self.engageRadius) {
				self.fsm.transition(FSMState.CHASE);
				return;
			}
			if (dT <= self.maximumWeaponRange * 0.3) { //|| self.isInFrontOf(self.currentTarget)) {
				self.fsm.transition(FSMState.EVADE);
			}
		}
	},
	chase: {
		mode: FSMState.CHASE,
		nextState: [FSMState.ENGAGE, FSMState.EVADE, FSMState.ESCAPE, FSMState.HUNT],
		detectCollisions: true,
		execute: function(self) {
	    	if (!self.currentTarget) {
				self.fsm.transition(FSMState.HUNT);
				return;
			} 

			const dT = distanceBetweenObjects(self, self.currentTarget.echo);
			const aTmin = angleBetween(self.centre.x, self.centre.y, self.currentTarget.echo.centre.x, self.currentTarget.echo.centre.y);
			const deltaMin = angleDifference(self.heading, aTmin);
		  
			if (Math.abs(deltaMin >= 5)) {
				self.yaw(deltaMin < 0 ? 'ccw' : 'cw');
			}

			if (dT >= self.engageRadius) {
				self.increaseThrust();
			} else {
				self.decreaseThrust();
			}

			if (dT < self.engageRadius) {
				self.fsm.transition(FSMState.ENGAGE);
				return;
			}
		}
	},
	evade: {
		mode: FSMState.EVADE,
		nextState: [FSMState.CHASE, FSMState.ENGAGE, FSMState.ESCAPE, FSMState.HUNT, FSMState.NEUTRAL],
		detectCollisions: true,
		execute: function(self) {
			if (!self.currentTarget) {
				self.fsm.transition(self.role.initialState);
				return;
			}
			if (distanceBetweenObjects(self, self.currentTarget.echo) >= self.engageRadius) {
				self.fsm.transition(FSMState.CHASE);
				return;
			}
	    	const aE = angleBetween(self.centre.x, self.centre.y, -self.currentTarget.echo.centre.x , -self.currentTarget.echo.centre.y);
	    	const deltaA = angleDifference(self.heading, aE);
			deltaA !== 0 && self.yaw(deltaA < 0 ? 'ccw' : 'cw');			
			self.increaseThrust();
		}		
	},
	escape: {
		mode: FSMState.ESCAPE,
		nextState: [FSMState.NEUTRAL, FSMState.EVADE, FSMState.ENGAGE, FSMState.CHASE],
		detectCollisions: true,
		execute: function(self) {
			const threats = self.threats.sort(function(a, b) {
				if (a.range < b.range) {
					return -1;
				}
				if (a.range > b.range) {
					return 1;
				}
				return 0;
			});
			if (threats.length > 0) {
		    	const angleThreat = angleBetween(self.centre.x, self.centre.y, threats[0].echo.centre.x, threats[0].echo.centre.y);
				const escapeVector = angleDifference(self.heading, angleThreat) + 180 - 360;
		  		(escapeVector < 0) ? self.yaw('ccw') : self.yaw('cw');
				self.increaseThrust();
			} else {
				self.fsm.transition(self.role.initialState);
				return;
			}
		}		
	},
	heal: {
		mode: FSMState.HEAL,
		nextState: [FSMState.NEUTRAL, FSMState.HUNT],
		detectCollisions: true,
		execute: function(self) {
			const pickups = self.contacts.filter(function(ping) {
				return ping instanceof PowerUp;
			});
			if (pickups.length > 0) {
				const sortedPickups = pickups.sort(function(a, b) {
					if (a.range < b.range) {
						return -1;
					}
					if (a.range > b.range) {
						return 1;
					}
					return 0;
				});
				const aTmin = angleBetween(self.centre.x, self.centre.y, sortedPickups[0].echo.centre.x, sortedPickups[0].echo.centre.y);
				const deltaMin = angleDifference(self.heading, aTmin);			  
				if (Math.abs(deltaMin >= 5)) {
					self.yaw(deltaMin < 0 ? 'ccw' : 'cw');
				}
				if (sortedPickups[0].range >= 500) {
					self.increaseThrust();
				} else if (sortedPickups[0].range <= 50) {
					self.decreaseThrust();
				}									
			}
		}				
	},
	explode: {
		mode: FSMState.EXPLODE,
		nextState: [FSMState.EXPLODING],
		detectCollisions: false,
		execute: function(self, explosionEffect) {
			const explosion = explosionEffect || new ShipExplosionEffect(self.drawOriginCentre);
			explosion.velocity = self._velocity
			game.objects.push(explosion);
			self.fsm.transition(FSMState.EXPLODING);			
		}
	},
	exploding: {
		mode: FSMState.EXPLODING,
		nextState: [FSMState.DIE],
		detectCollisions: false,
		execute: function(self) {
			if (self.dumpWeapons) {
				self.dumpWeapons();
			}
			self.spawnRandomPowerUps(self);
			self.fsm.transition(FSMState.DIE);			
		}
	},
	die: {
		mode: FSMState.DIE,
		nextState: [FSMState.DESPAWN],
		detectCollisions: false,
		execute: function(self) {
			self.fsm.transition(FSMState.DESPAWN);
		}		
	},
	munitionLoaded: {
		mode: FSMState.LOADED,
		detectCollisions: false,
		nextState: [FSMState.LAUNCH, FSMState.UNLOAD],
		execute: function(self) {
			// TODO
		}
	},
	munitionLaunch: {
		mode: FSMState.LAUNCH,
		nextState: [FSMState.INFLIGHT],
		detectCollisions: false,
		execute: function(self) {
			self.velocity.x = dir_x(self.model.launchSpeed || self.model.maxSpeed, self.heading);
			self.velocity.y = dir_y(self.model.launchSpeed || self.model.maxSpeed, self.heading);
			self.fsm.transition(FSMState.INFLIGHT);
		}
	},
	munitionInFlight: {
		mode: FSMState.INFLIGHT,
		nextState: [FSMState.IMPACT],
		detectCollisions: true,
		execute: function(self) {
			self.velocity.x = dir_x(self.model.maxSpeed, self.heading);
			self.velocity.y = dir_y(self.model.maxSpeed, self.heading);
			if(distanceBetweenObjects(self, self.hardpoint.parent) > self.hardpoint.weapon.range) {
				self.fsm.transition(FSMState.DIE);
			}
		}
	},
	effectPlay: {
		mode: FSMState.EFFECT,
		nextState: [FSMState.DESPAWN],
		detectCollisions: false,
		execute: function(self) {}
	},
	despawn: {
		mode: FSMState.DESPAWN,
		nextState: [],
		detectCollisions: false,
		executeOnTransition: true,
		execute: function(self) {
			self.disposable = true;
		}
	},
	timedStateExample: {
		mode: FSMState.TIMED,
		nextState: [FSMState.NEXT],
		duration: 2000,
		lastExecutionTime: null,
		detectCollisions: false,
		timeout: function(self) {
			if (self.functionToRun) {
				self.functionToRun();
			}
			self.fsm.transition(this.nextState[0]);			
		},
		execute: function(self) {
			const now = Date.now();
			if (this.lastExecutionTime && this.duration && now - this.lastExecutionTime >= this.duration) {
				this.timeout(self);
			} else {
				this.lastExecutionTime = now;
			}
		}		
	}
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

const PilotRoles = {
	TRADER: {
		roleName: 'Trader',
		initialState: FSMState.NEUTRAL,
		initialStatus: PilotStatus.CLEAN,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [NonPilotStatus.CARGO],
		minAggression: 1,
		maxAggression: 7
	},
	MINER: {
		roleName: 'Miner',
		initialState: FSMState.NEUTRAL,
		initialStatus: PilotStatus.CLEAN,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [NonPilotStatus.MINERAL],
		minAggression: 1,
		maxAggression: 5
	},
	BOUNTYHUNTER: {
		roleName: 'Bounty Hunter',
		initialState: FSMState.HUNT,
		initialStatus: PilotStatus.VIGILANTE,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [PilotStatus.WANTED],
		minAggression: 5,
		maxAggression: 9
	},
	SECURITY: {
		roleName: 'Security Service',
		initialState: FSMState.HUNT,
		initialStatus: PilotStatus.SECURITY,
		threatStatus: [PilotStatus.WANTED],
		targetStatus: [PilotStatus.WANTED],
		minAggression: 7,
		maxAggression: 9
	},
	PIRATE: {
		roleName: 'Pirate',
		initialState: FSMState.HUNT,
		initialStatus: PilotStatus.WANTED,
		threatStatus: [PilotStatus.SECURITY, PilotStatus.VIGILANTE],
		targetStatus: [PilotStatus.CLEAN, PilotStatus.WANTED],
		minAggression: 8,
		maxAggression: 9
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

const forceableStates = [
	FSMState.EXPLODE,
	FSMState.EXPLODING, 
	FSMState.DIE, 
	FSMState.DESPAWN,
	FSMState.HEAL
]

const nonNegotiableStateModes = [
	FSMState.EXPLODE,
	FSMState.EXPLODING, 
	FSMState.DIE, 
	FSMState.DESPAWN
]

const motivations = {
	FIGHT: {
		name: 'fight',
		trigger: function(fsm) {
			const aggression = fsm.aggression;
			const shieldPercent = fsm.gameObject.shield.charge;
			const hullPercent = fsm.gameObject.hullIntegrity;
			const armourPercent = (fsm.gameObject.armour / fsm.gameObject.model.armour) * 100;
			const minPercent = 100 - (aggression * 10);
			return shieldPercent >= minPercent && hullPercent >= minPercent && armourPercent >= minPercent;
		},
		weight: 0,
		threshold: function (aggression) {
			return 9 - aggression;
		},
		state: FSMState.ENGAGE
	},
	FLIGHT: {
		name: 'flight',
		trigger: function(fsm) {
			const aggression = fsm.aggression;
			const shieldPercent = fsm.gameObject.shield.charge;
			const hullPercent = fsm.gameObject.hullIntegrity;
			const armourPercent = (fsm.gameObject.armour / fsm.gameObject.model.armour) * 100;
			const minPercent = 100 - (aggression * 10);
			return shieldPercent <= minPercent && hullPercent <= minPercent && armourPercent <= minPercent;
		},
		weight: 0,
		threshold: function(aggression) {
			return aggression;
		},
		state: FSMState.ESCAPE
	},
	RECOVER: {
		name: 'recover',
		weight: 0,
		trigger: function(fsm) {
			const aggression = fsm.aggression;
			const shieldPercent = fsm.gameObject.shield.charge;
			const hullPercent = fsm.gameObject.hullIntegrity;
			const armourPercent = (fsm.gameObject.armour / fsm.gameObject.model.armour) * 100;
			const minPercent = 100 - (aggression * 10);
			return shieldPercent >= minPercent && hullPercent >= minPercent && armourPercent >= minPercent;
		},
		threshold: function(aggression) {
			return aggression / 2;
		},
		state: FSMState.HEAL
	},
	NORMAL: {
		name: 'normal',
		weight: 0,
		threshold: function(aggression) {
			return 0;
		},
		state: null
	}
}

class FSM {
	constructor(gameObject, currentState) {
		this._gameObject = gameObject;
		this._state = fsmStates[currentState];
		this._startState = currentState;
		this._lastTransitionTime = null;
		this._motivations = [motivations.FIGHT, motivations.FLIGHT, motivations.RECOVER];
		this._aggression = gameObject.role && gameObject.role.minAggression && gameObject.role.maxAggression ? 
			randRangeInt(gameObject.role.minAggression, gameObject.role.maxAggression) :
			0;
	}
	get gameObject() {
		return this._gameObject;
	}
	get state() {
		return this._state;
	}
	get startState() {
		return this._startState;
	}
	get lastTransitionTime() {
		return this._lastTransitionTime;
	}
	get aggression() {
		return this._aggression;
	}
	set state(newState) {
		this._state = newState;
	}
	set lastTransitionTime(transitionTime) {
		this._lastTransitionTime = transitionTime;
	}
	set aggression(val) {
		this._aggression = val;
	}
}

FSM.prototype.execute = function(unconditionally = false) {
	if (this._gameObject) {
		if (!unconditionally) {
			if (this._gameObject instanceof Ship && distanceBetweenObjects(this._gameObject, game.playerShip) > game.despawnRange) {
				this.transition(FSMState.DESPAWN);
			}
			if (this._gameObject instanceof Ship) {
				this.reflex();
			}
		}
		this._state.execute && this._state.execute(this._gameObject);
	}
}

FSM.prototype.reflex = function() {
	if (nonNegotiableStateModes.includes(this._state.mode)) {
		return;
	}
	const actions = this._motivations.sort(function(a, b) {
		if (a.weight < b.weight) {
			return -1;
		}
		if (a.weight > b.weight) {
			return 1;
		}
		return 0;
	});
	if (actions[0].weight >= actions[0].threshold(this._aggression)) {
		const nextState = (actions[0].state || this.gameObject.role.initialState);
		this.transition(nextState);
	}
}

FSM.prototype.transition = function(newStateId) {
 	if (this._state && (this._state.nextState.includes(newStateId) || forceableStates.includes(newStateId))) {
		this._state = fsmStates[newStateId];
	} else {
		this._state = fsmStates[this._startState];
	}
	if (this._state.executeOnTransition) {
		this.execute(unconditionally = true);
	}
}

FSM.prototype.motivate = function(state) {
	const _state = state ? state : FSMState.NORMAL;
	for (m in this._motivations) {
		if (this._motivations[m].state === _state) {
			this._motivations[m].weight += 1;
		} else {
			this._motivations[m].weight -= this._motivations[m].weight < 1 ? 0 : 1;
		}
	}
}

FSM.prototype.demotivate = function() {
	for (m in this._motivations) {
		if (this._motivations[m].state === null) {
			this._motivations[m].weight = 1;
		} else {
			this._motivations[m].weight = 0;
		}
	}
}

FSM.prototype.underAttack = function() {
	for (m in this._motivations) {
		if (this._motivations[m].trigger && this._motivations[m].trigger(this)) {
			this._motivations[m].weight = 9;
		}
	}
}