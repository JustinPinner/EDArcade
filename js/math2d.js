// math2d.js

function distanceBetween(objA, objB) {
  var dx = objA.cx - objB.cx;
  var dy = objA.cy - objB.cy;
  return Math.sqrt((dx * dx) + (dy * dy));
};

function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y1 - y2, x1 - x2) * (180.0 / Math.PI);
};

function angleDifference(a1, a2) {
  return ((((a1 - a2) % 360) + 540) % 360) - 180;
};

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
};

function dir_x(length, angle) {
  return length * Math.cos(degreesToRadians(angle));
};

function dir_y(length, angle) {
  return length * Math.sin(degreesToRadians(angle));
};

// source: http://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function rotatePoint(cx, cy, x, y, degrees) {
    var rads = degreesToRadians(degrees),
    		cosTheta = Math.cos(rads),
        sinTheta = Math.sin(rads),
        nx = (((x - cx) * cosTheta) - ((y - cy) * sinTheta)) + cx,
        ny = (((y - cy) * cosTheta) + ((x - cx) * sinTheta)) + cy;
    return {x: nx, y: ny};
}

function scaleBox(obj, scale) {
  if (scale) {
    var ws = obj.width * scale;
    var hs = obj.height * scale;
    return {
      width: ws,
      height: hs,
      x: obj.x + (obj.width / 2) - (ws / 2),
      y: obj.y + (obj.height / 2) - (hs / 2)
    };
  } else {
    return {
      width: obj.width,
      height: obj.height,
      x: obj.x,
      y: obj.y
    };
  }
}
