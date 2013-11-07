var app = app || {};

app.SourceInput = Backbone.View.extend({

  el: '#sourceWrapper',

  model: app.Input,

  initialize: function() {
    this.$sourceUrl = this.$('.source_input');
    this.$sourceImg = this.$('.source_image');

    this.model.on('change', this.updateImage, this);
  },

  events: {
    'click .source_update': 'updateSource'
  },

  updateSource: function() {
    this.model.set('sourceUrl', this.$sourceUrl.val());
  },

  updateImage: function() {
    var photo = new Image();
    photo.addEventListener('load', function() {
      console.log(this);
      analogue.updateImage(this);
      app.FilterCollectionView.updateOutput();

    }, false);
    photo.setAttribute('src', this.model.get('sourceUrl'));

    this.$sourceImg.attr('src', photo.src);


  }

});

app.sourceInput = new app.SourceInput();
