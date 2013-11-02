var app = app || {};

app.filterData = new Backbone.Collection([
  {
    'name': 'scanlines',
    'options': {
      'thickness' : {
        'name': 'thickness',
        'type':'range',
        'value': 0,
        'min': -255,
        'max': 255,
        'step': 1
      },
      'brightness' : {
        'name': 'brightness',
        'type':'range',
        'value': 0,
        'min': 0,
        'step': 1
      }
    }
  },
  {
    'name': 'brightness',
    'options': {
      'intensity' : {
        'name': 'intensity',
        'type':'range',
        'value': 0,
        'min': -255,
        'max': 255,
        'step': 1
      }
    }
  }
], { model: Backbone.DeepModel.extend() });
