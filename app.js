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
  analogue.saturation(-0.4);


  analogue.text('Analogue/VHS Filters');
  analogue.stutter(0.3);


  analogue.ghost(10, 0, 0.3, true);
  analogue.vignette(0.2);

  analogue.noise(2);
  analogue.brightness(-40);
  analogue.contrast(60);
  //analogue.tint(-30, -10, 20);
  analogue.colourBanding(0.02, 30);
  analogue.upScale(2);
  analogue.saturation(-0.2);









  analogue.brightness(-50);
  analogue.contrast(80);
  analogue.tint(-20, -5, 10);
  analogue.brightnessLines(0.2, 50, 120);





  analogue.leds(2, 1, 0.1, false, true);

//  var canvasFX = fx.canvas();
//  var texture = canvasFX.texture(canvas);
//  canvasFX.draw(texture).perspective([175,156,496,55,161,279,504,330], [137,122,561,46,130,306,561,363]).tiltShift(215, 442.25, 215, 40.390625, 10, 150).update();
//  document.body.appendChild(canvasFX);


}

setTimeout(doStuff, 100);