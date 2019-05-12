import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const domain = 'http://localhost:3000'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    centerScroll: 0,
    homeScroll: 0,
    exploreScroll: 0
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
    }
  },
  actions: {
    // 登录
    async login(state, data) {
      const res = await axios.post(`${domain}/gserver/auth/login`, data)
      return res.data
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
      const res = await fetch(`${domain}/webapi/test`)
      const d = await res.json()
      console.log(d)
      return d
      // return (await fetch(`${domain}/webapi/test`)).json();
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
