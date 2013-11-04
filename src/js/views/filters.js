var app = app || {};

var FilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  id: 'activeFilters',
  collection: app.FilterCollection,

  initialize: function() {
    this.collection.on('add', this.addFilterViewItem, this);
    this.collection.on('remove', this.render, this);
    this.collection.on('change', this.updateOutput, this);
    this.collection.on('reset', this.empty, this);
  },

  addFilterViewItem: function(model) {
    var view = new app.FilterItemView({ model: model});
    this.$el.append(view.render().$el);
    this.render(); 
  },

  updateOutput: function() {
    analogue.drawImage();
    this.collection.each(function(model) {
      model.triggerOutput();
    });
  },

  empty: function() {
    this.$el.empty();
    this.render();
  },

  render: function() {
    this.updateOutput();
    return this;
  }
});

app.FilterCollectionView = new FilterCollectionView();
