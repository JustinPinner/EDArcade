const flotsam = {
	name: 'flotsam',
    mass: 1,
    agility: 0,
    armour: 5,
    width: 10,
    height: 10
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
		this._payload = obj;
	}
	get payload() {
		return this._payload;
	}
}
