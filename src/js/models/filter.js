var app = app || {};

// Filter model
app.Filter = Backbone.DeepModel.extend({

  triggerOutput: function() {
    var options = [];
    var modelOptions = this.get('options');
    if (typeof modelOptions !== 'undefined') {
      options = modelOptions.map(function(option) { return option.value; });
    }

    analogue[this.get('name')].apply(this, options);
  }

});