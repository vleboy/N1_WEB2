import { queryUserStat, queryPlayer, queryDayStat, queryUserDayStat, queryManagerDayStat, queryPlayerDayStat } from '@/service/index'
export const report = {
  state: {},
  mutations: {},
  actions: {
    getUserList({ commit }, params) {
      return queryUserStat(params)
    },
    getUserChild({ commit }, params) {
      return queryUserStat(params)
    },
    getPlayerList({ commit }, params) {
      return queryPlayer(params)
    },
    getDayStat({ commit }, params) {
      return queryDayStat(params)
    },
    getUserDayStat({ commit }, params) {
      return queryUserDayStat(params)
    },
    getManagerDayStat({ commit }, params) {
      return queryManagerDayStat(params)
    },
    getPlayerDayStat({ commit }, params) {
      return queryPlayerDayStat(params)
    }
  }
}
