// model/gameObject.js
const GameObjectTypes = {
	SHIP: 'ship',
	ASTEROID: 'asteroid',
	PICKUP: 'pickup',
	ESCAPEPOD: 'escape-pod',
	MUNITION: 'munition'
}
var nextObjId = 0;

class GameObject {
	constructor(oType, oName, oRole) {
		this.id = nextObjId += 1;
		this.oType = oType;
		this.oName = oName;
		this.role = oRole;
		this.coordinates = {
			x: null,
			y: null,
			z: null
		};
		this.width = null;
		this.height = null;
		this._vx = 0;
		this._vy = 0;
		this.heading = null;
		this.direction = null;
		this.sprite = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			image: null
		};
		this.cellAnims = {};
	}
	// getters
	get objectType() {
		return this.oType;
	}
	get objectName() {
		return this.oName;
	} 
	get objectRole() {
		return this.oRole;
	}
	get x() {
		return this.coordinates.x;
	}
	get y() {
		return this.coordinates.y;
	}
	get cx() {
		return this.coordinates.x + this.width / 2;
	}
	get cy() {
		return this.coordinates.y + this.height / 2;
	}
	get vx() {
		return parseFloat(this._vx.toFixed(1));
	}
	get vy() {
		return parseFloat(this._vy.toFixed(1));
	}
	get drawOriginCentre() {
		return {
			x: this.cx + -environment.viewport.x,
			y: this.cy + -environment.viewport.y
		};
	}
	get coordinatesRotated() {
		return rotatePoint(this.cx, this.cy, this.x, this.y, this.heading);
	}
	// setters
	set x(val) {
		this.coordinates.x = val;
	}
	set y(val) {
		this.coordinates.y = val;
	}
	set vx(val) {
		this._vx = parseFloat(val);
	}
	set vy(val) {
		this._vy = parseFloat(val);
	}		
}

GameObject.prototype.updatePosition = function() {
	this.x += this.vx;
	this.y += this.vy;
}

GameObject.prototype.collisionDetect = function() {
	var self = this;
	var hitObjects = gameObjects.filter(function(obj) {
		return obj.oType === GameObjectTypes.SHIP && 
			obj !== self.hardpoint.parent &&
			self.x >= obj.x &&
			self.x <= obj.x + obj.width &&
			self.y >= obj.y &&
			self.y <= obj.y + obj.height;
	});
	if (hitObjects.length > 0) {
		hitObjects[0].takeDamage(this);
		self.fsm.transition('despawn');
	}
}

// abstract
GameObject.prototype.takeDamage = function(source) {};

GameObject.prototype.isOnScreen = function(debug) {
	return environment.viewport.contains(this.x, this.y, this.width, this.height);	
};

GameObject.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) return;

	environment.viewport.ctx.save();
	environment.viewport.ctx.translate(this.drawOrigin.x, this.drawOrigin.y);
	environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
	if (this.sprite && this.sprite.image) {
	  environment.viewport.ctx.drawImage(this.sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
	} else {
	  environment.viewport.ctx.fillStyle = this.colour ? this.colour : '#ffffff';
	  environment.viewport.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
	environment.viewport.ctx.restore();
};
