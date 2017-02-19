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
		execute: function(ship) {		  
		  if (ship.target) {
		  	ship.fsm.transition('chase');
		  	return;
		  }
	    // seek out a new target
	    for (var j = 0; j < allShips.length; j++) {
	      var neighbour = allShips[j];
	      if (neighbour !== ship && !ship.isKnown(neighbour)) {
	        if (neighbour.isHostile()) {
	          ship.targets.push(neighbour);
	        }
	      }
	    }
	    if (ship.targets.length > 0) {
		    ship.selectClosestTarget();
		    ship.fsm.transition('chase');
	    }
		}
	},
	engage: {
		mode: 'engage',
		nextState: ['chase','evade','escape'],
		execute: function(ship) {
			if (!ship.target) return;

			var combatSpeedRange = {
				min: ship.maxSpeed * 0.4,
				max: ship.maxSpeed * 0.6
			}
			if (ship.speed < combatSpeedRange.min) {
				ship.increaseThrust();
			} else if (ship.speed > combatSpeedRange.max) {
				ship.decreaseThrust();
			} else {
				ship.allStop(0);
			}
			ship.updateMomentum();
	    
		  var aT = angleBetween(ship.cx, ship.cy, ship.target.cx, ship.target.cy);
		  var deltaA = angleDifference(ship.heading, aT);
		  if (deltaA < 0) ship.yaw('ccw');
		  if (deltaA > 0) ship.yaw('cw');
		  ship.updatePosition();
	  	
	    var dT = distanceBetween(ship, ship.target);
	    if (dT <= ship.maximumWeaponRange && ship.isBehind(ship.target)) {
			  ship.fireWeapons();
	    }
	    if (dT > ship.maximumWeaponRange) {
	    	ship.fsm.transition('chase');
	    }
	    if (dT <= ship.height * 1.5 || ship.isInFrontOf(ship.target)) {
	    	ship.fsm.transition('evade');
	    }
		}
	},
	chase: {
		mode: 'chase',
		nextState: ['engage','evade','escape'],
		execute: function(ship) {
	    if (!ship.target) return;
	    
	    var dT = distanceBetween(ship, ship.target);
	    var aT = angleBetween(ship.cx, ship.cy, ship.target.cx, ship.target.cy);
		  var deltaA = angleDifference(ship.heading, aT);
		  if (deltaA < 0) ship.yaw('ccw');
		  if (deltaA > 0) ship.yaw('cw');
		  ship.updatePosition();

	    if (dT <= ship.maximumWeaponRange) {
	    	if (aT >= 0 && aT <= 180) {
	    		ship.increaseThrust();
	    	} else {
	    		ship.decreaseThrust();
	    	}
			  ship.updateMomentum();
	    	ship.fsm.transition('engage');
	    }
		}
	},
	evade: {
		mode: 'evade',
		nextState: ['chase','engage','escape'],
		execute: function(ship) {
			if (!ship.target || distanceBetween(ship, ship.target) >= ship.maximumWeaponRange) {
				ship.fsm.transition('chase');
				return;
			}
	    var aE = angleBetween(ship.cx, ship.cy, -ship.target.cx , -ship.target.cy);
	    var deltaA = angleDifference(ship.heading, aE);
		  if (deltaA < 0) ship.yaw('ccw');
		  if (deltaA > 0) ship.yaw('cw');
		  ship.updatePosition();
			if (ship.speed < ship.maxSpeed) {
				ship.increaseThrust();
			}
			ship.updateMomentum();
		}		
	},
	escape: {
		lastTick:  0,
		mode: 'escape',
		nextState: ['neutral','evade','engage','despawn'],
		execute: function(ship) {
			// TODO
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
			this.state = fsmStates[newState];
		}
	}
}