const FerdeLance_84 = {
    name: 'FerdeLance_84',
    mass: 400,
    agility: 0.1,
    armour: 945,
    maxSpeed: 183,
    boostSpeed: 244,
    width: 236,     // 45
    height: 607,    // 85
    scale: {
        x: 0.3,
        y: 0.34
    },
    hardpointGeometry: {
        WEAPON: {
            LARGE: { 
                1: {x: 118, y: 280, z: 1}
            },
            MEDIUM: {
                1: {x: 84, y: 241, z: -1},
                2: {x: 160, y: 241, z: -1}
            },
            SMALL: {
                1: {x: 58, y: 519, z: 1},
                2: {x: 174, y: 519, z: 1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 16, y: 454, z: -1},
                2: {x: 221, y: 454, z: -1},
                3: {x: 118, y: 576, z: -1},
                4: {x: 118, y: 45, z: 1}
            }
        }
    },
    collisionCentres: {
        nose: {
            x: 118,
            y: 100,
            radius: 15
        },
        gunWhale: {
            x: 118,
            y: 146,
            radius: 30
        },
        midDeck:{
            x: 118,
            y: 220,
            radius: 55
        },
        bridge: {
            x: 118, 
            y: 316, 
            radius: 80
        },
        tail: {
            x: 118,
            y: 462,
            radius: 113
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 118,
                y: 598,
                size: 3
            },
        },
        front: {
            left: {
                x: 36,
                y: 340,
                size: 2
            },
            right: {
                x: 201,
                y: 340,
                size: 2
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 118,
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
            x: 118,
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
            x: 126,
            y: 59,
            connectsTo: []
        },
        {
            id: 9,
            x: 112,
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
        self._hardpoints.push(new WeaponHardpoint(self, Size.LARGE.value, 1, PulseLaser, HardpointMountTypes.TURRET, 1));				
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));				
        }
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i));				
        }
        for (var i = 1; i < 5; i++){
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));	
        }
    }
};