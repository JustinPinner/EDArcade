// model/gameObject.js
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
		this.vx = 0;
		this.vy = 0;
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
	get drawOrigin() {
		return {
			x: this.x + (environment.viewport.x * -1),
			y: this.y + (environment.viewport.y * -1)
		};
	}
	// setters
	set x(val) {
		this.coordinates.x = val;
	}
	set y(val) {
		this.coordinates.y = val;
	}		
}

GameObject.prototype.isOnScreen = function(debug) {
	return environment.viewport.contains(this.x, this.y, this.width, this.height);	
};

GameObject.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) return;

	environment.viewport.ctx.save();
	environment.viewport.ctx.translate(this.drawOrigin.x, this.drawOrigin.y);
	environment.viewport.ctx.rotate(degreesToRadians(this.heading + 90));
	try {
	  environment.viewport.ctx.drawImage(this.sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
	} catch(e) {
	  environment.viewport.ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
	environment.viewport.ctx.restore();
};
