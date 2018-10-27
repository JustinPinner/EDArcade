// point.js

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

Point2d.prototype.clone = function() {
    return new Point2d(this._x, this._y);
}

Point2d.prototype.rotate = function(p2dCentre, degrees) {
    //rotate counterclockwise
    const r = [];
    const x = this._x - p2dCentre.x;
    const y = this._y - p2dCentre.y;
    const rads = degreesToRadians(degrees);
    r[0] = x * Math.cos(rads) - y * Math.sin(rads);
    r[1] = x * Math.sin(rads) + y * Math.cos(rads);
    r[0] += p2dCentre.x;
    r[1] += p2dCentre.y;
    this._x = r[0];
    this._y = r[1];
}

class Point3d extends Point2d {
    constructor(x, y, z) {
        super(x, y);
        this._z = z;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get z() {
        return this._z;
    }
    set x(val) {
        this._x = val;
    }
    set y(val) {
        this._y = val;
    }
    set z(val) {
        this._z = val;
    }
}

Point3d.prototype.clone = function() {
    return new Point3d(this._x, this._y, this._z);
}

