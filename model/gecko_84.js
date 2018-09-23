const Gecko_84 = {
    name: 'Gecko_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 320,     // 65
    height: 214,    // 40
    scale: {
        x: 0.3,
        y: 0.34
    },
    hardpointGeometry: {
        WEAPON: {
            MEDIUM: {
                1: { x: 160, y: 35, z: -1 }
            }
        },
        UTILITY: {
            SMALL: {
                1: { x: 62, y: 159, z: -1 },
                2: { x: 258, y: 159, z: -1 }
            }
        }
    },
    collisionCentres: {
        front: {
            x: 160,
            y: 112,
            radius: 100
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 160,
                y: 208,
                size: 3
            }
        },
        front: {
            left: {
                x: 79,
                y: 69,
                size: 1
            },
            right: {
                x: 241,
                y: 69,
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
        self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};