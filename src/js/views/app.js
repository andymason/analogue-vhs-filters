var app = app || {};

var img = document.querySelector('#source_image');
var canvas = document.querySelector('#output');
var analogue = new Analogue(canvas, img);
analogue.drawImage();

app.AppView = Backbone.View.extend({

  el: '#editor',

  initialize: function() {
    this.$dropdown = this.$('#filter_selection_dropdown');
    this.$activeFilters = this.$('#active_filters');

    app.filterData.each(this.addSelectOptions, this);

    this.render();
  },

  events: {
    'click #filter_selection_add' : 'addFilter'
  },

  addSelectOptions: function(filter) {
    this.$dropdown.append(
      $('<option>').text(filter.get('name')).attr('value', filter.get('name'))
    );
  },

  addFilter: function() {
    var filterModel = app.filterData.findWhere( { name: this.$dropdown.val() });
    var model = filterModel.clone();
    app.FilterCollection.add( model );

    var view = new app.FilterItemView({ model: model });
    this.$activeFilters.append(view.render().el);

  },

  render: function() {

  }

});
