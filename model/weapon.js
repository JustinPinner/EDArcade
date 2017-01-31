// model/weapon.js
var Lasers = {
	1: {
		Pulse: {
			Fixed: {
				name: 'Fixed pulse laser (size 1)',
				range: 500,
				rof: 3.8,
				damage: 3
			}
		}
	},
	2: {
		Pulse: {
			Fixed: {
				name: 'Fixed pulse laser (size 2)',
				range: 500,
				rof: 3.4,
				damage: 4
			}
		}
	}
}

var Defaults = {
	Hardpoints: {
		Sidewinder: {
			small1: {
				loaded: true,
				weapon: Lasers[1].Pulse.Fixed
			},
			small2: {
				loaded: true,
				weapon: Lasers[1].Pulse.Fixed
			},
			utility1: {
				loaded: false,
				module: null
			},
			utility2: {
				loaded: false,
				module: null
			}
		},		
		Cobra: {
			3: {
				small1: {
					loaded: false,
					weapon: null
				},
				small2: {
					loaded: false,
					weapon: null
				},
				medium1: {
					loaded: true,
					weapon: Lasers[1].Pulse.Fixed
				},
				medium2: {
					loaded: true,
					weapon: Lasers[1].Pulse.Fixed
				},
				utility1: {
					loaded: false,
					module: null
				},
				utility2: {
					loaded: false,
					module: null
				}
			},
			4: {
				small1: {
					loaded: false,
					weapon: null
				},
				small2: {
					loaded: false,
					weapon: null
				},
				small3: {
					loaded: false,
					weapon: null
				},
				medium1: {
					loaded: true,
					weapon: Lasers[1].Pulse.Fixed
				},
				medium2: {
					loaded: true,
					weapon: Lasers[1].Pulse.Fixed
				},
				utility1: {
					loaded: false,
					module: null
				},
				utility2: {
					loaded: false,
					module: null
				}
			}
		},
		Python: {
			large1: {
				loaded: false,
				weapon: null
			},
			large2: {
				loaded: false,
				weapon: null
			},
			large3: {
				loaded: false,
				weapon: null
			},
			medium1: {
				loaded: true,
				weapon: Lasers[1].Pulse.Fixed
			},
			medium2: {
				loaded: true,
				weapon: Lasers[1].Pulse.Fixed
			},
			utility1: {
				loaded: false,
				module: null
			},
			utility2: {
				loaded: false,
				module: null
			},
			utility3: {
				loaded: false,
				module: null
			},
			utility4: {
				loaded: false,
				module: null
			}
		}
	}
}