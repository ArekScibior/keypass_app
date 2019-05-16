'use strict';
var getTarget = function(event){
  if (typeof event.target != 'undefined'){
    return event.target;
  } else {
    return event.srcElement;
  }
};

var CONSTANTS ={};

CONSTANTS.getActivityName = function (type){
  if (!type) return '';
  var activity = _.find(CONSTANTS.activities,function (el){return el.TYPE === type;});
  if (activity) return activity.nazwa;
  return type;
};
CONSTANTS.actionsToSave =['DEL','INS','MOD'];

CONSTANTS.emptyPlanCodes = ['X5','XŚ','XW','XN'];

CONSTANTS.activities = [{
        'nazwa': 'Godziny planowane',
        'TYPE': 'PLAN',
        'drag': 'X'
      }, {
        'nazwa': 'Nieobecność',
        'TYPE': 'ABSENCE',
        'drag': 'X'
      }, {
        'nazwa': 'Nadgodziny',
        'TYPE': 'OVERTIME',
        'drag': 'X'
      }, {
        'nazwa': 'Obecności',
        'TYPE': 'ATT',
        'drag': 'X'
}];


var removeTile = function(event) {
  var tile = getTarget(event).parentElement.parentElement;
  var day = tile.parentElement;
  day.removeChild(tile);
};

var clearWorker = function(event) {
  $(getTarget(event)).closest('tbody').find('.resizable').remove();
};

var clearSubunit = function(event) {
  $(getTarget(event)).closest('.pj').find('.resizable').remove();
};

var clearAll = function(event) {
  $('#tabele').find('.resizable').remove();
  $('#tabele-alt').find('.resizable').remove();
};

var dateToSAP = function(d) {
  var date = new Date(d);
  var year = date.getFullYear().toString();
  var month = (date.getMonth()+1).toString();
  month = month.length < 2 ? '0'+month : month;
  var day = date.getDate().toString();
  day = day.length < 2 ? '0'+day : day;

  return year + '-' + month + '-' + day;
};

var isDataEdited = function (table) {
  var isEdited = false;
  angular.forEach(table,function (entry){
    if (entry.ACTIO && entry.ACTIO != "") isEdited = true;
  });
  //console.log('table',table,isEdited);
  return isEdited;
}

var getEmptyObjects = function (data){
  var errors =[];
  angular.forEach(data, function (elem){
    if (elem.ACTIO && elem.ACTIO == "INS"){
        if (!elem.SUBTY || elem.SUBTY == "") errors.push(elem);
    }
  })
   //console.log('errors: ',errors);
  return errors;
}


CONSTANTS.checkIsReallyEdited = function (empl){
//  console.log("empl",empl);
  var isEdited = false;
  if (isDataEdited(empl.ATT) || isDataEdited(empl.OVT) || isDataEdited(empl.ABS) ||isDataEdited(empl.DWS)) isEdited = true;
  return isEdited;
}


var checkIsClose = function (name){
  //console.log('checkIsClose');
  if (checkStorage(name)) {
//    console.log('closing..');
    setTimeout(function(){window.top.close(); var ww = window.open(window.location, '_self'); ww.close(); }, 1000);
  }
}


var checkStorage = function(name){
  if (name == undefined || name == null) name = "zcp.mode";
  if (typeof(Storage) != undefined){
    var value = localStorage.getItem(name);
//    console.log('storage value: ',value);
    if (value =="close") return true;
    else return false;

  }
  return false;
};

  var isCrossDate = function(plan){
    if (plan.BEGUZ && plan.ENDUZ){
      var beg = SAPtoTime(plan.BEGUZ);
      var end = SAPtoTime(plan.ENDUZ);
      return beg >end;
    }
    return false;
  };



var SAPtoDate = function(SAPdate){
  var date = SAPdate.split('-');
  date = date.map(function(a){return parseInt(a)});
  return new Date(date[0], date[1]-1, date[2]);
};

var SAPtoQuarters = function(SAPhour){
  var time = SAPhour.split(':');
  time = time.map(function (a) {
    return parseInt(a);
  });
  return time[0]*4 + time[1]/15;
};

var timeToSAP = function(time, stripSeconds){
  var minutes = time.getMinutes().toString();
  var hours = time.getHours().toString();
  if(minutes.length < 2){
    minutes = '0'+minutes;
  }
  if(hours.length < 2){
    hours = '0'+hours;
  }
  return hours + ':' + minutes + (stripSeconds ? '' : ':00');
};

var SAPtoTime = function (SAPTime) {
  var date = new Date();
  var timeArr = SAPTime.split(':');
  date.setHours(Number(timeArr[0]));
  date.setMinutes(Number(timeArr[1]));
  date.setSeconds(Number(timeArr[2]));
  return date;
};

var SAPDateTimeToDate = function (SAPDate, SAPTime) {
  var date = SAPtoDate(SAPDate);
  var time = SAPTime.split(':').map(Number);
  date.setHours(time[0]);
  date.setMinutes(time[1]);
  date.setSeconds(time[2]);
  return date;
};

var checkTime = function(timeString) {
  var errorMsg = "";
  var re =/^([0-1]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
  var regs;
  if(timeString != '' && timeString != undefined) {
    var isValid = re.test(timeString);
    if (!isValid) errorMsg = timeString;
  };
  return errorMsg;
};

var convertTime = function (timeString){
  if(timeString != '' && timeString != undefined){
    if (timeString.indexOf(':')>0) return timeString;
    switch (timeString.length){
      case 1: timeString ='0' + timeString +':00';break;
      case 2: timeString = timeString +":00"; break; //HH
      case 3: timeString  = '0'+ timeString.slice(0,1) + ':' + timeString.slice(1,3); break;//HMM;
      case 4: timeString = timeString.slice(0,2) + ':' + timeString.slice(2,4); break;
      default: break;
    }
    return timeString;
  }
};


var isBlank = function (str) {
  return (!str || /^\s*$/.test(str));
};


var quartersToSAP = function(quarter){
  if(quarter < 0){
    quarter = 96 + quarter;
  }
  var hour = (parseInt(parseInt(quarter) / 4) % 24).toString();
  var minute = ((parseInt(quarter) % 4) * 15).toString();
  if(hour.length < 2){
    hour = '0'+hour;
  }
  if(minute.length < 2){
    minute = '0'+minute;
  }
  return hour+':'+minute+':00';
};

var addDayToSAPdate = function(SAPdate, days){
  var date = SAPtoDate(SAPdate);
  return (dateToSAP(date.setDate(date.getDate()+days)));
};

var incrementSAPdate = function(SAPdate){
  return addDayToSAPdate(SAPdate, 1);
};

var decrementSAPdate = function(SAPdate){
  return addDayToSAPdate(SAPdate, -1);
};


var compareDateAndHour = function (SAPdateFirst, SAPhourFirst, SAPdateSecond, SAPhourSecond){
  var d1 = SAPtoDate(SAPdateFirst).getTime();
  var d2 = SAPtoDate(SAPdateSecond).getTime();
  if(d1<d2){
    return -1;
  }
  if(d1>d2){
    return 1;
  }
  var h1 = SAPtoQuarters(SAPhourFirst);
  var h2 = SAPtoQuarters(SAPhourSecond);
  if(h1<h2){
    return -1;
  }
  if(h1>h2){
    return 1;
  }
  return 0;
};

var daysInMonth = function(month,year) {
  return new Date(year, month, 0).getDate();
};

var stringToTable = function (string) {
  if (!string) return [];
  return String(string).match(/(.|[\r\n]){1,78}/g);
};

var tableToString = function (table) {
  return table.join('');
};

var cutSAPTimeSeconds = function (SAPTime) {
  var arr = SAPTime.split(':');
  arr.pop();
  return arr.join(':');
};

var SAPDateMonthBegin = function (SAPDate) {
  var date = SAPtoDate(SAPDate);
  date.setDate(1);
  return dateToSAP(date);
};

var SAPDateMonthEnd = function (SAPDate) {
  var date = SAPtoDate(SAPDate);
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return dateToSAP(date);
};

var dateMonthBegin = function (date) {
  var begin = new Date(date);
  begin.setDate(1);
  begin.setHours(0);
  begin.setMinutes(0);
  begin.setSeconds(0);
  begin.setMilliseconds(0);
  return begin;
};

var dateMonthEnd = function (date) {
  var end = new Date(date);
  end.setDate(1);
  end.setMonth(end.getMonth() + 1);
  end.setHours(23);
  end.setMinutes(59);
  end.setSeconds(59);
  end.setMilliseconds(999);
  end.setDate(0);
  return end;
};

var getMonthFromSAPDate = function (SAPDate) {
  return SAPDate.split('-')[1];
};

var isValidSAPDate = function (SAPDate) {
  var arr = _.map(SAPDate.split('-'), Number);
  return !_.isNaN(new Date(arr[0], arr[1], arr[2]).getTime());
};

var isSAPDateBetweenDates = function (SAPDate, from, to) {
  if (!isValidSAPDate(SAPDate) || !isValidSAPDate(from) || !isValidSAPDate(to)) return false;
  return SAPDate >= from && SAPDate <= to;
};

var dateToPeriod = function (date) {
  var arr = dateToSAP(date).split('-');
  arr.pop();
  return arr.join('');
};
