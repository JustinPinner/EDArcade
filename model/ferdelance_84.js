const FerdeLance_84 = {
    name: 'FerdeLance_84',
    mass: 400,
    agility: 0.1,
    armour: 945,
    maxSpeed: 183,
    boostSpeed: 244,
    width: 62, // 45ft
    height: 116,    // 85ft
    scale: {
        x: 0.26,    // 62/237
        y: 0.19     // 116/607
    },
    hardpointGeometry: {
        WEAPON: {
            HUGE: {
                1: {x: 58, y: 72, z: -1}
            },
            LARGE: { 
                1: {x: 56, y: 35,	z: -1},
                2: {x: 44, y: 84, z: 1},
                3: {x: 70, y: 84,	z: 1}
            },
            MEDIUM: {
                1: {x: 40, y: 25, z: 1},
                2: {x: 74, y: 25, z: 1},
                3: {x: 47, y: 245, z: -1},
                4: {x: 69, y: 245, z: -1}					
            },
            SMALL: {
                1: {x: 37, y: 225, z: 1},
                2: {x: 78, y: 225, z: 1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 48, y: 207, z: 1},
                2: {x: 68, y: 207, z: 1},
                3: {x: 17, y: 266, z: 1},
                4: {x: 99, y: 266, z: 1},
                5: {x: 44, y: 84, z: -1},
                6: {x: 70, y: 84, z: -1},
                7: {x: 17, y: 266, z: -1},
                8: {x: 99, y: 266, z: -1}
            }
        }
    },
    collisionCentres: {
        nose: {
            x: 57,
            y: 18,
            radius: 15
        },
        gunWhale: {
            x: 57,
            y: 62,
            radius: 30
        },
        midDeck:{
            x: 57,
            y: 120,
            radius: 45
        },
        bridge: {
            x: 57, 
            y: 187, 
            radius: 55
        },
        portTail: {
            x: 37,
            y: 265,
            radius: 40
        },
        starboardTail: {
            x: 78,
            y: 265,
            radius: 40
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 42,
                y: 293
            },
            right: {
                x: 75,
                y: 293
            }
        },
        front: {
            left: {
                x: 26,
                y: 79
            },
            right: {
                x: 88,
                y: 79
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 124,
            y: 5,
            connectsTo: [1,5]
        },
        {
            id: 1,
            x: 4,
            y: 464,
            connectsTo: [2,3]
        },
        {
            id: 2,
            x: 70,
            y: 600,
            connectsTo: [3,4]
        },
        {
            id: 3,
            x: 124,
            y: 504,
            connectsTo: [4,5]
        },
        {
            id: 4,
            x: 163,
            y: 600,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 234,
            y: 464,
            connectsTo: []
        },
        {
            id: 6,
            x: 154,
            y: 406,
            connectsTo: [7,8]
        },
        {
            id: 7,
            x: 198,
            y: 347,
            connectsTo: [8]
        },
        {
            id: 8,
            x: 132,
            y: 59,
            connectsTo: []
        },
        {
            id: 9,
            x: 118,
            y: 59,
            connectsTo: [10,11]
        },
        {
            id: 10,
            x: 42,
            y: 347,
            connectsTo: [11]
        },
        {
            id: 11,
            x: 88,
            y: 406,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.HUGE.value, 1));
        for (var i = 1; i < 4; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.LARGE.value, i));				
        }
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));				
        }
        for (var i = 3; i < 5; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i));				
        }
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i));				
        }
        for (var i = 1; i < 9; i++){
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));	
        }
    }
};