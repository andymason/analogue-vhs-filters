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
    'click .source_update': 'updateSource',
    'change #local_image': 'handleLocalImage'
  },

  updateSource: function() {
    this.model.set('sourceUrl', this.$sourceUrl.val());
  },

  handleLocalImage: function(e) {
    var reader = new FileReader();
    reader.onload = function(event){
        img.onload = function(event) {
          glitchFX.setImage(this);
          app.FilterCollectionView.updateOutput();
        }
        img.src = event.target.result;
      }

    reader.readAsDataURL(e.target.files[0]);
  },

  updateImage: function() {
    var photo = new Image();
    photo.addEventListener('load', function() {
      glitchFX.setImage(this);
      app.FilterCollectionView.updateOutput();

    }, false);
    photo.setAttribute('src', this.model.get('sourceUrl'));

    this.$sourceImg.attr('src', photo.src);
  }

});

app.sourceInput = new app.SourceInput();
