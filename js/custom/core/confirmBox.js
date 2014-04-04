define("core/confirmBox", ['jquery', 'bootstrap'],
    function ($, bootstrap) {
        var _settings = null;
        var methods = {
            init: function (options) {
                var element = this;
                var settings = $.extend({
                    prefix: '',
                    confirmBoxTitle: 'Confirm',
                    comfirmBoxText: 'Are you sure?',
                    confirmActionText : 'Confirm',
                    notConfirmActionText : 'Cancel',
                    confirm: function(){},
                    cancel: function(){}
                }, options);
                _settings = settings;
                var $element = $(element);
                $element.html(
                    [
                        '<div class="modal fade js-mod-confirm-box" id="confirmBox' + _settings.prefix + '" tabindex="-1" role="dialog" aria-labelledby="confirmBox' + _settings.prefix + 'Label" aria-hidden="true">',
                        '<div class="modal-dialog">',
                        '<div class="modal-content">',
                        '<div class="modal-body">',
                        '<h2>' + _settings.confirmBoxTitle + '</h2>',
                        '<div class="full-block">',
                        '<p>' + _settings.comfirmBoxText + '</p>',
                        '</div>',
                        '<div class="form-group control-group">',
                        '<div class="pull-right">',
                        '<button type="button" class="btn btn-default" data-dismiss="modal" id="btNotConfirm-' + settings.prefix + '">' + settings.notConfirmActionText + '</button>',
                        '<button type="button" class="btn btn-primary" id="btConfirm-' + settings.prefix + '" >' + settings.confirmActionText + '</button>',
                        '</div>',
                        '</div>',
                        '</div>',
                        '</div>',
                        '</div>',
                        '</div>'
                    ].join(''));

                //popup
                $('#confirmBox' + settings.prefix).modal();
                $("#btConfirm-" + settings.prefix).click(function(){
                    settings.confirm();
                })

                $("#btNotConfirm-" + settings.prefix).click(function(){
                    settings.cancel();
                });
            },
            closeConfirmBox: function(prefix){
                $('#confirmBox' + prefix).modal('hide');
            }
        };
        $.fn.confirmBox = function (methodOrOptions) {
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
