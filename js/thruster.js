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
            (this._width < 1 || this._height < 1)
        ) {
            this._disposable = true;
            return;
        }
        const newWidth = particle._width * (particle._ttl / particle._lifeSpan);
        particle._width = newWidth;
        particle._height = newWidth;
    }
};

const ORIENTATION = {
    fore: "front",
    aft: "rear"
}



class Thruster extends ParticleEmitter {
    constructor(host, thrusterModel, particleData) {
        super(host, particleData || DEFAULTTHRUSTPARTICLE);
        this._host = host;
        this._orientation = thrusterModel.orientation;
        this._model = thrusterModel.coordinates;
        this._coordinates = new Point2d(this._model.x, this._model.y)
    }

    get coordinates() {
        return this._coordinates;
    }

    set coordinates(point2d) {
        this._coordinates = point2d
    }

    get orientation() {
        return this._orientation;
    }
}

Thruster.prototype.reScale = function() {
    this._coordinates.x = this._host.scaleWidth(this._model.x);
    this._coordinates.y = this._host.scaleHeight(this._model.y);
}

Thruster.prototype.thrust = function() {
    const angle = this._orientation == ORIENTATION.aft ? this._host.thrustVector : this._host.heading;
    const radius = Math.max(Math.abs(this._host.thrust) / 4, 1);
    // emit primary particle
    const primaryParticle = DEFAULTTHRUSTPARTICLE;
    primaryParticle.radius = radius * 1.25;
    primaryParticle.emitPoint = {
        x: this._host.coordinates.origin.x + this._coordinates.x,
        y: this._host.coordinates.origin.y + this._coordinates.y
    };
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
    secondaryParticle.emitPoint = {
        x: this._host.coordinates.origin.x + this._coordinates.x,
        y: this._host.coordinates.origin.y + this._coordinates.y
    };
    this.__proto__.emit(secondaryParticle);
}
