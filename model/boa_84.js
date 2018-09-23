const Boa_84 = {
    name: 'Boa_84',
    mass: 400,
    agility: 0.1,
    armour: 945,
    maxSpeed: 183,
    boostSpeed: 244,
    width: 322,     // 65
    height: 628,    // 115
    scale: {
        x: 0.4,
        y: 0.45
    },
    hardpointGeometry: {
        WEAPON: {
            LARGE: { 
                1: {x: 125, y: 208,	z: 1},
                2: {x: 209, y: 208, z: 1},
                3: {x: 71, y: 460, z: -1},
                4: {x: 253, y: 460, z: -1}
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 161, y: 79, z: -1},
                2: {x: 161, y: 337, z: 1},
                3: {x: 161, y: 543, z: 1},
            }
        }
    },
    collisionCentres: {
        nose1: {
            x: 161,
            y: 60,
            radius: 15
        },
        nose2: {
            x: 161,
            y: 90,
            radius: 20
        },
        gunWhale: {
            x: 161,
            y: 150,
            radius: 40
        },
        midDeck:{
            x: 161,
            y: 240,
            radius: 65
        },
        bridge: {
            x: 161, 
            y: 360, 
            radius: 95
        },
        portTail: {
            x: 30,
            y: 558,
            radius: 28
        },
        midTail: {
            x: 161,
            y: 490,
            radius: 135
        },
        starboardTail: {
            x: 287,
            y: 558,
            radius: 28
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 90,
                y: 598,
                size: 3
            },
            right: {
                x: 230,
                y: 598,
                size: 3
            }
        },
        front: {
            left: {
                x: 83,
                y: 336
            },
            right: {
                x: 246,
                y: 336
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 161,
            y: 2,
            connectsTo: [1,2,4,5]
        },
        {
            id: 1,
            x: 4,
            y: 570,
            connectsTo: [2,3]
        },
        {
            id: 2,
            x: 99,
            y: 515,
            connectsTo: [3,4]
        },
        {
            id: 3,
            x: 161,
            y: 622,
            connectsTo: [4,5]
        },
        {
            id: 4,
            x: 228,
            y: 515,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 316,
            y: 570,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 5; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.LARGE.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));				
        }
        for (var i = 1; i < 4; i++){
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));	
        }
    }
};