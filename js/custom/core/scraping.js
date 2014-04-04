define("core/scraping", ['jquery'],
    function ($) {
        var _settings = null;
        var methods = {
            init: function (options) {
                var element = this;
                var settings = $.extend({
                    prefix: ''
                }, options);
                _settings = settings;
                var $element = $(element);
                $element.html(
                    [
                        '<label>Input Scrape URL</label>',
                        '<input type="text" id="tbUrl"/>',
                        '<button id="btn-scrape" class="btn btn-primary">Scrape</button>',
                        '<div id="output-block"></div>'
                    ].join(''));
                $("#btn-scrape").click(function(){
                    methods._getHtmlContent();
                })
            },
            _getHtmlContent: function(){
                $.ajax({
                    type: "GET",
                    url: "/cp-core/utilities/scrapeSite",
                    success: function (json) {
                        $("#output-block").text(json);
                    },
                    error: function (xhr) {
                    }
                });
            }
        };
        $.fn.scraping = function (methodOrOptions) {
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
