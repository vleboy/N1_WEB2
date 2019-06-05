<template>
  <div class="player">
    <div class="search">
      <DatePicker
        type="datetimerange"
        :options="options"
        :editable="false"
        v-model="defaultTime"
        placeholder="选择日期时间范围(默认最近一周)"
        style="width: 300px"
        @on-ok="search"
        size="small"
      ></DatePicker>
      <span class="searchLabel">所属标识</span>
      <Input v-model.trim="parent" placeholder="所属标识" style="width: 200px" size="small"></Input>
      <span class="searchLabel">请选择游戏</span>
      <Select style="width:200px" v-model="game" size="small">
        <Option v-for="(item,index) in selectOption" @click.native="changeGameType(item.code)" :value="item.name" :key="index">{{ item.name }}</Option>
      </Select>
      <Checkbox
        v-model="isTest"
        :style="{marginLeft:'1rem',fontSize:'14px'}"
        @on-change="search"
      >隐藏测试</Checkbox>
      <span class="btn">
        <Button type="primary" @click="search" size="small" style="margin-right: .3rem">搜索</Button>
        <Button  @click="reset" size="small">重置</Button>
      </span>
    </div>
    <Table :columns="columns1" :data="player" size="small" ref="table">
      <template slot-scope="{row, index}" slot="isTest">
        <span>{{row.isTest == 0 ? "正式" : "测试"}}</span>
      </template>
      <template slot-scope="{row, index}" slot="userName">
        <Tooltip content="前往玩家详情" placement="top">
          <span style="cursor:pointer;color:#20a0ff" @click="userName(row)">{{row.userName}}</span>
        </Tooltip>
      </template>
      <template slot-scope="{row, index}" slot="betAmount">
        <span>{{betAmount(row)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="winloseAmount">
        <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
      </template>
      <template slot-scope="{row, index}" slot="gameTypeMap">
        <Poptip placement="left-end" width="400" trigger="hover" transfer>
          <span style="color:#20a0ff;cursor:pointer">{{gameTypeMap(row).len + '款游戏'}}</span>
          <div slot="content">
            <Table :columns="gameTypeMap(row).column" :data="gameTypeMap(row).data"></Table>    
          </div>
        </Poptip>
      </template>
    </Table>
    <Row class="count_row">
      <Col span="4" offset="12">
        总下注次数:
        <span class="num">{{allBetCount|format}}</span>
      </Col>
      <Col span="4">
        总下注金额:
        <span class="num">{{allBetAmount|format}}</span>
      </Col>
      <Col span="4">
        总输赢金额:
        <span class="num">{{allWinLose|format}}</span>
      </Col>
    </Row>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import { getGameType } from "@/config/getGameType";
import { getDefaultTime } from "@/config/getDefaultTime";
export default {
  name: "playerReport",
  components: {},
  filters: {
    format(v) {
      return v.toLocaleString();
    }
  },
  props: {},
  data() {
    return {
      options: {
        shortcuts: [
          {
            text: "本周",
            value() {
              return [
                new Date(
                  dayjs()
                    .startOf("week")
                    .valueOf() +
                    24 * 60 * 60 * 1000
                ),
                new Date(
                  dayjs()
                    .endOf("second")
                    .valueOf()
                )
              ];
            }
          },
          {
            text: "本月",
            value() {
              return [
                new Date(
                  dayjs()
                    .startOf("month")
                    .valueOf()
                ),
                new Date(
                  dayjs()
                    .endOf("second")
                    .valueOf()
                )
              ];
            }
          },
          {
            text: "上周",
            value() {
              return [
                new Date(
                  dayjs()
                    .add(-1, "week")
                    .startOf("week")
                    .valueOf() +
                    24 * 60 * 60 * 1000
                ),
                new Date(
                  dayjs()
                    .startOf("week")
                    .valueOf() +
                    24 * 60 * 60 * 1000 -
                    1
                )
              ];
            }
          },
          {
            text: "上月",
            value() {
              //-1 上月
              return [
                new Date(
                  dayjs()
                    .add(-1, "month")
                    .startOf("month")
                    .valueOf()
                ),
                new Date(
                  dayjs()
                    .startOf("month")
                    .valueOf() - 1
                )
              ];
            }
          }
        ]
      },
      defaultTime: getDefaultTime(),
      spinShow: false,
      allBetCount: 0,
      allBetAmount: 0,
      allWinLose: 0,
      selectOption: [],
      game: "全部游戏",
      parent: "",
      isTest: true,
      gameTypeList: [],
      gameType: [
        3,
        70000,
        90000,
        1070000,
        1010000,
        10300000,
        1050000,
        1060000,
        1100000,
        1110000,
        1130000,
        1140000,
        1150000,
        1160000,
        1120000,
        1080000
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 60
        },
        {
          title: "类型",
          slot: "isTest"
        },
        {
          title: "所属用户",
          key: "parentName"
        },
        {
          title: "所属昵称",
          key: "parentDisplayName"
        },
        {
          title: "所属标识",
          key: "parentSn"
        },
        {
          title: "玩家账号",
          slot: "userName"
        },
        {
          title: "玩家ID",
          key: "userId"
        },
        {
          title: "下注次数",
          key: "betCount"
        },
        {
          title: "下注金额",
          slot: "betAmount"
        },
        {
          title: "输赢金额",
          slot: "winloseAmount"
        },
        {
          title: "游戏详情",
          slot: "gameTypeMap"
        }
      ],
      player: []
    };
  },
  computed: {
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        if (index == 1 && item.getTime() > Date.now() - 180000) {
          return Date.now() - 180000;
        }
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    },
    test() {
      return this.isTest ? 0 : 2;
    }
  },
  watch: {},
  created() {
    this.getGames();
    this.getPlayerList(this.gameType);
  },
  methods: {

    //玩家账号
    userName(row) {
      localStorage.setItem("playerName", row.userName);
      this.$router.push({
        name: "playDetail",
        query: {
          name: row.userName,
          type: this.gameTypeList == "" ? "" : this.gameTypeList,
          time: this.changedTime
        }
      })
      localStorage.setItem("playDetail", "playDetail")
    },
    //下注金额
    betAmount(row) {
      return thousandFormatter(row.betAmount)
    },
    //输赢金额
    winloseAmount(row) {
      let color = row.winloseAmount < 0 ? "#f30" : "#0c0";
      return {winloseAmount: thousandFormatter(row.winloseAmount), color}  
    },
    //游戏详情
    gameTypeMap(row) {
   
      let column = [
        {
          title: "游戏名",
          key: "gameTypeName"
        },
        {
          title: "下注次数",
          key: "betCount"
        },
        {
          title: "下注金额",
          key: "betAmount"
        },
        {
          title: "输赢金额",
          key: "winloseAmount"
        }
      ];
      let gameList = row.gameTypeMap;
      let data = [];
      for (let key in gameList) {
        let obj = {};
        let item = gameList[key]
        obj.gameTypeName = item.gameTypeName
        obj.betCount = item.betCount
        obj.betAmount = item.betAmount
        obj.winloseAmount = item.winloseAmount
        data.push(obj);
      }
      let len = data.length
            
      return {column,data,len}          
          
    },







    changeGameType(val) {
      this.gameTypeList = val
      this.getPlayerList()
    },
    getPlayerList() {
      this.spinShow = true;
      httpRequest("post", "/queryRealPlayerStat", {
        gameType: this.gameTypeList == "" ? this.gameType : this.gameTypeList,
        query: {
          createdAt: this.changedTime,
          parent: this.parent
        },
        isTest: this.test
      })
        .then(res => {
          if (res.code == 0) {
            let list = res.payload;
            this.player = list;
            this.getAllCount(list);
          }
        })
        .finally(() => {
          this.spinShow = false;
        });
    },
    getAllCount(list) {
      this.allBetCount = 0;
      this.allBetAmount = 0;
      this.allWinLose = 0;
      for (let item of list) {
        this.allBetCount += item.betCount;
        this.allBetAmount += item.betAmount;
        this.allWinLose += item.winloseAmount;
      }
      this.allBetAmount = +this.allBetAmount.toFixed(2);
      this.allWinLose = +this.allWinLose.toFixed(2);
    },
    getGames() {
      this.selectOption = getGameType()
    },
    search() {
      this.getPlayerList();
    },
    reset() {
      this.defaultTime = getDefaultTime();
      this.game = "-1";
      this.parent = "";
      this.isTest = true;
      this.getPlayerList(this.gameType);
    }
  }
};
</script>
<style lang="less" scoped>
.player {
  min-height: 89vh;
  .search {
    margin-bottom: 16px;
    .searchLabel {
      margin: 0 1rem;
    }
    .btn {
      margin-left: 1rem;
    }
  }
  .count_row {
    line-height: 32px;
    padding: 10px 0;
  }
  .num {
    font-weight: bold;
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
/deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
  /deep/.ivu-select-selection {
    border-color: #000;
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
</style>
