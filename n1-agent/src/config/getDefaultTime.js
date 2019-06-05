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