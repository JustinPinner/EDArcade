const SideWinder_84 = {
    name: 'Sidewinder_84',
    mass: 25,
    agility: 0.8,
    armour: 108,
    maxSpeed: 220,
    boostSpeed: 321,
    width: 89,
    height: 48,
    scale: {
        x: 0.27,
        y: 0.3
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 17, y: 8, z: 1},
                2: {x: 26, y: 8, z: 1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 8, y: 21, z: -1},
                2: {x: 35, y: 21,	z: -1}
            }
        }
    },
    collisionCentres: {
        leftFront: {
            x: 15,
            y: 10,
            radius: 10
        },
        rightFront:{
            x: 28,
            y: 10,
            radius: 10
        },
        leftRear: {
            x: 11,
            y: 20,
            radius: 10
        },
        midRear: {
            x: 22, 
            y: 20, 
            radius: 10
        },
        rightRear: {
            x: 33,
            y: 20,
            radius: 10
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 11,
                y: 28
            },  
            right: {
                x: 34,
                y: 28
            }
        },
        front: {
            left: {
                x: 11,
                y: 8
            },
            right: {
                x: 34,
                y: 8
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 88,
            y: 7,
            connectsTo: [1,2,4]
        },
        {
            id: 1,
            x: 3,
            y: 155,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 162,
            y: 155,
            connectsTo: [3,4]
        },
        {
            id: 3,
            x: 322,
            y: 155,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 236,
            y: 7,
            connectsTo: []
        }
    ],
    cells: {
        shieldStrike: {
            src: null,
            frames: null,
            frameRate: null
        },
        hullStrike: {
            src: null,
            frames: null,
            frameRate: null
        },
        boostEngage: {
            src: null,
            frames: null,
            frameRate: null
        },
        explode: {
            src: null,
            frames: null,
            frameRate: null
        }
    },
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++) {
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));
        }
    }		
};