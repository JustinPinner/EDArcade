// js/imageService
class ImageService {
	constructor() {
		this._loadedImages = [];
	}
}

ImageService.prototype.loadImage = function(imgPath, onLoad) {
	for(var i = 0; i < this._loadedImages.length; i++) {
		if (this._loadedImages[i].path === imgPath) {
			return this._loadedImages[i].img;
		}
	}
	var image = new Image();
	image.src = imgPath;
	if (onLoad) {
		image.addEventListener('load', onLoad, false);
	}
	this._loadedImages.push({path: imgPath, img: image});
	return image;
}
