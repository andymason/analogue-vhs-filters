var app = app || {};

var img = document.querySelector('#sourceImage');
var canvas = document.querySelector('#output');
//var analogue = new Analogue(canvas, img);
//analogue.drawImage();


var glitchFX = new GlitchFX(canvas, img);


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
    'click #filter_example_load'  : 'addExample',
    'click #filter_clear'         : 'clearFilters',
    'click #render'               : 'renderFilters',
    'click #export_settings'      : 'exportSettings'
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

      _.each(example.filters, function(filter) {
        this.insertFilter(filter.name, filter.options, true);
      }, this);

      app.FilterCollectionView.updateOutput();
    }

  },

  clearFilters: function() {
    app.FilterCollection.reset();
    app.FilterCollectionView.updateOutput();
  },

  exportSettings: function() {
    app.exportView.render();
  },

  insertFilter: function(filterName, options, preventViewUpdate) {
    var filterModel = app.filterData.findWhere( { name: filterName });
    var model = new app.Filter( filterModel.toJSON() );

    if (options) {
      _.each(options, function(value, optionName) {

        var optionIndex = model.get('options').map(function(e) {
          return e.name;
        }).indexOf(optionName);

        var op = {};
        var optionPath = 'options.' + optionIndex +  '.value';
        op[optionPath] = value;
        model.set(op);
      });
    }

    app.FilterCollection.add( model, { preventViewUpdate: preventViewUpdate } );

//    var view = new app.FilterItemView({ model: model });
//    this.$activeFilters.append(view.render().el);
  },

  renderFilters: function() {
    app.FilterCollection.trigger('render');
  },

  render: function() {
    this.$activeFilters.append(app.FilterCollectionView.render().$el);

    $('#activeFilters').sortable({
        stop: function(event, ui) {
            ui.item.trigger('drop', ui.item.index());
        }
    });


  }

});
