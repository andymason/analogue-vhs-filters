var app = app || {};

app.FilterItemView = Backbone.View.extend({

  tagName: 'div',
  className: 'filter',

  events: {
    'click': 'toggleView',
    'click .remove':    'destroy',
    'change .input':     'update',
    'click .move_up':   'moveUp',
    'click .move_down': 'moveDown',
    'drop': 'drop'
  },


  initialize: function(options) {
    this.template = _.template($('#template_input').html());
    this.inputTemplate = _.template($('#template_input_field').html());

    this.model.on('reset', this.destroy, this);
  },

  destroy: function() {
    console.log('model view destory');
    app.FilterCollection.remove(this.model);
    this.remove();
  },

  drop: function(event, index) {
    this.$el.trigger('update-sort', [this.model, index]);
  },

  moveUp: function() {
    this.model.moveUp();
  },

  moveDown: function() {
    this.model.moveDown();
  },

  toggleView: function() {
    $('.filter').toggleClass('closed', true);
    this.$el.toggleClass('closed', false);
  },

  update: _.debounce(function(event) {
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

    if ($input.attr('type') === 'select') {
      value = parseInt($input.val(), 10);
    }

    if ($input.attr('type') === 'color' || $input.attr('type') === 'text') {
      value = $input.val();
    }

    op[modelOption] = value;
    this.model.set(op);
    this.model.collection.trigger('update');
  }, 300),

  addInput: function(option) {
    var $view = $(this.inputTemplate({ option: option }));
    this.$inputWrapper.append($view);
    this.toggleView();
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$inputWrapper = this.$('.inputs_wrapper');
    this.$el.addClass('closed');
    _.each(this.model.get('options'), this.addInput, this);

    return this;
  }

});
