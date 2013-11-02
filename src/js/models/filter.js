var app = app || {};

// Filter model

app.Filter = Backbone.DeepModel.extend({

  triggerOutput: function() {
    var paramArray = [];
    _.each(this.get('options'), function(option, key) {
      paramArray.push( (isNaN(option.value)) ? option.value : parseFloat(option.value) );
    });

    analogue[this.get('name')].apply(this, paramArray)
    //console.log( this.get('name'), paramArray);
  }

});