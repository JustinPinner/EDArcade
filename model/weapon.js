// model/weapon.js

var SIZE = {
  Small: {value: 1, name: 'Small', code: 'S'}, 
  Medium: {value: 2, name: 'Medium', code: 'M'}, 
  Large: {value: 3, name: 'Large', code: 'L'},
  Huge: {value: 4, name: 'Huge', code: 'H'} 
};

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
		super(parent, 'energy', size);
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
	beam.fsm.transition('launch');
}

class PulseLaser extends LaserWeapon {
	constructor(parent, mount, size) {
		super(parent, mount, 'pulse', size);
	}
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
	this.updatePosition();
	this.draw();
  this.fsm.execute();
}

class LaserBeam extends Munition {
	constructor(type, size, hardpoint) {
		super('energy', 'point', MunitionRoles['beam']);
		this.width = LaserBeams[type][size].width;
		this.height = LaserBeams[type][size].length;
		this.colour = LaserBeams[type][size].colour;
		this.strength = LaserBeams[type][size].strength;
		this.hardpoint = hardpoint;
		this.coordinates.x = this.hardpoint.coordinates.x;
		this.coordinates.y = this.hardpoint.coordinates.y;
		this.coordinates.z = this.hardpoint.coordinates.z;
		this.heading = hardpoint.parent.heading;
		this.speed = 20;
	}
}

LaserBeam.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) {
		return;
	}
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.moveTo(this.coordinates.x, this.coordinates.y);
	environment.viewport.ctx.lineTo(this.coordinates.x + dir_x(this.speed, this.heading), this.coordinates.y + dir_y(this.speed, this.heading));
	environment.viewport.ctx.strokeStyle = this.colour ? this.colour : '#ffffff';
	environment.viewport.ctx.stroke();
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
			length: 200,
			colour: '#ff0000',
			strength: 3,
			role: MunitionRoles['beam']
		},
		2: {
			width: 3,
			length: 300,
			colour: '#ff3300',
			strength: 4			
		}
	}	
}

class Hardpoint {
	constructor(parent, type, size, index) {
		this.parent = parent;
		this.type = type;
		this.size = size;
		this.sizeName = size == 1 ? 'small' : size == 2 ? 'medium' : size == 3 ? 'large' : 'huge';
		this.index = index;
		this.x = this.parent.x + this.parent.hardpointGeometry[this.type][this.sizeName][this.index].x;
		this.y = this.parent.y + this.parent.hardpointGeometry[this.type][this.sizeName][this.index].y;
		this.z = this.parent.hardpointGeometry[this.type][this.sizeName][this.index].z;
	}
	get coordinates() {
		return {
			x: this.x, 
			y: this.y, 
			z: this.z
		};	
	}
}

Hardpoint.prototype.draw = function() {
	environment.viewport.ctx.moveTo(this.x, this.y);
	environment.viewport.ctx.beginPath();
	environment.viewport.ctx.strokeStyle = (this.z == 1 ? 'yellow' : 'orange');
	environment.viewport.ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
	environment.viewport.ctx.stroke();
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
				for (var i=1; i < 3; i++){
					parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Small.value, i, PulseLaser, 'fixed', 1));
					parent.hardpoints.push(new UtilityHardpoint(parent, SIZE.Small.value, i));
				}
			}
		},		
		Cobra: {
			3: {
				load: function(parent) {
					for (var i=1; i < 3; i++){
						parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Small.value, i));
						parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Medium.value, i, PulseLaser, 'fixed', 1));
						parent.hardpoints.push(new UtilityHardpoint(parent, SIZE.Small.value, i));
					}
				}
			},
			4: {
				load: function(parent) {
					for (var i=1; i < 4; i++){
						parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Small.value, i));				
					}
					for (var i=1; i < 3; i++){
						parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Medium.value, i, PulseLaser, 'fixed', 1));
						parent.hardpoints.push(new UtilityHardpoint(parent, SIZE.Small.value, i));
					}									
				}
			}
		},
		Python: {
			load: function(parent) {
				for (var i=1; i < 4; i++){
					parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Large.value, i));	
				}
				for (var i=1; i < 3; i++){
					parent.hardpoints.push(new WeaponHardpoint(parent, SIZE.Medium.value, i, PulseLaser, 'fixed', 1));				
				}
				for (var i=1; i < 5; i++){
					parent.hardpoints.push(new UtilityHardpoint(parent, SIZE.Small.value, i));	
				}
			}
		}
	}
}