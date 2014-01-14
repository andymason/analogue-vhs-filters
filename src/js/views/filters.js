var app = app || {};

var FilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  id: 'activeFilters',
  collection: app.FilterCollection,

  initialize: function() {
    this.collection.on('add', this.addFilterViewItem, this);
    this.collection.on('remove', this.updateOutput, this);
    this.collection.on('change', this.updateOutput, this);
    this.collection.on('render', this.renderOutput, this);
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
      model.triggerOutput(analogue);
    });
  },

  renderOutput: function(m, options) {
    var tmpCanvas = document.createElement('canvas');
    tmpCanvas.width = 1000;
    tmpCanvas.height = 1000;
    var tmpDraw = new Analogue(tmpCanvas, img);
    tmpDraw.drawImage();
    console.log('update output');
    this.collection.each(function(model) {
      model.triggerOutput(tmpDraw);
    });

    //var tmpImg = document.createElement('img');
    var clientId = 'cd5ead822feb886';
    var dataURL = tmpCanvas.toDataURL('image/jpg');
    dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, '');

    $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'post',
        headers: {
            'Authorization': 'Client-ID ' + clientId
        },
        data: {
            type: 'base64',
            name: 'glitch-name',
            title: 'glitch-title',
            description: 'Glitch description goes here',
            image: dataURL
        },
        dataType: 'json',
        success: function(response) {
            if(response.success) {
                console.log(response);
            }
        }
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
