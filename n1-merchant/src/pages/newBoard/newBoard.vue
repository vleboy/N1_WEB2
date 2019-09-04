<template>
  <div class="newBoard">
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
    <div class="top">
      <Select style="width:200px;" ref="resetSelect" clearable v-model="model1" size="small">
        <Option
          v-for="(item, index) in getGameList"
          :value="item.name"
          :key="item.name"
          @click.native="selGame(item.code)"
        >{{item.name}}</Option>
      </Select>
      <div class="right">
        <RadioGroup v-model="dateType" @on-change="changeDate" type="button" size="small">
          <Radio label="0">{{$t('newBoard.yesterday')}}</Radio>
          <Radio label="4">{{$t('newBoard.today')}}</Radio>
          <Radio label="1">{{$t('newBoard.week')}}</Radio>
          <Radio label="2">{{$t('newBoard.month')}}</Radio>
          <Radio label="3">{{$t('newBoard.threeMonth')}}</Radio>
        </RadioGroup>
        <DatePicker
          type="datetimerange"
          :options="options"
          :editable="false"
          v-model="defaultTime"
          placeholder="选择日期时间范围(默认最近一周)"
          style="width: 300px;margin:0 1rem"
          @on-ok="confirm"
          size="small"
        ></DatePicker>
        {{checkLanguage}}
        <Button @click="search" style="margin-right:.3rem"  class="searchBtn" type="primary" size="small">{{$t('newBoard.search')}}</Button>
        <Button @click="reset" size="small">{{$t('newBoard.reset')}}</Button>
      </div>
    </div>

    <Tabs type="card" @on-click="changeBoard">
      <TabPane :label="$t('newBoard.trend')"></TabPane>
      <TabPane :label="$t('newBoard.playerList')"></TabPane>
    </Tabs>

    <!-- 趋势 -->
    <div class="echarts" v-if="initNum == 0">
      <Row>
        <Col span="12">
          <Card>
            <h3 slot="title">{{$t('newBoard.dailyTrend')}}</h3>
            <div :style="{height:'550px',width:'100%'}" ref="report"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">{{$t('newBoard.playerTrend')}}</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerCount"></div>
          </Card>
        </Col>
      </Row>
    </div>

    <!-- 玩家榜单 -->
    <div v-else>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">{{$t('newBoard.playerBetCount')}}</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerBetCount"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">{{$t('newBoard.playerBetAmount')}}</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerBetAmount"></div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">{{$t('newBoard.playerRetAmount')}}</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerRetAmount"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">{{$t('newBoard.playerWinLoseAmount')}}</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerWinloseAmount"></div>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import _ from "lodash"
import dayjs from "dayjs"
import { hourFormatBarData } from "@/config/format"
import { formatBarData, formatMapData } from "@/config/format"
import { getCNGameType, getENGameType } from "@/config/getGameType"
import { httpRequest } from "@/service/index"
import { getDefaultTime } from "@/config/getDefaultTime"

export default {
  data() {
    return {
      initNum: "0",
      //时间配置
      
      defaultTime: "",
      pyBetCountData: [],
      pyBetAmountData: [],
      pyRetAmountData: [],
      pyWinloseAmountData: [],
      gameType: [],
      reportData: [],
      playerCountData: [],
      spinShow: false,
      model1: "全部游戏",
      gameCode: "",
      dateType: "2",
      gameDtributedDataType: "0",
    };
  },
  mounted() {
    //this.getGameList();
    this.changeDate();
  },
  methods: {
    changeBoard(val) {
      this.initNum = val;
      if (this.initNum == undefined) {
        this.initNum = "0";
      } else {
        this.initNum = val;
      }
      if (this.initNum == 0) {
        this.init();
      } else {
        this.pyRankInit();
      }
    },
    
    selGame(code) {
      this.gameCode = code;
      if (this.initNum == 0) {
        this.init();
      } else {
        this.pyRankInit();
      }
    },
    changeDate(val) {
      if (val == undefined) {
        val = this.dateType;
      }
      let nowDate = new Date();
      this.defaultTime = [];
      switch (val) {
        case "0":
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(0, 0, 0, 0)
          );
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) +
              24 * 3600 * 1000 -
              1
          );
          break;
        case "4":
          this.defaultTime.push(
            new Date(nowDate.getTime()).setHours(0, 0, 0, 0)
          );
          this.defaultTime.push(new Date(nowDate.getTime() - 3 * 60 * 1000));
          break;
        case "1":
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) -
              6 * 24 * 3600 * 1000
          );
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) +
              24 * 3600 * 1000 -
              1
          );
          break;
        case "2":
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) -
              29 * 24 * 3600 * 1000
          );
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) +
              24 * 3600 * 1000 -
              1
          );
          break;
        case "3":
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) -
              89 * 24 * 3600 * 1000
          );
          this.defaultTime.push(
            new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(
              0,
              0,
              0,
              0
            ) +
              24 * 3600 * 1000 -
              1
          );
          break;
      }

      if (this.initNum == 0) {
        this.changeBoard();
      } else {
        this.pyRankInit();
      }
    },
    confirm() {
      this.defaultTime = this.changedTime;
      if (this.initNum == 0) {
        this.init();
      } else {
        this.pyRankInit();
      }
    },
    search() {
      //console.log(this.$store.state.language); 
      if (this.initNum == 0) {
        this.init();
      } else {
        this.pyRankInit();
      }
    },
    reset() {
      let nowDate = new Date();
      this.defaultTime = [
        new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(0, 0, 0, 0) -
          89 * 24 * 3600 * 1000,
        new Date(nowDate.getTime() - 24 * 3600 * 1000).setHours(0, 0, 0, 0) +
          24 * 3600 * 1000 -
          1
      ];
      this.dateType = "2";
      this.gameCode = "";
      //this.$refs.resetSelect.clearSingleSelect();
     /*  this.model1 = this.$store.state.language == 'zh' ? "全部游戏" : 'All games'
      console.log(this.model1) */
     // this.getGameList()
      if (this.initNum == 0) {
        this.init();
      } else {
        this.pyRankInit();
      }
    },

    //趋势
    //平台每日趋势
    reportConfigure() {
      let betAmount = this.reportData.betAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let betCount = this.reportData.betCount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let playerCount = this.reportData.playerCount.map(item => {
        return item.y;
      });
      let refundAmount = this.reportData.refundAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let retAmount = this.reportData.retAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let winloseAmount = this.reportData.winloseAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let reportArr = this.reportData.playerCount.map(item => {
        return item.x;
      });

      let myChart = echarts.init(this.$refs.report);

      let data = []
      let series = []
      if (this.$store.state.language == 'zh') {
        data = [
              "玩家数量",
              "投注次数",
              "投注金额",
              "退款金额",
              "返回金额",
              "输赢金额"
            ]
        series = [
            {
              name: "玩家数量",
              type: "line",
              data: playerCount
            },
            {
              name: "投注次数",
              type: "line",
              data: betCount
            },
            {
              name: "投注金额",
              type: "line",
              data: betAmount
            },
            {
              name: "退款金额",
              type: "line",
              data: refundAmount
            },
            {
              name: "返回金额",
              type: "line",
              data: retAmount
            },
            {
              name: "输赢金额",
              type: "line",
              data: winloseAmount
            }
          ]    
      }else {
        data = [
              "Player Number",
              "Bet Count",
              "Bet Amount",
              "Refund Amount",
              "Return Amount",
              "Win/Lose Amount"
            ]
        series = [
            {
              name: "Player Number",
              type: "line",
              data: playerCount
            },
            {
              name: "Bet Count",
              type: "line",
              data: betCount
            },
            {
              name: "Bet Amount",
              type: "line",
              data: betAmount
            },
            {
              name: "Refund Amount",
              type: "line",
              data: refundAmount
            },
            {
              name: "Return Amount",
              type: "line",
              data: retAmount
            },
            {
              name: "Win/Lose Amount",
              type: "line",
              data: winloseAmount
            }
          ]     
      }
      // 绘制图表
      myChart.setOption(
        {
          xAxis: {
            name: this.$store.state.language == 'zh' ? "单位\n日期" : 'unit \n date',
            type: "category",
            data: reportArr
          },
          tooltip: {
            trigger: "axis",
            formatter: formatBarData
          },
          yAxis: {
            type: "value"
          },
          grid: {
            bottom: "6%"
          },
          legend: {
            data: data,
            selectedMode: "single"
          },
          series: series
        },
        true
      );
    },
    //玩家注册趋势
    playerCountConfigure() {
      let myChart = echarts.init(this.$refs.playerCount);
      let data = []
      let series = []
      if (this.$store.state.language == 'zh') {
        data = ["每日注册人数", "累计注册人数"]
        series = [
            {
              name: "每日注册人数",
              type: "line",
              showSymbol: false,
              hoverAnimation: false,
              smooth: true,
              symbolSize: 3,
              data: this.playerCountData.everyDay
            },
            {
              name: "累计注册人数",
              type: "line",
              showSymbol: false,
              hoverAnimation: false,
              smooth: true,
              symbolSize: 3,
              data: this.playerCountData.sumDay
            }
          ]
      } else {
        data = ["Daily enrollment", "Cumulative number of registrations"]
        series = [
            {
              name: "Daily enrollment",
              type: "line",
              showSymbol: false,
              hoverAnimation: false,
              smooth: true,
              symbolSize: 3,
              data: this.playerCountData.everyDay
            },
            {
              name: "Cumulative number of registrations",
              type: "line",
              showSymbol: false,
              hoverAnimation: false,
              smooth: true,
              symbolSize: 3,
              data: this.playerCountData.sumDay
            }
          ]
      }
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            
            axisPointer: {
              animation: false
            }
          },
          xAxis: {
            type: "time",
            splitLine: {
              show: false
            },
            name: this.$store.state.language == 'zh' ? "单位\n日期" : 'unit \n date'
          },
          yAxis: {
            type: "value",
            splitLine: {
              show: false
            }
          },
          grid: {
            bottom: "6%"
          },
          legend: {
            //orient: 'vertical',
            top: "top",
            data: data,
            selectedMode: "single",
            padding: 10
          },
          series: series
        },
        true
      );
    },

    //玩家排行榜柱状图
    //玩家投注次数
    pyBetCount() {
      let myChart = echarts.init(this.$refs.playerBetCount);
      let merchant = this.pyBetCountData.map(item => {
        return item.x;
      });
      let datas = this.pyBetCountData.map(item => {
        return item.y / 10000;
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: this.$store.state.language == 'zh' ? "{b0}</br>{c0} 万次" : "{b0}</br>{c0} ten thousand time"
          },
          xAxis: {
            name: this.$store.state.language == 'zh' ? "单位\n日期" : 'unit \n ten thousand time',
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "25%",
            right: "22%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              barWidth : 20,
              data: datas
            }
          ]
        },
        true
      );
    },
    //玩家投注金额
    pyBetAmount() {
      let myChart = echarts.init(this.$refs.playerBetAmount);
      let merchant = this.pyBetAmountData.map(item => {
        return item.x;
      });
      let datas = this.pyBetAmountData.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: this.$store.state.language == 'zh' ? "{b0}</br>{c0} 万次" : "{b0}</br>{c0} ten thousand time"
          },
          xAxis: {
            name: this.$store.state.language == 'zh' ? "单位\n日期" : 'unit \n ten thousand yuan',
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "25%",
            right: "22%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              barWidth : 20,
              data: datas
            }
          ]
        },
        true
      );
    },
    //玩家返还金额
    pyRetAmount() {
      let myChart = echarts.init(this.$refs.playerRetAmount);
      let merchant = this.pyRetAmountData.map(item => {
        return item.x;
      });
      let datas = this.pyRetAmountData.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: this.$store.state.language == 'zh' ? "{b0}</br>{c0} 万次" : "{b0}</br>{c0} ten thousand time"
          },
          xAxis: {
            name: this.$store.state.language == 'zh' ? "单位\n日期" : 'unit \n ten thousand yuan',
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "25%",
            right: "22%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              barWidth : 20,
              data: datas
            }
          ]
        },
        true
      );
    },
    //玩家输赢金额
    pyWinloseAmount() {
      let myChart = echarts.init(this.$refs.playerWinloseAmount);
      let merchant = this.pyWinloseAmountData.map(item => {
        return item.x;
      });
      let datas = this.pyWinloseAmountData.map(item => {
        return (item.y / 10000).toFixed(2);
      });

      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: this.$store.state.language == 'zh' ? "{b0}</br>{c0} 万次" : "{b0}</br>{c0} ten thousand time"
          },
          xAxis: {
            name: this.$store.state.language == 'zh' ? "单位\n日期" : 'unit \n ten thousand yuan',
            type: "value"
          },
          grid: {
            left: "25%",
            right: "22%",
            top: "0",
            bottom: "5%"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          series: [
            {
              type: "bar",
              barWidth : 20,
              data: datas
            }
          ]
        },
        true
      );
    },
    
    //参数初始化
    paramsInit() {
      let params = {};
      if (this.gameCode == "") {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime()
        }
      } else {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime(),
          gameType: this.gameCode
        }
      }
      return params
    },
    //趋势初始化
    init() {
      this.spinShow = true;
      httpRequest("get", "/visual/line/day", this.paramsInit(), "map").then(res => {
        this.spinShow = false
        this.reportData = res.data;
        this.reportConfigure();
      });
      httpRequest("get", "/visual/line/player", this.paramsInit(), "map").then(res => {
          this.spinShow = false
          this.playerCountData = res.data;
          this.playerCountConfigure();
        });
    },
    //玩家榜单初始化
    pyRankInit() {
      this.spinShow = true;
      httpRequest("get", "/visual/rank/player", this.paramsInit(), "map").then(res => {
        this.pyBetCountData = res.data.betCount.reverse();
        this.pyBetAmountData = res.data.betAmount.reverse();
        this.pyRetAmountData = res.data.retAmount.reverse();
        this.pyWinloseAmountData = res.data.winloseAmount.reverse();
        this.pyBetCount();
        this.pyBetAmount();
        this.pyRetAmount();
        this.pyWinloseAmount();
        this.spinShow = false;
      });
    },
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
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        if (index == 1 && item.getTime() > Date.now() ) {
          return Date.now() ;
        }
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    },
    checkLanguage() {
      //
      /* if (this.$store.state.language) {
        this.reportConfigure()
      } else {
        return 0
      } */
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
    },
  },
  watch: {
      '$store.state.language': function() {
        if(this.$route.name == 'newBoard') {
          this.reset()
        }
      }
    }
};
</script>

<style lang="less" scoped>
.newBoard {
  position: relative;
  min-height: 90vh;
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
  .worldEcharts {
    width: 100%;
    position: absolute;
    top: 80px;
    left: 4rem;
    z-index: 100;
  }
  .chinaEcharts {
    width: 100%;
    position: absolute;
    top: 80px;
    left: 4rem;
    z-index: 100;
  }
  .gameDtributedEcharts {
    width: 50%;
    position: absolute;
    top: 60px;
    left: 18rem;
    z-index: 100;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  .map {
    display: flex;
    // justify-content: space-around;
  }
  .distribution {
    position: relative;
    display: flex;
    margin-bottom: 100px;
    // justify-content: space-around;
  }

 /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: #000;
    color: #000;
    background: #fff;
  }
 
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    background: #000;
    color: #fff;
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
  /deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
}
</style>
