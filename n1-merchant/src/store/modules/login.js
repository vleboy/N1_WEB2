import { logIn, adminCenter,updatePassword } from '@/service/index'
import { Message } from 'iview'
export const login = {
    state: {
        // getcode:'',
        infos: {},
        admininfo: {},
        balance: null,
        waterfall: []
    },
    mutations: {
        // updateCode(state,{params}){
        //     state.getcode=`data:image/png;base64,${params}`
        // },
        saveWaterfall(state, { params }) {
            state.waterfall = params
        },
        saveInfo(state, { params }) {
            state.infos = params
        },
        updateAdmin(state, { params }) {
            state.admininfo = params
        },
        updateBill(state, { params }) {
            state.balance = params
        },
    },
    actions: {
        
        changePassword({ commit }, params) {
            return updatePassword(params)
        },
        updatePwd({ commit }, params) {
            updatePassword(params).then(res => {
                if (res.code == 0) {
                    Message.success('修改成功');
                }
            })
        }
    }
}
