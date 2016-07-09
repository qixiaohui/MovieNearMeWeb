var util = {
    compareDate: (date1, date2) => {
        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        };

        // adjust diff for for daylight savings
        var hoursToAdjust = Math.abs(date1.getTimezoneOffset() /60) - Math.abs(date2.getTimezoneOffset() /60);
        // apply the tz offset
        date2.addHours(hoursToAdjust);

        // The number of milliseconds in one day
        var ONE_DAY = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date1_ms - date2_ms;

        // Convert back to days and return
        return Math.round(difference_ms/ONE_DAY);

    }
};

module.exports = util;