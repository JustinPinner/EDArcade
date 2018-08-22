const Adder_84 = {
    name: 'Adder_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 41,
    height: 62,
    scale: {
		x: 0.18,	// 41/233
		y: 0.20, 	// 62/311
	},
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 19, y: 6, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 20,
            y: 20,
            radius: 20
        },
        rear: {
            x: 20, 
            y: 46, 
            radius: 20
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 20,
                y: 62,
                size: 2
            }
        },
        front: {
            left: {
                x: 2,
                y: 32,
                size: 1
            },
            right: {
                x: 38,
                y: 32,
                size: 1
            }
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    },
    vertices: [
        {
            id: 0,
            x: 43,
            y: 4,
            connectsTo: [1,2,5]
        },
        {
            id: 1,
            x: 43,
            y: 134,
            connectsTo: [6,2,4]
        },
        {
            id: 2,
            x: 2,
            y: 226,
            connectsTo: [3]
        },
        {
            id: 3,
            x: 2,
            y: 308,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 43,
            y: 308,
            connectsTo: [9]
        },
        {
            id: 5,
            x: 190,
            y: 4,
            connectsTo: [6,7,9]
        },
        {
            id: 6,
            x: 190,
            y: 134,
            connectsTo: [7,9]
        },
        {
            id: 7,
            x: 228,
            y: 226,
            connectsTo: [8]
        },
        {
            id: 8,
            x: 228,
            y: 308,
            connectsTo: [9]
        },
        {
            id: 9,
            x: 190,
            y: 308,
            connectsTo: []
        },
        {
            id: 10,
            x: 74,
            y: 53,
            connectsTo: [11,13]
        },
        {
            id: 11,
            x: 157,
            y: 52,
            connectsTo: [12]
        },
        {
            id: 12,
            x: 157,
            y: 76,
            connectsTo: []
        },
        {
            id: 13,
            x: 74,
            y: 76,
            connectsTo: [12]
        }
    ]
};