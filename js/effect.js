// effect.js

class Effect extends GameObject {
	constructor(role, sprite) {
		super(GameObjectTypes.EFFECT, null, role.roleName, role);
		this._sprite = sprite;
		this._sprite.loadImage();						
	}
	get sprite() {
		return this._sprite;
	}
}

var EffectRoles = {
	shipExplosion: {
		roleName: 'Explosion01_5x5',
		initialState: FSMState.EFFECT,
		initialStatus: '',
		threatStatus: [],
		targetStatus: []
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
			lastFrameDrawn: 0
		};
		this._geometry = {
			width: this._sprite.width,
			height: this._sprite.height
		};
		this._coordinates = new Point2d(drawOriginCentre.x - (this._sprite.width / 2), drawOriginCentre.y - (this._sprite.height / 2));
		this._fsm = new FSM(this, FSMState.EFFECT);
		this.updateAndDraw = function() {
			this.updatePosition();
			this._fsm.execute();
		};
		this.draw = function() {
			// TODO: fix drawOriginCentre for effects
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
				this._geometry.width, 
				this._geometry.height);
			this._sprite.cells.lastFrameDrawn = this._sprite.cells.lastFrameDrawn === this._sprite.cells.frameColumns * this._sprite.cells.frameRows ? 0 : this._sprite.cells.lastFrameDrawn += 1;
			if (this.complete()) this._fsm.transition(FSMState.DIE);
		};
		this.complete = function() {
			return this._sprite.cells.lastFrameDrawn >= this._sprite.cells.frameRows * this._sprite.cells.frameColumns && !this._sprite.cells.framesRepeat;
		};
	}
}


var EffectTypes = {
	shipExplosion: ShipExplosionEffect 
}
