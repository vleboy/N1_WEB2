import Vue from 'vue'
import Vuex from 'vuex'
import {login} from './modules/login'
import {home} from './modules/home'
import {log} from './modules/log'
import {merchants} from './modules/merchants'
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
        log,
        merchants
    }
})