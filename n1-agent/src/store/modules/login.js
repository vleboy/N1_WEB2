import {logIn,agentOne,updatePassword} from '@/service/index'
import {Message} from 'iview'
export const login = {
    state:{
        // getcode:'',
        infos:{},
        loading:false,
    },
    mutations:{
        // updateCode(state,{params}){
        //     state.getcode=`data:image/png;base64,${params}`
        // },
        saveInfo(state,{params}){
            state.infos=params
        },
        changeLoading(state,{params}){
            state.loading=params
        },
    },
    actions:{
        // getcapcha({state,commit},params){
        //     getCode(params).then(res=>{
        //         if(res.code==0){
        //             commit('updateCode',{params:res.payload})
        //         }
        //     })
        // },
        userlogin({commit},params){
            let {cb,err,...rest}=params
            logIn(rest).then(res=>{
                // console.log(res);
                if(res.code==0){
                    if(localStorage.getItem('agentToken')) {
                        localStorage.removeItem('agentToken');
                        localStorage.setItem('agentToken', res.payload.token)
                    }else{
                        localStorage.setItem('agentToken', res.payload.token);
                    }
                    setTimeout(()=>localStorage.removeItem('agentToken'),259200000);
                    localStorage.setItem('displayName',res.payload.displayName);
                    localStorage.setItem('userInfo',JSON.stringify(res.payload))
                    localStorage.setItem('userId',res.payload.userId)
                    localStorage.setItem('level',res.payload.level)
                    commit('saveInfo',{params:res.payload});
                    cb && cb()
                }else{
                    commit('changeLoading',{params:false});
                    err && err()
                }
            })
        },
        changePassword({commit},params){
         let userId = localStorage.userId;
            updatePassword(params).then(res=>{
                if(res.code==0){
                    Message.success('修改成功');
                    agentOne(userId).then(re=>{
                        if(re.code==0){
                            commit('updateAdmin',{params:re.payload})
                        }
                    })
                }
            })
        }
    }
}
