const Moray_84 = {
    name: 'Moray_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 316,  // 65
    height: 270, // 60
    scale: {
        x: 0.2,
        y: 0.22
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 158, y: 33, z: -1}
            }
        }
    },
    collisionCentres: {
        centre: {
            x: 158,
            y: 143,
            radius: 120
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 158,
                y: 261,
                size: 2
            }
        },
        front: {
            left: {
                x: 55,
                y: 79,
                size: 1
            },
            right: {
                x: 261,
                y: 79,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 158,
            y: 2,
            connectsTo: [1,9,8,4]
        },
        {
            id: 1,
            x: 3,
            y: 110,
            connectsTo: [2,9]
        },
        {
            id: 2,
            x: 109,
            y: 267,
            connectsTo: [3]
        },
        {
            id: 3,
            x: 206,
            y: 267,
            connectsTo: [4,8]
        },
        {
            id: 4,
            x: 312,
            y: 110,
            connectsTo: [8,0]
        },
        {
            id: 5,
            x: 182,
            y: 60,
            connectsTo: [6,7]
        },
        {
            id: 6,
            x: 130,
            y: 60,
            connectsTo: [7]
        },
        {
            id: 7,
            x: 158,
            y: 99,
            connectsTo: []
        },
        {
            id: 8,
            x: 232,
            y: 110,
            connectsTo: [0,9]
        },
        {
            id: 9,
            x: 86,
            y: 110,
            connectsTo: [0,2]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};