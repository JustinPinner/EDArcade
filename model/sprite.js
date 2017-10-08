class Sprite {
    constructor(x, y, width, height, name, cells) {
        this._coordinates = new Point2d(x, y);
        this._width = width;
        this._height = height;
        this._name = name;
        this._loadedImage = null;
        this._cells = cells || {};
    }
    get coordinates() {
        return this._coordinates;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get cells() {
        return this._cells;
    }
    get image() {
        return this._loadedImage;
    }

    set cells(obj) {
        this._cells = obj;
    }
}

Sprite.prototype.loadImage = function() {
    this._loadedImage = imageService.loadImage('../image/' + this._name + '.png');
}
