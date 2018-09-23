const Thargoid_84 = {
    name: 'Thargoid_84',
    mass: 350,
    agility: 0.6,
    armour: 468,
    maxSpeed: 234,
    boostSpeed: 305,
    width: 300,     // 180
    height: 300,    // 180
    scale: {
        x: 0.6,
        y: 0.6
    },
    hardpointGeometry: {
        WEAPON: {
            LARGE: { 
                1: {x: 150, y: 75,	z: -1},
                2: {x: 75, y: 150, z: -1},
                3: {x: 225, y: 150,	z: -1},
                4: {x: 150, y: 225, z: -1}
            }
        }
    },
    collisionCentres: {
        mid: {
            x: 150,
            y: 150,
            radius: 150
        }
    },
    thrusters: {
        rear: {
            left: {
                x: 42,
                y: 252,
                size: 3,
            },
            mid: {
                x: 150,
                y: 295,
                size: 3
            },  
            right: {
                x: 258,
                y: 252,
                size: 3
            }
        },
        front: {
            left: {
                x: 42,
                y: 46,
                size: 3
            },
            right: {
                x: 258,
                y: 46,
                size: 3
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 123,
            y: 80,
            connectsTo: [1,8]
        },
        {
            id: 1,
            x: 82,
            y: 120,
            connectsTo: [2,9]
        },
        {
            id: 2,
            x: 82,
            y: 177,
            connectsTo: [10,3]
        },
        {
            id: 3,
            x: 123,
            y: 219,
            connectsTo: [11,4]
        },
        {
            id: 4,
            x: 177,
            y: 219,
            connectsTo: [12,5]
        },
        {
            id: 5,
            x: 218,
            y: 177,
            connectsTo: [13,6]
        },
        {
            id: 6,
            x: 218,
            y: 120,
            connectsTo: [14,7]
        },
        {
            id: 7,
            x: 177,
            y: 80,
            connectsTo: [15,0]
        },
        {
            id: 8,
            x: 91,
            y: 5,
            connectsTo: [9]
        },
        {
            id: 9,
            x: 4,
            y: 89,
            connectsTo: [10]
        },
        {
            id: 10,
            x: 4,
            y: 208,
            connectsTo: [11]
        },
        {
            id: 11,
            x: 91,
            y: 295,
            connectsTo: [12]
        },
        {
            id: 12,
            x: 208,
            y: 295,
            connectsTo: [13]
        },
        {
            id: 13,
            x: 293,
            y: 208,
            connectsTo: [14]
        },
        {
            id: 14,
            x: 293,
            y: 89,
            connectsTo: [15]
        },
        {
            id: 15,
            x: 208,
            y: 5,
            connectsTo: [8]
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 5; i++){
            self._hardpoints.push(new WeaponHardpoint(self, Size.LARGE.value, i, PulseLaser, HardpointMountTypes.TURRET, 1));				
        }
    }		
};
