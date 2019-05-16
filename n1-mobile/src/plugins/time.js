
/**
 * 获取上周、本周、上月、本月、上季度、本季度的开始日期、结束日期 start
 * 获取上月开始结束日期考虑了年份的变化
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay() - 1; //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += nowYear < 2000 ? 1900 : 0; //
var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
//获得某月的天数
function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
//获得本季度的开始月份
function getQuarterStartMonth() {
  var quarterStartMonth = 0;
  if (nowMonth < 3) {
    quarterStartMonth = 0;
  }
  if (2 < nowMonth && nowMonth < 6) {
    quarterStartMonth = 3;
  }
  if (5 < nowMonth && nowMonth < 9) {
    quarterStartMonth = 6;
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}
//获得本周的开始日期
function getWeekStartDate() {
  return new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
}
//获得本周的结束日期
function getWeekEndDate() {
  return new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
}
//获得上周的开始日期
function getLastWeekStartDate() {
  return new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
}
//获得上周的结束日期
function getLastWeekEndDate() {
  return new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
}
//获得本月的开始日期
function getMonthStartDate() {
  return new Date(nowYear, nowMonth, 1);
}
//获得本月的结束日期
function getMonthEndDate() {
  return new Date(nowYear, nowMonth, getMonthDays(nowMonth));
}
//获得上月开始时间
function getLastMonthStartDate() {
  if (lastMonth == 11) {
    var lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
  } else {
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  }
  return lastMonthStartDate;
}
//获得上月结束时间
function getLastMonthEndDate() {
  if (lastMonth == 11) {
    var lastMonthEndDate = new Date(
      nowYear - 1,
      lastMonth,
      getMonthDays(lastMonth)
    );
  } else {
    var lastMonthEndDate = new Date(
      nowYear,
      lastMonth,
      getMonthDays(lastMonth)
    );
  }
  return lastMonthEndDate;
}
//获得本季度的开始日期
function getQuarterStartDate() {
  return new Date(nowYear, getQuarterStartMonth(), 1);
}
//或的本季度的结束日期
function getQuarterEndDate() {
  var quarterEndMonth = getQuarterStartMonth() + 2;
  return new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
}
/**
 * 获取时间 end
 */

 export default {
    getMonthDays,
    getQuarterStartMonth,
    getWeekStartDate,
    getWeekEndDate,
    getLastWeekStartDate,
    getLastWeekEndDate,
    getMonthStartDate,
    getMonthEndDate,
    getLastMonthStartDate,
    getLastMonthEndDate,
    getQuarterStartDate,
    getQuarterEndDate
 }