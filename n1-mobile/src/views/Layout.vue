<template>
  <div>
    <!-- <Home v-show="showMenu == 0"></Home>
    <Center v-show="showMenu == 1"></Center>
    <Explore v-show="showMenu == 2"></Explore>-->
    <!--错误提示-->
    <v-snackbar v-model="err" top auto-height :color="errColor" :timeout=3000>
      {{errMsg}}
      <v-btn color="gray" flat @click="()=>{this.$store.commit('setErr',false)}">关闭</v-btn>
    </v-snackbar>
    <!--路由页面-->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--底部导航-->
    <Bottom/>
    <!--加载等待-->
    <Loading message="加载中..."/>
  </div>
</template>

<script>
import Bottom from "./Bottom";
import Loading from "../components/Loading";
// import Home from "./Home";
// import Center from "./Center.vue";
// import Explore from "./Explore.vue";
export default {
  components: {
    Bottom,
    Loading
    // Home,
    // Center,
    // Explore
  },
  computed: {
    openLoading: {
      get() {
        return this.$store.state.openLoading;
      },
      set(val) {
        this.$store.commit("openLoading", val);
      }
    },
    err: {
      get() {
        return this.$store.state.err;
      },
      set(val) {
        this.$store.commit("setErr", val);
      }
    },
    errMsg: {
      get() {
        return this.$store.state.errMsg;
      },
      set(val) {
        this.$store.commit("setErrMsg", val);
      }
    },
    errColor: {
      get() {
        return this.$store.state.errColor;
      },
      set(val) {
        this.$store.commit("setErrColor", val);
      }
    }
  },
  data() {
    return {
      showMenu: 0,
      scrollNum: 0
    };
  },
  mounted() {
    window.addEventListener("scroll", () => {
      this.scrollNum =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
    });
  },
  methods: {
    showView(param) {
      // 前置页面滚动条位置保存
      switch (this.showMenu) {
        case 0:
          this.$store.commit("setHomeScroll", this.scrollNum);
          break;
        case 1:
          this.$store.commit("setCenterScroll", this.scrollNum);
          break;
        case 2:
          this.$store.commit("setExploreScroll", this.scrollNum);
          break;
      }
      // 显示页面滚动条位置恢复
      switch (param) {
        case 0:
          this.$nextTick(() => {
            // setTimeout(() => {
            document.documentElement.scrollTop = this.$store.state.homeScroll;
            // }, 100);
          });
          break;
        case 1:
          this.$nextTick(() => {
            // setTimeout(() => {
            document.documentElement.scrollTop = this.$store.state.statScroll;
            // }, 0);
          });
          break;
        case 2:
          this.$nextTick(() => {
            // setTimeout(() => {
            document.documentElement.scrollTop = this.$store.state.exploreScroll;
            // }, 0);
          });
          break;
      }
      // 显示当前页面
      this.showMenu = param;
    }
  }
};
</script>

<style>
</style>
