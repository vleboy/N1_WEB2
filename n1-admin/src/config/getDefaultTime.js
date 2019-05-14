export const getDefaultTime = function (current) {
  let nowDate = new Date()
  let nowDay = nowDate.getDay() || 7
  let startTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1 - nowDay)
  let endTime = new Date().getTime()

  startTime = startTime.setHours(0, 0, 0, 0)
  endTime = current ? endTime : endTime - 180000

  startTime - endTime > 0 ? startTime = new Date().setHours(0, 0, 0, 0) : ''
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  return [startTime, endTime]
}
export const getDefaultDay = function (current) {
  
  return [startTime, endTime]
}
export const formatMoney = function (number, places, symbol) {
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "￥";
  let negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + "," : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ",") + (places ? "." + Math.abs(number - i).toFixed(places).slice(2) : "");
}

export const passwordLevel = function (password) {
  let Modes = 0;
  let len = password.length;
  if (len < 6 || len > 16) {
    return 0
  }
  for (let i = 0; i < password.length; i++) {
    Modes |= CharMode(password.charCodeAt(i));
  }
  return bitTotal(Modes);
  //CharMode函数
  function CharMode(iN) {
    if (iN >= 48 && iN <= 57)
      //数字
      return 1;
    if (iN >= 65 && iN <= 90)
      //大写字母
      return 2;
    if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90))
      //大小写
      return 4;
    else return 8; //特殊字符
  }
  //bitTotal函数
  function bitTotal(num) {
    let modes = 0;
    for (let i = 0; i < 4; i++) {
      if (num & 1) modes++;
      num >>>= 1;
    }
    return modes;
  }
}
