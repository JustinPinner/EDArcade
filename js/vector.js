// vector.js

class Vector2d extends Point2d {
    constructor(x, y) {
        super(x, y);
    }
    get length() {
        return Math.sqrt(Math.abs(this._x)^2 + Math.abs(this._y)^2);
    }
}
  
Vector2d.prototype.add = function(v2d) {
    this._x += v2d.x;
    this._y += v2d.y;
}

Vector2d.prototype.subtract = function(v2d) {
    this._x -= v2d.x;
    this._y -= v2d.y;
}

Vector2d.prototype.scale = function(n) {
    this._x *= n;
    this._y *= n;
}

Vector2d.prototype.dot = function(v2d) {
    this._x *= v2d.x;
    this._y *= v2d.y;
}

Vector2d.prototype.cross = function(v2d) {
    this._x *= v2d.y;
    this._y *= v2d.x;
}

Vector2d.prototype.normalize = function() {
    const len = this.length > 0 ? (1 / this.length) : this.length;
    this._x *= len;
    this._y *= len;
}

Vector2d.prototype.distance = function(v2d) {
    const x = this._x - v2d.x;
    const y = this._y - v2d.y;
    return Math.sqrt(x^2 + y^2);
}

Vector2d.prototype.clone = function() {
    return new Vector2d(this._x, this._y);
}
