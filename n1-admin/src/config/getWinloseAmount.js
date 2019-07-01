export function getWinloseAmount(arr, params) {
  let allCount = 0
  for (let item of arr) {
    for (let key in item.gameTypeMap) {
      if (params.includes(key)) {
        allCount += item.gameTypeMap[key].winloseAmount
      }
    }
  }
  return allCount
}