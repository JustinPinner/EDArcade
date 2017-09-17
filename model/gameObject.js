
const GameObjectTypes = {
	SHIP: 'ship',
	ASTEROID: 'asteroid',
	PICKUP: 'pickup',
	ESCAPEPOD: 'escape-pod',
	MUNITION: 'munition',
	EFFECT: 'effect'
}
var nextObjId = 0;

class GameObject {
	constructor(type, name, role) {
		this._disp = false;
		this._id = nextObjId += 1;
		this._type = type;
		this._name = name;
		this._role = role;
		this._coordinates = null;
		this._velocity = new Vector2d(0, 0);
		this._geometry = null;
		this._speed = null;
		this._heading = null;
		this._direction = null;
		this._sprite = null;
	}
	// getters
	get type() {
		return this._type;
	}
	get name() {
		return this._name;
	} 
	get role() {
		return this._role;
	}
	get coordinates() {
		return this._coordinates;
	}
	get centre() {
		return this._coordinates && new Point(
			this._coordinates.x + (this._geometry ? (this._geometry.width / 2) : 0),
			this._coordinates.y + (this._geometry ? (this._geometry.height / 2) : 0)
		);
	}
	get velocity() {
		return this._velocity;
	}
	get drawOriginCentre() {
		return {
			x: this.centre.x + -environment.viewport.x,
			y: this.centre.y + -environment.viewport.y
		};
	}
	get coordinatesRotated() {
		return rotatePoint(this.cx, this.cy, this.x, this.y, this.heading);
	}
	// setters
	set coordinates(point2d) {
		this._coordinates = point2d;
	}
	set velocity(vector2d) {
		this._velocity = vector2d;
	}
	set role(role) {
		this._role = role;
	}
	set name(name) {
		this._name = name;
	}		
}

GameObject.prototype.updatePosition = function() {
	this._coordinates.x += this._velocity.x;
	this._coordinates.y += this._velocity.y;
}

GameObject.prototype.collisionDetect = function(x, y) {
	var self = this,
		x = x || self._coordinates.x,
		y = y || self._coordinates.y;
	var hitObjects = gameObjects.filter(function(obj) {
		return obj.oType === GameObjectTypes.SHIP && 
			obj !== self &&
			x >= obj.coordinates.x &&
			x <= obj.coordinates.x + obj.geometry.width &&
			y >= obj.coordinates.y &&
			y <= obj.coordinates.y + obj.geometry.height;
	});
	if (hitObjects.length > 0) {
		debugger;
		hitObjects[0].takeDamage(this);
		self.takeDamage(hitObjects[0]);
	}
}

// abstract
GameObject.prototype.takeDamage = function(source) {};

GameObject.prototype.isOnScreen = function(debug) {
	return environment.viewport.contains(this._coordinates.x, this._coordinates.y, this._geometry.width, this._geometry.height);	
};

GameObject.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) return;

	environment.viewport.ctx.save();
	environment.viewport.ctx.translate(this.drawOrigin.x, this.drawOrigin.y);
	environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
	if (this.sprite && this.sprite.image) {
	  environment.viewport.ctx.drawImage(this.sprite.image, -this.geometry.width / 2, -this.geometry.height / 2, this.geometry.width, this.geometry.height);
	} else {
	  environment.viewport.ctx.fillStyle = this.colour ? this.colour : '#ffffff';
	  environment.viewport.ctx.fillRect(-this.geometry.width / 2, -this.geometry.height / 2, this.geometry.width, this.geometry.height);
	}
	environment.viewport.ctx.restore();
};
