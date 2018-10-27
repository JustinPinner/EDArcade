// particle.js

class Particle extends GameObject {
    constructor(rgba, radius, coordinates, speed, heading, ttl, onUpdated, fadeIn, fadeOut) {
        super(GameObjectTypes.PARTICLE);
        this._model = {
            height: radius, 
            width: radius
        };
        this._rgba = rgba || {red: 255, green: 255, blue: 255, alpha: 1.0}
        this._coordinates = coordinates;
        this._speed = speed;
        this._heading = heading;
        this._lastTick = 0;
        this._lifeSpan = ttl;
        this._ttl = ttl;
        this._lastTtlTick = 0;
        this._fadeIn = fadeIn ? fadeIn : false;
        this._fadeOut = fadeOut ? fadeOut : false;
        this._onUpdated = onUpdated;
        this._velocity = new Vector2d(dir_x(speed, heading), dir_y(speed, heading));
    }
	get TTL() {
		return this._ttl;
	}
	get lastTTLTick() {
		return this._lastTtlTick;
    }
	get drawOriginCentre() {
		return {
			x: this._coordinates.x,
			y: this._coordinates.y
		};
	}
    
	set TTL(timeToLive) {
        this._ttl = timeToLive;
	}
	set lastTTLTick(millis) {
		this._lastTtlTick = millis;
    }    
}

Particle.prototype.updateAndDraw = function(debug) {
    if (this.disposable) return;
    this.updatePosition();
    if (this._fadeOut) {
        this._rgba.alpha = this._ttl / this._lifeSpan;
    }
    if (this._fadeIn) {
        this._rgba.alpha = (1.0 / this._lifeSpan) * (this._lifeSpan - this._ttl);
    }
    this.draw(debug);
	if (this._fsm && this._fsm.execute) {
		this._fsm.execute();
    }
    if (this._onUpdated) {
        this._onUpdated(this);
    }
};

Particle.prototype.draw = function(debug) {
    if (!this._ready) return;
    if (!this.isOnScreen(debug)) return;
	game.viewport.context.fillStyle="rgba(" + this._rgba.red + "," + this._rgba.green + "," + this._rgba.blue + "," + this._rgba.alpha + ")";
    game.viewport.context.beginPath();
    game.viewport.context.arc(this.drawOriginCentre.x, this.drawOriginCentre.y, this.width, 0, Math.PI * 2);
    game.viewport.context.closePath();
    game.viewport.context.fill();
};

class ParticleEmitter {
    constructor(hostObject, setupData) {
        this._host = hostObject;
        this._particleRgba = setupData.rgba;
        this._particleRadius = setupData.radius;
        this._fadeIn = setupData.fadeIn;
        this._fadeOut = setupData.fadeOut;
        this._particleTtl = setupData.ttl;
        this._emitSpeed = setupData.speed;
        this._emitAngle = setupData.angle;
        this._onUpdated = setupData.onUpdated;
    }
}

ParticleEmitter.prototype.emit = function(particleData) {
    const particle = new Particle(
        particleData.rgba || this._particleRgba,
        particleData.radius || this._particleRadius, 
        particleData.emitPoint,
        particleData.emitSpeed || this._emitSpeed, 
        particleData.emitAngle || this._emitAngle, 
        particleData.ttl || this._particleTtl, 
        particleData.onUpdated || this._onUpdated, 
        particleData.fadeIn || this._fadeIn, 
        particleData.fadeOut || this._fadeOut
    );
    particle.init();
    game.objects.push(particle);
};
