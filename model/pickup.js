const flotsam = {
	name: 'flotsam',
    mass: 1,
    agility: 0,
    armour: 5,
    width: 50,
    height: 50
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
		this._heading = 270;
		this._payload = obj;
		this._sprite = new Sprite(0, 0, flotsam.width, flotsam.height, obj.iconName);
		this._sprite.loadImage();
		this._ttl = 10;	
		this._lastTtlTick = null;	
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
	set TTL(timeToLive) {
		this._ttl = timeToLive;
	}
	set lastTTLTick(millis) {
		this._lastTtlTick = millis;
	}
}
