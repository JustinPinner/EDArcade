const Shuttle_84 = {
    name: 'Shuttle_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 47,
    height: 68,
    scale: {
        x: 0.24,
        y: 0.26
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
            x: 91,
            y: 5,
            connectsTo: [1,7,6]
        },
        {
            id: 1,
            x: 25,
            y: 49,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 24,
            y: 54,
            connectsTo: [7,3]
        },
        {
            id: 3,
            x: 4, 
            y: 325,
            connectsTo: [7,4]
        },
        {
            id: 4,
            x: 185,
            y: 325,
            connectsTo: [7,5]
        },
        {
            id: 5,
            x: 160,
            y: 49,
            connectsTo: [7,6]
        },
        {
            id: 6,
            x: 159,
            y: 49,
            connectsTo: [0]
        },
        {
            id: 7,
            x: 91,
            y: 46,
            connectsTo:[]
        },
        {
            id: 8,
            x: 133,
            y: 40,
            connectsTo: [9,10]
        },
        {
            id: 9,
            x: 97,
            y: 38,
            connectsTo: [10]
        },
        {
            id: 10,
            x: 97,
            y: 21,
            connectsTo: []
        },
        {
            id: 11,
            x: 85,
            y: 21,
            connectsTo: [12,13]
        },
        {
            id: 12,
            x: 85,
            y: 38,
            connectsTo: [13]
        },
        {
            id: 13,
            x: 51,
            y: 40,
            connectsTo: []
        }

    ],
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};