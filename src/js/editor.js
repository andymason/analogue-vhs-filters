/*

  PresetCombinations:
    eg:
      - Security camera = scanlines {10, 2}, tint {#333}, contrast {0.3}
      - VHS tape = scale {2}, saturation {1.2}

  Filter:
    - Human name
    - Bound to image.method
    - Options
    - Option types
    - Option values


  Filter combination:
   - Ordered array of filter models (collection)


 */


//analogue.scanlines();
//analogue.brightness(-50);
//analogue.text('UHF 1', 50, 60, 40, 'rgba(10, 210, 10, 0.8)');
//analogue.rgbShift(0.13, true);




var filterView = Backbone.View.extend({
  render: function() {
    this.$el.append($('<h1></h1>').text( this.model.get('name') ));
    return this;
  }
});









/*

 analogue.text('UHF 1', 50, 60, 40, 'rgba(10, 210, 10, 0.8)');
 analogue.border(10);
 analogue.saturation(0.1);
 analogue.noise(7, false);
 analogue.noise(5, true);

 analogue.stutter(0.1);

 analogue.rgbShift(0.13, true);
 analogue.ghost(42, 0, 0.2, false);
 */


