var app = app || {};

var img = document.querySelector('#source_image');
var canvas = document.querySelector('#output');
var analogue = new Analogue(canvas, img);
analogue.drawImage();

app.AppView = Backbone.View.extend({

  el: '#editor',

  initialize: function() {
    this.$dropdown = this.$('#filter_selection_dropdown');
    this.$exampleDropdown= this.$('#filter_examples');
    this.$activeFilters = this.$('#active_filters');

    app.filterData.each(this.addSelectOptions, this);
    _.each(app.exampleCombinations, this.addExampleOption, this);

    this.render();
  },

  events: {
    'click #filter_selection_add' : 'addFilter',
    'click #filter_example_load'  : 'addExample'
  },

  addExampleOption: function(example, exampleID) {
    this.$exampleDropdown.append(
      $('<option>').text(example.title).attr('value', exampleID)
    );
  },

  addSelectOptions: function(filter) {
    this.$dropdown.append(
      $('<option>').text(filter.get('name')).attr('value', filter.get('name'))
    );
  },

  addFilter: function() {
    this.insertFilter(this.$dropdown.val(), null);
  },

  addExample: function() {
    var exampleID = this.$exampleDropdown.val();
    var example = _.find(app.exampleCombinations, function(example, key) {
      return key === exampleID;
    });

    if (example) {
      app.FilterCollection.reset();
      _.each(example.filters, function(filerOptions, filterName) {
        this.insertFilter(filterName, filerOptions);
      }, this);
    }

  },

  insertFilter: function(filterName, options) {
    var filterModel = app.filterData.findWhere( { name: filterName });
    var model = filterModel.clone();

    if (options) {
      _.each(options, function(value, optionName) {

        var optionIndex = model.get('options').map(function(e) {
          return e.name;
        }).indexOf(optionName);

        var op = {};
        var optionPath = 'options.' + optionIndex + '.' + '.value';
        op[optionPath] = value;
        model.set(op[optionPath]);

      });
    }

    app.FilterCollection.add( model );

//    var view = new app.FilterItemView({ model: model });
//    this.$activeFilters.append(view.render().el);
  },

  render: function() {
    this.$activeFilters.append(app.FilterCollectionView.render().$el);
  }

});
