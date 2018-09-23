const Anaconda_84 = {
    name: 'Anaconda_84',
    mass: 400,
    agility: 0.1,
    armour: 945,
    maxSpeed: 183,
    boostSpeed: 244,
    width: 297,     // 75
    height: 610,    // 170
    scale: {
        x: 0.4, //0.343, // 103/300
        y: 0.45 //0.382 // 233/610
    },
    hardpointGeometry: {
        WEAPON: {
            HUGE: {
                1: {x: 147, y: 108, z: -1}
            },
            LARGE: { 
                1: {x: 43, y: 474,	z: 1},
                2: {x: 252, y: 474, z: 1},
                3: {x: 147, y: 469,	z: -1}
            },
            MEDIUM: {
                1: {x: 101, y: 194, z: -1},
                2: {x: 194, y: 194, z: -1},
                3: {x: 147, y: 327, z: -1},
                4: {x: 147, y: 491, z: 1}					
            },
            SMALL: {
                1: {x: 106, y: 172, z: 1},
                2: {x: 184, y: 172, z: 1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 147, y: 40, z: 1},
                2: {x: 147, y: 229, z: -1},
                3: {x: 74, y: 322, z: -1},
                4: {x: 219, y: 322, z: -1},
                5: {x: 147, y: 424, z: -1},
                6: {x: 54, y: 490, z: 1},
                7: {x: 249, y: 490, z: 1},
                8: {x: 147, y: 552, z: -1}
            }
        }
    },
    collisionCentres: {
        nose: {
            x: 147,
            y: 64,
            radius: 15
        },
        gunWhale: {
            x: 147,
            y: 119,
            radius: 35
        },
        midDeck:{
            x: 147,
            y: 208,
            radius: 59
        },
        bridge: {
            x: 147, 
            y: 429, 
            radius: 125
        },
        portTail: {
            x: 104,
            y: 292,
            radius: 45
        },
        starboardTail: {
            x: 194,
            y: 292,
            radius: 45
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 53,
                y: 508
            },
            right: {
                x: 238,
                y: 508
            }
        },
        front: {
            left: {
                x: 74,
                y: 239
            },
            right: {
                x: 218,
                y: 239
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 149,
            y: 1,
            connectsTo: [1,2,4,5]
        },
        {
            id: 1,
            x: 1,
            y: 456,
            connectsTo: [2] 
        },
        {
            id: 2, 
            x: 53, 
            y: 508,
            connectsTo: [3,4]
        },
        {
            id: 3,
            x: 150,
            y: 557,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 238,
            y: 508,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 290,
            y: 456,
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