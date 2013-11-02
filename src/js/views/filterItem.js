var app = app || {};

app.FilterItemView = Backbone.View.extend({

  tagName: 'div',
  className: 'filter',

  events: {
    'click .remove': 'destroy',
    'click .update': 'update',
    'change input': 'update'
  },

  destroy: function() {
    EDITOR.activeFilterCollection.remove(this.model);
    this.remove();
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
    this.template = _.template($('#template_input').html());
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    console.log(this.el);
    return this;
  }
});
