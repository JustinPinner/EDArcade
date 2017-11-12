
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
	constructor(type, model, name, role) {
		this._model = model;
		this._disposable = false;
		this._id = nextObjId += 1;
		this._type = type;
		this._name = name;
		this._role = role;
		this._coordinates = null;
		this._velocity = new Vector2d(0, 0);
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
			this._coordinates.x + (this.geometry ? (this.geometry.width / 2) : 0),
			this._coordinates.y + (this.geometry ? (this.geometry.height / 2) : 0)
		);
	}
	get velocity() {
		return this._velocity;
	}
	get speed() {
		const currentPos = this.centre;
		const nextPos = new Point2d(currentPos.x + this._velocity.x, currentPos.y + this._velocity.y);	
		return Math.abs(distanceBetweenPoints(currentPos, nextPos) * fps);
	}
	get drawOriginCentre() {
		return {
			x: this.centre.x + -game.viewport.coordinates.x,
			y: this.centre.y + -game.viewport.coordinates.y
		};
	}
	get coordinatesRotated() {
		return rotatePoint(this.centre.x, this.centre.y, this._coordinates.x, this._coordinates.y, this._heading);
	}
	get geometry() {
		return {
			width: this._model ? this._model.width : 0,
			height: this._model ? this._model.height : 0
		};
	}
	get mass() {
		return this._model.mass || 0;
	}
	get collisionCentres() {
		const _centres = [];
		if (this._model.collisionCentres) {
			for (const collCtrGrp in this._model.collisionCentres) {
				const collCtr = this._model.collisionCentres[collCtrGrp];
				const _newXY = rotatePoint(this.drawOriginCentre.x, this.drawOriginCentre.y, this.drawOrigin.x + collCtr.x, this.drawOrigin.y + collCtr.y, this._heading + 90);
				_centres.push({
					x: _newXY.x,
					y: _newXY.y,
					radius: collCtr.radius
				})
			}			
		} else {
			const collCtr = {
				x: this.drawOriginCentre.x,
				y: this.drawOriginCentre.y,
				radius: (this.geometry.width > this.geometry.height ? this.geometry.width : this.geometry.height) / 2
			};
			_centres.push(collCtr);
		}
		return _centres;
	}
	get colour() {
		return this._colour;
	}
	get disposable() {
		return this._disposable;
	}
	get model() {
		return this._model;
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
	set disposable(disp) {
		this._disposable = disp;
	}
}

GameObject.prototype.updatePosition = function() {
	if (this._coordinates && this._velocity) {
		this._coordinates.x += this._velocity.x;
		this._coordinates.y += this._velocity.y;
	}
}

GameObject.prototype.collide = function(otherGameObject) {
	if (this.collisionCentres.length == 0 || otherGameObject.collisionCentres.length == 0) {
		return;
	}
	// iterate over each object's collision radii
	for (const myCentre in this.collisionCentres) {
		for (const theirCentre in otherGameObject.collisionCentres) {
			const dx = this.collisionCentres[myCentre].x - otherGameObject.collisionCentres[theirCentre].x;
			const dy = this.collisionCentres[myCentre].y - otherGameObject.collisionCentres[theirCentre].y;
			const distance = Math.sqrt((dx * dx) + (dy * dy));		
			if (distance <= this.collisionCentres[myCentre].radius + otherGameObject.collisionCentres[theirCentre].radius) {
				if (otherGameObject instanceof Pickup && 
					otherGameObject.payload instanceof Weapon && 
					this instanceof Ship && 
					otherGameObject.payload.parent.parent !== this) {
					this.collectWeapon(otherGameObject);
					otherGameObject.disposable = true;
					return;
				} else if (this instanceof Pickup && 
					this.payload instanceof Weapon && 
					otherGameObject instanceof Ship &&
					this.payload.parent.parent !== otherGameObject) {
					otherGameObject.collectWeapon(this);
					this.disposable = true;
					return;
				} else if (this instanceof Pickup || otherGameObject instanceof Pickup) {
					// pickups do not take/cause damage
					return;
				}
				// Apply basic motion transference algorithm
				// from https://gamedevelopment.tutsplus.com/tutorials/when-worlds-collide-simulating-circle-circle-collisions--gamedev-769)
				// a = shape1.vX * (shape1.mass - shape2.mass)
				// b = (2 * shape2.mass * shape2.vX)
				// c = (shape1.mass + shape2.mass)
				//
				// newVelX = (a + b) / c;
				//						
				// d = shape1.vY * (shape1.mass - shape2.mass)
				// e = (2 * shape2.mass * shape2.vY)
				// f = (shape1.mass + shape2.mass)
				//
				// newVelY = (d + e) / f;
				const newVelX1 = ((this.velocity.x * (this.mass - otherGameObject.mass)) +
					(2 * otherGameObject.mass * otherGameObject.velocity.x)) /
					(this.mass + otherGameObject.mass);
				const newVelY1 = ((this.velocity.y * (this.mass - otherGameObject.mass)) +
					(2 * otherGameObject.mass * otherGameObject.velocity.y)) /
					(this.mass + otherGameObject.mass);
				const newVelX2 = ((otherGameObject.velocity.x * (otherGameObject.mass - this.mass)) +
					(2 * this.mass * this.velocity.x)) /
					(this.mass + otherGameObject.mass);
				const newVelY2 = ((otherGameObject.velocity.y * (otherGameObject.mass - this.mass)) +
					(2 * this.mass * this.velocity.y)) /
					(this.mass + otherGameObject.mass);
				this.velocity.x = newVelX1;
				this.velocity.y = newVelY1;
				otherGameObject.velocity.x = newVelX2;
				otherGameObject.velocity.y = newVelY2;
				// Apply damage
				otherGameObject.takeDamage(this);
				this.takeDamage(otherGameObject);						
			}
		}
	}			
}


GameObject.prototype.collisionDetect = function(x, y) {
	if (this._fsm && this._fsm.state && !this._fsm.state.detectCollisions) {
		return;
	}
	const self = this,
		_x = x || self._coordinates.x,
		_y = y || self._coordinates.y;
	const candidates = game.objects.filter(function(obj) {
		if (obj === self || 
			(obj instanceof Munition && obj.shooter === self) ||
			(self instanceof Munition && self.shooter === obj) ||
			(obj.fsm && obj.fsm.state && !obj.fsm.state.detectCollisions)) {
			return false;
		}
		// draw a circle to enclose the whole object
		const selfCirc = {
			x: self.centre.x,
			y: self.centre.y,
			r: (self.geometry.width > self.geometry.height ?  self.geometry.width : self.geometry.height) / 2
		};
		const objCirc = {
			x: obj.centre.x,
			y: obj.centre.y,
			r: (obj.geometry.width > obj.geometry.height ? obj.geometry.width : obj.geometry.height) / 2
		};
		const dx = selfCirc.x - objCirc.x;
		const dy = selfCirc.y - objCirc.y;
		const distance = Math.sqrt((dx * dx) + (dy * dy));		
	
		return distance <= selfCirc.r + objCirc.r;
	});
	if (candidates.length > 0) {
		for (var c = 0; c < candidates.length; c++) {
			self.collide(candidates[c]);
		}
	}
}

// abstract
GameObject.prototype.takeDamage = function(source) {};

GameObject.prototype.isOnScreen = function(debug) {
	return game.viewport.contains(this._coordinates.x, this._coordinates.y, this.geometry.width, this.geometry.height);	
};

GameObject.prototype.draw = function(debug) {
	if (!this.isOnScreen(debug)) return;

	game.viewport.context.save();
	game.viewport.context.translate(this.drawOriginCentre.x, this.drawOriginCentre.y);
	game.viewport.context.rotate(degreesToRadians(this._heading + 90));
	if (this._sprite && this._sprite.image) {
	  game.viewport.context.drawImage(this._sprite.image, -this.geometry.width / 2, -this.geometry.height / 2, this.geometry.width, this.geometry.height);
	} else {
	  game.viewport.context.fillStyle = this._colour ? this._colour : '#ffffff';
	  game.viewport.context.fillRect(-this.geometry.width / 2, -this.geometry.height / 2, this.geometry.width, this.geometry.height);
	}
	game.viewport.context.restore();
};

GameObject.prototype.updateAndDraw = function(debug) {
	this.updatePosition();
	this.collisionDetect();
	this.draw(debug);
	if (this._fsm && this._fsm.execute) {
		this._fsm.execute();
	}
};