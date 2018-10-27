
const GameObjectTypes = {
	SHIP: 'ship',
	ASTEROID: 'asteroid',
	PICKUP: 'pickup',
	ESCAPEPOD: 'escape-pod',
	MUNITION: 'munition',
	EFFECT: 'effect',
	PARTICLE: 'particle'
}
var nextObjId = 0;

class GameObject {
	constructor(type, model) {
		this._ready = false;
		this._disposable = false;
		this._id = nextObjId += 1;
		this._type = type;
		this._coordinates = {};
		this._speed = null;
		this._heading = null;
		this._direction = null;
		this._model = model;
		this._colour = null;
		this._velocity = new Vector2d(0, 0);
		this._sprite = null;
		this._name = model && model.name || null;
		this._width = model && model.width || null;
		this._height = model && model.height || null;
		this._vertices = [];
		this._scale = model && model.scale || null;
		this._mass = model && model.mass || null;
		this._collisionCentres = [];
	}
	// getters
	get type() {
		return this._type;
	}
	get name() {
	 	return this._name;
	} 
	get coordinates() {
		return this._coordinates;
	}
	get vertices() {
		return this._vertices;
	}
	get scale() {
		return this._scale;
	}
	get centre() {
		if (!this._coordinates) {
			return null;
		}
		return {
			x: this._coordinates.centre.x,
			y: this._coordinates.centre.y,
			z: this._coordinates.centre.z
		}
	}
	get width() {
		return this._width;
	}
	get height() {
		return this._height;
	}
	get velocity() {
		return this._velocity;
	}
	get speed() {
		return this._velocity.length * fps;
	}
	get mass() {
		return this._mass || 0;
	}
	get collisionCentres() {
		if (this._model && this._model.collisionCentres) {
			return this._model.collisionCentres;
		}
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
	get heading() {
		return this._heading;
	}
	// setters
	set coordinates(val) {
		this._coordinates = val;
	}
	set velocity(vector2d) {
		this._velocity = vector2d;
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
	set heading(val) {
		this._heading = val;
	}
	set width(val) {
		this._width = val;
	}
	set height(val) {
		this._height = val;
	}
}

GameObject.prototype.loadSprite = function() {
	if (!this._model || !this._model.width || !this._model.height || !this._model.width || !this._model.name || !this._model.cells) {
		game.log(new LoggedEvent('gameobject.prototype.loadSprite', 'called with no _model or with missing model settings'));
		return;
	}
	if (this._model && this._model.vertices) {
		// vertex-based objects don't have sprite representation
		return;
	}
	this._sprite = (model && model.vertices) ? null : model && new Sprite(0, 0, model.width, model.height, model.name, model.cells);
}

GameObject.prototype.loadVertices = function() {
	if (!this._model || !this._model.vertices) {
		game.log(new LoggedEvent('gameobject.prototype.loadVertices', 'called with no _model or _model.vertices'));
		return;
	}
	this._vertices = [];
	for (let v = 0; v < this._model.vertices.length; v += 1) {
		const vertex = this._model.vertices[v];
		const scaled = {
			connectsTo: vertex.connectsTo,
			id: vertex.id,
			x: this.scaleWidth(vertex.x),
			y: this.scaleHeight(vertex.y)
		};
		this._vertices.push(scaled);
	}
}

GameObject.prototype.loadCollisionCentres = function() {
	this._collisionCentres = [];
	for (const collCtrGrp in this._model.collisionCentres) {
		const collCtr = this._model.collisionCentres[collCtrGrp];
		this._collisionCentres.push(collCtr);
	}
}

GameObject.prototype.loadStatus = function() {
	if (!this._role || !this._role.initialStatus) {
		game.log(new LoggedEvent('gameobject.prototype.loadStatus', 'called with no _role or _role.initialStatus'));
		return;
	}
	this._status = this._role.initialStatus;
}

GameObject.prototype.init = function() {
	this._scale = this._model.scale || 1;
	this.loadSprite();
	this.loadVertices();
	this.loadCollisionCentres();
	this._ready = true;
}

GameObject.prototype.scaleWidth = function(dim) {
	if (this._model && this._model.scale && this._model.scale.x) {
		return dim * this.model.scale.x;
	}
	return dim;
}

GameObject.prototype.scaleHeight = function(dim) {
	if (this._model && this._model.scale && this._model.scale.y) {
		return dim * this.model.scale.y;
	}
	return dim;
}

GameObject.prototype.scalePoint = function(dim, dir) {
	if (this._model && this._model.scale) {
		if (dir.toLowerCase() == 'w' || 'width' || 'x') {
			 return dim * this._model.scale.x;
		}
		if (dir.toLowerCase() == 'h' || 'height' || 'y') {
			return dim * this._model.scale.y;
		}
	}
	return dim;
}

GameObject.prototype.updatePosition = function() {
	if (this._coordinates && this._velocity) {
		this._coordinates.x += isNaN(this._velocity.x) ? 0 : this._velocity.x;
		this._coordinates.y += isNaN(this._velocity.y) ? 0 : this._velocity.y;
	}
}

GameObject.prototype.collide = function(otherGameObject) {
	if (this.collisionCentres.length == 0 || otherGameObject.collisionCentres.length == 0) {
		return;
	}
	// iterate over each object's collision radii
	for (let myCentre = 0; myCentre < this.collisionCentres.length; myCentre++) {
		myCollisionCentre = this.collisionCentres[myCentre].scaled ? 
			this.collisionCentres[myCentre].scaled : 
			this.collisionCentres[myCentre];
		for (let theirCentre = 0; theirCentre < otherGameObject.collisionCentres.length; theirCentre++) {
			const theirCollisionCentre = otherGameObject.collisionCentres[theirCentre].scaled ?
				otherGameObject.collisionCentres[theirCentre].scaled : 
				otherGameObject.collisionCentres[theirCentre];
			const dx = myCollisionCentre.x - theirCollisionCentre.x;
			const dy = myCollisionCentre.y - theirCollisionCentre.y;
			const distance = Math.sqrt((dx * dx) + (dy * dy));		
			if (distance <= myCollisionCentre.radius + theirCollisionCentre.radius) {
				if (otherGameObject instanceof Pickup && this instanceof Ship) {
					if (otherGameObject.source !== this) {
						if (otherGameObject.payload instanceof Weapon) {
							this.collectWeapon(otherGameObject);
						} else {
							this.collectPowerUp(otherGameObject);
						}
						otherGameObject.disposable = true;
						return;
					}	
				} else if (this instanceof Pickup && otherGameObject instanceof Ship) {
					if (this.source !== otherGameObject) {
						if (this.payload instanceof Weapon) {
							otherGameObject.collectWeapon(this);							
						} else {
							otherGameObject.collectPowerUp(this);
						}
						this.disposable = true;
						return;
					}
				} else if (this instanceof Pickup || otherGameObject instanceof Pickup) {
					// pickups do not take/cause damage
					return;
				}
				if (this.mass && otherGameObject.mass) {
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
				}
				// Apply damage
				otherGameObject.takeHit(this);
				this.takeHit(otherGameObject);						
			}
		}
	}			
}

GameObject.prototype.collisionDetect = function(x, y) {
	if ((!this._fsm || !this._fsm.state || !this._fsm.state.detectCollisions) && this !== game.localPlayer.ship) {
		return;
	}
	const self = this;
	const candidates = game.objects.filter(function(obj) {
		if (obj === self || 
			obj instanceof Particle ||
			(obj instanceof Munition && obj.shooter === self) ||
			(self instanceof Munition && self.shooter === obj) ||
			(obj.fsm && obj.fsm.state && !obj.fsm.state.detectCollisions)) {
			return false;
		}
		if (obj instanceof ParticleEffect || self instanceof ParticleEffect) {
			return false;
		}
		// draw a circle to enclose the whole object
		const selfCirc = {
			x: self.coordinates.centre.x,
			y: self.coordinates.centre.y,
			r: (self.width > self.height ?  self.width : self.height) / 2
		};
		const objCirc = {
			x: obj.coordinates.centre.x,
			y: obj.coordinates.centre.y,
			r: (obj.width > obj.height ? obj.width : obj.height) / 2
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
GameObject.prototype.takeHit = function(source) {};

GameObject.prototype.isOnScreen = function() {
	return game.viewport.focussedObject === this || game.viewport.containsObject(this);
};

GameObject.prototype.draw = function() {
	if (!this._ready) return;
	if (!this.isOnScreen()) return;
	if (this.disposable) return;

	game.viewport.context.save();
	game.viewport.context.translate(this.drawOriginCentre.x, this.drawOriginCentre.y);
	if (this._heading) {
		game.viewport.context.rotate(degreesToRadians(this._heading + 90));
	}
	game.viewport.context.fillStyle = this._colour ? this._colour : '#ffffff';
	if (this._sprite && this._sprite.image) {
	  	game.viewport.context.drawImage(this._sprite.image, -this.width / 2, -this.height / 2, this.width, this.height);
	} else if(this.width !== 0 && this.height !== 0) {
	  	game.viewport.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
	}
	game.viewport.context.restore();
};

GameObject.prototype.updateAndDraw = function() {
	if (this.disposable) return;
	this.updatePosition();
	this.collisionDetect();
	this.draw();
	if (this._fsm && this._fsm.execute) {
		this._fsm.execute();
	}
};

GameObject.prototype.spawnRandomPowerUps = function(benefactor) {
	// more than one?
	const spawnPowerUpType = [Object.keys(PowerUpTypes)[Math.floor(rand(Object.keys(PowerUpTypes).length))]];	
	const pickup = new Pickup(PowerUpTypes[spawnPowerUpType].payload);
	const t = randInt(30);
	if (t > pickup.TTL) {
		pickup.TTL = t;
	}
	pickup.coordinates = benefactor.coordinates;
	pickup.velocity = new Vector2d(Math.random(benefactor.velocity.x * 0.8), Math.random(benefactor.velocity.y * 0.8));
	game.objects.push(pickup);
};