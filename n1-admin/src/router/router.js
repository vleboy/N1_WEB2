import main from '@/pages/main'
import login from '@/pages/login'
import err404 from '@/pages/404'
//otherRouter
import home from '@/pages/home'
import createRole from '@/pages/adminCenter/createRole'
import addAdmin from '@/pages/adminCenter/addAdmin'
import addMerchant from '@/pages/businessCenter/addMerchant'
import addManager from '@/pages/businessCenter/addManager'
import managerDetail from '@/pages/businessCenter/managerDetail'
import merchantDetail from '@/pages/businessCenter/merchantDetail'
import playerDetail from '@/pages/player/playerdetail'
// appRouter
import ownSpace from '@/pages/ownSpace'
import board from '@/pages/board/board'
import newBoard from '@/pages/newBoard/newBoard'
import allReport from '@/pages/reports/allReport'
import playerReport from '@/pages/reports/playerReport'
import agtrue from '@/pages/reports/agTrueGame'
import mgvideo from '@/pages/reports/mgVideoGame'
import nacard from '@/pages/reports/naCardGame'
import nastreet from '@/pages/reports/naStreetGame'
import kyChess from '@/pages/reports/kyChess'
import nahfive from '@/pages/reports/nahfive'
import nanomys from '@/pages/reports/nanomys'
import natrue from '@/pages/reports/naTrueGame'
import navideo from '@/pages/reports/naVideoGame'
import naAll from '@/pages/reports/naAllReport'
import naFishing from '@/pages/reports/naFishing'
import saAll from '@/pages/reports/saAllReport'
import safishing from '@/pages/reports/saFishingGame'
import satrue from '@/pages/reports/saTrueGame'
import sbAll from '@/pages/reports/sbAllReport'
import sbvideo from '@/pages/reports/sbVideoGame'
import sbtrue from '@/pages/reports/sbTrueGame'
import ttgvideo from '@/pages/reports/ttgVideoGame'
import ysbSport from '@/pages/reports/ysbSport'
import rtgGame from '@/pages/reports/rtgGame'
import dtGame from '@/pages/reports/dtReport'
import ppGame from '@/pages/reports/ppGame'
import pgVideo from '@/pages/reports/pgVideo'
import habaVideo from '@/pages/reports/habaVideo'
import pngVideo from '@/pages/reports/pngVideo'
import natruehfive from '@/pages/reports/naTrueHfive'


import dayCompany from '@/pages/day/dayCompany'
import dayManager from '@/pages/day/dayManager'
import dayMerchant from '@/pages/day/dayMerchant'
import dayPlayer from '@/pages/day/dayPlayer'


import merchantList from '@/pages/businessCenter/merchantList'
import managerList from '@/pages/businessCenter/managerList'
import warnList from '@/pages/businessCenter/warnList'
import adminList from '@/pages/adminCenter/adminList'
import adminRole from '@/pages/adminCenter/adminRole'
// import lineNumList from '@/pages/adminCenter/lineNumList'

import operationLog from '@/pages/log/operationLog'
import loginLog from '@/pages/log/loginLog'
import lineLoginLog from '@/pages/log/lineLoginLog'
import merchantLog from '@/pages/log/merchantLog'
import adminLog from '@/pages/log/adminLog'
import debugLog from '@/pages/log/debugLog'
import managerOpreateLog from '@/pages/log/managerOpreateLog'
import merchantOpreateLog from '@/pages/log/merchantOpreateLog'
import adminLoginLog from '@/pages/log/adminLoginLog'

import prizeList from '@/pages/operation/mysPrize/prizeList'
import sysConfig from '@/pages/operation/mysPrize/sysConfig'
import dataRepair from '@/pages/log/dataRepair'
import playerlist from '@/pages/player/playerlist'
import gameNoticeList from '@/pages/operation/gameNoticeMgr/gameNoticeList'
import numericalControl from '@/pages/operation/electronicGame/numericalControl'
import gameMailList from '@/pages/operation/mailMgr/gameMailList'
import horseRaceLampList from '@/pages/operation/horseRaceLampMgr/horseRaceLampList'
import businessRecordList from '@/pages/operation/businessRecord/businessRecordList'
import boothList from '@/pages/operation/booth/boothList'
import propPrizeList from '@/pages/operation/propPrize/propPrizeList'
import flow from '@/pages/notransfer/flow'
import noTransferReport from '@/pages/notransfer/noTransferReport'
import gameManager from '@/pages/operation/gameManager/gameManager'
import addGame from '@/pages/operation/gameManager/addGame'

const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        requireAuth: false
      },
    component: login
};
const page404 = {
    path: '*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在',
        requireAuth: false
    },
    component: err404
};
// 作为main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    title:'other',
    component: main,
    children: [
        { path: 'home', name: 'home',title:'首页', component: home},
        { path: 'addAdmin', name: 'addAdmin',title:'新增管理员', component: addAdmin},
        { path: 'createRole', name: 'createRole',title:'创建新角色', component: createRole},
        { path: 'addMerchant', name: 'addMerchant',title:'创建商户', component: addMerchant},
        { path: 'addManager', name: 'addManager',title:'创建线路商', component: addManager},
        { path: 'dealerDetail', name: 'dealerDetail',title:'线路商详情', component: managerDetail},
        { path: 'merchantDetail', name: 'merchantDetail',title:'商户详情', component: merchantDetail},
        { path: 'detail', name:'playDetail', title:'玩家详情',  meta: {keepAlive: true}, component:playerDetail},
    ]
};
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
         {
           path: '/ownspace',
           title: '个人中心',
           name: 'ownspace',
           component: main,
           children: [{ path: 'index', title: '个人中心', name: 'ownspace-index', component: ownSpace }]
         },
         /* {
           path: '/boards',
           title: '看板',
           name: 'boards',
           component: main,
           children: [{ path: 'board', title: '看板', name: 'board', component: board }]
         }, */
         {
           path: '/newBoard',
           title: '看板',
           name: 'newBoard',
           component: main,
           children: [{ path: 'newBoard', title: '看板', name: 'newBoard', component: newBoard }]
         },
         {
           path: '/allreport',
           title: '公司输赢总报表',
           name: 'all',
           component: main,
           children: [{ path: 'all', title: '公司输赢总报表', name: 'allreport', component: allReport }]
         },
         {
           path: '/player',
           title: '玩家输赢总报表',
           name: 'player',
           component: main,
           children: [{ path: 'all', title: '玩家输赢总报表', name: 'playerReport', component: playerReport }]
         },
         {
           path: '/aggame',
           title: 'AG游戏报表',
           name: 'aggame',
           component: main,
           children: [{ path: 'true', title: 'AG真人游戏报表', name: 'agtrue', component: agtrue }]
         },
         {
           path: '/mggame',
           title: 'MG游戏报表',
           name: 'mggame',
           component: main,
           children: [{ path: 'video', title: 'MG电子游戏报表', name: 'mgvideo', component: mgvideo }]
         },
         {
           path: '/nagame',
           title: 'NA游戏报表',
           name: 'nagame',
           component: main,
           children: [
             { path: 'card', title: 'NA棋牌游戏报表', name: 'nacard', component: nacard },
             { path: 'street', title: 'NA街机游戏报表', name: 'nastreet', component: nastreet },
             { path: 'true', title: 'NA真人游戏报表', name: 'natrue', component: natrue },
             { path: 'video', title: 'NA电子游戏报表', name: 'navideo', component: navideo },
             { path: 'fishing', title: 'NA捕鱼游戏报表', name: 'nafishing', component: naFishing },
             { path: 'all', title: 'NA游戏总报表', name: 'naAll', component: naAll },
             { path: 'hfive', title: 'NA电子H5报表', name: 'nahfive', component: nahfive },
             { path: 'nanomys', title: 'NA电子H5无神秘奖报表', name: 'nanomys', component: nanomys },
             { path: 'truefive', title: 'NA真人H5报表', name: 'natruehfive', component: natruehfive }
           ]
         },
         {
           path: '/sagame',
           title: 'SA游戏报表',
           name: 'sagame',
           component: main,
           children: [
             { path: 'all', title: 'SA游戏总报表', name: 'saAll', component: saAll },
             { path: 'fishing', title: 'SA捕鱼游戏报表', name: 'safishing', component: safishing },
             { path: 'true', title: 'SA真人游戏报表', name: 'satrue', component: satrue }
           ]
         },
         {
           path: '/sbgame',
           title: 'SB游戏报表',
           name: 'sbgame',
           component: main,
           children: [
             { path: 'all', title: 'SB游戏总报表', name: 'sbAll', component: sbAll },
             { path: 'video', title: 'SB电子游戏报表', name: 'sbvideo', component: sbvideo },
             { path: 'true', title: 'SB真人游戏报表', name: 'sbtrue', component: sbtrue }
           ]
         },
         {
           path: '/ttggame',
           title: 'TTG游戏报表',
           name: 'ttggame',
           component: main,
           children: [{ path: 'video', title: 'TTG电子游戏报表', name: 'ttgvideo', component: ttgvideo }]
         },
         {
           path: '/kygame',
           title: 'KY游戏报表',
           name: 'kygame',
           component: main,
           children: [{ path: 'chess', title: 'KY棋牌游戏报表', name: 'kychess', component: kyChess }]
         },
         {
           path: '/pg',
           title: 'PG电子游戏报表',
           name: 'pg',
           component: main,
           children: [{ path: 'video', title: 'PG电子游戏报表', name: 'pgGame', component: pgVideo }]
         },
         {
           path: '/png',
           title: 'PNG电子游戏报表',
           name: 'png',
           component: main,
           children: [{ path: 'video', title: 'PNG电子游戏报表', name: 'pngGame', component: pngVideo }]
         },
         {
           path: '/haba',
           title: 'HABA电子游戏报表',
           name: 'haba',
           component: main,
           children: [{ path: 'video', title: 'HABA电子游戏报表', name: 'habaGame', component: habaVideo }]
         },
         {
           path: '/rtg',
           title: 'RTG游戏',
           name: 'rtg',
           component: main,
           children: [{ path: 'game', title: 'RTG电子游戏报表', name: 'rtgGame', component: rtgGame }]
         },
         {
           path: '/dt',
           title: 'dt',
           name: 'dt',
           component: main,
           children: [{ path: 'video', title: 'DT电子游戏报表', name: 'dtGame', component: dtGame }]
         },
         {
           path: '/pp',
           title: 'pp',
           name: 'pp',
           component: main,
           children: [{ path: 'video', title: 'PP游戏报表', name: 'ppGame', component: ppGame }]
         },
         {
           path: '/ysb',
           title: 'YSB体育游戏',
           name: 'ysb',
           component: main,
           children: [{ path: 'sport', title: 'YSB体育游戏报表', name: 'ysbSport', component: ysbSport }]
         },
         {
           path: '/dayCompany',
           title: '公司日报表',
           name: 'dayCompany',
           component: main,
           children: [{ path: 'dayCompany', title: '公司日报表', name: 'dayCompany', component: dayCompany }]
         },
         {
           path: '/dayManager',
           title: '线路商日报表',
           name: 'dayManager',
           component: main,
           children: [{ path: 'dayManager', title: '线路商日报表', name: 'dayManager', meta: { keepAlive: true }, component: dayManager }]
         },
         {
           path: '/dayMerchant',
           title: '商户日报表',
           name: 'dayMerchant',
           component: main,
           children: [{ path: 'dayMerchant', title: '商户日报表', name: 'dayMerchant', meta: { keepAlive: true }, component: dayMerchant }]
         },
         {
           path: '/dayPlayer',
           title: '玩家日报表',
           name: 'dayPlayer',
           component: main,
           children: [{ path: 'dayPlayer', title: '玩家日报表', name: 'dayPlayer', meta: { keepAlive: true }, component: dayPlayer }]
         },
         {
           path: '/business',
           title: '商户列表',
           name: 'business',
           component: main,
           children: [
             { path: 'merchant', title: '商户列表', name: 'merchantList', component: merchantList },
             { path: 'manager', title: '线路商列表', name: 'dealerList', component: managerList },
             { path: 'warn', title: '接入商点数警告列表', name: 'warnList', component: warnList }
           ]
         },
         {
           path: '/admin',
           title: '管理员列表',
           name: 'admin',
           component: main,
           children: [
             { path: 'list', title: '管理员列表', name: 'adminList', component: adminList },
             { path: 'role', title: '管理员角色列表', name: 'adminRole', component: adminRole }
             // {path:'line',title:'线路号列表',name:'lineNumList',component:lineNumList},
           ]
         },
         {
           path: '/log',
           title: '日志',
           name: 'log',
           component: main,
           children: [
             { path: 'loginLog', title: '登录日志', name: 'loginLog', component: loginLog },
             { path: 'operationLog', title: '操作日志', name: 'operationLog', component: operationLog },
             /* { path: 'lineLogin', title: '线路商登录日志', name: 'lineLoginLog', component: lineLoginLog },
             { path: 'merchant', title: '商户登录日志', name: 'merchantLog', component: merchantLog },
             { path: 'managerOpreate', title: '线路商操作日志', name: 'managerOpreateLog', component: managerOpreateLog },
             { path: 'merchantOpreate', title: '商户操作日志', name: 'merchantOpreateLog', component: merchantOpreateLog },
             { path: 'adminOpreate', title: '管理员操作日志', name: 'adminLog', component: adminLog },
             { path: 'adminlogin', title: '管理员登录日志', name: 'adminLoginLog', component: adminLoginLog }, */
             { path: 'debug', title: 'DEBUG日志', name: 'debugLog', component: debugLog },
             { path: 'dataRepair', title: 'DEBUG修正', name: 'dataRepair', component: dataRepair }
           ]
         },
         {
           path: '/play',
           title: '玩家列表',
           name: 'play',
           component: main,
           children: [{ path: 'list', title: '玩家列表', name: 'playList', component: playerlist }]
         },
         {
           path: '/transfer',
           title: '',
           name: 'transfer',
           component: main,
           children: [
             { path: 'flow', title: '流水交易', name: 'flow', component: flow },
             { path: 'report', title: '输赢报表', name: 'noTransferReport', component: noTransferReport }
           ]
         },
         {
           path: '/operation',
           title: '运营中心',
           name: 'operation',
           component: main,
           children: [
             { path: 'gameNoticeList', title: '游戏公告列表', name: 'gameNoticeList', component: gameNoticeList },
             { path: 'gameMailList', title: '游戏邮件列表', name: 'gameMailList', component: gameMailList },
             { path: 'horseRaceLampList', title: '跑马灯列表', name: 'horseRaceLampList', component: horseRaceLampList },
             { path: 'businessRecord', title: '商户运营记录', name: 'businessRecord', component: businessRecordList },
             { path: 'boothList', title: '展位列表', name: 'boothList', component: boothList },
             { path: 'propPrice', title: '道具定价', name: 'propPrice', component: propPrizeList },
             { path: 'sysConfig', title: '系统配置', name: 'sysConfig', component: sysConfig },
             { path: 'prizeList', title: '中奖纪录', name: 'prizeList', component: prizeList },
             { path: 'numericalControl', title: '数值调控中心', name: 'numericalControl', component: numericalControl },
             { path: 'gameManager', title: '游戏管理', name: 'gameManager', component: gameManager },
             { path: 'addGame', title: '创建游戏', name: 'addGame', component: addGame }
           ]
         }
       ]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    page404,
    loginRouter,
    otherRouter,
    ...appRouter,
]