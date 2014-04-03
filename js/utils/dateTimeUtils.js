/* Utilities to be used with require js */
define('utils/dateTimeUtils', ['moment'], function (moment)  {
    var dateTimeUTC = function(dateString, format){
        var utcDateTime = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').utc();
        return utcDateTime
    }

    return {
        dateTimeUTC: dateTimeUTC
    };


});