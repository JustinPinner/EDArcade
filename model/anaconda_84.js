const Anaconda_84 = {
    name: 'Anaconda_84',
    mass: 400,
    agility: 0.1,
    armour: 945,
    maxSpeed: 183,
    boostSpeed: 244,
    width: 103, // 75ft
    height: 233,    // 170ft
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