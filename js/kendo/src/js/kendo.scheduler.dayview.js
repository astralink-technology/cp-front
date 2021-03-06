/*
* Kendo UI Web v2013.2.918 (http://kendoui.com)
* Copyright 2013 Telerik AD. All rights reserved.
*
* Kendo UI Web commercial licenses may be obtained at
* https://www.kendoui.com/purchase/license-agreement/kendo-ui-web-commercial.aspx
* If you do not own a commercial license, this file shall be governed by the
* GNU General Public License (GPL) version 3.
* For GPL requirements, please review: http://www.gnu.org/copyleft/gpl.html
*/

kendo_module({
    id: "scheduler.dayview",
    name: "Scheduler Day View",
    category: "web",
    description: "The Scheduler Day View",
    depends: [ "scheduler.view" ],
    hidden: true
});

(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.ui,
        setTime = kendo.date.setTime,
        SchedulerView = ui.SchedulerView,
        extend = $.extend,
        proxy = $.proxy,
        getDate = kendo.date.getDate,
        MS_PER_MINUTE = kendo.date.MS_PER_MINUTE,
        MS_PER_DAY = kendo.date.MS_PER_DAY,
        getMilliseconds = kendo.date.getMilliseconds,
        NS = ".kendoMultiDayView";

    var DAY_VIEW_EVENT_TEMPLATE = kendo.template('<div title="(#=kendo.format("{0:t} - {1:t}", start, end)#): #=title.replace(/"/g,"&\\#34;")#">' +
                    '<div class="k-event-template k-event-time">#:kendo.format("{0:t} - {1:t}", start, end)#</div>' +
                    '<div class="k-event-template">${title}</div>' +
                '</div>'),
        DAY_VIEW_ALL_DAY_EVENT_TEMPLATE = kendo.template('<div title="(#=kendo.format("{0:t}", start)#): #=title.replace(/"/g,"&\\#34;")#">' +
                    '<div class="k-event-template">${title}</div>' +
                '</div>'),
        DATA_HEADER_TEMPLATE = kendo.template("<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd M/dd')#</span>"),
        ALLDAY_EVENT_WRAPPER_STRING = '<div role="gridcell" aria-selected="false" ' +
                'data-#=ns#uid="#=uid#"' +
                '#if (resources[0]) { #' +
                    'style="background-color:#=resources[0].color#; border-color: #=resources[0].color#"' +
                    'class="k-event#=inverseColor ? " k-event-inverse" : ""#" ' +
                '#} else {#' +
                    'class="k-event"' +
                '#}#' +
                '>' +
                '<span class="k-event-actions">' +
                    '# if(data.tail || data.middle) {#' +
                        '<span class="k-icon k-i-arrow-w"></span>' +
                    '#}#' +
                    '# if(data.isException()) {#' +
                        '<span class="k-icon k-i-exception"></span>' +
                    '# } else if(data.isRecurring()) {#' +
                        '<span class="k-icon k-i-refresh"></span>' +
                    '# } #' +
                '</span>' +
                '{0}' +
                '<span class="k-event-actions">' +
                    '#if (showDelete) {#' +
                        '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' +
                    '#}#' +
                    '# if(data.head || data.middle) {#' +
                        '<span class="k-icon k-i-arrow-e"></span>' +
                    '#}#' +
                '</span>' +
                '#if(resizable && !singleDay && !data.tail && !data.middle){#' +
                '<span class="k-resize-handle k-resize-w"></span>' +
                '#}#' +
                '#if(resizable && !singleDay && !data.head && !data.middle){#' +
                '<span class="k-resize-handle k-resize-e"></span>' +
                '#}#' +
                '</div>',
        EVENT_WRAPPER_STRING = '<div role="gridcell" aria-selected="false" ' +
                'data-#=ns#uid="#=uid#" ' +
                '#if (resources[0]) { #' +
                    'style="background-color:#=resources[0].color #; border-color: #=resources[0].color#"' +
                    'class="k-event#=inverseColor ? " k-event-inverse" : ""#"' +
                '#} else {#' +
                    'class="k-event"' +
                '#}#' +
                '>' +
                 '<span class="k-event-actions">' +
                    '# if(data.isException()) {#' +
                        '<span class="k-icon k-i-exception"></span>' +
                    '# } else if(data.isRecurring()) {#' +
                        '<span class="k-icon k-i-refresh"></span>' +
                    '# } #' +
                '</span>' +
                '{0}' +
                '<span class="k-event-actions">' +
                    '#if (showDelete) {#' +
                        '<a href="\\#" class="k-link k-event-delete"><span class="k-icon k-si-close"></span></a>' +
                    '#}#' +
                '</span>' +
                '<span class="k-event-top-actions">' +
                    '# if(data.tail || data.middle) {#' +
                    '<span class="k-icon k-i-arrow-n"></span>' +
                    '# } #' +
                '</span>' +
                '<span class="k-event-bottom-actions">' +
                    '# if(data.head || data.middle) {#' +
                        '<span class="k-icon k-i-arrow-s"></span>' +
                    '# } #' +
                '</span>' +
                '# if(resizable && !data.tail && !data.middle) {#' +
                '<span class="k-resize-handle k-resize-n"></span>' +
                '# } #' +
                '# if(resizable && !data.head && !data.middle) {#' +
                    '<span class="k-resize-handle k-resize-s"></span>' +
                '# } #' +
                '</div>';

    function toInvariantTime(date) {
        var staticDate = new Date(1980, 1, 1, 0, 0, 0);
        setTime(staticDate, getMilliseconds(date));
        return staticDate;
    }

    function isInDateRange(value, min, max) {
        var msMin = min.getTime(),
            msMax = max.getTime(),
            msValue;

        msValue = value.getTime();

        return msValue >= msMin && msValue <= msMax;
    }

    function isInTimeRange(value, min, max, overlaps) {
        overlaps = overlaps ? value <= max : value < max;
        return value > min && overlaps;
    }

    function addContinuousEvent(group, range, element, isAllDay) {
        var events = group._continuousEvents;
        var lastEvent = events[events.length - 1];
        var startDate = getDate(range.start.startDate()).getTime();

        //this handles all day event which is over multiple slots but starts
        //after one of the time events
        if (isAllDay && lastEvent &&
            getDate(lastEvent.start.startDate()).getTime() == startDate) {

                var idx = events.length - 1;
                for ( ; idx > -1; idx --) {
                    if (events[idx].isAllDay ||
                        getDate(events[idx].start.startDate()).getTime() < startDate) {
                            break;
                        }
                }

                events.splice(idx + 1, 0, {
                    element: element,
                    isAllDay: true,
                    uid: element.attr(kendo.attr("uid")),
                    start: range.start,
                    end: range.end
                });
            } else {
                events.push({
                    element: element,
                    isAllDay: isAllDay,
                    uid: element.attr(kendo.attr("uid")),
                    start: range.start,
                    end: range.end
                });
            }
    }

    var MultiDayView = SchedulerView.extend({
        init: function(element, options) {
            var that = this;

            SchedulerView.fn.init.call(that, element, options);

            that.title = that.options.title || that.options.name;

            that._templates();

            that._editable();

            that.calculateDateRange();

            that._groups();
        },

        _updateResizeHint: function(event, startSlot, endSlot) {
            var multiday = event.isMultiDay();

            var group = this.groups[endSlot.groupIndex];

            var ranges = group.ranges(startSlot.start, event.isAllDay ? endSlot.start : endSlot.end, multiday, event.isAllDay);

            this._removeResizeHint();

            for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                var range = ranges[rangeIndex];
                var start = range.startSlot();

                var width = start.offsetWidth;
                var height = start.clientHeight;

                if (multiday) {
                    width = range.innerWidth();
                } else {
                    height = range.innerHeight();
                }

                var hint = SchedulerView.fn._createResizeHint.call(this,
                    this._scrollbarOffset(start.offsetLeft, multiday),
                    start.offsetTop,
                    width,
                    height
                );

                this._resizeHint = this._resizeHint.add(hint);
            }

            var format = "t";
            var container = this.content;

            if (multiday) {
                format = "M/dd";
                container = this.element.find(".k-scheduler-header-wrap:has(.k-scheduler-header-all-day) > div");
                if (!container.length) {
                    container = this.content;
                }
            }

            this._resizeHint.appendTo(container);

            this._resizeHint.find(".k-label-top,.k-label-bottom").text("");

            this._resizeHint.first().addClass("k-first").find(".k-label-top").text(kendo.toString(startSlot.startDate(), format));

            this._resizeHint.last().addClass("k-last").find(".k-label-bottom").text(kendo.toString(endSlot.endDate(), format));
        },

        _updateMoveHint: function(event, initialSlot, currentSlot) {
            var multiday = event.isMultiDay();

            var group = this.groups[currentSlot.groupIndex];

            var distance = currentSlot.start - initialSlot.start;

            var start = kendo.date.toUtcTime(event.start) + distance;

            var end = start + event.duration();

            var ranges = group.ranges(start, end, multiday, event.isAllDay);

            start = kendo.timezone.apply(new Date(start), "Etc/UTC");

            end = kendo.timezone.apply(new Date(end), "Etc/UTC");

            this._removeMoveHint();

            if (!multiday && (getMilliseconds(end) === 0 || getMilliseconds(end) < getMilliseconds(this.startTime()))) {
                if (ranges.length > 1) {
                    ranges.pop();
                }
            }

            for (var rangeIndex = 0; rangeIndex < ranges.length; rangeIndex++) {
                var range = ranges[rangeIndex];
                var startSlot = range.start;

                var hint = this._createEventElement(event.clone({ start: start, startTime: start, end: end, endTime: end }), !multiday);

                hint.addClass("k-event-drag-hint");

                var css = {
                    left: startSlot.offsetLeft + 2,
                    top: startSlot.offsetTop
                };

                if (this._isRtl) {
                   css.left = startSlot.clientWidth * 0.1 + this._scrollbarOffset(startSlot.offsetLeft) + 2;
                }

                if (multiday) {
                    css.width = range.innerWidth() - 4;
                } else {
                    css.height = range.innerHeight() - 3;
                    css.width = startSlot.clientWidth * 0.9 - 4;
                }

                hint.css(css);

                this._moveHint = this._moveHint.add(hint);
            }

            var content = this.content;

            if (multiday) {
                content = this.element.find(".k-scheduler-header-wrap:has(.k-scheduler-header-all-day) > div");
                if (!content.length) {
                    content = this.content;
                }
            }

            this._moveHint.appendTo(content);
        },

       _slotByPosition: function(x, y) {
           var slot;

           var offset;

           if (this._isVerticallyGrouped()) {
               offset = this.content.offset();
           } else {
               offset = this.element.find(".k-scheduler-header-wrap:has(.k-scheduler-header-all-day)").find(">div").offset();
           }

           if (offset) {
               x -= offset.left;
               y -= offset.top;
           }

           x = Math.ceil(x);
           y = Math.ceil(y);

           var group;
           var groupIndex;

           for (groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                group = this.groups[groupIndex];

                slot = group.daySlotByPosition(x, y);

                if (slot) {
                    return slot;
                }
           }

           if (offset) {
               x += offset.left;
               y += offset.top;
           }

           offset = this.content.offset();

           x -= offset.left;
           y -= offset.top;
           y += this.content[0].scrollTop;
           x += this.content[0].scrollLeft;

           x = Math.ceil(x);
           y = Math.ceil(y);

           for (groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                group = this.groups[groupIndex];

                slot = group.timeSlotByPosition(x, y);

                if (slot) {
                    return slot;
                }
           }

           return null;
       },

       _groupCount: function() {
            var resources = this.groupedResources;

            if (resources.length) {
                if (this._groupOrientation() === "vertical") {
                    return this._rowCountForLevel(resources.length - 1);
                } else {
                    return this._columnCountForLevel(resources.length) / this._columnOffsetForResource(resources.length);
                }
            }
            return 1;
        },

        _columnCountInResourceView: function() {
            var resources = this.groupedResources;

            if (!resources.length || this._isVerticallyGrouped()) {
                return this._columnCountForLevel(0);
            }

            return this._columnOffsetForResource(resources.length);
        },

        _timeSlotGroups: function(groupCount, columnCount) {
            var interval = this._timeSlotInterval();

            var tableRows = this.content.find("tr:not(.k-scheduler-header-all-day)");

            tableRows.attr("role", "row");

            var rowCount = tableRows.length;

            if (this._isVerticallyGrouped()) {
                rowCount = Math.floor(rowCount / groupCount);
            }

            for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
                var rowMultiplier = 0;

                if (this._isVerticallyGrouped()) {
                    rowMultiplier = groupIndex;
                }

                var rowIndex = rowMultiplier * rowCount;
                var time;
                var cellMultiplier = 0;

                if (!this._isVerticallyGrouped()) {
                    cellMultiplier = groupIndex;
                }

                while (rowIndex < (rowMultiplier + 1) * rowCount) {
                    var cells = tableRows[rowIndex].children;
                    var group = this.groups[groupIndex];

                    if (rowIndex % rowCount === 0) {
                        time = getMilliseconds(new Date(+this.startTime()));
                    }

                    for (var cellIndex = cellMultiplier * columnCount; cellIndex < (cellMultiplier + 1) * columnCount; cellIndex++) {
                        var cell = cells[cellIndex];

                        var collectionIndex = cellIndex % columnCount;

                        var collection = group.getTimeSlotCollection(collectionIndex);

                        var currentDate = this._dates[collectionIndex];

                        var currentTime = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

                        var start = currentTime + time;

                        var end = start + interval;

                        cell.setAttribute("role", "gridcell");
                        cell.setAttribute("aria-selected", false);

                        collection.addTimeSlot(cell, start, end);
                    }

                    time += interval;
                    rowIndex ++;
                }
            }
        },

        _daySlotGroups: function(groupCount, columnCount) {
            var tableRows;

            if (this._isVerticallyGrouped()) {
                tableRows = this.element.find(".k-scheduler-header-all-day");
            } else {
                tableRows = this.element.find(".k-scheduler-header-all-day tr");
            }

            tableRows.attr("role", "row");

            for (var groupIndex = 0; groupIndex < groupCount; groupIndex++) {
                var rowMultiplier = 0;

                if (this._isVerticallyGrouped()) {
                    rowMultiplier = groupIndex;
                }

                var group = this.groups[groupIndex];

                var collection = group.getDaySlotCollection(0);

                var cells = tableRows[rowMultiplier].children;
                var cellMultiplier = 0;

                if (!this._isVerticallyGrouped()) {
                    cellMultiplier = groupIndex;
                }

                var cellCount = 0;

                for (var cellIndex = cellMultiplier * columnCount; cellIndex < (cellMultiplier + 1) * columnCount; cellIndex++) {
                    var cell = cells[cellIndex];

                    if (cellIndex % columnCount === 0) {
                        cellCount = 0;
                    }

                    var start = kendo.date.addDays(this.startDate(), cellCount);

                    var currentTime = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());

                    cellCount ++;

                    cell.setAttribute("role", "gridcell");
                    cell.setAttribute("aria-selected", false);

                    collection.addDaySlot(cell, currentTime, currentTime + kendo.date.MS_PER_DAY);
                }
            }
        },

        _groups: function() {
            var groupCount = this._groupCount();
            var columnCount = this._columnCountInResourceView();

            this.groups = [];

            for (var idx = 0; idx < groupCount; idx++) {
                var view = this._addResourceView(idx);

                for (var columnIndex = 0; columnIndex < columnCount; columnIndex++) {
                    view.addTimeSlotCollection(this._dates[columnIndex], kendo.date.addDays(this._dates[columnIndex], 1));
                }

                view.addDaySlotCollection(this._dates[0], this._dates[this._dates.length - 1]);
            }

            this._timeSlotGroups(groupCount, columnCount);

            if (this.options.allDaySlot) {
                this._daySlotGroups(groupCount, columnCount);
            }
        },

        options: {
            name: "MultiDayView",
            selectedDateFormat: "{0:D}",
            allDaySlot: true,
            workDay: false,
            title: "",
            startTime: kendo.date.today(),
            endTime: kendo.date.today(),
            minorTickCount: 2,
            majorTick: 60,
            majorTimeHeaderTemplate: "#=kendo.toString(date, 't')#",
            minorTimeHeaderTemplate: "&nbsp;",
            eventTemplate: DAY_VIEW_EVENT_TEMPLATE,
            allDayEventTemplate: DAY_VIEW_ALL_DAY_EVENT_TEMPLATE,
            dateHeaderTemplate: DATA_HEADER_TEMPLATE,
            editable: true,
            workDayStart: new Date(1980, 1, 1, 8, 0, 0),
            workDayEnd: new Date(1980, 1, 1, 17, 0, 0),
            footer: {
                command: "workDay"
            },
            messages: {
                allDay: "all day",
                showFullDay: "Show full day",
                showWorkDay: "Show business hours"
            }
        },

        events: ["remove", "add", "edit"],

        _templates: function() {
            var options = this.options,
                settings = extend({}, kendo.Template, options.templateSettings);

            this.eventTemplate = this._eventTmpl(options.eventTemplate, EVENT_WRAPPER_STRING);
            this.allDayEventTemplate = this._eventTmpl(options.allDayEventTemplate, ALLDAY_EVENT_WRAPPER_STRING);

            this.majorTimeHeaderTemplate = kendo.template(options.majorTimeHeaderTemplate, settings);
            this.minorTimeHeaderTemplate = kendo.template(options.minorTimeHeaderTemplate, settings);
            this.dateHeaderTemplate = kendo.template(options.dateHeaderTemplate, settings);
        },

        _editable: function() {
            if (this.options.editable) {
                if (kendo.support.mobileOS) {
                    this._touchEditable();
                } else {
                    this._mouseEditable();
                }
            }
        },

        _mouseEditable: function() {
            var that = this;
            that.element.on("click" + NS, ".k-event a:has(.k-si-close)", function(e) {
                that.trigger("remove", { uid: $(this).closest(".k-event").attr(kendo.attr("uid")) });
                e.preventDefault();
            });

            if (that.options.editable.create !== false) {
                that.element.on("dblclick" + NS, ".k-scheduler-content td", function(e) {
                    if (!$(this).parent().hasClass("k-scheduler-header-all-day")) {
                        var slot = that._slotByPosition(e.pageX, e.pageY);

                        var resourceInfo = that._resourceBySlot(slot);

                        that.trigger("add", { eventInfo: extend({ start: slot.startDate(), end: slot.endDate() }, resourceInfo) });

                        e.preventDefault();
                    }
                }).on("dblclick" + NS, ".k-scheduler-header-all-day td", function(e) {
                    var slot = that._slotByPosition(e.pageX, e.pageY);
                    var resourceInfo = that._resourceBySlot(slot);

                    that.trigger("add", { eventInfo: extend({}, { isAllDay: true, start: kendo.date.getDate(slot.startDate()), end: kendo.date.getDate(slot.startDate()) }, resourceInfo) });

                    e.preventDefault();
                });
            }

            if (that.options.editable.update !== false) {
                that.element.on("dblclick" + NS, ".k-event", function(e) {
                    that.trigger("edit", { uid: $(this).closest(".k-event").attr(kendo.attr("uid")) });
                    e.preventDefault();
                });
            }
        },

        _touchEditable: function() {
            var that = this;

            that._closeUserEvents = new kendo.UserEvents(that.element, {
               filter: ".k-event a:has(.k-si-close)",
               tap: function(e) {
                    that.trigger("remove", { uid: $(e.target).closest(".k-event").attr(kendo.attr("uid")) });
                    e.preventDefault();
               }
            });

            if (that.options.editable.create !== false) {
                that._addUserEvents = new kendo.UserEvents(that.element, {
                    filter:  ".k-scheduler-content td",
                    tap: function(e) {
                        if (!$(e.target).parent().hasClass("k-scheduler-header-all-day")) {
                            var slot = that._slotByPosition(e.x.location, e.y.location);
                            var resourceInfo = that._resourceBySlot(slot);
                            that.trigger("add", { eventInfo: extend({ start: slot.startDate(), end: slot.endDate() }, resourceInfo) });
                            e.preventDefault();
                        }
                    }
                });

                that._allDayUserEvents = new kendo.UserEvents(that.element, {
                    filter: ".k-scheduler-header-all-day td",
                    tap: function(e) {
                        var slot = that._slotByPosition(e.x.location, e.y.location);
                        var resourceInfo = that._resourceBySlot(slot);

                        that.trigger("add", { eventInfo: extend({}, { isAllDay: true, start: kendo.date.getDate(slot.startDate()), end: kendo.date.getDate(slot.endDate()) }, resourceInfo) });

                        e.preventDefault();
                    }
                });
            }

            if (that.options.editable.update !== false) {
                that._editUserEvents = new kendo.UserEvents(that.element, {
                    filter: ".k-event.k-state-selected",
                    tap: function(e) {
                        if ($(e.event.target).closest("a:has(.k-si-close)").length === 0) {
                            that.trigger("edit", { uid: $(e.target).closest(".k-event").attr(kendo.attr("uid")) });
                            e.preventDefault();
                        }
                    }
                });
            }
        },

        _layout: function(dates) {
            var columns = [];
            var rows = [];
            var options = this.options;
            var that = this;

            for (var idx = 0; idx < dates.length; idx++) {
                var column = {};

                column.text = that.dateHeaderTemplate({ date: dates[idx] });

                if (kendo.date.isToday(dates[idx])) {
                    column.className = "k-today";
                }

                columns.push(column);
            }

            if (options.allDaySlot) {
                rows.push( { text: options.messages.allDay, allDay: true });
            }

            this._forTimeRange(this.startTime(), this.endTime(), function(date, majorTick, middleRow, lastSlotRow) {
                var template = majorTick ? that.majorTimeHeaderTemplate : that.minorTimeHeaderTemplate;

                var row = {
                    text: template({ date: date }),
                    className: lastSlotRow ? "k-slot-cell" : ""
                };

                rows.push(row);
            });

            var resources = this.groupedResources;

            if (resources.length) {
                if (this._groupOrientation() === "vertical") {
                    rows = this._createRowsLayout(resources, rows);
                } else {
                    columns = this._createColumnsLayout(resources, columns);
                }
            }

            return {
                columns: columns,
                rows: rows
            };
        },

        _footer: function() {
            var options = this.options;

            if (options.footer !== false) {
                var html = '<div class="k-header k-scheduler-footer">';

                var command = options.footer.command;

                if (command && command === "workDay") {
                    html += '<ul class="k-reset k-header k-toolbar">';

                    html += '<li class="k-state-default k-scheduler-fullday"><a href="#" class="k-link"><span class="k-icon k-i-clock"></span>';
                    html += (options.workDay ? options.messages.showFullDay : options.messages.showWorkDay) + '</a></li>';

                    html += '</ul>';

                } else {
                    html += "&nbsp;";
                }

                html += "</div>";

                this.footer = $(html).appendTo(this.element);

                var that = this;

                this.footer.on("click" + NS, ".k-scheduler-fullday", function(e) {
                    e.preventDefault();
                    that.trigger("navigate", { view: that.name || options.name, date: that.startDate(), isWorkDay: !options.workDay });
                });
            }
        },

        _forTimeRange: function(min, max, action, after) {
            min = toInvariantTime(min); //convert the date to 1/2/1980 and sets the time
            max = toInvariantTime(max);

            var that = this,
                msMin = getMilliseconds(min),
                msMax = getMilliseconds(max),
                minorTickCount = that.options.minorTickCount,
                msMajorInterval = that.options.majorTick * MS_PER_MINUTE,
                msInterval = msMajorInterval / minorTickCount || 1,
                start = new Date(+min),
                startDay = start.getDate(),
                msStart,
                idx = 0, length,
                html = "";

            length = MS_PER_DAY / msInterval;

            if (msMin != msMax) {
                if (msMin > msMax) {
                    msMax += MS_PER_DAY;
                }

                length = ((msMax - msMin) / msInterval);
            }

            length = Math.round(length);

            for (; idx < length; idx++) {
                var majorTickDivider = idx % (msMajorInterval/msInterval),
                    isMajorTickRow = majorTickDivider === 0,
                    isMiddleRow = majorTickDivider < minorTickCount - 1,
                    isLastSlotRow = majorTickDivider === minorTickCount - 1;

                html += action(start, isMajorTickRow, isMiddleRow, isLastSlotRow);

                setTime(start, msInterval, false);
            }

            if (msMax) {
                msStart = getMilliseconds(start);
                if (startDay < start.getDate()) {
                    msStart += MS_PER_DAY;
                }

                if (msStart > msMax) {
                    start = new Date(+max);
                }
            }

            if (after) {
                html += after(start);
            }

            return html;
        },

        _content: function(dates) {
            var that = this;
            var options = that.options;
            var start = that.startTime();
            var end = this.endTime();
            var groupsCount = 1;
            var rowCount = 1;
            var columnCount = dates.length;
            var html = '';
            var resources = this.groupedResources;
            var allDayVerticalGroupRow = "";

            if (resources.length) {
                if (that._groupOrientation() === "vertical") {
                    rowCount = this._rowCountForLevel(this.rowLevels.length - 2);
                    if (options.allDaySlot) {
                        allDayVerticalGroupRow = '<tr class="k-scheduler-header-all-day">' + new Array(dates.length + 1).join("<td>&nbsp;</td>") + '</tr>';
                    }
                } else {
                    groupsCount = this._columnCountForLevel(this.columnLevels.length - 2);
                }
            }

            html += '<tbody>';

            var appendRow = function(date, majorTick) {
                var content = "",
                    idx,
                    length;

                content = '<tr' + (majorTick ? ' class="k-middle-row"' : "") + '>';

                for (var groupIdx = 0; groupIdx < groupsCount; groupIdx++) {
                    for (idx = 0, length = columnCount; idx < length; idx++) {
                        content += "<td" + (kendo.date.isToday(dates[idx]) ? ' class="k-today"' : "") + ">";
                        content += "&nbsp;</td>";
                    }
                }

                content += "</tr>";

                return content;
            };

            for (var rowIdx = 0; rowIdx < rowCount; rowIdx++) {
                html += allDayVerticalGroupRow;

                html += this._forTimeRange(start, end, appendRow);
            }

            html += '</tbody>';

            this.content.find("table").append(html);
        },

        _render: function(dates) {
            var that = this;

            dates = dates || [];

            this._dates = dates;

            this._startDate = dates[0];

            this._endDate = dates[(dates.length - 1) || 0];

            this.createLayout(this._layout(dates));

            this._content(dates);

            this._footer();

            this.refreshLayout();

            var allDayHeader = this.element.find(".k-scheduler-header-all-day td");

            if (allDayHeader.length) {
                this._allDayHeaderHeight = allDayHeader.first()[0].clientHeight;
            }

            that.datesHeader.on("click" + NS, ".k-nav-day", function(e) {
                var th = $(e.currentTarget).closest("th");

                var offset = th.offset();

                var slot = that._slotByPosition(offset.left, offset.top + th.outerHeight());

                that.trigger("navigate", { view: "day", date: slot.startDate() });
            });
        },

        startTime: function() {
            var options = this.options;
            return options.workDay ? options.workDayStart : options.startTime;
        },

        endTime: function() {
            var options = this.options;
            return options.workDay ? options.workDayEnd : options.endTime;
        },

        startDate: function() {
            return this._startDate;
        },

        endDate: function() {
            return this._endDate;
        },

        _end: function(isAllDay) {
            var time = getMilliseconds(this.endTime()) || MS_PER_DAY;

            if (isAllDay) {
                time = 0;
            }

            return new Date(this._endDate.getTime() + time);
        },

        nextDate: function() {
            return kendo.date.nextDay(this.endDate());
        },

        previousDate: function() {
            return kendo.date.previousDay(this.startDate());
        },

        calculateDateRange: function() {
            this._render([this.options.date]);
        },

        destroy: function() {
            var that = this;

            if (that.datesHeader) {
                that.datesHeader.off(NS);
            }

            if (that.element) {
                that.element.off(NS);
            }

            SchedulerView.fn.destroy.call(this);

            if (that.footer) {
                that.footer.remove();
            }

            if (kendo.support.mobileOS) {
                that._closeUserEvents.destroy();

                if (that.options.editable.create !== false) {
                    that._addUserEvents.destroy();
                    that._allDayUserEvents.destroy();
                }

                if (that.options.editable.update !== false) {
                    that._editUserEvents.destroy();
                }
            }
        },

        selectionByElement: function(cell) {
            var offset = cell.offset();
            return this._slotByPosition(offset.left, offset.top);
        },

        _timeSlotInterval: function() {
            var options = this.options;
            return (options.majorTick/options.minorTickCount) * MS_PER_MINUTE;
        },

        _columnCountInGroup: function() {
            var resources = this.groupedResources;

            if (!resources.length) {
                return 0;
            }

            return this._columnOffsetForResource(resources.length);
        },

        _rowCountInGroup: function() {
            var resources = this.groupedResources;

            if (!resources.length) {
                return 0;
            }

            var allDaySlotOffset = this.options.allDaySlot ? this._rowCountForLevel(resources.length - 1) : 0;

            return (this._rowCountForLevel(resources.length) - allDaySlotOffset) / this._rowCountForLevel(resources.length - 1);
        },

        _timeSlotIndex: function(date) {
            var options = this.options;
            var eventStartTime = getMilliseconds(date);
            var startTime = getMilliseconds(this.startTime());
            var timeSlotInterval = ((options.majorTick/options.minorTickCount) * MS_PER_MINUTE);

            return (eventStartTime - startTime) / (timeSlotInterval);
        },

        _collectionIndex: function(date, multiday) {
            if (multiday) {
                return 0;
            }

            return this._dateSlotIndex(date, true);
        },

        _slotIndex: function(date, multiday) {
            if (multiday) {
                return this._dateSlotIndex(date);
            }

            return this._timeSlotIndex(date);
        },

        _dateIndex: function(date) {
            var idx;
            var length;
            var slots = this._dates || [];
            var slotStart;
            var slotEnd;

            for (idx = 0, length = slots.length; idx < length; idx++) {
                slotStart = kendo.date.getDate(slots[idx]);
                slotEnd = new Date(kendo.date.getDate(slots[idx]).getTime() + MS_PER_DAY -  1);

                if (isInDateRange(date, slotStart, slotEnd)) {
                    return idx;
                }
            }
            return -1;
        },

        _dateSlotIndex: function(date, overlaps) {
            var idx;
            var length;
            var slots = this._dates || [];
            var slotStart;
            var slotEnd;
            var offset = 1;

            for (idx = 0, length = slots.length; idx < length; idx++) {
                slotStart = kendo.date.getDate(slots[idx]);
                slotEnd = new Date(kendo.date.getDate(slots[idx]).getTime() + MS_PER_DAY - (overlaps ? 0 : 1));

                if (isInDateRange(date, slotStart, slotEnd)) {
                    return idx * offset;
                }
            }
            return -1;
        },

        _positionAllDayEvent: function(element, slotRange) {
            var slotWidth = slotRange.innerWidth();
            var startIndex = slotRange.start.index;
            var endIndex = slotRange.end.index;

            var allDayEvents = SchedulerView.collidingEvents(slotRange.events(), startIndex, endIndex);

            var currentColumnCount = this._headerColumnCount || 0;

            var leftOffset = 2;

            var rightOffset = startIndex !== endIndex ? 5 : 4;

            var eventHeight = this._allDayHeaderHeight;

            var start = slotRange.startSlot();

            element
                .css({
                    left: this._scrollbarOffset(start.offsetLeft + leftOffset, true),
                    width: slotWidth - rightOffset
                });

            slotRange.addEvent({ start: startIndex, end: endIndex, element: element });

            allDayEvents.push({ start: startIndex, end: endIndex, element: element });

            var rows = SchedulerView.createRows(allDayEvents);

            if (rows.length && rows.length > currentColumnCount) {
                this._updateAllDayHeaderHeight(eventHeight * rows.length + eventHeight);
                this._headerColumnCount = rows.length;
            }

            var top = slotRange.start.offsetTop;

            for (var idx = 0, length = rows.length; idx < length; idx++) {
                var rowEvents = rows[idx].events;

                for (var j = 0, eventLength = rowEvents.length; j < eventLength; j++) {
                    $(rowEvents[j].element).css({
                        top: top + idx * eventHeight
                    });
                }
            }
        },

        _arrangeColumns: function(element, slotRange) {
            var startIndex = slotRange.start.index;
            var endIndex = slotRange.end.index;

            element = { element: element, start: startIndex, end: endIndex };

            var columns,
                slotWidth = slotRange.start.clientWidth,
                eventRightOffset = slotWidth * 0.10,
                columnEvents,
                eventElements =  slotRange.events(),
                slotEvents = SchedulerView.collidingEvents(eventElements, element.start, element.end);

            slotRange.addEvent(element);

            slotEvents.push(element);

            columns = SchedulerView.createColumns(slotEvents);

            var columnWidth = (slotWidth - eventRightOffset) / columns.length;

            for (var idx = 0, length = columns.length; idx < length; idx++) {
                columnEvents = columns[idx].events;

                for (var j = 0, eventLength = columnEvents.length; j < eventLength; j++) {
                    columnEvents[j].element[0].style.width = columnWidth - 4 + "px";
                    columnEvents[j].element[0].style.left = (this._isRtl ? this._scrollbarOffset(eventRightOffset) : 0) + slotRange.start.offsetLeft + idx * columnWidth + 2 + "px";
                }
            }
        },

        _positionEvent: function(event, element, slotRange) {
            var bottomOffset = 4;

            element.css({
                height: slotRange.innerHeight() - bottomOffset,
                top: slotRange.start.offsetTop
            });

            this._arrangeColumns(element, slotRange);
       },

       _eventTmpl: function(template, wrapper) {
           var options = this.options,
               settings = extend({}, kendo.Template, options.templateSettings),
               paramName = settings.paramName,
               html = "",
               type = typeof template,
               state = { storage: {}, count: 0 };

            if (type === "function") {
                state.storage["tmpl" + state.count] = template;
                html += "#=this.tmpl" + state.count + "(" + paramName + ")#";
                state.count ++;
            } else if (type === "string") {
                html += template;
            }

            var tmpl = kendo.template(kendo.format(wrapper, html), settings);

            if (state.count > 0) {
                tmpl = proxy(tmpl, state.storage);
            }

            return tmpl;
       },

       _createEventElement: function(event, isOneDayEvent, head, tail) {
            var template = isOneDayEvent ? this.eventTemplate : this.allDayEventTemplate;
            var options = this.options;
            var editable = options.editable;
            var showDelete = editable && editable.destroy !== false;
            var resizable = editable && editable.resize !== false;
            var startDate = getDate(this.startDate());
            var endDate = getDate(this.endDate());
            var startTime = getMilliseconds(this.startTime());
            var endTime = getMilliseconds(this.endTime());
            var eventStartTime = getMilliseconds(event.startTime || event.start);
            var eventEndTime = getMilliseconds(event.endTime || event.end);
            var middle;

            if (startTime >= endTime) {
                endTime = getMilliseconds(new Date(this.endTime().getTime() + MS_PER_DAY - 1));
            }

            if (!isOneDayEvent && !event.isAllDay) {
                endDate = new Date(endDate.getTime() + MS_PER_DAY);
            }

            var eventEndDate = event.end;

            if (event.isAllDay) {
                eventEndDate = getDate(event.end);
            }

            if ((!isInDateRange(getDate(event.start), startDate, endDate) &&
                !isInDateRange(eventEndDate, startDate, endDate)) ||
                (isOneDayEvent && eventStartTime < startTime && eventEndTime > endTime)) {

                middle = true;
            } else if (getDate(event.start) < startDate || (isOneDayEvent && eventStartTime < startTime)) {
                tail = true;
            } else if ((eventEndDate > endDate && !isOneDayEvent) || (isOneDayEvent && eventEndTime > endTime)) {
                head = true;
            }

            var resources = this.eventResources(event);

            return $(template(extend({}, {
                ns: kendo.ns,
                resizable: resizable,
                showDelete: showDelete,
                middle: middle,
                head: head,
                tail: tail,
                singleDay: this._dates.length == 1,
                resources: resources,
                inverseColor: resources && resources[0] ? this._shouldInverseResourceColor(resources[0]) : false
            }, event, {
                start: event.startTime || event.start,
                end: event.endTime || event.end
            })));
        },

        _isInTimeSlot: function(event) {
            var slotStartTime = this.startTime(),
                slotEndTime = this.endTime(),
                startTime = event.startTime || event.start,
                endTime = event.endTime || event.end;

            if (getMilliseconds(slotEndTime) === getMilliseconds(kendo.date.getDate(slotEndTime))) {
                slotEndTime = kendo.date.getDate(slotEndTime);
                setTime(slotEndTime, MS_PER_DAY - 1);
            }

            if (kendo.date.getDate(endTime) > kendo.date.getDate(startTime)) {
               endTime = kendo.date.getDate(endTime);
               setTime(endTime, MS_PER_DAY - 1);
            }

            endTime = getMilliseconds(endTime);
            startTime = getMilliseconds(startTime);
            slotEndTime = getMilliseconds(slotEndTime);
            slotStartTime = getMilliseconds(slotStartTime);

            if(slotStartTime === startTime && startTime === endTime) {
                return true;
            }

            var overlaps = true;

            return isInTimeRange(startTime, slotStartTime, slotEndTime, overlaps) ||
                isInTimeRange(endTime, slotStartTime, slotEndTime, overlaps) ||
                isInTimeRange(slotStartTime, startTime, endTime) ||
                isInTimeRange(slotEndTime, startTime, endTime);
        },

        _isInDateSlot: function(event) {
            var slotStart = this.startDate();
            var slotEnd = new Date(this.endDate().getTime() + MS_PER_DAY - 1);

            return (isInDateRange(event.start, slotStart, slotEnd) ||
                isInDateRange(event.end, slotStart, slotEnd) ||
                isInDateRange(slotStart, event.start, event.end) ||
                isInDateRange(slotEnd, event.start, event.end)) &&
                (!isInDateRange(event.end, slotStart, slotStart) || isInDateRange(event.end, event.start, event.start) || event.isAllDay );
        },

        _updateAllDayHeaderHeight: function(height) {
            var allDaySlots = this.element.find(".k-scheduler-header-all-day td");

            if (allDaySlots.length) {
                allDaySlots.parent()
                    .add(this.element.find(".k-scheduler-times-all-day").parent())
                    .height(height);

                for (var groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                    this.groups[groupIndex].refresh();
                }
            }
        },

        _renderEvents: function(events, groupIndex) {
            var allDayEventContainer = this.datesHeader.find(".k-scheduler-header-wrap > div");
            var event;

            var idx;
            var length;

            for (idx = 0, length = events.length; idx < length; idx++) {
                event = events[idx];

                if (this._isInDateSlot(event)) {

                    var isMultiDayEvent = event.isAllDay || event.end.getTime() - event.start.getTime() >= MS_PER_DAY;
                    var container = isMultiDayEvent && !this._isVerticallyGrouped() ? allDayEventContainer : this.content;
                    var element;
                    var ranges;
                    var group;

                    if (!isMultiDayEvent) {

                        if (this._isInTimeSlot(event)) {
                            group = this.groups[groupIndex];

                            if (!group._continuousEvents) {
                                group._continuousEvents = [];
                            }

                            ranges = group.slotRanges(event);

                            var rangeCount = ranges.length;

                            for (var rangeIndex = 0; rangeIndex < rangeCount; rangeIndex++) {
                                var range = ranges[rangeIndex];
                                var start = event.start;
                                var end = event.end;

                                if (rangeCount > 1) {
                                    if (rangeIndex === 0) {
                                        end = range.end.endDate();
                                    } else if (rangeIndex == rangeCount - 1) {
                                        start = range.start.startDate();
                                    } else {
                                        start = range.start.startDate();
                                        end = range.end.endDate();
                                    }
                                }

                                var occurrence = event.clone({ start: start, end: end });

                                if (this._isInTimeSlot(occurrence)) {
                                    var head = range.head;

                                    element = this._createEventElement(event, !isMultiDayEvent, head, range.tail);

                                    this._positionEvent(occurrence, element, range);

                                    addContinuousEvent(group, range, element, false);

                                    element.appendTo(container);
                                }
                            }
                        }

                   } else if (this.options.allDaySlot) {
                       group = this.groups[groupIndex];

                       if (!group._continuousEvents) {
                           group._continuousEvents = [];
                       }

                       ranges = group.slotRanges(event);

                       element = this._createEventElement(event, !isMultiDayEvent);

                       this._positionAllDayEvent(element, ranges[0]);

                       addContinuousEvent(group, ranges[0], element, true);

                       element.appendTo(container);
                    }
                }
            }
        },

        render: function(events) {
            this._headerColumnCount = 0;

            this._groups();

            this.element.find(".k-event").remove();

            this._updateAllDayHeaderHeight(this._allDayHeaderHeight);

            events = new kendo.data.Query(events)
                .sort([{ field: "start", dir: "asc" },{ field: "end", dir: "desc" }])
                .toArray();

            var resources = this.groupedResources;

            if (resources.length) {
                this._renderGroups(events, resources, 0);
            } else {
                this._renderEvents(events, 0, 0);
            }

            this.refreshLayout();
            this.trigger("activate");
        },

        _renderGroups: function(events, resources, offset) {
            var resource = resources[0];

            if (resource) {
                var view = resource.dataSource.view();

                for (var itemIdx = 0; itemIdx < view.length; itemIdx++) {
                    var value = this._resourceValue(resource, view[itemIdx]);

                    var eventsFilteredByResource = new kendo.data.Query(events).filter({ field: resource.field, operator: SchedulerView.groupEqFilter(value) }).toArray();

                    if (resources.length > 1) {
                        offset = this._renderGroups(eventsFilteredByResource, resources.slice(1), offset++);
                    } else {
                        this._renderEvents(eventsFilteredByResource, offset++);
                    }
                }
            }
            return offset;
        },

        _columnOffsetForResource: function(index) {
            return this._columnCountForLevel(index) / this._columnCountForLevel(index - 1);
        },

        _columnCountForLevel: function(level) {
            var columnLevel = this.columnLevels[level];
            return columnLevel ? columnLevel.length : 0;
        },

        _rowCountForLevel: function(level) {
            var rowLevel = this.rowLevels[level];
            return rowLevel ? rowLevel.length : 0;
        },

        clearSelection: function() {

            this.content.add(this.datesHeader)
                .find(".k-state-selected")
                .removeAttr("id")
                .attr("aria-selected", false)
                .removeClass("k-state-selected");
        },

        _updateDirection: function(selection, ranges, multiple, reverse, vertical) {
            var isDaySlot = selection.isAllDay;
            var startSlot = ranges[0].start;
            var endSlot = ranges[ranges.length - 1].end;

            if (multiple) {
                if (vertical) {
                    if (!isDaySlot &&
                        startSlot.index === endSlot.index &&
                        startSlot.collectionIndex === endSlot.collectionIndex) {
                            selection.backward = reverse;
                    }
                } else {
                    if ((isDaySlot && startSlot.index === endSlot.index) ||
                        (!isDaySlot && startSlot.collectionIndex === endSlot.collectionIndex)) {
                            selection.backward = reverse;
                    }
                }
            }
        },

        _changeViewPeriod: function(selection, reverse, vertical) {
            if (!vertical) {
                var date = reverse ? this.previousDate() : this.nextDate();
                var start = selection.start;
                var end = selection.end;

                selection.start = new Date(date);
                selection.end = new Date(date);

                var endMilliseconds = selection.isAllDay ? MS_PER_DAY : getMilliseconds(end);

                setTime(selection.start, getMilliseconds(start));
                setTime(selection.end, endMilliseconds);

                if (!this._isVerticallyGrouped()) {
                    selection.groupIndex = reverse ? this.groups.length - 1 : 0;
                }

                selection.events = [];

                return true;
            }
        }
    });

   extend(true, ui, {
       MultiDayView: MultiDayView,
       DayView: MultiDayView.extend({
           options: {
               title: "Day"
           },
           name: "day"
       }),
       WeekView: MultiDayView.extend({
           options: {
               title: "Week",
               selectedDateFormat: "{0:D} - {1:D}"
           },
           name: "week",
           calculateDateRange: function() {
               var selectedDate = this.options.date,
                   start = kendo.date.dayOfWeek(selectedDate, this.calendarInfo().firstDay, -1),
                   idx, length,
                   dates = [];

               for (idx = 0, length = 7; idx < length; idx++) {
                   dates.push(start);
                   start = kendo.date.nextDay(start);
               }
               this._render(dates);
           }
       })
    });
})(window.kendo.jQuery);
