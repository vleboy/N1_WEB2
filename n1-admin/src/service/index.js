import { http } from './http'
import { URL } from './urlConfig'
// import QS from 'qs'

// get请求 (url拼接参数，请求域名类别）
// 域名类别为: 不传域名默认为n1, 游戏相关接口为game
const get = (urls, type, params) => {
  let token = localStorage.getItem('n1token')
  let headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: token
  }
  return {
    method: 'get',
    url: URL(type) + urls,
    params: params,
    headers
  }
}

// post请求
const post = (urls, datas, type) => {
  let TOKEN = ''
  let headers = {}
  if (window.localStorage.getItem('n1token')) {
    TOKEN = window.localStorage.getItem('n1token')
    headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: TOKEN
    }
  } else {
    headers = {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }
  return {
    method: 'post',
    url: URL(type) + urls,
    data: datas, //QS.stringify(datas),
    headers: headers
  }
}

//img
const Image = (method, url, data) => ({
  method: method,
  url: url,
  data: data,
  headers: {
    'Content-Type': 'image'
  }
})

//针对业务逻辑里的请求
export async function httpRequest(method, url, params, type) {
  //参数分别作用 （方法, 请求接口, 参数, 域名接口）
  switch (method) {
    case 'get':
      return http(get(url, type, params))
    case 'post':
      return http(post(url, params, type))
    case 'put':
      return http(Image(method, url, params))
  }
}

//example
export async function example(params) {
  return http()
}

//登录
export async function logIn(params) {
  return http(post('/users/auth', params))
}
//查询平台用户账单统计
export async function queryUserStat(params) {
  return http(post('/queryUserStat', params))
}
//获取playlist
export async function queryPlayer(params) {
  return http(post('/queryPlayerStat', params))
}
//获取公司日报表
export async function queryDayStat(params) {
  return http(post('/query/platDayStat', params))
}
//商户日报表
export async function queryUserDayStat(params) {
  return http(post('/query/userDayStat', params))
}
//线路商日报表
export async function queryManagerDayStat(params) {
  return http(post('/query/managerDayStat', params))
}
//玩家日报表
export async function queryPlayerDayStat(params) {
  return http(post('/query/playerDayStat', params))
}

//admin_center
export async function adminCenter() {
  return http(get('/admin_center'))
}
//流水列表
export async function getWaterfall(userId) {
  return http(get(`/waterfall/${userId}`))
}
//bill余额 个人中心
export async function getBill(userId) {
  return http(get(`/bills/${userId}`))
} //otherbill

//商户列表
export async function getMerchants(params) {
  return http(post('/merchants', params))
}
//单个商户
export async function oneMerchants(userId) {
  return http(get(`/merchants/${userId}`))
}
//线路商列表
export async function getManagers(params) {
  return http(post('/managers', params))
}
//单个路商
export async function oneManagers(userId) {
  return http(get(`/managers/${userId}`))
}
//改密码
export async function updatePassword(params) {
  return http(post('/updatePassword', params))
}
//转账
export async function billTransfer(params) {
  return http(post('/billTransfer', params))
}
//管理员列表
export async function adminList(params) {
  return http(post('/adminList', params))
}
//线路号列表
export async function lineNumlist(params) {
  return http(post('/msnList', params))
}
//日志列表
export async function logList(params) {
  return http(post('/logList', params))
}
//停用启用线路号
export async function changeLineStatus(line, type) {
  return http(get(`/lockmsn/${line}/${type}`))
}
//获取下级角色
export async function getsbuRole(params) {
  return http(post('/subRoleList', params))
}
//创建管理员
export async function createAdmin(params) {
  return http(post('/admins', params))
}
//创商户
//可用线路商
export async function avalibleManager() {
  return http(get('/avalible_managers'))
}

//验证存在
export async function checkExit(params) {
  return http(post('/checkExist', params))
}

//添加线路商/商户
export async function addUsers(params) {
  return http(post('/users', params))
}
//上级线路商游戏
export async function companySelect(params) {
  return http(post('/companySelect', params))
}
//随机msn
export async function msnRandom() {
  return http(get('/msnRandom'))
}
//检查msn可用
export async function checkMsn(num) {
  return http(get(`/check_msn/${num}`))
}
//新增角色
export async function subRoleNew(params) {
  return http(post('/subRoleNew', params))
}
//删除角色
export async function subRoleDelete(params) {
  return http(post('/subRoleDelete', params))
}
//管理员角色列表更新角色
export async function subRoleUpdate(params) {
  return http(post('/subRoleUpdate', params))
}
//管理员列表更新角色
export async function adminUpdate(params) {
  return http(post('/adminUpdate', params))
}
//线路商 更新状态
export async function userChangeStatus(params) {
  return http(post('/userChangeStatus', params))
}
//更新线路商
export async function updateManagers(userId, params) {
  return http(post(`/managers/${userId}`, params))
}
//更新商户
export async function updateMerchant(userId, params) {
  return http(post(`/merchants/${userId}`, params))
}
//下级列表
export async function childList(id, role) {
  return http(get(`/childList/${id}/${role}`))
}
//告警时间
export async function configOne(params) {
  return http(post('/configOne', params))
}
