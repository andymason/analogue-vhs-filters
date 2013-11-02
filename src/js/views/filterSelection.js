var app = app || {};

app.FilterSelection = Backbone.View.extend({
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
