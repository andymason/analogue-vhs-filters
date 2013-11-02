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
        'max': 50,
        'min': 1,
        'step': 1
      }
    ]
  },

  {
    'name': 'brightness',
    'options': [
      {
        'name': 'brightness',
        'type':'range',
        'value': 0,
        'min': -255,
        'max': 255,
        'step': 1
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
