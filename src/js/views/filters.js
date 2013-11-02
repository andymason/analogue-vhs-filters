var app = app || {};

var FilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  id: 'activeFilters',
  collection: app.FilterCollection,

  initialize: function() {
    this.collection.on('add', this.addFilterViewItem, this);
    this.collection.on('remove', this.render, this);
    this.collection.on('change', this.updateOutput, this);
    this._filterViews = [];
  },

  addFilterViewItem: function(model) {
    this._filterViews.push(new app.FilterItemView({ model: model}));
    this.render();
  },

  updateOutput: function() {
    analogue.drawImage();
    this.collection.each(function(model) {
      model.triggerOutput();
    });
  },

  render: function() {
    this.$el.empty();

    this.collection.each(function(model) {
      var item = new  app.FilterItemView({ model: model});
      this.$el.append(item.render().$el);
    }, this);

    this.updateOutput();

    return this;
  }
});

app.FilterCollectionView = new FilterCollectionView();
