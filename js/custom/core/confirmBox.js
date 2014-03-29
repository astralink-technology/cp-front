define("core/confirmBox", ['bootstrap'],
    function (bootstrap) {
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
                        '<div class="modal fade confirmBox" id="confirmBox' + settings.prefix + '" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false" aria-labelledby="confirmBox' + settings.prefix + 'Label" aria-hidden="true">',
                            '<div class="modal-dialog">',
                                '<div class="modal-content">',
                                    '<div class="modal-header">',
                                        '<h4 class="modal-title" id="myModalLabel">' + _settings.confirmBoxTitle + '</h4>',
                                    '</div>',
                                    '<div class="modal-body">',
                                        '<p>' + _settings.comfirmBoxText + '</p>',
                                    '</div>',
                                    '<div class="modal-footer">',
                                        '<button type="button" class="btn btn-default" data-dismiss="modal" id="btNotConfirm-' + settings.prefix + '">' + settings.notConfirmActionText + '</button>',
                                        '<button type="button" class="btn btn-primary" id="btConfirm-' + settings.prefix + '" >' + settings.confirmActionText + '</button>',
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
