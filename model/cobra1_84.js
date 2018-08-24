const Cobra1_84 = {
    name: 'Cobra1_84',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 96,  // 70ft
    height: 75, // 55ft
    scale: {
        x: 0.3, // 96/317
        y: 0.38 // 75/196
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 46, y: 10, z: 1},
                2: {x: 75, y: 10, z: 1}					
            }
        }
    },
    collisionCentres: {
        leftFront: {
            x: 32,
            y: 16,
            radius: 15
        },
        rightFront:{
            x: 54,
            y: 16,
            radius: 15
        },
        leftRear: {
            x: 14,
            y: 38,
            radius: 15
        },
        midRear: {
            x: 44, 
            y: 38, 
            radius: 15
        },
        rightRear: {
            x: 72,
            y: 38,
            radius: 15
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 40,
                y: 56,
                size: 2    
            },
            right: {
                x: 79,
                y: 56,
                size: 2
            }
        },
        front: {
            left: {
                x: 28,
                y: 17,
                size: 2
            },
            right: {
                x: 92,
                y: 17,
                size: 2
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
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
        }
    }
};