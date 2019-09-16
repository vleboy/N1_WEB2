<template>
  <div class="home">
    <!-- 左侧菜单列表 -->
    <sidebar :openName="openName" />
    <!-- 右侧显示内容 -->
    <Layout :style="{ marginLeft: layoutWidth }">
      <Header class="main_header">
        <div class="tags-con">
          <tag-close :pageTagsList="pageTagsList" />
        </div>
        <div class="user-dropdown-menu-con">
          <Row
            type="flex"
            justify="end"
            align="middle"
            class="user-dropdown-innercon"
          >
            <div class="user-balance">
              <div class="balance">余额：{{ balance }}</div>
              <div>
                <a href="javascript:void(0)" @click="getBalance">刷新</a>
              </div>
            </div>
            <Dropdown
              transfer
              trigger="click"
              @on-click="changeLanguage"
              placement="bottom"
              style="margin-right:1rem"
            >
              <a href="javascript:void(0)">
                {{ $t("index.language") }}
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="zh">中文</DropdownItem>
                <DropdownItem name="en">English</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Avatar
              icon="md-person"
              size="small"
              style="background: #619fe7;margin-right: 10px;"
            ></Avatar>
            <Dropdown
              transfer
              trigger="click"
              @on-click="handleClickUserDropdown"
              placement="bottom-start"
            >
              <a href="javascript:void(0)">
                <span class="main-user-name">{{ userName }}</span>
                <Icon type="ios-arrow-down"></Icon>
              </a>
              <DropdownMenu slot="list">
                <DropdownItem name="loginout">{{
                  $t("index.exit")
                }}</DropdownItem>
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
import { menuOpen } from '@/config/menuOpen'
import { httpRequest } from "@/service/index";
export default {
  data () {
    return {
      // avatorPath: "",
      userName: JSON.parse(localStorage.getItem("userInfo")).displayName,
      openName: [],
      balance: 0
    };
  },
  computed: {
    pageTagsList () {
      return this.$store.state.home.pageOpenedList; //打开的页面的页面对象
    },
    layoutWidth () {
      return this.$store.state.home.menuSize
    }
  },
  methods: {
    init () {
      this.checkTag(this.$route.name);
      this.getBalance();
    },
    checkTag (name) {
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
    handleClickUserDropdown (name) {

      this.$Modal.confirm({
        title: localStorage.language == 'zh' ? "提示" : 'Hint',
        content: localStorage.language == 'zh' ? "<p>是否确认退出</p>" : '<p>Confirm exit</p>',
        onOk: () => {
          localStorage.clear();
          this.$store.commit('clearAllTag')
          this.$router.push({ name: "login" });
          this.$store.commit('changeLoading', { params: false });
        }
      });

    },
    changeLanguage (name) {
      let title = name == "zh" ? 'NA商户后台' : 'NA Merchant'
      this.$i18n.locale = name
      document.title = title
      this.$store.commit('changeLanguage', name)
      localStorage.setItem('language', name)
      localStorage.setItem('title', title)
    },
    getBalance () {
      let userId = localStorage.loginId;
      httpRequest("get", "/merchants/" + userId)
        .then(res => {
          console.log(res)
          if (res.code == 0) {
            this.balance = res.payload.balance
          }
        })
    }
  },
  components: { sidebar, tagClose },
  mounted () {
    this.init();
    //console.log(this);

  },
  created () {
    // 显示打开的页面的列表
    // this.$store.commit("setOpenedList");
  },
  watch: {
    $route (to) {
      let name = to.name;
      this.$store.commit("setCurrentPageName", name);
      this.checkTag(name);
      this.openName = menuOpen(name);
      // this.$store.commit("addOpenSubmenu", pathArr[1].name);
    }
  }
};
</script>
<style lang="less" scoped>
/deep/ .ivu-layout-header[data-v-73309bbd] {
  padding: 0;
}
/deep/ .user-dropdown-menu-con {
  display: flex;
  .ivu-layout-header {
    line-height: 0;
  }
}

/deep/ .ivu-layout-header {
  background: red;
  padding: 0;
}
.tags-con {
  height: 50px;
  z-index: -1;
  //: hidden;
  //   background: #f0f0f0;
}

.main_header {
  height: 50px;
  background: #fff;
  box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
  position: relative;
  z-index: 11;
  display: flex;
  justify-content: space-between;
}
.user-dropdown-menu-con {
  box-sizing: border-box;
  text-align: center;
  height: 100%;
  background: white;
  z-index: 10;
  padding-right: 20px;
}
.user-balance {
  display: flex;
  margin-right: 10px;
  div {
    margin-right: 10px;
  }
  a {
    color: #2d8cf0;
  }
  a:hover {
    color: #5cadff;
  }
}
</style>
