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




EDITOR.filterCollection.add(EDITOR.filterList);
console.log(EDITOR);


EDITOR.activeFilterCollection = new Backbone.Collection();

EDITOR.filterDropDownListView = Backbone.View.extend({
  tagName: 'select',

  events: {
    'change': 'addFilter'
  },

  addFilter: function() {
    var filterName = this.$el.val();
    var filter = _.find(EDITOR.filterList, function(filter) {
      return filter.name === filterName;
    }.bind(this));
    EDITOR.activeFilterCollection.add(filter)
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


var filterView = Backbone.View.extend({
  render: function() {
    this.$el.append($('<h1></h1>').text( this.model.get('name') ));
    return this;
  }
});

var activeFilterCollection = new Backbone.Collection();
var activeFilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  collection: EDITOR.activeFilterCollection,

  initialize: function() {
    this._filterViews = [];
    console.log('sddsfdsf', this.collection);
    this.collection.on('add', this.addFilterViewItem)

  },

  addFilterViewItem: function(model) {
    console.log(model, this, arguments);
  },

  render: function() {
    return this;
  }
});

var fcv = new activeFilterCollectionView();

var drop = new EDITOR.filterDropDownListView({
  collection: EDITOR.filterCollection
});

$('body').append(drop.render().$el);