// effect.js

class Effect extends GameObject {
	constructor(role) {
		super(GameObjectTypes.EFFECT, role.roleName, role);
		this.cellAnims = {
			spriteSheet: '../image/' + this.oName + '.png',
			frameRate: null,
			frameWidth: 800,
			frameHeight: 600,
			framesWide: 10,
			framesHigh: 8,
			lastFrameDrawn: 0,
			framesRepeat: false
		};		
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
		super(EffectRoles.shipExplosion);
		this.cellAnims.frameRate = 15;
		this.cellAnims.frameWidth = 204.8;
		this.cellAnims.frameHeight = 204.8;
		this.cellAnims.frameColumns = 5;
		this.cellAnims.frameRows = 5;
		this.sprite.image = imageService.loadImage(this.cellAnims.spriteSheet);
		this.sprite.width = this.cellAnims.frameWidth;
		this.sprite.height = this.cellAnims.frameHeight;
		this.x = centre_x - (this.cellAnims.frameWidth / 2);
		this.y = centre_y - (this.cellAnims.frameHeight / 2);
		this.geometry = {
			width: this.sprite.width,
			height: this.sprite.height
		};
		this.fsm = new FSM(this, FSMState.EFFECT);
		this.updateAndDraw = function() {
			this.updatePosition();
			this.fsm.execute();
		};
		this.draw = function() {
			var origin = this.drawOriginCentre;
			var cell = (this.cellAnims.lastFrameDrawn * this.cellAnims.frameWidth) / (this.cellAnims.frameWidth * this.cellAnims.frameColumns);
			var row = Math.floor(cell);
			var col = (cell - row) * this.cellAnims.frameColumns;
			var spriteSheetMap = {
				x: col * this.cellAnims.frameWidth,
				y: row * this.cellAnims.frameHeight,
				width: this.cellAnims.frameWidth,
				height: this.cellAnims.frameHeight
			};
			environment.viewport.ctx.save();
			environment.viewport.ctx.translate(this.x, this.y);
			environment.viewport.ctx.drawImage(this.sprite.image, 
				spriteSheetMap.x, 
				spriteSheetMap.y, 
				spriteSheetMap.width, 
				spriteSheetMap.height,
				0, 
				0, 
				this.geometry.width, 
				this.geometry.height);
			environment.viewport.ctx.restore();
			this.cellAnims.lastFrameDrawn = this.cellAnims.lastFrameDrawn === this.cellAnims.frameColumns * this.cellAnims.frameRows ? 0 : this.cellAnims.lastFrameDrawn += 1;
			if (this.complete()) this.fsm.transition(FSMState.DIE);
		};
		this.complete = function() {
			return this.cellAnims.lastFrameDrawn >= this.cellAnims.frameRows * this.cellAnims.frameColumns && !this.cellAnims.framesRepeat;
		};
	}
}


var EffectTypes = {
	shipExplosion: ShipExplosionEffect 
}
