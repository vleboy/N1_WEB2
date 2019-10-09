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
                        <span v-if="unFlodMenu">{{$t('sideBar.ownSpace')}}</span>
                    </MenuItem>
                    <MenuItem name="allreport" v-if='gameList.length>0 && flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="ios-paper" @click="unfold"/>
                    </MenuItem>     
                    <Submenu name="report" v-if="gameList.length>0 && unFlodMenu">
                        <template slot="title">
                            <Icon type="ios-paper-outline"></Icon>
                            {{$t('sideBar.report')}}
                        </template>
                        <MenuItem name="allreport">{{$t('sideBar.allReport')}}</MenuItem>
                        <Submenu name='nareport' v-if="gameStr.includes('NA')||gameStr.includes('H5')">
                            <template slot="title">{{$t('sideBar.naReport')}}</template>
                            <MenuItem name="naAll">{{$t('sideBar.naAll')}}</MenuItem>
                            <MenuItem name="nahfive" v-if='gameList.includes("H5电子游戏")'>{{$t('sideBar.naHFive')}}</MenuItem>
                            <MenuItem name="nanomsy" v-if='gameList.includes("H5电子游戏-无神秘奖")'>{{$t('sideBar.nanomsy')}}</MenuItem>
                        </Submenu>
                        <Submenu name='kyreport' v-if='gameList.includes("KY棋牌游戏报表")'>
                            <template slot="title">{{$t('sideBar.kyReport')}}</template>
                            <MenuItem name="kychess">{{$t('sideBar.kyChess')}}</MenuItem>
                        </Submenu>
                        <Submenu name='ttgreport' v-if="gameList.includes('TTG电子游戏')">
                            <template slot="title">{{$t('sideBar.ttgReport')}}</template>
                            <MenuItem name="ttgvideo">{{$t('sideBar.ttgVideo')}}</MenuItem>
                        </Submenu>
                        <Submenu name='sareport' v-if="gameStr.includes('SA')">
                            <template slot="title">{{$t('sideBar.saReport')}}</template>
                            <MenuItem name="saAll">{{$t('sideBar.saAll')}}</MenuItem>
                            <MenuItem name="satrue" v-if="gameStr.includes('SA真人')">{{$t('sideBar.saTrue')}}</MenuItem>
                            <MenuItem name="safishing" v-if="gameStr.includes('SA捕鱼')">{{$t('sideBar.saFishing')}}</MenuItem>
                        </Submenu>
                        <Submenu name='sbreport' v-if='gameList.includes("SB电子游戏")||gameList.includes("SB真人游戏")'>
                            <template slot="title">{{$t('sideBar.sbReport')}}</template>
                            <MenuItem name="sbAll">{{$t('sideBar.sbAll')}}</MenuItem>
                            <MenuItem name="sbvideo" v-if='gameList.includes("SB电子游戏")'>{{$t('sideBar.sbVideo')}}</MenuItem>
                            <MenuItem name="sbtrue" v-if='gameList.includes("SB真人游戏")'>{{$t('sideBar.sbTrue')}}</MenuItem>
                        </Submenu>
                        <Submenu name='mgreport' v-if="gameStr.includes('MG')">
                            <template slot="title">{{$t('sideBar.mgReport')}}</template>
                            <MenuItem name="mgvideo">{{$t('sideBar.mgVideo')}}</MenuItem>
                        </Submenu>
                        <Submenu name='agreport' v-if="gameStr.includes('AG真人')">
                            <template slot="title">{{$t('sideBar.agReport')}}</template>
                            <MenuItem name="agtrue">{{$t('sideBar.agTrue')}}</MenuItem>
                        </Submenu>
                        <Submenu name='rtgReport' v-if="gameList.includes('RTG电子游戏')">
                            <template slot="title">{{$t('sideBar.rtgReport')}}</template>
                            <MenuItem name="rtgGame">{{$t('sideBar.rtgGame')}}</MenuItem>
                        </Submenu>
                        <Submenu name='dtReport' v-if='gameList.includes("DT电子游戏")'>
                            <template slot="title">{{$t('sideBar.dtReport')}}</template>
                            <MenuItem name="dtGame">{{$t('sideBar.dtGame')}}</MenuItem>
                        </Submenu>
                        <Submenu name='ppReport' v-if='gameList.includes("PP电子游戏")'>
                            <template slot="title">{{$t('sideBar.ppReport')}}</template>
                            <MenuItem name="ppGame">{{$t('sideBar.ppGame')}}</MenuItem>
                        </Submenu>
                        <Submenu name='ysbReport' v-if="gameList.includes('YSB体育游戏')">
                            <template slot="title">{{$t('sideBar.ysbReport')}}</template>
                            <MenuItem name="ysbSport">{{$t('sideBar.ysbGame')}}</MenuItem>
                        </Submenu>
                        <Submenu name='pgReport' v-if='gameList.includes("PG电子游戏")'>
                            <template slot="title">{{$t('sideBar.pgReport')}}</template>
                            <MenuItem name="pgGame">{{$t('sideBar.pgGame')}}</MenuItem>
                        </Submenu>
                        <Submenu name='habaReport' v-if='gameList.includes("HABA电子游戏")'>
                            <template slot="title">{{$t('sideBar.habaReport')}}</template>
                            <MenuItem name="habaGame">{{$t('sideBar.habaGame')}}</MenuItem>
                        </Submenu>
                        <Submenu name='pngReport' v-if='gameList.includes("PNG电子游戏")'>
                            <template slot="title">{{$t('sideBar.pngReport')}}</template>
                            <MenuItem name="pngGame">{{$t('sideBar.pngGame')}}</MenuItem>
                        </Submenu>
                    </Submenu>
                    <MenuItem name="dayCompany" v-if='flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="md-stats" @click="unfold"/>
                    </MenuItem>
                    <Submenu name="dayReport" v-if='unFlodMenu'>
                        <template slot="title">
                            <Icon type="md-stats"></Icon>
                            {{$t('sideBar.dailyReport')}}
                        </template>
                        <MenuItem name="dayCompany">{{$t('sideBar.dayCompany')}}</MenuItem>
                        <MenuItem name="dayMerchant">{{$t('sideBar.dayMerchant')}}</MenuItem>
                    </Submenu>
                    <MenuItem name="dealerList" v-if='flodMenu' :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="md-people" @click="unfold"/>
                    </MenuItem>
                    <Submenu name="businessCenter" v-if='unFlodMenu'>
                        <template slot="title">
                            <Icon type="md-people"></Icon>
                            {{$t('sideBar.merchantCenter')}}
                        </template>
                        <MenuItem name="dealerList">{{$t('sideBar.managerList')}}</MenuItem>
                        <MenuItem name="merchantList">{{$t('sideBar.merchantList')}}</MenuItem>
                    </Submenu>
                    <MenuItem name="playList" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                        <Icon type="md-game-controller-b"></Icon>
                        <span v-if="unFlodMenu">{{$t('sideBar.player')}}</span>
                    </MenuItem>
                    <MenuItem name="prizeList" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="md-trophy" />
                    <span v-if="unFlodMenu" class="ml">{{$t('sideBar.prizeList')}}</span>
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
