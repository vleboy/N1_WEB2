<template>
  <div class="notransfer">
    <div class="search">
      <Row class="row">
        <Col span="24" style="textAlign:right">
         <Select v-model="gameType" style="width:110px" @on-change="search" size="small">
          <Option v-for="item in gameTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker size="small" type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="search"></DatePicker>
        <Button @click="search" size="small">搜索</Button>
        <Button @click="reset" size="small">重置</Button>
        </Col>
      </Row>
    </div>
    <Table :columns="columns" size="small" :data="reportList">
      <template slot-scope="{row, index}" slot="winloseAmount">
        <span :style="{color:winloseAmountConfig(row)}">{{row.winloseAmount}}</span>
      </template>
      <template slot-scope="{row, index}" slot="protal">
        <span>{{row.transferMap["70000"].name}}</span>
      </template>
      <template slot-scope="{row, index}" slot="gameCode">
        <div v-if="gameCodeConfig(row).isShow" style="margin: 8px 0px;border: 1px solid rgb(0, 0, 0);borderRadius:5px;textAlign:center;height:24px">
          <span>{{gameCodeConfig(row).text}}</span>
          <div :style="{width:gameCodeConfig(row).width,backgroundColor:gameCodeConfig(row).backgroundColor,marginTop: '-19px',borderRadius: '5px',height: '24px'}"></div>
        </div>
        <div v-else></div>
      </template>
    </Table>
    <div>
      <p class="sum">所属玩家汇总</p>
      <Table :columns="columns1" size="small" :data="playerList">
        <template slot-scope="{row, index}" slot="userId">
          <span style="color:#20a0ff;cursor: pointer" @click="userIdConfig(row)">{{row.userId}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pyWinloseAmount">
          <span :style="{color:pyWinloseAmountConfig(row).color}">{{pyWinloseAmountConfig(row).amount}}</span>
        </template>
      </Table>
    </div>
     <!-- <Modal v-model="pointModal" title="预警点数" :width='450' @on-ok="changePoint" @on-cancel='cancel'>
      <p class='gameTitle'>H5电子游戏</p>
      <p class="current">当前值 {{winloseAmount}}/{{topAmount}}</p>
      <Row class="current">
        <Col span="8"> 设定值:{{winloseAmount}}/
        </Col>
        <Col span="12">
        <Input v-model="newAmount" :number='true' size="small" placeholder="请输入"></Input>
        </Col>
      </Row>
    </Modal> -->
    <Spin size="large" fix v-if="spin">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
import dayjs from 'dayjs';
import { getDefaultTime } from "@/config/getDefaultTime";
import util from "@/libs/util.js";
export default {
  name: "notransferReport",
  components: {},
  filters: {},
  props: {},
  data() {
    return {
       gameType: "A",
      gameTypeList: [
        {
          value: "A",
          label: "全部大类"
        },
        {
          value: 70000,
          label: "H5电子游戏"
        }
      ],
      
      spin: false,
      showPlayer: false,
      defaultTime: getDefaultTime(true),
      columns: [
        {
          title: "接入方标识",
          align: 'center',
          key: "plat"
        },
        {
          title: "下注次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "下注金额",
          align: 'center',
          key: "betAmount"
        },
        {
          title: "退款金额",
          align: 'center',
          key: "refundAmount"
        },
        {
          title: "返还金额",
          align: 'center',
          key: "retAmount"
        },
        {
          title: "返奖金额",
          align: 'center',
          key: "winAmount"
        },
        {
          title: "输赢金额",
          align: 'center',
          slot: "winloseAmount"
        },
         {
          title: "接入商",
          align: 'center',
          key: "portal"
        },
        {
          title: "历史游戏点数消耗",
          align: 'center',
          slot: "gameCode"
        },
      ],
      columns1: [
        {
          title: "玩家ID",
          align: 'center',
          slot: "userId"
        },
        {
          title: "玩家昵称",
          align: 'center',
          key: "userNick"
        },
        {
          title: "下注次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "下注金额",
          align: 'center',
          key: "betAmount"
        },
        {
          title: "退款金额",
          align: 'center',
          key: "refundAmount"
        },
        {
          title: "返还金额",
          align: 'center',
          key: "retAmount"
        },
        {
          title: "返奖金额",
          align: 'center',
          key: "winAmount"
        },
        {
          title: "输赢金额",
          align: 'center',
          slot: "pyWinloseAmount",
          
        }
      ],
      reportList: [],
      playerList: []
    };
  },
  computed: {
    options() {
      return {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
            value() {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
            value() {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
            value() {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
            value() {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      }
    },
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    }
  },
  watch: {},
  created() {
    this.init();
  },
  methods: {
      /* setTop(row) {
      let transferMap = row.transferMap["70000"];
      let topAmount = transferMap.topAmount;
      let winloseAmount = transferMap.winloseAmountMap.winloseAmount.toFixed(2);
      this.topAmount = topAmount;
      this.winloseAmount = winloseAmount;
      this.plat = row.plat;
      this.pointModal = true;
    }, */
    //输赢金额
    winloseAmountConfig(row) {
      if (row.winloseAmount > 0) {
        return "#0c0"
      } else {
        return "#f30"
      }    
    },
    //历史游戏消耗点数
    gameCodeConfig(row) {
      if (row.transferMap) {
        let transferMap = row.transferMap["70000"];
        let topAmount = transferMap.topAmount;
        let winloseAmount = transferMap.winloseAmountMap.winloseAmount.toFixed(2);
        let text = winloseAmount + "/" + topAmount;
        let width = 0;
        let color = "#fff";
        if (
          winloseAmount < topAmount &&
          winloseAmount > 0 &&
          topAmount > 0
        ) {
          width = ((100 * winloseAmount) / topAmount).toFixed(2) + "%";
          if (winloseAmount / topAmount > 0.8) {
            color = "red";
          } else {
            color = "#0c0";
          }
        } else if (
          winloseAmount > 0 &&
          topAmount > 0 &&
          winloseAmount > topAmount
        ) {
          (width = "100%"), (color = "red");
        }
        return {text: text, width:width,backgroundColor: color}
      } else {
        return {isShow: false}
      }
          
    },
    //玩家ID
    userIdConfig(row) {
      this.$router.push({
        path: "/transfer/flow",
        query: {
          userId: row.userId
        }
      })
    },
    //玩家输赢金额
    pyWinloseAmountConfig(row) {
      if (row.winloseAmount > 0) {
        return {winloseAmount: row.winloseAmount,color:"#0c0"}
      } else {
        return {winloseAmount: row.winloseAmount,color:"#f30"}
      }   
    },
    changePoint() {
      httpRequest("post", "/transferMap", {
        topAmount: this.newAmount,
        gameType: "70000",
        plat: this.plat
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.newAmount = "";
          this.reset();
        }
      });
    },
    search() {
      this.init();
    },
     cancel() {
      this.plat = "";
      this.newAmount = "";
    },
    reset() {
      this.defaultTime = getDefaultTime(true);
      this.reportList = [];
      this.showPlayer = false;
      this.playerList = [];
      this.init();
    },
    async init() {
      this.spin = true;
      let req1= httpRequest("post", "/transferUserStat", {
        startTime: util.timeZoneConversion(this.changedTime[0],this.$store.state.timeZone),
        gameType:this.gameType,
        endTime:util.timeZoneConversion(this.changedTime[1],this.$store.state.timeZone)
      })
      let req2= httpRequest("post", "/transferUserStat", {
        startTime: util.timeZoneConversion(this.changedTime[0],this.$store.state.timeZone),
        endTime: util.timeZoneConversion(this.changedTime[1],this.$store.state.timeZone),
        gameType:this.gameType,
        handleType: "player"
      })
      let[current,player]=await this.axios.all([req1,req2])
      this.reportList = current.payload;
      this.playerList = player.payload;
      this.spin=false
    }
  }
};
</script>
<style lang="less" scoped>
.notransfer {
  min-height: 89vh;
  .search {
    margin-bottom: 10px;
    .label {
      padding-right: 15px;
    }
  }
  .sum {
    line-height: 36px;
  }
}
.gameTitle {
  text-align: center;
  margin: 10px auto;
  font-size: 16px;
}
.current {
  margin: 20px auto;
  font-size: 14px;
  text-indent: 1em;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
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
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
</style>
