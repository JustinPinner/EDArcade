del dist\js\*.*/y
rd dist\js
del dist\css\*.*/y
rd dist\css
del dist\play\*.*/y
rd dist\play
del dist\image\*.*/y
rd dist\image
rd dist

@echo js...
md dist\js
type js\lib.js > dist\js\game.js
type js\imageService.js >> dist\js\game.js
type js\canvas2d.js >> dist\js\game.js
type model\environment.js >> dist\js\game.js
type model\gameObject.js >> dist\js\game.js
type js\perfmon.js >> dist\js\game.js
type js\gamepad.js >> dist\js\game.js
type js\touch.js >> dist\js\game.js
type js\keys.js >> dist\js\game.js
type js\fsm.js >> dist\js\game.js
type js\particle.js >> dist\js\game.js
type js\effect.js >> dist\js\game.js
type model\hardpoint.js >> dist\js\game.js
type model\weapon.js >> dist\js\game.js
type model\sprite.js >> dist\js\game.js
type js\math2d.js >> dist\js\game.js
type js\point.js >> dist\js\game.js
type js\vector.js >> dist\js\game.js
type js\coordinate.js >> dist\js\game.js
type model\adder_84.js >> dist\js\game.js
type model\anaconda_84.js >> dist\js\game.js
type model\asp2_84.js >> dist\js\game.js
type model\boa_84.js >> dist\js\game.js
type model\cobra1_84.js >> dist\js\game.js
type model\cobra3_84.js >> dist\js\game.js
type model\ferdelance_84.js >> dist\js\game.js
type model\gecko_84.js >> dist\js\game.js
type model\krait_84.js >> dist\js\game.js
type model\mamba_84.js >> dist\js\game.js
type model\moray_84.js >> dist\js\game.js
type model\python_84.js >> dist\js\game.js
type model\shuttle_84.js >> dist\js\game.js
type model\sidewinder_84.js >> dist\js\game.js
type model\thargoid_84.js >> dist\js\game.js
type model\transporter_84.js >> dist\js\game.js
type model\viper_84.js >> dist\js\game.js
type model\worm_84.js >> dist\js\game.js
type model\anaconda.js >> dist\js\game.js
type model\cobra3.js >> dist\js\game.js
type model\cobra4.js >> dist\js\game.js
type model\python.js >> dist\js\game.js
type model\sidewinder.js >> dist\js\game.js
type model\type6.js >> dist\js\game.js
type model\viper3.js >> dist\js\game.js
type js\thruster.js >> dist\js\game.js
type model\ship.js >> dist\js\game.js
type model\player.js >> dist\js\game.js
type model\pickup.js >> dist\js\game.js
type js\loggedEvent.js >> dist\js\game.js
type js\game.js >> dist\js\game.js
type js\util\polyfill.js >> dist\js\game.js

copy dist\js\game.js dist\js\game.min.js

del dist\js\game.js

@echo css...
md dist\css
copy css\* dist\css

@echo html...
md dist\play
copy html\index.html dist\play

@echo image...
md dist\image
copy image\* dist\image

@echo done!
