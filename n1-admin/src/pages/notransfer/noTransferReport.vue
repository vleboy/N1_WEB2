<template>
  <div class="notransfer">
    <div class="search">
      <Row class="row" style="display:flex">
        <span class="label">接入方标识</span>
        <Input v-model="plat" @keyup.native.enter="search" style="width: 150px;margin:0 1rem" placeholder="请输入" size="small"></Input>
        <Select v-model="gameType" style="width:110px" @on-change="search" size="small">
          <Option v-for="item in gameTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <DatePicker size="small" type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px;margin:0 1rem" @on-ok="search"></DatePicker>
        <Button size="small" type="primary" @click="search" style="margin-right:.3rem">搜索</Button>
        <Button size="small"  @click="reset">重置</Button>
      </Row>
    </div>
    <Table :columns="columns" size="small" :data="reportList">
      <template slot-scope="{row, index}" slot="plat">
        <span @click="platConfig(row)" style="color:#20a0ff;cursor:pointer">{{row.plat}}</span>
      </template>
      <template slot-scope="{row, index}" slot="userWinloseAmount">
        <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
      </template>
      <template slot-scope="{row, index}" slot="portal">
        <span>{{row.transferMap["70000"].name}}</span>
      </template>
      <template slot-scope="{row, index}" slot="historyCode">
        <div v-if="historyCodeConfig(row).isShow" style="margin:8px 0px;border:1px solid rgb(0,0,0);border-radius:5px;textAligh:center;height:24px">
          <div :style="{width:historyCodeConfig(row).width,backgroundColor:historyCodeConfig(row).backgroundColor,borderRadius: '5px',height: '22px'}">
            <p style="width:160px;height:22px">{{historyCodeConfig(row).text}}</p>
          </div>
        </div>
        <div v-else></div>
      </template>
       <template slot-scope="{row, index}" slot="operate">
        <span @click="operateConfig(row)" style="color:#20a0ff;cursor:pointer">设定点数警告上限</span> 
      </template>
    </Table>
    <div v-if="showPlayer">
      <p class="sum"> {{parent}} 所属玩家汇总</p>
      <Table :columns="columns1" size="small" :data="playerList">
      <template slot-scope="{row, index}" slot="playerWinloseAmount">
          <span style="corlor:#20a0ff;cursor:pointer" @click="userIdConfig(row)">
            {{row.userId}}
          </span>
        </template> 
        <template slot-scope="{row, index}" slot="playerWinloseAmount">
         <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template> 
      </Table>
    </div>
    <Modal v-model="pointModal" title="预警点数" :width='450' @on-ok="changePoint" @on-cancel='cancel'>
      <p class='gameTitle'>H5电子游戏</p>
      <p class="current">当前值 {{winloseAmount}}/{{topAmount}}</p>
      <Row class="current">
        <Col span="8"> 设定值:{{winloseAmount}}/
        </Col>
        <Col span="12">
        <Input v-model="newAmount" :number='true' size="small" placeholder="请输入"></Input>
        </Col>
      </Row>
    </Modal>
    <Spin size="large" fix v-if="spin">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { httpRequest } from "@/service/index";
import { getDefaultTime } from "@/config/getDefaultTime";
export default {
  name: "notransferReport",
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      plat: "",
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
      newAmount: "",
      winloseAmount: "",
      topAmount: "",
      pointModal: false,
      spin: false,
      parent: "",
      showPlayer: false,
      defaultTime: getDefaultTime(true),
      options: {
        shortcuts: [
          {
            text: "本周",
            value() {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: "本月",
            value() {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: "上周",
            value() {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: "上月",
            value() {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      },
      columns: [
        {
          title: "接入方标识",
          align: 'center',
          slot: "plat"
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
          slot: "userWinloseAmount"
        },
        {
          title: "接入商",
          align: 'center',
          slot: "portal"
        },
        {
          title: "历史游戏点数消耗",
          align: 'center',
          slot: "historyCode"
        },
        {
          title: "操作",
          align: 'center',
          slot: "operate"
        }
      ],
      columns1: [
        {
          title: "玩家ID",
          slot: "userId"
        },
        {
          title: "玩家昵称",
          key: "userNick"
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
          title: "退款金额",
          key: "refundAmount"
        },
        {
          title: "返还金额",
          key: "retAmount"
        },
        {
          title: "返奖金额",
          key: "winAmount"
        },
        {
          title: "输赢金额",
          slot: "playerWinloseAmount"
        }
      ],
      reportList: [],
      playerList: []
    };
  },
  computed: {
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
    this.getReportList();
  },
  methods: {
    //接入商标识
    platConfig(row) { 
      this.parent = row.plat
      this.showPlayer = true
      this.getPlayerList(row.plat)
    },
    //输赢金额
    winloseAmountConfig(row) {
      let color = row.winloseAmount > 0 ? "#0c0" : "#f30"
      return {winloseAmount: row.winloseAmount, color}
    },
    //历史消耗点数
    historyCodeConfig(row) {
            if (row.transferMap) {
              let transferMap = row.transferMap["70000"];
              let topAmount = transferMap.topAmount;
              let winloseAmount = transferMap.winloseAmountMap.winloseAmount.toFixed(
                2
              );
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
              
              return {isShow: true, width,backgroundColor: color, text}
              
            } else {
              return {isShow: false}
            }
          
    },
    //操作
    operateConfig(row) {
      this.setTop(row);
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
    
    setTop(row) {
      let transferMap = row.transferMap["70000"];
      let topAmount = transferMap.topAmount;
      let winloseAmount = transferMap.winloseAmountMap.winloseAmount.toFixed(2);
      this.topAmount = topAmount;
      this.winloseAmount = winloseAmount;
      this.plat = row.plat;
      this.pointModal = true;
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
      this.getReportList();
    },
    cancel() {
      this.plat = "";
      this.newAmount = "";
    },
    reset() {
      this.plat = "";
      this.defaultTime = getDefaultTime(true);
      this.reportList = [];
      this.showPlayer = false;
      this.playerList = [];
      this.getReportList();
    },
    getReportList() {
      this.spin = true;
      httpRequest("post", "/transferUserStat", {
        startTime: this.changedTime[0],
        endTime: this.changedTime[1],
        gameType:this.gameType,
        plat: this.plat
      })
        .then(res => {
          if (res.code == 0) {
            this.reportList = res.payload;
          }
        })
        .finally(() => {
          this.spin = false;
        });
    },
    getPlayerList(plat) {
      this.spin = true;
      httpRequest("post", "/transferUserStat", {
        startTime: this.changedTime[0],
        endTime: this.changedTime[1],
        plat: plat,
        gameType:this.gameType,
        handleType: "player"
      })
        .then(res => {
          if (res.code == 0) {
            this.playerList = res.payload;
          }
        })
        .finally(() => {
          this.spin = false;
        });
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
/deep/ .ivu-table-cell {
  padding: 0
} 
</style>
