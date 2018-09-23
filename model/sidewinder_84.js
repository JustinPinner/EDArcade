const SideWinder_84 = {
    name: 'Sidewinder_84',
    mass: 25,
    agility: 0.8,
    armour: 108,
    maxSpeed: 220,
    boostSpeed: 321,
    width: 325,     // 65
    height: 160,    // 35
    scale: {
        x: 0.2,
        y: 0.22
    },
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 115, y: 32, z: 1},
                2: {x: 205, y: 32, z: 1}				
            }
        }
    },
    collisionCentres: {
        left: {
            x: 117,
            y: 85,
            radius: 75
        },
        right: {
            x: 210,
            y: 85,
            radius: 75
        }
    },
    thrusters: {
        rear: {
            centre: {
                x: 162,
                y: 155,
                size: 1
            }  
        },
        front: {
            centre: {
                x: 162,
                y: 8,
                size: 1
            }
        }
    },
    vertices: [
        {
            id: 0,
            x: 88,
            y: 7,
            connectsTo: [1,2,4]
        },
        {
            id: 1,
            x: 3,
            y: 155,
            connectsTo: [2]
        },
        {
            id: 2,
            x: 162,
            y: 155,
            connectsTo: [3,4]
        },
        {
            id: 3,
            x: 322,
            y: 155,
            connectsTo: [4]
        },
        {
            id: 4,
            x: 236,
            y: 7,
            connectsTo: []
        }
    ],
    cells: {},
    loadHardpoints: function(self) {
        for (var i = 1; i < 3; i++) {
            self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, i, PulseLaser, HardpointMountTypes.FIXED, 1));
        }
    }		
};