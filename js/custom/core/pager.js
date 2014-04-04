define("core/pager", ['jquery', 'bootstrap'],
    function ($, bootstrap) {
        var _settings = null;
        var _currentActive = 1;
        var _pages = 0;
        var _pagesRange = 0;
        var methods = {
            init: function (options) {
                var element = this;
                var settings = $.extend({
                    prefix: '',
                    maxLength: '',
                    totalRecords: '',
                    recordsPerPage: '',
                    rewindFastForwardControls: true,
                    moreLessControls: true,
                    onLoad: function(prefix, currentActive){},
                    onChange: function(prefix, currentActive){}
                }, options);
                _settings = settings;
                var $element = $(element);
                $element.html(
                    [
                        '<ul class="pagination" id="pager-' + settings.prefix + '" ></ul>'
                    ].join(''));

                if (settings.maxLength && settings.totalRecords && _settings.recordsPerPage){
                    methods._loadPager(settings.prefix);
                }
            },
            _loadPager: function(prefix){
                //find the total pages
                _pages = Math.ceil(_settings.totalRecords / _settings.recordsPerPage);

                $('#pager-' + prefix).append('<li class="rewind" style="display:none"><a href="javascript:void(0)"><i class="fa fa-angle-double-left"></i></a></li>');
                $('#pager-' + prefix).append('<li class="back"><a href="javascript:void(0)"><i class="fa fa-angle-left"></i></a></li>');
                $('#pager-' + prefix).append('<li class="less" style="display:none"><a href="javascript:void(0)">...</a></li>');
                if (_settings.maxLength){
                    if (_pages > _settings.maxLength){
                        for (var i = 0; i < _settings.maxLength; i ++ ){
                            var value = i + 1;
                            $('#pager-' + prefix).append('<li class="' + value + '"><a href="javascript:void(0)">' + value + '</a></li>');
                        }
                    }else{
                        for (var i = 0; i < _pages; i ++ ){
                            var value = i + 1;
                            $('#pager-' + prefix).append('<li class="' + value + '"><a href="javascript:void(0)">' + value + '</a></li>');
                        }
                    }
                }else{
                    for (var i = 0; i < _pages; i ++ ){
                        var value = i + 1;
                        $('#pager-' + prefix).append('<li class="' + value + '"><a href="javascript:void(0)">' + value + '</a></li>');
                    }
                }
                $('#pager-' + prefix).append('<li class="more" style="display:none"><a href="javascript:void(0)">...</a></li>');
                $('#pager-' + prefix).append('<li class="forward"><a href="javascript:void(0)"><i class="fa fa-angle-right"></i></a></li>');
                $('#pager-' + prefix).append('<li class="fastforward" style="display:none"><a href="javascript:void(0)"><i class="fa fa-angle-double-right"></i></a></li>');

                if (_settings.moreLessControls){
                    //if more is needed
                    if (_pages > _settings.maxLength){
                        $('#pager-' + prefix + ' .more').show();
                    }
                }

                if (_settings.rewindFastForwardControls){
                    $('#pager-' + prefix + ' .fastforward').show();
                    $('#pager-' + prefix + ' .rewind').show();
                }

                //initial page range is set to maxlength
                _pagesRange = _settings.maxLength;
                //set current active to active
                $('.' + _currentActive).addClass('active');
                //tab controls function
                methods._loadTabs(prefix);
                _settings.onLoad(prefix, _currentActive);
            },
            _loadTabs: function(prefix){
                $("#pager-" + prefix + " li a").each(function(){
                        $(this).click(function(){
                            if ($(this).parent().hasClass('rewind')){
                                methods._clickRewind(prefix);
                            } else if ($(this).parent().hasClass('back')){
                                methods._clickBack(prefix);
                            } else if ($(this).parent().hasClass('forward')){
                                methods._clickNext(prefix);
                            } else if ($(this).parent().hasClass('fastforward')){
                                methods._clickFastForward(prefix);
                            } else if ($(this).parent().hasClass('more')){
                                methods._clickMore(prefix);
                            } else if ($(this).parent().hasClass('less')){
                                methods._clickLess(prefix);
                            } else if ($(this).parent().hasClass('active')){
                                //do nothing
                            } else{
                                //set the current index
                                var value = parseInt($(this).parent().attr('class'));
                                _currentActive = value;
                                $('#pager-' + prefix + ' li').removeClass('active');
                                $(this).parent().addClass('active');
                                _settings.onChange(prefix, _currentActive);
                            }
                        });
                });
            },
            _clickNext: function(prefix){
                if (_currentActive != _pages){
                    _currentActive += 1;
                    $('#pager-' + prefix + ' li').removeClass('active');
                    $('.' + _currentActive).addClass('active');
                    if (_currentActive > _pagesRange){
                        methods._extendPager(prefix);
                    }
                    _settings.onChange(prefix, _currentActive);
                };
            },
            _clickBack: function(prefix){
                if (_currentActive != 1){
                    _currentActive -= 1;
                    $('#pager-' + prefix + ' li').removeClass('active');
                    $('.' + _currentActive).addClass('active');
                    if ((_pagesRange - (_currentActive + _settings.maxLength)) == 0){
                        methods._contractPager(prefix);
                    }
                    _settings.onChange(prefix, _currentActive);
                }
            },
            _clickFastForward: function(prefix){
                if (_pages <= _settings.maxLength){
                    //bring user to the last page
                    _currentActive = _pages;
                    $('#pager-' + prefix + ' li').removeClass('active');
                    $('#pager-' + prefix + ' li.' + _pages).addClass('active');
                    _settings.onChange(prefix, _currentActive);
                }else{
                    //if current active is not in the range of the last page
                    if (Math.ceil(_currentActive / _settings.maxLength) < Math.ceil(_pages / _settings.maxLength)){
                        methods._loadLastPager(prefix);
                        _settings.onChange(prefix, _currentActive);
                    }
                }
            },
            _clickRewind: function(prefix){
                if (_pages <= _settings.maxLength){
                    //bring user to the last page
                    _currentActive = 1;
                    $('#pager-' + prefix + ' li').removeClass('active');
                    $('#pager-' + prefix + ' li.1').addClass('active');
                    _settings.onChange(prefix, _currentActive);
                }else{
                    //if current active is not in the range of the first page
                    if ((_currentActive - _settings.maxLength) > 0){
                        methods._loadFirstPager(prefix);
                        _settings.onChange(prefix, _currentActive);
                    }
                }
            },
            _clickMore : function(prefix){
                methods._extendPager(prefix);
                _settings.onChange(prefix, _currentActive);
            },
            _clickLess : function(prefix){
                methods._contractPager(prefix);
                _settings.onChange(prefix, _currentActive);
            },
            _extendPager: function(prefix){
                var _newClass = _pagesRange;
                var activeIndex = 0;
                var endOfPager = false;
                _pagesRange += _settings.maxLength;
                //get the current more index and add on the indexing range
                $("#pager-" + prefix + ' li').each(function(){
                    $(this).removeClass('active');
                    if ($(this).hasClass('rewind') || $(this).hasClass('back') || $(this).hasClass('less') || $(this).hasClass('forward') || $(this).hasClass('fastforward') || $(this).hasClass('less') || $(this).hasClass('more')){
                        //do nothing
                    } else {
                        activeIndex += 1;
                        //add on to the more index
                        $(this).attr('class', '');
                        $(this).children('a').html('');
                        if (_newClass < _pages){
                            _newClass += 1;
                            $(this).show();
                            $(this).attr('class', _newClass);
                            $(this).children('a').html(_newClass);
                        }else{
                            endOfPager = true;
                            $(this).hide();
                        }
                        if (activeIndex == 1){
                            _currentActive = parseInt($(this).attr('class'));
                            $(this).addClass('active');
                        }
                    }
                });

                if (_settings.moreLessControls){
                    if (endOfPager){
                        $("#pager-" + prefix + ' li.more').hide();
                    }else{
                        $("#pager-" + prefix + ' li.more').show();
                    }
                    $("#pager-" + prefix + ' li.less').show();
                }
            },
            _contractPager: function(prefix){
                _pagesRange -= _settings.maxLength;
                var _newClass = _pagesRange - _settings.maxLength; // to start from the range head.
                var activeIndex = 0;
                var startOfPager = false;
                if (_pagesRange == _settings.maxLength){
                    startOfPager = true;
                }
                //get the current more index and reduce the indexing range
                $("#pager-" + prefix + ' li').each(function(){
                    $(this).removeClass('active');
                    if ($(this).hasClass('rewind') || $(this).hasClass('back') || $(this).hasClass('less') || $(this).hasClass('forward') || $(this).hasClass('fastforward') || $(this).hasClass('less') || $(this).hasClass('more')){
                        //do nothing
                    } else {
                        activeIndex += 1;
                        //add on to the more index
                        $(this).attr('class', '');
                        $(this).children('a').html('');

                        _newClass += 1;
                        $(this).show();
                        $(this).attr('class', _newClass);
                        $(this).children('a').html(_newClass);

                        if (activeIndex == _settings.maxLength){
                            _currentActive = parseInt($(this).attr('class'));
                            $(this).addClass('active');
                        }
                    }
                });

                if (_settings.moreLessControls){
                    if (startOfPager){
                        $("#pager-" + prefix + ' li.less').hide();
                    }else{
                        $("#pager-" + prefix + ' li.less').show();
                    }
                    $("#pager-" + prefix + ' li.more').show();
                }
            },
            _loadFirstPager: function(prefix){
                _pagesRange = _settings.maxLength;
                var _newClass = 0;
                var activeIndex = 0;
                //get the current more index and reduce the indexing range
                $("#pager-" + prefix + ' li').each(function(){
                    $(this).removeClass('active');
                    if ($(this).hasClass('rewind') || $(this).hasClass('back') || $(this).hasClass('less') || $(this).hasClass('forward') || $(this).hasClass('fastforward') || $(this).hasClass('less') || $(this).hasClass('more')){
                        //do nothing
                    } else {
                        activeIndex += 1;
                        //add on to the more index
                        $(this).attr('class', '');
                        $(this).children('a').html('');

                        _newClass += 1;
                        $(this).show();
                        $(this).attr('class', _newClass);
                        $(this).children('a').html(_newClass);

                        if (activeIndex == 1){
                            _currentActive = parseInt($(this).attr('class'));
                            $(this).addClass('active');
                        }
                    }
                });
                if (_settings.moreLessControls){
                    $("#pager-" + prefix + ' li.less').hide();
                    $("#pager-" + prefix + ' li.more').show();
                }
            },
            _loadLastPager: function(prefix){
                var lastRange = Math.ceil(_pages / _settings.maxLength) * _settings.maxLength;
                var activeIndex = 0;
                var _newClass = lastRange - _settings.maxLength;
                _pagesRange = lastRange;
                //get the current more index and add on the indexing range
                $("#pager-" + prefix + ' li').each(function(){
                    $(this).removeClass('active');
                    if ($(this).hasClass('rewind') || $(this).hasClass('back') || $(this).hasClass('less') || $(this).hasClass('forward') || $(this).hasClass('fastforward') || $(this).hasClass('less') || $(this).hasClass('more')){
                        //do nothing
                    } else {
                        activeIndex += 1;
                        //add on to the more index
                        $(this).attr('class', '');
                        $(this).children('a').html('');
                        if (_newClass < _pages){
                            _newClass += 1;
                            $(this).show();
                            $(this).attr('class', _newClass);
                            $(this).children('a').html(_newClass);
                        }else{
                            $(this).hide();
                        }
                    }
                });

                _currentActive = _newClass;
                $("#pager-" + prefix + ' li.' + _newClass).addClass('active');

                if (_settings.moreLessControls){
                    $("#pager-" + prefix + ' li.more').hide();
                    $("#pager-" + prefix + ' li.less').show();
                }
            }
        };
        $.fn.pager = function (methodOrOptions) {
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
