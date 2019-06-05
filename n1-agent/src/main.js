// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {appRouter} from './router/router'
import {router} from './router/index';
import { store } from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import echarts from 'echarts/dist/echarts.common'

Vue.prototype.axios = axios

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(iView);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // // 显示打开的页面的列表
        this.$store.commit('setOpenedList' ,{currentPageName:this.currentPageName});
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
        this.$Message.config({
            top: 50,
            duration: 4
        });
    }
})
