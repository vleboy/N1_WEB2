import Vue from 'vue'
import Vuex from 'vuex'
import {login} from './modules/login'
import {home} from './modules/home'
import {report} from './modules/report'
Vue.use(Vuex)
export const store = new Vuex.Store({
    state:{
        loading:false
    },
    mutations:{
     globalLoading(state,{params}){
        state.loading=params
        },
    },
    modules: {
        login,
        home,
        report,
    }
})