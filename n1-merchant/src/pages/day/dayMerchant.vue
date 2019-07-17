<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top">
        <Select
          style="width:200px;margin-right:1rem;"
          ref="resetSelect"
          clearable
          v-model="model1"
          size="small"
        >
          <Option
            v-for="(item, index) in getGameList"
            :value="item.name"
            :key="item.name"
            @click.native="selGame(item.code)"
          >{{item.name}}</Option>
        </Select>
        <div class="right">
          <DatePicker
            type="daterange"
            :options="options"
            :editable="false"
            :value="defaultTime"
            placeholder="选择日期时间范围(默认最近一个月)"
            style="width: 300px"
            confirm
            @on-ok="confirms"
            @on-change="handle"
            size="small"
          ></DatePicker>
          <Button type="primary" @click="search" size="small" style="margin-left:1rem;margin-right:.3rem">{{$t('dayMerchant.search')}}</Button>
          <Button @click="reset" size="small">{{$t('dayMerchant.reset')}}</Button>
        </div>
      </div>
    </div>
    <div v-if="showChat">
      <div id="myChart"></div>
    </div>
    <div class="playerList" id="playerList">
      <Table :columns="columns1" :data="dayStatList" size="small" ref="table_2">
        <template slot-scope="{row, index}" slot="winloseAmount">
          <span :style="{color:winloseAmountConfig(row)}">{{row.winloseAmount}}</span>
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
import { httpRequest } from "@/service/index";
import _ from "lodash";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import { getCNGameType, getENGameType } from "@/config/getGameType"
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
      if (localStorage.dayMerchant == "dayMerchant") {
        vm.spinShow = true;
        vm.init();
      }
    });
  },
  data() {
    return {
      
      defaultTime: [], //getDefaultTime(),
      cacheTime: [],
      model1: "全部游戏",
      spinShow: false, //加载spin
      buID: "",
      buSN: "",
      dayStatList: [],
      showChat: true,
      columns1: [
        {
          title: "日期",
          align: "center",
          key: "createdDate",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '日期' : 'Date'
            )
          }
        },
        {
          title: "投注次数",
          align: "center",
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '投注次数' : 'Bet Count'
            )
          }
        },
        {
          title: "投注金额",
          align: "center",
          key: "betAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '投注金额' : 'Bet Amount'
            )
          }
        },
        {
          title: "返还金额",
          align: "center",
          key: "retAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '返还金额' : 'Return Amount'
            )
          }
        },
        {
          title: "退款金额",
          align: "center",
          key: "refundAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '退款金额' : 'Refund Amount'
            )
          }
        },
        {
          title: "输赢金额",
          align: "center",
          slot: "winloseAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '输赢金额' : 'Win/Lose Amount'
            )
          }
        }
      ],
      gameType: [],
      gameCode: ""
    };
  },
  mounted() {
    this.getDate();
    //this.getGameList();
    this.init();
  },
  computed: {
    options() {
      return {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
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
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
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
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
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
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
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
      }
    },
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    },
    getGameList() {
      let gameType = []
      let val = JSON.parse(localStorage.getItem('userInfo')).gameList 
      if (this.$store.state.language == 'zh') {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < getCNGameType().length; j++) {
            if (val[i].code == getCNGameType()[j].code) {
              gameType.push(getCNGameType()[j])
            }
          }
        }
        this.model1 = '全部游戏'
        gameType.unshift({ company: "全部", code: "", name: "全部游戏" })
      } else {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < getENGameType().length; j++) {
            if (val[i].code == getENGameType()[j].code) {
              gameType.push(getENGameType()[j])
            }
          }
        }
        this.model1 = 'All'
        gameType.unshift({ company: "All", code: "", name: "All" })
      }
      
      return gameType
    }
  },
  methods: {
    //输赢金额
    winloseAmountConfig(row) {
      if (row.winloseAmount < 0) {
        return "#f30"
      } else {
        return "#0c0"
      }
    },
    handle(daterange) {
      this.cacheTime = daterange;
    },
    selGame(index) {
      this.showChat = true;
      this.gameCode = index;
      this.init();
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      let _this = this;

      let betCountArr = _this.dayStatList.map(item => {
        return item.betCount;
      });
      let betAmountArr = _this.dayStatList.map(item => {
        return item.betAmount;
      });
      let retAmountArr = _this.dayStatList.map(item => {
        return item.retAmount;
      });
      let refundAmountArr = _this.dayStatList.map(item => {
        return item.refundAmount;
      });
      let winloseAmountArr = _this.dayStatList.map(item => {
        return item.winloseAmount;
      });
      let xArr = _this.dayStatList.map(item => {
        return item.createdDate;
      });
      let data = []
      let series = []

      if (this.$store.state.language == 'zh') {
        data = ["投注次数", "投注金额", "返还金额", "退款金额", "输赢金额"]
        series = [
          {
            name: "投注次数",
            data: betCountArr,
            type: "line"
          },
          {
            name: "投注金额",
            data: betAmountArr,
            type: "line"
          },
          {
            name: "返还金额",
            data: retAmountArr,
            type: "line"
          },
          {
            name: "退款金额",
            data: refundAmountArr,
            type: "line"
          },
          {
            name: "输赢金额",
            data: winloseAmountArr,
            type: "line"
          }
        ]
      } else {
        data = ["Bet Count", "Bet Amount", "Return Amount", "Refund Amount", "Win/Lose Amount"]
        series = [
          {
            name: "Bet Count",
            data: betCountArr,
            type: "line"
          },
          {
            name: "Bet Amount",
            data: betAmountArr,
            type: "line"
          },
          {
            name: "Return Amount",
            data: retAmountArr,
            type: "line"
          },
          {
            name: "Refund Amount",
            data: refundAmountArr,
            type: "line"
          },
          {
            name: "Win/Lose Amount",
            data: winloseAmountArr,
            type: "line"
          }
        ]
      }
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: "category",
          data: xArr
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: data,
          selectedMode: "single"
        },
        series: series
      });
    },
    confirms() {
      this.showChat = true;
      let cacheTime = this.cacheTime.map(ite => {
        return ite.replace(/-/g, "");
      });
      this.getDate(cacheTime);
      this.init();
    },
    changeSource(value) {
      this.init();
    },
    reset() {
      //this.$refs.resetSelect.clearSingleSelect();
      this.getDate();
      (this.buID = ""), (this.buSN = ""), (this.dayStatList = []);
      this.showChat = false;
      //this.getGameList()
      this.init()
    },
    search() {
      this.showChat = true;
      this.init();
    },
    async init() {
      this.spinShow = true;
      //是否是从输赢报表跳转进入日报表
      if (
        this.$route.name == "dayMerchant" &&
        localStorage.dayMerchant == "dayMerchant"
      ) {
        let st = dayjs(this.$route.query.time[0]).format("YYYYMMDD");
        let et = dayjs(this.$route.query.time[1]).format("YYYYMMDD");
        //自动选择游戏种类\
        let gameList = ''
        let game = ''
        if (this.$store.state.language == 'zh') {
          gameList = getCNGameType()
          game = '全部游戏'
        } else {
          gameList = getENGameType()
          game = 'All'
        }
        for (let index = 0; index < gameList.length; index++) {
          if (this.$route.query.type == gameList[index].code) {
            this.model1 = gameList[index].name;
            break;
          } else {
            this.model1 = game;
          }
        }

        this.defaultTime = [];
        this.defaultTime.push(st, et);
        this.buSN = this.$route.query.name;
        this.showChat = true;
        this.managerName = this.$route.query.name;
        this.gameCode = this.$route.query.type;
        localStorage.removeItem("dayMerchant");
      }

      let params = {
        sn: JSON.parse(localStorage.getItem("userInfo")).sn,
        startTime: parseInt(dayjs(this.defaultTime[0]).format("YYYYMMDD")), //当月一号
        endTime: parseInt(dayjs(this.defaultTime[1]).format("YYYYMMDD")), //当日前一天
        gameType: parseInt(this.gameCode)
      };
      let req2 = this.$store.dispatch("getUserDayStat", params);

      
      let [perms] = await this.axios.all([req2]);

      this.dayStatList = perms.payload;

      if (this.dayStatList == "") {
        this.showChat = false;
      }
      //没有数据不显示echarts
      if (this.showChat) {
        this.drawLine();
      }
      this.spinShow = false;
    },

    getDate(opt) {
      if (opt !== undefined) {
        this.defaultTime = opt;
      } else if (dayjs().format("DD") == "01") {
        this.defaultTime = [
          dayjs()
            .startOf("month")
            .format("YYYYMMDD"),
          dayjs()
            .startOf("month")
            .format("YYYYMMDD")
        ];
      } else {
        this.defaultTime = [
          dayjs()
            .startOf("month")
            .format("YYYYMMDD"),
          dayjs(dayjs().valueOf() - 24 * 60 * 60 * 1000).format("YYYYMMDD")
        ];
      }
    },

    
  },
  watch: {
      '$store.state.language': function() {
        if(this.$route.name == 'dayMerchant') {
          this.reset()
        }
      }
    }
};
</script>
<style lang="less" scoped>
.dayReport {
  min-height: 90vh;
  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    display: flex;
    margin-bottom: 1rem;
    .title {
      margin: 0;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
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
  /deep/.ivu-select-selection {
    border-color: #000;
  }
#myChart {
  width: 100%;
  height: 300px;
}
/deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
</style>

