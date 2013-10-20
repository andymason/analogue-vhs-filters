var EDITOR = EDITOR || {
  filterList: [
    {'name': 'scanlines', 'options': { 'thickness': 'int', 'spacing': 'int' }},
    {'name': 'ghosting', 'options': { 'thickness': 'int', 'spacing': 'int' }},
    {'name': 'saturation', 'options': { 'value': 'int' }}
  ]
};

EDITOR.filterModel = Backbone.Model.extend({
  defaults: {
    enabled: true
  }
});

EDITOR.filterCollection = new Backbone.Collection({
  model: EDITOR.filterModel
});

EDITOR.activeFilterCollection = new Backbone.Collection();


EDITOR.filterCollection.add(EDITOR.filterList);
console.log(EDITOR);


EDITOR.filterDropDownListView = Backbone.View.extend({
  tagName: 'select',

  events: {
    'change': 'addFilter'
  },

  addFilter: function() {
    console.log(this.$el.val());
  },

  render: function() {
    console.log(this.collection);
    this.collection.each(function(filter) {
      console.log(filter);
      this.$el.append(
        $('<option>').text(filter.get('name')).attr('value', filter.get('name'))
      );
    }.bind(this));
    return this;
  }

});

var drop = new EDITOR.filterDropDownListView({
  collection: EDITOR.filterCollection
});

$('body').append(drop.render().$el);