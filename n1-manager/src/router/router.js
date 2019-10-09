import main from '@/pages/main'
import login from '@/pages/login'
import err404 from '@/pages/404'
//otherRouter
import home from '@/pages/home'
import playerDetail from '@/pages/player/playerdetail'
// appRouter
import ownSpace from '@/pages/ownSpace'
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
import prizeList from '@/pages/operation/prize/prizeList'

//day
import dayCompany from '@/pages/day/dayCompany'
import dayMerchant from '@/pages/day/dayMerchant'

import playerlist from '@/pages/player/playerlist'
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
    { path: 'home', name: 'home', title:'sideBar.home', component: home },
    { path: 'detail', name: 'playDetail', title: 'sideBar.playerDetail', meta: { keepAlive: true }, component: playerDetail },
    { path: 'dealerDetail', name: 'dealerDetail', title: 'sideBar.managerDetail', meta: { keepAlive: true }, component: managerDetail },
    { path: 'merchantDetail', name: 'merchantDetail', title: 'sideBar.merchantDetail', meta: { keepAlive: true }, component: merchantDetail }
  ]
}
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
         {
           path: '/ownspace',
           title: '个人中心',
           name: 'ownspace',
           component: main,
           children: [{ path: 'index', title: 'sideBar.ownSpace', name: 'ownspace-index', component: ownSpace }]
         },
         {
           path: '/allreport',
           title: '公司输赢总报表',
           name: 'all',
           component: main,
           children: [{ path: 'all', title: 'sideBar.allReport', name: 'allreport', component: allReport }]
         },
         {
           path: '/aggame',
           title: 'AG游戏报表',
           name: 'aggame',
           component: main,
           children: [{ path: 'true', title: 'sideBar.agTrue', name: 'agtrue', component: agtrue }]
         },
         {
           path: '/png',
           title: 'PNG电子游戏报表',
           name: 'png',
           component: main,
           children: [{ path: 'video', title: 'sideBar.pngGame', name: 'pngGame', component: pngVideo }]
         },
         {
           path: '/mggame',
           title: 'MG游戏报表',
           name: 'mggame',
           component: main,
           children: [{ path: 'video', title: 'sideBar.mgVideo', name: 'mgvideo', component: mgvideo }]
         },
         {
           path: '/pg',
           title: 'PG电子游戏报表',
           name: 'pg',
           component: main,
           children: [{ path: 'video', title: 'sideBar.pgGame', name: 'pgGame', component: pgVideo }]
         },
         {
           path: '/haba',
           title: 'HABA电子游戏报表',
           name: 'haba',
           component: main,
           children: [{ path: 'video', title: 'sideBar.habaGame', name: 'habaGame', component: habaVideo }]
         },
         {
           path: '/nagame',
           title: 'NA游戏报表',
           name: 'nagame',
           component: main,
           children: [
            /*  { path: 'card', title: 'NA棋牌游戏报表', name: 'nacard', component: nacard },
             { path: 'street', title: 'NA街机游戏报表', name: 'nastreet', component: nastreet },
             { path: 'true', title: 'NA真人游戏报表', name: 'natrue', component: natrue }, 
             { path: 'video', title: 'NA电子游戏报表', name: 'navideo', component: navideo },*/
             { path: 'hfive', title: 'sideBar.naHFive', name: 'nahfive', component: nahfive },
             { path: 'nanomsy', title: 'sideBar.nanomsy', name: 'nanomsy', component: nanomsy },
             { path: 'all', title: 'sideBar.naAll', name: 'naAll', component: naAll },
             /* { path: 'fishing', title: 'NA捕鱼游戏报表', name: 'nafishing', component: naFishing },
             { path: 'truefive', title: 'NA真人H5报表', name: 'natruehfive', component: natruehfive } */
           ]
         },
         {
           path: '/sagame',
           title: 'SA游戏报表',
           name: 'sagame',
           component: main,
           children: [
             { path: 'all', title: 'sideBar.saAll', name: 'saAll', component: saAll },
             { path: 'fishing', title: 'sideBar.saFish', name: 'safishing', component: safishing },
             { path: 'true', title: 'sideBar.saTrue', name: 'satrue', component: satrue }
           ]
         },
         {
           path: '/sbgame',
           title: 'SB游戏报表',
           name: 'sbgame',
           component: main,
           children: [
             { path: 'all', title: 'sideBar.sbAll', name: 'sbAll', component: sbAll },
             { path: 'video', title: 'sideBar.sbVideo', name: 'sbvideo', component: sbvideo },
             { path: 'true', title: 'sideBar.sbTrue', name: 'sbtrue', component: sbtrue }
           ]
         },
         {
           path: '/ttggame',
           title: 'TTG游戏报表',
           name: 'ttggame',
           component: main,
           children: [{ path: 'video', title: 'sideBar.ttgVideo', name: 'ttgvideo', component: ttgvideo }]
         },
         {
           path: '/kygame',
           title: 'KY游戏报表',
           name: 'kygame',
           component: main,
           children: [{ path: 'chess', title: 'sideBar.kyChess', name: 'kychess', component: kyChess }]
         },
         {
           path: '/rtg',
           title: 'RTG游戏',
           name: 'rtg',
           component: main,
           children: [{ path: 'game', title: 'sideBar.rtgGame', name: 'rtgGame', component: rtgGame }]
         },
         {
           path: '/dt',
           title: 'dt',
           name: 'dt',
           component: main,
           children: [{ path: 'video', title: 'sideBar.dtGame', name: 'dtGame', component: dtGame }]
         },
         {
           path: '/pp',
           title: 'pp',
           name: 'pp',
           component: main,
           children: [{ path: 'video', title: 'sideBar.ppGame', name: 'ppGame', component: ppGame }]
         },
         {
           path: '/ysb',
           title: 'YSB体育游戏',
           name: 'ysb',
           component: main,
           children: [{ path: 'sport', title: 'sideBar.ysbGame', name: 'ysbSport', component: ysbSport }]
         },
         {
           path: '/day',
           title: '日报表',
           name: 'day',
           component: main,
           children: [
             { path: 'dayCompany', title: 'sideBar.dayCompany', name: 'dayCompany', component: dayCompany },
             { path: 'dayMerchant', title: 'sideBar.dayMerchant', name: 'dayMerchant', component: dayMerchant }
           ]
         },
         {
           path: '/business',
           title: '商户中心',
           name: 'business',
           component: main,
           children: [
             { path: 'merchant', title: 'sideBar.merchantList', name: 'merchantList', component: merchantList },
             { path: 'manager', title: 'sideBar.managerList', name: 'dealerList', component: managerList }
           ]
         },
         {
           path: '/play',
           title: '玩家中心',
           name: 'play',
           component: main,
           children: [{ path: 'list', title: 'sideBar.player', name: 'playList', component: playerlist }]
         },
         {
           path: '/prizeList',
           title: '神秘奖记录',
           name: 'prizeList',
           component: main,
           children: [
             { path: 'index', title: 'sideBar.prizeList', name: 'prizeList', component: prizeList }
           ]
         }
       ]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [page404, loginRouter, otherRouter, ...appRouter]
