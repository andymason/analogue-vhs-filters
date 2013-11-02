var app = app || {};

var img = document.querySelector('#source_image');
var canvas = document.querySelector('#output');
var analogue = new Analogue(canvas, img);
analogue.drawImage();

app.AppView = Backbone.View.extend({

  el: '#editor',

  initialize: function() {
    this.$dropdown = this.$('#filter_selection_dropdown');
    this.$activeFilters = this.$('#active_filters');

    app.filterData.each(this.addDropdownItem, this);

    this.render();
  },

  events: {
    'click #filter_selection_add' : 'addFilter'
  },

  addDropdownItem: function(filter) {
    this.$dropdown.append(
      $('<option>').text(filter.get('name')).attr('value', filter.get('name'))
    );
  },

  addFilter: function(filter) {
    var filterName = this.$dropdown.val();
    console.log(filterName);
    var filterData = app.filterData.find(function(filter) {
      return filter.get('name') === filterName;
    }, this);

    var model = new app.Filter(filterData.toJSON());
    app.FilterCollection.add( model );

    var view = new app.FilterItemView({ model: model });
    this.$activeFilters.append(view.render().el);

  },

  addAll: function() {

  },

  render: function() {
    //this.$el.html('<h1>teset</h1>');
    console.log('jere');
    //var activeFiltersList = new activeFilterCollectionView();
    //var dropDownMenu = new EDITOR.filterDropDownListView();
    //$('body').append(dropDownMenu.render().$el);
  }

});
