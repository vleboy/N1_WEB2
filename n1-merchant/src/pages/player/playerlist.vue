<template>
  <div class="p-playerlist">
    <div class="propList-search">
      <Row class="row -search-row">
        <Col span="1" style="margin-right:1rem">玩家ID</Col>
        <Col span="3" style="margin-right:0rem">
          <Input v-model="searchInfo.userId" placeholder="请输入" size="small"></Input>
        </Col>
        <Col span="2">玩家账号</Col>
        <Col span="3" style="margin-right:0rem">
          <Input v-model="searchInfo.userName" placeholder="请输入" size="small"></Input>
        </Col>
        <Col span="2">玩家昵称</Col>
        <Col span="3" style="margin-right:0rem">
          <Input v-model="searchInfo.nickname" placeholder="请输入" size="small"></Input>
        </Col>
        <Col span="2">游戏状态</Col>
        <Col span="3" style="margin-right:1rem">
          <Select
            v-model="defaultStatus"
            clearable
            placeholder="请选择游戏状态"
            style="text-align: left"
            size="small"
            @on-change="changeGameStatus"
          >
            <Option
              v-for="(item, index) in gameTypeList"
              :value="item.name"
              :key="index"
              
            >{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="2">
          <div class="btns">
            <Button type="primary" @click="getSearch(true)" style="margin-right:.3rem" size="small">搜索</Button>
            <Button @click="getSearch(false)" size="small">重置</Button>
          </div>
        </Col>
      </Row>
    </div>
    <div class="playerform">
      <Table :columns="columns" :data="getItems">
         <template slot-scope="{row, index}" slot="nickname">
          <span>{{row.nickname === "NULL!" ? "-" : row.nickname}}</span>
        </template>
        <template slot-scope="{row, index}" slot="state">
          <Tag type="border" :color="stateConfig(row)">{{playerStatus[row.state]}}</Tag>
        </template>
        <template slot-scope="{row, index}" slot="gameStateName">
          <Tag type="border" :color="gameStateConfig(row)">{{row.gameStateName}}</Tag>
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
          <span>{{updateAtConfig(row)}}</span>
        </template>
       <template slot-scope="{row, index}" slot="action">
          <Button type="text" size="small" style="color:#20a0ff" @click="playDetail(row)">查看</Button>
          <Button type="text" size="small" style="color:#20a0ff" @click="changeStatus(row)">{{row.state ? "停用" : "开启"}}</Button>
        </template>
      </Table>

      <Spin size="large" fix v-if="isFetching">
       <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
        <div>加载中...</div>
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
import { getGameType } from "@/config/getGameType";
import dayjs from "dayjs";
import {
  formatUserName,
  unFormatUserName,
  thousandFormatter
} from "@/config/format";
export default {
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
      playerListStorage: [],
      playerListStartKey: "",
      playerStatus: ["已停用", "正常"],
      checkedArray: [],
      names: [],
      searchInfo: {
        gameId: "全部",
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
          align: "center",
          maxWidth: 90,
          
        },
         {
          title: "玩家账号",
          align: "center",
          key: "userName",
          
        },
        {
          title: "商户ID",
          key: "buId",
          align: "center",
         
        },
        {
          title: "所属商户",
          align: "center",
          minWidth: 50,
          key: "merchantName",
          sortable: true
        },
        {
          title: "玩家昵称",
          slot: "nickname",
         
          align: "center"
        },
        {
          title: "状态",
          slot: "state",
          sortable: true,
          maxWidth: 90,
          align: "center"
        },
        {
          title: "游戏状态",
          align: "center",
          slot: "gameStateName",
          sortable: true
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
          align: "center",
          sortable: true
        },
        {
          title: "最近登录游戏时间",
          align: "center",
          slot: "joinTime",
          sortable: true,
          minWidth: 55
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        }
      ]
    };
  },
  created() {
    this.getPlayList();
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
    //状态
    stateConfig(row) {
      if (row.state) {
        return 'green'
      } else {
        return 'red'
      }
    },
    //游戏状态
    gameStateConfig(row) {
      if (row.gameState == 3 || row.gameState == 2) {
        return "green"
      } else {
        return ""
      }
    },
    //点数
    balanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    //注册时间
    createAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD")
    },
    //最近游戏登录时间
    updateAtConfig(row) {
      return dayjs(row.joinTime).format("YYYY-MM-DD HH:mm:ss")
    },

    selectionChange(val) {
      this.checkedArray = val;
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
      if (this.isFetching) return;
      this.isFetching = true;
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
      
      if (!bool) {
        this.searchInfo = {
          gameId: "",
          userName: "",
          nickname: "",
          suffix: "",
          msn: ""
        }
        this.defaultStatus = '全部'
      }
      this.playerList = [];
      this.playerListStorage = [];
      this.playerListStartKey = "";
      this.currentPage = 1;
      this.nowPage = 1;
      this.getPlayList();
    },
    getGameTypeList() {
      let GameListEnum = getGameType()
      GameListEnum.shift()
      GameListEnum.unshift({ code: "0", name: "离线" })
      GameListEnum.unshift({ code: "1", name: "大厅" })
      GameListEnum.unshift({ code: "", name: "全部" , value: "全部"})

      this.gameTypeList = GameListEnum;
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
   
    text-align: center;
    
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }

  /deep/ .ivu-table-cell {
    padding: 0;
  }
  .propList-search {
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
  
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
  /deep/.ivu-select-selection {
    border-color: #000;
  }
}
</style>
