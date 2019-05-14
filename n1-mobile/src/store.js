import Vue from 'vue'
import Vuex from 'vuex'
// import axios from 'axios'
// const domain = 'http://localhost:3000'
const domain = 'https://d3prd6rbitzqm3.cloudfront.net'

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
        headers: {
          'content-type': 'application/json',
          'Authorization': localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')).token : null
        },
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
    regPlayer(state, data) {
      return axios.post('/agent/player/create', data)
    },
    // 注册用户
    regUser(state, data) {
      return axios.post('/agentNew', data)
    },
    // 更新玩家
    updatePlayer(state, data) {
      return axios.post('/player/forzen', data)
    },
    // 更新玩家密码
    updatePlayerPassword(state, data) {
      return axios.post('/agent/player/password', data)
    },
    // 更新用户
    updateUser(state, data) {
      return axios.post('/userChangeStatus', data)
    },
    // 更新用户游戏
    // updateUserGame(state, data) {
    //   return axios.post('/', data)
    // },
    // 更新用户密码
    updateUserPassword(state, data) {
      return axios.post('/updateAgentPassword', data)
    },
    // 获取所有玩家
    getPlayerPage(state, data) {
      return axios.get('/agent/player/list')
    },
    // 获取所有用户
    getUserPage(state, data) {
      return axios.get('/agentList')
    },
    // 获取报表
    getReportList(state, data) {
      return axios.get(`/queryPlayerStat?startTime=${data.startTime}&endTime=${data.endTime}`)
    },
    // 获取实时数据
    getRealtimeData(state, data) {
      return axios.get('/')
    }
  }
})
export default vuex