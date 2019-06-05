import { queryUserStat, queryPlayer, getagentList, playerList, billTransfer, addBill, reduceBill, queryDayStat, queryPlayerDayStat } from '@/service/index'
import {Message} from 'iview'
export const agent = {
    state:{
       agentList:[],
       loading:false,
       playerList:[],
    },
    mutations:{
      changeList(state,{params}){
        state.agentList=params
      },
      agentLoading(state,{params}){
        state.loading=params
      },
      changePlayer(state,{params}){
        state.playerList=params
      },
    },
    actions:{
       getUserList({commit},params){
        return queryUserStat(params)
       },
       getUserChild({commit},params){
        return queryUserStat(params)
       },
       getPlayerList({commit},params){
         return queryPlayer(params)
       },
       //agent
       getAgentPlayer({commit},params){
         playerList(params).then(res=>{
           if(res.code==0){
             commit('changePlayer',{params:res.list})
             commit('agentLoading',{params:false})
           }
         })
       },
       getAgentNext({commit},params){
        return getagentList(params)
       },
       getAgentList({commit},params){
        getagentList(params).then(res=>{
            if(res.code==0){
              commit('changeList',{params:res.payload});
              commit('agentLoading',{params:false})
            }
          })
       },
      getDayStat({ commit }, params) {
        return queryDayStat(params)
      },

      getPlayerDayStat({ commit }, params) {
        return queryPlayerDayStat(params)
      },
       //bill
       transferBill({dispatch,commit},params){
         commit('agentLoading',{params:true})
         billTransfer(params).then(res=>{
           if(res.code==0){
             Message.success('操作成功');
            }else{
            commit('agentLoading',{params:false})
            }
        })
       },
       //玩家加减点
       playAddBill({commit,dispatch,state},params){
         commit('agentLoading',{params:true})
        addBill(params).then(res=>{
          if(res.code==0){
            Message.success('操作成功');
            setTimeout(() => {//延迟200ms执行,解决未同步刷新
              dispatch('getAgentPlayer',{
                fromUserId:params.fromUserId
              })
              .finally(()=>{
                commit('agentLoading',{params:false})
              })
           }, 200);
          }else{
            commit('agentLoading',{params:false})
          }
        })
       },
       playReduceBill({commit,dispatch,state},params){
         commit('agentLoading',{params:true})
         reduceBill(params).then(res=>{
           if(res.code==0){
            Message.success('操作成功');
            setTimeout(() => {
              dispatch('getAgentPlayer',{
                fromUserId:params.fromUserId
              })
              .finally(()=>{
                commit('agentLoading',{params:false})
              })
           }, 200);
           }else{
            commit('agentLoading',{params:false})
           }
         })
       }
    }
}