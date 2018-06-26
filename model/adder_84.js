const Adder_84 = {
    name: 'Adder_84',
    mass: 180,
    agility: 0.4,
    armour: 88,
    maxSpeed: 260,
    boostSpeed: 300,
    width: 41,
    height: 62,
    hardpointGeometry: {
        WEAPON: {
            SMALL: {
                1: {x: 19, y: 6, z: -1}
            }
        }
    },
    collisionCentres: {
        front: {
            x: 20,
            y: 20,
            radius: 20
        },
        rear: {
            x: 20, 
            y: 46, 
            radius: 20
        }
    },
    thrusters: {
        rear: {
            mid: {
                x: 20,
                y: 62,
                size: 2
            }
        },
        front: {
            left: {
                x: 2,
                y: 32,
                size: 1
            },
            right: {
                x: 38,
                y: 32,
                size: 1
            }
        }
    },
    cells: {},
    loadHardpoints: function(self) {
        self._hardpoints.push(new WeaponHardpoint(self, Size.SMALL.value, 1, PulseLaser, HardpointMountTypes.FIXED, 1));
    }
};