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
	}
	get payload() {
		return this._payload;
	}
}
