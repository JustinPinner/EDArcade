// js/fsm.js

var fsmStates = {
	neutral: {
		mode: 'neutral',
		nextState: ['engage','chase','evade','escape','die'],
		execute: function(ship) {
			// TODO
		}
	},
	hunt: {
		mode: 'hunt',
		nextState: ['chase','engage','evade','escape'],
		execute: function(self) {		  
		  if (self.target) {
		  	self.fsm.transition('chase');
		  	return;
		  }
	    // seek out a new target
	    for (var j = 0; j < allShips.length; j++) {
	      var neighbour = allShips[j];
	      if (neighbour !== self && !self.isKnown(neighbour)) {
	        if (neighbour.isHostile()) {
	          self.targets.push(neighbour);
	        }
	      }
	    }
	    if (self.targets.length > 0) {
		    self.selectClosestTarget();
		    self.fsm.transition('chase');
	    }
		}
	},
	engage: {
		mode: 'engage',
		nextState: ['chase','evade','escape'],
		execute: function(self) {
			if (!self.target) {
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
	    
	    var aTmin = angleBetween(self.cx, self.cy, self.target.x, self.target.y);
	    var aTmax = angleBetween(self.cx, self.cy, self.target.x + self.target.width, self.target.y + self.target.height);

		  var deltaMin = angleDifference(self.heading, aTmin);
		  var deltaMax = angleDifference(self.heading, aTmax);

		  if (Math.abs(deltaMax - deltaMin) >= 5) {
		  	if (deltaMax - deltaMin < 0) self.yaw('ccw');
		  	if (deltaMax - deltaMin > 0) self.yaw('cw');
		  }

	    var dT = distanceBetween(self, self.target);
	    if (dT <= self.maximumWeaponRange && self.isBehind(self.target)) {
			  self.fireWeapons();
	    }
	    if (dT > self.engageRadius) {
	    	self.fsm.transition('chase');
	    }
	    if (dT <= self.maximumWeaponRange * 0.3 || self.isInFrontOf(self.target)) {
	    	self.fsm.transition('evade');
	    }
		}
	},
	chase: {
		mode: 'chase',
		nextState: ['engage','evade','escape','hunt'],
		execute: function(self) {
	    if (!self.target) self.fsm.transition('hunt');
	    
	    var dT = distanceBetween(self, self.target);
	    var aTmin = angleBetween(self.cx, self.cy, self.target.x, self.target.y);
	    var aTmax = angleBetween(self.cx, self.cy, self.target.x + self.target.width, self.target.y + self.target.height);

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
			if (!self.target) {
				self.fsm.transition(self.role.initialState);
				return;
			}
			if (distanceBetween(self, self.target) >= self.engageRadius) {
				self.fsm.transition('chase');
				return;
			}
	    var aE = angleBetween(self.cx, self.cy, -self.target.cx , -self.target.cy);
	    var deltaA = angleDifference(self.heading, aE);
		  if (deltaA < 0) self.yaw('ccw');
		  if (deltaA > 0) self.yaw('cw');
			self.increaseThrust();
			self.fsm.transition('escape');
		}		
	},
	escape: {
		lastTick:  0,
		mode: 'escape',
		nextState: ['neutral','evade','engage','despawn','chase'],
		execute: function(self) {
			self.increaseThrust();
			if (!self.target) {
				self.fsm.transition(self.initialState);
				return;
			}
			if (self.target && distanceBetween(self, self.target) >= self.engageRadius * 2) {
				self.fsm.transition('chase');
			}
		}		
	},
	die: {
		lastTick:  0,
		mode: 'die',
		nextState: ['despawn'],
		execute: function(ship) {
			// TODO
		}		
	},
	despawn: {
		lastTick:  0,
		mode: 'despawn',
		nextState: null,
		execute: function(ship) {
			// TODO
		}
	}
}

var FSM = function(ship, currentState) {
	this.ship = ship;
	this.state = fsmStates[currentState];
	this.startState = currentState;
	this.execute = function() {
		if (this.ship) {
			this.state.execute(this.ship);
		}
	}
	this.transition = function(newState) {
		if (this.state.nextState.includes(newState)) {
			//console.log(this.ship.shipName + '.' + this.ship.shipType + '.' + this.ship.role.roleName + '.' + this.state.mode + ' > ' + newState);
			this.state = fsmStates[newState];
		} else {
			this.state = this.startState;
		}
	}
}