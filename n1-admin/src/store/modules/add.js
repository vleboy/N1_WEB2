import { avalibleManager, addUsers } from '@/service/index'
export const add = {
  state: {
    subRoleList: [],
    isEdit: false,
    operatorList: '',
    gameIden: '',
    gameOneItem: '',
    isRefresh: false
  },
  mutations: {
    changeSubrole(state, { params }) {
      state.subRoleList = params
    },
    openEditState(state, payload) {
      state.isEdit = true
    }, // 是否是编辑状态
    closeEditState(state, payload) {
      state.isEdit = false
    }, // 是否是编辑状态
    changeRefresh(state, payload) {
      state.isRefresh = payload.data
    }, // 是否是编辑状态
    storageOperatorList(state, payload) {
      state.operatorList = payload.data
    },
    gameOperatorIden(state, payload) {
      state.gameIden = payload.data
    },
    storageGameOneItem(state, payload) {
      state.gameOneItem = payload.data
    }
  },
  actions: {
    getSubrole({ commit }) {
      avalibleManager().then(res => {
        if (res.code == 0) {
          commit('changeSubrole', { params: res.payload })
        }
      })
    },
    newUser({ commit }, params) {
      return addUsers(params)
    }
  }
}
