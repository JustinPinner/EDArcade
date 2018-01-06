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

    get orientation() {
        return this._orientation;
    }
}

Thruster.prototype.thrust = function() {
    const angle = this._orientation == ORIENTATION.aft ? this._host.thrustVector : this._host.heading;
    const radius = Math.max(Math.abs(this._host.thrust) / 2, 1);
    // emit primary particle
    const particles = DEFAULTTHRUSTPARTICLE;
    particles.radius = radius * 1.5;
    particles.emitPoint = this.hostRelativeCoordinates;
    particles.emitAngle = angle;	
    this.__proto__.emit(particles);
    // emit secondary effect particle
    particles.rgba.green = randRangeInt(170, 200);
    particles.rgba.alpha = 0.5;
    particles.emitAngle = angle + rand(10, true);
    particles.radius = radius;
    this.__proto__.emit(particles);
}
