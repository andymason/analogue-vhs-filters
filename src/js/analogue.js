/**
 * Signal interference first.
 * Display distortions.
 */

var GlitchFX = (function() {
    'use strict';

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

    function truncate(val) {
        if (val < 0) return 0;
        if (val > 255) return 255;
        return val;
    }

    return function(_canvas, _startImg) {
        var canvas = _canvas;
        var ctx = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        var startImg = _startImg;
        var sandboxCanvas = document.createElement('canvas');
        var sandboxCtx = sandboxCanvas.getContext('2d');
        sandboxCanvas.width = width;
        sandboxCanvas.height = height;


        function getImageData() {
            return ctx.getImageData(0, 0, width, height);
        }

        function drawImage() {
            ctx.drawImage(startImg, 0, 0, width, height);
        }

        drawImage();

        function setImageSmoothing(ctx, status) {
            ctx.imageSmoothingEnabled = status;
            ctx.mozImageSmoothingEnabled = status;
            ctx.webkitImageSmoothingEnabled = status;
        }

        var filters = {};

        /**
         * JPEG artifact corruption.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.jpegCorrupt = function(options, callback) {
            var parameters = {
                amount: (options) ? options.amount : 0,
                iterations: (options) ? options.iterations : 0,
                quality: (options) ? options.quality : 100,
                seed: 45
            };

            function drawGlitchedImageData(image_data) {
                ctx.putImageData(image_data, 0, 0);
                callback();
            }

            glitch(getImageData(canvas), parameters, drawGlitchedImageData);
        };


        /**
         * Add horizontal scanlines of varing brightness and vertical spaceing.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.scanlines = function(options, callback) {
            console.log(options);
            var brightness = options.brightness || 0;
            var lineSpacing = options.lineSpacing || 0;
            var imageData = getImageData();
            var data = imageData.data;

            for (var row = 0; row < height; row++) {
                if (row % lineSpacing !== 0) continue;
                for (var col = 0; col < width; col++) {
                    var i = (col + (row * width)) * 4;
                    data[i] = truncate(data[i] + brightness);
                    data[i + 1] = truncate(data[i + 1] + brightness);
                    data[i + 2] = truncate(data[i + 2] + brightness);
                }
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };

        /**
         * Vignette the canvas surroundings.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.vignette = function(options, callback) {
            var radius = ('size' in options) ? height/ (1 + options.size) : height;
            var vignetteAlpha = ('alpha' in options) ? options.alpha : 1;
            ctx.globalCompositeOperation = 'darker';

            // create radial gradient
            var grd = ctx.createRadialGradient(
                width/2, height/2, height/2, width/2, height/2, radius
            );
            grd.addColorStop(0, 'rgba(0, 0, 0, 0');
            grd.addColorStop(1, 'rgba(0, 0, 0, ' + vignetteAlpha + ')');
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
            callback();
        };


        /**
         * Greyscale.
         * @param  {object}   option
         * @param  {function} callback
         */
        filters.greyscale = function(option, callback) {
            var imageData = getImageData();
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                var meanVal = +((data[i] + data[i + 1] + data[i + 2]) / 3);
                data[i] = meanVal;
                data[i + 1] = meanVal;
                data[i + 2] = meanVal;
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Ghost image.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.ghost = function(options, callback) {
            var xShift = options['x-offset'] || 0;
            var yShift = options['y-offset'] || 0;
            var alpha = options.alpha ||  0;
            var invert = options.negative;
            var source = canvas;


            if (invert) {
              var imageData = ctx.getImageData(0, 0, width, height);
              var data = imageData.data;

              for (var i = 0; i < data.length; i += 4) {
                  data[i] = 255 - data[i];
                  data[i + 1] = 255 - data[i+1];
                  data[i + 2] = 255 - data[i+2];
              }

              sandboxCtx.putImageData(imageData, 0, 0);
              source = sandboxCanvas;
            }

            ctx.globalAlpha = alpha;
            ctx.globalCompositeOperation = options.composite || 'multiply';
            ctx.drawImage(source, xShift, yShift);
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
            callback();
        };


        /**
         * Dithering.
         * Origin source: https://github.com/meemoo/iframework/blob/gh-pages/src/nodes/image-monochrome-worker.js
         *
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.dithering = function(options, callback) {
            var bayerThresholdMap = [
              [  15, 135,  45, 165 ],
              [ 195,  75, 225, 105  ],
              [  60, 180,  30, 150 ],
              [ 240, 120, 210,  90 ]
            ];

            var lumR = [];
            var lumG = [];
            var lumB = [];

            for (var i=0; i<256; i++) {
              lumR[i] = i*0.299;
              lumG[i] = i*0.587;
              lumB[i] = i*0.114;
            }

            var threshold = options.threshold || 0;
            var type = options.type || false;
            var isMonochrome = options.monochrome || false;
            var imageData = getImageData();
            var imageDataLength = imageData.data.length;


            // Greyscale luminance (sets r pixels to luminance of rgb)
            for (var i = 0; i <= imageDataLength; i += 4) {
                imageData.data[i] = Math.floor(lumR[imageData.data[i]] + lumG[imageData.data[i+1]] + lumB[imageData.data[i+2]]);
            }

            var w = imageData.width;
            var newPixel, err;
            var pixelIncrement = (isMonochrome) ? 4 : 1;
            for (var currentPixel = 0; currentPixel <= imageDataLength; currentPixel+=pixelIncrement) {
                if (type === "none") {
                  // No dithering
                  imageData.data[currentPixel] = imageData.data[currentPixel] < threshold ? 0 : 255;
                } else if (type === "bayer") {
                  // 4x4 Bayer ordered dithering algorithm
                  var x = Math.floor(currentPixel/4 % w);
                  var y = Math.floor(currentPixel/4 / w);
                  var map = Math.floor( (imageData.data[currentPixel] + bayerThresholdMap[x%4][y%4]) / 2 );
                  imageData.data[currentPixel] = (map < threshold) ? 0 : 255;
                } else if (type === "floydsteinberg") {
                  // Floyd–Steinberg dithering algorithm
                  newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
                  err = Math.floor((imageData.data[currentPixel] - newPixel) / 16);
                  imageData.data[currentPixel] = newPixel;

                  imageData.data[currentPixel       + 4 ] += err*7;
                  imageData.data[currentPixel + 4*w - 4 ] += err*3;
                  imageData.data[currentPixel + 4*w     ] += err*5;
                  imageData.data[currentPixel + 4*w + 4 ] += err*1;
                } else {
                  // Bill Atkinson's dithering algorithm
                  newPixel = imageData.data[currentPixel] < 129 ? 0 : 255;
                  err = Math.floor((imageData.data[currentPixel] - newPixel) / 8);
                  imageData.data[currentPixel] = newPixel;

                  imageData.data[currentPixel       + 4 ] += err;
                  imageData.data[currentPixel       + 8 ] += err;
                  imageData.data[currentPixel + 4*w - 4 ] += err;
                  imageData.data[currentPixel + 4*w     ] += err;
                  imageData.data[currentPixel + 4*w + 4 ] += err;
                  imageData.data[currentPixel + 8*w     ] += err;
                }

                // Set g and b pixels equal to r
                if (isMonochrome) {
                    imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel];
                }
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Alter image data contrast level.
         * @param  {object}   options
         * @param  {function} callback
         *
         * Source: http://stackoverflow.com/a/18495093
         */
        filters.contrast = function(options, callback) {
            var contrast = options.contrast || 100;
            var imageData = getImageData();
            var data = imageData.data;
            var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

            for(var i=0; i<data.length; i+=4) {
                data[i] = (factor * ((data[i] - 128) + 128));
                data[i+1] = (factor * ((data[i+1] - 128) + 128));
                data[i+2] = (factor * ((data[i+2] - 128) + 128));
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Change brighness.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.brightness = function(options, callback) {
            var brightnessVal = options.brightness || 100;
            var imageData = getImageData();
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                data[i] = truncate(data[i] + brightnessVal);
                data[i + 1] = truncate(data[i + 1] + brightnessVal);
                data[i + 2] = truncate(data[i + 2] + brightnessVal);
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Convert to greyscale.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.greyscale = function(options, callback){
            var imageData = getImageData();
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                var meanVal = +((data[i] + data[i + 1] + data[i + 2]) / 3);
                data[i] = meanVal;
                data[i + 1] = meanVal;
                data[i + 2] = meanVal;
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Tint.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.tint = function(options, callback) {
            var red = options.red || 0;
            var green = options.green || 0;
            var blue = options.blue || 0;
            var imageData = getImageData();
            var data = imageData.data;

            for (var i = 0; i < data.length; i += 4) {
                data[i] = truncate(data[i] + red);
                data[i + 1] = truncate(data[i + 1] + green);
                data[i + 2] = truncate(data[i + 2] + blue);
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Tint.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.saturation = function(options, callback) {
            var saturationVal = options.saturation || 5;
            var imageData = getImageData();
            var data = imageData.data;

            for (var i = 0; i < data.length; i+=4) {
                var meanVal = +((data[i] + data[i + 1] + data[i + 2]) / 3);
                data[i] = data[i] + ((data[i] - meanVal) * saturationVal);
                data[i + 1] = data[i + 1] + ((data[i + 1] - meanVal) * saturationVal);
                data[i + 2] = data[i + 2] + ((data[i + 2] - meanVal) * saturationVal);
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Colour banding
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.colourBanding = function(options, callback) {
            var amount = options.amount || 0;
            var bandCount = options.bandCount || 1;
            var linGrad = ctx.createLinearGradient(0, 0, width, 0);
            var bandInterval = 1 / bandCount;

            for (var i = 0; i < bandCount; i++) {
                linGrad.addColorStop(bandInterval * i, 'rgba(255, 0, 0, ' + amount + ')');
                linGrad.addColorStop(bandInterval * (i + 0.5), 'rgba(0, 255, 0, ' + amount + ')');
                linGrad.addColorStop(bandInterval * (i + 1), 'rgba(0, 0, 255, ' + amount + ')');
            }
            ctx.fillStyle = linGrad;
            ctx.fillRect(0, 0, width, height);
            callback();
        };


        /**
         * Noise.
         * @param  {options}   options
         * @param  {function} callback
         */
        filters.noise = function(options, callback) {
            var imageData   = getImageData();
            var data        = imageData.data;
            var noiseAmount = options.amount || 10;
            var isColour    = options.colour || false;
            var randColour;

            for (var i = 0; i < data.length; i += 4) {
                var multiplier = (Math.random() > 0.5) ? -1 : 1;
                if (isColour) {
                    randColour = Math.round((Math.random() * 2));
                    data[i] = truncate( (randColour === 0) ? (data[i] + noiseAmount ) : (data[i] - noiseAmount ) );
                    data[i + 1] = truncate( (randColour === 1) ? (data[i + 1] + noiseAmount ) :(data[i+1] - noiseAmount ) );
                    data[i + 2] = truncate( (randColour === 2) ? (data[i + 2] + noiseAmount ) : (data[i+2] - noiseAmount ) );
                } else {
                    data[i] = truncate( data[i] + noiseAmount * multiplier );
                    data[i + 1] = truncate( data[i + 1] + noiseAmount * multiplier );
                    data[i + 2] = truncate( data[i + 2] + noiseAmount * multiplier );
                }
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };

        /**
         * Downsample.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.downsample = function(options, callback) {
            var factor = options.amount || 2;
            var xScale = width / factor;
            var yScale = height / factor;

            ctx.drawImage(canvas, 0, 0, width, height, 0, 0, xScale, yScale);
            ctx.drawImage(canvas, 0, 0, xScale, yScale, 0, 0, width, height);
            callback();
        };


        /**
         * LED and CRT monitor pixel and lines.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.leds = function(options, callback) {
            var img         = (options.type) ? ledImages[options.type] : ledImages[0];
            var ledWidth    = img.width * (options.scale || 1);
            var ledHeight   = img.height * (options.scale || 1);
            var ledColCount = Math.ceil(width / ledWidth);
            var ledRowCount = Math.ceil(height / ledHeight);

            ctx.globalCompositeOperation = options.composite || 'multiply';
            ctx.globalAlpha = options.opacity || 0.8;

            for (var row = -1; row < ledRowCount; row++) {
                for (var col = 0; col < ledColCount; col++) {
                    ctx.drawImage(
                        img, ledWidth * col, ledHeight * row, ledWidth, ledHeight
                    );
                }
            }

            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = 'source-over';
            callback();
        };


        /**
         * Horizontal line.
         * @param  {options}   options
         * @param  {function}  callback
         */
        filters.brightnessLines = function(options, callback) {
            var barAlpha  = options.alpha || 0;
            var barYPos   = options.yPos || 0;
            var barHeight = options.height || 0;
            var barColour = options.colour || 0;

            ctx.globalCompositeOperation = 'overlay';

            var rgba = 'rgba('+barColour+','+barColour+','+barColour+',';
            var linGrad = ctx.createLinearGradient(width/2, barYPos, width/2, barYPos + barHeight);
            linGrad.addColorStop(0, rgba+'0)');
            linGrad.addColorStop(0.07, rgba + barAlpha + ')');
            linGrad.addColorStop(0.93, rgba + barAlpha + ')');
            linGrad.addColorStop(1, rgba+'0)');

            ctx.fillStyle = linGrad;
            ctx.fillRect(0, barYPos, width, barYPos + barHeight);
            ctx.globalCompositeOperation = 'source-over';
            callback();
        };


        /**
         * Horizontal stutter.
         * @param  {object} imgData
         * @param  {function} callback
         */
        filters.stutter = function(options, callback) {
            var stutterAmount = options.amount || 10;
            var imageData     = getImageData();
            var data          = imageData.data;

            for (var i = 0; i < height; i++) {
                var colourShift = Math.round(stutterAmount * Math.random());
                for (var k = 0; k < width; k++) {
                    var index = ((i * width) + k) * 4;
                    data[index] = data[index + 4 * colourShift];
                    data[index + 1] = data[index + 1 + 4 * colourShift];
                    data[index + 2] = data[index + 2 + 4 * colourShift];
                }
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Text.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.text = function(options, callback) {
            var xPos       = options['x-offset'] || 10;
            var yPos       = options['y-offset'] || 10;
            var fontSize   = options.size || 10;
            var textMsg    = options.msg || 'Hello';
            var textColour = options.colour || 'rgba(0, 200, 0, 0.8)';

            ctx.font = 'bold ' + fontSize + 'px Arial';
            ctx.fillStyle = textColour;
            ctx.fillText(textMsg, xPos, yPos);
            callback();
        };


        /**
         * Shift RGB.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.rgbShift = function(options, callback) {
            var imageData = getImageData();
            var data      = imageData.data;
            var red       = Math.round(options.red) || 0;
            var green     = Math.round(options.green) || 0;
            var blue      = Math.round(options.blue) || 0;

            for (var i = 0; i < data.length; i += 4) {
                data[i] = data[i + 4 * red * 4];
                data[i + 1] = data[i + 1 + (4 * green)];
                data[i + 2] = data[i + 2 + (4 * blue)];
            }

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Bender.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.bend = function(options, callback) {
            var imageData = getImageData();
            var data      = imageData.data;
            var frequency = (height/ Math.PI) / (options.frequency || 1);
            var amp       = options.amount || 0;
            var xOffset   = Math.round(options.x) * 4 || 0;
            var yOffset   = options.y || 0;

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

            ctx.putImageData(imageData, 0, 0);
            callback();
        };


        /**
         * Border around the canvas.
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.border = function(options, callback) {
            var borderWidth = options.thickness || 0;
            var colour      = options.colour || '#000';

            ctx.strokeStyle = colour || 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth   = borderWidth + 3;
            ctx.beginPath();
            ctx.strokeRect(0, 0, width, height);
            ctx.closePath();

            ctx.strokeStyle = colour || 'rgb(0, 0, 0)';
            ctx.lineWidth   = borderWidth;
            ctx.beginPath();
            ctx.strokeRect(0, 0, width, height);
            ctx.closePath();

            callback();
        };


        /**
         * Pixel sorting.
         * Original code: https://github.com/julescarbon/sortpixels.js
         *
         * @param  {object}   options
         * @param  {function} callback
         */
        filters.pixelSort = function(options, callback) {
            var mode = options.mode || 0;
            var horizontal = options.horizontal || false;
            var vertical = options.vertical || false;
            var level = options.amount || 0;

            var blackValue = parseInt(-10000000 * level, 10);

            // equivalent to rgb(164, 114, 128)
            var whiteValue = parseInt(-6000000 * level, 10);

            //  var blackValue = (255 << 24) + (32<< 16) + (32 << 8) + 32;
            var brightnessValue = parseInt(30 * level, 10);

            var canvasData = getImageData();
            var imageData  = canvasData.data;

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
                callback();
        };


        function applyFilters(filterCollection, finalCallback, progressCallback) {
            drawImage();
            var filterCount = filterCollection.length;
            var singlePercent = filterCount * 0.01;

            function loopFilters() {
                if (progressCallback) {
                    progressCallback(100 - filterCollection.length / singlePercent);
                }

                if (filterCollection.length === 0)
                    return finalCallback();

                var filterOpt = filterCollection.shift();
                filterOpt.options = filterOpt.options || {};

                if (filterOpt.name in filters) {
                    filters[filterOpt.name](filterOpt.options, loopFilters);
                } else {
                    loopFilters();
                }
            }

            loopFilters();
        }

        function setImage(img) {
            startImg = img || startImg;
        }

        return {
            applyFilters: applyFilters,
            setImage: setImage
        };
    };
}());


