<template>
    <div class="sider">
        <Sider width='256px' collapsible hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <!-- <img class="logoimg" src="../../static/logo.png" alt=""> -->
            <Menu ref="sideMenu" :active-name="$route.name" :open-names="openName" theme="dark" width="auto" @on-select='selectMenu'>
                <!-- <MenuItem name="board">
                <Icon type="stats-bars"></Icon>
                <span>看板</span>
                </MenuItem> -->
                <MenuItem name="ownspace-index">
                <Icon type="person"></Icon>
                <span>个人中心</span>
                </MenuItem>
                <Submenu name="report" v-if="gameList.length>0">
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        输赢报表
                    </template>
                    <MenuItem name="allreport">公司输赢总报表</MenuItem>
                    <Submenu name='nareport' v-if="gameStr.includes('NA')||gameStr.includes('H5')">
                        <template slot="title">NA游戏报表</template>
                        <MenuItem name="naAll">NA游戏总报表</MenuItem>
                        <!-- <MenuItem name="navideo" v-if="gameList.includes('NA电子游戏')">NA电子游戏报表</MenuItem>
                        <MenuItem name="nastreet" v-if="gameList.includes('NA街机游戏')">NA街机游戏报表</MenuItem>
                        <MenuItem name="natrue" v-if="gameStr.includes('NA真人')">NA真人游戏报表</MenuItem> -->
                        <!-- <MenuItem name="jump" v-if="gameStr.includes('NA真人')">NA真人游戏报表(跳转)</MenuItem> -->
                        <!-- <MenuItem name="nacard" v-if="gameList.includes('NA棋牌游戏')">NA棋牌游戏报表</MenuItem>
                        <MenuItem name="nafishing" v-if="gameList.includes('NA捕鱼游戏')">NA捕鱼游戏报表</MenuItem> -->
                        <MenuItem name="nahfive" v-if='gameList.includes("H5电子游戏")'>NA电子H5报表</MenuItem>
                        <!-- <MenuItem name="natruehfive" v-if='gameList.includes("H5真人视讯")'>NA真人H5报表</MenuItem> -->
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
                <Submenu name="dayReport">
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        日报表
                    </template>
                    <MenuItem name="dayCompany">公司日列表</MenuItem>
                    <MenuItem name="dayMerchant">商户日报表</MenuItem>
                </Submenu>
                <Submenu name="businessCenter">
                    <template slot="title">
                        <Icon type="model-s"></Icon>
                        商户中心
                    </template>
                    <MenuItem name="dealerList">线路商列表</MenuItem>
                    <MenuItem name="merchantList">商户列表</MenuItem>
                </Submenu>
                <Submenu name="playerCenter">
                    <template slot="title">
                        <Icon type="ios-game-controller-b"></Icon>
                        玩家中心
                    </template>
                    <MenuItem name="playList">玩家列表</MenuItem>
                </Submenu>

               <!--  <Submenu name="logCenter">
                    <template slot="title">
                        <Icon type="bug"></Icon>
                        日志中心
                    </template>
                    <MenuItem name="loginLog" >登录日志</MenuItem>
                    <MenuItem name="operationLog">操作日志</MenuItem> -->
                    <!-- <MenuItem name="managerLog">线路商登录日志</MenuItem>
                    <MenuItem name="managerOpreateLog">线路商操作日志</MenuItem>
                    <MenuItem name="merchantLog">商户登录日志</MenuItem> -->
                    <!-- <MenuItem name="merchantOpreateLog">商户操作日志</MenuItem> -->
                <!-- </Submenu>
                <Submenu name="noTransfer">
                    <template slot="title">
                        <Icon type="social-usd"></Icon>
                        免转中心
                    </template>
                    <MenuItem name="noTransferReport">输赢报表</MenuItem>
                    <MenuItem name="flow">流水交易</MenuItem>
                </Submenu> -->
            </Menu>
        </Sider>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    // let game=this.gameList;
    //console.log(this.gameList);
    // console.log(str.includes("报表"));
  },
  methods: {
    selectMenu(name) {
      
        this.$router.push({ name: name });
      
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

<style scoped>
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
.logoimg {
  max-width: 180px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
