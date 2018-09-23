const Cobra1_84 = {
    name: 'Cobra1_84',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 318,     // 70
    height: 196,    // 55
    scale: {
        x: 0.22,
        y: 0.28
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 159, y: 27, z: -1}
            }
        }
    },
    collisionCentres: {
        left: {
            x: 98,
            y: 103,
            radius: 90
        },
        right:{
            x: 220,
            y: 103,
            radius: 90
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 100,
                y: 189,
                size: 2    
            },
            right: {
                x: 218,
                y: 189,
                size: 2
            }
        },
        front: {
            left: {
                x: 54,
                y: 44,
                size: 1
            },
            right: {
                x: 264,
                y: 44,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 109,
            y: 4,
            connectsTo: [1,4,8]
        },
        {
            id: 1,
            x: 4,
            y: 80,
            connectsTo: [2,3]
        },
        {
            id: 2,
            x: 35,
            y: 174,
            connectsTo: [3]
        },
        {
            id: 3,
            x: 77,
            y: 192,
            connectsTo: [4,5]
        },
        {
            id: 4,
            x: 158,
            y: 107,
            connectsTo: [8,5]
        },
        {
            id: 5,
            x: 239,
            y: 192,
            connectsTo: [6,7]
        },
        {
            id: 6,
            x: 282,
            y: 174,
            connectsTo: [7]
        },
        {
            id: 7,
            x: 311,
            y: 80,
            connectsTo: [8]
        },
        {
            id: 8,
            x: 205,
            y: 4,
            connectsTo: []
        }

    ],
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 2; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
        }
    }
};