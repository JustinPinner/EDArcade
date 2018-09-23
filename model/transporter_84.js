const Transporter_84 = {
    name: 'Transporter_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 320,      // 35
    height: 300,     // 30
    scale: {
        x: 0.11,
        y: 0.1
    },
    hardpointGeometry: {},
    collisionCentres: {
        centre: {
            x: 160,
            y: 150,
            radius: 150
        }
    },
    thrusters: {
        rear: {
            centre: {
                x: 160,
                y: 295,
                size: 2
            }
        },
        front: {
            centre: {
                x: 160,
                y: 5,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 160,
            y: 72,
            connectsTo: [1,2]
        },
        {
            id: 1,
            x: 104,
            y: 4,
            connectsTo: [7,2]
        },
        {
            id: 2,
            x: 5,
            y: 72,
            connectsTo: [3]
        },
        {
            id: 3,
            x: 5,
            y: 296,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 160,
            y: 296,
            connectsTo: [5,0]
        },
        {
            id: 5,
            x: 315,
            y: 296,
            connectsTo: [6]
        },
        {
            id: 6,
            x: 315,
            y: 72,
            connectsTo: [0,7]
        },
        {
            id: 7,
            x: 219,
            y: 4,
            connectsTo: [0]
        },
        {
            id: 8,
            x: 46,
            y: 128,
            connectsTo: [9]
        },
        {
            id: 9,
            x: 126,
            y: 128,
            connectsTo: []
        },
        {
            id: 10,
            x: 46,
            y: 196,
            connectsTo: [11,13]
        },
        {
            id: 11,
            x: 86,
            y: 196,
            connectsTo: [12,13]
        },
        {
            id: 12,
            x: 126,
            y: 196,
            connectsTo: [13]
        },
        {
            id: 13,
            x: 86,
            y: 237,
            connectsTo: []
        },
        {
            id: 14,
            x: 194,
            y: 237,
            connectsTo: [15,16]
        },
        {
            id: 15,
            x: 274,
            y: 237,
            connectsTo: [16]
        },
        {
            id: 16,
            x: 233,
            y: 196,
            connectsTo: []
        },
        {
            id: 17,
            x: 194,
            y: 128,
            connectsTo: [18,20]
        },
        {
            id: 18,
            x: 233,
            y: 129,
            connectsTo: [19,20]
        },
        {
            id: 19,
            x: 274,
            y: 129,
            connectsTo: [20]
        },
        {
            id: 20,
            x: 233,
            y: 88,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        // this ship has no hardpoints
    }
};