var app = app || {};

app.exampleCombinations = {
  'analogue_tv' : {
    'title': 'Analogue TV',
    'filters': {
      'scanlines':  { 'brightness': -100, 'lineSpacing': 30 },
      'brightness': { 'brightness': -100 }
    }
  },

  'busted_monitor' : {
    'title': 'Busted Monitor',
    'filters': {
      'upScale':  { 'upScale': 2 },
      'contrast': { 'contrast': -100 }
    }
  }

};
