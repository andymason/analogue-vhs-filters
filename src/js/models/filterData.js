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
    'name': 'upScale',
    'options': [
      {
        'name': 'upScale',
        'type':'range',
        'value': 2,
        'min': 1,
        'max': 50,
        'step': 1
      }
    ]
  },

  {
    'name': 'stutter',
    'options': [
      {
        'name': 'stutter',
        'type':'range',
        'value': 2,
        'min': 0,
        'max': 50,
        'step': 1
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
        'step': 0.1
      },
      {
        'name': 'negative',
        'type':'checkbox',
        'checked': 'checked',
        'value': true
      }
    ]
  },

  {
    'name': 'leds',
    'options': [
      {
        'name': 'ledWidth',
        'type':'range',
        'value': 3,
        'min': 1,
        'max': 40,
        'step': 1
      },
      {
        'name': 'borderWidth',
        'type':'range',
        'value': 1.3,
        'max': 10,
        'step': 0.1
      },
      {
        'name': 'opacity',
        'type':'range',
        'value': 0.4,
        'min': 0,
        'max': 1,
        'step': 0.01
      },
      {
        'name': 'fuzzyLines',
        'type':'checkbox',
        'value': false
      },
      {
        'name': 'rgbCells',
        'type':'checkbox',
        'value': false
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
        'name': 'distance',
        'type':'range',
        'value': 2,
        'min': 0,
        'max': 10,
        'step': 1
      },
      {
        'name': 'interlaced',
        'type':'checkbox',
        'value': false
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
        'name': 'bend_amount',
        'type':'range',
        'value': 10,
        'max': 3000,
        'step': 1
      },
      {
        'name': 'frequency',
        'type':'range',
        'value': 0,
        'max': 100,
        'step': 1
      },
      {
        'name': 'x-offset',
        'type':'range',
        'value': 0,
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
      }
    ]
  }
]);
