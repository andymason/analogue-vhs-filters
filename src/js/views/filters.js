var app = app || {};

var FilterCollectionView = Backbone.View.extend({
  tagName: 'div',
  id: 'activeFilters',
  className: 'ui-sortable',
  collection: app.FilterCollection,

  events: {
    'update-sort': 'updateSort'
  },

  initialize: function() {
    this.collection.on('add', this.addFilterViewItem, this);
    this.collection.on('remove', this.updateOutput, this);
    this.collection.on('update', this.updateOutput, this);
    //this.collection.on('change', this.updateOutput, this);
    this.collection.on('render', this.renderOutput, this);
    this.collection.on('reset', this.empty, this);

    this.$progressWrapper = $('#progress_bar_wrapper');
    this.$progressBar = $('#progress_bar');
  },

  updateSort: function(event, model, position) {
    console.log(event, model, position);
    this.collection.remove(model, { silent: true });

    this.collection.each(function (model, index) {
      var ordinal = index;
      if (index >= position)
          ordinal += 1;
      model.set('ordinal', ordinal);
    });

    model.set('ordinal', position);
    this.collection.add(model, {at: position});

    //this.updateOutput();
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

  count: 1,

  updateProgressBar: function(percentComplete) {
    this.$progressBar.css('width', percentComplete + '%');
    if (percentComplete === 100) {
      this.$progressWrapper.hide();
    }
  },

  updateOutput: function(m, options) {
    this.count = parseInt($('#iteration_count').val(), 10);
    glitchFX.setImage(img);
    this.runFilters(); 
  },

  runFilters: function() {
    if (this.count > 0) {
        this.count -= 1;
        this.$progressWrapper.show();
        glitchFX.applyFilters(
            this.collection.getFilters(),
            this.runFilters.bind(this),
            this.updateProgressBar.bind(this)
        );
        glitchFX.setImage(canvas);
    } else {
        console.log('finished');   
    }
  },

  renderOutput: function(m, options) {
    var tmpCanvas = document.createElement('canvas');
    var resolution = $('#resolution').val().split('x');
    tmpCanvas.width = parseInt(resolution[0], 10);
    tmpCanvas.height = parseInt(resolution[1], 10);

    var destination = $('#destination').val();
    var tmpDraw = new GlitchFX(tmpCanvas, img);

    this.$progressWrapper.show();

    tmpDraw.applyFilters(
      this.collection.getFilters(),
      function() {
          var dataURL = tmpCanvas.toDataURL('image/jpg');
          if (destination === 'imgur')
            this.imgurUpload(dataURL);
          else
            window.open(dataURL);
      }.bind(this),
      this.updateProgressBar.bind(this)
    );

  },

  imgurUpload: function(_dataURL) {
    //var tmpImg = document.createElement('img');
    var clientId = 'cd5ead822feb886';
    var dataURL = _dataURL;
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
                window.open('http://imgur.com/gallery/' + response.data.id);
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
