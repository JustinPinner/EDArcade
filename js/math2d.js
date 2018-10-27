// math2d.js

function distanceBetweenObjects(objA, objB) {
  const dx = (objA.coordinates.x + objA.centre.x) - (objB.coordinates.x + objB.centre.x);
  const dy = (objA.coordinates.y + objA.centre.y) - (objB.coordinates.y + objB.centre.y);
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

function rotatePoint(cx, cy, px, py, degrees)
{
  const deg = (degrees > 359) ? (degrees - 359) : degrees;
  const angle = degreesToRadians(deg);
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const p = new Point2d(px,py);

  // translate point back to origin:
  p.x -= cx;
  p.y -= cy;

  // rotate point
  const xnew = p.x * c - p.y * s;
  const ynew = p.x * s + p.y * c;

  // translate point back:
  p.x = xnew + cx;
  p.y = ynew + cy;
  
  return p;
}
