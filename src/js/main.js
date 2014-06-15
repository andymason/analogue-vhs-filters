requirejs.config({
    baseUrl: 'js',
    paths: {
        jquery: 'libs/jquery-2.0.3.min',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        text: 'libs/helpers/text'
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery']
        },
        underscore: {
            exports: '_'
        }
    }
});

require([
    'jquery',
    'models/inputModel',
    'views/inputView'
], function(
    $,
    InputModel,
    InputView
) {
    var inputModel = new InputModel();
    var inputView = new InputView({ model: inputModel });

    var $holder = $('.holder');
    $holder.append(inputView.render().el);
});

