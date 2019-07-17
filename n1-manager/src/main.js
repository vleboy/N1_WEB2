// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {appRouter} from './router/router'
import {router} from './router/index';
import { store } from './store'
import iView from 'iview';
//import 'iview/dist/styles/iview.css'
import '../my-theme/index.less'
import axios from 'axios'

import VueI18n from 'vue-i18n';
import en from './language/en';
import zh from './language/zh';

Vue.prototype.axios = axios


Vue.config.productionTip = false

Vue.use(VueI18n);
//Vue.use(iView);
/* eslint-disable no-new */
Vue.locale = () => {};

const messages = {
    en,
    zh
};

const i18n = new VueI18n({
    locale: localStorage.language || 'zh',
    messages,
    silentTranslationWarn: true
})

Vue.use(iView, {
    i18n: (key, value) => i18n.t(key, value)
})

document.title = localStorage.title || 'NA线路商后台',

new Vue({
    el: '#app',
    i18n,
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // // 显示打开的页面的列表
        this.$store.commit('setOpenedList',{currentPageName:this.currentPageName});
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
