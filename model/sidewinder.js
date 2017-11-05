const SideWinder = {
    name: 'Sidewinder',
    mass: 25,
    agility: 0.8,
    armour: 108,
    maxSpeed: 220,
    boostSpeed: 321,
    width: 44,
    height: 30,
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