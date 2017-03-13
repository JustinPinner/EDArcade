// model/weapon.js

class Weapon {
	constructor(parent, type, size) {
		this.parent = parent;
		this.weaponType = type;
		this.weaponSize = size;
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
	constructor(parent, mountType, category, size) {
		super(parent, 'energy', size);
		this.mountType = mountType;
		this.category = category;
		this.range = Lasers[size][category][mountType].range;
		this.damage = Lasers[size][category][mountType].damage;
		this.rateOfFire = Lasers[size][category][mountType].rof;
	}
}

class PulseLaser extends LaserWeapon {
	constructor(parent, mount, size) {
		super(parent, mount, 'pulse', size);
	}
}

PulseLaser.prototype.fire = function(source) {
	var now = Date.now();
	if (this.lastFiredTime && this.rateOfFire && now - this.lastFiredTime < 1000 / this.rateOfFire) {
		return;
	}
	this.lastFiredTime = Date.now();
	var beam = new LaserBeam('pulse', this.weaponSize, source, this.parent.x, this.parent.y, this.parent.z);
	gameObjects.push(beam);
	beam.fsm.transition('launch');
}

class Munition extends GameObject {
	constructor(type, effect, role) {
		super('munition', type, role);
		this.munitionType = type;
		this.munitionEffect = effect;
		this.munitionRole = role;
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

Munition.prototype.updateAndDraw = function(debug) {
	// TODO
}

class LaserBeam extends Munition {
	constructor(beamType, size, source, x, y, z) {
		super('energy', 'point', MunitionRoles['beam']);
		this.beamWidth = LaserBeams[beamType][size].width;
		this.beamLength = LaserBeams[beamType][size].length;
		this.beamColour = LaserBeams[beamType][size].colour;
		this.beamStrength = LaserBeams[beamType][size].strength;
		this.beamSource = source;
		this.coordinates.x = x;
		this.coordinates.y = y;
		this.coordinates.z = z;
	}
}

var Lasers = {
	1: {
		pulse: {
			fixed: {
				name: 'Fixed pulse laser (size 1)',
				range: 500,
				rof: 3.8,
				damage: 3
			}
		}
	},
	2: {
		pulse: {
			fixed: {
				name: 'Fixed pulse laser (size 2)',
				range: 500,
				rof: 3.4,
				damage: 4
			}
		}
	}
}

var MunitionRoles = {
	beam: {
		initialState: 'loaded'
	}
}

var LaserBeams = {
	pulse: {
		1: {
			width: 2,
			length: 20,
			colour: '#ff0000',
			strength: 3,
			role: MunitionRoles['beam']
		},
		2: {
			width: 3,
			length: 30,
			colour: '#ff3300',
			strength: 4			
		}
	}	
}

class Hardpoint {
	constructor(parent, type, size, index) {
		this.parent = parent;
		this.size = size;
		this.sizeName = size == 1 ? 'small' : size == 2 ? 'medium' : size == 3 ? 'large' : 'huge';
		this.x = parent.hardpointGeometry[type][this.sizeName][index].x;
		this.y = parent.hardpointGeometry[type][this.sizeName][index].y;
		this.z = parent.hardpointGeometry[type][this.sizeName][index].z;
	}
}

class WeaponHardpoint extends Hardpoint {
	constructor(parent, size, index, weaponClass, weaponMount, weaponSize) {
		super(parent, 'weapon', size, index);
		this.weapon = weaponClass ? new weaponClass(this, weaponMount, weaponSize) : null;
		this.loaded = this.weapon ? true : false;
	}
}

class UtilityHardpoint extends Hardpoint {
	constructor(parent, size, index, module) {
		super(parent, 'utility', size, index);
		this.loaded = module ? true : false;
		this.module = module;
	}
}

var Defaults = {
	Hardpoints: {
		Sidewinder: {
			load: function(parent) {
				parent.hardpoints.push(new WeaponHardpoint(parent, 1, 1, PulseLaser, 'fixed', 1));
				parent.hardpoints.push(new WeaponHardpoint(parent, 1, 2, PulseLaser, 'fixed', 1));
				parent.hardpoints.push(new UtilityHardpoint(parent, 1, 1));
				parent.hardpoints.push(new UtilityHardpoint(parent, 1, 2));
			}
		},		
		Cobra: {
			3: {
				load: function(parent) {
					parent.hardpoints.push(new WeaponHardpoint(parent, 1, 1));
					parent.hardpoints.push(new WeaponHardpoint(parent, 1, 2));
					parent.hardpoints.push(new WeaponHardpoint(parent, 2, 1, PulseLaser, 'fixed', 1));
					parent.hardpoints.push(new WeaponHardpoint(parent, 2, 2, PulseLaser, 'fixed', 1));
					parent.hardpoints.push(new UtilityHardpoint(parent, 1, 1));
					parent.hardpoints.push(new UtilityHardpoint(parent, 1, 2));
				}
			},
			4: {
				load: function(parent) {
					parent.hardpoints.push(new WeaponHardpoint(parent, 1, 1));
					parent.hardpoints.push(new WeaponHardpoint(parent, 1, 2));
					parent.hardpoints.push(new WeaponHardpoint(parent, 1, 3));
					parent.hardpoints.push(new WeaponHardpoint(parent, 2, 1, PulseLaser, 'fixed', 1));
					parent.hardpoints.push(new WeaponHardpoint(parent, 2, 2, PulseLaser, 'fixed', 1));
					parent.hardpoints.push(new UtilityHardpoint(parent, 1, 1));
					parent.hardpoints.push(new UtilityHardpoint(parent, 1, 2));
				}
			}
		},
		Python: {
			load: function(parent) {
				parent.hardpoints.push(new WeaponHardpoint(parent, 3, 1));
				parent.hardpoints.push(new WeaponHardpoint(parent, 3, 2));
				parent.hardpoints.push(new WeaponHardpoint(parent, 3, 3));
				parent.hardpoints.push(new WeaponHardpoint(parent, 2, 1, PulseLaser, 'fixed', 1));
				parent.hardpoints.push(new WeaponHardpoint(parent, 2, 2, PulseLaser, 'fixed', 1));
				parent.hardpoints.push(new UtilityHardpoint(parent, 1, 1));
				parent.hardpoints.push(new UtilityHardpoint(parent, 1, 2));
				parent.hardpoints.push(new UtilityHardpoint(parent, 1, 3));
				parent.hardpoints.push(new UtilityHardpoint(parent, 1, 4));
			}
		}
	}
}