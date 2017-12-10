// particle.js

class Particle extends GameObject {
    constructor(radius, coordinates, speed, heading, ttl, onUpdated, fadeIn, fadeOut) {
        super(GameObjectTypes.PARTICLE);
        this._model = {
            height: radius, 
            width: radius
        };
        this._coordinates = coordinates;
        this._speed = speed;
        this._heading = heading;
        this._lastTick = 0;
        this._lifeSpan = ttl;
        this._ttl = ttl;
        this._lastTtlTick = 0;
        this._alpha = 1.0;		        
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
			x: this._coordinates.x + -game.viewport.coordinates.x,
			y: this._coordinates.y + -game.viewport.coordinates.y
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
        this._alpha = this._ttl / this._lifeSpan; //1.0 / (this._lifeSpan * this._ttl);
    }
    if (this._fadeIn) {
        this._alpha = (1.0 / this._lifeSpan) * (this._lifeSpan - this._ttl);
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
	if (!this.isOnScreen(debug)) return;
	game.viewport.context.fillStyle="rgba(255,255,255," + this._alpha + ")";
    game.viewport.context.beginPath();
    game.viewport.context.arc(this.drawOriginCentre.x, this.drawOriginCentre.y, this.geometry.width, 0, Math.PI * 2);
    game.viewport.context.closePath();
    game.viewport.context.fill();
};
