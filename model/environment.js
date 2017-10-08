// model/environment.js

const ScreenBorder = {
	VERTICAL: 40,
	HORIZONTAL: 40
};

var systemGeometry = {
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
	var newX = this._scrollData && this._scrollData.velocity.x != 0 ? this._coordinates.x - this._scrollData.velocity.x * this._scrollScale : this._coordinates.x;
	var newY = this._scrollData && this._scrollData.velocity.y != 0 ? this._coordinates.y - this._scrollData.velocity.y * this._scrollScale : this._coordinates.y;
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
