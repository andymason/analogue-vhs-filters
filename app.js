var img = document.querySelector('#source_image');
var canvas = document.querySelector('#screen');

img.onload = function() {
  var analogue = new Analogue(canvas, img);
  analogue.drawImage();
  
  /*
  analogue.ghost(10, 0, 0.3, true);
  //analogue.saturation(-0.6);
	analogue.noise(1);
  //analogue.greyscale();
  //analogue.ghost(5, 0, 0.2, true);
	analogue.upScale(2);
  analogue.brightness(-40);
  analogue.contrast(100);
  analogue.tint(-10, -10, 20);
  analogue.scanlines(-30, 2);
  analogue.colourBanding(0.02, 30);
  */
}
