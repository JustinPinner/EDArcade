// effect.js

class Effect extends GameObject {
	constructor(role, sprite) {
		super(GameObjectTypes.EFFECT, role.roleName, role);
		this._sprite = sprite;
		this._sprite.loadImage();						
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
	constructor(centre_x, centre_y) {
		super(EffectRoles.shipExplosion, new Sprite(centre_x, centre_y, 204.8, 204.8, EffectRoles.shipExplosion.roleName));
		this._coordinates = new Point2d(centre_x, centre_y);
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
		this._fsm = new FSM(this, FSMState.EFFECT);
		this.updateAndDraw = function() {
			this.updatePosition();
			this._fsm.execute();
		};
		this.draw = function() {
			var origin = this.drawOriginCentre;
			var cell = (this._sprite.cells.lastFrameDrawn || 0 * this._sprite.cells.frameWidth) / (this._sprite.cells.frameWidth * this._sprite.cells.frameColumns);
			var row = Math.floor(cell);
			var col = (cell - row) * this._sprite.cells.frameColumns;
			var spriteSheetMap = {
				x: col * this._sprite.cells.frameWidth,
				y: row * this._sprite.cells.frameHeight,
				width: this._sprite.cells.frameWidth,
				height: this._sprite.cells.frameHeight
			};
			game.viewport.context.save();
			game.viewport.context.translate(this._coordinates.x, this._coordinates.y);
			game.viewport.context.drawImage(this._sprite.image, 
				spriteSheetMap.x, 
				spriteSheetMap.y, 
				spriteSheetMap.width, 
				spriteSheetMap.height,
				0, 
				0, 
				this._geometry.width, 
				this._geometry.height);
			game.viewport.context.restore();
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
