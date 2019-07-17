export const getCNGameType = () => {
  return [
    { company: "NA", code: "70000", name: "H5电子游戏" },
    { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" },
    { company: "KY", code: "1070000", name: "KY棋牌游戏" },
    { company: "TTG", code: "1010000", name: "TTG电子游戏" },
    { company: "PNG", code: "1020000", name: "PNG电子游戏" },
    { company: "MG", code: "10300000", name: "MG电子游戏" },
    { company: "HABA", code: "1040000", name: "HABA电子游戏" },
    { company: "AG", code: "1050000", name: "AG真人游戏" },
    { company: "SA", code: "1060000", name: "SA真人游戏" },
    { company: "SA", code: "1110000", name: "SA捕鱼游戏" },
    { company: "PG", code: "1090000", name: "PG电子游戏" },
    { company: "YSB", code: "1130000", name: "YSB体育游戏" },
    { company: "RTG", code: "1140000", name: "RTG电子游戏" },
    { company: "SB", code: "1080000", name: "SB电子游戏" },
    { company: "SB", code: "1120000", name: "SB真人游戏" },
    { company: "DT", code: "1150000", name: "DT电子游戏" },
    { company: "PP", code: "1160000", name: "PP电子游戏" }
  ]
}

export const getENGameType = () => {
  return [
    { company: "NA", code: "70000", name: "H5 Video" },
    { company: "NA", code: "90000", name: "H5 Video (without mystery)" },
    { company: "KY", code: "1070000", name: "KY Table" },
    { company: "TTG", code: "1010000", name: "TTG Video" },
    { company: "PNG", code: "1020000", name: "PNG Video" },
    { company: "MG", code: "10300000", name: "MG Video" },
    { company: "HABA", code: "1040000", name: "HABA Video" },
    { company: "AG", code: "1050000", name: "AG Live" },
    { company: "SA", code: "1060000", name: "SA Live" },
    { company: "SA", code: "1110000", name: "SA Fishing" },
    { company: "PG", code: "1090000", name: "PG Video" },
    { company: "YSB", code: "1130000", name: "YSB Sport" },
    { company: "RTG", code: "1140000", name: "RTG Video" },
    { company: "SB", code: "1080000", name: "SB Video" },
    { company: "SB", code: "1120000", name: "RTG Live" },
    { company: "DT", code: "1150000", name: "DT Video" },
    { company: "PP", code: "1160000", name: "PP Video" }
  ]
}

export const getGameType = () => {
  let gameList = (JSON.parse(localStorage.getItem('userInfo')).gameList)
  let removeArr = ['NA棋牌游戏', 'NA捕鱼游戏', 'NA街机游戏', 'NA真人游戏', 'NA电子游戏', 'NA真人视讯']//移除的权限
  for (let i = 0; i < removeArr.length; i++) {
    for (let j = 0; j < gameList.length; j++) {
      if (removeArr[i] == gameList[j].name) {
        gameList.splice(j, 1)
      }
    }
  }
  gameList.unshift({ company: "全部", code: "", name: "全部游戏" })
  return gameList
}