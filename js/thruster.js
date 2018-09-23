const DEFAULTTHRUSTPARTICLE = {
    rgba: {red: 246, green: 238, blue: 7, alpha: 0.8},
    emitSpeed: 1,
    radius: 3,
    ttl: 4,
    fadeIn: false,
    fadeOut: true,
    onUpdated: function(particle) {
        if (
            (this._ttl && this._ttl <= 0) || 
            (this._rgba.alpha && this._rgba.alpha <= 0) || 
            (this._model.width < 1 || this.model.height < 1)
        ) {
            this._disposable = true;
            return;
        }
        const newWidth = particle._model.width * (particle._ttl / particle._lifeSpan);
        particle._model.width = newWidth;
        particle._model.height = newWidth;
    }
};

const ORIENTATION = {
    fore: "front",
    aft: "rear"
}



class Thruster extends ParticleEmitter {
    constructor(hostObject, thrusterData, particleData) {
        super(hostObject, particleData || DEFAULTTHRUSTPARTICLE);
        this._host = hostObject;
        this._orientation = thrusterData.orientation;
        this._coordinates = thrusterData.coordinates;
    }

    get coordinates() {
        return new Point2d(
            this._host.coordinates.x + this._coordinates.x,
            this._host.coordinates.y + this._coordinates.y
        );
    }

    get nozzleCoordinates() {
        return rotatePoint(
            this._host.drawOriginCentre.x, 
            this._host.drawOriginCentre.y, 
            this._host.drawOrigin.x + this._coordinates.x, 
            this._host.drawOrigin.y + this._coordinates.y, 
            this._host.heading + 90
        ); 
    }

    get orientation() {
        return this._orientation;
    }
}

Thruster.prototype.reScale = function() {
    this._coordinates.x = this._host.scaleWidth(this._coordinates.x);
    this._coordinates.y = this._host.scaleHeight(this._coordinates.y);
}

Thruster.prototype.thrust = function() {
    const angle = this._orientation == ORIENTATION.aft ? this._host.thrustVector : this._host.heading;
    const radius = Math.max(Math.abs(this._host.thrust) / 4, 1);
    // emit primary particle
    const primaryParticle = DEFAULTTHRUSTPARTICLE;
    primaryParticle.radius = radius * 1.25;
    primaryParticle.emitPoint = this.nozzleCoordinates;
    primaryParticle.emitAngle = angle;
    primaryParticle.emitSpeed = 1;
    this.__proto__.emit(primaryParticle);
    // emit secondary effect particle
    const secondaryParticle = DEFAULTTHRUSTPARTICLE;    
    secondaryParticle.rgba.green = randRangeInt(170, 200);
    secondaryParticle.rgba.alpha = 0.5;
    secondaryParticle.emitAngle = angle + rand(10, true);
    secondaryParticle.radius = radius;
    secondaryParticle.emitSpeed = 3;
    this.__proto__.emit(secondaryParticle);
}

Thruster.prototype.draw = function() {
    const r = this.nozzleCoordinates;
    game.viewport.context.moveTo(r.x, r.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = 'white';
	game.viewport.context.arc(r.x, r.y, 2, 0, Math.PI * 2, false);
    game.viewport.context.stroke();
}