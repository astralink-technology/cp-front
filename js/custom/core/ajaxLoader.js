define("core/ajaxLoader", ['bootstrap'],
    function (bootstrap) {
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
                        '<div class="modal fade modal-ajaxloader" id="modalAjaxLoader' + settings.prefix + '" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-labelledby="modalAjaxLoader' + settings.prefix + 'Label" aria-hidden="true">',
                            '<div class="modal-dialog">',
                                '<div class="modal-content">',
                                    '<div class="modal-header">',
                                            '<h4 class="modal-title" id="modalAjaxLoaderLabel' + settings.prefix + '">' + _settings.title + '</h4>',
                                    '</div>',
                                    '<div class="modal-body">',
                                            '<div class="full-block">',
                                                '<span><img src="/img/ajax-loader.gif" /> </span><span id="modalAjaxLoaderText' + settings.prefix + '"></span>',
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
