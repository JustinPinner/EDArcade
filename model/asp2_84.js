const Asp2_84 = {
    name: 'Asp2_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 96,  // 70ft
    height: 89, // 65ft
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 29, y: 2, z: -1}
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
                x: 29,
                y: 52,
                size: 2
            }
        },
        front: {
            left: {
                x: 8,
                y: 17,
                size: 1
            },
            right: {
                x: 51,
                y: 17,
                size: 1
            }
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};