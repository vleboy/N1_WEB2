<template>
  <div class="report">
    <div class="nowList">
      <div class="top">
        <p class="title">
          {{$t('allReport.currentUser')}}
          <!-- <Button @click="exportdata('table_0')" size="small">导出数据</Button> -->
        </p>
        <div class="right">
          <DatePicker
            size="small"
            type="datetimerange"
            :options="options"
            :editable="false"
            v-model="defaultTime"
            placeholder="选择日期时间范围(默认最近一周)"
            style="width: 300px"
            @on-ok="confirm"
          ></DatePicker>
          <Button
            type="primary"
            @click="search"
            size="small"
            style="margin:0 .3rem 0 1rem"
          >{{$t('allReport.search')}}</Button>
          <Button @click="reset" size="small">{{$t('allReport.reset')}}</Button>
        </div>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref="table_0">
        <template slot-scope="{row, index}" slot="uDisplayName">
          <Tooltip content="前往日报表" placement="right">
            <span
              style="cursor:pointer;color:#20a0ff"
              @click="uDisplayNameConfig(row)"
            >{{row.uname == 'NULL!' ? '-' : row.uname}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="userBetAmount">
          <span>{{betAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span
            :style="{color: winloseAmountConfig(row).color}"
          >{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userRate">
          <span>{{rateConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userSubmitAmount">
          <span>{{submitAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userProfit">
          <span
            v-if="profitConfig(row).isShow"
          >{{(100 * row.winloseAmount / row.mixAmount).toFixed(2) + "%"}}</span>
          <span v-else>{{0}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList" style="margin-top:1rem">
      <p class="title">
        {{$t('allReport.PlayerList')}}
        <!-- <Button @click="exportdata('table_1')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref="table_1">
        <template slot-scope="{row, index}" slot="playerName">
          <Tooltip content="前往玩家详情" placement="right">
            <span
              style="cursor:pointer;color:#20a0ff"
              @click="playerNameConfig(row)"
            >{{row.userName}}</span>
          </Tooltip>
        </template>
        <template
          slot-scope="{row, index}"
          slot="nickname"
        >{{row.nickname == 'NULL!' ? '-' : row.nickname}}</template>
        <template slot-scope="{row, index}" slot="playerBetAmount">
          <span>{{betAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="playerWinloseAmount">
          <span
            :style="{color:winloseAmountConfig(row).color}"
          >{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import { thousandFormatter } from "@/config/format";
import util from "@/libs/util.js";

export default {
  data () {
    return {

      defaultTime: getDefaultTime(),
      spinShow: false, //加载spin
      playerList: [], //玩家列表
      user: [], //当前商户
      columns1: [
        {
          title: "序号",
          align: 'center',
          type: "index",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },

        {
          title: "昵称",
          align: 'center',
          slot: "uDisplayName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '昵称' : 'Nickname'
            )
          }
        },

        {
          title: "交易次数",
          align: 'center',
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易次数' : 'Transactions Count'
            )
          }
        },
        {
          title: "投注金额",
          align: 'center',
          slot: "userBetAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '投注金额' : 'Bet Amount'
            )
          }
        },
        {
          title: "输赢金额",
          align: 'center',
          slot: "userWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "商家占成",
          align: 'center',
          slot: "userRate",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商家占成' : 'Merchant Occupies'
            )
          }
        },
        {
          title: "商家交公司",
          align: 'center',
          slot: "userSubmitAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商家交公司' : 'Submit Amount'
            )
          }
        },
        {
          title: "获利比例",
          align: 'center',
          slot: "userProfit",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '获利比例' : 'Profit'
            )
          }
        }
      ],
      columns2: [
        {
          title: "序号",
          align: 'center',
          type: "index",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "账号",
          align: 'center',
          slot: "playerName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '账号' : 'Account'
            )
          }
        },
        {
          title: "昵称",
          align: 'center',
          slot: "nickname",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '昵称' : 'Nickname'
            )
          }
        },
        {
          title: "交易次数",
          align: 'center',
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易次数' : 'Transactions Count'
            )
          }
        },
        {
          title: "投注金额",
          align: 'center',
          slot: "playerBetAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '投注金额' : 'Bet Amount'
            )
          }
        },
        {
          title: "输赢金额",
          align: 'center',
          slot: "playerWinloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "洗码量",
          align: 'center',
          key: "mixAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '洗码量' : 'Washing quantity'
            )
          }
        }
      ]
    };
  },
  computed: {
    options () {
      return {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
            value () {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
            value () {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
            value () {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
            value () {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      }
    },
    changedTime () {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        if (index == 1 && item.getTime() > Date.now()) {
          return Date.now();
        }
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    }
  },
  methods: {
    /* 用户 */
    //昵称
    uDisplayNameConfig (row) {
      let time = this.changedTime
      this.$router.push({ name: "dayMerchant", query: { name: row.sn, time: time, type: this.gameType } })
      localStorage.setItem('dayMerchant', 'dayMerchant')
    },

    //投注金额
    betAmountConfig (row) {
      return thousandFormatter(row.betAmount)
    },
    //输赢金额
    winloseAmountConfig (row) {
      if (row.winloseAmount < 0) {
        return { winloseAmount: row.winloseAmount, color: "#f30" }
      } else {
        return { winloseAmount: row.winloseAmount, color: "#0c0" }
      }
    },
    //商家占成
    rateConfig (row) {
      let arr = row.gameList;
      let result = "";
      for (let item of arr) {
        if (item.code == this.gameType) {
          result = item.rate;
        }
      }
      return result + "%"
    },
    //商家交公司
    submitAmountConfig (row) {
      return thousandFormatter(row.submitAmount)
    },
    //获利比例
    profitConfig (row) {
      if (row.mixAmount && row.mixAmount > 0) {
        return { isShow: true }
      } else {
        return { isShow: false }
      }
    },
    /* 玩家 */
    //账号
    playerNameConfig (row) {
      let name = row.userName;
      localStorage.setItem("playerName", name);
      this.$router.push({
        name: "playDetail",
        query: {
          name: name,
          time: this.changedTime,
          type: this.gameType
        }
      })
      localStorage.setItem("playDetail", "playDetail")
    },
    confirm () {
      this.init();
    },
    exportdata (table) {
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
    reset () {
      this.defaultTime = getDefaultTime();
      this.init();
    },
    search () {
      this.init();
    },
    types (value) {
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
    async init () {
      let userId = localStorage.loginId;
      this.spinShow = true;
      let params1 = {
        userId: userId,
        gameType: this.gameType,
        query: {
          createdAt: [
            util.timeZoneConversion(this.changedTime[0], this.$store.state.timeZone),
            util.timeZoneConversion(this.changedTime[1], this.$store.state.timeZone)
          ]
        }
      };
      let params2 = {
        parentId: userId,
        gameType: this.gameType,
        query: {
          createdAt: [
            util.timeZoneConversion(this.changedTime[0], this.$store.state.timeZone),
            util.timeZoneConversion(this.changedTime[1], this.$store.state.timeZone)
          ]
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getPlayerList", params2);
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [cur, player] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];
      if (cur && cur.code == 0) {
        this.user.push(cur.payload);
      }
      if (player && player.code == 0) {
        this.playerList = player.payload;

        //console.log(this.playerList);

      }
    }
  },
  created () {
    // console.log(this.defaultTime);
    this.init();
  },
  props: ["gameType"]
};
</script>
<style lang="less" scoped>
.report {
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
  /deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
}
</style>
