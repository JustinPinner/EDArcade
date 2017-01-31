// js/imageService
var ImageService = function() {
	var loadedImages = [];

	this.loadImage = function(imgPath, onLoad) {
		for(var i = 0; i < loadedImages.length; i++) {
			if (loadedImages[i].path === imgPath) {
				return loadedImages[i].img;
			}
		}
		var image = new Image();
		image.src = imgPath;
		if (onLoad) {
			image.onload = onLoad(image);
		}
		loadedImages.push({path: imgPath, img: image});
		return image;
	}
}