// model/environment.js

var systemGeometry = {
	width: window.innerWidth, 
	height: window.innerHeight
};

/*
	Fixed background image
*/
var Background = function() {
	this.isReady = function() {
		return this.image !== null;
	}
	
	this.width = systemGeometry.width;
	this.height = systemGeometry.height;
	this.x = 0;
	this.y = 0;

	this.div = document.querySelector('#bgdiv');
	this.div.style.left = this.x.toString() + 'px';
	this.div.style.top = this.y.toString() + 'px';
	this.div.style.width = this.width.toString() + 'px';
	this.div.style.height = this.height.toString() + 'px';
	this.div.style.backgroundColor = '#000000';

	this.cnv = document.querySelector('#bgcanvas');
	this.cnv.style.left = this.x.toString() + 'px';
	this.cnv.style.top = this.y.toString() + 'px';
	this.cnv.width = this.width;
	this.cnv.height = this.height;
	
	this.ctx = this.cnv.getContext('2d');	
	
	this.imgSrc = '../image/starfield-1920x1080.jpg';
	this.image = null;

	this.scrollScale = 0;

	this.clear = function() {	
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	};

	this.init = function() {
		this.image = imageService.loadImage(this.imgSrc);
	}

	this.draw = function() {
		this.clear();
		this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
	}
}

/*
	Scrolling starfield overlay
*/
var Midground = function() {
	this.isReady = function() {
		return this.image !== null;
	}

	this.width = systemGeometry.width;
	this.height = systemGeometry.height;
	this.x = 0;
	this.y = 0;

	this.div = document.querySelector('#mgdiv');
	this.div.style.left = this.x.toString() + 'px';
	this.div.style.top = this.y.toString() + 'px';
	this.div.style.width = this.width.toString() + 'px';
	this.div.style.height = this.height.toString() + 'px';
	this.div.style.background = 'transparent';

	this.cnv = document.querySelector('#mgcanvas');
	this.cnv.style.left = this.x.toString() + 'px';
	this.cnv.style.top = this.y.toString() + 'px';
	this.cnv.width = this.width;
	this.cnv.height = this.height;
	
	this.ctx = this.cnv.getContext('2d');	
	
	this.imgSrc = '../image/star-tile-transparent.png';
	this.image = null;

	this.scrollScale = 0.75;

	this.clear = function() {	
		this.ctx.clearRect(0, 0, this.width, this.height);
	};

	this.init = function() {
		this.image = imageService.loadImage('../image/star-tile-transparent.png');
	}

	this.draw = function(scrollData) {
		// scroll direction is opposide of ship direction		
		var newX = scrollData.moveX != 0 ? this.x + scrollData.moveX * this.scrollScale : this.x;
		var newY = scrollData.moveY != 0 ? this.y + scrollData.moveY * this.scrollScale : this.y;
		this.x = newX >= this.width ? 0 : (newX < 0 ? this.width : newX);
		this.y = newY >= this.height ? 0 : (newY < 0 ? this.height : newY);
		this.clear();
		// draw the background
		this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
		// top-left
		this.ctx.drawImage(this.image, this.x - this.width, this.y - this.height, this.width, this.height);
		// top
		this.ctx.drawImage(this.image, this.x, this.y - this.height, this.width, this.height);
		// top-right
		this.ctx.drawImage(this.image, this.x + this.width, this.y - this.height, this.width, this.height);
		// right
		this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
		// bottom-right
		this.ctx.drawImage(this.image, this.x + this.width, this.y + this.height, this.width, this.height);
		// bottom
		this.ctx.drawImage(this.image, this.x, this.y + this.height, this.width, this.height);		
		// botom-left
		this.ctx.drawImage(this.image, this.x - this.width, this.y + this.height, this.width, this.height);
		// left
		this.ctx.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);		
	}
}

/*
	Player viewport (foreground)
*/
var Viewport = function() {
	this.width = systemGeometry.width;
	this.height = systemGeometry.height;

	this.x = 0;
	this.y = 0;

	this.div = document.querySelector('#fgdiv');
	this.div.style.width = this.width.toString() + 'px';
	this.div.style.height = this.height.toString() + 'px';
	this.div.style.left = this.x.toString() + 'px';
	this.div.style.top = this.y.toString() + 'px';

	this.cnv = document.querySelector("#fgcanvas");
	this.cnv.width = this.width;
	this.cnv.height = this.height;

	this.ctx = this.cnv.getContext('2d');

	this.getCentre = function() {
		return {
			x: this.x + (this.width / 2),
			y: this.y + (this.height / 2)
		};
	};	
	this.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	};
	this.scroll = function(scrollData) {
		environment.midground.draw(scrollData);
		//this.x += scrollData.moveX;
		//this.y += scrollData.moveY;
	};
	this.contains = function(x, y, geometry) {
	 return (x > this.x && x < this.x + this.width) && 
	 	(y > this.y && y < this.y + this.height)
	};
};

/*
	Game environment object
*/
var GameEnv = function() {
	this.background = new Background();
	this.midground = new Midground();
	this.viewport = new Viewport(this);

	this.isReady = function() {
		return this.background.isReady() && this.midground.isReady();
	};

	this.init = function() {
		this.background.init();
		this.midground.init();	
	};
};


