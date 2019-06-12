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

/* 数值调控中心 */
export const numGameList = () => {
  return [
    { code: "", name: "全部游戏" },
    { name: '塔罗之谜-神秘大奖', code: '70001' },
    { name: '塔罗之谜', code: '90001' },
    { name: '小厨娘-神秘大奖', code: '70002' },
    { name: '小厨娘', code: '90002' },
    { name: '祥龙献瑞-神秘大奖', code: '70003' },
    { name: '祥龙献瑞', code: '90003' },
    { name: '四方神兽-神秘大奖', code: '70004' },
    { name: '四方神兽', code: '90004' },
    { name: '财神进宝-神秘大奖', code: '70005' },
    { name: '财神进宝', code: '90005' },
    { name: '福运亨通-神秘大奖', code: '70006' },
    { name: '福运亨通', code: '90006' },
    { name: '熊猫传奇-神秘大奖', code: '70007' },
    { name: '熊猫传奇', code: '90007' },
    { name: '财源广进-神秘大奖', code: '70010' },
    { name: '财源广进', code: '90008' },
    { name: '珠光宝气-神秘大奖', code: '70011' },
    { name: '珠光宝气', code: '90009' },
    { name: '锦鲤-神秘大奖', code: '70012' },
    { name: '锦鲤', code: '90010' },
    { name: '金狮送福-神秘大奖', code: '70013' },
    { name: '金狮送福', code: '90011' },
    { name: '幸运钱庄-神秘大奖', code: '70014' },
    { name: '幸运钱庄', code: '90012' },
    { name: '年年有余-神秘大奖', code: '70022' },
    { name: '年年有余', code: '90013' },
    { name: '猪年大吉-神秘大奖', code: '70024' },
    { name: '猪年大吉', code: '90014' },
    { name: '财神到-神秘大奖', code: '70026' },
    { name: '财神到', code: '90015' },
    { name: '老寿星-神秘大奖', code: '70028' },
    { name: '老寿星', code: '90016' },
    { name: '凤舞朝阳-神秘大奖', code: '70030' },
    { name: '凤舞朝阳', code: '90017' },
    { name: '鲤跃龙门-神秘大奖', code: '70032' },
    { name: '鲤跃龙门', code: '90018' },
  ]

}