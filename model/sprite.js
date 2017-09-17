class Sprite {
    constructor(x, y, width, height, name, cells) {
        this.coord = new Point2d(x, y);
        this.w = width;
        this.h = height;
        this.name = name;
        this.loadedImage = null;
        this.cells = cells || {};
    }

    get image() {
        return this.loadedImage;
    }
}

Sprite.prototype.loadImage = function() {
    this.loadedImage = imageService.loadImage('../image/' + this.name + '.png');
}
