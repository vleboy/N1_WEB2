<template>
  <div class="home">
    <sidebar :openName='openName'/>
    <Layout :style="{marginLeft: layoutWidth}">
      <Header class="main_header">
        <div class="tags-con">
          <tag-close :pageTagsList="pageTagsList"/>
        </div>
        <div class="user-dropdown-menu-con">
          <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
            <Dropdown transfer trigger="click" @on-click="changeLanguage" placement="bottom" style="margin-right:1rem">
              <a href="javascript:void(0)">
                {{$t('index.language')}}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="zh">中文</DropdownItem>
                <DropdownItem name="en">English</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Avatar icon="md-person" size="small" style="background: #619fe7;margin-right: 8px;"></Avatar>
            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ userName }}</span>
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="loginout" divided>{{$t('index.exit')}}</DropdownItem>
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
      userName: JSON.parse(localStorage.getItem("userInfo")).displayName,
      openName: []
    };
  },
  computed: {
    pageTagsList() {
      return this.$store.state.home.pageOpenedList; //打开的页面的页面对象
    },
    layoutWidth() {
      return this.$store.state.home.menuSize
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
        title: localStorage.language == 'zh' ? "提示" : 'Hint',
        content: localStorage.language == 'zh' ? "<p>是否确认退出</p>" : '<p>Confirm exit</p>',
        onOk: () => {
          localStorage.clear();
          this.$store.commit('clearAllTag')
          this.$router.push({ name: "login" });
          this.$store.commit('changeLoading',{params:false});
        }
      });
    },
    changeLanguage(name) {
      let title = name == "zh" ? 'NA线路商后台' : 'NA Manager'
      this.$i18n.locale = name
      document.title = title
      this.$store.commit('changeLanguage', name)
      localStorage.setItem('language', name)
      localStorage.setItem('title', title)
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
  height: 50px;
  z-index: -1;
  overflow: hidden;
  //   background: #f0f0f0;
}
/deep/ .ivu-layout-header {
  line-height: 45px;
}
.main_header {
  height: 50px;
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
