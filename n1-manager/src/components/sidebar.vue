<template>
    <div class="sider">
        <Sider :width='menuWidth' collapsible hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
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
                <Menu ref="sideMenu" :active-name="$route.name" :open-names="openName" theme="dark" width="auto" @on-select='selectMenu' >
                    <MenuItem name="ownspace-index" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="ios-person"></Icon>
                        <span v-if="unFlodMenu">个人中心</span>
                    </MenuItem>
                    <MenuItem name="allreport" v-if='gameList.length>0 && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="ios-paper" @click="unfold"/>
                    </MenuItem>     
                    <Submenu name="report" v-if="gameList.length>0 && unFlodMenu">
                        <template slot="title">
                            <Icon type="ios-paper-outline"></Icon>
                            输赢报表
                        </template>
                        <MenuItem name="allreport">公司输赢总报表</MenuItem>
                        <Submenu name='nareport' v-if="gameStr.includes('NA')||gameStr.includes('H5')">
                            <template slot="title">NA游戏报表</template>
                            <MenuItem name="naAll">NA游戏总报表</MenuItem>
                            <MenuItem name="nahfive" v-if='gameList.includes("H5电子游戏")'>NA电子H5报表</MenuItem>
                            <MenuItem name="nanomsy" v-if='gameList.includes("H5电子游戏-无神秘奖")'>NA电子H5无神秘奖报表</MenuItem>
                        </Submenu>
                        <Submenu name='kyreport' v-if='gameList.includes("KY棋牌游戏报表")'>
                            <template slot="title">KY游戏报表</template>
                            <MenuItem name="kychess">KY棋牌游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='ttgreport' v-if="gameList.includes('TTG电子游戏')">
                            <template slot="title">TTG游戏报表</template>
                            <MenuItem name="ttgvideo">TTG电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='sareport' v-if="gameStr.includes('SA')">
                            <template slot="title">SA游戏报表</template>
                            <MenuItem name="saAll">SA游戏总报表</MenuItem>
                            <MenuItem name="satrue" v-if="gameStr.includes('SA真人')">SA真人游戏报表</MenuItem>
                            <MenuItem name="safishing" v-if="gameStr.includes('SA捕鱼')">SA捕鱼游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='sbreport' v-if='gameList.includes("SB电子游戏")||gameList.includes("SB真人游戏")'>
                            <template slot="title">SB游戏报表</template>
                            <MenuItem name="sbAll">SB游戏总报表</MenuItem>
                            <MenuItem name="sbvideo" v-if='gameList.includes("SB电子游戏")'>SB电子游戏报表</MenuItem>
                            <MenuItem name="sbtrue" v-if='gameList.includes("SB真人游戏")'>SB真人游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='mgreport' v-if="gameStr.includes('MG')">
                            <template slot="title">MG游戏报表</template>
                            <MenuItem name="mgvideo">MG电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='agreport' v-if="gameStr.includes('AG真人')">
                            <template slot="title">AG游戏报表</template>
                            <MenuItem name="agtrue">AG真人游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='rtgReport' v-if="gameList.includes('RTG电子游戏')">
                            <template slot="title">RTG游戏报表</template>
                            <MenuItem name="rtgGame">RTG电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='dtReport' v-if='gameList.includes("DT电子游戏")'>
                            <template slot="title">DT游戏报表</template>
                            <MenuItem name="dtGame">DT电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='ppReport' v-if='gameList.includes("PP电子游戏")'>
                            <template slot="title">PP游戏报表</template>
                            <MenuItem name="ppGame">PP电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='ysbReport' v-if="gameList.includes('YSB体育游戏')">
                            <template slot="title">YSB游戏报表</template>
                            <MenuItem name="ysbSport">YSB体育游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='pgReport' v-if='gameList.includes("PG电子游戏")'>
                            <template slot="title">PG游戏报表</template>
                            <MenuItem name="pgGame">PG电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='habaReport' v-if='gameList.includes("HABA电子游戏")'>
                            <template slot="title">HABA游戏报表</template>
                            <MenuItem name="habaGame">HABA电子游戏报表</MenuItem>
                        </Submenu>
                        <Submenu name='pngReport' v-if='gameList.includes("PNG电子游戏")'>
                            <template slot="title">PNG游戏报表</template>
                            <MenuItem name="pngGame">PNG电子游戏报表</MenuItem>
                        </Submenu>
                    </Submenu>
                    <MenuItem name="dayCompany" v-if='flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="md-stats" @click="unfold"/>
                    </MenuItem>
                    <Submenu name="dayReport" v-if='unFlodMenu'>
                        <template slot="title">
                            <Icon type="md-stats"></Icon>
                            日报表
                        </template>
                        <MenuItem name="dayCompany">公司日列表</MenuItem>
                        <MenuItem name="dayMerchant">商户日报表</MenuItem>
                    </Submenu>
                    <MenuItem name="dealerList" v-if='flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="md-people" @click="unfold"/>
                    </MenuItem>
                    <Submenu name="businessCenter" v-if='unFlodMenu'>
                        <template slot="title">
                            <Icon type="md-people"></Icon>
                            商户中心
                        </template>
                        <MenuItem name="dealerList">线路商列表</MenuItem>
                        <MenuItem name="merchantList">商户列表</MenuItem>
                    </Submenu>
                    <MenuItem name="playList" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="md-game-controller-b"></Icon>
                        <span v-if="unFlodMenu">玩家列表</span>
                    </MenuItem>
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
    // let game=this.gameList;
    //console.log(this.gameList);
    // console.log(str.includes("报表"));
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
    gameList() {
      let games = JSON.parse(localStorage.userInfo).gameList;
      let arr = [];
      for (let item of games) {
        arr.push(item.name);
      }
      return arr;
    },
    gameStr() {
      return this.gameList.toString();
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
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
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
}
    .side {
      overflow: auto;
      position: fixed;
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
     background: #1c2327 !important;
   }
   /deep/ .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title:hover {
     background: #192028!important;
     color: #20c1dc;
   }
   .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu-title-active:not(.ivu-menu-submenu-title) {
     background: #20c1dc!important;
     color:#fff;
   }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item:hover {
         background: #192028!important;
     color: #20c1dc;
    }
  /deep/.ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-has-parent-submenu .ivu-menu-submenu-title {
    background: #1c2327;
  }
    //三级下拉菜单  
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu:not(.ivu-menu-item-active):hover {
      background: #192028!important;
      color: #20c1dc;
    }
    .ivu-menu-dark.ivu-menu-vertical .ivu-menu-submenu .ivu-menu-item-active {
      background: #20c1dc!important;
      color:#fff;
    }
  
</style>
