const HardpointTypes = {
	WEAPON: 'WEAPON',
	UTILITY: 'UTILITY'
}

const HardpointMountTypes = {
	FIXED: 'FIXED',
	TURRET: 'TURRET'
}

class Hardpoint {
	constructor(parent, type, size, index) {
		this._parent = parent;
		this._type = type;
		this._size = size;
		this._sizeName = size == 1 ? Size.SMALL.name : size == 2 ? Size.MEDIUM.name : size == 3 ? Size.LARGE.name : Size.HUGE.name;
		this._index = index;
		this._model = this._parent.model.hardpointGeometry[this._type][this._sizeName][this._index];
		this._coordinates = {
			x: this._model.x,
			y: this._model.y
		};
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
			x: this._coordinates.x || 0, 
			y: this._coordinates.y || 0, 
			z: this._model.z,
			centre: {
				x: this._coordinates.x || 0, 
				y: this._coordinates.y || 0, 
				z: this._model.z
			}
		};
		// return {
		// 	x: this._parent.coordinates.origin.x + this._coordinates.x || 0, 
		// 	y: this._parent.coordinates.origin.y + this._coordinates.y || 0, 
		// 	z: this._model.z,
		// 	centre: {
		// 		x: this._parent.coordinates.origin.x + this._coordinates.x || 0, 
		// 		y: this._parent.coordinates.origin.y + this._coordinates.y || 0, 
		// 		z: this._model.z
		// 	}
		// };
	}
	// get coordinatesWithRotation() {
	// 	return rotatePoint(this._parent.centre.x, 
	// 		this._parent.centre.y, 
	// 		this.coordinates.x, 
	// 		this.coordinates.y, 
	// 		this._parent.heading + 90); 
	// }
	get parent() {
		return this._parent;
	}
	set parent(newParent) {
		this._parent = newParent;
	}
}

Hardpoint.prototype.reScale = function() {
	this._coordinates = {
		x: this._parent.scaleWidth(this._model.x),
		y: this._parent.scaleHeight(this._model.y)
	};
}

// Hardpoint.prototype.draw = function() {
// 	const r = rotatePoint(this._parent.drawOriginCentre.x, 
// 		this._parent.drawOriginCentre.y, 
// 		this._parent.drawOrigin.x + this._coordinates.scaled.x, 
// 		this._parent.drawOrigin.y + this._coordinates.scaled.y, 
// 		this._parent.heading + 90); 

// 	game.viewport.context.moveTo(r.x, r.y);
// 	game.viewport.context.beginPath();
// 	game.viewport.context.strokeStyle = (this.coordinates.z == 1 ? 'yellow' : 'orange');
// 	game.viewport.context.arc(r.x, r.y, 2, 0, Math.PI * 2, false);
// 	game.viewport.context.stroke();
// }

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
