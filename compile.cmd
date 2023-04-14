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
type js\gamepad.js > dist\js\game.js
type js\keys.js >> dist\js\game.js
type js\lib.js >> dist\js\game.js
type js\imageService.js >> dist\js\game.js
type js\canvas2d.js >> dist\js\game.js
type js\touch.js >> dist\js\game.js
type model\environment.js >> dist\js\game.js
type model\gameObject.js >> dist\js\game.js
type js\perfmon.js >> dist\js\game.js
type js\fsm.js >> dist\js\game.js
type js\particle.js >> dist\js\game.js
type js\effect.js >> dist\js\game.js
type js\thruster.js >> dist\js\game.js
type model\weapon.js >> dist\js\game.js
type model\sprite.js >> dist\js\game.js
type js\math2d.js >> dist\js\game.js
type model\pickup.js >> dist\js\game.js
type model\sidewinder.js >> dist\js\game.js
type model\cobra3.js >> dist\js\game.js
type model\cobra4.js >> dist\js\game.js
type model\python.js >> dist\js\game.js
type model\anaconda.js >> dist\js\game.js
type model\type6.js >> dist\js\game.js
type model\viper3.js >> dist\js\game.js
type model\ship.js >> dist\js\game.js
type model\player.js >> dist\js\game.js
type js\game.js >> dist\js\game.js
type util\polyfill.js >> dist\js\game.js

REM this will eventually become uglifyjs dist\js\game.js -o dist\js\game.min.js
REM but for now, just copy the file as it's good for debugging
copy dist\js\game.js dist\js\game.min.js

del dist\js\game.js

@echo css...
md dist\css
REM CSS should also be minified, but for now just copy the file as is
copy css\game.css dist\css\game.min.css
copy css\test.css dist\css

@echo html...
md dist\play
copy html\index.html dist\play

@echo image...
md dist\image
copy image\* dist\image

@echo done!
