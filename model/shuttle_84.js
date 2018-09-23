const Shuttle_84 = {
    name: 'Shuttle_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 192,     // 20
    height: 332,    // 35
    scale: {
        x: 0.1,
        y: 0.1
    },
    hardpointGeometry: {
    },
    collisionCentres: {
        front: {
            x: 96,
            y: 80,
            radius: 75
        },
        rear: {
            x: 96, 
            y: 230, 
            radius: 85
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 96,
                y: 325,
                size: 1
            }
        },
        front: {
            mid: {
                x: 96,
                y: 20,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 96,
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
            x: 96,
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
        // this ship has no hardpoints
    }
};