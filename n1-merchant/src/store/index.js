import Vue from 'vue'
import Vuex from 'vuex'
import {login} from './modules/login'
import {home} from './modules/home'
import {report} from './modules/report'
Vue.use(Vuex)
export const store = new Vuex.Store({
    state:{
        loading:false,
        language: 'zh'
    },
    mutations:{
        globalLoading(state,{params}){
            state.loading=params
        },
        changeLanguage(state, params) {
            state.language = params
        }
    },
    modules: {
        login,
        home,
        report,
    }
})