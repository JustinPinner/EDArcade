const flotsam = {
	name: 'flotsam',
    mass: 1,
    agility: 0,
    armour: 5,
    width: 50,
    height: 50
}

const ShieldBoost = {
	iconName: 'ShieldBoost',
	execute: function(recipient) {
		let effect = randRangeInt(30, 100);
		let required = 100 - recipient.shield.charge;
		let apply = 0;
		if(required > 0) {
			apply = effect - required <= 0 ? effect : effect - required
			recipient.shield.charge += apply;
			effect -= apply;
			recipient.fsm && recipient.fsm.motivate();
		}
	}			
}

const HullRepair = {
	iconName: 'HullRepair',
	execute: function(recipient) {
		let effect = randRangeInt(30, 100);
		let required = 100 - recipient.hullIntegrity;
		let apply = 0;
		if(required > 0) {
			apply = effect - required <= 0 ? effect : effect - required
			recipient.hullIntegrity += apply;
			effect -= apply;
			recipient.fsm && recipient.fsm.motivate();
		}
		if(effect > 0) {
			required = recipient.model.armour - recipient.armour;
			if(required > 0) {
				apply = effect - required <= 0 ? effect : effect - required;
				recipient.armour += apply;
				effect -= apply;
				recipient.fsm && recipient.fsm.motivate();
			}				
		}
	}
}

const SpeedBoost = {
	iconName: 'SpeedBoost',
	execute: function(recipient) {
		//TODO!	
	}	
}

const PowerUpTypes = {
	SHIELD: {
		payload: ShieldBoost
	},
	ARMOUR: {
		payload: HullRepair
	},
	BOOST: {
		payload: SpeedBoost
	}
}

const pickupRoles = {
	DRIFTER: {
		roleName: 'Drifter',
		initialState: FSMState.NEUTRAL,
		initialStatus: null,
		threatStatus: null,
		targetStatus: null
	}
}

/*
	Generic pickup (loot) constructor
*/
class Pickup extends GameObject {
	constructor(obj) {
		super(GameObjectTypes.PICKUP, flotsam, flotsam.name, pickupRoles.DRIFTER);
		this._source = null;
		this._heading = 270;
		this._payload = obj;
		this._sprite = new Sprite(0, 0, flotsam.width, flotsam.height, obj.iconName);
		this._sprite.loadImage();
		this._ttl = 10;	// default (min.) - override maybe	
		this._lastTtlTick = null;	
	}
	get source() {
		return this._source;
	}
	get payload() {
		return this._payload;
	}
	get TTL() {
		return this._ttl;
	}
	get lastTTLTick() {
		return this._lastTtlTick;
	}
	set source(obj) {
		this._source = obj;
	}
	set TTL(timeToLive) {
		this._ttl = timeToLive;
	}
	set lastTTLTick(millis) {
		this._lastTtlTick = millis;
	}
}

class PowerUp extends GameObject {
	constructor(obj) {
		super(obj);
		const rndTtl = randInt(30);
		this._ttl = rndTtl > 10 ? rndTtl : 10;
	}
}
