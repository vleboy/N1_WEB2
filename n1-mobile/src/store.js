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
      let res = await fetch(`${domain}${url}`)
      let obj = await res.json()
      obj.code != 0 ? vuex.commit("openLoading", false) : null
      return obj
    } catch (error) {
      vuex.commit("openLoading", false);
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
      obj.code != 0 ? vuex.commit("openLoading", false) : null
      return obj
    } catch (error) {
      vuex.commit("openLoading", false);
      console.error(error)
      return { code: 'error', msg: '网络中断' }
    }
  }
}
// 全局状态机
const vuex = new Vuex.Store({
  state: {
    centerScroll: 0,
    homeScroll: 0,
    exploreScroll: 0,
    openLoading: false,
  },
  mutations: {
    setHomeScroll(state, params) {
      state.homeScroll = params
    },
    setCenterScroll(state, params) {
      state.centerScroll = params
    },
    setExploreScroll(state, params) {
      state.exploreScroll = params
    },
    openLoading(state, params) {
      state.openLoading = params
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
    // 获取玩家分页
    async getPlayerPage(state, data) {
    },
    // 获取用户分页
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