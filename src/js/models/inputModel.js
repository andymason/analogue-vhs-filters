define([
    'backbone'
], function (
    Backbone
) {
    return Backbone.Model.extend({
        
        defaults: {
            dataURL: null,
            width: null,
            height: null
        }
    });
});
