const Viper_84 = {
    name: 'Viper_84',
    mass: 50,
    agility: 0.4,
    armour: 126,
    maxSpeed: 315,
    boostSpeed: 394,
    width: 68,
    height: 75,
    scale: {
        x: 0.21,
        y: 0.23
    },
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
    thrusters: {
        rear: {
            left: {
                x: 5,
                y: 53
            },  
            right: {
                x: 42,
                y: 53
            }
        },
        front: {
            left: {
                x: 14,
                y: 17
            },
            right: {
                x: 33,
                y: 17
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 161,
            y: 4,
            connectsTo: [1,5,4]
        },
        {
            id: 1,
            x: 2,
            y: 317,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 88,
            y: 317,
            connectsTo: [3,5]
        },
        {
            id: 3,
            x: 236,
            y: 317,
            connectsTo: [5,4]
        },
        {
            id: 4,
            x: 318,
            y: 317,
            connectsTo: [0]
        },
        {
            id: 5,
            x: 161,
            y: 157,
            connectsTo: [0]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i));
            self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
            self._hardpoints.push(new UtilityHardpoint(self, Size.SMALL.value, i));
        }
    }
};