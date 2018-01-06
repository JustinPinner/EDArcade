const DEFAULTTHRUSTPARTICLE = {
    rgba: {red: 246, green: 238, blue: 7, alpha: 0.8},
    emitSpeed: 0,
    radius: 3,
    ttl: 4,
    fadeIn: false,
    fadeOut: true,
    onUpdated: function(particle) {
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
        return this._coordinates;
    }

    get hostRelativeCoordinates() {
        const p = new Point2d(
            (this._host.coordinates.x + this._coordinates.x), 
            (this._host.coordinates.y + this._coordinates.y)
        );
        p.rotate(this._host.centre, this._host.heading + 90);
        return p;
    }
}

Thruster.prototype.thrust = function() {
    const angle = this._orientation == ORIENTATION.aft ? this._host.thrustVector : this._host.heading;
    const radius = Math.max(this._host.thrust / 2, 1);
    // emit primary particle
    const primary = DEFAULTTHRUSTPARTICLE;
    primary.radius = radius * 1.5;
    primary.emitPoint = this.hostRelativeCoordinates;
    primary.emitAngle = angle;	
    this.__proto__.emit(primary);
    // emit secondary effect particle
    const secondary = DEFAULTTHRUSTPARTICLE;
    secondary.rgba.green = randRangeInt(170, 200);
    secondary.rgba.alpha = 0.5;
    secondary.emitAngle = angle + rand(10, true);
    secondary.radius = radius;
    this.__proto__.emit(secondary);
}
