
/*
	Touch interface / handler
*/

class TouchHandler {
    constructor(width, height) {
        this._enabled = false;
        this._width = width;
        this._height = height;
        this._button = {
            width: 100,
            height: 100
        };
        this._buttons = {
            leftButton: {
                x: 0 + (this._button.width / 2),
                y: this._height - (this._button.height / 2),
                width: this._button.width,
                height: this._button.height,
                backgroundColour: '#aaaaaa',
                touched: false, 
                image: imageService.loadImage('../image/leftButton.png')
            },
            rightButton: {
                x: 0 + this._button.width + (this._button.width / 2),
                y: this._height - (this._button.height / 2),
                width: this._button.width,
                height: this._button.height,
                backgroundColour: '#bbbbbb',
                touched: false,
                image: imageService.loadImage('../image/rightButton.png')
            },
            fireButton: {
                x: this._width - (this._button.width / 2),
                y: this._height - (this._button.height / 2),
                width: this._button.width,
                height: this._button.height,
                backgroundColour: '#cccccc',
                touched: false,
                image: imageService.loadImage('../image/fireButton.png')                
            },
            thrustButton: {
                x: this._width - this._button.width - (this._button.width / 2),
                y: this._height - (this._button.height / 2),
                width: this._button.width,
                height: this._button.height,
                backgroundColour: '#dddddd',
                touched: false,
                image: imageService.loadImage('../image/thrustButton.png')                
            }
        };
    }

    get buttons() {
        return this._buttons;
    }
    get enabled() {
        return this._enabled;
    }

    set enabled(val) {
        this._enabled = val;
    }
}

TouchHandler.prototype.handleTouchStart = function(evt) {
    evt.preventDefault();
    this._enabled = true;
    const touches = evt.changedTouches;
    
    for (var i = 0; i < touches.length; i++) {
        const touch = touches[i];
        for (b in this.buttons) {
            const button = this.buttons[b];
            if (button.x - (button.width / 2) <= touch.pageX && 
                button.x + (button.width / 2) >= touch.pageX && 
                button.y - (button.height / 2) <= touch.pageY &&
                button.y + (button.height / 2) >= touch.pageY
            ) {
                button.touched = true;
            }
        }
    }
}

TouchHandler.prototype.handleTouchEnd = function(evt) {
    evt.preventDefault();
    const touches = evt.changedTouches;
  
    for (var i = 0; i < touches.length; i++) {
        const touch = touches[i];
        for (b in this.buttons) {
            const button = this.buttons[b];
            if (button.x - (button.width / 2) <= touch.pageX && 
                button.x + (button.width / 2) >= touch.pageX && 
                button.y - (button.width / 2) <= touch.pageY &&
                button.y + (button.height / 2) >= touch.pageY
            ) {
                button.touched = false;
            }
        }
    }
}

class TouchInterface extends Canvas2D {
	constructor(x, y, width, height, selector) {
		super(x, y, width, height, selector || '#touchcanvas');
		this._element = document.getElementById(this._selector.substr(1));
        this._touchHandler = new TouchHandler(this._width, this._height);
        if (this._element) {
            this._element.addEventListener('touchstart', this._touchHandler.handleTouchStart.bind(this._touchHandler), true);
            this._element.addEventListener('touchend', this._touchHandler.handleTouchEnd.bind(this._touchHandler), true);	  
        }
	}
	get element() {
		return this._element;
    }
    get touchHandler() {
        return this._touchHandler;
    }		
}

TouchInterface.prototype.draw = function(debug) {
	for (b in this._touchHandler.buttons) {
        const button = this._touchHandler.buttons[b];
        if (button.image) {
            this._context.drawImage(button.image, button.x - (button.width / 2), button.y - (button.height / 2), button.width, button.height);
        } else {
            this._context.strokeStyle = button.backgroundColour ? button.backgroundColour : 'transparent';
            this._context.beginPath();
            this._context.arc(button.x, button.y, button.width / 2, 0, Math.PI * 2, false); 
            this._context.stroke();
        }
	}	
}
