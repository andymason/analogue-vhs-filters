var img = document.querySelector('#source_image');
var canvas = document.querySelector('#screen');
var canvas2 = document.querySelector('#screen2');
//canvas.height = window.innerHeight;
//canvas.width = window.innerWidth;

function doStuff() {
  var analogue = new Analogue(canvas, img);
  analogue.drawImage();

  analogue.border(10);


  analogue.saturation(-0.3);
  analogue.noise(10, true);
  //analogue.text('Analogue/VHS Filters', 50, 60, 40);
  analogue.stutter(0.1);
  analogue.bend(10, 1, 0, 50);
  analogue.rgbShift(0.13, true);
  analogue.ghost(40, 0, 0.15, false);
  analogue.ghost(30, 0, 0.3, true);
  analogue.vignette(0.2, 0.1);
  analogue.brightness(-60);
  analogue.contrast(40);
  analogue.scanlines();
  analogue.colourBanding(0.03, 30);
  analogue.upScale(2.5);
  analogue.tint(-20, -5, 10);
  analogue.brightnessLines(0.2, 50, 120);



//  var analogue2 = new Analogue(canvas2, img);
//  analogue2.drawImage();
//
//  analogue2.border(10);
//
//
//  analogue2.saturation(-0.3);
//  analogue2.noise(10, true);
//  //analogue.text('Analogue/VHS Filters', 50, 60, 40);
//  analogue2.stutter(0.1);
//  analogue2.bend(10, 1, 0, 50);
//  analogue2.rgbShift(0.13, true);
//  analogue2.ghost(40, 0, 0.15, false);
//  analogue2.ghost(30, 0, 0.3, true);
//  analogue2.vignette(0.2, 0.1);
//  analogue2.brightness(-60);
//  analogue2.contrast(40);
//  analogue2.scanlines();
//  analogue2.colourBanding(0.03, 30);
//  analogue2.upScale(2.5);
//  analogue2.tint(-20, -5, 10);
//  analogue2.brightnessLines(0.2, 52, 120);
//
//  setInterval(function() {
//    canvas2.classList.toggle('hidden');
//  }, 30);

//  analogue.noise(10, true);
//  analogue.scanlines();
//  //analogue.rgbShift(0.13, true);
//  analogue.ghost(40, 0, 0.1, false);
//  analogue.ghost(30, 0, 0.2, true);
//  analogue.upScale(1.5);





  // Far too slow. Replace with image data manipulation.
  //analogue.leds(4, 2, 0.1, false, true);

//  var canvasFX = fx.canvas();
//  var texture = canvasFX.texture(canvas);
//  canvasFX.draw(texture).perspective([175,156,496,55,161,279,504,330], [137,122,561,46,130,306,561,363]).tiltShift(215, 442.25, 215, 40.390625, 10, 150).update();
//  document.body.appendChild(canvasFX);


}

setTimeout(doStuff, 100);
