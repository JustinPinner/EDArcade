// model/environment.js

const ScreenBorder = {
	VERTICAL: 40,
	HORIZONTAL: 40
};

const systemGeometry = {
	width: window.innerWidth, 
	height: window.innerHeight
};

class ScrollData {
	constructor(anchorObject, vx, vy) {
		this._anchor = anchorObject;
		this._velocity = new Point2d(this._anchor && this._anchor.velocity.x || 0, this._anchor && this._anchor.velocity.y || 0);
	}

	get anchor() {
		return this._anchor;
	}
	get velocity() {
		return this._velocity;
	}

	set anchor(anchorObject) {
		this._anchor = anchorObject;
	}
	set velocity(point2d) {
		this._velocity = point2d;
	}
}

/*
	Fixed background image
*/
class Background extends Canvas2D {
	constructor(x, y, width, height, selector) {
		super(x, y, width, height);
		this._selector = selector || '#bgcanvas';
	}
}

Background.prototype.draw = function() {
	this.__proto__.draw();
	this._image.removeEventListener('load', game.background.draw, false);		
}

/*
	Scrolling starfield overlay
*/
class Midground extends Canvas2D {
	constructor(x, y, width, height, selector) {
		super(x, y, width, height, selector || '#mgcanvas');
		this._scrollScale = 0.1;
	}
}

Midground.prototype.draw = function() {
	if (!this.ready) return;
	// scroll direction is opposide of ship direction		
	const newX = this._scrollData && this._scrollData.velocity.x != 0 ? this._coordinates.x - this._scrollData.velocity.x * this._scrollScale : this._coordinates.x;
	const newY = this._scrollData && this._scrollData.velocity.y != 0 ? this._coordinates.y - this._scrollData.velocity.y * this._scrollScale : this._coordinates.y;
	this._coordinates.x = newX >= this._width ? 0 : (newX < 0 ? this._width : newX);
	this._coordinates.y = newY >= this._height ? 0 : (newY < 0 ? this._height : newY);
	this.clear();
	if (this._image) {
		// draw the background
		this._context.drawImage(this._image, this._coordinates.x, this._coordinates.y, this._width, this._height);
		// top-left
		this._context.drawImage(this._image, this._coordinates.x - this._width, this._coordinates.y - this._height, this._width, this._height);
		// top
		this._context.drawImage(this._image, this._coordinates.x, this._coordinates.y - this._height, this._width, this._height);
		// top-right
		this._context.drawImage(this._image, this._coordinates.x + this._width, this._coordinates.y - this._height, this._width, this._height);
		// right
		this._context.drawImage(this._image, this._coordinates.x + this._width, this._coordinates.y, this._width, this._height);
		// bottom-right
		this._context.drawImage(this._image, this._coordinates.x + this._width, this._coordinates.y + this._height, this._width, this._height);
		// bottom
		this._context.drawImage(this._image, this._coordinates.x, this._coordinates.y + this._height, this._width, this._height);		
		// botom-left
		this._context.drawImage(this._image, this._coordinates.x - this._width, this._coordinates.y + this._height, this._width, this._height);
		// left
		this._context.drawImage(this._image, this._coordinates.x - this._width, this._coordinates.y, this._width, this._height);		
	}
}

/*
	Player viewport (foreground)
*/
class Viewport extends Canvas2D {
	constructor(x, y, width, height, selector) {
		super(x, y, width, height, selector || '#fgcanvas');
	}
};

Viewport.prototype.trackFocussedObject = function() {
	this.coordinates.x = this.focussedObject.coordinates.centre.x - this.width / 2;
	this.coordinates.y = this.focussedObject.coordinates.centre.y - this.height / 2;	
}

Viewport.prototype.drawOrigin = function(forObject) {
	if (!forObject || !this.coordinates) {
		return new Coordinate3d(0,0,0);
	}
	const objOrigin = (forObject.coordinates && forObject.coordinates.origin) || forObject.coordinates;
	return new Coordinate3d(
		x = objOrigin.x + -this.coordinates.x,
		y = objOrigin.y + -this.coordinates.y,
		z = objOrigin.z || 0
	);
};

Viewport.prototype.drawCentre = function(forObject) {
	if (!forObject || !this.coordinates) {
		return new Coordinate3d(0,0,0);
	}
	const objCentre = (forObject.coordinates && forObject.coordinates.centre) || forObject.coordinates;
	return new Coordinate3d(
		x = objCentre.x + -this.coordinates.x,
		y = objCentre.y + -this.coordinates.y,
		z = objCentre.z || 0
	);	
};

Viewport.prototype.isVisible = function(gameObject) {
	const _x = (gameObject.coordinates && gameObject.coordinates.origin && gameObject.coordinates.origin.x) || gameObject.coordinates.x;
	const _y = (gameObject.coordinates && gameObject.coordinates.origin && gameObject.coordinates.origin.y) || gameObject.coordinates.y;
	return(
		_x >= this.coordinates.x &&
		_y >= this.coordinates.y &&
		_x <= this.coordinates.x + this.width &&
		_y <= this.coordinates.y + this.height
	);
}
