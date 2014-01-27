var app = app || {};

var ExportView = Backbone.View.extend({
  collection: app.FilterCollection,
  el: '#settings_output_container',
  events: {
    'click .close': 'hide',
    'click .import': 'import'
  },

  initialize: function(options) {
    this.$textEl = this.$('textarea');
  },

  hide: function() {
    this.$el.hide();
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
  },

  import: function() {
    var settings = JSON.parse(this.$textEl.val());
    if (!settings.filters || settings.filters.length === 0)
        return;

    app.FilterCollection.reset();

    _.each(settings.filters, function(filter) {
      this.insertFilter(filter.name, filter.options, true);
    }, this);

    app.FilterCollectionView.updateOutput();
  },

  render: function() {
    var settings = {
      'title' : 'Exported settings',
      'filters': this.collection.getFilters()
    };
    this.$textEl.val(JSON.stringify(settings, null, '  '));
    this.$el.show();
    return this;
  }
});

app.exportView = new ExportView();