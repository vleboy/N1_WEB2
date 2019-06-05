<template>
  <div class="p-board">
    <RadioGroup v-model="testInfo" @on-change="changeTest" type="button" v-if="isAdmin">
      <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
      <Radio label="1">测试</Radio>
      <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
    </RadioGroup>
    <div class="p-board-head" v-if="totalItems.length">
      <Row :gutter="20">
        <Col :span="6" v-for="(item, index) in totalItems" :key="index" class="head-all-item">
          <div class="head-item">
            <div class="head-left">
              <img class="left-icon" :src="item.icon">
            </div>
            <div class="head-right">
              <div class="head-right-title color-gery">
                <span class="left-text">{{item.oneText}}: </span>
                <Tooltip class="item" effect="dark" :content="item.oneNum.toString()" placement="right" :transfer='true'>
                  <span class="right-number">{{item.oneNum}}</span>
                </Tooltip>

                <Poptip trigger="hover" content="content" placement="right-start" class="head-text" :transfer="true">
                  <span>详情</span>
                  <div slot="content" v-if="item.type==3">
                    <div v-for="data of item.playerDetail">
                      <div style="margin-bottom: 10px">
                        <label style="font-size: 15px;color: #2d8cf0;">{{data.gameTypeName}}</label>
                        <div v-for="item2 of data.list">
                          <span>{{item2.gameName}}在线玩家：{{item2.number}}</span>
                        </div>
                        <div v-if="!data.list.length">暂无在线玩家</div>
                      </div>
                    </div>
                  </div>
                  <div slot="content" v-else>
                    <div v-for="data of item.record">
                      {{data.name}}：{{data.number}}
                    </div>
                  </div>
                </Poptip>
              </div>
              <div class="right-ratio">
                <div class="head-right-title color-gery">
                  <span class="left-text">{{item.twoText}}: </span>
                  <Tooltip class="item" effect="dark" :content="item.twoNum.toString()" placement="right" :transfer='true'>
                    <span class="right-number">{{item.twoNum}}</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="p-board-content">
      <Row :gutter="20">
        <Col :span="24">
          <div class="content-border">
            <div class="content-title">平台游戏点数消耗分布</div>
            <div>
              <div class="content-top">
                <Col :span="24" class="g-text-right" style="margin-bottom: 10px">
                  <RadioGroup v-model="companyInfo" @on-change="changeCompany()" size="small" type="button">
                    <Radio v-for="(item,index) of companyList" :key="index" :label="item.company">{{item.company}}</Radio>
                  </RadioGroup>
                </Col>
                <Col :span="6">
                  <div class="left-content-head">
                    <span class="color-gery">总消耗</span>
                    <span class="strong">{{consumeNum}}点</span>
                  </div>
                </Col>
                <Col :span="18" class="g-text-right">
                  <RadioGroup v-model="dateType" size="small" @on-change="changeDateType" type="button" >
                    <Radio label="1">近一周</Radio>
                    <Radio label="2">近一个月</Radio>
                    <Radio label="3">近三个月</Radio>
                  </RadioGroup>
                  <Date-picker
                    style="width: 200px"
                    v-model="dateInterval"
                    type="daterange"
                    placement='bottom-end'
                    :transfer='true'
                    :options="options"
                    @on-change="changeConsume"
                    placeholder="选择日期范围">
                  </Date-picker>
                </Col>
              </div>
              <div>
                <div class="content-bottom">
                  <div id="myChartAllPie" class="content-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="p-board-content">
      <Row :gutter="20">
        <Col :span="24">
          <div class="content-border">
            <div class="content-title">售出/收益</div>
            <div>
              <div class="content-top">
                <Col span="10">
                <div class="left-content-head" v-show="isSaleNum">
                  <span class="color-gery">总售出</span>
                  <span class="strong">{{saleNums}}点</span>
                </div>
                <div class="left-content-head"  v-show="isConNum">
                  <span class="color-gery">总收益</span>
                  <span class="strong">{{conNums}}点</span>
                </div>
                </Col>
                <Col class="g-text-right">
                  <RadioGroup v-model="dateTypeTwo" size="small" @on-change="changeDateTypeTwo" type="button">
                    <Radio label="1">近一周</Radio>
                    <Radio label="2">近一个月</Radio>
                    <Radio label="3">近三个月</Radio>
                  </RadioGroup>
                  <Date-picker
                    style="margin-left: 1rem"
                    v-model="dateIntervalTwo"
                    :transfer='true'
                    :options="options"
                    placement='bottom-end'
                    type="daterange"
                    @on-change="changeConsumeTwo"
                    placeholder="选择日期范围">
                  </Date-picker>
                </Col>
              </div>
              <div>
                <div class="content-bottom">
                  <div id="myChartAllLine" class="content-bar"></div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <div class="p-board-content">
      <Row :gutter="20">
        <Col :span="24">
        <div class="content-border">
          <div class="content-title">玩家注册人数</div>
          <div>
            <div class="content-top">
              <Col class="g-text-right">
              <RadioGroup v-model="dateTypeThree" size="small" type="button" @on-change="changeDateTypeThree">
                <Radio label="1">近一周</Radio>
                <Radio label="2">近一个月</Radio>
                <Radio label="3">近三个月</Radio>
              </RadioGroup>
              <DatePicker
                style="width: 200px"
                v-model="dateIntervalThree"
                :transfer='true'
                :options="options"
                placement='bottom-end'
                type="daterange"
                @on-change="changeConsumeThree"
                placeholder="选择日期范围">
              </DatePicker>
              </Col>
            </div>
            <div>
              <div class="content-bottom">
                <div id="playerNumChart" class="content-bar"></div>
              </div>
            </div>
          </div>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { httpRequest } from '@/service/index'
  import dayjs from 'dayjs'
  import { thousandFormatter } from '@/config/format'
  export default {
    beforeCreate () {

    },
    data () {
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
        dateType: '1',
        dateTypeTwo: '1',
        dateTypeThree: '1',
        dateInterval: '',
        dateIntervalTwo: '',
        dateIntervalThree: '',
        totalData: [],
        dataChess: [],
        dataVideo: [],
        statisticalTextOne: ['今日售出点数', '今日收益点数', '在线玩家', '今日签约数'],
        statisticalTextTwo: ['历史售出点数', '历史收益点数', '玩家总数', '历史签约数'],
        statisticalIcon: ['/static/icon-1.png', '/static/icon-2.png', '/static/icon-3.png', '/static/icon-4.png'],
        dateTypeArray: [],
        consumeList: '',
        consumeAndIncomeList: '',
        playerNumList: '',
        consumeDataTime: {},
        consumeAndIncomeDataTime: {},
        playerDataTime: {},
        isGoConsume: false, // 判断是否从搜索框跳转
        isGoConsumeAndIncome: false, // 判断是否从搜索框跳转
        isPlayerNum: false, // 判断是否从搜索框跳转
        isSetInterval: false, // 是否是定时刷新,
        dynamicNum: '', // 动态渲染游戏消耗总点数
        conNum: '0', // 动态渲染收益消耗总点数
        saleNum: '0', // 动态渲染售出消耗总点数
        isSaleNum: true, // 是否显示售出
        isConNum: true, // 是否显示收益
        isFirst: true, // 是否第一次获取
        companyList: [], // 厂商列表
        companyInfo: '全部厂商', // 厂商单独信息
        testInfo: '0',
        isAdmin: localStorage.level == '0' // 查看是否是代理和管理员
      }
    },
    mounted () {
      let self = this
      for (let i = 0; i < 4; i++){
        self.getStatisticalNum(i)
      }
      self.changeDateType()
      self.changeDateTypeTwo()
      self.changeDateTypeThree()
      self.companySelect()
      self.intervalid = setInterval(() => {
        self.isSetInterval = true
        for (let i = 0; i < 4; i++){
          self.getStatisticalNum(i)
        }
        self.changeDateType()
        self.changeDateTypeTwo()
        self.changeDateTypeThree()
      }, 60000*30);
    },
    computed: {
      optionSeries () {
        let optionSeries = []
        for (let item of this.consumeList.values) {
          optionSeries.push({
            name: item.name,
            type: 'bar',
            data: item.list
          })
        }
        return optionSeries
      },// 消耗点数图表数据动态
      optionTips () {
        let optionTips = []
        for (let item of this.consumeList.values) {
          optionTips.push({
            name: item.name,
            icon: 'rect'
          })
        }
        return optionTips
      },// 消耗点数动态图标
      optionSeriesLine () {
        let optionSeriesLine = [
          {
            name: '售出',
            type: 'line',
            data:  this.consumeAndIncomeList.sale
          },
          {
            name: '收益',
            type: 'line',
            data: this.consumeAndIncomeList.consume
          }
        ]
        return optionSeriesLine
      },
      optionPlayerLine () {
        let optionPlayerLine = [
          {
            name: '累计注册人数',
            type: 'line',
            data:  this.playerNumList.sum
          },
          {
            name: '每日注册人数',
            type: 'line',
            data: this.playerNumList.incr
          }
        ]
        return optionPlayerLine
      },
      dateTypes () {
        return this.consumeList.keys
      },
      dateTypesLine () {
        return this.consumeAndIncomeList.keys
      },
      dateTypesPlayerLine () {
        return this.playerNumList.keys
      },
      totalItems () {
        return this.totalData
      },
      consumeNum () {
        return this.thousandFormatter(this.dynamicNum)
      },
      saleNums () {
        return thousandFormatter(this.saleNum)
      },
      conNums () {
        return thousandFormatter(this.conNum)
      },
      permission () {
        return JSON.parse(localStorage.userInfo).subRolePermission||[];
      }
    },
    methods: {
      getStatisticalNum (index) {
        if(this.isAdmin) {
          this.testInfo = this.isFirst ? (this.permission.includes('正式数据') ? '0': '1') : this.testInfo
        }

        httpRequest('post','/statistics/overview',{
          isTest: +this.testInfo,
          type: index+1
        }).then(
          result => {
            if (!this.isSetInterval) {
              this.totalData.splice(index, 0, {
                index: index+1,
                icon: this.statisticalIcon[index],
                oneText: this.statisticalTextOne[index],
                twoText: this.statisticalTextTwo[index],
                oneNum: result ? this.thousandFormatter(result.oneNum) : '0',
                twoNum: result ? this.thousandFormatter(result.twoNum) : '0',
                type: result.type,
                playerDetail: result.detail ? result.detail : [],
                record: result.records ? result.records : []
              })
            } else {
              for (let item of this.totalData) {
                if (result && (item.index === result.type)) {
                  item.oneNum = this.thousandFormatter(result.oneNum)
                  item.twoNum = this.thousandFormatter(result.twoNum)
                  item.playerDetail = result.detail ? result.detail : []
                  item.record = result.records ? result.records : []
                }
              }
            }
          }
        )
      }, // 获取顶部统计数据
      getStatisticsConsume () {
        let myChart = this.$echarts.init(document.getElementById('myChartAllPie'))
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        if(this.isAdmin) {
          this.testInfo = this.isFirst ? (this.permission.includes('正式数据') ? '0': '1') : this.testInfo
        }

        httpRequest('post','/statistics/consume',{
          isTest: +this.testInfo,
          startTime: this.consumeDataTime.startTime,
          endTime: this.consumeDataTime.endTime,
          company: this.companyInfo == '全部厂商' ? '-1' : this.companyInfo
        }).then(
          result => {
            this.consumeList = result.data
            this.dynamicNum = this.consumeList.sum
            this.drawAllPie()
          }
        )
      }, // 获取游戏消耗点数总
      getConsumeAndIncome () {
        let myChart = this.$echarts.init(document.getElementById('myChartAllLine'))
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        if(this.isAdmin) {
          this.testInfo = this.isFirst ? (this.permission.includes('正式数据') ? '0': '1') : this.testInfo
        }

        httpRequest('post','/statistics/consumeAndIncome',this.consumeAndIncomeDataTime)
        .then(result => {
          this.consumeAndIncomeList = result.data
          this.saleNum = this.consumeAndIncomeList.sumSale
          this.conNum = this.consumeAndIncomeList.sumConsume
          this.drawAllLine()
          }
        )
      }, // 获取售出，收益
      getPlayerNum () {
        let myChart = this.$echarts.init(document.getElementById('playerNumChart'))
        myChart.showLoading({
          text: '图表加载中...',
          color: '#20a0ff',
          textColor: '#000',
          zlevel: 0
        })

        this.testInfo = this.isFirst ? (this.permission.includes('正式数据') ? '0': '1') : this.testInfo

        this.playerDataTime.isTest = +this.testInfo
        httpRequest('post','/statistics/player',this.playerDataTime)
          .then(result => {
              this.playerNumList = result.data
              this.drawPlayLine()
            }
          )
      }, // 获取玩家注册人数
      changeConsume () {
        this.isGoConsume = true
        let [start, end] = this.dateInterval
        if (start != null || end != null) {
          this.dateType = ''
          this.consumeDataTime = {
            startTime: start.getTime(),
            endTime: end.getTime() + 24*3600*1000 - 1
          }
          this.getStatisticsConsume()
        }
      }, // 游戏消耗自选时间筛选
      changeConsumeTwo () {
        this.isGoConsumeAndIncome = true
        let [start, end] = this.dateIntervalTwo
        if (start != null || end != null) {
          this.dateTypeTwo = ''
          this.consumeAndIncomeDataTime = {
            startTime: start.getTime(),
            endTime: end.getTime() + 24*3600*1000 - 1
          }
          this.getConsumeAndIncome()
        }
      }, // 售出收益自选时间筛选
      changeConsumeThree () {
        this.isPlayerNum = true
        let [start, end] = this.dateIntervalThree
        if (start != null || end != null) {
          this.dateTypeThree = ''
          this.playerDataTime = {
            startTime: start.getTime(),
            endTime: end.getTime() + 24*3600*1000 - 1
          }
          this.getPlayerNum()
        }
      }, // 玩家注册人数自选时间筛选
      drawAllPie () {
        // 基于准备好的dom，初始化echarts实例
        let self = this;
        let legendArray = []
        let myChart = this.$echarts.init(document.getElementById('myChartAllPie'))
        myChart.clear();
        myChart.on('legendselectchanged', function (params) {
          legendArray = Object.entries(params.selected)
          self.dynamicNum = 0
          for (let [index,data] of self.consumeList.values.entries()) {
            if(legendArray[index][1]){
              self.dynamicNum = data.sum + self.dynamicNum
            }
          }
        });
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data:this.optionTips,
            right: '3%'
          },
          xAxis: {
            data: this.dateTypes
          },
          grid: {
            left: '8%',
            right: '3%',
            bottom: '10%',
            top: '16%'
          },
          yAxis: {},
          series: this.optionSeries,
          color: ['#D32F2F', '#FFCDD2', '#7b1fa2', '#212121', '#757575', '#FFEB3B', '#F57C00', '#795548', '#64ffda', '#03A9F4', '#388E3C', '#FF4081', '#607D8B', '#536DFE']
        })
        myChart.hideLoading()
      }, // 多栏柱状图
      drawAllLine () {
        // 基于准备好的dom，初始化echarts实例
        let self = this;
        let legendArray = []
        let myChart = this.$echarts.init(document.getElementById('myChartAllLine'))
        myChart.clear();
        myChart.on('legendselectchanged', function (params) {
          legendArray = Object.entries(params.selected)
          self.isSaleNum = legendArray[0][1]
          self.isConNum = legendArray[1][1]
        });        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            }
          },
          legend: {
            data: [
              {
                name: '售出',
                icon: 'circle'
              },
              {
                name: '收益',
                icon: 'circle'
              }
            ],
            right: '3%'
          },
          xAxis: {
            boundaryGap:  false,
            axisTick: {
              alignWithLabel: true
            },
            data: this.dateTypesLine
          },
          grid: {
            left: '8%',
            right: '3%',
            bottom: '10%',
            top: '16%'
          },
          yAxis: {},
          series: this.optionSeriesLine,
          color: ['#49a9ee', '#98d87d', '#ffd86e', '#f3857b', '#8996e6']

        })
        myChart.hideLoading()
      }, // 折线图
      drawPlayLine () {
        // 基于准备好的dom，初始化echarts实例
        let self = this;
        let legendArray = []
        let myChart = this.$echarts.init(document.getElementById('playerNumChart'))
        myChart.clear();
        myChart.on('legendselectchanged', function (params) {
          legendArray = Object.entries(params.selected)
          self.isSaleNum = legendArray[0][1]
          self.isConNum = legendArray[1][1]
        });
        // 绘制图表
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            }
          },
          legend: {
            data: [
              {
                name: '累计注册人数',
                icon: 'circle'
              },
              {
                name: '每日注册人数',
                icon: 'circle'
              }
            ],
            selected:{
              '累计注册人数':false
            },
            right: '3%'
          },
          xAxis: {
            boundaryGap:  false,
            axisTick: {
              alignWithLabel: true
            },
            data: this.dateTypesPlayerLine
          },
          grid: {
            left: '8%',
            right: '3%',
            bottom: '10%',
            top: '16%'
          },
          yAxis: {},
          series: this.optionPlayerLine,
          color: ['#49a9ee', '#98d87d', '#ffd86e', '#f3857b', '#8996e6']

        })
        myChart.hideLoading()
      }, // 玩家注册人数折线图
      changeDateType () {
        let nowDate = new Date()
        !this.isGoConsume && (this.dateInterval = '')
        switch (+this.dateType) {
          case 1:
            this.consumeDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 6*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
          case 2:
            this.consumeDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 29*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
          case 3:
            this.consumeDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 89*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
        }
        this.isGoConsume = false
        this.getStatisticsConsume()
      }, // 游戏消耗日期筛选过滤切换
      changeDateTypeTwo () {
        let nowDate = new Date()
        !this.isGoConsumeAndIncome && (this.dateIntervalTwo = '')
        switch (+this.dateTypeTwo) {
          case 1:
            this.consumeAndIncomeDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 6*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
          case 2:
            this.consumeAndIncomeDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 29*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
          case 3:
            this.consumeAndIncomeDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 89*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
        }
        this.isGoConsumeAndIncome = false
        this.getConsumeAndIncome()
      }, // 售出收益日期筛选过滤切换
      changeDateTypeThree () {
        let nowDate = new Date()
        !this.isPlayerNum && (this.dateIntervalThree = '')
        switch (+this.dateTypeThree) {
          case 1:
            this.playerDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 6*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
          case 2:
            this.playerDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 29*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
          case 3:
            this.playerDataTime = {
              startTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) - 89*24*3600*1000,
              endTime: new Date(nowDate.getTime()-24*3600*1000).setHours(0, 0, 0, 0) + 24*3600*1000-1
            }
            break
        }
        this.isPlayerNum = false
        this.getPlayerNum()
      }, // 玩家注册人数统计
      thousandFormatter (num) {
        let toString = num.toString()
        let numOne = ''
        let numTwo = ''
        let formatterNum = ''
        if(toString.indexOf('.')>-1){
          [numOne,numTwo] = toString.split('.')
        }
        formatterNum = (numOne || num).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        return numTwo ? `${formatterNum}.${numTwo}` : formatterNum
      }, // 千位符格式化
      getWeek() {
        let nowDate= new Date()  ;
        let nowDay = nowDate.getDay() || 7;
        return new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 1 - nowDay);
      }, // 处理周次
      companySelect () {
        httpRequest('post','/companySelect',{
          parent: localStorage.loginRole == 1000 ? '' : localStorage.loginId
        }).then(
          result => {
            this.companyList = result.payload
            this.companyList.unshift({
              company: '全部厂商'
            })
            this.changeCompany()
          }
        )
      }, //获取运营商列表
      changeCompany(){
        this.getStatisticsConsume()
      },
      changeTest () {
        this.isSetInterval = true
        this.isFirst = false
        for (let i = 0; i < 4; i++){
          this.getStatisticalNum(i)
        }
        this.getStatisticsConsume()
        this.getPlayerNum()
        this.getConsumeAndIncome()
        this.changeDateType()
        this.changeDateTypeTwo()
        this.changeDateTypeThree()
      }
    },
    beforeDestroy (){
      this.isSetInterval = false
      clearInterval(this.intervalid)
    },
    watch:{
      '$route': function (_new,_old) {
        if(_new.name == 'board') {
          this.drawAllPie()
          this.drawAllLine()
        }
      }
    }
  }
</script>

<style scpoed>
  .p-board{
    padding:1rem;
  }
  .p-board-head, .p-board-content{
    margin-bottom: 2rem;
  }
  .head-item {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    margin-top: 1rem;
    padding: 1rem 0;
    overflow: hidden;
  }
  .head-left{
    text-align: center;
    width: 30%;
    min-width: 30%;
    display: inline-block;
    position: relative;
    top:0.4rem;
  }
  .left-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .head-right{
    float: right;
    width: 70%;
    max-width: 70%;
    display: inline-block;
  }


  .head-right-title{
    position: relative;
  }

  .head-text{
    position: absolute;
    top: 10px;
    right: 20px;
    cursor: pointer;
    color: #2d8cf0;
  }


  .right-number{
    padding-bottom: 0.5rem;
    font-size: 20px;
    color: #000000;
    max-width: 75px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .color-gery{
    color: #b7b7b7;
  }
  .strong{
    font-size: 20px;
  }
  /*content 内容*/
  .content-title{
    padding: 1rem;
    font-size: 18px;
    border-bottom: 1px solid #e8e8e8;
  }
  .left-content-head{
    padding: 0 1rem;
  }
  .left-text{
    padding-bottom: 0.5rem;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .content-border{
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }
  .content-bottom{
    /*overflow: auto;*/
    padding: 0 1rem 1rem 1rem;
  }
  .content-top{
    overflow: hidden;
    padding: 20px 0
  }
  .content-bar{
    width: 100%;
    height: 340px;
  }
  .g-text-right{
    text-align: right;
  }

  @media screen and (min-width: 1280px){
    .right-number{
      max-width: 160px;
    }
  }

</style>
