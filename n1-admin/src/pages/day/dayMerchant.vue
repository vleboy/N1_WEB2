<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top">
        <p class="title">
          <Row class="row -search-row" type="flex" align="middle">
            <Col span="5">商户标识</Col>
            <Col span="6">
              <Input v-model="buSN" placeholder="请输入"></Input>
            </Col>
            <Col span="4" offset="1">商户ID</Col>
            <Col span="6">
              <Input v-model="buID" placeholder="请输入"></Input>
            </Col>
          </Row>
        </p>
        <Select style="width:200px;margin-right:2rem;" placeholder="选择游戏类别" ref="resetSelect" clearable v-model="model1">
          <Option v-for="(item, index) in gameType" :value="item.name" :key="item.name" @click.native="selGame(item.code)">{{item.name}}</Option>
        </Select>
        <div class="right">
          <DatePicker type="daterange" :options="options" :editable='false' :value="defaultTime" placeholder="选择日期时间范围(默认最近一个月)" style="width: 300px" confirm @on-ok="confirms" @on-change="handle"></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
      </div>
    </div>
    <div v-if="showChat">
      <div id="myChart"></div>
     </div>
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
import { httpRequest } from "@/service/index";
import _ from "lodash";
import dayjs from 'dayjs'
import { thousandFormatter } from "@/config/format";
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
      if (localStorage.dayMerchant == 'dayMerchant') {
        vm.spinShow = true
        vm.init()
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
      model1: "全部",
      spinShow: false, //加载spin
      buID: "",
      buSN: "",
      dayStatList: [],
      showChat: false,
      GameListEnum: [
        { company: "全部", code: "", name: "全部" },
        /*  { company: "NA", code: "10000", name: "NA棋牌游戏" },
        { company: "NA", code: "30000", name: "NA真人视讯" },
        { company: "NA", code: "40000", name: "NA电子游戏" },
        { company: "NA", code: "50000", name: "NA街机游戏" },
        { company: "NA", code: "60000", name: "NA捕鱼游戏" },
        { company: "NA", code: "80000", name: "H5真人视讯" }, */
        { company: "NA", code: "70000", name: "H5电子游戏" },
        { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" },
        { company: "TTG", code: "1010000", name: "TTG电子游戏" },
        { company: "PNG", code: "1020000", name: "PNG电子游戏" },
        { company: "MG", code: "10300000", name: "MG电子游戏" },
        { company: "HABA", code: "1040000", name: "HABA电子游戏" },
        { company: "AG", code: "1050000", name: "AG真人游戏" },
        { company: "SA", code: "1060000", name: "SA真人游戏" },
        { company: "SA", code: "1110000", name: "SA捕鱼游戏" },
        { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        { company: "PG", code: "1090000", name: "PG电子游戏" },
        { company: "YSB", code: "1130000", name: "YSB体育游戏" },
        { company: "RTG", code: "1140000", name: "RTG电子游戏" },
        { company: "SB", code: "1080000", name: "SB电子游戏" },
        { company: "SB", code: "1120000", name: "SB真人游戏" },
        { company: "DT", code: "1150000", name: "DT电子游戏" },
        { company: "PP", code: "1160000", name: "PP电子游戏" }
      ],
     columns1: [
        {
          title: "日期",
          align: 'center',
          key: "createdDate"
        },
        {
          title: "投注次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "投注金额",
          align: 'center',
          key: "betAmount"
        },
        {
          title: "返还金额",
          align: 'center',
          key: "retAmount"
        },
        {
          title: "退款金额",
          align: 'center',
          key: "refundAmount"
        },
        {
          title: "输赢金额",
          align: 'center',
          key: "winloseAmount",
          render: (h,params) => {
           let count = params.row.winloseAmount
           let color = ''
           if (count < 0) {
             color = "#f30"
           } else {
             color = "#0c0"
           }
            
           return h("span",{style: {color:color} }, count)
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
    this.getDate()
    this.getGameList();
  },


  computed: {
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    }
  },
  /* watch: {
    '$route': function (to, from) {
      if(to.name == 'dayMerchant') {
        this.buSN = this.$route.query.name
        this.defaultTime = this.$route.query.time
        this.showChat = true
        this.init()
      }
    }
  }, */
  methods: {
    handle(daterange) {
      this.cacheTime = daterange
    
      
    },
    selGame(index){
      this.showChat = true
      this.gameCode = index
     this.init();
      
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      let _this = this;
     

      let betCountArr = _this.dayStatList.map((item) => {return item.betCount})
      let betAmountArr = _this.dayStatList.map((item) => {return item.betAmount})
      let retAmountArr = _this.dayStatList.map((item) => {return item.retAmount})
      let refundAmountArr = _this.dayStatList.map((item) => {return item.refundAmount})
      let winloseAmountArr = _this.dayStatList.map((item) => {return item.winloseAmount})
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
          data: ["投注次数",	"投注金额", "返还金额",	"退款金额",	"输赢金额"],
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
          },
        ]
      });
    },
    confirms() {
      this.showChat = true
      let cacheTime = this.cacheTime.map(ite => {return ite.replace(/-/g,"")})
      this.getDate(cacheTime)
      this.init();
    },
    changeSource(value) {
      this.init();
    },
    reset() {
      this.$refs.resetSelect.clearSingleSelect()
      this.getDate()
      this.buID = "",
      this.buSN = "",
      this.dayStatList = []
      this.showChat = false
    },
    search() {
      // if (this.dayStatList != "") {
        
      // }

      if (this.buID == '' && this.buSN == '') {
        this.$Message.info('请输入商户标识或商户ID');
      } else { 
        this.showChat = true
        this.init();
      }

    },
    // permission() {
    //   return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    // },
    async init() {
      this.spinShow = true;
      if (this.$route.name == 'dayMerchant' && localStorage.dayMerchant == 'dayMerchant') {
      
        let st = dayjs(this.$route.query.time[0]).format('YYYYMMDD')
        let et = dayjs(this.$route.query.time[1]).format('YYYYMMDD')

        /* let ps = await  httpRequest("post","/gameBigType",{companyIden: -1},"game")
        .then(result => {
          return result.payload
        }) */
        for (let index = 0; index < this.GameListEnum.length; index++) {
          if(this.$route.query.type == this.GameListEnum[index].code) {
            this.model1 = this.GameListEnum[index].name
            break;
          } else {
            this.model1 = '全部'
          }
        }
        
        this.defaultTime = []
        this.defaultTime.push(st,et)
        this.buSN = this.$route.query.name
        this.showChat = true
        this.managerName = this.$route.query.name
         this.gameCode = this.$route.query.type
        localStorage.removeItem('dayMerchant')
      }
      
      let params = {
        displayId: parseInt(this.buID),//625615 数字
        sn: this.buSN,
        startTime: parseInt(dayjs(this.defaultTime[0]).format('YYYYMMDD')), //当月一号
        endTime: parseInt(dayjs(this.defaultTime[1]).format('YYYYMMDD')), //当日前一天
        gameType: parseInt(this.gameCode)
      };
      let req2 = this.$store.dispatch("getUserDayStat", params);
     
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [perms] = await this.axios.all([req2]);
     

      this.dayStatList = perms.payload;

      if (this.dayStatList == "") {
        this.showChat = false
      }
      
      if (this.showChat) {
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
      
    },
    getGameList() {
      /* httpRequest("post","/gameBigType",{companyIden: -1},"game")
      .then(result => {
        this.gameType = result.payload
        this.gameType.unshift({type: 4, code: "", name: "全部", company: ""})
      }) */
      this.gameType = this.GameListEnum
    },
  },
  props: ['identity']
};
</script>
<style lang="less" scoped>
.dayReport {
  min-height: 90vh;
  .title {
    font-size: 0.95rem;
    margin: 0.5rem 0 0.5rem;
    display: inline-block;
  }
  .top {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
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

