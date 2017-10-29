// js/canvas2d.js

class Canvas2D {
	constructor(x, y, width, height, selector) {
		this._ready = false;
		this._width = width || systemGeometry.width;
		this._height = height || systemGeometry.height;
		this._coordinates = new Point2d(x || 0, y || 0);
		this._selector = selector;
		this._context = null;
		this._image = null;
		this._scrollScale = 0;
		this._scrollData = new ScrollData(null, 0, 0);
		this._anchor = null;
	}
	/* getters */
	get ready() {
		return this._ready;
	}
	get width() {
		return this._width;
	}
	get height() {
		return this._height;
	}
	get coordinates() {
		return this._coordinates;
	}
	get selector() {
		return this._selector;
	}
	get context() {
		return this._context;
	}
	get centre() {
		return new Point2d(this._coordinates.x + (this._width / 2), this._coordinates.y + (this.height / 2));
	}
	get scrollData() {
		return this._scrollData;
	}

	/* setters */
	set context(contextRef) {
		this._context = contextRef;
	}
	set scrollData(scrollDataObj) {
		this._scrollData = scrollDataObj;
	}
}

Canvas2D.prototype.init = function(fillImage, callBack) {
	if (this._selector && !this._context) {
		const canvasElem = document.querySelector(this._selector);
		if (canvasElem) {
			this._context = canvasElem.getContext('2d');
		}
	}
	if (fillImage) {
		this._image = imageService.loadImage(fillImage, callBack);		
	}
	this._ready = !!this._context;	
}

Canvas2D.prototype.clear = function(fromPoint, toPoint) {
	if (!this._context) return;
	this._context.clearRect((fromPoint && fromPoint.x) || 0, 
		(fromPoint && fromPoint.y) || 0, 
		(toPoint && toPoint.x) || this._width, 
		(toPoint && toPoint.y) || this._height
	);
}

Canvas2D.prototype.draw = function() {
	if (!this._ready || !this._context) return;
	this.clear();
	this._context.drawImage(this._image, this._coordinates.x, this._coordinates.y, this._width, this._height);	
};

Canvas2D.prototype.focus = function(gameObject) {
	if (!gameObject) return;
	this._anchor = gameObject;
	this._coordinates.x = gameObject.centre.x - (this._width / 2);
	this._coordinates.y = gameObject.centre.y - (this._height / 2);
}

Canvas2D.prototype.scroll = function () {
	this._coordinates.x += this._scrollData.velocity.x;
	this._coordinates.y += this._scrollData.velocity.y;
}

Canvas2D.prototype.contains = function(x, y, width, height) {
	return (x + (width || 0) >= this._coordinates.x && y + (height || 0) >= this._coordinates.y) &&
		 (x <= this._coordinates.x + this._width && y <= this._coordinates.y + this._height)
};
