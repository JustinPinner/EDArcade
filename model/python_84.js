const Python_84 = {
    name: 'Python_84',
    mass: 350,
    agility: 0.6,
    armour: 468,
    maxSpeed: 234,
    boostSpeed: 305,
    width: 234,     // 80
    height: 610,    // 130
    scale: {
        x: 0.34,
        y: 0.21
    },
    hardpointGeometry: {
        WEAPON: {
            LARGE: { 
                1: {x: 117, y: 163,	z: -1},
                2: {x: 75, y: 501, z: 1},
                3: {x: 159, y: 501,	z: 1}
            },
            MEDIUM: {
                1: {x: 69, y: 192, z: -1},
                2: {x: 165, y: 192, z: -1}					
            },
            SMALL: {
                1: {x: 39, y: 415, z: -1},
                2: {x: 195, y: 415, z: -1}				
            }
        }
    },
    collisionCentres: {
        nose: {
            x: 117,
            y: 120,
            radius: 30
        },
        midFront: {
            x: 117,
            y: 250,
            radius: 60
        },
        midRear: {
            x: 117, 
            y: 480, 
            radius: 90
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 86,
                y: 602,
                size: 3
            },  
            right: {
                x: 148,
                y: 602,
                size: 3
            }
        },
        front: {
            left: {
                x: 37,
                y: 300,
                size: 1
            },
            right: {
                x: 197,
                y: 300,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 117,
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
            x: 117,
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
            x: 117,
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
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i));				
        }
    }		
};
