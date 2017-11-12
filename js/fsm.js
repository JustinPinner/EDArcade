
const FSMState = {
	PLAYER: 'player',
	NEUTRAL: 'neutral',
	HUNT: 'hunt',
	ENGAGE: 'engage',
	CHASE: 'chase',
	EVADE: 'evade',
	ESCAPE: 'escape',
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

const forceableStates = [
	FSMState.EXPLODE,
	FSMState.EXPLODING, 
	FSMState.DIE, 
	FSMState.DESPAWN
];

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
			if (!self.currentTarget && self.threats.length > 0) {
				self.currentTarget = self.threats[0].echo;
				self.fsm.transition(FSMState.CHASE);
			}
		}
	},
	engage: {
		mode: FSMState.ENGAGE,
		nextState: [FSMState.CHASE, FSMState.HUNT, FSMState.EVADE, FSMState.ESCAPE],
		detectCollisions: true,
		execute: function(self) {
			if (!self.currentTarget) {
				self.fsm.transition(FSMState.HUNT);
				return;
			}
			const combatSpeedRange = {
				min: self.model.maxSpeed * 0.4,
				max: self.model.maxSpeed * 0.6
			}
			if (self.speed < combatSpeedRange.min) {
				self.increaseThrust();
			} else if (self.speed > combatSpeedRange.max) {
				self.decreaseThrust();
			}
	    
			const aTmin = angleBetween(self.centre.x, self.centre.y, self.currentTarget.x, self.currentTarget.y);
			const aTmax = angleBetween(self.centre.x, self.centre.y, self.currentTarget.x + self.currentTarget.width, self.currentTarget.y + self.currentTarget.height);

			const deltaMin = angleDifference(self.heading, aTmin);
			const deltaMax = angleDifference(self.heading, aTmax);

			if (Math.abs(deltaMax - deltaMin) >= 5) {
				if (deltaMax - deltaMin < 0) self.yaw('ccw');
				if (deltaMax - deltaMin > 0) self.yaw('cw');
			}

			const dT = distanceBetweenObjects(self, self.currentTarget);
			if (dT <= self.maximumWeaponRange) {
				self.fireWeapons();
			}
			if (dT > self.engageRadius) {
				self.fsm.transition(FSMState.CHASE);
			}
			if (dT <= self.maximumWeaponRange * 0.3 || self.isInFrontOf(self.currentTarget)) {
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

			const dT = distanceBetweenObjects(self, self.currentTarget);
			const aTmin = angleBetween(self.centre.x, self.centre.y, self.currentTarget.x, self.currentTarget.y);
			const aTmax = angleBetween(self.centre.x, self.centre.y, self.currentTarget.x + self.currentTarget.width, self.currentTarget.y + self.currentTarget.height);

			const deltaMin = angleDifference(self.heading, aTmin);
			const deltaMax = angleDifference(self.heading, aTmax);

			if (Math.abs(deltaMax - deltaMin) >= 5) {
		  		if (deltaMax - deltaMin < 0) self.yaw('ccw');
		  		if (deltaMax - deltaMin > 0) self.yaw('cw');
		  	}
		  
			if (dT >= self.engageRadius) {
				self.increaseThrust();
			} else {
				self.decreaseThrust();
			}

			if (dT < self.engageRadius) {
				self.fsm.transition(FSMState.ENGAGE);
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
			if (distanceBetweenObjects(self, self.currentTarget) >= self.engageRadius) {
				self._fsm.transition(FSMState.CHASE);
				return;
			}
	    	const aE = angleBetween(self.centre.x, self.centre.y, -self.currentTarget.centre.x , -self.currentTarget.centre.y);
	    	const deltaA = angleDifference(self.heading, aE);
			if (deltaA < 0) self.yaw('ccw');
			if (deltaA > 0) self.yaw('cw');
			self.increaseThrust();
			self.fsm.transition(FSMState.ESCAPE);
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
				self.fsm.transition(FSMState.NEUTRAL);
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
			if(distanceBetweenObjects(self, self.hardpoint.parent) > game.viewport.width * 5) {
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

class FSM {
	constructor(gameObject, currentState) {
		this._gameObject = gameObject;
		this._state = fsmStates[currentState];
		this._startState = currentState;
		this._lastTransitionTime = null;
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
	set state(newState) {
		this._state = newState;
	}
	set lastTransitionTime(transitionTime) {
		this._lastTransitionTime = transitionTime;
	}
}

FSM.prototype.execute = function() {
	if (this._gameObject) {
		if (this._gameObject instanceof Ship && distanceBetweenObjects(this._gameObject, game.playerShip) > game.despawnRange) {
			this.transition(FSMState.DESPAWN);
		}
		this._state.execute && this._state.execute(this._gameObject);
	}
}

FSM.prototype.transition = function(newState) {
	if ((this._state.nextState && (this._state.nextState.includes(newState))) || forceableStates.includes(newState)) {
		this._state = fsmStates[newState];
	} else {
		this._state = this._startState;
	}
}
