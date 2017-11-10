
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
	get parent() {
		return this._parent;
	}
	get size() {
		return this._size;
	}
	set lastFiredTime(val) {
		this._lastFiredTime = val;
	}
	set parent(newParent) {
		this._parent = newParent;
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
		this._iconName = Lasers[size][category][mount].iconName;
	}
	get range() {
		return this._range;
	}
	get iconName() {
		return this._iconName;
	}
}

LaserWeapon.prototype.fire = function() {
	const now = Date.now();
	if (this._lastFiredTime && this._rateOfFire && now - this._lastFiredTime < 1000 / this._rateOfFire) {
		return;
	}
	this._lastFiredTime = Date.now();
	const beam = new LaserBeam(this._category, this._size, this._parent);
	beam.draw();
	game.objects.push(beam);
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
	constructor(type, model, effect, role) {
		super(GameObjectTypes.MUNITION, model, type, role);
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
	get fsm() {
		return this._fsm;
	}
	get role() {
		return this._munitionRole;
	}
	// setters
	set role(val) {
		this._munitionRole = val;
	}
}

Munition.prototype.updateAndDraw = function(debug) {
	this.updatePosition();
	this.collisionDetect();
	this.draw();
	this._fsm.execute();
}

class LaserBeam extends Munition {
	constructor(type, size, hardpoint) {
		super(WeaponClasses.ENERGY, LaserBeams[type][size], DamageTypes.POINT, MunitionRoles.BEAM);
		this._colour = LaserBeams[type][size].colour;
		this._strength = LaserBeams[type][size].strength;
		this._hardpoint = hardpoint;
		this._coordinates = hardpoint.coordinatesWithRotation;
		this._heading = hardpoint.parent.heading;
		this._velocity = new Vector2d(0, 0);
	}
	get drawOrigin() {
		return new Point2d(this.coordinates.x + -game.viewport.coordinates.x, this.coordinates.y + -game.viewport.coordinates.y);
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
					const angle = angleBetween(this._hardpoint.coordinates.x, 
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
	get hardpoint() {
		return this._hardpoint;
	}
	get shooter() {
		return this._hardpoint.parent;
	}
	get strength() {
		return this._strength;
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
	const x = -game.viewport.coordinates.x + this._coordinates.x,
		y = -game.viewport.coordinates.y + this._coordinates.y;
	const normalWidth = game.viewport.context.lineWidth;		
	game.viewport.context.beginPath();
	game.viewport.context.moveTo(x, y);
	game.viewport.context.lineTo(x - this.velocity.x, y - this.velocity.y);
	game.viewport.context.strokeStyle = this._colour ? this._colour : '#ffffff';
	game.viewport.context.lineWidth = this.geometry.width;
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
				damage: 3.0,
				iconName: 'FixedLaser1'
			},
			TURRET: {
				name: 'Turreted pulse laser (size 1)',
				range: 500,
				rof: 2.5,
				damage: 1.7,
				iconName: 'TurretLaser1'				
			}
		}
	},
	2: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 2)',
				range: 600,
				rof: 4.0,
				damage: 4.0,
				iconName: 'FixedLaser2'
			},
			TURRET: {
				name: 'Turreted pulse laser (size 2)',
				range: 600,
				rof: 2.7,
				damage: 1.8,
				iconName: 'TurretLaser2'								
			}
		}
	},
	3: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 3)',
				range: 700,
				rof: 4.2,
				damage: 5,
				iconName: 'FixedLaser3'
			},
			TURRET: {
				name: 'Turreted pulse laser (size 3)',
				range: 700,
				rof: 2.9,
				damage: 2.0,
				iconName: 'TurretLaser3'								
			}
		}
	},
	4: {
		PULSE: {
			FIXED: {
				name: 'Fixed pulse laser (size 4)',
				range: 800,
				rof: 4.4,
				damage: 5.2,
				iconName: 'FixedLaser4'
			},
			TURRET: {
				name: 'Turreted pulse laser (size 4)',
				range: 800,
				rof: 3.1,
				damage: 2.42,
				iconName: 'TurretLaser4'							
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
			height: 2,
			colour: '#ff0000',
			strength: 3,
			launchSpeed: 100,
			maxSpeed: 100,
			collisionCentres : {
				impactPoint: {
					x: 1,
					y: 1,
					radius: 2
				}
			}
		},
		2: {
			width: 3,
			height: 3,
			colour: '#ff3300',
			strength: 4,
			launchSpeed: 150,
			maxSpeed: 150,
			collisionCentres : {
				impactPoint: {
					x: 1,
					y: 1,
					radius: 2
				}
			}
		},
		3: {
			width: 4,
			height: 4,
			colour: '#ff3300',
			strength: 5,
			launchSpeed: 200,
			maxSpeed: 200,
			collisionCentres : {
				impactPoint: {
					x: 1,
					y: 1,
					radius: 2
				}
			}			
		},
		4: {
			width: 5,
			height: 5,
			colour: '#ff3300',
			strength: 6,
			launchSpeed: 250,
			maxSpeed: 250,
			collisionCentres : {
				impactPoint: {
					x: 1,
					y: 1,
					radius: 2
				}
			}		
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
	get size() {
		return this._size;
	}
	get sizeName() {
		return this._sizeName;
	}
	get index() {
		return this._index;
	}
	get coordinates() {
		return {
			x: this._parent.coordinates.x + this._geometry.x, 
			y: this._parent.coordinates.y + this._geometry.y, 
			z: this._geometry.z
		};	
	}
	get coordinatesWithRotation() {
		return rotatePoint(this._parent.centre.x, 
			this._parent.centre.y, 
			this.coordinates.x, 
			this.coordinates.y, 
			this._parent.heading + 90); 
	}
	get geometry() {
		return {
			x: this._geometry.x,
			y: this._geometry.y,
			z: this._geometry.z
		};
	}
	get parent() {
		return this._parent;
	}
	/* Setters */
	set coordinates(point2d) {
		this._coordinates = point2d;
	}
	set parent(newParent) {
		this._parent = newParent;
	}
}

Hardpoint.prototype.draw = function() {
	const r = rotatePoint(this._parent.drawOriginCentre.x, 
		this._parent.drawOriginCentre.y, 
		this._parent.drawOrigin.x + this._geometry.x, 
		this._parent.drawOrigin.y + this._geometry.y, 
		this._parent.heading + 90); 

	game.viewport.context.moveTo(r.x, r.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = (this._geometry.z == 1 ? 'yellow' : 'orange');
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
		this._loaded = this._weapon ? true : false;
	}
	get weapon() {
		return this._weapon;
	}
	get parent() {
		return this._parent;
	}
	set weapon(wpn) {
		this._weapon = wpn;
		this._loaded = true;
	}
}

class UtilityHardpoint extends Hardpoint {
	constructor(parent, size, index, module) {
		super(parent, HardpointTypes.UTILITY, size, index);
		this._module = module;
		this._loaded = module ? true : false;
	}
	get module() {
		return this._module;
	}
}

