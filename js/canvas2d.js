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
	/* setters */
	set context(contextRef) {
		this._context = contextRef;
	}
}

Canvas2D.prototype.init = function(fillImage, callBack) {
	if (this._selector && !this._context) {
		var canvasElem = document.querySelector(this._selector);
		if (div) {
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
	this._context.clearRect(fromPoint.x || this._coordinates.x, 
		fromPoint.y || this._coordinates.y, 
		toPoint.x || this._width, 
		toPoint.y || this._height
	);
}

Canvas2D.prototype.draw = function() {
	if (!this._ready || !this._context) return;
	this.clear();
	this._context.drawImage(this._image, this._coordinates.x, this._coordinates.y, this._width, this._height);	
};
