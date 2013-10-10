/**
 * Signal interference first.
 * Display distortions.
 */

var Analogue = Analogue || function(srcCanvas, srcImg) {
  var canvas = srcCanvas;
  var img = srcImg;
  var ctx = canvas.getContext('2d');
  var width = canvas.width;
  var height = canvas.height;

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

    sandboxCtx.clearRect(0, 0, width, height);
    sandboxCtx.putImageData(imgData, 0, 0);
    ctx.drawImage(sandboxCanvas, xShift, yShift);
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
    for (var i = 0; i < data.length; i += 4) {
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

  function _noise(imgData, noiseAmount) {
    var data = imgData.data;
    for (var i = 0; i < data.length; i += 4) {
      var multiplier = (Math.random() > 0.5) ? -1 : 1;
      data[i] = _truncate(data[i] + noiseAmount * multiplier);
      data[i + 1] = _truncate(data[i + 1] + noiseAmount * multiplier);
      data[i + 2] = _truncate(data[i + 2] + noiseAmount * multiplier);
    }
    return imgData;
  }

  function noise(noiseAmount) {
    var imgData = _noise(_getImageData(canvas), noiseAmount);
    ctx.putImageData(imgData, 0, 0);
  }

  function _scanlines(imgData, amount, spacing) {
    var data = imgData.data;
    for (var row = 0; row < height; row++) {
      if (row % spacing !== 0) continue;
      for (var col = 0; col < width; col++) {
          var i = (col + (row * width)) * 4;
          data[i] = _truncate(data[i] + amount);
          data[i + 1] = _truncate(data[i + 1] + amount);
          data[i + 2] = _truncate(data[i + 2] + amount);
      }
    }
    return imgData;
  }

  function scanlines(amount, spacing) {
    var imgData = _scanlines(_getImageData(canvas), amount, spacing);
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
	
	}
	
	function upScale(factor) {
		var imgData = _upScale(_getImageData(canvas), factor);
    if (imgData) { ctx.putImageData(imgData, 0, 0); }
	}
  
  
  function leds() {
    
    
    var borderWidth = 1;
    var borderOffset = borderWidth / 2;
    var ledWidth = 4;
    var ledHeight = 6;
    var ledColCount = Math.ceil(width / ledWidth);
    var ledRowCount =height//Math.ceil(height / ledHeight);
    
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = borderWidth;
    
    for (var row = 0; row < ledRowCount; row++) {
      for (var i = 0; i < ledColCount; i++) {
          //ctx.strokeRect(ledWidth * i, ledHeight * row, ledWidth * (i + 1), ledHeight * (row + 1));
          ctx.beginPath();
          //ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * row) + borderOffset);
          //ctx.lineTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)) + borderOffset);
          //ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)));
          //ctx.lineTo((ledWidth * (i + 1)) + borderOffset, (ledHeight * (row + 1)));
          
          var vertOffset = 0;
          if ( i % 2 === 0) {
            vertOffset = Math.floor(ledHeight / 2);
          }
          
          ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * row) + borderOffset + vertOffset);
          ctx.lineTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)) + borderOffset + vertOffset);
          
          ctx.moveTo((ledWidth * i) + borderOffset, (ledHeight * (row + 1)) + borderOffset + vertOffset);
          ctx.lineTo((ledWidth * (i + 1)) + borderOffset, (ledHeight * (row + 1)) + borderOffset + vertOffset);
          
          ctx.closePath();
          ctx.stroke();
      }
    }
    
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
    drawImage: drawImage
  }
};