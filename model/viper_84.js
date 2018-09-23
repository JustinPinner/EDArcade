const Viper_84 = {
    name: 'Viper_84',
    mass: 50,
    agility: 0.4,
    armour: 126,
    maxSpeed: 315,
    boostSpeed: 394,
    width: 300,     // 50
    height: 320,    // 55
    scale: {
        x: 0.16,
        y: 0.17
    },
    hardpointGeometry: {
        WEAPON: {
            MEDIUM: {
                1: {x: 150, y: 65, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 150,
            y: 90,
            radius: 45
        },
        mid: {
            x: 150,
            y: 218,
            radius: 100
        },
        rearLeft:{
            x: 70,
            y: 275,
            radius: 45
        },
        rearRight: {
            x: 230,
            y: 275,
            radius: 45
        },
    },
    thrusters: {
        rear: {
            left: {
                x: 100,
                y: 315
            },  
            right: {
                x: 200,
                y: 315
            }
        },
        front: {
            left: {
                x: 100,
                y: 125
            },
            right: {
                x: 200,
                y: 125
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 150,
            y: 4,
            connectsTo: [1,5,4]
        },
        {
            id: 1,
            x: 0,
            y: 317,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 75,
            y: 317,
            connectsTo: [3,5]
        },
        {
            id: 3,
            x: 225,
            y: 317,
            connectsTo: [5,4]
        },
        {
            id: 4,
            x: 300,
            y: 317,
            connectsTo: [0]
        },
        {
            id: 5,
            x: 150,
            y: 157,
            connectsTo: [0]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};