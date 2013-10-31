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


var EDITOR = EDITOR || {
  filterList: [
    {
      'name': 'scanlines',
      'options': {
        'thickness' : {
          'name': ' thickness',
          'type':'text',
          'value': 0
        },
        'colour' : {
          'name': ' color',
          'type':'color',
          'value': '#004400'
        }
      }
    },
    {
      'name': 'Brightness',
      'options': {
        'intensity' : {
          'name': 'intensity MOFO',
          'type':'text',
          'value': 0
        }
      }
    }
  ]
};


EDITOR.activeFilterCollection = new Backbone.Collection();

EDITOR.filterDropDownListView = Backbone.View.extend({
  tagName: 'select',

  events: {
    'change': 'addFilter'
  },

  addFilter: function() {
    var filterName = this.$el.val();
    var filter = _.find(EDITOR.filterList, function(filter) {
      return filter.name === filterName;
    }.bind(this));

    var model = new Backbone.DeepModel(filter);
    model.bind('*', function() { console.log(this); });

    EDITOR.activeFilterCollection.add( model );
  },

  render: function() {
    EDITOR.filterList.forEach(function(filter) {
      this.$el.append(
        $('<option>').text(filter.name).attr('value', filter.name)
      );
    }.bind(this));
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
    //this.collection.on('remove', this.render, this);
    this._filterViews = [];
  },

  addFilterViewItem: function(model) {
    this._filterViews.push(new inputView({ model: model}));
    this.render();
  },

  render: function() {
    this.$el.empty();

//    this._filterViews.forEach(function(filter) {
//      this.$el.append(inputView({ model: model}).render().$el);
//    }, this);

    this.collection.each(function(model) {
      var item = new inputView({ model: model})
      this.$el.append(item.render().$el);
    }, this);

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
    this.remove()
    EDITOR.activeFilterCollection.remove(this.model);
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
    this.template = _.template('<p><%= name %></p>     <% _.each(options, function(option, key) { %>  <label> <%= option.name %> <input value="<%= option.value %>" type="<%= option.type %>" name="<%= key %>"> </label>    <% }); %>    <button class="remove">Remove</button> <button class="update">Update</button>');
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


