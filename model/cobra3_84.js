const Cobra3_84 = {
    name: 'Cobra3_84',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 315,     // 130
    height: 169,    // 65
    scale: {
        x: 0.3,
        y: 0.34
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 157, y: 33, z: -1},
                2: {x: 157, y: 160, z: -1}					
            }
        }
    },
    collisionCentres: {
        centre: {
            x: 157,
            y: 90,
            radius: 75
        },
        left: {
            x: 60,
            y: 131,
            radius: 45
        },
        right: {
            x: 255,
            y: 131,
            radius: 45
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 111,
                y: 164,
                size: 2    
            },
            right: {
                x: 204,
                y: 164,
                size: 2
            }
        },
        front: {
            left: {
                x: 75,
                y: 63,
                size: 1
            },
            right: {
                x: 240,
                y: 63,
                size: 1
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