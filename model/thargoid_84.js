const Thargoid_84 = {
    name: 'Thargoid_84',
    mass: 350,
    agility: 0.6,
    armour: 468,
    maxSpeed: 234,
    boostSpeed: 305,
    width: 247,
    height: 247,
    scale: {
        x: 0.82,
        y: 0.82
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
            x: 123,
            y: 80,
            connectsTo: [1,8]
        },
        {
            id: 1,
            x: 82,
            y: 120,
            connectsTo: [2,9]
        },
        {
            id: 2,
            x: 82,
            y: 177,
            connectsTo: [10,3]
        },
        {
            id: 3,
            x: 123,
            y: 219,
            connectsTo: [11,4]
        },
        {
            id: 4,
            x: 177,
            y: 219,
            connectsTo: [12,5]
        },
        {
            id: 5,
            x: 218,
            y: 177,
            connectsTo: [13,6]
        },
        {
            id: 6,
            x: 218,
            y: 120,
            connectsTo: [14,7]
        },
        {
            id: 7,
            x: 177,
            y: 80,
            connectsTo: [15,0]
        },
        {
            id: 8,
            x: 91,
            y: 5,
            connectsTo: [9]
        },
        {
            id: 9,
            x: 4,
            y: 89,
            connectsTo: [10]
        },
        {
            id: 10,
            x: 4,
            y: 208,
            connectsTo: [11]
        },
        {
            id: 11,
            x: 91,
            y: 295,
            connectsTo: [12]
        },
        {
            id: 12,
            x: 208,
            y: 295,
            connectsTo: [13]
        },
        {
            id: 13,
            x: 293,
            y: 208,
            connectsTo: [14]
        },
        {
            id: 14,
            x: 293,
            y: 89,
            connectsTo: [15]
        },
        {
            id: 15,
            x: 208,
            y: 5,
            connectsTo: [8]
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
