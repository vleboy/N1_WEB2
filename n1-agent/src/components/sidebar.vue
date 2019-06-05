<template>
    <div class="sider">
        <Sider width='256px' collapsible hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <img class="logoimg" src="../../static/logo.png" alt="">
            <Menu ref="sideMenu" :active-name="$route.name" :open-names="openName" theme="dark" width="auto" @on-select='selectMenu'>
                <!-- <MenuItem name="board" v-if='permission.includes("看板") || level!=0'>
                    <Icon type="stats-bars"></Icon>
                    <span>看板</span>
                </MenuItem> -->
                <MenuItem name="ownspace-index" v-if='permission.includes("个人中心")|| level!=0'>
                    <Icon type="person"></Icon>
                    <span>个人中心</span>
                </MenuItem>

                <Submenu name="report" v-if="level==0">
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        输赢报表
                    </template>
                    <MenuItem name="allreport" v-if='permission.includes("公司输赢总报表")'>公司输赢总报表</MenuItem>
                    <MenuItem name="playerReport" v-if='permission.includes("玩家输赢报表")'>玩家输赢总报表</MenuItem>
                    <Submenu name='nareport' v-if="str.includes('NA')">
                        <template slot="title">NA游戏报表</template>
                        <MenuItem name="naAll" v-if='permission.includes("NA游戏总报表")'>NA游戏总报表</MenuItem>
                        <!-- <MenuItem name="navideo" v-if='permission.includes("NA电子游戏报表")'>NA电子游戏报表</MenuItem>
                        <MenuItem name="nastreet" v-if='permission.includes("NA街机游戏报表")'>NA街机游戏报表</MenuItem>
                        <MenuItem name="natrue" v-if='permission.includes("NA真人游戏报表")'>NA真人游戏报表</MenuItem> -->
                        <!-- <MenuItem name="jump" v-if='permission.includes("NA真人游戏报表")'>NA真人游戏报表(跳转)</MenuItem> -->
                        <!-- <MenuItem name="nacard" v-if='permission.includes("NA棋牌游戏报表")'>NA棋牌游戏报表</MenuItem>
                        <MenuItem name="nafishing" v-if='permission.includes("NA捕鱼游戏报表")'>NA捕鱼游戏报表</MenuItem> -->
                        <MenuItem name="nahfive" v-if='permission.includes("NA电子H5报表")'>NA电子H5报表</MenuItem>
                        <MenuItem name="nanomsy" v-if='permission.includes("NA电子H5无神秘奖报表")'>NA电子H5无神秘奖报表</MenuItem>
                        <!-- <MenuItem name="natruehfive" v-if='permission.includes("NA真人h5报表")'>NA真人H5报表</MenuItem> -->
                    </Submenu>
                    <Submenu name='kyreport' v-if='permission.includes("KY棋牌游戏报表")'>
                        <template slot="title">KY游戏报表</template>
                        <MenuItem name="kychess">KY棋牌游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='ttgreport' v-if='permission.includes("TTG电子游戏报表")'>
                        <template slot="title">TTG游戏报表</template>
                        <MenuItem name="ttgvideo">TTG电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='sareport' v-if="str.includes('SA')">
                        <template slot="title">SA游戏报表</template>
                        <MenuItem name="saAll" v-if='permission.includes("SA游戏总报表")'>SA游戏总报表</MenuItem>
                        <MenuItem name="satrue" v-if='permission.includes("SA真人游戏报表")'>SA真人游戏报表</MenuItem>
                        <MenuItem name="safishing" v-if='permission.includes("SA捕鱼游戏报表")'>SA捕鱼游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='sbreport' v-if='permission.includes("SB游戏总报表")||permission.includes("SB电子游戏报表")||permission.includes("SB真人游戏报表")'>
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
                     <Submenu name='ppReport' v-if='permission.includes("PP电子游戏报表")'>
                        <template slot="title">PP游戏报表</template>
                        <MenuItem name="ppGame">PP电子游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='ysbReport' v-if='permission.includes("YSB体育游戏报表")'>
                        <template slot="title">YSB游戏报表</template>
                        <MenuItem name="ysbSport">YSB体育游戏报表</MenuItem>
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
                <Submenu name="report" v-else>
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        输赢报表
                    </template>
                    <MenuItem name="allreport">公司输赢总报表</MenuItem>
                    <Submenu name='nareport' v-if="gameStr.includes('NA')">
                        <template slot="title">NA游戏报表</template>
                        <MenuItem name="naAll">NA游戏总报表</MenuItem>
                        <!-- <MenuItem name="navideo" v-if="gameList.includes('NA电子游戏')">NA电子游戏报表</MenuItem>
                        <MenuItem name="nastreet" v-if="gameList.includes('NA街机游戏')">NA街机游戏报表</MenuItem>
                        <MenuItem name="natrue" v-if="gameStr.includes('NA真人')">NA真人游戏报表</MenuItem> -->
                        <!-- <MenuItem name="jump" v-if="gameStr.includes('NA真人')">NA真人游戏报表(跳转)</MenuItem> -->
                        <!-- <MenuItem name="nacard" v-if="gameList.includes('NA棋牌游戏')">NA棋牌游戏报表</MenuItem> -->
                       <!--  <MenuItem name="nafishing" v-if="gameList.includes('NA捕鱼游戏')">NA捕鱼游戏报表</MenuItem>-->
                        <MenuItem name="nahfive" v-if='gameStr.includes("H5电子游戏")'>NA电子H5报表</MenuItem> 
                        <MenuItem name="nanomsy" v-if='gameStr.includes("H5无神秘奖报")'>NA电子H5无神秘奖报表</MenuItem>
                        <!-- <MenuItem name="natruehfive" v-if='gameList.includes("H5真人游戏")'>NA真人H5报表</MenuItem> -->
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

                <Submenu name="dayReport" v-if="str.includes('日报表')">
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        日报表
                    </template>
                    <MenuItem name="dayCompany" v-if='permission.includes("代理日报表")'>代理日报表</MenuItem>
                    <MenuItem name="dayPlayer" v-if='permission.includes("玩家日报表")'>玩家日报表</MenuItem>
                </Submenu>
               



                <Submenu name="agentCenter" v-if='level==0'>
                    <template slot="title">
                        <Icon type="model-s"></Icon>
                        代理中心
                    </template>
                    <MenuItem name="agentList" v-if='permission.includes("代理列表")'>代理列表</MenuItem>
                    <MenuItem name="warnList" v-if='permission.includes("接入商点数警告列表")'>接入商点数警告列表</MenuItem>
                </Submenu>
                <Submenu name="agentCenter" v-else>
                    <template slot="title">
                        <Icon type="model-s"></Icon>
                        代理中心
                    </template>
                    <MenuItem name="agentList">代理列表</MenuItem>
                    <MenuItem name="warnList">接入商点数警告列表</MenuItem>
                </Submenu>


                <Submenu name="playerCenter" v-if='level==0'>
                    <template slot="title">
                        <Icon type="ios-game-controller-b"></Icon>
                        玩家中心
                    </template>
                    <MenuItem name="playList" v-if='permission.includes("玩家列表")'>玩家列表</MenuItem>
                </Submenu>
                <Submenu name="playerCenter" v-else>
                    <template slot="title">
                        <Icon type="ios-game-controller-b"></Icon>
                        玩家中心
                    </template>
                    <MenuItem name="playList">玩家列表</MenuItem>
                </Submenu>





                <Submenu name="adminCenter" v-if="level==0">
                    <template slot="title">
                        <Icon type="ios-people"></Icon>
                        管理中心
                    </template>
                    <MenuItem name="adminList" v-if='permission.includes("管理员列表")'>管理员列表</MenuItem>
                    <MenuItem name="agentRole" v-if='permission.includes("代理角色列表")'>代理角色列表</MenuItem>
                </Submenu>

                <!-- <Submenu name="gameCenter" v-if="level==0">
                    <template slot="title">
                        <Icon type="gear-b"></Icon>
                        游戏中心
                    </template>
                    <MenuItem name="gameConfig" v-if='permission.includes("包房代理游戏配置")'>包房代理游戏配置</MenuItem>
                </Submenu> -->
                  <!-- <Submenu name="opreateCenter" v-if="level==0">
                    <template slot="title">
                        <Icon type="social-usd"></Icon>
                        运营中心
                    </template>
                    <MenuItem name="prizeList">神秘大奖</MenuItem>
                </Submenu> -->
                <Submenu name="logCenter" v-if="level==0">
                    <template slot="title">
                        <Icon type="bug"></Icon>
                        日志中心
                    </template>
                    <MenuItem name="loginLog" v-if='permission.includes("登录日志")'>登录日志</MenuItem>
                    <MenuItem name="operationLog" v-if='permission.includes("操作日志")'>操作日志</MenuItem>
                    <!-- <MenuItem name="adminLoginLog" v-if='permission.includes("管理员登录日志")'>管理员登录日志</MenuItem>
                    <MenuItem name="adminOpreateLog" v-if='permission.includes("管理员操作日志")'>管理员操作日志</MenuItem>
                    <MenuItem name="agentLoginLog" v-if='permission.includes("代理登录日志")'>代理登录日志</MenuItem>
                    <MenuItem name="agentOpreateLog" v-if='permission.includes("代理操作日志")'>代理操作日志</MenuItem> -->
                </Submenu>
                <Submenu name="logCenter" v-else>
                    <template slot="title">
                        <Icon type="bug"></Icon>
                        日志中心
                    </template>
                    <MenuItem name="agentLoginLog">代理登录日志</MenuItem>
                    <MenuItem name="agentOpreateLog">代理操作日志</MenuItem>
                </Submenu>
            </Menu>
        </Sider>
    </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    level() {
      return JSON.parse(localStorage.getItem("userInfo")).level;
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission||[];
    },
    str() {
      return this.permission.toString();
    },
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
  methods: {
    selectMenu(name) {
      
        this.$router.push({ name: name });
      
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
