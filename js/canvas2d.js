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
	get focussedObject() {
		return this._anchor;
	}

	/* setters */
	set context(contextRef) {
		this._context = contextRef;
	}
	set scrollData(scrollDataObj) {
		this._scrollData = scrollDataObj;
	}
};

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
};

Canvas2D.prototype.clear = function(fromPoint, toPoint) {
	if (!this._context) return;
	this._context.clearRect((fromPoint && fromPoint.x) || 0, 
		(fromPoint && fromPoint.y) || 0, 
		(toPoint && toPoint.x) || this._width, 
		(toPoint && toPoint.y) || this._height
	);
};

Canvas2D.prototype.draw = function() {
	if (!this._ready || !this._context) return;
	this.clear();
	this._context.drawImage(this._image, this._coordinates.x, this._coordinates.y, this._width, this._height);	
};

Canvas2D.prototype.focus = function(gameObject) {
	if (!gameObject) return;
	if (this._anchor === gameObject) return;
	this._anchor = gameObject;
	this._coordinates.x = gameObject.coordinates.centre.x - (this._width / 2);
	this._coordinates.y = gameObject.coordinates.centre.y - (this._height / 2);
};

Canvas2D.prototype.scroll = function () {
	this._coordinates.x += this._scrollData.velocity.x;
	this._coordinates.y += this._scrollData.velocity.y;
};

Canvas2D.prototype.contains = function(x, y, width, height, heading) {
	const x1 = x;
	const y1 = y;
	const x2 = x + width;
	const y2 = y + height;
	const cx = x1 + width / 2;
	const cy = y1 + height / 2;

	const p1 = heading ? 
		rotatePoint(cx, cy, x1, y1, heading) :
		new Point2d(x1, y1);
	
	const p2 = heading ?
		rotatePoint(cx, cy, x2, y2, heading) :
		new Point2d(x2, y2);

	const isContained =
		// p1.x >= this._coordinates.x && p1.y >= this._coordinates.y && 
		// p2.x <= this._coordinates.x + this.width && p2.y <= this._coordinates.y + this.height;
		this.focussedObject ?
			p1.x >= this.focussedObject.coordinates.x - this._width / 2 && 
			p1.y >= this.focussedObject.coordinates.y - this.height / 2 && 
			p2.x <= this.focussedObject.coordinates.x + this.width / 2 &&
			p2.y <= this.focussedObject.coordinates.y + this.height / 2
		:
			p1.x >= this._coordinates.x &&
			p1.y >= this._coordinates.y &&
			p2.x <= this._coordinates.x + this.width &&
			p2.y <= this._coordinates.y + this.height;

	return isContained;
};

Canvas2D.prototype.containsObject = function(obj) {
	if (this.focussedObject === obj) {
		return true;
	} else {
		return this.contains(
			obj.coordinates.x, 
			obj.coordinates.y, 
			obj.width, 
			obj.height, 
			obj.heading
		);
	}
}
