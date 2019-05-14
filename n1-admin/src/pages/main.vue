<template>
  <div class="home">
    <sidebar :openName='openName'/>
    <Layout :style="{marginLeft: '256px'}">
      <Header class="main_header">
        <div class="tags-con">
          <tag-close :pageTagsList="pageTagsList"/>
        </div>
        <div class="user-dropdown-menu-con">
          <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <Avatar icon="person" size="small" style="background: #619fe7;margin-right: 8px;"></Avatar>
            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ userName }} ({{ uname}})</span>
                <Icon type="arrow-down-b"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="loginout" divided>退出登录</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Row>
        </div>
      </Header>
      <Content>
        <Card style="overflow:auto">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </Card>
      </Content>
    </Layout>
  </div>
</template>
<script>
import sidebar from "@/components/sidebar";
import tagClose from "@/components/tags-close.vue";
import util from "@/libs/util.js";
import {menuOpen} from '@/config/menuOpen'
export default {
  data() {
    return {
      // avatorPath: "",
      userName: localStorage.subRole,
      openName: []
    };
  },
  computed: {
    pageTagsList() {
      return this.$store.state.home.pageOpenedList; //打开的页面的页面对象
    },
    uname(){
      return JSON.parse(localStorage.userInfo).uname;
    }
  },
  methods: {
    init() {
      this.checkTag(this.$route.name);
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleClickUserDropdown(name) {
      this.$Modal.confirm({
        title: "提示",
        content: "<p>是否确认退出</p>",
        onOk: () => {
          localStorage.clear();
          this.$store.commit('clearAllTag')
          this.$router.push({ name: "login" });
          this.$store.commit('changeLoading',{params:false});
        }
      });
    }
  },
  components: { sidebar, tagClose },
  mounted() {
    this.init();
  },
  created() {
    // 显示打开的页面的列表
    // this.$store.commit("setOpenedList");
  },
  watch: {
    $route(to) {
      let name = to.name;
      this.$store.commit("setCurrentPageName", name);
      this.checkTag(name);
      this.openName=menuOpen(name);
      // this.$store.commit("addOpenSubmenu", pathArr[1].name);
    }
  }
};
</script>
<style lang="less" scoped>
.tags-con {
  height: 64px;
  z-index: -1;
  overflow: hidden;
  //   background: #f0f0f0;
}
.main_header {
  height: 64px;
  background: #fff;
  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
  position: relative;
  z-index: 11;
}
.user-dropdown-menu-con {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  text-align: center;
  height: 100%;
  background: white;
  z-index: 10;
  margin-right: 10px;
}
.ivu-layout-header {
  padding: 0 50px 0 10px;
}
</style>
