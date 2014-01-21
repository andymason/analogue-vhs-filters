var app = app || {};

app.exampleCombinations = {
  'analogue_tv' : {
    'title': 'Analogue TV',
    'filters': [
      { 'name': 'text', 'options': { 'msg': 'UHF 1', 'x-offset': 50, 'y-offset': 60, 'size':  40, 'colour': '#00FF00'} },
      { 'name': 'border', 'options': { 'thickness': 10 } },
      { 'name': 'noise', 'options': { 'amount': 7, 'colour': false } },
      { 'name': 'noise', 'options': { 'amount': 5, 'colour': true } },
      { 'name': 'stutter', 'options': { 'stutter': 0.1 } },
      { 'name': 'rgbShift', 'options': { 'distance': 0.13, 'interlaced': true } },
      { 'name': 'ghost', 'options': { 'x-offset': 42, 'y-offset': 0, 'alpha':  0.2, 'negative': false } },
      { 'name': 'ghost', 'options': { 'x-offset': 44, 'y-offset': 0, 'alpha':  0.3, 'negative': true } },
      { 'name': 'vignette', 'options': { 'alpha': 0.2, 'size': 0.1 } },
      { 'name': 'brightness', 'options': { 'brightness': -50 } },
      { 'name': 'contrast', 'options': { 'contrast': 40 } },
      { 'name': 'colourBanding', 'options': { 'amount': 0.03 , 'bandCount': 30 } },
      { 'name': 'upScale', 'options': { 'upScale': 2.5 } },
      { 'name': 'bend', 'options': { 'bend_amount': 10, 'frequency': 1, 'x-offset':  0, 'y-offset': 50 } },
      { 'name': 'tint', 'options': { 'red': -20, 'green':  -5, 'blue': 10 } },
      { 'name': 'scanlines', 'options': { 'brightness': 10, 'lineSpacing': 3 } },
      { 'name': 'brightnessLines', 'options': { 'alpha': 0.2, 'yPos': 50, 'height': 120 } }
    ]
  },

  '3d_blues': {
  "title": "3D blues",
  "filters": [
    {
      "name": "pixelSort",
      "options": {
        "mode": 1,
        "amount": 1.9,
        "horizontal": true,
        "vertical": false
      }
    },
    {
      "name": "noise",
      "options": {
        "amount": 10,
        "colour": false
      }
    },
    {
      "name": "rgbShift",
      "options": {
        "distance": 2,
        "interlaced": false
      }
    },
    {
      "name": "saturation",
      "options": {
        "saturation": -2.45
      }
    },
    {
      "name": "tint",
      "options": {
        "red": 0,
        "green": 0,
        "blue": 106
      }
    },
    {
      "name": "ghost",
      "options": {
        "x-offset": 20,
        "y-offset": 0,
        "alpha": 0.15,
        "negative": true
      }
    },
    {
      "name": "colourBanding",
      "options": {
        "amount": 0.06,
        "bandCount": 6
      }
    },
    {
      "name": "vignette",
      "options": {
        "alpha": 0.5,
        "size": 0.21
      }
    },
    {
      "name": "leds",
      "options": {
        "type": 0,
        "scale": 1,
        "composite": "multiply",
        "opacity": 0.68
      }
    }
  ]
},

  'red_shift' : {
    "title": "Red shift",
    "filters": [
      {
        "name": "pixelSort",
        "options": {
          "mode": 0,
          "amount": 0.9,
          "horizontal": true,
          "vertical": false
        }
      },
      {
        "name": "saturation",
        "options": {
          "saturation": 5.5
        }
      },
      {
        "name": "ghost",
        "options": {
          "x-offset": 20,
          "y-offset": 0,
          "alpha": 0.3,
          "negative": true
        }
      },
      {
        "name": "rgbShift",
        "options": {
          "distance": 0.2,
          "interlaced": true
        }
      },
      {
        "name": "noise",
        "options": {
          "amount": 33,
          "colour": true
        }
      },
      {
        "name": "upScale",
        "options": {
          "upScale": 2.5
        }
      },
      {
        "name": "border",
        "options": {
          "thickness": 4,
          "colour": "#000000"
        }
      },
      {
        "name": "brightnessLines",
        "options": {
          "alpha": 0.28,
          "yPos": 419,
          "height": 259
        }
      },
      {
        "name": "scanlines",
        "options": {
          "brightness": 15,
          "lineSpacing": 3
        }
      },
      {
        "name": "tint",
        "options": {
          "red": -28,
          "green": -145,
          "blue": 40
        }
      }
    ]
  }

};
