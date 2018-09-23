const Worm_84 = {
    name: 'Worm_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 224,      // 30 (one of these must be wrong in the docs)
    height: 326,     // 30
    scale: {
        x: 0.14,
        y: 0.15
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 112, y: 78, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 112,
            y: 54,
            radius: 45
        },
        centre: {
            x: 112,
            y: 160,
            radius: 70
        },
        rear: {
            x: 112, 
            y: 247, 
            radius: 90
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 112,
                y: 320,
                size: 2
            }
        },
        front: {
            left: {
                x: 41,
                y: 149,
                size: 1
            },
            right: {
                x: 183,
                y: 149,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 83,
            y: 5,
            connectsTo: [1,2]
        },
        {
            id: 1,
            x: 57,
            y: 72,
            connectsTo: [2,3]
        },
        {
            id: 2,
            x: 93,
            y: 95,
            connectsTo: [8,4]
        },
        {
            id: 3,
            x: 3,
            y: 321,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 93,
            y: 321,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 126,
            y: 321,
            connectsTo: [8,6]
        },
        {
            id: 6,
            x: 219,
            y: 321,
            connectsTo: [7]
        },
        {
            id: 7,
            x: 160,
            y: 72,
            connectsTo: [8,9]
        },
        {
            id: 8,
            x: 126,
            y: 95,
            connectsTo: [9]
        },
        {
            id: 9,
            x: 134,
            y: 5,
            connectsTo: [0]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};