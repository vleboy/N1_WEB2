<template>
  <div class="saAll" style="width:120%">
    <div class="nowList">
      <div class="top">
        <p class="title">
          当前用户列表
          <Button @click="exportdata('table_0')" size="small">导出数据</Button>
        </p>
        <div class="right">
          <DatePicker size="small" type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="confirm"></DatePicker>
          <Button size="small" type="primary" @click="search" style="margin:0 .3rem 0 1rem">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref='table_0'>
        <template slot-scope="{row, index}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span
            :style="{color: winloseAmountConfig(row).color}"
          >{{winloseAmountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userSubmitAmount">
          <span>{{submitAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uTrueWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1060000'], row).color}"
          >{{gameWinloseAmountConfig(['1060000'], row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uTrueSubmitAmount">
          <span>{{gameSubmitAmountConfig(['1060000'], row).submitAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uFishWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1110000'], row).color}"
          >{{gameWinloseAmountConfig(['1110000'], row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uFishSubmitAmount">
          <span>{{gameSubmitAmountConfig(['1110000'], row).submitAmount}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        所属玩家列表
        <Button @click="exportdata('table_1')" size="small">导出数据</Button>
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref='table_1'>
        <template slot-scope="{row, index}" slot="playerName">
          <Tooltip content="前往玩家详情" placement="right">
            <span
              style="cursor:pointer;color:#20a0ff"
              @click="playerNameConfig(row)"
            >{{row.userName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="nickname">
          {{row.nickname == 'NULL!' ? '-' : row.nickname}}
        </template>
        <template slot-scope="{row, index}" slot="playerWinloseAmount">
          <span
            :style="{color: winloseAmountConfig(row).color}"
          >{{winloseAmountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pTrueWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1060000'], row).color}"
          >{{gameWinloseAmountConfig(['1060000'], row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pFishWinloseAmount">
          <span
            :style="{color: gameWinloseAmountConfig(['1110000'], row).color}"
          >{{gameWinloseAmountConfig(['1110000'], row).winloseAmount}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import { thousandFormatter } from "@/config/format";
import {
  getWinloseAmount,
  getsubmitAmount,
  winloseAmountCount
} from "@/config/getAmount";
export default {
  data() {
    return {
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
      defaultTime: getDefaultTime(),
      spinShow: false, //加载spin
      playerList: [], //玩家列表
      user: [], //当前商户
      gameType: [1060000, 1110000],
      columns1: [
        {
          title: "序号",
          maxWidth: 60,
          align: 'center',
          type: "index"
        },
        {
          title: "类型",
          align: 'center',
          slot: "role"
        },
        {
          title: "昵称",
          align: 'center',
          key: "displayName"
        },
        {
          title: "管理员账号",
          align: 'center',
          key: "username"
        },
        {
          title: "交易次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "总游戏输赢金额",
          align: 'center',
          slot: "userWinloseAmount"
        },
        {
          title: "总游戏交公司",
          align: 'center',
          slot: "userSubmitAmount"
        },
        {
          title: "SA真人游戏(输赢金额)",
          align: 'center',
          slot: "uTrueWinloseAmount"
        },
        {
          title: "SA真人游戏(商家交公司)",
          align: 'center',
          slot: "uTrueSubmitAmount"
        },
        {
          title: "SA捕鱼游戏(输赢金额)",
          align: 'center',
          slot: "uFishWinloseAmount"
        },
        {
          title: "SA捕鱼游戏(商家交公司)",
          align: 'center',
          slot: "uFishSubmitAmount"
        }
      ],
      columns2: [
        {
          title: "序号",
          align: 'center',
          maxWidth: 60,
          type: "index"
        },
        {
          title: "用户名",
          align: 'center',
          slot: "playerName"
        },
        {
          title: "昵称",
          align: 'center',
          slot: "nickname"
        },
        {
          title: "交易次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "总游戏输赢金额",
          align: 'center',
          slot: "playerWinloseAmount"
        },
        {
          title: "SA真人游戏(输赢金额)",
          align: 'center',
          slot: "pTrueWinloseAmount"
        },
        {
          title: "SA捕鱼游戏(输赢金额)",
          align: 'center',
          slot: "pFishWinloseAmount"
        }
      ]
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
    }
  },
  methods: {
    /* 用户 */
    //类型
    roleConfig(row) {
      return this.types(row.role) 
    },
    //总游戏输赢金额
    winloseAmountConfig(row) {
      if (row.winloseAmount < 0) {
        return { amount: thousandFormatter(row.winloseAmount), color: "#f30" };
      } else {
        return { amount: thousandFormatter(row.winloseAmount), color: "#0c0" };
      }
    },
    //总游戏交公司
    submitAmountConfig(row) {
      return thousandFormatter(row.submitAmount);
    },

    //游戏输赢金额
    gameWinloseAmountConfig(arr, row, name) {
      let winloseAmount = getWinloseAmount(arr, row);
      winloseAmount = winloseAmount.toFixed(2);
      if (winloseAmount < 0) {
        return { winloseAmount, color: "#f30" };
      } else {
        return { winloseAmount, color: "#0c0" };
      }
    },
    //游戏交公司
    gameSubmitAmountConfig(arr, row, name) {
      let submitAmount = getsubmitAmount(arr, row);
      submitAmount = submitAmount.toFixed(2);
      return { submitAmount };
    },

    /* 玩家 */
    //用户名
    playerNameConfig(row) {
      localStorage.setItem("playerName", row.userName);
      this.$router.push({
        name: "playDetail",
        query: {
          name: row.userName
        }
      });
    },
    confirm() {
      this.init();
    },
    exportdata(table) {
      if (table == "table_0") {
        this.$refs.table_0.exportCsv({ filename: "current" });
      } else if (table == "table_1") {
        this.$refs.table_1.exportCsv({ filename: "player" });
      }
       this.$Notice.config({
        top: 200,
        duration: 10
      });
      this.$Notice.success({
        title: "温馨提示:",
        desc:
          "因导出报表含中文字符,导出后请进行转码操作,方法是：1、先用记事本打开；2、点击文件-另存为-设置编码为ASNI-保存覆盖"
      });
    },
    reset() {
      this.defaultTime = getDefaultTime();
      this.init();
    },
    search() {
      this.init();
    },
    types(value) {
      switch (value) {
        case "0":
          return "超级管理员";
          break;
        case "1":
          return "管理员";
          break;
        case "10":
          return "线路商";
          break;
        case "100":
          return "商户";
          break;
        case "1000":
          return "代理";
          break;
        case "10000":
          return "玩家";
          break;
      }
    },
    async init() {
      let userId = localStorage.loginId;
      this.spinShow = true;
      let params1 = {
        userId: userId,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let params2 = {
        parentId: userId,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getPlayerList", params2);
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];
      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.playerList = perms.payload;
      }
    }
  },
  created() {
    // console.log(this.defaultTime);
    this.init();
  }
};
</script>
<style lang="less" scoped>
.saAll {
  min-height: 90vh;
  .title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    clear: both;
    .right {
     display: inline-block;
      padding-left: 20px;
    }
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
}
</style>
