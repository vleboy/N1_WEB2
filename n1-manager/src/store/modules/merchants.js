import { queryUserStat, queryPlayer, getMerchants, getManagers, getBill, billTransfer, queryUserDayStat, queryManagerDayStat } from '@/service/index'
import { Message } from 'iview'
export const merchants = {
  state: {
    merchantsList: [],
    managerList: [],
    spinShow: false,
    bill: null
  },
  mutations: {
    updateList(state, { params }) {
      state.merchantsList = params
    },
    updateManager(state, { params }) {
      state.managerList = params
    },
    changeLoading(state, { params }) {
      state.spinShow = params
    },
    updateBill(state, { params }) {
      state.bill = params
    }
  },
  actions: {
    getMerchantsList({ commit }, params) {
      commit('changeLoading', { params: true })
      getMerchants(params).then(res => {
        commit('updateList', { params: res.payload })
        commit('changeLoading', { params: false })
      })
    },
    getManagerList({ commit }, params) {
      commit('changeLoading', { params: true })
      getManagers(params).then(res => {
        commit('updateManager', { params: res.payload })
        commit('changeLoading', { params: false })
      })
    },
    otherBill({ commit }, id) {
      getBill(id).then(res => {
        commit('updateBill', { params: res.payload.balance })
      })
    },
    detailBill({ dispatch, commit }, params) {
      return billTransfer(params)
    },
    transferBill({ dispatch, commit }, params) {
      billTransfer(params).then(res => {
        if (res.code == 0) {
          Message.success('操作成功')
          //刷新
          dispatch('getManagerList', {
            query: {},
            sortkey: 'createdAt',
            sort: 'desc'
          })
        }
      })
    },
    transferBussnessBill({ dispatch, commit }, params) {
      billTransfer(params).then(res => {
        if (res.code == 0) {
          Message.success('操作成功')
          //刷新
          dispatch('getMerchantsList', {
            query: {},
            sortkey: 'createdAt',
            sort: 'desc'
          })
        }
      })
    },
    //report
    getUserList({ commit }, params) {
      return queryUserStat(params)
    },
    getUserChild({ commit }, params) {
      return queryUserStat(params)
    },
    getPlayerList({ commit }, params) {
      return queryPlayer(params)
    },
    getManagerDayStat({ commit }, params) {
      return queryManagerDayStat(params)
    },
    getUserDayStat({ commit }, params) {
        return queryUserDayStat(params)
    },
  }
}
