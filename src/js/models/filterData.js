var app = app || {};

var FilterData = Backbone.Collection.extend({
  model: app.Filter
});

app.filterData = new FilterData([
  {
    'name': 'scanlines',
    'options': [
      {
        'name': 'brightness',
        'type':'range',
        'value': 90,
        'min': -255,
        'max': 255,
        'step': 1
      },
      {
        'name': 'lineSpacing',
        'type':'range',
        'value': 3,
        'min': 1,
        'max': 50,
        'step': 1
      }
    ]
  },

  {
    'name': 'jpegCorrupt',
    'options': [
      {
        'name': 'amount',
        'type':'range',
        'value': 10,
        'min': 0,
        'max': 99,
        'step': 1
      },
      {
        'name': 'quality',
        'type':'range',
        'value': 70,
        'min': 0,
        'max': 99,
        'step': 1
      },
      {
        'name': 'iterations',
        'type':'range',
        'value': 10,
        'min': 0,
        'max': 99,
        'step': 1
      }
    ]
  },

  {
    'name': 'vignette',
    'options': [
      {
        'name': 'alpha',
        'type':'range',
        'value': 0.3,
        'min': 0,
        'max': 1,
        'step': 0.01
      },
      {
        'name': 'size',
        'type':'range',
        'value': 0.1,
        'min': 0,
        'max': 0.99,
        'step': 0.01
      }
    ]
  },

  {
    'name': 'text',
    'options': [
      {
        'name': 'msg',
        'type':'text',
        'value': 'UHF 1'
      },
      {
        'name': 'x-offset',
        'type':'range',
        'value': 30,
        'min': -1000,
        'max': 1000,
        'step': 1
      },
      {
        'name': 'y-offset',
        'type':'range',
        'value': 50,
        'min': -1000,
        'max': 1000,
        'step': 1
      },
      {
        'name': 'size',
        'type':'range',
        'value': 30,
        'min': 1,
        'max': 500,
        'step': 1
      },
      {
        'name': 'colour',
        'type':'color',
        'value': '#00FF00'
      }
    ]
  },



  {
    'name': 'brightness',
    'options': [
      {
        'name': 'brightness',
        'type':'range',
        'value': -30,
        'min': -255,
        'max': 255,
        'step': 1
      }
    ]
  },

  {
    'name': 'contrast',
    'options': [
      {
        'name': 'contrast',
        'type':'range',
        'value': 60,
        'min': -255,
        'max': 255,
        'step': 1
      }
    ]
  },

  {
    'name': 'downsample',
    'options': [
      {
        'name': 'amount',
        'type':'range',
        'value': 2,
        'min': 1,
        'max': 50,
        'step': 0.1
      }
    ]
  },

  {
    'name': 'stutter',
    'options': [
      {
        'name': 'amount',
        'type':'range',
        'value': 2,
        'min': 0,
        'max': 10,
        'step': 0.1
      }
    ]
  },

  {
    'name': 'brightnessLines',
    'options': [
      {
        'name': 'alpha',
        'type':'range',
        'value': 0.2,
        'min': 0,
        'max': 1,
        'step': 0.01
      },
      {
        'name': 'yPos',
        'type':'range',
        'value': 50,
        'min': 0,
        'max': 1000,
        'step': 1
      },
      {
        'name': 'height',
        'type':'range',
        'value': 120,
        'min': 1,
        'max': 1000,
        'step': 1
      }

    ]
  },

  {
    'name': 'tint',
    'options': [
      {
        'name': 'red',
        'type':'range',
        'value': 0,
        'min': -255,
        'max': 255,
        'step': 1
      },
      {
        'name': 'green',
        'type':'range',
        'value': 0,
        'min': -255,
        'max': 255,
        'step': 1
      },
      {
        'name': 'blue',
        'type':'range',
        'value': 40,
        'min': -255,
        'max': 255,
        'step': 1
      }

    ]
  },

  {
    'name': 'saturation',
    'options': [
      {
        'name': 'saturation',
        'type':'range',
        'value': 1,
        'min': -10,
        'max': 10,
        'step': 0.05
      }
    ]
  },

  {
    'name': 'greyscale'
  },

  {
    'name': 'pixelSort',
    'options': [
      {
        'name': 'mode',
        'type':'select',
        'options': [
          { 'name': 'Black', 'value': 0},
          { 'name': 'Bright', 'value': 1},
          { 'name': 'White', 'value': 2}
        ],
        'value': false
      },
      {
        'name': 'amount',
        'type':'range',
        'value': 1,
        'min': 0,
        'max': 3,
        'step': 0.1
      },
      {
        'name': 'horizontal',
        'type':'checkbox',
        'value': true
      },
      {
        'name': 'vertical',
        'type':'checkbox',
        'value': false
      }
    ]
  },

  {
    'name': 'ghost',
    'options': [
      {
        'name': 'x-offset',
        'type':'range',
        'value': 20,
        'min': -1000,
        'max': 1000,
        'step': 1
      },
      {
        'name': 'y-offset',
        'type':'range',
        'value': 0,
        'min': -1000,
        'max': 1000,
        'step': 1
      },
      {
        'name': 'alpha',
        'type':'range',
        'value': 0.3,
        'max': 1,
        'step': 0.01
      },
      {
        'name': 'composite',
        'type':'select',
        'options': [
          { 'name': 'multiply', 'value': 'multiply'},
          { 'name': 'screen', 'value': 'screen'},
          { 'name': 'overlay', 'value': 'overlay'},
          { 'name': 'darken', 'value': 'darken'},
          { 'name': 'lighten', 'value': 'lighten'},
          { 'name': 'color-dodge', 'value': 'color-dodge'},
          { 'name': 'color-burn', 'value': 'color-burn'},
          { 'name': 'hard-light', 'value': 'hard-light'},
          { 'name': 'soft-light', 'value': 'soft-light'},
          { 'name': 'difference', 'value': 'difference'},
          { 'name': 'exclusion', 'value': 'exclusion'},
          { 'name': 'hue', 'value': 'hue'},
          { 'name': 'saturation', 'value': 'saturation'},
          { 'name': 'color', 'value': 'color'},
          { 'name': 'luminosity', 'value': 'luminosity'},
          { 'name': 'normal', 'value': 'source-over'}
        ],
        'value': 'multiply'
      },
      {
        'name': 'negative',
        'type':'checkbox',
        'value': true
      }
    ]
  },

  {
    'name': 'leds',
    'options': [
      {
        'name': 'type',
        'type':'select',
        'options': [
          { 'name': 'image 1', 'value': 0},
          { 'name': 'image 2', 'value': 1},
          { 'name': 'image 3', 'value': 2},
          { 'name': 'image 3', 'value': 3}
        ],
        'value': 0
      },
      {
        'name': 'scale',
        'type':'range',
        'value': 1,
        'min': 1,
        'max': 10,
        'step': 1
      },

      {
        'name': 'composite',
        'type':'select',
        'options': [
          { 'name': 'multiply', 'value': 'multiply'},
          { 'name': 'screen', 'value': 'screen'},
          { 'name': 'overlay', 'value': 'overlay'},
          { 'name': 'darken', 'value': 'darken'},
          { 'name': 'lighten', 'value': 'lighten'},
          { 'name': 'color-dodge', 'value': 'color-dodge'},
          { 'name': 'color-burn', 'value': 'color-burn'},
          { 'name': 'hard-light', 'value': 'hard-light'},
          { 'name': 'soft-light', 'value': 'soft-light'},
          { 'name': 'difference', 'value': 'difference'},
          { 'name': 'exclusion', 'value': 'exclusion'},
          { 'name': 'hue', 'value': 'hue'},
          { 'name': 'saturation', 'value': 'saturation'},
          { 'name': 'color', 'value': 'color'},
          { 'name': 'luminosity', 'value': 'luminosity'},
          { 'name': 'normal', 'value': 'source-over'}
        ],
        'value': 'multiply'
      },
      {
        'name': 'opacity',
        'type':'range',
        'value': 0.8,
        'min': 0,
        'max': 1,
        'step': 0.01
      }
    ]
  },

  {
    'name': 'border',
    'options': [
      {
        'name': 'thickness',
        'type':'range',
        'value': 2,
        'min': 0,
        'max': 100,
        'step': 1
      },
      {
        'name': 'colour',
        'type':'color',
        'value': '#000000'
      }
    ]
  },

  {
    'name': 'rgbShift',
    'options': [
      {
        'name': 'red',
        'type':'range',
        'value': 5,
        'min': 0,
        'max': 100,
        'step': 1
      },
      {
        'name': 'green',
        'type':'range',
        'value': 5,
        'min': 0,
        'max': 100,
        'step': 1
      },
      {
        'name': 'blue',
        'type':'range',
        'value': 0,
        'min': 0,
        'max': 100,
        'step': 1
      }
    ]
  },

  {
    'name': 'noise',
    'options': [
      {
        'name': 'amount',
        'type':'range',
        'value': 20,
        'min': 0,
        'max': 255,
        'step': 1
      },
      {
        'name': 'colour',
        'type':'checkbox',
        'value': false
      }
    ]
  },

  {
    'name': 'colourBanding',
    'options': [
      {
        'name': 'amount',
        'type':'range',
        'value': 0.04,
        'min': 0,
        'max': 1,
        'step': 0.01
      },
      {
        'name': 'bandCount',
        'type':'range',
        'value': 6,
        'min': 1,
        'max': 20,
        'step': 1
      }
    ]
  },

  {
    'name': 'bend',
    'options': [
      {
        'name': 'amount',
        'type':'range',
        'value': 10,
        'max': 1000,
        'step': 0.1
      },
      {
        'name': 'frequency',
        'type':'range',
        'value': 0,
        'max': 20,
        'step': 1
      },
      {
        'name': 'x',
        'type':'range',
        'value': 0,
        'max': 1000,
        'step': 1
      },
      {
        'name': 'y',
        'type':'range',
        'value': 0,
        'min': -1000,
        'max': 1000,
        'step': 1
      }
    ]
  }
]);
