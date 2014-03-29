define("core/videoPlayer", ['bootstrap'],
    function (bootstrap) {
        var _settings = null;

        var methods = {
            init: function (options) {
                var element = this;
                var settings = $.extend({
                    prefix : '',
                    videoId: '',
                    videoUrl : '',
                    videoTitle: 'Video Player',
                    videoPoster: '',
                    videoType: 'mp4', //standard is mp4
                    playerHeight: '264',
                    playerWidth: '640',
                    autoplay: false,
                    preload : 'none',
                    loop : false,
                    modal: true
                }, options);
                _settings = settings;
                var $element = $(element);
                $element.html(
                    [
                        '<div class="modal fade videoPlayer" id="videoPlayer' + settings.prefix + '" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="videoPlayer' + settings.prefix + 'Label" aria-hidden="true">',
                            '<div class="modal-dialog">',
                                '<div class="modal-content">',
                                    '<div class="modal-header">',
                                        '<h4 class="modal-title" id="videoPlayerTitle' + settings.prefix + '">' + _settings.videoTitle + '</h4>',
                                    '</div>',
                                    '<div class="modal-body">',
                                        '<video id="videoPlayer' + settings.videoId + '" class="video-js vjs-default-skin"',
                                            'controls preload="auto" width="' + settings.playerWidth + '" height="' +settings.playerHeight + '"',
                                            'poster="' + settings.videoPoster + '" >',
                                            '<source src="' + settings.videoUrl + '" type="video/' + settings.videoType + '" />',
                                        '</video>',
                                    '</div>',
                                    '<div class="modal-footer">',
                                        '<button type="button" class="btn btn-default" data-dismiss="modal" id="btClose-' + settings.prefix + '">Close</button>',
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join(''));

                if (settings.modal){
                    $('#videoPlayer' + settings.prefix).modal();
                    videojs("videoPlayer" + settings.videoId, {}, function(){
                        // Player (this) is initialized and ready.
                    });
                }
            }
        };
        $.fn.videoPlayer = function (methodOrOptions) {
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
