import { http } from './http'
import { URL,httpType } from './urlConfig'
// import QS from 'qs'

// get请求 (url拼接参数，请求域名类别）
// 域名类别为: 不传域名默认为n1, 游戏相关接口为game
const get = (urls, type) => {
  let token=localStorage.getItem('agentToken');
  let headers={
    "Content-Type": "application/json; charset=utf-8",
    "Authorization":token
  }
  return {
    method: 'get',
    url: httpType+ URL + urls,
    headers: headers
  }
}

// post请求
const post = (urls, datas, type) => {
  let TOKEN='';
  let headers={};
  if(window.localStorage.getItem('agentToken')) {
    TOKEN = window.localStorage.getItem('agentToken')
    headers={
      "Content-Type": "application/json; charset=utf-8",
      "Authorization":TOKEN
    }
  }else{
    headers={
      "Content-Type": "application/json; charset=utf-8",
    }
  }
  let url = httpType+ URL;
  return {
    method: 'post',
    url:url+ urls,
    data:datas,                       //QS.stringify(datas),
    headers: headers
  }
}

//img
const Image = (method, url, data) => ({
  method: method,
  url: url,
  data: data,
  headers: {
    "Content-Type": "image"
  }
})

//example
export async function example(params) {
  return http()
}

//针对业务逻辑里的请求
export async function httpRequest(method,url,params,type) {
  //参数分别作用 （方法, 请求接口, 参数, 域名接口）
  switch (method) {
    case 'get':
      return http(get(url,type))
      break
    case 'post':
      return http(post(url,params,type))
      break
    case 'put':
      return http(Image(method,url,params))
      break
  }
}
//登录
export async function logIn(params){
    return http(post('/agentLogin',params))
}
//查询平台用户账单统计
export async function queryUserStat(params){
    return http(post('/queryUserStat',params))
}
//获取playlist
export async function queryPlayer(params){
    return http(post('/queryPlayerStat',params))
}
//获取玩家日报表
export async function queryPlayerDayStat(params) {
  return http(post('/query/playerDayStat', params))
}

//admin_center
export async function agentOne(userId){
    return http(get(`/agentOne/${userId}`))
}
//流水列表
export async function getWaterfall(userId){
    return http(get(`/waterfall/${userId}`))
}
//bill余额 个人中心
export async function getBill(userId){
    return http(get(`/bills/${userId}`))
}
//该密码
export async function updatePassword(params){
    return http(post('/updateAgentPassword',params))
}
//代理列表
export async function getagentList(params){
    return http(post('/agentList',params))
}
//代理玩家列表
export async function playerList(params){
    return http(post('/agent/player/list',params))
}
//获取日报表
export async function queryDayStat(params) {
  return http(post('/query/agentDayStat', params))
}
//转账
export async function billTransfer(params){
    return http(post('/billTransfer',params))
}
//player 加点
export async function addBill(params){
    return http(post('/agent/player/deposit',params))
}
//player 减点
export async function reduceBill(params){
    return http(post('/agent/player/take',params))
}
//告警时间
export async function configOne(params){
    return http(post('/configOne',params))
}
// 更新状态
export async function userChangeStatus(params){
    return http(post('/userChangeStatus',params))
}
//日志列表
export async function logList(params){
    return http(post('/logList',params))
}
//agentAdminList
export async function agentAdminList(params){
    return http(post('/agentAdminList',params))
}
//agent 添加admin
export async function agentAdminNew(params){
    return http(post('/agentAdminNew',params))
}
//验证存在
export async function checkExit(params){
    return http(post('/checkExist',params))
}
//config configNew
export async function configNew(params){
    return http(post('/configNew',params))
}
//checkAgentMix
export async function checkAgentMix(params){
    return http(post('/checkAgentMix',params))
}
//availableAgents
export async function availableAgents(params){
    return http(post('/availableAgents',params))
}
//gameBigType
export async function gameBigType(params){
    return http(post('/gameBigType',params))
}
//上级线路商游戏
export async function companySelect(params){
    return http(post('/companySelect',params))
}
//创建代理
export async function agentNew(params){
    return http(post('/agentNew',params))
}
//创建玩家
export async function creatPlayer(params){
    return http(post('/agent/player/create',params))
}
// 修改anget
export async function agentUpdate(params){
    return http(post('/agentUpdate',params))
}
//锁定玩家 
export async function frozen(params){
    return http(post('/player/forzen',params))
}
//新增角色
export async function subRoleNew(params) {
    return http(post('/subRoleNew',params))
}
//删除角色
export async function subRoleDelete(params) {
    return http(post('/subRoleDelete',params))
}
//管理员角色列表更新角色
export async function subRoleUpdate(params) {
    return http(post('/subRoleUpdate',params))
}
//获取下级角色
export async function getsbuRole(params){
    return http(post('/subRoleList',params))
}
//管理员角色修改
export async function updateSubrole(params){
    return http(post('/updateSubrole',params))
}