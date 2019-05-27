import { logList } from '@/service/index'
export const log = {
    state:{
       loading:false,
       adminLog:[],
       startKey:{},
       lineLog:[],
       merchantLog:[]
    },
    mutations:{
        logLoading(state,{params}){
            state.loading=params
        },//log
        //全部adminlog
        // updateAllAdminLog(state,{params}){
        //     state.allAdminLog.push(params);
        //     state.allAdminLog = _.uniqWith(state.allAdminLog, _.isEqual);
        // },  
        changeAdminLog(state,{params}){
            state.adminLog=params
        },
        changeStartKey(state,{params}){
            state.startKey=params
        },
        changeLineLog(state,{params}){
            state.lineLog=params
        },
        changeMerchantLog(state,{params}){
            state.merchantLog=params
        }
    },
    actions:{
      getAdminLog({commit},params){
        commit('logLoading',{params:true})
        return logList(params).then(res=>{
            if(res.code==0){
                commit('changeAdminLog',{params:res.payload.Items});
                commit('changeStartKey',{params:res.payload.LastEvaluatedKey})
                commit('logLoading',{params:false})
            }
        })
      },
      getMerchantLog({commit},params){
        commit('logLoading',{params:true})
          logList(params).then(res=>{
              commit('changeMerchantLog',{params:res.payload.Items})
              commit('changeStartKey',{params:res.payload.LastEvaluatedKey})
              commit('logLoading',{params:false})
              
          })
      },
      getLineLoginLog({commit},params){
        commit('logLoading',{params:true})
          logList(params).then(res=>{
              if(res.code==0){
                  commit('changeLineLog',{params:res.payload.Items})
                  commit('changeStartKey',{params:res.payload.LastEvaluatedKey})
                  commit('logLoading',{params:false})
              }
          })
      },
    }
}