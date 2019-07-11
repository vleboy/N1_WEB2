<template>
    <div class="sider">
        <Sider :width="menuWidth" collapsible hide-trigger :style="{overflow:'auto',position:'fixed',height: '100vh', left: 0,backgroundColor:'#1c2327'}" class="showMenu">
            <div id="logo" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
              <p class="logoimg" v-if="unFlodMenu">
                <img src="../../public/logo.png" alt="">
              </p>
              <p class="arrow" >
                <div v-if="foldIcon" @click="fold" class="foldIcon">
                  <Icon type="md-swap" size="28"/>
                </div> 
                <Icon type="md-swap" size="32" v-else @click="unfold" style="padding-top:.7rem"/>
              </p>
            </div>
            <transition name="fade">
              <Menu ref="sideMenu" :active-name="$route.name" :open-names="openName" width="auto" @on-select='selectMenu' :style="{backgroundColor:'#1c2327',color:'#fff',marginTop:'.3rem'}">
                  <MenuItem name="newBoard" :class="flodMenu ? 'flodMuenS' : 'class-b' " style="display:flex;">
                      <Icon type="md-trending-up" />
                    <span v-if="unFlodMenu" class="ml">{{$t('sideBar.newBoard')}}</span>
                  </MenuItem>
                  <MenuItem name="ownspace-index" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="md-person" />
                    <span v-if="unFlodMenu" class="ml">{{$t('sideBar.ownSpace')}}</span>
                  </MenuItem>

                  <MenuItem name="allreport" v-if="gameList.length>0 && flodMenu" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="ios-paper-outline" @click="unfold"/>
                  </MenuItem>

                  <Submenu name="report" v-if="gameList.length>0 && unFlodMenu">
                      <template slot="title">
                          <Icon type="ios-paper-outline"></Icon>
                          {{$t('sideBar.report')}}
                      </template>
                      <MenuItem name="allreport" >{{$t('sideBar.allReport')}}</MenuItem>
                      <Submenu name='nareport' v-if="gameStr.includes('NA')||gameStr.includes('H5')">
                          <template slot="title">{{$t('sideBar.naReport')}}</template>
                          <MenuItem name="naAll">{{$t('sideBar.naAll')}}</MenuItem>
                          <MenuItem name="nahfive" v-if='gameList.includes("H5电子游戏")'>{{$t('sideBar.naHFive')}}</MenuItem>
                          <MenuItem name="nanomsy" v-if='gameList.includes("H5电子游戏-无神秘奖")'>{{$t('sideBar.nanomsy')}}</MenuItem>
                      </Submenu>
                      <Submenu name='kyreport' v-if="gameList.includes('KY棋牌游戏')">
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
                      <Submenu name='mgreport' v-if="gameList.includes('MG电子游戏')">
                          <template slot="title">{{$t('sideBar.mgReport')}}</template>
                          <MenuItem name="mgvideo">{{$t('sideBar.mgVideo')}}</MenuItem>
                      </Submenu>
                      <Submenu name='agreport' v-if="gameStr.includes('AG真人')">
                          <template slot="title">{{$t('sideBar.agReport')}}</template>
                          <MenuItem name="agtrue">{{$t('sideBar.agTrue')}}</MenuItem>
                      </Submenu>
                      <Submenu name='rtgReport'  v-if="gameList.includes('RTG电子游戏')">
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
                      <Submenu name='pngReport' v-if='gameList.includes("PNG电子游戏报表")'>
                          <template slot="title">{{$t('sideBar.pngReport')}}</template>
                          <MenuItem name="pngGame">{{$t('sideBar.pngGame')}}</MenuItem>
                      </Submenu>
                  </Submenu>

                  <MenuItem name="dayMerchant" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="md-stats" />
                    <span v-if="unFlodMenu" class="ml">{{$t('sideBar.dayMerchant')}}</span>
                  </MenuItem>
              
                  <MenuItem name="playList" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="md-game-controller-b" />
                    <span v-if="unFlodMenu" class="ml">{{$t('sideBar.player')}}</span>
                  </MenuItem>
                

                  <MenuItem name="prizeList" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="md-trophy" />
                    <span v-if="unFlodMenu" class="ml">{{$t('sideBar.prizeList')}}</span>
                  </MenuItem>

                  <!-- <MenuItem name="noTransfer" v-if="permission && flodMenu" :class="flodMenu ? 'flodMuenS' : 'class-b' ">
                    <Icon type="logo-yen" />
                  </MenuItem>
                  <Submenu name="noTransfer" v-if="permission && unFlodMenu">
                      <template slot="title">
                          <Icon type="logo-yen" />
                          免转中心
                      </template>
                      <MenuItem name="noTransferReport" >输赢报表</MenuItem>
                      <MenuItem name="flow">流水交易</MenuItem>
                  </Submenu> -->

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
      return arr
    },
    gameStr(){
        return this.gameList.toString()
    },
    permission() {
      if (JSON.parse(localStorage.getItem('userInfo')).transferURL) {
        return true
      }
        return false
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
/deep/ .ivu-menu {
  color:#fff;
}

/deep/ .ivu-menu-vertical .ivu-menu-item:hover, .ivu-menu-vertical .ivu-menu-submenu-title :hover {
  
  color: #20c1dc;
  background: #192028
}
/deep/ .ivu-menu-submenu-title:hover {
  background: #192028;
  color: #20c1dc !important;
}



/deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: #20c1dc;
  color:#fff;
}
.showMenu {
  transition: all 0.2s ease;
}
.flodMuenS {
  display: flex;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
}
#logo {
  color: #fff;
  display: flex;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
#logo .logoimg {
  display: flex;
  width: 90%;
  height: 50px;
  justify-content: center;
}
#logo .arrow {
  display: flex;
  align-items: center;
}
#logo .logoimg img {
  margin: 0;
  display: block;
  width: 50%;
  height: 100%;
}
.foldIcon {
  cursor: pointer;
  margin-right:1.5rem;
  display: flex;
  align-items: center;
}
.ml{
  margin-left: .3rem;
}
/deep/ .ivu-tooltip {
  z-index: 999;
 
}
/deep/ .ivu-tooltip-popper .ivu-tooltip-dark {
  z-index: 999;
}
/deep/ .ivu-tooltip-content {
  z-index: 9999;
}
/deep/ .ivu-tooltip-inner {
  background: red;
   z-index: 999;
}

/dee/ .ivu-tooltip-rel {
   z-index: 999;

}
</style>
