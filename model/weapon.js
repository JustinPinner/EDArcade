
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
		this._parent = parent;
		this._type = type;
		this._size = size;
		this._lastFiredTime = null;
		this._rateOfFire = 0;
	}
	get lastFiredTime() {
		return this._lastFiredTime;
	}
	set lastFiredTime(val) {
		this._lastFiredTime = val;
	}
}

class LaserWeapon extends Weapon {
	constructor(parent, mount, category, size) {
		super(parent, WeaponClasses.ENERGY, size);
		this._mount = mount;
		this._category = category;
		this._range = Lasers[size][category][mount].range;
		this._damage = Lasers[size][category][mount].damage;
		this._rateOfFire = Lasers[size][category][mount].rof;
	}
}

LaserWeapon.prototype.fire = function() {
	var now = Date.now();
	if (this._lastFiredTime && this._rateOfFire && now - this._lastFiredTime < 1000 / this._rateOfFire) {
		return;
	}
	this._lastFiredTime = Date.now();
	var beam = new LaserBeam(this._category, this._size, this._parent);
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
		this._munitionType = type;
		this._munitionEffect = effect;
		this._munitionRole = role;
		this._coordinates = {
			x: null,
			y: null,
			z: null
		};
		this._fsm = new FSM(this, role.initialState);
	}
	// getters
	get type() {
		return this._munitionType;
	}
	get effect() {
		return this._munitionEffect;
	}
	get role() {
		return this._munitionRole;
	}
	// setters
	set role(val) {
		this._munitionRole = val;
	}
}

//TODO: check hierarchies for munition
Munition.prototype.collisionDetect = function(x, y, scale) {
	var self = this;
	var hitObjects = gameObjects.filter(function(obj) {
		if (obj.oType !== this._type && obj !== self.hardpoint.parent) {
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
		this._geometry = {
			width: LaserBeams[type][size].width,
			height: LaserBeams[type][size].length
		};
		this._colour = LaserBeams[type][size].colour;
		this._strength = LaserBeams[type][size].strength;
		this._hardpoint = hardpoint;
		this._coordinates = new Point2d(this._hardpoint.coordinates.x, this._hardpoint.coordinates.y);
		this._heading = null;
		this._collisionDetectionPoint = {
			x: this._coordinates.x + dir_x(this._height, this._heading),
			y: this._coordinates.y + dir_y(this._height, this._heading)
		}
		this._speed = 100;
	}
	get heading() {
		if (this._heading) return this._heading;
		switch(this._hardpoint.weapon.mount) {
			case HardpointMountTypes.FIXED: 
				this._heading = this._hardpoint.parent.heading;
				return this._heading;
				break;
			case HardpointMountTypes.TURRET:
				if (this._hardpoint.parent.currentTarget) {
					var angle = angleBetween(this._hardpoint.coordinates.x, 
						this._hardpoint.coordinates.y, 
						this._hardpoint.parent.currentTarget.centre.x, 
						this._hardpoint.parent.currentTarget.centre.y);
					this._heading = (angle + 180) - 360;
					return this._heading;
					break;
				}
			default:
				this._heading = this._hardpoint.parent.heading;
				return this._heading;
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
	var x = -game.viewport.x + this.coordinates.x,
		y = -game.viewport.y + this.coordinates.y;
	var normalWidth = game.viewport.context.lineWidth;		
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(x, y);
	game.viewport.context.lineTo(x + dir_x(this._speed, this._heading), y + dir_y(this._speed, this._heading));
	game.viewport.context.strokeStyle = this._colour ? this._colour : '#ffffff';
	game.viewport.context.lineWidth = this._geometry.width;
	game.viewport.context.stroke();
	game.viewport.context.lineWidth = normalWidth;
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
		this._parent = parent;
		this._type = type;
		this._size = size;
		this._sizeName = size == 1 ? Size.SMALL.name : size == 2 ? Size.MEDIUM.name : size == 3 ? Size.LARGE.name : Size.HUGE.name;
		this._index = index;
		this._geometry = this._parent.hardpointGeometry[this._type][this._sizeName][this._index];
		this._coordinates = new Point2d(this._parent.coordinates.x + this._geometry.x, this._parent.coordinates.y + this._geometry.y);
	}
	/* Getters */
	get type() {
		return this._type;
	}
	get sizeName() {
		return this._sizeName;
	}
	get index() {
		return this._index;
	}
	get x() {
		return this.coordinatesWithRotation.x;
	}
	get y() {
		return this.coordinatesWithRotation.y;
	}
	get z() {
		return this._geometry.z;
	}
	get coordinates() {
		return {
			x: this.x, 
			y: this.y, 
			z: this.z
		};	
	}
	get coordinatesWithRotation() {
		return rotatePoint(this._parent.centre.x, 
			this._parent.centre.y, 
			this._coordinates.x, 
			this._coordinates.y, 
			this._parent.heading + 90); 
	}
	get geometry() {
		return {
			x: this._geometry.x,
			y: this._geometry.y,
			z: this._geometry.z
		};
	}
	/* Setters */
	set coordinates(point2d) {
		this._coordinates = point2d;
	}
}

Hardpoint.prototype.draw = function() {
	var x = -game.viewport.x + this._parent.coordinates.x + this.geometry.x,
		y = -game.viewport.y + this._parent.coordinates.y + this.geometry.y,
		z = this._geometry.z,
		r = rotatePoint(-game.viewport.x + this._parent.centre.x, -game.viewport.y + this._parent.centre.y, x, y, this._parent.heading + 90);
	game.viewport.context.moveTo(r.x, r.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = (this.z == 1 ? 'yellow' : 'orange');
	game.viewport.context.arc(r.x, r.y, 2, 0, Math.PI * 2, false);
	game.viewport.context.stroke();
}

Hardpoint.prototype.loaded = function() {
	return this._loaded;
}

class WeaponHardpoint extends Hardpoint {
	constructor(parent, size, index, weaponClass, weaponMount, weaponSize) {
		super(parent, HardpointTypes.WEAPON, size, index);
		this._weapon = weaponClass ? new weaponClass(this, weaponMount, weaponSize) : null;
		this._loaded = this.weapon ? true : false;
	}
}

class UtilityHardpoint extends Hardpoint {
	constructor(parent, size, index, module) {
		super(parent, HardpointTypes.UTILITY, size, index);
		this._module = module;
		this._loaded = module ? true : false;
	}
}

