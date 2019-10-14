<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top">
        <div style="margin-bottom:1rem" class="title1">
          <div style="display:flex">
            <p>
              <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource" style="" size="small">
                <Radio label="0">{{$t('dailyReport.formal')}}</Radio>
                <Radio label="1">{{$t('dailyReport.test')}}</Radio>
                <Radio label="2">{{$t('dailyReport.all')}}</Radio>
              </RadioGroup>
            </p>
            <p style="margin:0 1rem;">
              <RadioGroup v-model="isAll" class="radioGroup" type="button" @on-change="changeShow" size="small">
                <Radio label="0">{{$t('dailyReport.formal')}}</Radio>
                <Radio label="1">{{$t('dailyReport.under')}}</Radio>
              </RadioGroup>
            </p>  
            <p>
              <p>
                <DatePicker size="small" type="daterange" :options="options" :editable='false' :value="defaultTime" placeholder="选择日期时间范围(默认最近一个月)" style="width: 270px" confirm @on-ok="confirms" @on-change="handle"></DatePicker>
              </p>
            </p>
            <Select style="width:200px;margin:0 1rem" placeholder="选择游戏类别" ref="resetSelect" clearable v-model="model1" size="small" >
                <Option v-for="(item, index) in getGameList" :value="item.name" :key="item.name" @click.native="selGame(item.code)">{{item.name}}</Option>
            </Select>
          </div>
          <div>
            <Button type="primary" @click="search" size="small" style="margin-right:.3rem;">{{$t('dailyReport.search')}}</Button>
            <Button @click="reset" size="small">{{$t('dailyReport.reset')}}</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showBox">
      <div id="myChart"></div>
    </div>
    
    <div class="playerList" id="playerList">
      <Table :columns="columns1" :data="dayStatList" size="small" ref="table_2">
        <template slot-scope="{row, index}" slot="winloseAmount">
          <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>{{$t('dailyReport.loading')}}</div>
    </Spin>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
import _ from "lodash";
import dayjs from 'dayjs'
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
      if (localStorage.dayCompany == 'dayCompany') {
        vm.spinShow = true 
        vm.init()
      }
       
    });
  },
  data() {
    return {
      defaultTime: [],//getDefaultTime(),
      cacheTime:[],
      managerName:"",
      spinShow: false, //加载spin
      source: "1",
      model1: "全部游戏",
      isAll: "0",
      isBoolean: true,
      dayStatList: [],
      showBox: false,
      
      columns1: [
        {
          title: "日期",
          align: 'center',
          key: "createdDate",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '日期' : 'Date'
            )
          }
        },
        {
          title: "商户数量",
          align: 'center',
          key: "merchantCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户数量' : 'Merchant Count'
            )
          }
        },
        {
          title: "玩家数量",
          align: 'center',
          key: "playerCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '玩家数量' : 'Player Count'
            )
          }
        },
        {
          title: "投注次数",
          align: 'center',
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
          align: 'center',
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
          align: 'center',
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
          align: 'center',
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
          align: 'center',
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
      gameCode:"",

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
    //console.log(12345678910);
    
    /* if (this.permission.includes("正式数据")) {
      this.source = "0";
    } */
    this.source = "0";
    this.getDate()
    this.init()
  },
  /* watch: {
    '$route': function (to, from) {
    
      if(to.name == 'dayManager') {
        this.managerName = this.$route.query.name
        this.defaultTime = this.$route.query.time
        this.showBox = true
        this.init()
      }
    }
  }, */

  computed: {
    options() {
      return {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
            value() {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
            value() {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
            value() {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
            value() {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      }
    },
    /* permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    } */
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
    //输赢报表
    winloseAmountConfig(row) {
      let color = row.winloseAmount < 0 ? "#f30" : "#0c0"
      return {winloseAmount: thousandFormatter(row.winloseAmount), color}
    },
    handle(daterange) {
      this.cacheTime = daterange
     
    },
     selGame(index){
      this.gameCode = index
      this.showBox = true
      this.init();
      
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      let _this = this;
      let betCountArr = _this.dayStatList.map((item) => {return item.betCount})
      let betAmountArr = _this.dayStatList.map((item) => {return item.betAmount})
      let retAmountArr = _this.dayStatList.map((item) => {return item.retAmount})
      let refundAmountArr = _this.dayStatList.map((item) => {return item.refundAmount})
      let winloseAmountArr = _this.dayStatList.map((item) => {return item.winloseAmount})
      let xArr = _this.dayStatList.map((item) => {return item.createdDate})
      let merchantCountArr = _this.dayStatList.map(item => {
        return item.merchantCount;
      });      
      let playerCountArr = _this.dayStatList.map(item => {
        return item.playerCount;
      });
      let data = []
      let series = []

      if (this.$store.state.language == 'zh') {
        data = ["商户数量","玩家数量","投注次数", "投注金额", "返还金额", "退款金额", "输赢金额"]
        series = [
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
      } else {
        data = ["Merchant Count","Player Count","Bet Count", "Bet Amount", "Return Amount", "Refund Amount", "Win/Lose Amount"]
        series = [
          {
            name: "Merchant Count",
            data: merchantCountArr,
            type: "line"
          },
          {
            name: "Player Count",
            data: playerCountArr,
            type: "line"
          },
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
        trigger: 'axis'
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
      this.showBox = true
      let cacheTime = this.cacheTime.map(ite => {return ite.replace(/-/g,"")})
      this.getDate(cacheTime)
      this.init();
    },
    changeSource(value) {
      this.init();
    },
    changeShow(value) {
      if (this.isAll != "0") {
        this.isBoolean = false
      } else {
        this.isBoolean = true
      }
     this.init();
    },
    reset() {
      this.showBox = false
      this.isAll = "0"
      this.isBoolean = true
      this.getDate();
      /* if (this.permission.includes("正式数据")) {
        this.source = "0";
      } */
      this.source = "0";
      this.managerName = ""
      this.init();
    },
    search() {
      /* if (this.managerName == '') {
        this.$Message.info('请输入线路商前缀');
      } else { */
        this.showBox = true
        this.init();
      
      
    },
    // permission() {
    //   return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    // },
    
    async init() {
      this.spinShow = true;
      this.showBox = true
      if (this.$route.name == 'dayCompany' && localStorage.dayCompany == 'dayCompany') {
      
        let st = dayjs(this.$route.query.time[0]).format('YYYYMMDD')
        let et = dayjs(this.$route.query.time[1]).format('YYYYMMDD')

        /* let ps = await  httpRequest("post","/gameBigType",{companyIden: -1},"game")
        .then(result => {
          return result.payload
        }) */

        /* 输赢报表跳转逻辑 */
        let gameList = []
        let game = ''
        if (this.$store.state.language == 'zh') {
          gameList = getCNGameType()
          game = '全部游戏'
        } else {
          gameList = getENGameType()
          game = 'All'
        }
        for (let index = 0; index < gameList.length; index++) {
          if(this.$route.query.type == gameList[index].code) {
            this.model1 = gameList[index].name
            break;
          } else {
            this.model1 = game
          }
        }
        this.source = this.$route.query.source
        this.defaultTime = []
        this.defaultTime.push(st,et)
        this.showBox = true
        //this.managerName = this.$route.query.name
         this.gameCode = this.$route.query.type
        localStorage.removeItem('dayCompany')
      }
      let params = {
        //suffix: this.managerName, //ZS1,XLSA
        isTest: this.source,
        startTime: parseInt(dayjs(this.defaultTime[0]).format('YYYYMMDD')), //当月一号
        endTime: parseInt(dayjs(this.defaultTime[1]).format('YYYYMMDD')), //当日前一天
        gameType: parseInt(this.gameCode),
        isAll: this.isBoolean
      };
      let req2 = this.$store.dispatch("getManagerDayStat", params);
      
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [perms] = await this.axios.all([req2]);
      
      if (perms.code == 0) {
        this.dayStatList = perms.payload;
      }
      if (this.dayStatList.length == 0) {
        this.showBox = false
      }
      
      if (this.showBox) {
        
        this.drawLine();
      }
     
      this.spinShow = false;

    },
    
    getDate(opt) {
      
      if(opt !== undefined) {
        this.defaultTime = opt
      } else if(dayjs().format('DD') == "01") {
        this.defaultTime = [dayjs().startOf('month').format('YYYYMMDD'), dayjs().startOf('month').format('YYYYMMDD')]
      } else {
        this.defaultTime = [dayjs().startOf('month').format('YYYYMMDD'), dayjs(dayjs().valueOf()-24 * 60 * 60 * 1000).format('YYYYMMDD')]
      }
      
    }
  },
  watch: {
      '$store.state.language': function() {
        if(this.$route.name == 'dayCompany') {
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
    .title1 {
      display: flex
    }
    .title2 {
      display: flex;
      margin-bottom: 1rem;
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
  /deep/.ivu-select-selection {
    border-color: #000;
  }
  /deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
}
#myChart {
  width: 100%;
  height: 300px;
}
</style>

