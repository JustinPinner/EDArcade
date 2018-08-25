const Python_84 = {
    name: 'Python_84',
    mass: 350,
    agility: 0.6,
    armour: 468,
    maxSpeed: 234,
    boostSpeed: 305,
    width: 110,
    height: 178,
    scale: {
        x: 0.47,    // 110/233
        y: 0.3      // 178/609
    },
    hardpointGeometry: {
        WEAPON: {
            LARGE: { 
                1: {x: 59, y: 26,	z: -1},
                2: {x: 48, y: 58, z: -1},
                3: {x: 71, y: 58,	z: -1}
            },
            MEDIUM: {
                1: {x: 46, y: 38, z: 1},
                2: {x: 73, y: 38, z: 1}					
            },
            SMALL: {
                1: {x: 38, y: 75, z: 1},
                2: {x: 80, y: 75, z: 1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 59, y: 94, z: 1},
                2: {x: 59, y: 94, z: -1},
                3: {x: 41, y: 137, z: -1},
                4: {x: 78, y: 137, z: -1}
            }
        }
    },
    collisionCentres: {
        leftFront: {
            x: 50,
            y: 62,
            radius: 30
        },
        midFront: {
            x: 60,
            y: 20,
            radius: 15
        },
        rightFront:{
            x: 68,
            y: 62,
            radius: 30
        },
        leftRear: {
            x: 37,
            y: 125,
            radius: 40
        },
        midRear: {
            x: 60, 
            y: 150, 
            radius: 25
        },
        rightRear: {
            x: 78,
            y: 127,
            radius: 40
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 35,
                y: 170
            },  
            right: {
                x: 82,
                y: 170
            }
        },
        front: {
            left: {
                x: 31,
                y: 50
            },
            right: {
                x: 88,
                y: 50
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 118,
            y: 2,
            connectsTo: [1,2,3]
        },
        {
            id: 1,
            x: 2,
            y: 426,
            connectsTo: [2,3,4]
        },
        {
            id: 2,
            x: 118,
            y: 331,
            connectsTo: [4]
        },
        {
            id: 3,
            x: 228,
            y: 426,
            connectsTo: [2,4]
        },
        {
            id: 4,
            x: 118,
            y: 605,
            connectsTo: [5,6]
        },
        {
            id: 5,
            x: 56,
            y: 605,
            connectsTo: [1,4]
        },
        {
            id: 6,
            x: 177,
            y: 605,
            connectsTo: [3,4]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 4; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.LARGE.value, i));	
        }
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));				
        }
        for (var i = 1; i < 5; i++){
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));	
        }
    }		
};
