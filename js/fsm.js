// js/fsm.js

var fsmStates = {
	neutral: {
		mode: 'neutral',
		nextState: ['engage','chase','evade','escape','die'],
		duration: 5000,
		execute: function(self) {
			if (self.threats.length > 0) {
				self.fsm.transition('escape');
			} else {
				var newHeading = randInt(360);
				var deltaA = angleDifference(self.heading, newHeading);
		  	if (deltaA < 0) self.yaw('ccw');
			 	if (deltaA > 0) self.yaw('cw');
			 	var newSpeed = randInt(self.maxSpeed);
			 	if (newSpeed > self.speed) self.increaseThrust();
			 	if (newSpeed < self.speed) self.decreaseThrust();
			}
		}
	},
	hunt: {
		mode: 'hunt',
		nextState: ['chase','engage','evade','escape'],
		execute: function(self) {		  
	    if (!self.currentTarget && self.threats.length > 0) {
	    	self.currentTarget = self.threats[0].ship;
		    self.fsm.transition('chase');
	    }
		}
	},
	engage: {
		mode: 'engage',
		nextState: ['chase','evade','escape'],
		execute: function(self) {
			if (!self.currentTarget) {
				self.fsm.transition('hunt');
				return;
			}
			var combatSpeedRange = {
				min: self.maxSpeed * 0.4,
				max: self.maxSpeed * 0.6
			}
			if (self.speed < combatSpeedRange.min) {
				self.increaseThrust();
			} else if (self.speed > combatSpeedRange.max) {
				self.decreaseThrust();
			}
	    
	    var aTmin = angleBetween(self.cx, self.cy, self.currentTarget.x, self.currentTarget.y);
	    var aTmax = angleBetween(self.cx, self.cy, self.currentTarget.x + self.currentTarget.width, self.currentTarget.y + self.currentTarget.height);

		  var deltaMin = angleDifference(self.heading, aTmin);
		  var deltaMax = angleDifference(self.heading, aTmax);

		  if (Math.abs(deltaMax - deltaMin) >= 5) {
		  	if (deltaMax - deltaMin < 0) self.yaw('ccw');
		  	if (deltaMax - deltaMin > 0) self.yaw('cw');
		  }

	    var dT = distanceBetween(self, self.currentTarget);
	    if (dT <= self.maximumWeaponRange) {
			  self.fireWeapons();
	    }
	    if (dT > self.engageRadius) {
	    	self.fsm.transition('chase');
	    }
	    if (dT <= self.maximumWeaponRange * 0.3 || self.isInFrontOf(self.currentTarget)) {
	    	self.fsm.transition('evade');
	    }
		}
	},
	chase: {
		mode: 'chase',
		nextState: ['engage','evade','escape','hunt'],
		execute: function(self) {
	    if (!self.currentTarget) self.fsm.transition('hunt');
	    
	    var dT = distanceBetween(self, self.currentTarget);
	    var aTmin = angleBetween(self.cx, self.cy, self.currentTarget.x, self.currentTarget.y);
	    var aTmax = angleBetween(self.cx, self.cy, self.currentTarget.x + self.currentTarget.width, self.currentTarget.y + self.currentTarget.height);

		  var deltaMin = angleDifference(self.heading, aTmin);
		  var deltaMax = angleDifference(self.heading, aTmax);

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
	    	self.fsm.transition('engage');
	    }
		}
	},
	evade: {
		mode: 'evade',
		nextState: ['chase','engage','escape','hunt','neutral'],
		execute: function(self) {
			if (!self.currentTarget) {
				self.fsm.transition(self.role.initialState);
				return;
			}
			if (distanceBetween(self, self.currentTarget) >= self.engageRadius) {
				self.fsm.transition('chase');
				return;
			}
	    var aE = angleBetween(self.cx, self.cy, -self.currentTarget.cx , -self.currentTarget.cy);
	    var deltaA = angleDifference(self.heading, aE);
		  if (deltaA < 0) self.yaw('ccw');
		  if (deltaA > 0) self.yaw('cw');
			self.increaseThrust();
			self.fsm.transition('escape');
		}		
	},
	escape: {
		mode: 'escape',
		nextState: ['neutral','evade','engage','despawn','chase'],
		execute: function(self) {
			var threats = self.threats.sort(function(a, b) {
				if (a.range < b.range) {
					return -1;
				}
				if (a.range > b.range) {
					return 1;
				}
				return 0;
			});
			if (threats.length > 0) {
		    var angleThreat = angleBetween(self.cx, self.cy, threats[0].ship.cx, threats[0].ship.cy);
			  var escapeVector = angleDifference(self.heading, angleThreat) + 180 - 360;
		  	(escapeVector < 0) ? self.yaw('ccw') : self.yaw('cw');
				self.increaseThrust();
			} else {
				self.fsm.transition('neutral');
			}
		}		
	},
	die: {
		mode: 'die',
		nextState: ['despawn'],
		execute: function(self) {
			// TODO - animations/effects etc
			self.fsm.transition('despawn');
		}		
	},
	despawn: {
		mode: 'despawn',
		nextState: null,
		execute: function(self) {
			for(var i = 0; i < gameObjects.length; i++) {
				if(gameObjects[i] === self) {
					gameObjects.splice(i, 1);
					return;
				}
			}
		}
	},
	loaded: {
		mode: 'loaded',
		nextState: ['launch', 'unload'],
		execute: function(self) {
			// TODO
		}
	},
	launch: {
		mode: 'launch',
		nextState: ['inflight'],
		execute: function(self) {
			self.vx = dir_x(self.speed, self.heading);
			self.vy = dir_y(self.speed, self.heading);
			self.fsm.transition('inflight');
		}
	},
	inflight: {
		mode: 'inflight',
		nextState: ['hit'],
		execute: function(self) {
			self.vx = dir_x(self.speed, self.heading);
			self.vy = dir_y(self.speed, self.heading);
			if(distanceBetween(self, self.hardpoint.parent) > environment.viewport.width * 5) {
				self.fsm.transition('despawn');
			}
		}
	}
}

var FSM = function(gameObject, currentState) {
	this.gameObject = gameObject;
	this.state = fsmStates[currentState];
	this.startState = currentState;
	this.lastTransitionTime = null;
	this.execute = function() {
		if (this.gameObject) {
			var now = Date.now();
			if (this.lastTransitionTime && this.state.duration && now - this.lastTransitionTime < this.state.duration) {
				return;
			}
			this.state.execute && this.state.execute(this.gameObject);
		 	if (this.state.duration) {
			 	this.lastTransitionTime = Date.now();
		 	}
		}
	}
	this.transition = function(newState) {
		if (this.state.nextState.includes(newState) || newState === 'die') {
			this.state = fsmStates[newState];
		} else {
			this.state = this.startState;
		}
	}
}