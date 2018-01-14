// effect.js

class Effect extends GameObject {
	constructor(role, sprite) {
		super(GameObjectTypes.EFFECT, sprite, role.roleName, role);
		this._sprite = sprite;
		this._sprite.loadImage();						
		this._coordinates = new Point2d(this._sprite.coordinates.x - (this._sprite.width / 2), this._sprite.coordinates.y - (this._sprite.height / 2));
		this._fsm = new FSM(this, FSMState.EFFECTPLAY);
		this.draw = function() {
			var origin = this._coordinates;
			var cell = ((this._sprite.cells.lastFrameDrawn || 0) * this._sprite.cells.frameWidth) / (this._sprite.cells.frameWidth * this._sprite.cells.frameColumns);
			var row = Math.floor((this._sprite.cells.lastFrameDrawn || 0) / this._sprite.cells.frameColumns);
			var col = (cell - row) * this._sprite.cells.frameColumns;
			var spriteSheetMap = {
				x: col * this._sprite.cells.frameWidth,
				y: row * this._sprite.cells.frameHeight,
				width: this._sprite.cells.frameWidth,
				height: this._sprite.cells.frameHeight
			};
			game.viewport.context.drawImage(this._sprite.image, 
				spriteSheetMap.x, 
				spriteSheetMap.y, 
				spriteSheetMap.width, 
				spriteSheetMap.height,
				this._coordinates.x, 
				this._coordinates.y, 
				this.geometry.width, 
				this.geometry.height);
			this._sprite.cells.lastFrameDrawn = this._sprite.cells.lastFrameDrawn === this._sprite.cells.frameColumns * this._sprite.cells.frameRows ? 0 : this._sprite.cells.lastFrameDrawn += 1;
			if (this.complete()) this._fsm.transition(FSMState.DESPAWN);
		};
		this.complete = function() {
			return this._sprite.cells.lastFrameDrawn >= this._sprite.cells.frameRows * this._sprite.cells.frameColumns && 
				!this._sprite.cells.framesRepeat;
		};
	}
	get sprite() {
		return this._sprite;
	}
}

var EffectRoles = {
	shipExplosion: {
		roleName: 'Explosion01_5x5',
		initialState: FSMState.EFFECTPLAY,
		initialStatus: '',
		threatStatus: [],
		targetStatus: []
	},
	laserStrike: {
		roleName: 'LaserStrike',
		initialState: FSMState.EFFECTPLAY,
		initialStatus: '',
		threatStatus: [],
		targetStatus: [],
		onUpdated: function(particle) {
			particle._speed -= 3;
			particle._velocity.x = dir_x(particle._speed, particle._heading);
			particle._velocity.y = dir_y(particle._speed, particle._heading); 
		},
		setup: function(generator) {
			generator._particlesGenerated = 0;
		},
		execute: function(generator) {
			if (generator._particlesGenerated >= generator._particleCount) {
				generator._fsm.transition(FSMState.DESPAWN);
				return;
			}
			const radius = randRangeInt(1,3);
			const angle = ((360 / generator._particleCount) - generator._particlesGenerated) * generator._particlesGenerated;
			const ttl = generator._secondsToLive ? generator._secondsToLive : randRangeInt(3, 5);
			const speed = randRangeInt(10, 40);
			const rgba = {red: randRangeInt(7,14), green: randRangeInt(230, 250), blue: randRangeInt(220, 240), alpha: 1.0};
			game.objects.push(new Particle(rgba, radius, generator._coordinates, speed, angle, ttl, generator._onUpdated, fadeOut = true));
			generator._particlesGenerated += 1;
		}
	}
}

class ShipExplosionEffect extends Effect {
	constructor(drawOriginCentre) {
		super(EffectRoles.shipExplosion, new Sprite(drawOriginCentre.x, drawOriginCentre.y, 204.8, 204.8, EffectRoles.shipExplosion.roleName));
		this._sprite.cells = {
			frameRate: 15,
			frameWidth: 204.8,
			frameHeight: 204.8,
			frameColumns: 5,
			frameRows: 5,
			framesRepeat: false,
			lastFrameDrawn: 0
		};
	}
}

class ParticleEffect extends GameObject {
	// A particle effect is a gameobject that spawns particles (as other gameobjects)
	// - a particle generator if you like
	constructor(effectRole, coordinates, secondsToLive, particlesToGenerate, initialState) {
		super(GameObjectTypes.EFFECT);	
		this._coordinates = coordinates;
		this._setupFunction = effectRole.setup;
		this._executeFunction = effectRole.execute;
		this._startFunction = effectRole.start;
		this._stopFunction = effectRole.stop;
		this._onUpdated = effectRole.onUpdated;
		this._ttl = secondsToLive;
		this._secondsToLive = secondsToLive;
		this._particleCount = particlesToGenerate || randRangeInt(3, 5);
		this._particlesGenerated = 0;
		this.setup = function() {
			const self = this;
			if(self._setupFunction) {
				self._setupFunction(self);
			}
			this._fsm.state.execute = self.execute.bind(self);
		};
		this.execute = function() {
			const self = this;
			if(self._executeFunction) {
				self._executeFunction(self);
			}
		};
		this.start = function(data) {
			const self = this;
			if(self._startFunction) {
				self._startFunction(self, data);
			}
		};
		this.stop = function(data) {
			const self = this;
			if(self._stopFunction) {
				self._stopFunction(self, data);
			}
		};		
		this._fsm = new FSM(this, initialState || FSMState.EFFECTPLAY);
		this._fsm.state.execute = this.setup.bind(this);			
	}
	get particleCount() {
		return this._particleCount;
	}
	get TTL() {
		return this._ttl;
	}
	set particleCount(particlesToGenerate) {
		this._particleCount = particlesToGenerate;
	}
	set TTL(timeLeft) {
		this._ttl = timeLeft;
	}
}

class LaserStrike extends ParticleEffect {
	constructor(coordinates) {
		const secondsToLive = 3;
		const particlesToGenerate = 6;
		super(EffectRoles.laserStrike, coordinates, secondsToLive, particlesToGenerate);
	}
}

var EffectTypes = {
	shipExplosion: ShipExplosionEffect,
	laserStrike: LaserStrike
}
