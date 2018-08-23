const Asp2_84 = {
    name: 'Asp2_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 96,  // 70ft
    height: 89, // 65ft
    scale: {
        x: 0.31,    // 96/311
        y: 0.29     // 89/311
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 29, y: 2, z: -1}
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
                x: 29,
                y: 52,
                size: 2
            }
        },
        front: {
            left: {
                x: 8,
                y: 17,
                size: 1
            },
            right: {
                x: 51,
                y: 17,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 96,
            y: 4,
            connectsTo: [1,2,6]
        },
        {
            id: 1,
            x: 1,
            y: 138,
            connectsTo: [2,3]
        },
        {
            id: 2,
            x: 57,
            y: 105,
            connectsTo: [4]
        },
        {
            id: 3,
            x: 54,
            y: 270,
            connectsTo: [5]
        },
        {
            id: 4,
            x: 155,
            y: 157,
            connectsTo: [5,8]
        },
        {
            id: 5,
            x: 155,
            y: 270,
            connectsTo: [9]
        },
        {
            id: 6,
            x: 216,
            y: 4,
            connectsTo: [7,8]
        },
        {
            id: 7,
            x: 310,
            y: 138,
            connectsTo: [8,9]
        },
        {
            id: 8,
            x: 254,
            y: 105,
            connectsTo: []
        },
        {
            id: 9,
            x: 251,
            y: 270,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};