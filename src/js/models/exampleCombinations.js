var app = app || {};

app.exampleCombinations = {
  'analogue_tv' : {
    'title': 'Analogue TV',
    'filters': [
      { 'name': 'text', 'options': { 'msg': 'UHF 1', 'x-offset': 50, 'y-offset': 60, 'size':  40, 'colour': 'rgba(10, 210, 10, 0.8)'} },
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
  }

};
