var Point2d = function(x, y) {
  this.x = x;
  this.y = y;
}

Point2d.prototype.x = function() {
  return this.x;
}

Point2d.prototype.y = function() {
  return this.y;
}

function distanceBetweenObjects(objA, objB) {
  var dx = objA.centre.x - objB.centre.x;
  var dy = objA.centre.y - objB.centre.y;
  return Math.sqrt((dx * dx) + (dy * dy));
}

function distanceBetweenPoints(pointA, pointB) {
  var dx = pointA.x - pointB.x;
  var dy = pointA.y - pointB.y;
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
    var rads = degreesToRadians(degrees),
    		cosTheta = Math.cos(rads),
        sinTheta = Math.sin(rads),
        nx = (((x - cx) * cosTheta) - ((y - cy) * sinTheta)) + cx,
        ny = (((y - cy) * cosTheta) + ((x - cx) * sinTheta)) + cy;
    return {x: nx, y: ny};
}

function scaleBox(obj, scale) {
  if (scale) {
    var ws = obj.geometry.width * scale;
    var hs = obj.geometry.height * scale;
    return {
      width: ws,
      height: hs,
      x: obj.coordinates.x + (obj.geometry.width / 2) - (ws / 2),
      y: obj.coordinates.y + (obj.geometry.height / 2) - (hs / 2)
    };
  } else {
    return {
      width: obj.geometry.width,
      height: obj.geometry,height,
      x: obj.x,
      y: obj.y
    };
  }
}

var Vector2d = function(x,y) {
	this.x = x;
	this.y = y;
}

Vector2d.prototype.length = function() {
	return Math.sqrt(this.x^2 + this.y^2);
}

Vector2d.prototype.add = function(v2d) {
	return new Vector2d(v2d.x + this.x, v2d.y + this.y);
}

Vector2d.prototype.subtract = function(v2d) {
	return new Vector2d(this.x - v2d.x, this.y - v2d.y);
}

Vector2d.prototype.scale = function(n) {
	return new Vector2d(this.x * n, this.y * n);
}

Vector2d.prototype.dot = function (v2d) {
	return (this.x * v2d.x + this.y * v2d.y);
}

Vector2d.prototype.cross = function (v2d) {
	return (this.x * v2d.y - this.y * v2d.x);
}

Vector2d.prototype.rotate = function (v2dCentre, degrees) {
	//rotate counterclockwise
	var r = [];
	var x = this.x - v2dCentre.x;
	var y = this.y - v2dCentre.y;
	r[0] = x * Math.cos(angle) - y * Math.sin(degreesToRadians(degrees));
	r[1] = x * Math.sin(angle) + y * Math.cos(degreesToRadians(degrees));
	r[0] += v2dCentre.x;
	r[1] += v2dCentre.y;
	return new Vector2d(r[0], r[1]);
}

Vector2d.prototype.normalize = function () {
	var len = this.length();
	if (len > 0) {
		len = 1 / len; 
	}
  return new Vector2d(this.x * len, this.y * len);
}

Vector2d.prototype.distance = function (v2d) {
	var x = this.x - v2d.x;
	var y = this.y - v2d.y;
	return Math.sqrt(x^2 + y^2);
}
