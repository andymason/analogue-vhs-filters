var app = app || {};

app.FilterItemView = Backbone.View.extend({

  tagName: 'div',
  className: 'filter',

  events: {
    'click .remove': 'destroy',
    'change input': 'update'
  },


  initialize: function(options) {
    this.template = _.template($('#template_input').html());
    this.inputTemplate = _.template($('#template_input_field').html());
  },

  destroy: function() {
    app.FilterCollection.remove(this.model);
    this.remove();
  },

  update: function(event) {
    var $input = $(event.target);
    var optionIndex = this.model.get('options').map(function(e) {
        return e.name;
      }).indexOf($input.attr('name'));


    var op = {};
    var modelOption = 'options.' + optionIndex + '.value';

    var value;
    if ($input.attr('type') === 'checkbox') {
      value = !!$input.prop('checked');
    }

    if ($input.attr('type') === 'range') {
      value = parseFloat($input.val());
    }

    if ($input.attr('type') === 'color' || $input.attr('type') === 'text') {
      value = $input.val();
    }

    op[modelOption] = value;
    this.model.set(op);
  },

  addInput: function(option) {
    var $view = $(this.inputTemplate({ option: option }));
    this.$inputWrapper.append($view);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$inputWrapper = this.$('.inputs_wrapper');
    _.each(this.model.get('options'), this.addInput, this);

    return this;
  }

});
