const Krait_84 = {
    name: 'Krait_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 314,     // 90
    height: 226,    // 80
    scale: {
        x: 0.39,
        y: 0.49
    },
    hardpointGeometry: {
        WEAPON: {
            MEDIUM: {
                1: {x: 157, y: 28, z: 1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 157,
            y: 123,
            radius: 90
        },
        rearLeft: {
            x: 54, 
            y: 134, 
            radius: 30
        },
        rearRight: {
            x: 260,
            y: 134,
            radius: 30
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 113,
                y: 200,
                size: 2
            },
            right: {
                x: 201,
                y: 200,
                size: 2
            }
        },
        front: {
            left: {
                x: 113,
                y: 45,
                size: 1
            },
            right: {
                x: 201,
                y: 45,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 158,
            y: 3,
            connectsTo: [1,4,7]
        },
        {
            id: 1,
            x: 3,
            y: 142,
            connectsTo: [2,9]
        },
        {
            id: 2,
            x: 158,
            y: 221,
            connectsTo: [3,7]
        },
        {
            id: 3,
            x: 158,
            y: 112,
            connectsTo: [5,6]
        },
        {
            id: 4,
            x: 158,
            y: 80,
            connectsTo: [0,5,6]
        },
        {
            id: 5,
            x: 127,
            y: 120,
            connectsTo: []
        },
        {
            id: 6,
            x: 190,
            y: 120,
            connectsTo: []
        },
        {
            id: 7,
            x: 310,
            y: 142,
            connectsTo: [0,8]
        },
        {
            id: 8,
            x: 310,
            y: 3,
            connectsTo: []
        },
        {
            id: 9,
            x: 3,
            y: 3,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.MEDIUM.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};