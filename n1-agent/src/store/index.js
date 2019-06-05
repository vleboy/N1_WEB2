import Vue from 'vue'
import Vuex from 'vuex'
import {login} from './modules/login'
import {home} from './modules/home'
import {agent} from './modules/agent'
import {log} from './modules/log'
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
        agent,
        log
    }
})