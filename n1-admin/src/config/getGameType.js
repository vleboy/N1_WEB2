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
    { company: "PP", code: "1160000", name: "PP电子游戏" },
    { company: "VG", code: "1100000", name: "VG棋牌游戏" }
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
    PP: [{ company: "PP", code: "1160000", name: "PP电子游戏" }],
    VG: [{ company: "VG", code: "1100000", name: "VG棋牌游戏" }]
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
      { company: "PP", code: "1160000", name: "PP电子游戏" },
      { company: "VG", code: "1100000", name: "VG棋牌游戏" }
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
    ],
    VG: [{ company: "VG", code: "1100000", name: "VG棋牌游戏" }]
  }
}

/* 数值调控中心 */
export const numGameList = () => {
  return [
    { displayName: '全部游戏', gameId: '', gameType: ''},
    { displayName: '塔罗之谜-神秘大奖', gameId: '70001', gameType: '243_bonus' },
    { displayName: '塔罗之谜', gameId: '90001', gameType: '243' },
    { displayName: '小厨娘-神秘大奖', gameId: '70002', gameType: '243_bonus' },
    { displayName: '小厨娘', gameId: '90002', gameType: '243' },
    { displayName: '祥龙献瑞-神秘大奖', gameId: '70003', gameType: '243_bonus' },
    { displayName: '祥龙献瑞', gameId: '90003', gameType: '243' },
    { displayName: '四方神兽-神秘大奖', gameId: '70004', gameType: '243_bonus' },
    { displayName: '四方神兽', gameId: '90004', gameType: '243' },
    { displayName: '财神进宝-神秘大奖', gameId: '70005', gameType: '243_bonus' },
    { displayName: '财神进宝', gameId: '90005', gameType: '243' },
    { displayName: '福运亨通-神秘大奖', gameId: '70006', gameType: '243_bonus' },
    { displayName: '福运亨通', gameId: '90006', gameType: '243' },
    { displayName: '熊猫传奇-神秘大奖', gameId: '70007', gameType: 'panda_bonus' },
    { displayName: '熊猫传奇', gameId: '90007', gameType: 'panda' },
    { displayName: '财源广进-神秘大奖', gameId: '70010', gameType: 'panda_bonus' },
    { displayName: '财源广进', gameId: '90008', gameType: 'panda' },
    { displayName: '珠光宝气-神秘大奖', gameId: '70011', gameType: 'panda_bonus' },
    { displayName: '珠光宝气', gameId: '90009', gameType: 'panda' },
    { displayName: '锦鲤-神秘大奖', gameId: '70012', gameType: 'panda_bonus' },
    { displayName: '锦鲤', gameId: '90010', gameType: 'panda' },
    { displayName: '金狮送福-神秘大奖', gameId: '70013', gameType: 'panda_bonus' },
    { displayName: '金狮送福', gameId: '90011', gameType: 'panda' },
    { displayName: '幸运钱庄-神秘大奖', gameId: '70014', gameType: 'panda_bonus' },
    { displayName: '幸运钱庄', gameId: '90012', gameType: 'panda' },
    { displayName: '年年有余-神秘大奖', gameId: '70022', gameType: 'tree_bonus' },
    { displayName: '年年有余', gameId: '90013', gameType: 'tree' },
    { displayName: '猪年大吉-神秘大奖', gameId: '70024', gameType: 'tree_bonus' },
    { displayName: '猪年大吉', gameId: '90014', gameType: 'tree' },
    { displayName: '财神到-神秘大奖', gameId: '70026', gameType: 'tree_bonus' },
    { displayName: '财神到', gameId: '90015', gameType: 'tree' },
    { displayName: '老寿星-神秘大奖', gameId: '70028', gameType: 'tree_bonus' },
    { displayName: '老寿星', gameId: '90016', gameType: 'tree' },
    { displayName: '凤舞朝阳-神秘大奖', gameId: '70030', gameType: 'tree_bonus' },
    { displayName: '凤舞朝阳', gameId: '90017', gameType: 'tree' },
    { displayName: '鲤跃龙门-神秘大奖', gameId: '70032', gameType: 'tree_bonus' },
    { displayName: '鲤跃龙门', gameId: '90018', gameType: 'tree' },
  ]


}