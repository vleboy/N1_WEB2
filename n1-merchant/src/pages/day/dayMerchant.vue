<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top">
        <Select
          style="width:200px;margin-right:2rem;"
          ref="resetSelect"
          clearable
          v-model="model1"
        >
          <Option
            v-for="(item, index) in gameType"
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
          ></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button @click="reset">重置</Button>
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
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
import _ from "lodash";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
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
      if (localStorage.dayMerchant == "dayMerchant") {
        vm.spinShow = true;
        vm.init();
      }
    });
  },
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
          key: "createdDate"
        },
        {
          title: "投注次数",
          align: "center",
          key: "betCount"
        },
        {
          title: "投注金额",
          align: "center",
          key: "betAmount"
        },
        {
          title: "返还金额",
          align: "center",
          key: "retAmount"
        },
        {
          title: "退款金额",
          align: "center",
          key: "refundAmount"
        },
        {
          title: "输赢金额",
          align: "center",
          slot: "winloseAmount"
        }
      ],
      gameType: [],
      gameCode: ""
    };
  },
  created() {
    this.getDate();
    this.getGameList();
    this.init();
  },
  computed: {
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
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
      let myChart = this.$echarts.init(document.getElementById("myChart"));
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
          data: ["投注次数", "投注金额", "返还金额", "退款金额", "输赢金额"],
          selectedMode: "single"
        },
        series: [
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
      this.$refs.resetSelect.clearSingleSelect();
      this.getDate();
      (this.buID = ""), (this.buSN = ""), (this.dayStatList = []);
      this.showChat = false;
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
        //自动选择游戏种类
        for (let index = 0; index < getGameType().length; index++) {
          if (this.$route.query.type == getGameType()[index].code) {
            this.model1 = getGameType()[index].name;
            break;
          } else {
            this.model1 = "全部游戏";
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

    getGameList() {
      this.gameType = getGameType();
    }
  },
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
#myChart {
  width: 100%;
  height: 300px;
}
</style>

