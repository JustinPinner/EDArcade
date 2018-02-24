const Cobra1_84 = {
    name: 'Cobra1_84',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 96,  // 70ft
    height: 75, // 55ft
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 46, y: 10, z: 1},
                2: {x: 75, y: 10, z: 1}					
            }
        }
    },
    collisionCentres: {
        leftFront: {
            x: 32,
            y: 16,
            radius: 15
        },
        rightFront:{
            x: 54,
            y: 16,
            radius: 15
        },
        leftRear: {
            x: 14,
            y: 38,
            radius: 15
        },
        midRear: {
            x: 44, 
            y: 38, 
            radius: 15
        },
        rightRear: {
            x: 72,
            y: 38,
            radius: 15
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 40,
                y: 56,
                size: 2    
            },
            right: {
                x: 79,
                y: 56,
                size: 2
            }
        },
        front: {
            left: {
                x: 28,
                y: 17,
                size: 2
            },
            right: {
                x: 92,
                y: 17,
                size: 2
            }
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
        }
    }
};