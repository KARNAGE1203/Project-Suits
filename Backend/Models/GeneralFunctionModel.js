const dateformat = require('dateformat');


class GeneralFunction {

    // constructor () {

    // }

    ifEmpty (columns) {
        let checker = [];
        if (columns.length > 0) {
            columns.forEach(item => {
                if (item === '' || item === undefined || item === null  || item.length < 1  || item.length === 0) {
                    checker.push('empty');
                }
            });
        } 

        return checker;
    }

    checkEmpty (fieldName) {
        if (fieldName === '' || fieldName === ' ' || fieldName === undefined || fieldName === null  || fieldName.length < 1  || fieldName.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    getFullYear() {
        let date = new Date();
        return date.getFullYear();
    }

    getTimeStamp () {
        let timestamp = Date.now();
        timestamp = timestamp.toString().substr((timestamp.length - 8), 8);
        return Number(this.shuffle(timestamp));
    }

    toUcwords (value) {
        if (value === "" || value === null || value === undefined) {
            return '';
        } else {
            return value.replace(/\w+/g, function(a){
                return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
            });
        }
    }

    shuffle (value) {
        let a = value.toString().split(""), n = a.length;
        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }

    sumArray (value) {
        return value.reduce(function(a,b){
            return a + b;
        }, 0);
    }

    fullDate (value) {
        let inputDate = value;
        if (inputDate == "" || inputDate == null || inputDate == undefined) {
            return '';
        } else {
            let date = new Date(inputDate);
            return date.toDateString();
        }
    }

    fullDateDB (value) {
        let inputDate = value;
        if (inputDate == "" || inputDate == null || inputDate == undefined) {
            return '';
        } else {
            let date = new Date(inputDate);
            let dd = date.getDate();
            dd = dd < 10 ? '0'+dd : dd
            let mm = date.getMonth()+1;
            mm = mm < 10 ? '0'+mm : mm
            let yyyy = date.getFullYear();
            return yyyy+'-'+mm+'-'+dd;
        }
    }

    fullDateDBNow () {
        let date = new Date()
        let dd = date.getDate();
        dd = dd < 10 ? '0'+dd : dd
        let mm = date.getMonth()+1;
        mm = mm < 10 ? '0'+mm : mm
        let yyyy = date.getFullYear();
        return yyyy+'-'+mm+'-'+dd;
    }

    fullDateTime (value) {
        let inputDate = value;
        if (inputDate === "" || inputDate === null || inputDate === undefined) {
            return '';
        } else {
            let date = new Date(inputDate);
            let hh = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            return date.toDateString()+' '+hh+':'+min+':'+sec;
        }
    }

    fullTime (value) {
        let inputDate = value;
        if (inputDate === "" || inputDate === null || inputDate === undefined) {
            return '';
        } else {
            let date = new Date(inputDate);
            return date.toLocaleTimeString();
        }
    }

    dbDateFormat (value) {
        let inputDate = value;
        if (inputDate === "" || inputDate === null || inputDate === undefined) {
            return '';
        } else {
            let date = new Date(inputDate);
            let dd = date.getDate();
            dd = dd < 10 ? '0'+dd : dd
            let mm = date.getMonth()+1;
            mm = mm < 10 ? '0'+mm : mm
            let yyyy = date.getFullYear();
            let hh = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            return yyyy+'-'+mm+'-'+dd+' '+hh+':'+min+':'+sec;
        }
    }

    getCurrentWeekRange () {
        let curr = new Date 
        let week = []
        
        for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            week.push(day)
        }
        return [week[0], week[6]];
    }

    getDateTime () {
        let date = new Date();
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        let todayDate = new Date(date);
        todayDate = dateformat(todayDate, 'yyyy-mm-dd HH:MM:ss');
        return todayDate;
    }

    getTimeNow () {
        let date = new Date();
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        let timeNow = new Date(date);
        timeNow = dateformat(timeNow, 'HH:MM:ss');
        return timeNow;
    }

    getDate () {
        let date = new Date();
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        let todayDate = new Date(date);
        todayDate = dateformat(todayDate, 'yyyy-mm-dd');
        return todayDate;
    }

    getDateParam (param) {
        let date = new Date(param);
        date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        let todayDate = new Date(date);
        todayDate = dateformat(todayDate, 'yyyy-mm-dd');
        return todayDate;
    }

    getMonth (){
        let date = new Date();
        let mm = date.getMonth()+1; 
        let yyyy = date.getFullYear();
        return yyyy + '-' + (mm < 10 ? '0'+mm : mm);
    }

    formatNumber (num) {
        return num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    getMonthString(month) {
        if (month.toString() == '01') {
            return 'January';
        } else if (month.toString() == '02') {
            return 'February';
        } else if (month.toString() == '03') {
            return 'March';
        } else if (month.toString() == '04') {
            return 'April';
        } else if (month.toString() == '05') {
            return 'May';
        } else if (month.toString() == '06') {
            return 'June';
        } else if (month.toString() == '07') {
            return 'July';
        } else if (month.toString() == '08') {
            return 'August';
        } else if (month.toString() == '09') {
            return 'September';
        } else if (month.toString() == '10') {
            return 'October';
        } else if (month.toString() == '11') {
            return 'November';
        } else {
            return 'December';
        }
    }
}


module.exports = GeneralFunction;
