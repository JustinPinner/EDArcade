#!/bin/bash
rm -rf dist

mkdir -p dist/js

#uglifyjs js/keys.js \
#js/math2d.js \
#js/fsm.js \
#js/imageService.js \
#js/lib.js \
#js/perfmon.js \
#util/polyfill.js \
#model/environment.js \
#model/player.js \
#js/game.js \
#js/keys.js \
#js/effect.js \
#model/gameObject.js \
#model/ship.js \
#model/weapon.js
#-o dist/js/game.min.js -c -m

# until uglifyjs works with all sources
cat js/lib.js > dist/js/game.js
cat js/imageService.js >> dist/js/game.js
cat model/environment.js >> dist/js/game.js
cat model/gameObject.js >> dist/js/game.js
cat js/perfmon.js >> dist/js/game.js
cat js/keys.js >> dist/js/game.js
cat util/polyfill.js >> dist/js/game.js
cat js/fsm.js >> dist/js/game.js
cat js/effect.js >> dist/js/game.js
cat model/weapon.js >> dist/js/game.js
cat model/ship.js >> dist/js/game.js
cat model/player.js >> dist/js/game.js
cat js/math2d.js >> dist/js/game.js
cat js/game.js >> dist/js/game.js

babili dist/js/game.js -o dist/js/game.min.js

rm dist/js/game.js

mkdir -p dist/css
cp css/* dist/css

mkdir -p dist/html
cp html/index.html dist/html

mkdir -p dist/image
cp image/* dist/image
