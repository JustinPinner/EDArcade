const Cobra3 = {
    name: 'Cobra3',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 88,
    height: 57,
    hardpointGeometry: {
        WEAPON: {
            MEDIUM: {
                1: {x: 38, y: 7, z: 1},
                2: {x: 49, y: 7, z: 1}					
            },
            SMALL: {
                1: {x: 32, y: 15, z: -1},
                2: {x: 55, y: 15, z: -1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 7, y: 40, z: -1},
                2: {x: 80, y: 40, z: -1}
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
                x: 33,
                y: 55    
            },
            right: {
                x: 55,
                y: 55
            }
        },
        front: {
            left: {
                x: 18,
                y: 14,
            },
            right: {
                x: 70,
                y: 14
            }
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i));
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));
        }
    }
};