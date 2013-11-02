/**
 * Signal interference first.
 * Display distortions.
 */

var Analogue = Analogue || function(srcCanvas, srcImg) {
  var canvas = srcCanvas;
  var img = srcImg;
  var ctx = canvas.getContext('2d');
  var width = parseInt(canvas.width, 10);
  var height = parseInt(canvas.height, 10);


  var sandboxCanvas = document.createElement('canvas');
  var sandboxCtx = sandboxCanvas.getContext('2d');
  sandboxCanvas.width = width;
  sandboxCanvas.height = height;

  function ghost(xShift, yShift, alpha, isNegative) {
    var imgData = _getImageData(canvas);

    if (isNegative) {
      imgData = _negative(imgData);
    }

    if (!!alpha) {
      imgData = _opacity(imgData, alpha);
    }

    imgData = _saturation(imgData, -0.4);
    imgData = _brightness(imgData, -90);
    imgData = _contrast(imgData, 90)

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

  function _brightness(imgData, brightness) {
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      data[i] = _truncate(data[i] + brightness);
      data[i + 1] = _truncate(data[i + 1] + brightness);
      data[i + 2] = _truncate(data[i + 2] + brightness);
    }
    return imgData;
  }

  function brightness(brightnessVal) {
    var imgData = _brightness(_getImageData(canvas), brightnessVal);
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
    console.time('filter');
    var imgData = _saturation(_getImageData(canvas), saturationVal);
    console.timeEnd('filter');
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

  function _scanlines(imgData, brightness, spacing) {
    var brightness = brightness || 10;
    var lineSpacing = spacing || 3;
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

  function scanlines(brightness, spacing) {
    var imgData = _scanlines(_getImageData(canvas), brightness, spacing);
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


  function leds(ledWidth, borderWidth, borderOpacity, fuzzyLines, rgbCells) {
    var borderWidth = borderWidth || 1;
    var borderOffset = (fuzzyLines) ? 0 : borderWidth / 2;
    var ledWidth = ledWidth || 4;
    var ledHeight = Math.ceil(ledWidth * 1.2);
    var ledColCount = Math.ceil(width / ledWidth);
    var ledRowCount = Math.ceil(height / ledHeight);


    ctx.strokeStyle = 'rgba(0, 0, 0, ' + (borderOpacity || 0.8) + ')';
    ctx.lineWidth = borderWidth;

    for (var row = -1; row < ledRowCount; row++) {
      for (var i = 0; i < ledColCount; i++) {
          //ctx.strokeRect(ledWidth * i, ledHeight * row, ledWidth * (i + 1), ledHeight * (row + 1));

          //ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * row) + borderOffset);
          //ctx.lineTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)) + borderOffset);
          //ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)));
          //ctx.lineTo((ledWidth * (i + 1)) + borderOffset, (ledHeight * (row + 1)));

          var vertOffset = 0;
          if ( i % 2 === 0) {
            vertOffset = Math.floor(ledHeight / 2);
          }


        if (rgbCells) {
          var ledInnerWidth = ledWidth - borderWidth;
          //var ledCellWidth = Math.round(ledInnerWidth / 3);
          var ledCellWidth = ledInnerWidth / 3;


          ctx.globalCompositeOperation = 'lighter';

          for (var c = 0; c < 3; c++) {

            if (c === 0) { ctx.fillStyle = 'rgba(255, 0, 0, ' + (borderOpacity || 0.8) + ')'; }
            else if (c === 1) { ctx.fillStyle = 'rgba(0, 255, 0, ' + (borderOpacity || 0.8) + ')'; }
            else if (c === 2) { ctx.fillStyle = 'rgba(0, 0, 255, ' + (borderOpacity || 0.8) + ')'; }


//            var xpos = Math.round((ledWidth * i) + (borderWidth/2) + ledCellWidth * c + borderOffset/2);
//            var ypos = Math.round((ledHeight * row) + vertOffset + (borderWidth/2) + borderOffset/2);
            var xpos = (ledWidth * i) + (borderWidth/2) + ledCellWidth * c + borderOffset/2;
            var ypos = (ledHeight * row) + vertOffset + (borderWidth/2) + borderOffset/2;

            ctx.fillRect(
              xpos,
              ypos,
              ledCellWidth,
              ledHeight
            );
          }

          ctx.globalCompositeOperation = 'source-over';
        }

        ctx.beginPath();
          ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * row) + borderOffset + vertOffset);
          ctx.lineTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)) + borderOffset + vertOffset);

          ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)) + borderOffset + vertOffset);
          ctx.lineTo((ledWidth * (i + 1)) + borderOffset, (ledHeight * (row + 1)) + borderOffset + vertOffset);

          ctx.closePath();
          ctx.stroke();
      }
    }

  }

  function brightnessLines(alpha, yPos, height) {
    var barAlpha = alpha || 0.5;
    var barYPos = yPos || 200;
    var barHeight = height || 100;

    ctx.globalCompositeOperation = 'lighter';

    var linGrad = ctx.createLinearGradient(width/2, barYPos, width/2, barYPos + barHeight);
    linGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    linGrad.addColorStop(0.07, 'rgba(255, 255, 255, ' + alpha + ')');
    linGrad.addColorStop(0.93, 'rgba(255, 255, 255, ' + alpha + ')');
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
    var amp = amount || 100;
    var xOffset = (x || 0) * 4;
    var yOffset = (y || 0);

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
    drawImage: drawImage
  }
};

