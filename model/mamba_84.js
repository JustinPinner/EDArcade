const Mamba_84 = {
    name: 'Mamba_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 89,  // 65ft
    height: 75, // 55ft
    scale: {
        x: 0.28,   // 89/318
        y: 0.25    // 75/297
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
            x: 158,
            y: 3,
            connectsTo: [1,2,3,4]
        },
        {
            id: 1,
            x: 2,
            y: 291,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 76,
            y: 291,
            connectsTo: [3]
        },
        {
            id: 3,
            x: 240,
            y: 291,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 314,
            y: 291,
            connectsTo: []
        },
        {
            id: 5,
            x: 147,
            y: 140,
            connectsTo: [6,8]
        },
        {
            id: 6,
            x: 171,
            y: 140,
            connectsTo: []
        },
        {
            id: 7,
            x: 174,
            y: 117,
            connectsTo: [6,8]
        },
        {
            id: 8,
            x: 143,
            y: 117,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};