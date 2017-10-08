
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
		this._colour = null;
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
		return this._coordinates && new Point2d(
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
	get geometry() {
		return {
			width: this._model ? this._model.width : 0,
			height: this._model ? this._model.height : 0
		};
	}
	get colour() {
		return this._colour;
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
	set colour(colourVal) {
		this._colour = colourVal;
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
	var hitObjects = game.objects.filter(function(obj) {
		return obj.type === GameObjectTypes.SHIP && 
			obj !== self &&
			x >= obj.coordinates.x &&
			x <= obj.coordinates.x + obj.geometry.width &&
			y >= obj.coordinates.y &&
			y <= obj.coordinates.y + obj.geometry.height;
	});
	if (hitObjects.length > 0) {
		//debugger;
		hitObjects[0].takeDamage(this);
		self.takeDamage(hitObjects[0]);
	}
}

// abstract
GameObject.prototype.takeDamage = function(source) {};

GameObject.prototype.isOnScreen = function(debug) {
	return game.viewport.contains(this._coordinates.x, this._coordinates.y, this._geometry.width, this._geometry.height);	
};

GameObject.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) return;

	game.viewport.context.save();
	game.viewport.context.translate(this.drawOriginCentre.x, this.drawOriginCentre.y);
	game.viewport.context.rotate(degreesToRadians(this._heading + 90));
	if (this._sprite && this._sprite.image) {
	  game.viewport.context.drawImage(this._sprite.image, -this._geometry.width / 2, -this._geometry.height / 2, this._geometry.width, this._geometry.height);
	} else {
	  game.viewport.context.fillStyle = this._colour ? this._colour : '#ffffff';
	  game.viewport.context.fillRect(-this._geometry.width / 2, -this._geometry.height / 2, this._geometry.width, this._geometry.height);
	}
	game.viewport.context.restore();
};
