<template>
  <div class="p-playerlist">
    <div class="propList-search">
      <Row class="row -search-row">
        <Col span="1" style="margin-right:1rem">{{$t('playerList.playerID')}}</Col>
        <Col span="3" style="margin-right:0rem">
          <Input v-model="searchInfo.userId" size="small"></Input>
        </Col>
        <Col span="2">{{$t('playerList.PlayerAccount')}}</Col>
        <Col span="3" style="margin-right:0rem">
          <Input v-model="searchInfo.userName" size="small"></Input>
        </Col>
        <Col span="2">{{$t('playerList.PlayerNickname')}}</Col>
        <Col span="3" style="margin-right:0rem">
          <Input v-model="searchInfo.nickname" size="small"></Input>
        </Col>
        <Col span="2">{{$t('playerList.gameStatus')}}</Col>
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
              v-for="(item, index) in getGameTypeList"
              :value="item.name"
              :key="index"
              
            >{{ item.name }}</Option>
          </Select>
        </Col>
        <Col span="3">
          <div class="btns">
            <Button type="primary" @click="getSearch(true)" style="margin-right:.3rem" size="small">{{$t('playerList.search')}}</Button>
            <Button @click="getSearch(false)" size="small">{{$t('playerList.reset')}}</Button>
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
          <Tag type="border" :color="stateConfig(row ,true)">{{playerStatusConfig(row)}}</Tag>
        </template>
        <template slot-scope="{row, index}" slot="gameStateName">
          <Tag type="border" :color="gameStateConfig(row)">{{row.gameStateName}}</Tag>
        </template>
        <!-- <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceConfig(row)}}</span>
        </template> -->
        <!-- <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createAtConfig(row)}}</span>
        </template> -->
        <template slot-scope="{row, index}" slot="joinTime">
          <span>{{updateAtConfig(row)}}</span>
        </template>
       <template slot-scope="{row, index}" slot="action">
          <Button type="text" size="small" style="color:#20a0ff" @click="playDetail(row)">{{$t('playerList.see')}}</Button>
          <Button type="text" size="small" :style="{color:stateConfig(row, false)}" @click="changeStatus(row)">{{row.state ? $t('playerList.stop') : $t('playerList.open')}}</Button>
        </template>
      </Table>

      <Spin size="large" fix v-if="isFetching">
       <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
        <div>{{$t('playerList.loading')}}</div>
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
import { getCNGameType, getENGameType } from "@/config/getGameType"
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
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '玩家ID' : 'ID'
            )
          }
        },
         {
          title: "玩家账号",
          align: "center",
          key: "userName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '玩家账号' : 'Account'
            )
          }
        },
        {
          title: "玩家昵称",
          slot: "nickname",
          align: "center",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '玩家昵称' : 'Nickname'
            )
          }
        },
        {
          title: "所属商户ID",
          key: "buId",
          align: "center",
          minWidth: 80,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '所属商户ID' : 'Merchant ID'
            )
          }
        },
        {
          title: "所属商户",
          align: "center",
          minWidth: 50,
          key: "merchantName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '所属商户' : 'Merchant Name'
            )
          }
        },
        
        {
          title: "状态",
          slot: "state",
          maxWidth: 90,
          align: "center",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '状态' : 'State'
            )
          }
        },
        {
          title: "游戏状态",
          align: "center",
          slot: "gameStateName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '游戏状态' : 'Game Status'
            )
          }
        },
        {
          title: "点数",
          key: "balance",
          sortable: true,
          align: "center",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.balance));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '点数' : 'Point'
            )
          }
        },
       {
          title: "注册时间",
          slot: "createdAt",
          align: "center",
          sortable: true,
          render: (h, params) => {
            return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD"));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '注册时间' : 'Registration'
            )
          }
        },
        {
          title: "最近登录游戏时间",
          align: "center",
          slot: "joinTime",
          sortable: true,
          minWidth: 55,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '最近登录游戏时间' : 'Latest Login'
            )
          }
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作' : 'Operation'
            )
          }
        }
      ]
    };
  },
  created() {
    this.getPlayList();
    //this.getGameTypeList();
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
    },
    getGameTypeList() {
    
      let GameListEnum = []
      let val = JSON.parse(localStorage.getItem('userInfo')).gameList 
      if (this.$store.state.language == 'zh') {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < getCNGameType().length; j++) {
            if (val[i].code == getCNGameType()[j].code) {
              GameListEnum.push(getCNGameType()[j])
            }
          }
        }
        this.defaultStatus = '全部'
        GameListEnum.unshift({ code: "0", name: "离线" })
        GameListEnum.unshift({ code: "1", name: "大厅" })
        GameListEnum.unshift({ code: "", name: "全部" , value: "全部"})
      } else {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < getENGameType().length; j++) {
            if (val[i].code == getENGameType()[j].code) {
              GameListEnum.push(getENGameType()[j])
            }
          }
        }
        this.defaultStatus = 'All'
        GameListEnum.unshift({ code: "0", name: "Offline" })
        GameListEnum.unshift({ code: "1", name: "Lobby" })
        GameListEnum.unshift({ code: "", name: "All" , value: "All"})
      }


      let gameTypeList = GameListEnum;


      return gameTypeList
    }
  },
  methods: {
    //玩家状态
    playerStatusConfig(row) {
      let playerStatus = []
      if (this.$store.state.language == 'zh') {
        playerStatus = ["已停用", "正常"]
      } else {
        playerStatus = ["frezze", "normal"]
      }
      return playerStatus[row.state]
    },
    //状态
    stateConfig(row, bool) {
      
      if (bool) {
        return row.state ? 'green' : 'red'
      } else {
        return row.state ? 'red' : '#20a0ff'
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
    /* balanceConfig(row) {
      return thousandFormatter(row.balance)
    }, */
    //注册时间
    /* createAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD")
    }, */
    //最近游戏登录时间
    updateAtConfig(row) {
      return dayjs(row.joinTime).format("YYYY-MM-DD HH:mm:ss")
    },

    selectionChange(val) {
      this.checkedArray = val;
    },
    playDetail(row) {
      localStorage.setItem("playerName", row.userName);
      localStorage.setItem("playDetail", "playDetail");
      this.$router.push({
        name: "playDetail",
        query: {
          name: row.userName,
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
        title: this.$store.state.language == 'zh' ? "提示!" : "Tips!",
        content: this.$store.state.language == 'zh' ? `<p>是否${row.state ? "停用" : "启用"}该玩家？</p>` : `<p>Confirm ${row.state ? "freeze" : "unfreeze"} the player?</p>` ,
        onOk: () => {
          httpRequest("post", "/player/forzen", {
            userName: row.userName,
            state: row.state ? 0 : 1
          }).then(res => {
            let message = this.$store.state.language == 'zh' ? "状态改变成功" : "Success"
            this.$Message.success(message);
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
        //this.getGameTypeList()
      }
      this.playerList = [];
      this.playerListStorage = [];
      this.playerListStartKey = "";
      this.currentPage = 1;
      this.nowPage = 1;
      this.getPlayList();
    },
    
  },
  watch: {
      '$store.state.language': function() {
        if(this.$route.name == 'playList') {
          this.getSearch(false)
        }
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
