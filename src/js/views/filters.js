var app = app || {};

var FilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  id: 'activeFilters',
  collection: app.FilterCollection,

  initialize: function() {
    this.collection.on('add', this.addFilterViewItem, this);
    this.collection.on('remove', this.updateOutput, this);
    this.collection.on('change', this.updateOutput, this);
    this.collection.on('reset', this.empty, this);
  },

  addFilterViewItem: function(model, collection, options) {
//    var view = new app.FilterItemView({ model: model});
//    this.$el.append(view.render().$el);
    this.$el.empty();
    this.collection.each(function(modelmmm) {
      var view = new app.FilterItemView({ model: modelmmm});
      this.$el.append(view.render().$el);
    }, this);

    if (options && options.preventViewUpdate) {
      return;
    } else {
        this.updateOutput();
      //this.render();
    }
  },

  updateOutput: function(m, options) {
    analogue.drawImage();
    console.log('update output');
    this.collection.each(function(model) {
      model.triggerOutput();
    });
  },

  empty: function() {
    this.$el.empty();
    this.render();
  },

  render: function() {
    return this;
  }
});

app.FilterCollectionView = new FilterCollectionView();
