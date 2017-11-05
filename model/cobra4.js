const Cobra4 = {
    name: 'Cobra4',
    mass: 180,
    agility: 0.6,
    armour: 216,
    maxSpeed: 282,
    boostSpeed: 402,
    width: 96,
    height: 65,
    hardpointGeometry: {
        WEAPON: {
            MEDIUM: {
                1: {x: 41, y: 7, z: 1},
                2: {x: 55, y: 7, z: 1}
            },
            SMALL: {
                1: {x: 38, y: 10, z: -1},
                2: {x: 58, y: 10, z: -1},
                3: {x: 48, y: 20, z: 1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 16, y: 48, z: -1},
                2: {x: 79, y: 48, z: -1}
            }
        }
    },
    collisionCentres: {
        leftFront: {
            x: 32,
            y: 24,
            radius: 15
        },
        midFront: {
            x: 48,
            y: 9,
            radius: 12
        },
        rightFront:{
            x: 62,
            y: 24,
            radius: 15
        },
        leftRear: {
            x: 16,
            y: 45,
            radius: 18
        },
        midRear: {
            x: 48, 
            y: 45, 
            radius: 18
        },
        rightRear: {
            x: 80,
            y: 45,
            radius: 18
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 4; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i));				
        }
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));
        }												
    }		
};