var img = document.querySelector('#source_image');
var canvas = document.querySelector('#screen');
//canvas.height = window.innerHeight;
//canvas.width = window.innerWidth;

function doStuff() {
  'use strict';

  var analogue = new Analogue(canvas, img);
  analogue.drawImage();
//  analogue.text('UHF 1', 50, 60, 40, 'rgba(10, 210, 10, 0.8)');
//  analogue.border(10);
//  analogue.saturation(0.1);
//  analogue.noise(7, false);
//  analogue.noise(5, true);
//
//  analogue.stutter(0.1);
//
//  analogue.rgbShift(0.13, true);
//  analogue.ghost(42, 0, 0.2, false);
//  analogue.ghost(44, 0, 0.3, true);
//  //analogue.upScale(1.5);
//
//  analogue.vignette(0.2, 0.1);
//  analogue.brightness(-50);
//  analogue.contrast(40);
//
//  analogue.colourBanding(0.03, 30);
//  analogue.upScale(2.5);
//  analogue.bend(10, 1, 0, 50);
//  analogue.tint(-20, -5, 10);
//  analogue.scanlines();


  analogue.pixelSort();



  // Far too slow. Replace with image data manipulation.
  //analogue.leds(4, 2, 0.1, false, true);

//  var canvasFX = fx.canvas();
//  var texture = canvasFX.texture(canvas);
//  canvasFX.draw(texture).perspective([175,156,496,55,161,279,504,330], [137,122,561,46,130,306,561,363]).tiltShift(215, 442.25, 215, 40.390625, 10, 150).update();
//  document.body.appendChild(canvasFX);

//  //gif.addFrame(canvas, {delay: 200});
//  gif.addFrame(canvas, {copy: true, delay: 0.1});
//  //gif.addFrame(analogue.getCtx(), {copy: true});
//
//  gif.on('finished', function(blob) {
//    document.querySelector('#result').setAttribute('src', URL.createObjectURL(blob));
//  });
//
//  gif.render();


}

setTimeout(doStuff, 100);
