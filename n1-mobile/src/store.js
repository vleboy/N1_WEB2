import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
const domain = 'http://localhost:3000'

Vue.use(Vuex)

// 封装fetch
const axios = {
  async get(url) {
    try {
      vuex.commit("openLoading", true);
      let res = await fetch(`${domain}${url}`, {
        headers: {
          'Authorization': JSON.parse(localStorage.getItem('token')).token
        }
      })
      let obj = await res.json()
      vuex.commit("openLoading", false)
      if (obj.code != 0) {
        vuex.commit("setErr", true)
        vuex.commit("setErrMsg", obj.msg)
        vuex.commit("setErrColor", "warning")
      }
      return obj
    } catch (error) {
      vuex.commit("openLoading", false)
      vuex.commit("setErr", true)
      vuex.commit("setErrMsg", '网络中断')
      vuex.commit("setErrColor", "error")
      console.error(error)
      return { code: 'error', msg: '网络中断' }
    }
  },
  async post(url, data) {
    try {
      vuex.commit("openLoading", true);
      let res = await fetch(`${domain}${url}`, {
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
        method: 'POST'
      })
      let obj = await res.json()
      vuex.commit("openLoading", false)
      if (obj.code != 0) {
        vuex.commit("setErr", true)
        vuex.commit("setErrMsg", obj.msg)
        vuex.commit("setErrColor", "warning")
      }
      return obj
    } catch (error) {
      vuex.commit("openLoading", false)
      vuex.commit("setErr", true)
      vuex.commit("setErrMsg", '网络中断')
      vuex.commit("setErrColor", "error")
      console.error(error)
      return { code: 'error', msg: '网络中断' }
    }
  }
}
// 全局状态机
const vuex = new Vuex.Store({
  state: {
    // APP滚动位置
    centerScroll: 0,
    homeScroll: 0,
    exploreScroll: 0,
    // 网络请求状态
    openLoading: false,
    err: false,
    errMsg: "",
    errColor: "warning"
  },
  mutations: {
    // APP滚动位置
    setHomeScroll(state, params) {
      state.homeScroll = params
    },
    setCenterScroll(state, params) {
      state.centerScroll = params
    },
    setExploreScroll(state, params) {
      state.exploreScroll = params
    },
    // 网络请求状态
    openLoading(state, params) {
      state.openLoading = params
    },
    setErr(state, params) {
      state.err = params
    },
    setErrMsg(state, params) {
      state.errMsg = params
    },
    setErrColor(state, params) {
      state.errColor = params
    }
  },
  actions: {
    // 登录
    login(state, data) {
      return axios.post('/agentLogin', data)
    },
    // 注册玩家
    async regPlayer() {

    },
    // 注册用户
    async regUser() {

    },
    // 更新玩家
    async updatePlayer() {

    },
    // 更新用户
    async updateUser() {

    },
    // 获取所有玩家
    async getPlayerPage(state, data) {
      return axios.get('/agent/player/list')
    },
    // 获取所有用户
    async getUserPage(state, data) {

    },
    // 获取报表
    async getReportList() {

    },
    // 获取实时数据
    async getRealtimeData() {

    }
  }
})
export default vuex