<template>
    <div class="sider">
        <Sider width='256px' collapsible hide-trigger :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
            <!-- <img class="logoimg" src="../../static/logo.png" alt=""> -->
            <Menu ref="sideMenu" :active-name="$route.name" :open-names="openName" theme="dark" width="auto" @on-select='selectMenu'>
                <!-- <MenuItem name="board" v-if='permission.includes("看板")'>
                <Icon type="stats-bars"></Icon>
                  <span>看板</span>
                </MenuItem> -->
                <MenuItem name="newBoard" v-if='permission.includes("数据看板")'>
                  <Icon type="stats-bars"></Icon>
                  <span>数据看板</span>
                </MenuItem>
                <MenuItem name="ownspace-index" v-if='permission.includes("个人中心")'>
                <Icon type="person"></Icon>
                <span>个人中心</span>
                </MenuItem>
                <Submenu name="report" v-if='authorityStr.includes("报表")'>
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        输赢报表
                    </template>
                    <MenuItem name="allreport" v-if='permission.includes("公司输赢总报表")'>公司输赢总报表</MenuItem>
                    <MenuItem name="playerReport" v-if='permission.includes("玩家输赢报表")'>玩家输赢总报表</MenuItem>
                    <Submenu name='nareport' v-if='authorityStr.includes("NA")'>
                        <template slot="title">NA游戏报表</template>
                        <MenuItem name="naAll" v-if='permission.includes("NA游戏总报表")'>NA游戏总报表</MenuItem>
                        <!-- <MenuItem name="navideo" v-if='permission.includes("NA电子游戏报表")'>NA电子游戏报表</MenuItem>
                        <MenuItem name="nastreet" v-if='permission.includes("NA街机游戏报表")'>NA街机游戏报表</MenuItem>
                        <MenuItem name="natrue" v-if='permission.includes("NA真人游戏报表")'>NA真人游戏报表</MenuItem> -->
                        <!-- <MenuItem name="jump" v-if='permission.includes("NA真人游戏报表")'>NA真人游戏报表(跳转)</MenuItem> -->
                        <!-- <MenuItem name="nacard" v-if='permission.includes("NA棋牌游戏报表")'>NA棋牌游戏报表</MenuItem>
                        <MenuItem name="nafishing" v-if='permission.includes("NA捕鱼游戏报表")'>NA捕鱼游戏报表</MenuItem> -->
                        <MenuItem name="nahfive" v-if='permission.includes("NA电子H5报表")'>NA电子H5报表</MenuItem>
                        <MenuItem name="nanomys" v-if='permission.includes("NA电子H5无神秘奖报表")'>NA电子H5无神秘奖报表</MenuItem>
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
                    <Submenu name='sareport' v-if='authorityStr.includes("SA")'>
                        <template slot="title">SA游戏报表</template>
                        <MenuItem name="saAll" v-if='permission.includes("SA游戏总报表")'>SA游戏总报表</MenuItem>
                        <MenuItem name="satrue" v-if='permission.includes("SA真人游戏报表")'>SA真人游戏报表</MenuItem>
                        <MenuItem name="safishing" v-if='permission.includes("SA捕鱼游戏报表")'>SA捕鱼游戏报表</MenuItem>
                    </Submenu>
                    <Submenu name='sbreport' v-if='authorityStr.includes("SB游戏总报表")||authorityStr.includes("SB电子游戏报表")||authorityStr.includes("SB真人游戏报表")'>
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

                <Submenu name="dayReport" v-if='authorityStr.includes("日报表")'>
                    <template slot="title">
                        <Icon type="ios-paper-outline"></Icon>
                        日报表
                    </template>
                    <MenuItem name="dayCompany" v-if='permission.includes("公司日报表")'>公司日报表</MenuItem>
                    <MenuItem name="dayMerchant" v-if='permission.includes("商户日报表")'>商户日报表</MenuItem>
                    <MenuItem name="dayManager" v-if='permission.includes("线路商日报表")'>线路商日报表</MenuItem>
                    <MenuItem name="dayPlayer" v-if='permission.includes("玩家日报表")'>玩家日报表</MenuItem>
                </Submenu>


                <Submenu name="businessCenter" v-if='authorityStr.includes("线路商列表")||authorityStr.includes("商户列表")||authorityStr.includes("接入商点数警告列表")'>
                    <template slot="title">
                        <Icon type="person-stalker"></Icon>
                        商户中心
                    </template>
                    <MenuItem name="dealerList" v-if='permission.includes("线路商列表")'>线路商列表</MenuItem>
                    <MenuItem name="merchantList" v-if='permission.includes("商户列表")'>商户列表</MenuItem>
                    <MenuItem name="warnList" v-if='permission.includes("接入商点数警告列表")'>接入商点数警告列表</MenuItem>
                </Submenu>
                <Submenu name="playerCenter" v-if='permission.includes("玩家列表")'>
                    <template slot="title">
                        <Icon type="ios-game-controller-b"></Icon>
                        玩家中心
                    </template>
                    <MenuItem name="playList">玩家列表</MenuItem>
                </Submenu>
                <Submenu name="adminCenter" v-if='authorityStr.includes("管理员列表")||authorityStr.includes("线路号列表")||authorityStr.includes("管理员角色列表")'>
                    <template slot="title">
                        <Icon type="ios-people"></Icon>
                        管理员中心
                    </template>
                    <MenuItem name="adminList" v-if='permission.includes("管理员列表")'>管理员列表</MenuItem>
                    <MenuItem name="adminRole" v-if='permission.includes("管理员角色列表")'>管理员角色列表</MenuItem>
                    <!-- <MenuItem name="lineNumList" v-if='permission.includes("管理员列表")'>线路号列表</MenuItem> -->
                </Submenu>
                <Submenu name="operation" v-if='authorityStr.includes("电子游戏配置")||authorityStr.includes("神秘大奖")'>
                    <template slot="title">
                        <Icon type="gear-b"></Icon>
                        运营中心
                    </template>
                    <MenuItem name="gameManager" v-if="permission.includes('游戏管理')">游戏管理</MenuItem>
                    <Submenu name='mysPrice' v-if="permission.includes('神秘大奖')">
                      <template slot="title">神秘大奖</template>
                      <MenuItem name="sysConfig">系统配置</MenuItem>
                      <MenuItem name="prizeList">中奖记录</MenuItem>
                    </Submenu>
                    <Submenu name='electronicGame' v-if="permission.includes('电子游戏配置')">
                        <template slot="title">电子游戏配置</template>
                        <MenuItem name="numericalControl">数值调控中心</MenuItem>
                    </Submenu>
                        
                </Submenu>
                <Submenu name="logCenter" v-if='authorityStr.includes("日志")'>
                    <template slot="title">
                        <Icon type="bug"></Icon>
                        日志中心
                    </template>
                    <MenuItem name="loginLog" v-if='permission.includes("登录日志")'>登录日志</MenuItem>
                    <MenuItem name="operationLog" v-if='permission.includes("操作日志")'>操作日志</MenuItem>
                    <!-- <MenuItem name="adminLoginLog" v-if='permission.includes("登录日志")'>管理员登录日志</MenuItem>
                    <MenuItem name="adminLog" v-if='permission.includes("操作日志")'>管理员操作日志</MenuItem>
                    <MenuItem name="lineLoginLog" v-if='permission.includes("登录日志")'>线路商登录日志</MenuItem>
                    <MenuItem name="managerOpreateLog" v-if='permission.includes("操作日志")'>线路商操作日志</MenuItem>
                    <MenuItem name="merchantLog" v-if='permission.includes("登录日志")'>商户登录日志</MenuItem> -->
                    <!-- <MenuItem name="merchantOpreateLog" v-if='permission.includes("操作日志")'>商户操作日志</MenuItem> -->
                    <MenuItem name="debugLog" v-if='permission.includes("DEBUG日志")'>DEBUG日志</MenuItem>
                    <MenuItem name="dataRepair" v-if='permission.includes("DEBUG日志")'>DEBUG修正</MenuItem>
                </Submenu>
                 <Submenu name="noTransfer" v-if='permission.includes("流水交易")'>
                    <template slot="title">
                        <Icon type="social-usd"></Icon>
                        免转中心
                    </template>
                    <MenuItem name="noTransferReport">输赢报表</MenuItem>
                    <MenuItem name="flow" v-if='permission.includes("流水交易")'>流水交易</MenuItem>
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
  created() {
    // let permission = this.permission;
    // let str = permission.toString();
  },
  methods: {
    selectMenu(name) {
      this.$router.push({ name: name });
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
