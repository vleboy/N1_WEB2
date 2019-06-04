<template>
    <div class="sider">
        <Sider :width='menuWidth' collapsible hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}" class="side showMenu">
            <div id="logo">
              <p class="logoimg" v-if="unFlodMenu">
                <img src="../../public/logo.png" alt="">
              </p>
              <p class="arrow" >
                <Icon type="md-swap" size="28" v-if="foldIcon" @click="fold" class="foldIcon"/>
                <Icon type="md-swap" size="32" v-else @click="unfold" style="padding-top:.7rem;cursor:pointer"/>
              </p>
            </div>
            <transition name="fade">
              <Menu ref="sideMenu" class="sideMenu" :active-name="$route.name" :open-names="openName" theme="dark" width="auto" @on-select='selectMenu' :style="{marginTop:'.3rem'}">
                <MenuItem name="newBoard" v-if='permission.includes("数据看板")' :class="flodMenu ? 'flodMuenS' : 'class-b' " style="display:flex;">
                <Icon type="md-trending-up" />
                  <span v-if="unFlodMenu">数据看板</span>
                </MenuItem>
                <MenuItem name="ownspace-index" v-if='permission.includes("个人中心")' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="ios-person" />
                  <span v-if="unFlodMenu">个人中心</span>
                </MenuItem>
                
                <MenuItem name="allreport" v-if='authorityStr.includes("游戏报表") && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="ios-paper" @click="unfold"/>
                </MenuItem>
                 <Submenu name="report" v-if='authorityStr.includes("游戏报表") && unFlodMenu' class="sideMenu">
                    <template slot="title">
                        <Icon type="ios-paper" />
                        <span>输赢报表</span>
                    </template>
                    <MenuItem name="allreport" v-if='permission.includes("公司输赢总报表")'>公司输赢总报表</MenuItem>
                    <MenuItem name="playerReport" v-if='permission.includes("玩家输赢报表")'>玩家输赢总报表</MenuItem>
                    <Submenu name='nareport' v-if='authorityStr.includes("NA")'>
                        <template slot="title">NA游戏报表</template>
                        <MenuItem name="naAll" v-if='permission.includes("NA游戏总报表")'>NA游戏总报表</MenuItem>
                        <MenuItem name="nahfive" v-if='permission.includes("NA电子H5报表")'>NA电子H5报表</MenuItem>
                        <MenuItem name="nanomys" v-if='permission.includes("NA电子H5无神秘奖报表")'>NA电子H5无神秘奖报表</MenuItem>
                    </Submenu>
                    <Submenu name='kyreport' v-if='permission.includes("KY棋牌游戏报表")'>
                        <template slot="title">KY游戏报表</template>
                        <MenuItem name="kychess">KY棋牌游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='ttgreport' v-if='permission.includes("TTG电子游戏报表")'>
                        <template slot="title">TTG游戏报表</template>
                        <MenuItem name="ttgvideo">TTG电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='sareport' v-if='authorityStr.includes("SA")'>
                        <template slot="title">SA游戏报表</template>
                        <MenuItem name="saAll" v-if='permission.includes("SA游戏总报表")'>SA游戏总报表</MenuItem>
                        <MenuItem name="satrue" v-if='permission.includes("SA真人游戏报表")'>SA真人游戏报表</MenuItem>
                        <MenuItem name="safishing" v-if='permission.includes("SA捕鱼游戏报表")'>SA捕鱼游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='sbreport' v-if='authorityStr.includes("SB")'>
                        <template slot="title">SB游戏报表</template>
                        <MenuItem name="sbAll" v-if='permission.includes("SB游戏总报表")'>SB游戏总报表</MenuItem>
                        <MenuItem name="sbvideo" v-if='permission.includes("SB电子游戏报表")'>SB电子游戏报表</MenuItem>
                        <MenuItem name="sbtrue" v-if='permission.includes("SB真人游戏报表")'>SB真人游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='mgreport' v-if='permission.includes("MG电子游戏报表")'>
                        <template slot="title">MG游戏报表</template>
                        <MenuItem name="mgvideo">MG电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='agreport' v-if='permission.includes("AG真人游戏报表")'>
                        <template slot="title">AG游戏报表</template>
                        <MenuItem name="agtrue">AG真人游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='rtgReport' v-if='permission.includes("RTG电子游戏报表")'>
                        <template slot="title">RTG游戏报表</template>
                        <MenuItem name="rtgGame">RTG电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='dtReport' v-if='permission.includes("DT电子游戏报表")'>
                        <template slot="title">DT游戏报表</template>
                        <MenuItem name="dtGame">DT电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='ysbReport' v-if='permission.includes("YSB体育游戏报表")'>
                        <template slot="title">YSB游戏报表</template>
                        <MenuItem name="ysbSport">YSB体育游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='ppReport' v-if='permission.includes("PP电子游戏报表")'>
                        <template slot="title">PP游戏报表</template>
                        <MenuItem name="ppGame">PP电子游戏报表</MenuItem>
                    </Submenu>
                      <Submenu name='pgReport' v-if='permission.includes("PG电子游戏报表")'>
                        <template slot="title">PG游戏报表</template>
                        <MenuItem name="pgGame">PG电子游戏报表</MenuItem>
                    </Submenu>
                      <Submenu name='habaReport' v-if='permission.includes("HABA电子游戏报表")'>
                        <template slot="title">HABA游戏报表</template>
                        <MenuItem name="habaGame">HABA电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='pngReport' v-if='permission.includes("PNG电子游戏报表")'>
                        <template slot="title">PNG游戏报表</template>
                        <MenuItem name="pngGame">PNG电子游戏报表</MenuItem>
                    </Submenu>
                </Submenu>
                <MenuItem name="dayCompany" v-if='authorityStr.includes("日报表") && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="md-stats" @click="unfold"/>
                </MenuItem>
                <Submenu name="dayReport" v-if='authorityStr.includes("日报表") && unFlodMenu' class="sideMenu">
                  <template slot="title">
                    <Icon type="md-stats" />
                    <span>日报表</span>
                  </template>
                  <MenuItem name="dayCompany" v-if='permission.includes("公司日报表")'>公司日报表</MenuItem>
                  <MenuItem name="dayManager" v-if='permission.includes("线路商日报表")'>线路商日报表</MenuItem>
                  <MenuItem name="dayMerchant" v-if='permission.includes("商户日报表")'>商户日报表</MenuItem>
                  <MenuItem name="dayPlayer" v-if='permission.includes("玩家日报表")'>玩家日报表</MenuItem>
                </Submenu>
                <MenuItem name="dealerList" v-if='(permission.includes("商户列表") || permission.includes("线路商列表") || permission.includes("接入商点数警告列表")) && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="md-people" @click="unfold"/>
                </MenuItem>
                <Submenu class="sideMenu" name="businessCenter" v-if='(permission.includes("商户列表") || permission.includes("线路商列表") || permission.includes("接入商点数警告列表")) && unFlodMenu'>
                  <template slot="title">
                    <Icon type="md-people" />
                    <span>商户中心</span>
                  </template>
                  <MenuItem name="merchantList" v-if='permission.includes("商户列表")'>商户列表</MenuItem>
                  <MenuItem name="dealerList" v-if='permission.includes("线路商列表")'>线路商列表</MenuItem>
                  <MenuItem name="warnList" v-if='permission.includes("接入商点数警告列表")'>接入商点数警告列表</MenuItem>
                </Submenu>
                <MenuItem name="playList" v-if='permission.includes("玩家中心")' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="md-game-controller-b" />
                  <span v-if="unFlodMenu">玩家中心</span>
                </MenuItem>
                <MenuItem name="adminList" v-if='(permission.includes("管理员列表") || permission.includes("管理员角色列表")) && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="ios-ribbon" @click="unfold"/>
                </MenuItem>
                <Submenu class="sideMenu" name="adminCenter" v-if='(permission.includes("管理员列表") || permission.includes("管理员角色列表")) && unFlodMenu'>
                    <template slot="title">
                        <Icon type="ios-ribbon" />
                        <span>管理员中心</span>
                    </template>
                    <MenuItem name="adminList" v-if='permission.includes("管理员列表")'>管理员列表</MenuItem>
                    <MenuItem name="adminRole" v-if='permission.includes("管理员角色列表")'>管理员角色列表</MenuItem>
                </Submenu>
                <MenuItem name="gameManager" v-if='(permission.includes("神秘大奖") || permission.includes("数值调控中心") || permission.includes("游戏管理")) && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="md-settings" @click="unfold"/>
                </MenuItem>
                <Submenu class="sideMenu" name="operation" v-if='(permission.includes("神秘大奖") || permission.includes("数值调控中心") || permission.includes("游戏管理")) && unFlodMenu'>
                    <template slot="title">
                        <Icon type="md-settings" />
                        <span>运营中心</span>
                    </template>
                    <MenuItem name="gameManager" v-if="permission.includes('游戏管理')">游戏管理</MenuItem>
                    <MenuItem name="numericalControl" v-if="permission.includes('数值调控中心')">数值调控中心</MenuItem>
                    <Submenu name='mysPrice' v-if="permission.includes('神秘大奖')">
                      <template slot="title">神秘大奖</template>
                      <MenuItem name="sysConfig">系统配置</MenuItem>
                      <MenuItem name="prizeList">中奖记录</MenuItem>
                    </Submenu>
                </Submenu>
                <MenuItem name="loginLog" v-if='authorityStr.includes("日志") && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="md-paper" @click="unfold"/>
                </MenuItem>
                <Submenu class="sideMenu" name="logCenter" v-if='authorityStr.includes("日志") && unFlodMenu'>
                    <template slot="title">
                        <Icon type="md-paper" />
                        <span>日志中心</span>
                    </template>
                    <MenuItem name="loginLog" v-if='permission.includes("登录日志")'>登录日志</MenuItem>
                    <MenuItem name="operationLog" v-if='permission.includes("操作日志")'>操作日志</MenuItem>
                    <!-- <MenuItem name="debugLog" v-if='permission.includes("DEBUG")'>DEBUG日志</MenuItem> -->
                    <!-- <MenuItem name="dataRepair" v-if='permission.includes("DEBUG日志")'>DEBUG修正</MenuItem> -->
                </Submenu>
                <MenuItem name="loginLog" v-if='(permission.includes("免转流水") || permission.includes("免转报表")) && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                  <Icon type="logo-usd" @click="unfold"/>
                </MenuItem>
                <Submenu class="sideMenu" name="noTransfer" v-if='permission.includes("免转中心") && unFlodMenu'>
                    <template slot="title">
                        <Icon type="logo-usd" />
                        <span>免转中心</span>
                    </template>
                    <MenuItem name="noTransferReport" v-if='permission.includes("免转报表")'>免转报表</MenuItem>
                    <MenuItem name="flow" v-if='permission.includes("免转流水")'>免转流水</MenuItem>
                </Submenu>
              </Menu>
            </transition>
            
        </Sider>
    </div>
</template>
<script>
export default {
  data() {
    return {
      menuWidth: '240px',
      foldIcon: true,
      //默认不折叠
      unFlodMenu: true,
      //折叠
      flodMenu: false,
    };
  },
  created() {
    // let permission = this.permission;
    // let str = permission.toString();
  },
  methods: {
    selectMenu(name) {
      this.$router.push({ name: name });
    },
    //折叠菜单栏
    fold() {
      this.unFlodMenu = false
      this.flodMenu = true
      this.foldIcon = false
      this.menuWidth = '50px'
      this.$store.commit("changeWidth", '50px');
    },
    //展开菜单栏
    unfold() {
      this.unFlodMenu = true
      this.flodMenu = false
      this.foldIcon = true
      this.menuWidth = '240px'
      this.$store.commit("changeWidth", '240px');
    }
  },
  computed: {
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    },
    authorityStr() {
      return this.permission.toString();
    }
  },
  props: ["openName"],
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  }
};
</script>

<style scoped lang="less">
  .sider {
    .showMenu {
      transition: all 0.2s ease;
    }
    .foldIcon {
      cursor: pointer;
      margin-right:1.5rem;
      display: flex;
      align-items: center;
    }
    .flodMuenS {
      display: flex;
      justify-content: center;
      font-size: 28px;
      cursor: pointer;
    }
    #logo {
      display: flex;
      justify-content: center;
      .logoimg {
        display: flex;
        width: 90%;
        height: 50px;
        justify-content: center;
        img {
          margin: 0;
          display: block;
          width: 50%;
          height: 100%;
        }
      }
      .arrow {
        display: flex;
        align-items: center;  
        justify-content: center;
        /deep/.ivu-icon {
          color: #fff;
        }
      }
    }
    .side {
      overflow: auto;
      position: fixed;

      
    }
    .sideMenu {
      
    }
    /* 侧边栏样式 */
    /deep/.ivu-layout-sider-children {
      background: #1c2327;
    }
    //一级普通菜单
    /deep/.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
      background: #1c2327;
    }
    /deep/.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover {
      background: #192028!important;
      color: #20c1dc;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
      background: #20c1dc!important;
      color:#fff;
    }
    //一级下拉菜单
   /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title {
     background: #1c2327;
   }
   /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
     background: #192028!important;
     color: #20c1dc;
   }
   .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu-title) {
     background: #20c1dc!important;
     color:#fff;
   }

  /deep/.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-has-parent-submenu .ivu-menu-submenu-title {
    background: #1c2327;
  }
    //三级下拉菜单  
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active:hover {
      background: #192028!important;
      color: #20c1dc;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
      background: #20c1dc!important;
      color:#fff;
    }
  }
</style>
