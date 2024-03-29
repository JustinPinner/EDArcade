#!/bin/bash
rm -rf dist

mkdir -p dist/js

echo 'js...'
# combine all source js files into a single game.js file
cat js/gamepad.js > dist/js/game.js
cat js/keys.js >> dist/js/game.js
cat js/lib.js >> dist/js/game.js
cat js/imageService.js >> dist/js/game.js
cat js/canvas2d.js >> dist/js/game.js
cat js/touch.js >> dist/js/game.js
cat model/environment.js >> dist/js/game.js
cat model/gameObject.js >> dist/js/game.js
cat js/perfmon.js >> dist/js/game.js
cat util/polyfill.js >> dist/js/game.js
cat js/fsm.js >> dist/js/game.js
cat js/particle.js >> dist/js/game.js
cat js/effect.js >> dist/js/game.js
cat js/thruster.js >> dist/js/game.js
cat model/weapon.js >> dist/js/game.js
cat model/sprite.js >> dist/js/game.js
cat js/math2d.js >> dist/js/game.js
cat model/pickup.js >> dist/js/game.js
cat model/sidewinder.js >> dist/js/game.js
cat model/cobra3.js >> dist/js/game.js
cat model/cobra4.js >> dist/js/game.js
cat model/python.js >> dist/js/game.js
cat model/anaconda.js >> dist/js/game.js
cat model/type6.js >> dist/js/game.js
cat model/viper3.js >> dist/js/game.js
cat model/ship.js >> dist/js/game.js
cat model/player.js >> dist/js/game.js
cat js/game.js >> dist/js/game.js

# relies on npm install --save-dev babel-minify (see package.json)
# squeeze out unnecessary bytes so the browser doesn't have to load them
minify dist/js/game.js > dist/js/game.min.js

rm dist/js/game.js

echo 'css...'
mkdir -p dist/css
cp css/* dist/css

minify dist/css/game.css > dist/css/game.min.css

echo 'html...'
mkdir -p dist/play
cp html/index.html dist/play

echo 'image...'
mkdir -p dist/image
cp image/* dist/image

echo 'done!'
