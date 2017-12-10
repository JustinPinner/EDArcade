class Point2d {
  constructor(x, y) {
    this._x = x;
    this._y = y;
  }
  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }
  set x(xNew) {
    this._x = xNew;
  }
  set y(yNew) {
    this._y = yNew;
  }
}

function distanceBetweenObjects(objA, objB) {
  const dx = objA.centre.x - objB.centre.x;
  const dy = objA.centre.y - objB.centre.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function distanceBetweenPoints(pointA, pointB) {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.sqrt((dx * dx) + (dy * dy));  
}

function angleBetween(x1, y1, x2, y2) {
  return Math.atan2(y1 - y2, x1 - x2) * (180.0 / Math.PI);
}

function angleDifference(a1, a2) {
  return ((((a1 - a2) % 360) + 540) % 360) - 180;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function dir_x(length, angle) {
  return length * Math.cos(degreesToRadians(angle));
}

function dir_y(length, angle) {
  return length * Math.sin(degreesToRadians(angle));
}

// source: http://stackoverflow.com/questions/17410809/how-to-calculate-rotation-in-2d-in-javascript
function rotatePoint(cx, cy, x, y, degrees) {
    const rads = degreesToRadians(degrees),
    		cosTheta = Math.cos(rads),
        sinTheta = Math.sin(rads),
        nx = (((x - cx) * cosTheta) - ((y - cy) * sinTheta)) + cx,
        ny = (((y - cy) * cosTheta) + ((x - cx) * sinTheta)) + cy;
    return {x: nx, y: ny};
}

function scaleBox(obj, scale) {
  const ws = obj.geometry.width * (scale || 1);
  const hs = obj.geometry.height * (scale || 1);
  return {
    width: ws,
    height: hs,
    x: obj.coordinates.x + (obj.geometry.width / 2) - (ws / 2),
    y: obj.coordinates.y + (obj.geometry.height / 2) - (hs / 2)
  };
}

class Vector2d extends Point2d {
  constructor(x, y) {
    super(x, y);
  }
  get length() {
    return Math.sqrt(this._x^2 + this._y^2);
  }
}

Vector2d.prototype.add = function(v2d) {
	return new Vector2d(v2d.x + this._x, v2d.y + this._y);
}

Vector2d.prototype.subtract = function(v2d) {
	return new Vector2d(this._x - v2d.x, this._y - v2d.y);
}

Vector2d.prototype.scale = function(n) {
	return new Vector2d(this._x * n, this._y * n);
}

Vector2d.prototype.dot = function(v2d) {
	return (this._x * v2d.x + this._y * v2d.y);
}

Vector2d.prototype.cross = function(v2d) {
	return (this._x * v2d.y - this._y * v2d.x);
}

Vector2d.prototype.rotate = function(v2dCentre, degrees) {
	//rotate counterclockwise
	const r = [];
	const x = this._x - v2dCentre.x;
	const y = this._y - v2dCentre.y;
	r[0] = x * Math.cos(angle) - y * Math.sin(degreesToRadians(degrees));
	r[1] = x * Math.sin(angle) + y * Math.cos(degreesToRadians(degrees));
	r[0] += v2dCentre.x;
	r[1] += v2dCentre.y;
	return new Vector2d(r[0], r[1]);
}

Vector2d.prototype.normalize = function() {
	const len = this.length > 0 ? (1 / this.length) : this.length;
  return new Vector2d(this._x * len, this._y * len);
}

Vector2d.prototype.distance = function(v2d) {
	const x = this._x - v2d.x;
	const y = this._y - v2d.y;
	return Math.sqrt(x^2 + y^2);
}
