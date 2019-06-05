import main from '@/pages/main'
import login from '@/pages/login'
import err404 from '@/pages/404'

import home from '@/pages/home'
import playerDetail from '@/pages/player/playerdetail'
import agentDetail from '@/pages/agentCenter/agentDetail'

//reports
import dayCompany from '@/pages/day/dayCompany'
import dayPlayer from '@/pages/day/dayPlayer'
import ownSpace from '@/pages/ownSpace'
import board from '@/pages/board/board'
import allReport from '@/pages/reports/allReport'
import playerReport from '@/pages/reports/playerReport'
import agtrue from '@/pages/reports/agTrueGame'
import mgvideo from '@/pages/reports/mgVideoGame'
import nacard from '@/pages/reports/naCardGame'
import nahfive from '@/pages/reports/nahfive'
import nanomsy from '@/pages/reports/nanomsy'
import nastreet from '@/pages/reports/naStreetGame'
import natrue from '@/pages/reports/naTrueGame'
import navideo from '@/pages/reports/naVideoGame'
import naFishing from '@/pages/reports/naFishing'
import naAll from '@/pages/reports/naAllReport'
import saAll from '@/pages/reports/saAllReport'
import safishing from '@/pages/reports/saFishingGame'
import sbAll from '@/pages/reports/sbAllReport'
import sbvideo from '@/pages/reports/sbVideoGame'
import sbtrue from '@/pages/reports/sbTrueGame'
import satrue from '@/pages/reports/saTrueGame'
import ttgvideo from '@/pages/reports/ttgVideoGame'
import ysbSport from '@/pages/reports/ysbSport'
import rtgGame from '@/pages/reports/rtgGame'
import dtGame from '@/pages/reports/dtReport'
import ppGame from '@/pages/reports/ppGame'
import pgVideo from '@/pages/reports/pgVideo'
import habaVideo from '@/pages/reports/habaVideo'
import pngVideo from '@/pages/reports/pngVideo'
import natruehfive from '@/pages/reports/naTrueHfive'
import kyChess from '@/pages/reports/kyChess'
// import prizeList from '@/pages/opreateCenter/prizeList'
import operationLog from '@/pages/logCenter/operationLog'
import loginLog from '@/pages/logCenter/loginLog'
import agentList from '@/pages/agentCenter/agentList'
import warnList from '@/pages/agentCenter/warnList'
import adminLoginLog from '@/pages/logCenter/adminLoginLog'
import adminOpreateLog from '@/pages/logCenter/adminOpreateLog'
import agentLoginLog from '@/pages/logCenter/agentLoginLog'
import agentOpreateLog from '@/pages/logCenter/agentOpreateLog'
import adminList from '@/pages/adminCenter/adminList'
import agentRole from '@/pages/adminCenter/agentRole'
import createRole from '@/pages/adminCenter/createRole'

import gameConfig from '@/pages/gameCenter/gameConfig'
import playerList from '@/pages/player/playerlist'
export const loginRouter = {
    path: '/login',
    name: 'login',
    // meta: {
    //     title: 'Login - 登录'
    // }
    meta: {
        requireAuth: false
      },
    component: login
};
export const page404 = {
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
        { path: 'agentDetail', name: 'agentDetail',title:'代理详情', component: agentDetail},
        { path: 'detail', name:'playDetail', title:'玩家详情', component:playerDetail},
        { path: 'createRole', name: 'createRole',title:'创建新角色', component: createRole},
    ]
};
// 作为main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path:'/ownspace',
        title:'个人中心',
        name:'ownspace',
        component:main,
        children:[{path:'index',title:'个人中心', name:'ownspace-index',component:ownSpace}]
    },
    /* {
      path:'/boards',
      title:'看板',
      name:'boards',
      component:main,
      children:[{path:'board',title:'看板', name:'board',component:board}]
    }, */
    {
        path:'/allreport',
        title:'公司输赢总报表',
        name:'all',
        component:main,
        children:[{path:'all',title:'公司输赢总报表',name:'allreport',component:allReport}]
    },
    {
        path:'/player',
        title:'玩家输赢总报表',
        name:'player',
        component:main,
        children:[{path:'all',title:'玩家输赢总报表',name:'playerReport',component:playerReport}]
    },
    {
        path:'/png',
        title:'PNG电子游戏报表',
        name:'png',
        component:main,
        children:[{path:'video',title:'PNG电子游戏报表',name:'pngGame',component:pngVideo}]
    },
    {
        path:'/aggame',
        title:'AG游戏报表',
        name:'aggame',
        component:main,
        children:[{path:'true',title:'AG真人游戏报表',name:'agtrue',component:agtrue}]
    },
    {
        path:'/mggame',
        title:'MG游戏报表',
        name:'mggame',
        component:main,
        children:[{path:'video',title:'MG电子游戏报表',name:'mgvideo',component:mgvideo}]
    },
    {
        path:'/nagame',
        title:'NA游戏报表',
        name:'nagame',
        component:main,
        children:[
            {path:'card',title:'NA棋牌游戏报表',name:'nacard',component:nacard},
            {path:'street',title:'NA街机游戏报表',name:'nastreet',component:nastreet},
            {path:'true',title:'NA真人游戏报表',name:'natrue',component:natrue},
            {path:'video',title:'NA电子游戏报表',name:'navideo',component:navideo},
            {path:'fishing',title:'NA捕鱼游戏报表',name:'nafishing',component:naFishing},
            {path:'all',title:'NA游戏总报表',name:'naAll',component:naAll},
            {path:'hfive',title:'NA电子H5报表',name:'nahfive',component:nahfive},
            { path: 'nanomsy', title: 'NA电子H5无神秘奖报表', name: 'nanomsy', component: nanomsy},
            {path:'truefive',title:'NA真人H5报表',name:'natruehfive',component:natruehfive}
        ]
    },
    {
        path:'/sagame',
        title:'SA游戏报表',
        name:'sagame',
        component:main,
        children:[
            {path:'all',title:'SA游戏总报表',name:'saAll',component:saAll},
            {path:'fishing',title:'SA捕鱼游戏报表',name:'safishing',component:safishing},
            {path:'true',title:'SA真人游戏报表',name:'satrue',component:satrue},
        ]
    },
    {
        path:'/sbgame',
        title:'SB游戏报表',
        name:'sbgame',
        component:main,
        children:[
            {path:'all',title:'SB游戏总报表',name:'sbAll',component:sbAll},
            {path:'video',title:'SB电子游戏报表',name:'sbvideo',component:sbvideo},
            {path:'true',title:'SB真人游戏报表',name:'sbtrue',component:sbtrue},
        ]
    },
    {
        path:'/ttggame',
        title:'TTG游戏报表',
        name:'ttggame',
        component:main,
        children:[{path:'video',title:'TTG电子游戏报表',name:'ttgvideo',component:ttgvideo}]
    },
    {
        path: '/kygame',
        title: 'KY游戏报表',
        name: 'kygame',
        component: main,
        children: [{ path: 'chess', title: 'KY棋牌游戏报表', name: 'kychess', component: kyChess }]
    },
    {
        path:'/ysb',
        title:'YSB体育游戏',
        name:'ysb',
        component:main,
        children:[{path:'sport',title:'YSB体育游戏报表',name:'ysbSport',component:ysbSport}]
    },
    {
        path:'/rtg',
        title:'RTG游戏',
        name:'rtg',
        component:main,
        children:[{path:'game',title:'RTG电子游戏报表',name:'rtgGame',component:rtgGame}]
    },
    {
        path:'/dt',
        title:'dt',
        name:'dt',
        component:main,
        children:[{path:'video',title:'DT电子游戏报表',name:'dtGame',component:dtGame}]
    },
    {
        path:'/pp',
        title:'pp',
        name:'pp',
        component:main,
        children:[{path:'video',title:'PP电子游戏报表',name:'ppGame',component:ppGame}]
    },
    {
        path:'/pg',
        title:'PG电子游戏报表',
        name:'pg',
        component:main,
        children:[{path:'video',title:'PG电子游戏报表',name:'pgGame',component:pgVideo}]
    },
    {
        path:'/haba',
        title:'HABA电子游戏报表',
        name:'haba',
        component:main,
        children:[{path:'video',title:'HABA电子游戏报表',name:'habaGame',component:habaVideo}]
    },
    {
        path: '/dayCompany',
        title: '代理日报表',
        name: 'dayCompany',
        component: main,
        children: [{ path: 'dayCompany', title: '代理日报表', name: 'dayCompany', meta: { keepAlive: true }, component: dayCompany }]
    },
    {
        path: '/dayPlayer',
        title: '玩家日报表',
        name: 'dayPlayer',
        component: main,
        children: [{ path: 'dayPlayer', title: '玩家日报表', name: 'dayPlayer', meta: { keepAlive: true }, component: dayPlayer }]
    },
    {
        path:'/agent',
        title:'代理列表',
        name:'agent',
        component:main,
        children:[
            {path:'list',title:'代理列表',name:'agentList',component:agentList},
            {path:'warn',title:'警告列表',name:'warnList',component:warnList}
        ]
    },
    {
        path:'/log',
        title:'日志中心',
        name:'log',
        component:main,
        children:[
            { path: 'loginLog', title: '登录日志', name: 'loginLog', component: loginLog },
            { path: 'operationLog', title: '操作日志', name: 'operationLog', component: operationLog },
            /* {path:'adminLogin',title:'管理员登录日志',name:'adminLoginLog',component:adminLoginLog},
            {path:'agentLogin',title:'代理登录日志',name:'agentLoginLog',component:agentLoginLog},
            {path:'adminOpreate',title:'管理员操作日志',name:'adminOpreateLog',component:adminOpreateLog},
            {path:'agentOpreate',title:'代理操作日志',name:'agentOpreateLog',component:agentOpreateLog}, */
        ]
    },
    {
        path:'/admin',
        title:'管理中心',
        name:'admin',
        component:main,
        children:[
            {path:'list',title:'管理员列表',name:'adminList',component:adminList},
            {path:'role',title:'代理角色列表',name:'agentRole',component:agentRole},
        ]
    },
    {
        path:'/game',
        title:'游戏中心',
        name:'game',
        component:main,
        children:[
            {path:'config',title:'包房代理游戏配置',name:'gameConfig',component:gameConfig},
        ]
    },
    // {
    //     path:'/opreate',
    //     title:'运营中心',
    //     name:'opreate',
    //     component:main,
    //     children:[
    //         {path:'prize',title:'神秘大奖',name:'prizeList',component:prizeList},
    //     ]
    // },
    {
      path:'/play',
      title:'玩家列表',
      name:'play',
      component:main,
      children:[
        {path:'list',title:'玩家列表',name:'playList',component:playerList}
      ]
    }

]
// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    page404,
    loginRouter,
    otherRouter,
    ...appRouter,
];

