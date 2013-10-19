var img = document.querySelector('#source_image');
var canvas = document.querySelector('#screen');
//canvas.height = window.innerHeight;
//canvas.width = window.innerWidth;

function doStuff() {
  var analogue = new Analogue(canvas, img);
  analogue.drawImage();
  analogue.border(10);

  analogue.saturation(-0.3);
  analogue.noise(10, true);
  analogue.text('Analogue/VHS Filters', 50, 60, 40);
  analogue.stutter(0.2);
  analogue.bend(10, 1, 0, 50);

  analogue.rgbShift(0.13, true);

  analogue.ghost(40, 0, 0.15, false);
  analogue.ghost(30, 0, 0.3, true);
  //analogue.ghost(60, 0, 0.3, false);
  analogue.vignette(0.7, 0.1);



  analogue.brightness(-60);
  analogue.contrast(40);

  analogue.scanlines();
  //analogue.tint(-30, -10, 20);
  analogue.colourBanding(0.03, 30);
  analogue.upScale(2.5);
  //analogue.saturation(-0.2);
//
//
//  analogue.brightness(-50);
//  analogue.contrast(80);
  analogue.tint(-20, -5, 10);
  analogue.brightnessLines(0.1, 50, 120);




  // Far too slow. Replace with image data manipulation.
  //analogue.leds(4, 2, 0.1, false, true);

//  var canvasFX = fx.canvas();
//  var texture = canvasFX.texture(canvas);
//  canvasFX.draw(texture).perspective([175,156,496,55,161,279,504,330], [137,122,561,46,130,306,561,363]).tiltShift(215, 442.25, 215, 40.390625, 10, 150).update();
//  document.body.appendChild(canvasFX);


}

setTimeout(doStuff, 100);
