var img = document.querySelector('#source_image');
var canvas = document.querySelector('#screen');

function doStuff() {
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


  analogue.contrast(-80);
  analogue.brightness(30);
  */
  //analogue.saturation(-0.6);

  analogue.ghost(10, 0, 0.3, true);
  //analogue.noise(10);
  analogue.brightness(-40);
  analogue.contrast(60);

  //
  analogue.tint(-30, -10, 20);
  analogue.colourBanding(0.04, 30);
  analogue.upScale(2);

  analogue.leds(3, 1, 0.3, false, true);

}

setTimeout(doStuff, 100);