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
    constructor(host, thrusterData, particleData) {
        super(host, particleData || DEFAULTTHRUSTPARTICLE);
        this._host = host;
        this._orientation = thrusterData.orientation;
        this._model = thrusterData.coordinates;
        this._coordinates = {
            model: new Point2d(this._model.x, this._model.y)
        };
    }

    get coordinates() {
        // return {
        //     model: this._coordinates.model,
        //     environment: {
        //         x: this._host.coordinates.x + this._coordinates.model.x,
        //         y: this._host.coordinates.y + this._coordinates.model.y,
        //     },
        //     screen: rotatePoint(
        //         this._host.drawOriginCentre.x,
        //         this._host.drawOriginCentre.y,
        //         this._host.drawOrigin.x + this._coordinates.model.x,
        //         this._host.drawOrigin.y + this._coordinates.model.y,
        //         this._host.heading + 90
        //     )
        // };
        return {
            x: this._host.coordinates.origin.x + this._model.x,
            y: this._host.coordinates.origin.y + this._model.y
        }
    }

    get orientation() {
        return this._orientation;
    }
}

Thruster.prototype.reScale = function() {
    this._coordinates.model.x = this._host.scaleWidth(this._model.x);
    this._coordinates.model.y = this._host.scaleHeight(this._model.y);
}

Thruster.prototype.thrust = function() {
    const angle = this._orientation == ORIENTATION.aft ? this._host.thrustVector : this._host.heading;
    const radius = Math.max(Math.abs(this._host.thrust) / 4, 1);
    // emit primary particle
    const primaryParticle = DEFAULTTHRUSTPARTICLE;
    primaryParticle.radius = radius * 1.25;
    primaryParticle.emitPoint = {
        x: this._host.coordinates.origin.x + this._coordinates.model.x,
        y: this._host.coordinates.origin.y + this._coordinates.model.y
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
        x: this._host.coordinates.origin.x + this._coordinates.model.x,
        y: this._host.coordinates.origin.y + this._coordinates.model.y
    };
    this.__proto__.emit(secondaryParticle);
}

Thruster.prototype.draw = function() {
    const r = this.coordinates.screen;
    game.viewport.context.moveTo(r.x, r.y);
	game.viewport.context.beginPath();
	game.viewport.context.strokeStyle = 'white';
	game.viewport.context.arc(r.x, r.y, 2, 0, Math.PI * 2, false);
    game.viewport.context.stroke();
}