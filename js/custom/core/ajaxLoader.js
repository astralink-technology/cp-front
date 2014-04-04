define("core/ajaxLoader", ['jquery', 'bootstrap'],
    function ($, bootstrap) {
        var _settings = null;
        var methods = {
            init: function (options) {
                var element = this;
                var settings = $.extend({
                    prefix: '',
                    title: 'Loading',
                    text: '',
                    timeout: 120000,
                    finishLoading: function(prefix){}
                }, options);
                _settings = settings;
                var $element = $(element);
                $element.html(
                    [
                        '<div class="modal fade js-mod-ajaxloader" id="modalAjaxLoader' + _settings.prefix + '" tabindex="-1" role="dialog" aria-labelledby="modalAjaxLoader' + _settings.prefix + 'Label"  data-backdrop="static" data-keyboard="false" aria-hidden="true">',
                        '<div class="modal-dialog">',
                        '<div class="modal-content">',
                        '<div class="modal-body">',
                        '<div class="full-block">',
                        '<h2>' + _settings.title + '</h2>',
                        '</div>',
                        '<div class="full-block">',
                        '<span class="loader-img"><img src="/img/ajax-loader.gif" /> </span><span id="modalAjaxLoaderText' + settings.prefix + '"></span>',
                        '</div>',
                        '</div>',
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(''));
                if(settings.text){
                    $("#modalAjaxLoaderText" + settings.prefix).text(settings.text);
                };

                //popup the loader
                $('#modalAjaxLoader' + settings.prefix).modal();
                setTimeout(function(){
                    methods._closeAjaxLoader(settings.prefix);
                }, settings.timeout);
            },
            _closeAjaxLoader: function(prefix){
                $('#modalAjaxLoader' + prefix).modal('hide');
            },
            finishLoading: function(prefix){
                methods._closeAjaxLoader(prefix)
            }
        };
        $.fn.ajaxLoader = function (methodOrOptions) {
            if (methods[methodOrOptions]) {
                return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
                return methods.init.apply(this, arguments);
            } else {
                $.error('Method ' + method + ' does not exist');
            }

            $(element).load(function () {
            });
        };
    });
