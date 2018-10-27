// coordinate.js

class Coordinate extends Point2d {
  constructor(point2d) {
    super(point2d.x, point2d.y);
  }
  get point() {
    return {x, y};
  }
  set point(point2d) {
    this.x = point2d.x;
    this.y = point2d.y;
  }
};

Coordinate.prototype.rotate = function(centre, degrees) {
  this.point = rotatePoint(
    centre.x, 
    centre.y,
    this._x,
    this._y,
    degrees
  );
};

class Coordinate3d {
  constructor(x, y, z) {
    this._x = x;
    this._y = y;
    this._z = z;
  }
  get x() {
    return this._x;
  }
  set x(val) {
    this._x = val;
  }
  get y() {
    return this._y;
  }
  set y(val) {
    this._y = val;
  }
  get z() {
    return this._z;
  }
  set z(val) {
    this._z = val;
  }
};

Coordinate3d.prototype.clone = function() {
  return new Coordinate3d(this._x, this._y, this._z);
}

class Coordinates3d {
  constructor(x, y, z, w, h, d) {
    this._origin = new Coordinate3d(
        x || 0, 
        y || 0, 
        z || 0
    );
    this._centre = new Coordinate3d(
      (x || 0) + ((w || 0) / 2),
      (y || 0) + ((h || 0) / 2),
      (z || 0) + ((d || 0) / 2)
    );
    this._screen = this._origin;
  }
  get origin() {
    return this._origin;
  }
  set origin(val) {
    this._origin = val;
  }
  get centre() {
    return this._centre;
  }
  set centre(val) {
    this._centre = val;
  }
  get screen() {
    return this._screen;
  } 
  set screen(val) {
    this._screen = val;
  }
}

Coordinates3d.prototype.adjustForScreen = function(w, h) {
  // const c = new Coordinates3d();
  // c.origin._x = this._origin._x + (systemGeometry.width / 2) - ((w || 0) / 2);
  // c.origin._y = this._origin._y + (systemGeometry.height / 2) - ((h || 0) / 2);
  // c.centre._x = c.origin._x + ((w || 0) / 2);
  // c.centre._y = c.origin._y + ((h || 0) / 2);
  // return c;   
  
  this._screen = new Coordinates3d(
    this._origin._x + (systemGeometry.width / 2) - ((w || 0) / 2),
    this._origin._y + (systemGeometry.height / 2) - ((h || 0) / 2),
    this._origin._z,
    w,
    h,
    0
  );

  return this._screen;
}

Coordinates3d.prototype.rotate = function(degrees) {
  const o = this._origin.clone();
  o.rotate(this._centre, degrees);
  const c = this._centre.clone();

  const r = new Coordinates3d();
  r.origin = o;
  r.centre = c;
  return r;
}
