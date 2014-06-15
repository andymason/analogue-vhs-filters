'use strict';

define([
    'backbone',
    'underscore',
    'text!templates/inputTemplate.html'
], function (
    Backbone,
    _,
    templateHtml
) {
    return Backbone.View.extend({
        className: 'input_wrapper',

        template: _.template(templateHtml),

        events: {
            'click .input_update': 'updateInput',
            'change .input_file': 'updateInputImage'
        },

        initialize: function() {
            // Model events
            this.model.on('change:dataURL', this.updateImage, this);
            
            this.img = document.createElement('img');
            this.reader = new FileReader();
            this.reader.addEventListener('loadend', this.stateChange.bind(this), false);
            this.canvas = document.createElement('canvas');
        },

        stateChange: function(e) {
            if (e.type === 'loadend') {
                console.log('in here',e);
                this.model.set('dataURL', this.reader.result);
            }
        },

        updateImage: function() {
            console.log(this);
            this.img.src = this.model.get('dataURL');
            console.log(this.img);
        },

        updateInput: function() {
            console.log('updating input');
        },

        updateInputImage: function(e) {
            var files = e.target.files;
            var file = files[0];
            if (!file.type.match('image')) {
                return;
            }

            this.reader.readAsDataURL(file);

            var imagePath = e.currentTarget.value;
            this.model.set('imagePath', imagePath);
        },

        render: function() {
            this.$el.html(this.template({ }));

            return this;
        }

    });
});

