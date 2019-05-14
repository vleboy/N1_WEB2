<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top">
        <p class="title">
         <!--  当前用户列表---{{this.identity}} -->
          <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
        </p>
        <div class="right">
          <DatePicker type="daterange" :options="options" :editable='false' :value="defaultTime" placeholder="选择日期时间范围(默认最近一个月)" style="width: 300px" confirm @on-ok="confirms" @on-change="handle"></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
      </div>
    </div>
    <div id="myChart"></div>
    <div class="playerList" id="playerList">
      <Table :columns="columns1" :data="dayStatList" size="small" ref="table_2"></Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from 'dayjs'
import { thousandFormatter } from "@/config/format";
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
      defaultTime: [],//getDefaultTime(),
      cacheTime:[],
      spinShow: false, //加载spin
      source: "1",
      dayStatList: [],

      columns1: [
        {
          title: "日期",
          key: "createdDate"
        },
        {
          title: "投注金额",
          key: "betAmount"
        },
        {
          title: "投注次数",
          key: "betCount"
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
          key: "winloseAmount"
        }
      ]

      /* betAmount: -2.25  投加注金额
      betCount: 14 投注次数
      createdDate: "20190102" 日期
      refundAmount: 0 退款金额
      retAmount: 4.699999999999999 返还金额
      winAmount: 4.699999999999999 返奖金额
      winloseAmount: 2.45 输赢金额 */
    };
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    this.getDate()
    this.init();
  },


  computed: {
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    }
  },
  methods: {
    handle(daterange) {
      this.cacheTime = daterange
      console.log(daterange);
      
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let _this = this;
      //console.log(_this.dayStatList);

      let yArr = _this.dayStatList.map((item) => {return item.betCount})
      let xArr = _this.dayStatList.map((item) => {return item.createdDate})
     
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: "category",
          data: xArr
        },
        tooltip: {
        trigger: 'axis'
        },
        yAxis: {
          type: "value"
        },
        legend: {
          data: ["投注次数"]
        },
        series: [
          {
            name: "投注次数",
            data: yArr,
            type: "line"
          }
        ]
      });
    },
    confirms() {
      let cacheTime = this.cacheTime.map(ite => {return ite.replace(/-/g,"")})
      this.getDate(cacheTime)
      this.init();
    },
    changeSource(value) {
      this.init();
    },
    reset() {

      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.init();
    },
    search() {
      this.init();
    },
    // permission() {
    //   return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    // },
    async init() {

      let params = {
        parentId: "01",
        isTest: this.source,
        startTime: parseInt(this.defaultTime[0]), //当月一号
        endTime: parseInt(this.defaultTime[1]) //当日前一天
      };
      let req2 = this.$store.dispatch("getDayStat", params);
      this.spinShow = true;
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [perms] = await this.axios.all([req2]);
      this.spinShow = false;

      this.dayStatList = perms.payload;
      this.drawLine();
    },
    
    getDate(opt) {
      
      if(opt !== undefined) {
        this.defaultTime = opt
      } else {
        this.defaultTime = [dayjs().startOf('month').format('YYYYMMDD'), dayjs(dayjs().valueOf()-24 * 60 * 60 * 1000).format('YYYYMMDD')]
      }

      console.log(this.defaultTime);
      
    }
  },
  props: ['identity']
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
    clear: both;
    .right {
      float: right;
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

