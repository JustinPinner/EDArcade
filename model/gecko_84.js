const Gecko_84 = {
    name: 'Gecko_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 89, // 65ft
    height: 55,  // 40ft
    scale: {
        x: 0.28,    // 89/320
        y: 0.26     // 55/214
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 0, y: 18, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 18,
            y: 12,
            radius: 18
        },
        rear: {
            x: 18, 
            y: 30, 
            radius: 18
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 18,
                y: 46,
                size: 2
            }
        },
        front: {
            left: {
                x: 2,
                y: 18,
                size: 1
            },
            right: {
                x: 32,
                y: 18,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 125,
            y: 4,
            connectsTo: [1,2,5]
        },
        {
            id: 1,
            x: 6,
            y: 175,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 93,
            y: 210,
            connectsTo: [3]
        },
        {
            id: 3,
            x: 228,
            y: 210,
            connectsTo: [4,5]
        },
        {
            id: 4,
            x: 314,
            y: 175,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 200,
            y: 4,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};