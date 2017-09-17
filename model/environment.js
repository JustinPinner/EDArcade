// model/environment.js

const ScreenBorder = {
	VERTICAL: 40,
	HORIZONTAL: 40
};

var systemGeometry = {
	width: window.innerWidth, 
	height: window.innerHeight
};

/*
	Fixed background image
*/
class Background extends Canvas2D {
	constructor(x, y, width, height, selector) {
		super(x, y, width, height, selector || '#bgcanvas');
	}
}

Background.prototype.init = function(fillImage) {
	this.__proto__.init(fillImage, function() {
		environment.background.draw();}			
	);
}

Background.prototype.draw = function() {
	this.__proto__.draw();
	this._image.removeEventListener('load', environment.background.draw, false);		
}

/*
	Scrolling starfield overlay
*/
class Midground extends Canvas2D {
	constructor(x, y, width, height, selector) {
		super(x, y, width, height, selector || '#mgcanvas');
		this._scrollScale = 0.75;
	}
}

Midground.prototype.init = function(fillImage) {
	this.__proto__.init(fillImage || '../image/star-tile-transparent.png');
}

Midground.prototype.draw = function(scrollData) {
	if (!this.ready) return;
	// scroll direction is opposide of ship direction		
	var newX = scrollData.vx != 0 ? this._coordinates.x - scrollData.vx * this.scrollScale : this._coordinates.x;
	var newY = scrollData.vy != 0 ? this._coordinates.y - scrollData.vy * this.scrollScale : this._coordinates.y;
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
var Viewport = function() {
	this._width = systemGeometry.width;
	this._height = systemGeometry.height;

	// x and y will be virtual coordinates based on the player's location
	this._coordinates = new Point2d(0, 0);
	// this.x = 0;
	// this.y = 0;
	
	// the viewport is always anchored at 0,0
	this._centre = new Point2d(this._width / 2, this._height / 2);
	//this.cx = this.width / 2;
	//this.cy = this.height / 2;

	this.div = document.querySelector('#fgdiv');
	this.div.style.width = this._width.toString() + 'px';
	this.div.style.height = this._height.toString() + 'px';
	this.div.style.left = '0px';
	this.div.style.top = '0px';

	this.cnv = document.querySelector("#fgcanvas");
	this.cnv.width = this._width;
	this.cnv.height = this._height;

	this.ctx = this.cnv.getContext('2d');

	this.clear = function() {
		this.ctx.clearRect(this._coordinates.x, this._coordinates.y, this._width, this._height);
	};
	
	this.scroll = function(scrollData) {
		this._coordinates.x += scrollData.vx;
		this._coordinates.y += scrollData.vy;
		environment.midground.draw(scrollData);
	};
	
	this.contains = function(x, y, width, height) {
		// Xo + Wo >= Xs && Yo + Ho >= Ys
		// Xo <= Xs + Ws && Yo <= Ys + Hs

		return (x + width >= this._coordinates.x && y + height >= this._coordinates.y) &&
	 		(x <= this._coordinates.x + this._width && y <= this._coordinates.y + this._height)
	};
};

/*
	Game environment object
*/
var GameEnv = function() {
	this.background = new Background();
	// size and style background wrapper div
	var bgWrapper = document.querySelector('#bgdiv');
	if (bgWrapper) {
		bgWrapper.style.left = this.background.coordinates.x.toString() + 'px';
		bgWrapper.style.top = this.background.coordinates.y.toString() + 'px';
		bgWrapper.style.width = this.background.width.toString() + 'px';
		bgWrapper.style.height = this.background.height.toString() + 'px';
		bgWrapper.style.backgroundColor = '#000000';
	}
	// size background container element to match canvas dimensions
	var bgCanvasElement = document.querySelector(this.background.selector);
	if (bgCanvasElement) {
		bgCanvasElement.style.left = this.background.coordinates.x.toString() + 'px';
		bgCanvasElement.style.top = this.background.coordinates.y.toString() + 'px';
		bgCanvasElement.width = this.background.width;
		bgCanvasElement.height = this.background.height;
	}
	
	this.midground = new Midground();
	var mgWrapper = document.querySelector('#mgdiv');
	if (mgWrapper) {
		mgWrapper.style.left = this.midground.coordinates.x.toString() + 'px';
		mgWrapper.style.top = this.midground.coordinates.y.toString() + 'px';
		mgWrapper.style.width = this.midground.width.toString() + 'px';
		mgWrapper.style.height = this.midground.height.toString() + 'px';
		mgWrapper.style.background = 'transparent';	
	}
	// size mid-ground container element to match canvas dimensions
	var mgCanvasElement = document.querySelector(this.midground.selector);
	if (mgCanvasElement) {
		mgCanvasElement.style.left = this.midground.coordinates.x.toString() + 'px';
		mgCanvasElement.style.top = this.midground.coordinates.y.toString() + 'px';
		mgCanvasElement.width = this.midground.width;
		mgCanvasElement.height = this.midground.height;
	}

	this.viewport = new Viewport(this);

	this.isReady = function() {
		return this.background.ready && this.midground.ready;
	};

	this.init = function() {
		this.background.init();
		this.midground.init();	
	};
};


