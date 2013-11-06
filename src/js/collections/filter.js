var app = app || {};

app.filterCollection = Backbone.Collection.extend({

  moveUp: function(model) {
    var index = this.indexOf(model);
    if (index > 0) {
      this.remove(model, {silent: true}); // silence this to stop excess event triggers
      this.add(model, {at: index-1});
    }
  },

  moveDown: function(model) { // I see move up as the -1
    var index = this.indexOf(model);
    if (index < this.models.length) {
      this.remove(model, {silent: true}); // silence this to stop excess event triggers
      this.add(model, {at: index+1});
    }
  }

});

app.FilterCollection = new app.filterCollection();

