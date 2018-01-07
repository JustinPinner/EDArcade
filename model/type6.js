const Type6 = {
    name: 'Type6',
    mass: 155,
    agility: 0.3,
    armour: 324,
    maxSpeed: 223,
    boostSpeed: 355,
    width: 54,
    height: 101,
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 16, y: 29, z: -1},
                2: {x: 36, y: 29, z: -1}				
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 26, y: 86, z: 1},
                2: {x: 8, y: 24, z: -1},
                3: {x: 45, y: 24, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 26,
            y: 26,
            radius: 27
        },
        mid:{
            x: 26,
            y: 52,
            radius: 27
        },
        rear: {
            x: 26,
            y: 78,
            radius: 27
        },
    },
    thrusters: {
        rear: {
            left: {
                x: 12,
                y: 99
            },  
            right: {
                x: 41,
                y: 99
            }
        },
        front: {
            left: {
                x: 12,
                y: 10
            },
            right: {
                x: 41,
                y: 10
            }
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));	
        }
        for (var i = 1; i < 4; i++){
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));	
        }
    }
};