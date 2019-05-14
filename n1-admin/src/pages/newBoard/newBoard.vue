<template>
  <div class="newBoard">
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="load-c" size="100" class="demo-spin-icon-load" style></Icon>
      <div style>加载中...</div>
    </Spin>
    <div class="top">
      <Select style="width:200px;" ref="resetSelect" clearable v-model="model1">
        <Option
          v-for="(item, index) in gameType"
          :value="item.name"
          :key="item.name"
          @click.native="selGame(item.code)"
        >{{item.name}}</Option>
      </Select>
      <div class="right">
        <RadioGroup v-model="dateType" @on-change="changeDate" type="button">
          <Radio label="0">昨日</Radio>
          <Radio label="4">今日</Radio>
          <Radio label="1">近一周</Radio>
          <Radio label="2">近一个月</Radio>
          <Radio label="3">近三个月</Radio>
        </RadioGroup>
        <DatePicker
          type="datetimerange"
          :options="options"
          :editable="false"
          v-model="defaultTime"
          placeholder="选择日期时间范围(默认最近一周)"
          style="width: 300px;margin-left:1rem"
          @on-ok="confirm"
        ></DatePicker>
        <Button type="primary" @click="search">搜索</Button>
        <Button type="ghost" @click="reset">重置</Button>
      </div>
    </div>
    <Tabs type="card" @on-click="changeBoard">
      <TabPane label="趋势"></TabPane>
      <TabPane label="分布"></TabPane>
      <TabPane label="商户榜单"></TabPane>
      <TabPane label="玩家榜单"></TabPane>
    </Tabs>
    <div class="echarts" v-if="initNum == 0">
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">游戏占比</h3>
            <RadioGroup
              v-model="gameDtributedDataType"
              @on-change="changeGameDtributedDataType"
              class="gameDtributedEcharts"
              size="small"
            >
              <Radio label="0">玩家数量</Radio>
              <Radio label="2">投注次数</Radio>
              <Radio label="1">投注金额</Radio>
              <Radio label="3">退款金额</Radio>
              <Radio label="4">返还金额</Radio>
            </RadioGroup>
            <div :style="{height:'400px',width:'100%'}" ref="gameDtributed"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card>
            <h3 slot="title">平台每日趋势</h3>
            <div :style="{height:'400px',width:'100%'}" ref="report"></div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">全国地图大数据</h3>
            <RadioGroup
              v-model="chinaDataType"
              @on-change="changeChinaDataType"
              class="chinaEcharts"
              size="small"
            >
              <Radio label="0">玩家数量</Radio>
              <Radio label="2">投注次数</Radio>
              <Radio label="1">投注金额</Radio>
              <Radio label="3">退款金额</Radio>
              <Radio label="4">返还金额</Radio>
              <Radio label="5">输赢金额</Radio>
            </RadioGroup>
            <div :style="{height:'500px',width:'100%'}" ref="chinaEchart"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">玩家注册趋势</h3>
            <div :style="{height:'500px',width:'100%'}" ref="playerCount"></div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Card style="position:relative">
            <h3 slot="title">世界地图大数据</h3>
            <RadioGroup
              v-model="worldDataType"
              @on-change="changeWorldDataType"
              class="worldEcharts"
              size="small"
            >
              <Radio label="0">玩家数量</Radio>
              <Radio label="2">投注次数</Radio>
              <Radio label="1">投注金额</Radio>
              <Radio label="3">退款金额</Radio>
              <Radio label="4">返还金额</Radio>
              <Radio label="5">输赢金额</Radio>
            </RadioGroup>
            <div :style="{height:'500px',width:'100%'}" ref="worldEchart"></div>
          </Card>
        </Col>
      </Row>
      <!-- <div :style="{height:'600px',width:'100%'}" ref="dynamic"></div> -->
    </div>
    <div v-else-if="initNum == 1">
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">时刻比例分布(小时)</h3>
            <div :style="{height:'550px',width:'100%'}" ref="houreMomentBar"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">时刻比例分布(周)</h3>
            <div :style="{height:'550px',width:'100%'}" ref="weekMomentBar"></div>
          </Card>
        </Col>
      </Row>
      <!-- <Row>
        <Col span="24">
          <Card style="position:relative">
            <h3 slot="title">时刻比例分布(月)</h3>
            <div :style="{height:'500px',width:'100%'}" ref="monthMomentBar"></div>    
          </Card>  
        </Col>  
      </Row>-->
    </div>
    <div v-else-if="initNum == 2">
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">商户玩家数量榜</h3>
            <div :style="{height:'550px',width:'100%'}" ref="merchantPlayerCount"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">商户投注次数榜</h3>
            <div :style="{height:'550px',width:'100%'}" ref="merchantBetCount"></div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">商户投注金额榜</h3>
            <div :style="{height:'550px',width:'100%'}" ref="merchantBetAmount"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">商户返还金额榜</h3>
            <div :style="{height:'550px',width:'100%'}" ref="merchantRetAmount"></div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">商户输赢金额榜</h3>
            <div :style="{height:'550px',width:'100%'}" ref="merchantWinloseAmount"></div>
          </Card>
        </Col>
      </Row>
    </div>
    <div v-else>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">玩家投注次数榜(TOP10)</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerBetCount"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">玩家投注金额榜(TOP10)</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerBetAmount"></div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">玩家返还金额榜(TOP10)</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerRetAmount"></div>
          </Card>
        </Col>
        <Col span="12">
          <Card style="position:relative">
            <h3 slot="title">玩家输赢金额榜(TOP10 & LAST10)</h3>
            <div :style="{height:'550px',width:'100%'}" ref="playerWinloseAmount"></div>
          </Card>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import "echarts/map/js/china.js"; // 引入中国地图数据
import chinaJson from "echarts/map/json/china.json";
import "echarts/map/js/world.js"; // 引入世界地图数据
import worldJson from "echarts/map/json/world.json";
import { hourFormatBarData } from "@/config/format";
import { formatBarData } from "@/config/format";
import { formatMapData } from "@/config/format";
import { httpRequest } from "@/service/index";
import { getDefaultTime } from "@/config/getDefaultTime";
import _ from "lodash";
import dayjs from "dayjs";

export default {
  data() {
    return {
      source: "0",
      initNum: "0",
      rankCount: 0,
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
      GameListEnum: [
        { company: "全部", code: "", name: "全部游戏" },
        { company: "NA", code: "70000", name: "H5电子游戏" },
        { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" },
        { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        { company: "TTG", code: "1010000", name: "TTG电子游戏" },
        { company: "PNG", code: "1020000", name: "PNG电子游戏" },
        { company: "MG", code: "10300000", name: "MG电子游戏" },
        { company: "HABA", code: "1040000", name: "HABA电子游戏" },
        { company: "AG", code: "1050000", name: "AG真人游戏" },
        { company: "SA", code: "1060000", name: "SA真人游戏" },
        { company: "SA", code: "1110000", name: "SA捕鱼游戏" },
        { company: "PG", code: "1090000", name: "PG电子游戏" },
        { company: "YSB", code: "1130000", name: "YSB体育游戏" },
        { company: "RTG", code: "1140000", name: "RTG电子游戏" },
        { company: "SB", code: "1080000", name: "SB电子游戏" },
        { company: "SB", code: "1120000", name: "SB真人游戏" },
        { company: "DT", code: "1150000", name: "DT电子游戏" },
        { company: "PP", code: "1160000", name: "PP电子游戏" }
      ],
      //defaultTime: getDefaultTime(),
      defaultTime: "",
      splitColor: [
        "#E3170D",
        "#FF8000",
        "yellowgreen",
        "#FFD700",
        "#FFFFCD",
        "#ccc"
      ],
      woSplitColor: [
        "#E3170D",
        "#FF8000",
        "yellowgreen",
        "#FFD700",
        "#FFFFCD",
        "#ccc"
      ],
      mcPlayerCountData: [],
      mcBetCountData: [],
      mcBetAmountData: [],
      mcRetAmountData: [],
      mcWinloseAmountData: [],
      pyBetCountData: [],
      pyBetAmountData: [],
      pyRetAmountData: [],
      pyWinloseAmountData: [],
      gameType: [],
      chinaData: [],
      chinaAllData: "",
      worldAllData: "",
      chinaSplitList: [],
      worldSplitList: [],
      reportData: [],
      playerCountData: [],
      worldData: [],
      dynamicData: [],
      gameUnit: "",
      chinaMapUnit: "",
      worldMapUnit: "",
      spinShow: false,
      model1: "全部游戏",
      gameCode: "",
      dateType: "2",
      chinaDataType: "0",
      worldDataType: "0",
      gameDtributedDataType: "0",
      realData: [932, 901, 934, 1290, 1330, 1320, 145],
      xArr: [1, 2, 3, 4, 5, 6, 7],
      hander: null,
      houreMomentData: [],
      weekMomentData: [],
      monthMomentData: [],
      gameDtributedData: [],
      valueGD: [],
      valueTP: []
    };
  },
  mounted() {
    this.getGameList();
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
        /* this.$nextTick(function() {
          }); */
        this.init();
      } else if (this.initNum == 1) {
        /* this.$nextTick(function() {
          }); */
        this.distributionInit();
      } else if (this.initNum == 2) {
        //this.rankInit();
        /* this.$nextTick(function() {
          }); */
        this.mcRankInit();
      } else {
        this.pyRankInit();
      }
    },
    getGameList() {
      this.gameType = this.GameListEnum;
    },
    selGame(code) {
      this.gameCode = code;
      if (this.initNum == 0) {
        this.init();
      } else if (this.initNum == 1) {
        this.distributionInit();
      } else if (this.initNum == 2) {
        this.mcRankInit();
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
      } else if (this.initNum == 1) {
        this.distributionInit();
      } else if (this.initNum == 2) {
        this.mcRankInit();
      } else {
        this.pyRankInit();
      }
      this.rankCount++;
    },
    changeChinaDataType(val) {
      if (val == undefined) {
        val = this.chinaDataType;
      }
          
      if (val == 5) {
        this.splitColor = ["#ededed","red"];
      } else {
        this.splitColor = [
          "#E3170D",
          "#FF8000",
          "yellowgreen",
          "rgb(0, 255, 179)",
          "rgb(152, 192, 245)", 
          "#ededed"
        ];
      }

      switch (val) {
        case "0":
          this.chinaMapUnit = "玩家数量";
          this.chinaSplitList = this.chinaAllData.playerCount[1];
          this.chinaData = this.chinaAllData.playerCount[0];
          break;
        case "1":
          this.chinaMapUnit = "投注金额";
          this.chinaSplitList = this.chinaAllData.betAmount[1];
          this.chinaData = this.chinaAllData.betAmount[0]
          break;
        case "2":
          this.chinaMapUnit = "投注次数";
          this.chinaSplitList = this.chinaAllData.betCount[1]
          this.chinaData = this.chinaAllData.betCount[0]
          break;
        case "3":
          this.chinaMapUnit = "退款金额";
          this.chinaSplitList = this.chinaAllData.refundAmount[1]
          this.chinaData = this.chinaAllData.refundAmount[0]
          break;
        case "4":
          this.chinaMapUnit = "返还金额";
          this.chinaSplitList = this.chinaAllData.retAmount[1]
          this.chinaData = this.chinaAllData.retAmount[0]
          break;
        case "5":
          this.chinaMapUnit = "输赢金额";
          this.chinaSplitList = this.chinaAllData.winloseAmount[1]        
          this.chinaData = this.chinaAllData.winloseAmount[0]
          break;
      }
      this.chinaConfigure();
    },
    changeWorldDataType(val) {
      if (val == undefined) {
        val = this.worldDataType;
      }
      if (val == 5) {
        this.woSplitColor = ["#ededed","red"]
      } else {
        this.woSplitColor = [
          "#E3170D",
          "#FF8000",
          "yellowgreen",
          "rgb(0, 255, 179)",
          "rgb(152, 192, 245)", 
          "#ededed"
        ]
      }
      switch (val) {
        case "0":
          this.worldMapUnit = "玩家数量";
          this.worldSplitList = this.worldAllData.playerCount[1];
          this.worldData = this.worldAllData.playerCount[0];
          break;
        case "1":
          this.worldMapUnit = "投注金额";
          this.worldSplitList = this.worldAllData.betAmount[1]
          this.worldData = this.worldAllData.betAmount[0]
          break;
        case "2":
          this.worldMapUnit = "投注次数";
          this.worldSplitList = this.worldAllData.betCount[1]
          this.worldData = this.worldAllData.betCount[0]
          break;
        case "3":
          this.worldMapUnit = "退款金额";
          this.worldSplitList = this.worldAllData.refundAmount[1]
          this.worldData = this.worldAllData.refundAmount[0]
          break;
        case "4":
          this.worldMapUnit = "返还金额";
          this.worldSplitList = this.worldAllData.retAmount[1]
          this.worldData = this.worldAllData.retAmount[0]
          break;
        case "5":
          this.worldMapUnit = "输赢金额";
          this.worldSplitList = this.worldAllData.winloseAmount[1]
          this.worldData = this.worldAllData.winloseAmount[0]
          break;
      }
      this.worldConfigure();
    },
    changeGameDtributedDataType(val) {
      if (val == undefined) {
        val = this.gameDtributedDataType;
      }
      switch (val) {
        case "0":
          this.gameUnit = "玩家数量";
          this.valueGD = this.gameDtributedData.playerCount.map(item => {
            return item;
          });
          this.valueTP = this.gameDtributedData.playerCount.map(item => {
            return item.name;
          });
          break;
        case "1":
          this.gameUnit = "投注金额";
          this.valueGD = this.gameDtributedData.betAmount.map(item => {
            return {
              value: parseFloat((item.value / 10000).toFixed(2)),
              name: item.name
            };
          });
          this.valueTP = this.gameDtributedData.betAmount.map(item => {
            return item.name;
          });
          break;
        case "2":
          this.gameUnit = "投注次数";
          this.valueGD = this.gameDtributedData.betCount.map(item => {
            return {
              value: parseFloat((item.value / 10000).toFixed(2)),
              name: item.name
            };
          });
          this.valueTP = this.gameDtributedData.betCount.map(item => {
            return item.name;
          });
          break;
        case "3":
          this.gameUnit = "退款金额";
          this.valueGD = this.gameDtributedData.refundAmount.map(item => {
            return {
              value: parseFloat((item.value / 10000).toFixed(2)),
              name: item.name
            };
          });
          this.valueTP = this.gameDtributedData.refundAmount.map(item => {
            return item.name;
          });
          break;
        case "4":
          this.gameUnit = "返还金额";
          this.valueGD = this.gameDtributedData.retAmount.map(item => {
            return {
              value: parseFloat((item.value / 10000).toFixed(2)),
              name: item.name
            };
          });
          this.valueTP = this.gameDtributedData.retAmount.map(item => {
            return item.name;
          });
          break;
      }
      this.gameDtributedConfigure();
    },
    confirm() {
      this.defaultTime = this.changedTime;
      if (this.initNum == 0) {
        this.init();
      } else if (this.initNum == 1) {
        this.distributionInit();
      } else if (this.initNum == 2) {
        this.mcRankInit();
      } else {
        this.pyRankInit();
      }
    },
    search() {
      if (this.initNum == 0) {
        this.init();
      } else if (this.initNum == 1) {
        this.distributionInit();
      } else if (this.initNum == 2) {
        this.mcRankInit();
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
      this.$refs.resetSelect.clearSingleSelect();
      this.model1 = "全部游戏";

      if (this.initNum == 0) {
        this.init();
      } else if (this.initNum == 1) {
        this.distributionInit();
      } else if (this.initNum == 2) {
        this.mcRankInit();
      } else {
        this.pyRankInit();
      }
    },

    //趋势
    chinaConfigure() {
      this.$echarts.registerMap("china", chinaJson);
      let myChart = this.$echarts.init(this.$refs.chinaEchart); //这里是为了获得容器所在位置
      myChart.setOption(
        {
          backgroundColor: "#FFFFFF",
          tooltip: {
            trigger: "item",
            formatter: formatMapData
          },

          //左侧小导航图标
          visualMap: {
            show: true,
            x: "left",
            y: "bottom",
            //splitList: this.chinaSplitList,
            pieces: this.chinaSplitList,
            color: this.splitColor
          },
          //配置属性
          series: [
            {
              name: this.chinaMapUnit,
              type: "map",
              mapType: "china",
              zoom: 1.2,
              roam: false,
              label: {
                normal: {
                  show: true //省份名称
                },
                emphasis: {
                  show: false
                }
              },
              data: this.chinaData //数据
            }
          ]
        },
        true
      );
    },
    worldConfigure() {
      this.$echarts.registerMap("world", worldJson);
      let myChart = this.$echarts.init(this.$refs.worldEchart); //这里是为了获得容器所在位置
      myChart.setOption(
        {
          grid: {
            left: "middle"
          },
          tooltip: {
            trigger: "item",
            formatter: formatMapData
          },
          visualMap: {
            type: "piecewise",
            show: true,
            x: "left",
            y: "bottom",
            splitList: this.worldSplitList,
            color: this.woSplitColor
          },
          series: [
            {
              name: this.worldMapUnit,
              type: "map",
              mapType: "world",
              roam: false,
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              nameMap: {
                Afghanistan: "阿富汗",
                Angola: "安哥拉",
                Albania: "阿尔巴尼亚",
                "United Arab Emirates": "阿拉伯联合酋长国",
                Argentina: "阿根廷",
                Armenia: "亚美尼亚",
                "French Southern and Antarctic Lands": "法属南部领地",
                Australia: "澳大利亚",
                Austria: "奥地利",
                Azerbaijan: "阿塞拜疆",
                Burundi: "布隆迪",
                Belgium: "比利时",
                Benin: "贝宁",
                "Burkina Faso": "布基纳法索",
                Bangladesh: "孟加拉国",
                Bulgaria: "保加利亚",
                "The Bahamas": "巴哈马",
                "Bosnia and Herzegovina": "波斯尼亚和黑塞哥维那",
                Belarus: "白俄罗斯",
                Belize: "伯利兹",
                Bermuda: "百慕大群岛",
                Bolivia: "玻利维亚",
                Brazil: "巴西",
                Brunei: "文莱",
                Bhutan: "不丹",
                Botswana: "博茨瓦纳",
                "Central African Republic": "中非共和国",
                Canada: "加拿大",
                Switzerland: "瑞士",
                Chile: "智利",
                China: "中国",
                "Ivory Coast": "象牙海岸",
                Cameroon: "喀麦隆",
                "Democratic Republic of the Congo": "民主刚果",
                "Republic of the Congo": "刚果",
                Colombia: "哥伦比亚",
                "Costa Rica": "哥斯达黎加",
                Cuba: "古巴",
                "Northern Cyprus": "北塞浦路斯",
                Cyprus: "塞浦路斯",
                "Czech Republic": "捷克共和国",
                Germany: "德国",
                Djibouti: "吉布提",
                Denmark: "丹麦",
                "Dominican Republic": "多米尼加共和国",
                Algeria: "阿尔及利亚",
                Ecuador: "厄瓜多尔",
                Egypt: "埃及",
                Eritrea: "厄立特里亚",
                Spain: "西班牙",
                Estonia: "爱沙尼亚",
                Ethiopia: "埃塞俄比亚",
                Finland: "芬兰",
                Fiji: "斐济",
                "Falkland Islands": "福克兰群岛",
                France: "法国",
                Gabon: "加蓬",
                "United Kingdom": "英国",
                Georgia: "佐治亚州",
                Ghana: "迦纳",
                Guinea: "几内亚",
                Gambia: "冈比亚",
                "Guinea Bissau": "几内亚比绍",
                "Equatorial Guinea": "赤道几内亚",
                Greece: "希腊",
                Greenland: "格陵兰",
                Guatemala: "危地马拉",
                "French Guiana": "法属圭亚那",
                Guyana: "圭亚那",
                Honduras: "洪都拉斯",
                Croatia: "克罗地亚",
                Haiti: "海地",
                Hungary: "匈牙利",
                Indonesia: "印度尼西亚",
                India: "印度",
                Ireland: "爱尔兰",
                Iran: "伊朗",
                Iraq: "伊拉克",
                Iceland: "冰岛",
                Israel: "以色列",
                Italy: "意大利",
                Jamaica: "牙买加",
                Jordan: "约旦",
                Japan: "日本",
                Kazakhstan: "哈萨克斯坦",
                Kenya: "肯尼亚",
                Kyrgyzstan: "吉尔吉斯斯坦",
                Cambodia: "柬埔寨",
                "South Korea": "韩国",
                Kosovo: "科索沃",
                Kuwait: "科威特",
                Laos: "老挝",
                Lebanon: "黎巴嫩",
                Liberia: "利比里亚",
                Libya: "利比亚",
                "Sri Lanka": "斯里兰卡",
                Lesotho: "莱索托",
                Lithuania: "立陶宛",
                Luxembourg: "卢森堡",
                Latvia: "拉脱维亚",
                Morocco: "摩洛哥",
                Moldova: "摩尔多瓦",
                Madagascar: "马达加斯加",
                Mexico: "墨西哥",
                Macedonia: "马其顿",
                Mali: "马里",
                Myanmar: "缅甸",
                Montenegro: "黑山",
                Mongolia: "蒙古",
                Mozambique: "莫桑比克",
                Mauritania: "毛里塔尼亚",
                Malawi: "马拉维",
                Malaysia: "马来西亚",
                Namibia: "纳米比亚",
                "New Caledonia": "新喀里多尼亚",
                Niger: "尼日尔",
                Nigeria: "尼日利亚",
                Nicaragua: "尼加拉瓜",
                Netherlands: "荷兰",
                Norway: "挪威",
                Nepal: "尼泊尔",
                "New Zealand": "新西兰",
                Oman: "阿曼",
                Pakistan: "巴基斯坦",
                Panama: "巴拿马",
                Peru: "秘鲁",
                Philippines: "菲律宾",
                "Papua New Guinea": "巴布亚新几内亚",
                Poland: "波兰",
                "Puerto Rico": "波多黎各",
                "North Korea": "朝鲜",
                Portugal: "葡萄牙",
                Paraguay: "巴拉圭",
                Qatar: "卡塔尔",
                Romania: "罗马尼亚",
                Russia: "俄罗斯",
                Rwanda: "卢旺达",
                "Western Sahara": "西撒哈拉",
                "Saudi Arabia": "沙特阿拉伯",
                Sudan: "苏丹",
                "South Sudan": "南苏丹",
                Senegal: "塞内加尔",
                "Solomon Islands": "所罗门群岛",
                "Sierra Leone": "塞拉利昂",
                "El Salvador": "萨尔瓦多",
                Somaliland: "索马里兰",
                Somalia: "索马利亚",
                "Republic of Serbia": "塞尔维亚共和国",
                Suriname: "苏里南",
                Slovakia: "斯洛伐克",
                Slovenia: "斯洛文尼亚",
                Sweden: "瑞典",
                Swaziland: "斯威士兰",
                Syria: "叙利亚",
                Chad: "乍得",
                Togo: "多哥",
                Thailand: "泰国",
                Tajikistan: "塔吉克斯坦",
                Turkmenistan: "土库曼斯坦",
                "East Timor": "东帝汶",
                "Trinidad and Tobago": "特立尼达和多巴哥",
                Tunisia: "突尼斯",
                Turkey: "土耳其",
                "United Republic of Tanzania": "坦桑尼亚联合共和国",
                Uganda: "乌干达",
                Ukraine: "乌克兰",
                Uruguay: "乌拉圭",
                "United States": "美国",
                Uzbekistan: "乌兹别克斯坦",
                Venezuela: "委内瑞拉",
                Vietnam: "越南",
                Vanuatu: "瓦努阿图",
                "West Bank": "约旦河西岸",
                Yemen: "也门",
                "South Africa": "南非",
                Zambia: "赞比亚",
                Zimbabwe: "津巴布韦"
              },
              data: this.worldData
            }
          ]
        },
        true
      );
    },
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

      let myChart = this.$echarts.init(this.$refs.report);
      // 绘制图表
      myChart.setOption(
        {
          xAxis: {
            name: "单位\n日期",
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
            data: [
              "玩家数量",
              "投注次数",
              "投注金额",
              "退款金额",
              "返回金额",
              "输赢金额"
            ],
            selectedMode: "single"
          },
          series: [
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
        },
        true
      );
    },
    playerCountConfigure() {
      let myChart = this.$echarts.init(this.$refs.playerCount);
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
            name: "单位\n日期"
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
            data: ["每日注册人数", "累计注册人数"],
            selectedMode: "single",
            padding: 10
          },
          series: [
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
        },
        true
      );
    },
    gameDtributedConfigure() {
      let myChart = this.$echarts.init(this.$refs.gameDtributed);
      myChart.setOption(
        {
          tooltip: {
            trigger: "item",
            formatter: formatMapData
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: this.valueTP
          },
          series: [
            {
              name: this.gameUnit,
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: this.valueGD,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        },
        true
      );
    },

    //分布
    houreMomentBarConfigure() {
      let myChart = this.$echarts.init(this.$refs.houreMomentBar);
      let betAmount = this.houreMomentData.betAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let betCount = this.houreMomentData.betCount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let playerCount = this.houreMomentData.playerCount.map(item => {
        return item.y;
      });
      let refundAmount = this.houreMomentData.refundAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let retAmount = this.houreMomentData.retAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let winloseAmount = this.houreMomentData.winloseAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let xArr = this.houreMomentData.betAmount.map(item => {
        return item.x;
      });
      myChart.setOption(
        {
          /* title: {
          text: "时刻分布柱状图",
          subtext: "",
          x: "left"
        }, */
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            },
            formatter: hourFormatBarData
          },
          grid: {
            left: "15%",
            bottom: "6%"
          },
          legend: {
            //orient: 'vertical',
            top: "top",
            left: "center",
            data: [
              "玩家数量",
              "投注次数",
              "投注金额",
              "退款金额",
              "返回金额",
              "输赢金额"
            ],
            selectedMode: "single",
            padding: 0
          },
          xAxis: [
            {
              name: "单位\n小时",
              type: "category",
              data: xArr,
              axisPointer: {
                type: "shadow"
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "玩家数量",
              type: "bar",
              data: playerCount
            },
            {
              name: "投注次数",
              type: "bar",
              data: betCount
            },
            {
              name: "投注金额",
              type: "bar",
              data: betAmount
            },
            {
              name: "退款金额",
              type: "bar",
              data: refundAmount
            },
            {
              name: "返回金额",
              type: "bar",
              data: retAmount
            },
            {
              name: "输赢金额",
              type: "bar",
              data: winloseAmount
            }
          ]
        },
        true
      );
    },
    weekMomentBarConfigure() {
      let myChart = this.$echarts.init(this.$refs.weekMomentBar);
      let betAmount = this.weekMomentData.betAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let betCount = this.weekMomentData.betCount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let playerCount = this.weekMomentData.playerCount.map(item => {
        return item.y;
      });
      let refundAmount = this.weekMomentData.refundAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let retAmount = this.weekMomentData.retAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let winloseAmount = this.weekMomentData.winloseAmount.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      let xArr = this.weekMomentData.betAmount.map(item => {
        return item.x;
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross",
              crossStyle: {
                color: "#999"
              }
            },
            formatter: formatBarData
          },
          grid: {
            left: "15%",
            bottom: "6%"
          },
          legend: {
            //orient: 'vertical',
            top: "top",
            left: "center",
            data: [
              "玩家数量",
              "投注次数",
              "投注金额",
              "退款金额",
              "返回金额",
              "输赢金额"
            ],
            selectedMode: "single",
            padding: 0
          },
          xAxis: [
            {
              name: "单位\n周",
              type: "category",
              data: xArr,
              axisPointer: {
                type: "shadow"
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "玩家数量",
              type: "bar",
              data: playerCount
            },
            {
              name: "投注次数",
              type: "bar",
              data: betCount
            },
            {
              name: "投注金额",
              type: "bar",
              data: betAmount
            },
            {
              name: "退款金额",
              type: "bar",
              data: refundAmount
            },
            {
              name: "返回金额",
              type: "bar",
              data: retAmount
            },
            {
              name: "输赢金额",
              type: "bar",
              data: winloseAmount
            }
          ]
        },
        true
      );
    },

    //商户排行榜柱状图
    mcPlayerCount() {
      let myChart = this.$echarts.init(this.$refs.merchantPlayerCount);
      let merchant = this.mcPlayerCountData.map(item => {
        return item.x;
      });
      let datas = this.mcPlayerCountData.map(item => {
        return item.y;
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: "{b0}</br>{c0} 人"
          },
          xAxis: {
            name: "单位\n人",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "18%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    mcBetCount() {
      let myChart = this.$echarts.init(this.$refs.merchantBetCount);
      let merchant = this.mcBetCountData.map(item => {
        return item.x;
      });
      let datas = this.mcBetCountData.map(item => {
        return item.y / 10000;
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: "{b0}</br>{c0} 万次"
          },
          xAxis: {
            name: "单位\n万次",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant
          },
          grid: {
            left: "18%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    mcBetAmount() {
      let myChart = this.$echarts.init(this.$refs.merchantBetAmount);
      let merchant = this.mcBetAmountData.map(item => {
        return item.x;
      });
      let datas = this.mcBetAmountData.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: "{b0}</br>{c0} 万元"
          },
          xAxis: {
            name: "单位\n万元",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant
          },
          grid: {
            left: "18%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    mcRetAmount() {
      let myChart = this.$echarts.init(this.$refs.merchantRetAmount);
      let merchant = this.mcRetAmountData.map(item => {
        return item.x;
      });
      let datas = this.mcRetAmountData.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: "{b0}</br>{c0} 万元"
          },
          xAxis: {
            name: "单位\n万元",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant
          },
          grid: {
            left: "18%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    mcWinloseAmount() {
      let myChart = this.$echarts.init(this.$refs.merchantWinloseAmount);
      let merchant = this.mcWinloseAmountData.map(item => {
        return item.x;
      });
      let datas = this.mcWinloseAmountData.map(item => {
        return (item.y / 10000).toFixed(2);
      });
      myChart.setOption(
        {
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            },
            formatter: "{b0}</br>{c0} 万元"
          },
          xAxis: {
            name: "单位\n万元",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant
          },
          grid: {
            left: "18%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    //玩家排行榜柱状图
    pyBetCount() {
      let myChart = this.$echarts.init(this.$refs.playerBetCount);
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
            formatter: "{b0}</br>{c0} 万次"
          },
          xAxis: {
            name: "单位\n万次",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "25%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    pyBetAmount() {
      let myChart = this.$echarts.init(this.$refs.playerBetAmount);
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
            formatter: "{b0}</br>{c0} 万元"
          },
          xAxis: {
            name: "单位\n万元",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "25%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    pyRetAmount() {
      let myChart = this.$echarts.init(this.$refs.playerRetAmount);
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
            formatter: "{b0}</br>{c0} 万元"
          },
          xAxis: {
            name: "单位\n万元",
            type: "value"
          },
          yAxis: {
            type: "category",
            data: merchant,
            nameGap: 60
          },
          grid: {
            left: "25%",
            right: "12%",
            top: "0",
            bottom: "5%"
          },
          series: [
            {
              type: "bar",
              data: datas
            }
          ]
        },
        true
      );
    },
    pyWinloseAmount() {
      let myChart = this.$echarts.init(this.$refs.playerWinloseAmount);
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
            formatter: "{b0}</br>{c0} 万元"
          },
          xAxis: {
            name: "单位\n万元",
            type: "value"
          },
          grid: {
            left: "25%",
            right: "12%",
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
              data: datas
            }
          ]
        },
        true
      );
    },

    init() {
      this.spinShow = true;
      let params = {};
      if (this.gameCode == "") {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime()
        };
      } else {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime(),
          gameType: this.gameCode
        };
      }
      // 先请求2个
      httpRequest("get", "/visual/pie/game", params, "map").then(res => {
        this.gameDtributedData = res.data;
        this.spinShow = false;
        this.changeGameDtributedDataType();
      });
      httpRequest("get", "/visual/line/day", params, "map").then(res => {
        this.reportData = res.data;
        this.reportConfigure();
        // 再请求2个
        httpRequest("get", "/visual/map/china", params, "map").then(res => {
          this.chinaAllData = res.data;
          this.changeChinaDataType();
        });
        httpRequest("get", "/visual/line/player", params, "map").then(res => {
          this.playerCountData = res.data;
          this.playerCountConfigure();
          // 最后请求1个
          httpRequest("get", "/visual/map/world", params, "map").then(res => {
            this.worldAllData = res.data;
            this.changeWorldDataType();
          });
        });
      });
    },
    mcRankInit() {
      let params = {};
      if (this.gameCode == "") {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime()
        };
      } else {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime(),
          gameType: this.gameCode
        };
      }
      //榜单
      this.spinShow = true;
      httpRequest("get", "/visual/rank/merchant", params, "map").then(res => {
        this.mcPlayerCountData = res.data.playerCount.reverse();
        this.mcBetCountData = res.data.betCount.reverse();
        this.mcBetAmountData = res.data.betAmount.reverse();
        this.mcRetAmountData = res.data.retAmount.reverse();
        this.mcWinloseAmountData = res.data.winloseAmount.reverse();
        this.mcPlayerCount();
        this.mcBetCount();
        this.mcBetAmount();
        this.mcRetAmount();
        this.mcWinloseAmount();
        this.spinShow = false;
      });
    },
    pyRankInit() {
      let params = {};
      if (this.gameCode == "") {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime()
        };
      } else {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime(),
          gameType: this.gameCode
        };
      }
      this.spinShow = true;
      httpRequest("get", "/visual/rank/player", params, "map").then(res => {
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
    distributionInit() {
      this.spinShow = true;
      let params = {};
      if (this.gameCode == "") {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime()
        };
      } else {
        params = {
          startTime: new Date(this.defaultTime[0]).getTime(),
          endTime: new Date(this.defaultTime[1]).getTime(),
          gameType: this.gameCode
        };
      }
      httpRequest("get", "/visual/graph/hours", params, "map").then(res => {
        this.houreMomentData = res.data;
        this.spinShow = false;
        this.houreMomentBarConfigure();
      });
      httpRequest("get", "/visual/graph/weeks", params, "map").then(res => {
        this.weekMomentData = res.data;
        this.weekMomentBarConfigure();
      });
      /* httpRequest("get", "/visual/graph/months", params, "map").then(res => {
        this.monthMomentData = res.data;
        this.monthMomentBarConfigure()
      }); */
    }
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
  }
  /* beforeDestroy() {
    clearInterval(this.hander);
  } */
};
</script>

<style lang="less" scoped>
.newBoard {
  position: relative;
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
      margin-left: 2rem;
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

  /deep/ .ivu-tabs-bar {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs-nav {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs-nav-scroll {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    width: 6rem;
    height: 2.25rem;
    font-size: 1rem;
    text-align: center;
  }
}
</style>
