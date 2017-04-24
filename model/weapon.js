
const Size = {
  SMALL: {value: 1, name: 'SMALL', code: 'S'}, 
  MEDIUM: {value: 2, name: 'MEDIUM', code: 'M'}, 
  LARGE: {value: 3, name: 'LARGE', code: 'L'},
  HUGE: {value: 4, name: 'HUGE', code: 'H'} 
};

const WeaponClasses = {
	ENERGY: 'ENERGY',
	PROJECTILE: 'PROJECTILE'
}

const LaserTypes = {
	PULSE: 'PULSE',
	BEAM: 'BEAM'
}

const DamageTypes = {
	POINT: 'POINT',
	AREA: 'AREA'
}

const HardpointTypes = {
	WEAPON: 'WEAPON',
	UTILITY: 'UTILITY'
}

const HardpointMountTypes = {
	FIXED: 'FIXED',
	TURRET: 'TURRET'
}

class Weapon {
	constructor(parent, type, size) {
		this.parent = parent;
		this.type = type;
		this.size = size;
		this.lft = null;
		this.rateOfFire = 0;
	}
	get lastFiredTime() {
		return this.lft;
	}
	set lastFiredTime(val) {
		this.lft = val;
	}
}

class LaserWeapon extends Weapon {
	constructor(parent, mount, category, size) {
		super(parent, WeaponTypes.ENERGY, size);
		this.mount = mount;
		this.category = category;
		this.range = Lasers[size][category][mount].range;
		this.damage = Lasers[size][category][mount].damage;
		this.rateOfFire = Lasers[size][category][mount].rof;
	}
}

LaserWeapon.prototype.fire = function() {
	var now = Date.now();
	if (this.lastFiredTime && this.rateOfFire && now - this.lastFiredTime < 1000 / this.rateOfFire) {
		return;
	}
	this.lastFiredTime = Date.now();
	var beam = new LaserBeam(this.category, this.size, this.parent);
	gameObjects.push(beam);
	beam.fsm.transition(FSMState.LAUNCH);
}

class PulseLaser extends LaserWeapon {
	constructor(parent, mount, size) {
		super(parent, mount, LaserTypes.PULSE, size);
	}
}

const WeaponTypes = {
	PULSELASER: PulseLaser
}

class Munition extends GameObject {
	constructor(type, effect, role) {
		super(GameObjectTypes.MUNITION, type, role);
		this.munitionType = type;
		this.munitionEffect = effect;
		this.munitionRole = role;
		this.coordinates = {
			x: null,
			y: null,
			z: null
		};
		this.fsm = new FSM(this, role.initialState);
	}
	// getters
	get type() {
		return this.munitionType;
	}
	get effect() {
		return this.munitionEffect;
	}
	get role() {
		return this.munitionRole;
	}
	// setters
	set role(val) {
		this.munitionRole = val;
	}
}

Munition.prototype.collisionDetect = function(x, y, scale) {
	var self = this;
	var hitObjects = gameObjects.filter(function(obj) {
		if (obj.oType !== this.oType && obj !== self.hardpoint.parent) {
			var impactBox = scaleBox(obj, scale);
			return x >= impactBox.x &&
				x <= impactBox.x + impactBox.width &&
				y >= impactBox.y &&
				y <= impactBox.y + impactBox.height;
		} else {
			return false;
		}
	});
	if (hitObjects.length > 0) {
		hitObjects[0].takeDamage(this);
		self.takeDamage(hitObjects[0]);
	}
}

Munition.prototype.updateAndDraw = function(debug) {
	var scale = 0.75;
	this.updatePosition();
	this.draw();
	this.collisionDetect(this.x + dir_x(this.geometry.height, this.heading), this.y + dir_y(this.geometry.height, this.heading), scale);
  this.fsm.execute();
}

class LaserBeam extends Munition {
	constructor(type, size, hardpoint) {
		super(WeaponClasses.ENERGY, DamageTypes.POINT, MunitionRoles.BEAM);
		this.geometry = {
			width: LaserBeams[type][size].width,
			height: LaserBeams[type][size].length
		};
		this.colour = LaserBeams[type][size].colour;
		this.strength = LaserBeams[type][size].strength;
		this.hardpoint = hardpoint;
		this.coordinates.x = this.hardpoint.coordinates.x;
		this.coordinates.y = this.hardpoint.coordinates.y;
		this.coordinates.z = this.hardpoint.coordinates.z;
		this.hdg = null;
		this.collisionDetectionPoint = {
			x: this.x + dir_x(this.height, this.heading),
			y: this.y + dir_y(this.height, this.heading)
		}
		this.speed = 100;
	}
	get heading() {
		switch(this.hardpoint.weapon.mount) {
			case HardpointMountTypes.FIXED: 
				this.hdg = this.hardpoint.parent.heading;
				return this.hdg;
				break;
			case HardpointMountTypes.TURRET:
				if (this.hdg) {
				 	return this.hdg;
					break;
				}
				if (this.hardpoint.parent.currentTarget) {
					var angle = angleBetween(this.hardpoint.x, this.hardpoint.y, this.hardpoint.parent.currentTarget.cx, this.hardpoint.parent.currentTarget.cy);
					this.hdg = (angle + 180) - 360;
					return this.hdg;
					break;
				}
			default:
				this.hdg = this.hardpoint.parent.heading;
				return this.hdg;
				break;
		}
	}
	set heading(val) {
		return;
	}
}

LaserBeam.prototype.takeDamage = function(source) {
	// if we hit something - we die
	this.fsm.transition(FSMState.DIE);
}

LaserBeam.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) {
		return;
	}
	var x = -environment.viewport.x + this.coordinates.x,
			y = -environment.viewport.y + this.coordinates.y;
	var normalWidth = environment.viewport.ctx.lineWidth;		
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(x, y);
	environment.viewport.ctx.lineTo(x + dir_x(this.speed, this.heading), y + dir_y(this.speed, this.heading));
	environment.viewport.ctx.strokeStyle = this.colour ? this.colour : '#ffffff';
	environment.viewport.ctx.lineWidth = this.geometry.width;
	environment.viewport.ctx.stroke();
	environment.viewport.ctx.lineWidth = normalWidth;
}

const Lasers = {
	1: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 1)',
				range: 500,
				rof: 3.8,
				damage: 3.0
			},
			TURRET: {
				name: 'Turreted pulse laser (size 1)',
				range: 500,
				rof: 2.5,
				damage: 1.7				
			}
		}
	},
	2: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 2)',
				range: 600,
				rof: 4.0,
				damage: 4.0
			},
			TURRET: {
				name: 'Turreted pulse laser (size 2)',
				range: 600,
				rof: 2.7,
				damage: 1.8								
			}
		}
	},
	3: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 3)',
				range: 700,
				rof: 4.2,
				damage: 5
			},
			TURRET: {
				name: 'Turreted pulse laser (size 3)',
				range: 700,
				rof: 2.9,
				damage: 2.0								
			}
		}
	},
	4: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 4)',
				range: 800,
				rof: 4.4,
				damage: 5.2
			},
			TURRET: {
				name: 'Turreted pulse laser (size 4)',
				range: 800,
				rof: 3.1,
				damage: 2.42							
			}
		}
	}
}

const MunitionRoles = {
	BEAM: {
		initialState: FSMState.LOADED
	}
}

const LaserBeams = {
	PULSE: {
		1: {
			width: 2,
			length: 200,
			colour: '#ff0000',
			strength: 3
		},
		2: {
			width: 3,
			length: 300,
			colour: '#ff3300',
			strength: 4			
		},
		3: {
			width: 4,
			length: 400,
			colour: '#ff3300',
			strength: 5			
		},
		4: {
			width: 5,
			length: 500,
			colour: '#ff3300',
			strength: 6			
		}
	}	
}



class Hardpoint {
	constructor(parent, type, size, index) {
		this.parent = parent;
		this.type = type;
		this.size = size;
		this.sizeName = size == 1 ? Size.SMALL.name : size == 2 ? Size.MEDIUM.name : size == 3 ? Size.LARGE.name : Size.HUGE.name;
		this.index = index;
	}
	get x() {
		return this.coordinatesWithRotation.x;
	}
	get y() {
		return this.coordinatesWithRotation.y;
	}
	get z() {
		return this.parent.hardpointGeometry[this.type][this.sizeName][this.index].z;
	}
	get coordinates() {
		return {
			x: this.x, 
			y: this.y, 
			z: this.z
		};	
	}
	get coordinatesWithRotation() {
		var x = this.parent.x + this.geometry.x,
				y = this.parent.y + this.geometry.y;
		return rotatePoint(this.parent.cx, this.parent.cy, x, y, this.parent.heading + 90); 
	}
	get geometry() {
		var g = this.parent.hardpointGeometry[this.type][this.sizeName][this.index];
		return {
			x: g.x,
			y: g.y,
			z: g.z
		};
	}
}

Hardpoint.prototype.draw = function() {
	var x = -environment.viewport.x + this.parent.x + this.geometry.x,
			y = -environment.viewport.y + this.parent.y + this.geometry.y,
			z = this.geometry.z,
			r = rotatePoint(-environment.viewport.x + this.parent.cx, -environment.viewport.y + this.parent.cy, x, y, this.parent.heading + 90);
	environment.viewport.ctx.moveTo(r.x, r.y);
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.strokeStyle = (this.z == 1 ? 'yellow' : 'orange');
	environment.viewport.ctx.arc(r.x, r.y, 2, 0, Math.PI * 2, false);
	environment.viewport.ctx.stroke();
}

class WeaponHardpoint extends Hardpoint {
	constructor(parent, size, index, weaponClass, weaponMount, weaponSize) {
		super(parent, HardpointTypes.WEAPON, size, index);
		this.weapon = weaponClass ? new weaponClass(this, weaponMount, weaponSize) : null;
		this.loaded = this.weapon ? true : false;
	}
}

class UtilityHardpoint extends Hardpoint {
	constructor(parent, size, index, module) {
		super(parent, HardpointTypes.UTILITY, size, index);
		this.loaded = module ? true : false;
		this.module = module;
	}
}

