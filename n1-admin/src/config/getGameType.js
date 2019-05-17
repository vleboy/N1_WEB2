/* 增删游戏公司大类如 需要另外在玩家中心的companyList修改*/
/*  */

//游戏种类
export const getGameType = () => {
  return [
    { company: "全部", code: "", name: "全部游戏" },
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

//游戏枚举
export const GameListEnum = () => {
  return {
    NA: [
      { company: "NA", code: "70000", name: "H5电子游戏" },
      { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" }
    ],
    KY: [{ company: "KY", code: "1070000", name: "KY棋牌游戏" }],
    TTG: [{ company: "TTG", code: "1010000", name: "TTG电子游戏" }],
    PNG: [{ company: "PNG", code: "1020000", name: "PNG电子游戏" }],
    MG: [{ company: "MG", code: "10300000", name: "MG电子游戏" }],
    HABA: [{ company: "HABA", code: "1040000", name: "HABA电子游戏" }],
    AG: [{ company: "AG", code: "1050000", name: "AG真人游戏" }],
    SA: [
      { company: "SA", code: "1060000", name: "SA真人游戏" },
      { company: "SA", code: "1110000", name: "SA捕鱼游戏" }
    ],
    PG: [{ company: "PG", code: "1090000", name: "PG电子游戏" }],
    YSB: [{ company: "YSB", code: "1130000", name: "YSB体育游戏" }],
    RTG: [{ company: "RTG", code: "1140000", name: "RTG电子游戏" }],
    SB: [
      { company: "SB", code: "1080000", name: "SB电子游戏" },
      { company: "SB", code: "1120000", name: "SB真人游戏" }
    ],
    DT: [{ company: "DT", code: "1150000", name: "DT电子游戏" }],
    PP: [{ company: "PP", code: "1160000", name: "PP电子游戏" }]
  }
}

/* 玩家中心-游戏列表 */
export const getGameListEnum = () => {
  return {
    All: [
      { company: "全部", code: "", name: "全部" },
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
    ],
    NA: [
      { company: "全部", code: "", name: "全部" },
      { company: "NA", code: "70000", name: "H5电子游戏" },
      { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" }
    ],
    KY: [
      { company: "全部", code: "", name: "全部" },
      { company: "KY", code: "1070000", name: "KY棋牌游戏" },
    ],
    TTG: [
      { company: "全部", code: "", name: "全部" },
      { company: "TTG", code: "1010000", name: "TTG电子游戏" }
    ],
    PNG: [
      { company: "全部", code: "", name: "全部" },
      { company: "PNG", code: "1020000", name: "PNG电子游戏" }
    ],
    MG: [
      { company: "全部", code: "", name: "全部" },
      { company: "MG", code: "10300000", name: "MG电子游戏" }
    ],
    HABA: [
      { company: "全部", code: "", name: "全部" },
      { company: "HABA", code: "1040000", name: "HABA电子游戏" }
    ],
    AG: [
      { company: "全部", code: "", name: "全部" },
      { company: "AG", code: "1050000", name: "AG真人游戏" }
    ],
    SA: [
      { company: "全部", code: "", name: "全部" },
      { company: "SA", code: "1060000", name: "SA真人游戏" },
      { company: "SA", code: "1110000", name: "SA捕鱼游戏" }
    ],
    PG: [
      { company: "全部", code: "", name: "全部" },
      { company: "PG", code: "1090000", name: "PG电子游戏" }
    ],
    YSB: [
      { company: "全部", code: "", name: "全部" },
      { company: "YSB", code: "1130000", name: "YSB体育游戏" }
    ],
    RTG: [
      { company: "全部", code: "", name: "全部" },
      { company: "RTG", code: "1140000", name: "RTG电子游戏" }
    ],
    SB: [
      { company: "全部", code: "", name: "全部" },
      { company: "SB", code: "1080000", name: "SB电子游戏" },
      { company: "SB", code: "1120000", name: "SB真人游戏" }
    ],
    DT: [
      { company: "全部", code: "", name: "全部" },
      { company: "DT", code: "1150000", name: "DT电子游戏" }
    ],
    PP: [
      { company: "全部", code: "", name: "全部" },
      { company: "PP", code: "1160000", name: "PP电子游戏" }
    ]
  }
}
