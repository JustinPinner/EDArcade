const Worm_84 = {
    name: 'Worm_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 32,
    height: 48,
    scale: {
        x: 0.14,
        y: 0.15
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 0, y: 18, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 18,
            y: 12,
            radius: 18
        },
        rear: {
            x: 18, 
            y: 30, 
            radius: 18
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 18,
                y: 46,
                size: 2
            }
        },
        front: {
            left: {
                x: 2,
                y: 18,
                size: 1
            },
            right: {
                x: 32,
                y: 18,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 83,
            y: 5,
            connectsTo: [1,2]
        },
        {
            id: 1,
            x: 57,
            y: 72,
            connectsTo: [2,3]
        },
        {
            id: 2,
            x: 93,
            y: 95,
            connectsTo: [8,4]
        },
        {
            id: 3,
            x: 3,
            y: 321,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 93,
            y: 321,
            connectsTo: [5]
        },
        {
            id: 5,
            x: 126,
            y: 321,
            connectsTo: [8,6]
        },
        {
            id: 6,
            x: 219,
            y: 321,
            connectsTo: [7]
        },
        {
            id: 7,
            x: 160,
            y: 72,
            connectsTo: [8,9]
        },
        {
            id: 8,
            x: 126,
            y: 95,
            connectsTo: [9]
        },
        {
            id: 9,
            x: 134,
            y: 5,
            connectsTo: [0]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};