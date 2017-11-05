const Viper3 = {
    name: 'Viper3',
    mass: 50,
    agility: 0.4,
    armour: 126,
    maxSpeed: 315,
    boostSpeed: 394,
    width: 48,
    height: 56,
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 18, y: 7, z: 1},
                2: {x: 27, y: 7, z: 1}				
            },
            MEDIUM: {
                1: {x: 17, y: 23, z: -1},
                2: {x: 29, y: 23, z: -1}
            }
        },
        UTILITY: {
            SMALL: {
                1: {x: 22.5, y: 45, z: 1},
                2: {x: 22.5, y: 45, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 22,
            y: 15,
            radius: 15
        },
        rearLeft:{
            x: 14,
            y: 40,
            radius: 15
        },
        rearRight: {
            x: 32,
            y: 40,
            radius: 15
        },
    },
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i));
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));
        }
    }
};