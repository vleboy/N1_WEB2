<template>
  <div class="p-playerlist">
    <div class="propList-search">
      <p >玩家ID</p>
      <p class="input">
        <Input v-model="searchInfo.userId" placeholder="请输入" size="small"></Input>
      </p>
      <p>商户ID</p>
      <p class="input">
        <Input v-model="searchInfo.buId" placeholder="请输入" size="small"></Input>
      </p>
      <p>商户标识</p>
      <p class="input">
        <Input v-model="searchInfo.parentSn" placeholder="请输入" size="small"></Input>
      </p>
      <p>游戏状态</p>
      <p class="input">
        <Select
          size="small"
          v-model="searchInfo.gameId"
          clearable
          placeholder="请选择游戏状态"
          style="text-align: left"
        >
          <Option
            v-for="(item, index) in gameTypeList"
            :value="item.code"
            :key="index"
          >{{ item.name }}</Option>
        </Select>
      </p>
      <p>
        <Button type="primary" @click="getSearch(true)" style="margin-right:.3rem" size="small">搜索</Button>
        <Button @click="getSearch(false)" size="small">重置</Button>
      </p>
    </div>

    <div class="playerform">
      <!--<Row class="-list-btn">-->
      <!--<Col>-->
      <!--<Button type="primary" @click="allChangeState(0)">批量停用</Button>-->
      <!--<Button type="primary" @click="allChangeState(1)">批量开启</Button>-->
      <!--</Col>-->
      <!--</Row>-->


      <Table :columns="columns" :data="getItems" no-data-text="请输入查询条件">
        <template slot-scope="{row, index}" slot="buId">
          <Tooltip content="前往商户列表" placement="top">
            <span @click="buIdConfig(row)" style="color:#20a0ff;cursor:pointer">{{row.buId}}</span>
          </Tooltip>
        </template>  
        <template slot-scope="{row, index}" slot="nickname">
          <span>{{row.nickname === "NULL!" ? "-" : row.nickname}}</span>
        </template>
        <template slot-scope="{row, index}" slot="state">
          <Tag type="border" :color="stateConfig(row).color">
            {{stateConfig(row).state}}
          </Tag> 
        </template>
        <template slot-scope="{row, index}" slot="gameState">
          <Tag type="border" :color="gameStateConfig(row)">
            {{row.gameStateName}}
          </Tag> 
        </template>
        <template slot-scope="{row, index}" slot="balance">
         <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="createdAt">
         <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
         <span>{{joinTimeConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
         <div style="display:flex;justify-content: space-around">
           <Button type="text" size="small" style="color:#20a0ff" @click="operateCheck(row)">查看</Button>
           <Button type="text" size="small" :style="{color:operateConfig(row)}" @click="operateState(row)">{{row.state ? "停用" : "开启"}}</Button>
         </div>
        </template>
      </Table>

      <Spin size="large" fix v-show="isFetching" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
      <div style="text-align: right;margin:2rem 0">
        <Page
          :total="playerList.length"
          :page-size="20"
          :current.sync="currentPage"
          @on-change="getNowpage"
        ></Page>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
import {
  formatUserName,
  unFormatUserName,
  thousandFormatter
} from "@/config/format";
import { getGameType } from "@/config/getGameType";
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
      if (localStorage.playList == "playList") {
        vm.searchInfo.parentSn = vm.$route.query.sn;
        vm.getSearch(true);
      }
    });
  },
  beforeCreate() {},
  data() {
    return {
      nowSize: 20,
      nowPage: 1,
      pageSize: 100,
      currentPage: 1,
      showSearch: false,
      isFetching: false,
      isLastMessage: false, // 主要判断是否是后台返回最后一次信息
      playerList: [],
      playerListStorage: [],
      playerListStartKey: "",
      playerStatus: ["已停用", "正常"],
      checkedArray: [],
      names: [],
      searchInfo: {
        gameId: "",
        userName: "",
        suffix: "",
        parentSn: "",
        msn: ""
      },
      role: localStorage.loginRole, // 相应角色的权限（区分商户、线路商、平台角色）
      gameTypeList: [],
      columns: [
        {
          title: "玩家ID",
          key: "userId",
          align: "center",
          maxWidth: 100
        },
        {
          title: "玩家账号",
          key: "userName",
          align: "center",
     
        },
        {
          title: "玩家昵称",
          slot: "nickname",

          align: "center"
        },
        {
          title: "商户ID",
          slot: "buId",
 
          align: "center"
        },
        {
          title: "所属商户",
          key: "merchantName",
          align: "center",

        },
        
        {
          title: "状态",
          slot: "state",
          sortable: true,
          align: "center"
        },
        {
          title: "游戏状态",
          slot: "gameState",
          sortable: true,
          align: "center"
        },
        {
          title: "点数",
          slot: "balance",
          sortable: true,
          align: "center"
        },
        {
          title: "注册时间",
          slot: "createdAt",
          sortable: true,
          maxWidth: 120
        },
        {
          title: "最近登录游戏时间",
          slot: "joinTime",
          sortable: true
        },
        {
          title: "操作",
          slot: "operate",
          align: "center"
        }
      ]
    };
  },
  created() {
    // this.getPlayList();
    this.getGameTypeList();
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

    //商户ID
    buIdConfig(row) {
     
      localStorage.setItem("merchantList", "merchantList")
      //(localStorage.getItem('merchantList'));
      
      
      this.$router.push({
        name: "merchantList",
        query: { buId: row.buId }
      });
      
    },
    //状态
    stateConfig(row) {
     let color = row.state ? "green" : "red"
     return {state: this.playerStatus[row.state], color}
    },
    //游戏状态
    gameStateConfig(row) {
      return row.gameState == 3 || row.gameState == 2 ? "green" : ""
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
      return dayjs(row.joinTime).format("YYYY-MM-DD HH:mm:ss")
    },
    //操作
    //查看
    operateCheck(row) {
      this.playDetail(row)
    },
    //启用停用
    operateState(row) {
      this.changeStatus(row);
    },
    operateConfig(row) {
      return row.state ? "red" : "blue"
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
    getPlayList() {
      this.isFetching = true;
      if (
        this.$route.name == "playList" &&
        localStorage.playList == "playList"
      ) {
        localStorage.removeItem("playList");
      }
      //if (this.isFetching) return;
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

        console.log(this.gameTypeList); 
        
        // this.$store.commit('closeLoading')
      });*/
      this.gameTypeList = getGameType();
      this.gameTypeList.shift();
      this.gameTypeList.unshift({ code: "0", name: "离线" });
      this.gameTypeList.unshift({ code: "1", name: "大厅" });
      this.gameTypeList.unshift({ code: "", name: "全部", value: "全部" });
    }
  }
};
</script>

<style scpoed lang="less" type="text/less">
.p-playerlist {
  .propList-search {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
    .input {
      
      margin: 0 1rem;
    }
    .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  /deep/ .ivu-tabs-bar {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs-nav {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs-nav-scroll {
    height: 2.25rem;
  }
  
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: #000;
    color: #000;
    background: #fff;
  }
 
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    background: #000;
    color: #fff;
  }
  
  /deep/.ivu-select-selection {
    border-color: #000;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper {
    border: 1px solid #ccc;
    color: #000;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
  
}

</style>
