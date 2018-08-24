const Cobra3_84 = {
    name: 'Cobra3_84',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 126,
    height: 92,
    scale: {
        x: 0.40,
        y: 0.44
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
            x: 157,
            y: 0,
            connectsTo: [1]
        },
        {
            id: 1,
            x: 157,
            y: 23,
            connectsTo: [2, 11]
        },
        {
            id: 2,
            x: 119,
            y: 23,
            connectsTo: [3,5,6]
        },
        {
            id: 3,
            x: 3,
            y: 135,
            connectsTo: [4,5]
        },
        {
            id: 4,
            x: 3,
            y: 164,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 32,
            y: 164,
            connectsTo: [6,7]
        },
        {
            id: 6,
            x: 157,
            y: 76,
            connectsTo: [2,8,11]
        },
        {
            id: 7,
            x: 157,
            y: 164,
            connectsTo: [6,8]
        },
        {
            id: 8,
            x: 286,
            y: 164,
            connectsTo: [9,10,11]
        },
        {
            id: 9,
            x: 310,
            y: 164,
            connectsTo: [10]
        },
        {
            id: 10,
            x: 310,
            y: 135,
            connectsTo: [11]
        },
        {
            id: 11,
            x: 195,
            y: 23,
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