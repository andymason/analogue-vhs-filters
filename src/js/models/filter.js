var app = app || {};

// Filter model
app.Filter = Backbone.DeepModel.extend({

  triggerOutput: function(target) {
    var options = [];
    var modelOptions = this.get('options');
    if (typeof modelOptions !== 'undefined') {
      options = modelOptions.map(function(option) { return option.value; });
    }
    target[this.get('name')].apply(this, options);
  },

  moveUp: function() {
    this.collection.moveUp(this);
  },

  moveDown: function() {
    this.collection.moveDown(this);
  }

});