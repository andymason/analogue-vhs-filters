/**
 * Signal interference first.
 * Display distortions.
 */



 /**
  init:
    canvas element
    start Image

  run:
    filters array or single filter option
    callback

 */

var GlitchFX = (function() {
  var ledImages = [
    'img/tiles/scanrez2.png',
    'img/tiles/aperture.png',
    'img/tiles/aperture1x2rb.png',
    'img/tiles/scanrez2.png'
  ];

  // Load and store images
  ledImages = ledImages.map(function(imgPath) {
    var img = new Image();
    img.src = imgPath;
    return img;
  });

  var filters = {};

  filters.sampleFilter = function(options, callback) {
    console.log('test filter', options, this);
    callback();
  };

  filters.secondFilter = function(options, callback) {
    console.log('SECOND FILTER', options, this);
    callback();
  };

  function init(_canvas, _startImg) {
    this.canvas = _canvas;
    this.ctx = _canvas + '-ctx';
    this.startImg = _startImg;

    return applyFilters.bind(this);
  }

  function applyFilters(filterCollection, _callback) {
    var args = arguments;
    var that = this;

    function loopFilters() {
      if (filterCollection.length === 0) {
        _callback();
        return;
      }

      var filterOpt = filterCollection.shift();
      filters[filterOpt.name].call(that, filterOpt.options, loopFilters);
    }

    loopFilters();
  }


  return init;
}());


var test1 = new GlitchFX('canvas1', 'img1');
test1([{name: 'sampleFilter', options: { height: 2, opacity: 0.3 } }, {name: 'secondFilter', options: {opacity: 1} }, {name: 'secondFilter', options: {opacity: 1} }], function() { console.log('test 1 finished'); });

var test2 = new GlitchFX('canvas2', 'img2');
test2([{name: 'sampleFilter', options: { height: 100, opacity: 1 } }], function() { console.log('test 2 finished'); });




/* FIXME: Only load assets once. Doing it again on render causes a re-downlad
          and a width, height 0 as image hasn't finished downloading.
*/
 var scanImg = new Image();
scanImg.src = 'img/tiles/scanrez2.png';

var scan1Img = new Image();
scan1Img.src = 'img/tiles/aperture.png';

var scan2Img = new Image();
scan2Img.src = 'img/tiles/aperture1x2rb.png';

var scan3Img = new Image();
scan3Img.src = 'img/tiles/scanrez2.png';


var Analogue = Analogue || function(srcCanvas, srcImg) {
  var canvas = srcCanvas;
  var img = srcImg;
  var ctx = canvas.getContext('2d');
  var width = parseInt(canvas.width, 10);
  var height = parseInt(canvas.height, 10);

  ctx.imageSmoothingEnabled = false;




  var sandboxCanvas = document.createElement('canvas');
  var sandboxCtx = sandboxCanvas.getContext('2d');
  sandboxCanvas.width = width;
  sandboxCanvas.height = height;

  function ghost(xShift, yShift, alpha, isNegative) {
    var imgData = _getImageData(canvas);

    if (isNegative) {
      imgData = _negative(imgData);
    }

    if (!isNaN(alpha)) {
      imgData = _opacity(imgData, alpha);
    }

    imgData = _saturation(imgData, -0.4);
    imgData = _brightness(imgData, -90);
    imgData = _contrast(imgData, 90);

    ctx.globalCompositeOperation = 'lighter';
    sandboxCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(sandboxCanvas, xShift, yShift);


    if (xShift > 0 || xShift < 0) {
      var offset =(xShift > 0) ? xShift - width : xShift + width;
      ctx.drawImage(sandboxCanvas, offset,  yShift);
    }

    if (yShift > 0 || yShift < 0) {
      var offset =(yShift > 0) ? yShift - height : yShift + height;
      ctx.drawImage(sandboxCanvas, xShift,  offset);
    }

    if ((xShift > 0 || xShift < 0) && (yShift > 0 || yShift < 0)) {
      var xOffset =(xShift > 0) ? xShift - width : xShift + width;
      var yOffset =(yShift > 0) ? yShift - height : yShift + height;
      ctx.drawImage(sandboxCanvas, xOffset,  yOffset);
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  function _getImageData(img) {
    sandboxCtx.clearRect(0, 0, width, height);
    sandboxCtx.drawImage(img, 0, 0, width, height);
    return sandboxCtx.getImageData(0, 0, width, height);
  }

  function _opacity(imgData, alpha) {
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i + 3] = parseInt(data[i + 3] * alpha, 10);
    }
    return imgData;
  }

  /**
   * Alter image data contrast level.
   * Source: http://stackoverflow.com/a/18495093
   */
  function _contrast(imageData, contrast) {
    var data = imageData.data;
    var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for(var i=0;i<data.length;i+=4)
    {
      data[i] = (factor * ((data[i] - 128) + 128));
      data[i+1] = (factor * ((data[i+1] - 128) + 128));
      data[i+2] = (factor * ((data[i+2] - 128) + 128));
    }

    return imageData;
  }

  function contrast(contrastVal) {
    var imgData = _contrast(_getImageData(canvas), contrastVal);
    ctx.putImageData(imgData, 0, 0);
  }

  function _negative(imgData) {
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    return imgData;
  }

  function _truncate(val) {
    if (val < 0) return 0;
    if (val > 255) return 255;
    return val;
  }

  function _brightness(imgData, b) {
    var brightnessVal = b || 0;
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = _truncate(data[i] + brightnessVal);
      data[i + 1] = _truncate(data[i + 1] + brightnessVal);
      data[i + 2] = _truncate(data[i + 2] + brightnessVal);
    }
    return imgData;
  }

  function brightness(amount) {
    var imgData = _brightness(_getImageData(canvas), amount);
    ctx.putImageData(imgData, 0, 0);
  }


  function _greyscale(imgData) {
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      var meanVal = +((data[i] + data[i + 1] + data[i + 2]) / 3);
      data[i] = meanVal;
      data[i + 1] = meanVal;
      data[i + 2] = meanVal;
    }
    return imgData;
  }

  function greyscale() {
    var imgData = _greyscale(_getImageData(canvas));
    ctx.putImageData(imgData, 0, 0);
  }

  function _tint(imgData, red, green, blue) {
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = _truncate(data[i] + red);
      data[i + 1] = _truncate(data[i + 1] + green);
      data[i + 2] = _truncate(data[i + 2] + blue);
    }
    return imgData;
  }

  function tint(red, green, blue) {
    var imgData = _tint(_getImageData(canvas), red, green, blue);
    ctx.putImageData(imgData, 0, 0);
  }

  function _saturation(imgData, saturationVal) {
    var data = imgData.data;

    for (var i = 0; i < data.length; i+=4) {
      var meanVal = +((data[i] + data[i + 1] + data[i + 2]) / 3);
      data[i] = data[i] + ((data[i] - meanVal) * saturationVal);
      data[i + 1] = data[i + 1] + ((data[i + 1] - meanVal) * saturationVal);
      data[i + 2] = data[i + 2] + ((data[i + 2] - meanVal) * saturationVal);

    }

    return imgData;
  }

  function saturation(saturationVal) {
    var imgData = _saturation(_getImageData(canvas), saturationVal);
    ctx.putImageData(imgData, 0, 0);
  }

  function _noise(imgData, noiseAmount, colour) {
    var data = imgData.data;
    var randColour;

    for (var i = 0; i < data.length; i += 4) {
      var multiplier = (Math.random() > 0.5) ? -1 : 1;
      if (colour) {
        randColour = Math.round((Math.random() * 2));
        data[i] = _truncate( (randColour === 0) ? (data[i] + noiseAmount ) : (data[i] - noiseAmount ) );
        data[i + 1] = _truncate( (randColour === 1) ? (data[i + 1] + noiseAmount ) :(data[i+1] - noiseAmount ) );
        data[i + 2] = _truncate( (randColour === 2) ? (data[i + 2] + noiseAmount ) : (data[i+2] - noiseAmount ) )

      } else {
        data[i] = _truncate( data[i] + noiseAmount * multiplier );
        data[i + 1] = _truncate( data[i + 1] + noiseAmount * multiplier );
        data[i + 2] = _truncate( data[i + 2] + noiseAmount * multiplier );

      }
    }
    return imgData;
  }

  function noise(noiseAmount, colour) {
    var imgData = _noise(_getImageData(canvas), noiseAmount, colour);
    ctx.putImageData(imgData, 0, 0);
  }

  function _scanlines(imgData, b, l) {
    var brightness = (isNaN(b)) ? 10 : b;
    var lineSpacing = (isNaN(l)) ? 3 : l;
    var data = imgData.data;
    for (var row = 0; row < height; row++) {
      if (row % lineSpacing !== 0) continue;
      for (var col = 0; col < width; col++) {
          var i = (col + (row * width)) * 4;
          data[i] = _truncate(data[i] + brightness);
          data[i + 1] = _truncate(data[i + 1] + brightness);
          data[i + 2] = _truncate(data[i + 2] + brightness);
      }
    }
    return imgData;
  }

  function scanlines(brightness, lineSpacing) {
    var imgData = _scanlines(_getImageData(canvas), brightness, lineSpacing);
    ctx.putImageData(imgData, 0, 0);
  }


  function _colourBanding(imgData, amount, bandCount) {
    sandboxCtx.clearRect(0, 0, width, height);
    sandboxCtx.putImageData(imgData, 0, 0);
    var linGrad = sandboxCtx.createLinearGradient(0, 0, width, 0);

    var bandInterval = 1 / bandCount;

    for (var i = 0; i < bandCount; i++) {
      linGrad.addColorStop(bandInterval * i, 'rgba(255, 0, 0, ' + amount + ')');
      linGrad.addColorStop(bandInterval * (i + 0.5), 'rgba(0, 255, 0, ' + amount + ')');
      linGrad.addColorStop(bandInterval * (i + 1), 'rgba(0, 0, 255, ' + amount + ')');
    }
    sandboxCtx.fillStyle = linGrad;
    sandboxCtx.fillRect(0, 0, width, height);
    return sandboxCtx.getImageData(0, 0, width, height);
  }

  function colourBanding(amount, bandCount) {
    var imgData = _colourBanding(_getImageData(canvas), amount, bandCount);
    ctx.putImageData(imgData, 0, 0);
  }

	function _upScale(imgData, factor) {
    var xScale = width / factor;
    var yScale = height / factor;
    sandboxCtx.clearRect(0, 0, width, height);
    sandboxCtx.putImageData(imgData, 0, 0);
    sandboxCtx.drawImage(sandboxCanvas, 0, 0, xScale, yScale);
    sandboxCtx.drawImage(sandboxCanvas, 0, 0, xScale, yScale, 0, 0, width, height);
    return sandboxCtx.getImageData(0, 0, width, height);
	}

	function upScale(factor) {
		var imgData = _upScale(_getImageData(canvas), factor);
    if (imgData) { ctx.putImageData(imgData, 0, 0); }
	}

  function jpegCorrupt(_amount, _quality, _iterations) {
      var parameters = {
        amount: _amount || 10,
        seed: 45,
        iterations: _iterations || 20,
        quality: _quality || 30
      };

      function drawGlitchedImageData(image_data) {
          ctx.putImageData(image_data, 0, 0);
          // FIXME: Add callback to continue filters
      }

      glitch(_getImageData(canvas), parameters, drawGlitchedImageData);
  }

  function leds(_img, _scale, _composite, _opacity) {
    var img = scanImg;
    switch (_img) {
      case(0):
        img = scanImg;
        break;
      case(1):
        img = scan1Img;
        break;
      case(2):
        img = scan2Img;
        break;
      case(3):
        img = scan3Img;
        break;
      default:
        img = scanImg;
        break;
    }

    var scale = _scale || 1;
    var alpha = _opacity || 1;
    var composit = _composite || 'multiply';


    var ledWidth = img.width * scale;
    var ledHeight = img.height * scale;


    var ledColCount = Math.ceil(width / ledWidth);
    var ledRowCount = Math.ceil(height / ledHeight);

    ctx.globalCompositeOperation = composit;
    ctx.globalAlpha = alpha;
    for (var row = -1; row < ledRowCount; row++) {
      for (var col = 0; col < ledColCount; col++) {
        ctx.drawImage(
          img,
          ledWidth * col,
          ledHeight * row,
          ledWidth,
          ledHeight
        );
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  function brightnessLines(alpha, yPos, height) {
    var barAlpha = (isNaN(alpha)) ? 0.5 : alpha;
    var barYPos = (isNaN(yPos)) ?  200 : yPos;
    var barHeight = (isNaN(height)) ? 100 : height;

    ctx.globalCompositeOperation = 'lighter';

    var linGrad = ctx.createLinearGradient(width/2, barYPos, width/2, barYPos + barHeight);
    linGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    linGrad.addColorStop(0.07, 'rgba(255, 255, 255, ' + barAlpha + ')');
    linGrad.addColorStop(0.93, 'rgba(255, 255, 255, ' + barAlpha + ')');
    linGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = linGrad;
    ctx.fillRect(0, barYPos, width, barYPos + barHeight);

    ctx.globalCompositeOperation = 'source-over';
  }


  function _stutter(imgData, glitchAmount) {
    var stutterAmount = 10 * glitchAmount;
    var data = imgData.data;
    for (var i = 0; i < height; i++) {
      var colourShift = Math.round(stutterAmount * Math.random());
      for (var k = 0; k < width; k++) {
        var index = ((i * width) + k) * 4;
        data[index] = data[index + 4 * colourShift];
        data[index + 1] = data[index + 1 + 4 * colourShift];
        data[index + 2] = data[index + 2 + 4 * colourShift];
      }
    }
    return imgData;
  }


  function stutter(amount) {
    var imgData = _stutter(_getImageData(canvas), amount);
    ctx.putImageData(imgData, 0, 0);
  }


  function vignette(alpha, size) {
    var radius = (size) ? height/ (1 + size) : height;
    var vignetteAlpha = alpha || 1;
    ctx.globalCompositeOperation = 'darker';

    // create radial gradient
    var grd = ctx.createRadialGradient(width/2, height/2, height/2, width/2, height/2, radius);
    grd.addColorStop(0, 'rgba(0, 0, 0, 0');
    grd.addColorStop(1, 'rgba(0, 0, 0, ' + vignetteAlpha + ')');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);


    ctx.globalCompositeOperation = 'source-over';
  }


  function text(msg, x, y, size, color) {
    var xPos = x || 10;
    var yPos =  y|| 10;
    var fontSize = size || 10;
    var textMsg = msg || 'Hello';
    var textColour = color || 'rgba(0, 200, 0, 0.8)';

    ctx.font = 'bold ' + fontSize + 'px Arial';
    ctx.fillStyle = textColour;
    ctx.fillText(textMsg, xPos, yPos);
  }

  function _rgbShift(imgData, distance, interlaced) {
    var data = imgData.data;
    var isInterlaces = interlaced || false;
    var lowerShift = (isInterlaces) ? Math.round(2 * distance) : distance;
    var upperShift = (isInterlaces) ? Math.round(4 * distance) : distance;
    var shiftAmount = distance;

    for (var i = 0; i < data.length; i += 4) {
      if (isInterlaces) {
          shiftAmount = (i % 2) ? lowerShift : upperShift;
      }

      data[i] = data[i + 4 * shiftAmount * 4];
      data[i + 1] = data[i + 1 + (4 * shiftAmount)];
      data[i + 2] = data[i + 2 + (4 * shiftAmount)];
    }
    return imgData;
  }


  function rgbShift(distance, interlaced) {
    var imgData = _rgbShift(_getImageData(canvas), distance, interlaced);
    ctx.putImageData(imgData, 0, 0);
  }

  function _bend(imgData, amount, freq, x, y) {
    var data = imgData.data;
    var frequency =  (height/ Math.PI) / (freq || 1);
    var amp = (isNaN(amount)) ? 100 : amount;
    var xOffset = ((isNaN(x)) ? 0 : x) * 4;
    var yOffset = ((isNaN(y)) ? 0 : y);

    for (var i = 0; i < height; i++) {
      var colourShift = Math.round(Math.sin((i + yOffset) / frequency) * amp);
      colourShift *= (colourShift < 0) ? -1 : 1;

      for (var k = 0; k < width; k++) {
        var index = ((i * width) + k) * 4;
        data[index] = data[(index + 4 * colourShift) + xOffset];
        data[index + 1] = data[(index + 1 + 4 * colourShift) + xOffset];
        data[index + 2] = data[(index + 2 + 4 * colourShift) + xOffset];
      }
    }

    return imgData;
  }

  function bend(amount, freq, x, y) {
    var imgData = _bend(_getImageData(canvas), amount, freq, x, y);
    ctx.putImageData(imgData, 0, 0);
  }

  function border(thickness, color) {
    var borderWidth = thickness || 2;

    ctx.strokeStyle = color || 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = borderWidth + 3;
    ctx.beginPath();
    ctx.strokeRect(0, 0, width, height);
    ctx.closePath();


    ctx.strokeStyle = color || 'rgb(0, 0, 0)';
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.strokeRect(0, 0, width, height);
    ctx.closePath();
  }


  function drawImage() {
    ctx.drawImage(img, 0, 0, width, height);
  }

  function updateImage(src) {
    img = src;
  }


  function pixelSort(_mode, _level, _horizontal, _vertical) {

    var mode = _mode || 0;
    var horizontal = _horizontal || false;
    var vertical = _vertical || false;

    // Modes: 0 = black, 1 = bright, 2 = white
    var level = _level || 1;

    var blackValue = parseInt(-10000000 * level, 10);

    // equivalent to rgb(164, 114, 128)
    var whiteValue = parseInt(-6000000 * level, 10);

    //  var blackValue = (255 << 24) + (32<< 16) + (32 << 8) + 32;
    var brightnessValue = parseInt(30 * level, 10);
    //  var whiteValue = (255 << 24) + (230<< 16) + (230 << 8) + 230;
    var canvasData = _getImageData(canvas);

    var imageData = canvasData.data;

    if (vertical) {
      for (var column = 0; column < width; column++) {
        sortColumn(column);
      }
    }

    if (horizontal) {
      for (var row = 0; row < height; row++) {
        sortRow(row);
      }
    }


    function sortRow(row) {
      var x = 0;
      var y = row;
      var xend = 0;

      while(xend < width-1) {

        switch(mode) {
          case 0:
            x = getFirstNotBlackX(x, y);
            xend = getNextBlackX(x, y);
            break;
          case 1:
            x = getFirstBrightX(x, y);
            xend = getNextDarkX(x, y);
            break
          case 2:
            x = getFirstNotWhiteX(x, y);
            xend = getNextWhiteX(x, y);
            break;
          default:
            break;
        }

        if (x < 0) break;

        var sortLength = xend-x;

        var unsorted = new Array(sortLength);
        var sorted = new Array(sortLength);

        for(var i=0; i<sortLength; i++) {
          unsorted[i] = getPixelValue(x + i, y);
        }

        sorted = unsorted.sort();

        for(var i=0; i<sortLength; i++) {
          setPixelValue(x + i, y, sorted[i]);
        }


        x = xend+1;
       }
      }

      function sortColumn() {
        var x = column;
        var y = 0;
        var yend = 0;

        while(yend < height-1) {
          switch(mode) {
            case 0:
              y = getFirstNotBlackY(x, y);
              yend = getNextBlackY(x, y);
              break;
            case 1:
              y = getFirstBrightY(x, y);
              yend = getNextDarkY(x, y);
              break;
            case 2:
              y = getFirstNotWhiteY(x, y);
              yend = getNextWhiteY(x, y);
              break;
            default:
              break;
          }

          if (y < 0) break;

          var sortLength = yend-y;

          var unsorted = new Array(sortLength);
          var sorted = new Array(sortLength);

          for(var i=0; i<sortLength; i++) {
            unsorted[i] = getPixelValue(x, y+i);
          }

          sorted = unsorted.sort();

          for(var i=0; i<sortLength; i++) {
            setPixelValue(x, y+i, sorted[i]);
          }

          y = yend+1;
        }
    }


      function getPixelBrightness(x, y) {
        var offset = (x + y * width) * 4;
        var r = imageData[offset];
        var g = imageData[offset + 1];
        var b = imageData[offset + 2];
        // HSL - lightness:
        // return (Math.max(r,g,b) + Math.min(r,g,b)) / 2
        // HSV - value:
        return Math.max(r,g,b) / 255 * 100;
      }


      function setPixelValue(x, y, val) {
        var offset = (x + y * width) * 4;
        var r = (val >> 16) & 255;
        var g = (val >> 8) & 255;
        var b = val & 255;
        imageData[offset] = r;
        imageData[offset+1] = g;
        imageData[offset+2] = b;
      }

      function getPixelValue(x, y) {
        var offset = (x + y * width) * 4;
        var r = imageData[offset];
        var g = imageData[offset + 1];
        var b = imageData[offset + 2];

        return ( ((255 << 8) | r) << 8 | g) << 8 | b;
      }

      function getFirstNotWhiteX(_x, _y) {
          var x = _x;
          var y = _y;
          while(getPixelValue(x, y) > whiteValue) {
            x++;
            if(x >= width) return -1;
          }
          return x;
        }

        function getNextWhiteX(_x, _y) {
          var x = _x+1;
          var y = _y;
          while(getPixelValue(x, y) < whiteValue) {
            x++;
            if(x >= width) return width-1;
          }
          return x-1;
        }



      function getFirstBrightX(_x, _y) {
        var x = _x;
        var y = _y;
        while(getPixelBrightness(x, y) < brightnessValue) {
          x++;
          if(x >= width) return -1;
        }
        return x;
      }

      function getFirstNotBlackX(_x, _y) {
        var x = _x;
        var y = _y;

        while(getPixelValue(x, y) < blackValue) {
          x++;
          if(x >= width) return -1;
        }
        return x;
      }

      function getNextBlackX(_x, _y) {
        var x = _x+1;
        var y = _y;
        while(getPixelValue(x, y) > blackValue) {
          x++;
          if(x >= width) return width-1;
        }
        return x-1;
      }

      function getNextDarkX(_x, _y) {
        var x = _x+1;
        var y = _y;
        while(getPixelBrightness(x, y) > brightnessValue) {
          x++;
          if(x >= width) return width-1;
        }
        return x-1;
      }



      function getPixelBrightness(x, y) {
        var offset = (x + y * width) * 4;
        var r = imageData[offset];
        var g = imageData[offset + 1];
        var b = imageData[offset + 2];
        // HSL - lightness:
        // return (Math.max(r,g,b) + Math.min(r,g,b)) / 2
        // HSV - value:
        return Math.max(r,g,b) / 255 * 100;
      }

      //BLACK
  function getFirstNotBlackY(_x, _y) {
    var x = _x;
    var y = _y;
    if(y < height) {
      while(getPixelValue(x, y) < blackValue) {
        y++;
        if(y >= height) return -1;
      }
    }
    return y;
  }

  function getNextBlackY(_x, _y) {
    var x = _x;
    var y = _y+1;
    if (y < height) {
      while(getPixelValue(x, y) > blackValue) {
        y++;
        if(y >= height) return height-1;
      }
    }
    return y-1;
  }

  //BRIGHTNESS
  function getFirstBrightY(_x, _y) {
    var x = _x;
    var y = _y;
    if (y < height) {
      while(getPixelBrightness(x, y) < brightnessValue) {
        y++;
        if(y >= height) return -1;
      }
    }
    return y;
  }

  function getNextDarkY(_x, _y) {
    var x = _x;
    var y = _y+1;
    if (y < height) {
      while(getPixelBrightness(x, y) > brightnessValue) {
        y++;
        if(y >= height) return height-1;
      }
    }
    return y-1;
  }

  //WHITE
  function getFirstNotWhiteY(_x, _y) {
    var x = _x;
    var y = _y;
    if (y < height) {
      while(getPixelValue(x, y) > whiteValue) {
        y++;
        if(y >= height) return -1;
      }
    }
    return y;
  }

  function getNextWhiteY(_x, _y) {
    var x = _x;
    var y = _y+1;
    if (y < height) {
      while(getPixelValue(x, y) < whiteValue) {
        y++;
        if(y >= height) return height-1;
      }
    }
    return y-1;
  }







    ctx.putImageData(canvasData, 0, 0);
  }


  return {
    ghost: ghost,
    contrast: contrast,
    brightness: brightness,
    greyscale: greyscale,
    saturation: saturation,
    tint: tint,
    noise: noise,
    scanlines: scanlines,
    colourBanding: colourBanding,
		upScale: upScale,
    leds: leds,
    brightnessLines: brightnessLines,
    stutter: stutter,
    vignette: vignette,
    text: text,
    rgbShift: rgbShift,
    bend: bend,
    border: border,
    drawImage: drawImage,
    pixelSort: pixelSort,
    jpegCorrupt: jpegCorrupt,
    updateImage: updateImage
  };
};

