<template>
  <div class="p-playerlist">
    <div class="propList-search">
        <p>玩家ID</p>
        <p style="margin:0 1rem">
          <Input v-model="searchInfo.userId" placeholder="请输入"size="small"></Input>
        </p>
        <p>玩家账号</p>
        <p style="margin:0 1rem">
          <Input v-model="searchInfo.userName" placeholder="请输入"size="small"></Input>
        </p>
        <p>玩家昵称</p>
        <p style="margin:0 1rem">
          <Input v-model="searchInfo.nickname" placeholder="请输入"size="small"></Input>
        </p>
        <p>游戏状态</p>
        <p style="margin:0 1rem">
          <Select v-model="defaultStatus" clearable placeholder="请选择游戏状态" style="width:150px;text-align: left" size="small"  @on-change="changeGameStatus">
            <Option v-for="(item, index) in gameTypeList" :value="item.name" :key="index">{{ item.name }}</Option>
          </Select>
        </p>
        <div class="btns">
          <Button type="primary" @click="getSearch(true)" style="margin-right:.3rem" size="small">搜索</Button>
          <Button @click="getSearch(false)" size="small">重置</Button>
        </div>
    </div>
    <div class="playerform">
      <!--<Row class="-list-btn">-->
      <!--<Col>-->
      <!--<Button type="primary" @click="allChangeState(0)">批量停用</Button>-->
      <!--<Button type="primary" @click="allChangeState(1)">批量开启</Button>-->
      <!--</Col>-->
      <!--</Row>-->
      <Table :columns="columns" :data="getItems">
        <template slot-scope="{row, index}" slot="nickname">
          {{row.nickname === "NULL!" ? "-" : row.nickname}}
        </template>
        <template slot-scope="{row, index}" slot="state">
          <Tag type="border" :color="stateConfig(row).color">{{stateConfig(row).state}}</Tag> 
        </template>
        <template slot-scope="{row, index}" slot="gameState">
          <Tag type="border" :color="gameStateConfig(row).color">{{gameStateConfig(row).gameState}}</Tag> 
        </template>
        <template slot-scope="{row, index}" slot="balance">
          {{balanceConfig(row)}}
        </template>
        <template slot-scope="{row, index}" slot="createdAt">
          {{createdAtConfig(row)}}
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
          {{joinTimeConfig(row)}}
        </template>
         <template slot-scope="{row, index}" slot="operate">
          <div>
            <Button type="text" size="small" style="color:#20a0ff" @click="operateCheck(row)">查看</Button>
            <Button type="text" size="small" style="color:#20a0ff" @click="operateState(row)">{{row.state ? "停用" : "开启"}}</Button>
          </div>
        </template>
      </Table>
      <Spin size="large" fix v-if="isFetching">
        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
      </Spin>
      <div style="text-align: right;margin:2rem 0">
        <Page :total="playerList.length" show-elevator :page-size="20" :current.sync="currentPage" @on-change="getNowpage"></Page>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { httpRequest } from "@/service/index";
import { getGameType } from "@/config/getGameType";
import dayjs from "dayjs";
import {
  formatUserName,
  unFormatUserName,
  thousandFormatter
} from "@/config/format";
import { type } from 'os';
export default {
   beforeRouteEnter(to, from, next) {
    /* console.log(this, 'beforeRouteEnter'); // undefined
    console.log(to, '组件独享守卫beforeRouteEnter第一个参数');
    console.log(from, '组件独享守卫beforeRouteEnter第二个参数');
    console.log(next, '组件独享守卫beforeRouteEnter第三个参数'); */
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      //console.log(vm);//当前组件的实例
      if (localStorage.playList == 'playList') {
        vm.searchInfo.parentSn = vm.$route.query.sn;
        vm.getSearch(true)
      }

    });
  },
  beforeCreate() {},
  data() {
    return {
      defaultStatus: '全部',
      nowSize: 20,
      nowPage: 1,
      pageSize: 100,
      currentPage: 1,
      showSearch: false,
      isFetching: false,
      isLastMessage: false, // 主要判断是否是后台返回最后一次信息
      playerList: [],
      GameListEnum: [
        {code: "0",name: '离线'},
        {code: '1', name: '大厅'},
        { company: "NA", code: "70000", name: "H5电子游戏" },
        { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" },
        { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        { company: "TTG", code: "1010000", name: "TTG电子游戏" },
        { company: "PNG", code: "1020000", name: "PNG电子游戏" },
        { company: "MG", code: "10300000", name: "MG电子游戏" },
        { company: "HABA", code: "1040000", name: "HABA电子游戏" },
        { company: "AG", code: "1050000", name: "AG真人游戏" },
        { company: "SA", code: "1060000", name: "SA真人游戏" },
        { company: "SA", code: "1110000", name: "SA捕鱼游戏" },
        { company: "PG", code: "1090000", name: "PG电子游戏" },
        { company: "YSB", code: "1130000", name: "YSB体育游戏" },
        { company: "RTG", code: "1140000", name: "RTG电子游戏" },
        { company: "SB", code: "1080000", name: "SB电子游戏" },
        { company: "SB", code: "1120000", name: "SB真人游戏" },
        { company: "DT", code: "1150000", name: "DT电子游戏" },
        { company: "PP", code: "1160000", name: "PP电子游戏" }
      ],
      playerListStorage: [],
      playerListStartKey: "",
      playerStatus: ["已停用", "正常"],
      checkedArray: [],
      names: [],
      searchInfo: {
        gameId: "",
        userName: "",
        nickname: "",
        suffix: "",
        msn: ""
      },
      role: localStorage.loginRole, // 相应角色的权限（区分商户、线路商、平台角色）
      gameTypeList: [],
      columns: [
        {
          title: "玩家ID",
          key: "userId",
          align: 'center',
          sortable: true
        },
        {
          title: "玩家账号",
          key: "userName",
          align: 'center',
          sortable: true
        },
        {
          title: "商户ID",
          align: 'center',
          key: "buId",
          sortable: true
        },
        {
          title: "所属商户",
          align: 'center',
          key: "merchantName",
          sortable: true
        },
        {
          title: "玩家昵称",
          align: 'center',
          slot: "nickname",
          sortable: true
        },
        {
          title: "状态",
          align: 'center',
          slot: "state",
          sortable: true
        },
        {
          title: "游戏状态",
          align: 'center',
          slot: "gameState",
          sortable: true
        },
        {
          title: "点数",
          align: 'center',
          slot: "balance",
          sortable: true
        },
        {
          title: "注册时间",
          align: 'center',
          slot: "createdAt",
          sortable: true
        },
        {
          title: "最近登录游戏时间",
          align: 'center',
          slot: "joinTime",
          sortable: true,
          minWidth: 60
        },
        {
          title: "操作",
          align: 'center',
          slot: "operate",
          align: "center"
        }
      ]
    };
  },
  created() {
    // this.getPlayList();
    this.getGameTypeList();
    this.getSearch(true)
  },
  computed: {
    getItems() {
      if (this.nowPage === 1) {
        return this.playerList.slice(0, this.nowSize);
      } else {
        return this.playerList.slice(
          (this.nowPage - 1) * this.nowSize,
          this.nowSize * this.nowPage
        );
      }
    }
  },
  methods: {
    //状态
    stateConfig(row) {
      let color = row.state ? "green" : "red"
      return {state: this.playerStatus[row.state], color}    
    },
    
    //游戏状态
    gameStateConfig(row) {
      let color = ''
      if (row.gameState == 3 || row.gameState == 2) {
        color = 'green'
      } else {
        color = '#000'
      }
      return {gameState: row.gameStateName, color} 
    },
    //点数
    balanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    //注册时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD")
    },
    //最近登录时间
    joinTimeConfig(row) {
      return row.joinTime ? dayjs(row.joinTime).format("YYYY-MM-DD HH:mm:ss") : ''    
    },
    /* 操作 */
    //查看
    operateCheck(row) {
      this.playDetail(row);
    },
    //停用启用
    operateState(row) {
      this.changeStatus(row)
    },
    selectionChange(val) {
      this.checkedArray = val;
      // console.log(this.checkedArray, '被选中的多选')
    },
    playDetail(row) {
      localStorage.setItem("playerName", row.userName);
      this.$router.push({
        name: "playDetail",
        query: {
          name: row.userName
        }
      });
    },
    changeGameStatus(val) {
      for (let i = 0; i < this.gameTypeList.length; i++) {
        if (this.gameTypeList[i].name ==  val) {
          this.searchInfo.gameId = this.gameTypeList[i].code
        }  
      }
    },
    getPlayList() {
      //if (this.isFetching) return;
      this.isFetching = true;
      if (this.$route.name == 'playList' && localStorage.playList == 'playList') {
        localStorage.removeItem('playList')
      }
      // this.$store.commit('startLoading')
      this.searchInfo.startKey = this.playerListStartKey;
      this.searchInfo.pageSize = this.pageSize;
      httpRequest("post", "/player/list", this.searchInfo)
        .then(result => {
          for (let item of result.list) {
            item.userNameParent = formatUserName(item.userName);
          }
          this.isLastMessage = result.list < this.pageSize;
          this.playerList = result.list;
          this.playerListStartKey = result.startKey;
          this.playerListStorage.length &&
            (this.playerList = this.playerListStorage.concat(this.playerList));

          this.isFetching = false;
        })
        .catch(() => {
          this.isFetching = false;
        });
    },
    changeStatus(row) {
      this.$Modal.confirm({
        title: "提示!",
        content: `<p>是否${row.state ? "停用" : "启用"}该玩家？</p>`,
        onOk: () => {
          httpRequest("post", "/player/forzen", {
            userName: row.userName,
            state: row.state ? 0 : 1
          }).then(res => {
            this.$Message.success("状态改变成功");
            row.state = row.state ? 0 : 1; // 本地修改状态
          });
        }
      });
    }, // 更改玩家状态
    allChangeState(num) {
      if (!this.checkedArray.length) {
        return this.$message({
          message: "请选择需要批量操作的数据",
          type: "error"
        });
      }
      this.checkedArray.forEach(item => {
        this.names.push(item.userName);
      });
      // this.$store.commit('startLoading')
      invoke({
        url: api.allForzenPlay,
        method: api.post,
        data: {
          names: this.names,
          state: num
        }
      }).then(result => {
        const [err, res] = result;
        if (err) {
          this.$message({
            message: err.msg,
            type: "error"
          });
        } else if (res) {
          this.$message({
            message: "状态改变成功",
            type: "success"
          });
          for (let item of this.checkedArray) {
            for (let data of this.playerList) {
              if (item.userName == data.userName) {
                item.state = num;
              }
            }
          }
        }
        this.names = [];
        this.$store.commit("closeLoading");
      });
    },
    getNowsize(size) {
      this.nowSize = size;
    },
    getNowpage(page) {
      this.nowPage = page;
      if (
        page == Math.ceil(this.playerList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage
      ) {
        this.playerListStorage = JSON.parse(JSON.stringify(this.playerList));
        this.getPlayList();
      }
    },
    getSearch(bool) {
      !bool &&
        (this.searchInfo = {
          gameId: "",
          userName: "",
          nickname: "",
          suffix: "",
          msn: ""
        });
      this.playerList = [];
      this.playerListStorage = [];
      this.playerListStartKey = "";
      this.currentPage = 1;
      this.nowPage = 1;
      this.getPlayList();
    },
    getGameTypeList() {
      /* httpRequest(
        "post",
        "/gameBigType",
        {
          companyIden: -1
        },
        "game"
      ).then(result => {
        for (let item of result.payload) {
          if (item.code != "10000") {
            this.gameTypeList.push(item);
          }
        }
        this.gameTypeList.unshift(
          {
            code: "0",
            name: "离线"
          },
          {
            code: "1",
            name: "大厅"
          }
        );
        // this.$store.commit('closeLoading')
      }); */
      this.gameTypeList = getGameType()
      this.gameTypeList.unshift(
        { code: "", name: "全部" , value: "全部"},
        {code: "0",name: '离线'},
        {code: '1', name: '大厅'},
      )
    }
  }
};
</script>

<style scpoed lang="less" type="text/less">
.p-playerlist {
  min-height: 89vh;
  .propList {
    padding: 1rem 2rem;
  }
  .-list-btn {
    padding: 16px 0;
  }
  .-search-row {
    padding-bottom: 10px;
  }
  .propList-search {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  /deep/ .ivu-table-cell {
    padding: 0;
  }
}
</style>
