/*

  PresetCombinations:
    eg:
      - Security camera = scanlines {10, 2}, tint {#333}, contrast {0.3}
      - VHS tape = scale {2}, saturation {1.2}

  Filter:
    - Human name
    - Bound to image.method
    - Options
    - Option types
    - Option values


  Filter combination:
   - Ordered array of filter models (collection)


 */

var img = document.querySelector('#source_image');
var canvas = document.querySelector('#output');
var analogue = new Analogue(canvas, img);
analogue.drawImage();
//analogue.scanlines();
//analogue.brightness(-50);
//analogue.text('UHF 1', 50, 60, 40, 'rgba(10, 210, 10, 0.8)');
//analogue.rgbShift(0.13, true);


var EDITOR = EDITOR || {
  filterList: [
    {
      'name': 'scanlines',
      'options': {
        'thickness' : {
          'name': 'thickness',
          'type':'number',
          'value': 0,
          'min': -255,
          'max': 255,
          'step': 1
        },
        'brightness' : {
          'name': 'brightness',
          'type':'number',
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
          'type':'number',
          'value': 0,
          'min': -255,
          'max': 255,
          'step': 1
        }
      }
    }
  ]
};


var FModel = Backbone.DeepModel.extend({

  triggerOutput: function() {
    var paramArray = [];
    _.each(this.get('options'), function(option, key) {
      paramArray.push( (isNaN(option.value)) ? option.value : parseFloat(option.value) );
    });

    analogue[this.get('name')].apply(this, paramArray)
    //console.log( this.get('name'), paramArray);
  }

});

EDITOR.activeFilterCollection = new Backbone.Collection();

EDITOR.filterDropDownListView = Backbone.View.extend({
  template: _.template($('#template_filter_select').html()),
  events: {
    'click .filter_selection_add': 'addFilter'
  },

  addFilter: function() {
    var filterName = this.$('.filter_selection_dropdown').val();
    var filter = _.find(EDITOR.filterList, function(filter) {
      return filter.name === filterName;
    }.bind(this));

    var model = new FModel(filter);
    EDITOR.activeFilterCollection.add( model );
  },

  render: function() {
    this.$el.html(this.template());

    EDITOR.filterList.forEach(function(filter) {
      this.$('.filter_selection_dropdown').append(
        $('<option>').text(filter.name).attr('value', filter.name)
      );
    }, this);

    return this;
  }
});


var filterView = Backbone.View.extend({
  render: function() {
    this.$el.append($('<h1></h1>').text( this.model.get('name') ));
    return this;
  }
});





var activeFilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  id: 'activeFilters',
  collection: EDITOR.activeFilterCollection,

  initialize: function() {
    this.collection.on('add', this.addFilterViewItem, this);
    this.collection.on('remove', this.render, this);
    this.collection.on('change', this.updateOutput, this);
    this._filterViews = [];
  },

  addFilterViewItem: function(model) {
    console.log('collection view: ADD');
    this._filterViews.push(new inputView({ model: model}));
    this.render();
  },

  updateOutput: function() {
    console.log('updated', arguments);
    analogue.drawImage();
    this.collection.each(function(model) {
      model.triggerOutput();
    });
  },

  render: function() {
    this.$el.empty();

    this.collection.each(function(model) {
      console.log(model);
      var item = new inputView({ model: model})
      this.$el.append(item.render().$el);
    }, this);

    this.updateOutput();

    return this;
  }
});



var inputView = Backbone.View.extend({
  tagName: 'div',
  className: 'filter',

  events: {
    'click .remove': 'destroy',
    'click .update': 'update',
    'change input': 'update'
  },

  destroy: function() {
    EDITOR.activeFilterCollection.remove(this.model);
    this.remove();
  },

  update: function() {
    _.each(this.$('input'), function(el) {
      var optionName = 'options.' + $(el).attr('name').trim() + '.value';
      var options = {};
      options[optionName] = $(el).val();
      this.model.set(options);
    }, this);
  },

  initialize: function(options) {
    this.template = _.template($('#template_input').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }

});



var activeFiltersList = new activeFilterCollectionView();
var dropDownMenu = new EDITOR.filterDropDownListView();

$('body').append(dropDownMenu.render().$el);
$('body').append(activeFiltersList.render().$el);


/*

 analogue.text('UHF 1', 50, 60, 40, 'rgba(10, 210, 10, 0.8)');
 analogue.border(10);
 analogue.saturation(0.1);
 analogue.noise(7, false);
 analogue.noise(5, true);

 analogue.stutter(0.1);

 analogue.rgbShift(0.13, true);
 analogue.ghost(42, 0, 0.2, false);
 */


