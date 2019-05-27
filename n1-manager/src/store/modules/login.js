import { logIn,updatePassword } from '@/service/index'
import { Message } from 'iview'
export const login = {
    state: {
        // getcode:'',
        infos: {},
        loading: false,
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
        updateLoading(state, { params }) {
            state.loading = params
        },
        updateAdmin(state, { params }) {
            state.admininfo = params
        },
        updateBill(state, { params }) {
            state.balance = params
        },
    },
    actions: {
        // getcapcha({state,commit},params){
        //     getCode(params).then(res=>{
        //         if(res.code==0){
        //             commit('updateCode',{params:res.payload})
        //         }
        //     })
        // },
        userlogin({ commit }, params) {
            let {cb,err,...rest}=params
            logIn(rest).then(res => {
                if (res.code == 0) {
                    if (localStorage.getItem('managerToken')) {
                        localStorage.removeItem('managerToken');
                        localStorage.setItem('managerToken', res.payload.token)
                    } else {
                        localStorage.setItem('managerToken', res.payload.token);
                    }
                    setTimeout(() => localStorage.removeItem('managerToken'), 259200000);
                    localStorage.setItem('userInfo', JSON.stringify(res.payload))
                    localStorage.setItem('loginId', res.payload.userId)
                    localStorage.setItem('loginRole', res.payload.role)
                    commit('saveInfo', { params: res.payload });
                    cb && cb()
                } else {
                    commit('updateLoading', { params: false });
                    err && err()
                }
            })
        },
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
