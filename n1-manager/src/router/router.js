import main from '@/pages/main'
import login from '@/pages/login'
import err404 from '@/pages/404'
//otherRouter
import home from '@/pages/home'
import playerDetail from '@/pages/player/playerdetail'
// appRouter
import ownSpace from '@/pages/ownSpace'
import board from '@/pages/board/board'
import managerList from '@/pages/businessCenter/managerList'
import merchantList from '@/pages/businessCenter/merchantList'
import managerDetail from '@/pages/businessCenter/managerDetail'
import merchantDetail from '@/pages/businessCenter/merchantDetail'
//report
import allReport from '@/pages/reports/allReport'
import agtrue from '@/pages/reports/agTrueGame'
import mgvideo from '@/pages/reports/mgVideoGame'
import nacard from '@/pages/reports/naCardGame'
import nastreet from '@/pages/reports/naStreetGame'
import naFishing from '@/pages/reports/naFishing'
import natrue from '@/pages/reports/naTrueGame'
import nahfive from '@/pages/reports/nahfive'
import nanomsy from '@/pages/reports/nanomsy'
import navideo from '@/pages/reports/naVideoGame'
import naAll from '@/pages/reports/naAllReport'
import saAll from '@/pages/reports/saAllReport'
import safishing from '@/pages/reports/saFishingGame'
import satrue from '@/pages/reports/saTrueGame'
import sbAll from '@/pages/reports/sbAllReport'
import sbvideo from '@/pages/reports/sbVideoGame'
import sbtrue from '@/pages/reports/sbTrueGame'
import ttgvideo from '@/pages/reports/ttgVideoGame'
import rtgGame from '@/pages/reports/rtgGame'
import ysbSport from '@/pages/reports/ysbSport'
import dtGame from '@/pages/reports/dtReport'
import ppGame from '@/pages/reports/ppGame'
import pgVideo from '@/pages/reports/pgVideo'
import habaVideo from '@/pages/reports/habaVideo'
import pngVideo from '@/pages/reports/pngVideo'
import natruehfive from '@/pages/reports/naTrueHfive'
import kyChess from '@/pages/reports/kyChess'

//day
import dayCompany from '@/pages/day/dayCompany'
import dayMerchant from '@/pages/day/dayMerchant'

//log
import loginLog from '@/pages/log/loginLog'
import operationLog from '@/pages/log/operationLog'
import managerOpreateLog from '@/pages/log/managerOpreateLog'
import merchantOpreateLog from '@/pages/log/merchantOpreateLog'
import merchantLog from '@/pages/log/merchantLog'
import managerLog from '@/pages/log/managerLog'
import playerlist from '@/pages/player/playerlist'

import flow from '@/pages/notransfer/flow'
import noTransferReport from '@/pages/notransfer/noTransferReport'
const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    requireAuth: false
  },
  component: login
}
const page404 = {
  path: '*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在',
    requireAuth: false
  },
  component: err404
}
// 作为main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  title: 'other',
  component: main,
  children: [
    { path: 'home', name: 'home', title: '首页', component: home },
    { path: 'detail', name: 'playDetail', title: '玩家详情', meta: { keepAlive: true }, component: playerDetail },
    { path: 'dealerDetail', name: 'dealerDetail', title: '线路商详情', meta: { keepAlive: true }, component: managerDetail },
    { path: 'merchantDetail', name: 'merchantDetail', title: '商户详情', meta: { keepAlive: true }, component: merchantDetail }
  ]
}
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
           path: '/allreport',
           title: '公司输赢总报表',
           name: 'all',
           component: main,
           children: [{ path: 'all', title: '公司输赢总报表', name: 'allreport', component: allReport }]
         },
         {
           path: '/aggame',
           title: 'AG游戏报表',
           name: 'aggame',
           component: main,
           children: [{ path: 'true', title: 'AG真人游戏报表', name: 'agtrue', component: agtrue }]
         },
         {
           path: '/png',
           title: 'PNG电子游戏报表',
           name: 'png',
           component: main,
           children: [{ path: 'video', title: 'PNG电子游戏报表', name: 'pngGame', component: pngVideo }]
         },
         {
           path: '/mggame',
           title: 'MG游戏报表',
           name: 'mggame',
           component: main,
           children: [{ path: 'video', title: 'MG电子游戏报表', name: 'mgvideo', component: mgvideo }]
         },
         {
           path: '/pg',
           title: 'PG电子游戏报表',
           name: 'pg',
           component: main,
           children: [{ path: 'video', title: 'PG电子游戏报表', name: 'pgGame', component: pgVideo }]
         },
         {
           path: '/haba',
           title: 'HABA电子游戏报表',
           name: 'haba',
           component: main,
           children: [{ path: 'video', title: 'HABA电子游戏报表', name: 'habaGame', component: habaVideo }]
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
             { path: 'hfive', title: 'NA电子H5报表', name: 'nahfive', component: nahfive },
             { path: 'nanomsy', title: 'NA电子H5无神秘奖报表', name: 'nanomsy', component: nanomsy },
             { path: 'all', title: 'NA游戏总报表', name: 'naAll', component: naAll },
             { path: 'fishing', title: 'NA捕鱼游戏报表', name: 'nafishing', component: naFishing },
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
           children: [{ path: 'video', title: 'PP电子游戏报表', name: 'ppGame', component: ppGame }]
         },
         {
           path: '/ysb',
           title: 'YSB体育游戏',
           name: 'ysb',
           component: main,
           children: [{ path: 'sport', title: 'YSB体育游戏报表', name: 'ysbSport', component: ysbSport }]
         },
        /*  {
           path: '/log',
           title: '日志',
           name: 'log',
           component: main,
           children: [
             { path: 'loginLog', title: '登录日志', name: 'loginLog', component: loginLog },
             { path: 'operationLog', title: '操作日志', name: 'operationLog', component: operationLog },
              { path: 'managerOpreate', title: '线路商操作日志', name: 'managerOpreateLog', component: managerOpreateLog },
             { path: 'merchantOpreate', title: '商户操作日志', name: 'merchantOpreateLog', component: merchantOpreateLog },
             { path: 'manager', title: '线路商登录日志', name: 'managerLog', component: managerLog },
             { path: 'merchant', title: '商户登录日志', name: 'merchantLog', component: merchantLog } 
           ]
         }, */
         {
           path: '/day',
           title: '日报表',
           name: 'day',
           component: main,
           children: [
             { path: 'dayCompany', title: '公司日报表', name: 'dayCompany', component: dayCompany },
             { path: 'dayMerchant', title: '商户日报表', name: 'dayMerchant', component: dayMerchant }
           ]
         },
         {
           path: '/business',
           title: '商户中心',
           name: 'business',
           component: main,
           children: [
             { path: 'merchant', title: '商户列表', name: 'merchantList', component: merchantList },
             { path: 'manager', title: '线路商列表', name: 'dealerList', component: managerList }
           ]
         },
         /* {
           path: '/transfer',
           title: '',
           name: 'transfer',
           component: main,
           children: [
             { path: 'flow', title: '流水交易', name: 'flow', component: flow },
             { path: 'report', title: '输赢报表', name: 'noTransferReport', component: noTransferReport }
           ]
         }, */
         {
           path: '/play',
           title: '玩家列表',
           name: 'play',
           component: main,
           children: [{ path: 'list', title: '玩家列表', name: 'playList', component: playerlist }]
         }
       ]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [page404, loginRouter, otherRouter, ...appRouter]
