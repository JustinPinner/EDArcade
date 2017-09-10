
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
	constructor(oType, oName, oRole) {
		this.disposable = false;
		this.id = nextObjId += 1;
		this.oType = oType;
		this.oName = oName;
		this.role = oRole;
		this.coordinates = {
			x: null,
			y: null,
			z: null
		};
		this.geometry = null;
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
		this.phaserObj = null;
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
		return this.coordinates.x + (this.geometry ? (this.geometry.width / 2) : 0);
	}
	get cy() {
		return this.coordinates.y + (this.geometry ? (this.geometry.height / 2) : 0);
	}
	get vx() {
		return parseFloat(this._vx.toFixed(1));
	}
	get vy() {
		return parseFloat(this._vy.toFixed(1));
	}
	get drawOrigin() {
		return {
			x: this.coordinates.x + -environment.viewport.x,
			y: this.coordinates.y + -environment.viewport.y
		}
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
	get phaserObject() {
		return this.phaserObj;
	}
	// setters
	set x(val) {
		this.coordinates.x = val;
	}
	set y(val) {
		this.coordinates.y = val;
	}
	set vx(val) {
		const floatVal = parseFloat(val);
		if (this.phaserObject) {
			this.phaserObject.body.velocity.x = floatVal;
		}
		this._vx = floatVal;
	}
	set vy(val) {
		const floatVal = parseFloat(val);
		if (this.phaserObject) {
			this.phaserObject.body.velocity.y = floatVal;
		}
		this._vy = floatVal;
	}
	set phaserObject(obj) {
		this.phaserObj = obj;
	}		
}

GameObject.prototype.updatePosition = function() {
	this.x += this.vx;
	this.y += this.vy;
}

GameObject.prototype.collisionDetect = function(x, y) {
	var self = this;
	var hitObjects = gameObjects.filter(function(obj) {
		return obj.oType === GameObjectTypes.SHIP && 
			obj !== self.hardpoint.parent &&
			x >= obj.x &&
			x <= obj.x + obj.geometry.width &&
			y >= obj.y &&
			y <= obj.y + obj.geometry.height;
	});
	if (hitObjects.length > 0) {
		hitObjects[0].takeDamage(this);
		self.takeDamage(hitObjects[0]);
	}
}

// abstract
GameObject.prototype.takeDamage = function(source) {};

GameObject.prototype.isOnScreen = function(debug) {
	return environment.viewport.contains(this.x, this.y, this.geometry.width, this.geometry.height);	
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
