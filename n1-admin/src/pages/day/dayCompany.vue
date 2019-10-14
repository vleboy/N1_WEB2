<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top" style="display:flex;align-items:center">
        <p class="title">
          <!--  当前用户列表--- -->
          <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource" size="small">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
        </p>
        <Select style="width:200px;margin-left:1rem;" ref="resetSelect" clearable v-model="model1" size="small">
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
            size="small"
          ></DatePicker>
          <Button type="primary" @click="search" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </div>
    </div>
    <div v-if="showChat">
      <div id="myChart"></div>
    </div>




    <div class="playerList" id="playerList">
      <Table :columns="columns1" :data="dayStatList" size="small" ref="table_2">
        <template slot-scope="{row, index}" slot="winloseAmount">
          <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
      </Table>
    </div>




    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
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
      if (localStorage.dayCompany == "dayCompany") {
        //localStorage.removeItem('dayCompany')
        
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
      spinShow: false, //加载spin
      source: "1",
      model1: "全部游戏",
      dayStatList: [],
      showChat: false,
      columns1: [
        {
          title: "日期",
          key: "createdDate",
          align: 'center'
        },
        {
          title: "商户数量",
          key: "merchantCount",
          align: 'center'
        },
        {
          title: "玩家数量",
          key: "playerCount",
          align: 'center'
        },
        {
          title: "投注次数",
          key: "betCount",
          align: 'center'
        },
        {
          title: "投注金额",
          key: "betAmount",
          align: 'center'
        },
        {
          title: "返还金额",
          key: "retAmount",
          align: 'center'
        },
        {
          title: "退款金额",
          key: "refundAmount",
          align: 'center'
        },
        {
          title: "输赢金额",
          slot: "winloseAmount",
          align: 'center'
        }
      ],
      gameType: [],
      gameCode: ""
    };
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    this.getDate();
    this.getGameList();
    this.init();
  },

  computed: {
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    }
  },
  /* watch: {
    '$route': function (to, from) {
      if(to.name == 'dayCompany') {
        this.defaultTime = this.$route.query.time
        this.search()
      }
    }
  }, */
  methods: {
    //输赢金额
    winloseAmountConfig(row) {
      let color = row.winloseAmount < 0 ? "#f30" : "#0c0"
      return {winloseAmount: row.winloseAmount, color}   
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
      let merchantCountArr = _this.dayStatList.map(item => {
        return item.merchantCount;
      });      
      let playerCountArr = _this.dayStatList.map(item => {
        return item.playerCount;
      });

      myChart.on("legendselectchanged", function(params) {
        //console.log(params);
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
          data: ["商户数量","玩家数量","投注次数", "投注金额", "返还金额", "退款金额", "输赢金额"],
          selectedMode: "single"
        },
        series: [
          {
            name: "商户数量",
            data: merchantCountArr,
            type: "line"
          },
          {
            name: "玩家数量",
            data: playerCountArr,
            type: "line"
          },
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
      let cacheTime = this.cacheTime.map(ite => {
        return ite.replace(/-/g, "");
      });
      this.getDate(cacheTime);
      this.showChat = true;
      this.init();
    },
    changeSource(value) {
      this.init();
    },
    reset() {
      this.$refs.resetSelect.clearSingleSelect();
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.getDate();
      this.init();
    },
    search() {
      this.showChat = true;
      this.init();
    },
    
    getGameList() {
      this.gameType = getGameType()
    },

    async init() {
      this.spinShow = true;
      if (
        this.$route.name == "dayCompany" &&
        localStorage.dayCompany == "dayCompany"
      ) {
        console.log(233);
        let st = dayjs(this.$route.query.time[0]).format("YYYYMMDD");
        let et = dayjs(this.$route.query.time[1]).format("YYYYMMDD");
        this.defaultTime = [];
        this.defaultTime.push(st, et);
        this.source = this.$route.query.source;
        for (let index = 0; index < getGameType().length; index++) {
          if(this.$route.query.type == getGameType()[index].code) {
            this.model1 = getGameType()[index].name
            break;
          } else {
            this.model1 = '全部游戏'
          }
        }
        localStorage.removeItem("dayCompany");
        this.gameCode = this.$route.query.type;
      }
      this.showChat = true;

      let params = {
        parentId: "01",
        isTest: this.source,
        startTime: parseInt(dayjs(this.defaultTime[0]).format("YYYYMMDD")), //当月一号
        endTime: parseInt(dayjs(this.defaultTime[1]).format("YYYYMMDD")), //当日前一天
        gameType: parseInt(this.gameCode)
      };
      let req2 = this.$store.dispatch("getDayStat", params);
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [perms] = await this.axios.all([req2]);

      this.dayStatList = perms.payload;
      if (perms.payload.length == 0) {
        this.showChat = false;
      }
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
    .right {
      margin-left: 1rem;
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
</style>

