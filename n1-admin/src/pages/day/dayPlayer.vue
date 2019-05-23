<template>
  <div class="dayReport">
    <div class="nowList">
      <div class="top">
        <p style="margin-right:1rem">玩家ID</p>
        <Input style="width:150px;margin-right:1rem" v-model="playerID" placeholder="请输入" size="small"></Input>
        <span style="margin-right:1rem">玩家账号</span>
        <Input style="width:150px;margin-right:1rem" v-model="playerName" placeholder="请输入" size="small"></Input>
        <Select style="width:200px;margin-right:1rem;" placeholder="选择游戏类别" ref="resetSelect" clearable v-model="model1" size="small">
          <Option v-for="(item, index) in gameType" :value="item.name" :key="item.name" @click.native="selGame(item.code)">{{item.name}}</Option>
        </Select>
        <DatePicker size="small" type="daterange" :options="options" :editable='false' :value="defaultTime" placeholder="选择日期时间范围(默认最近一个月)" style="width: 300px" confirm @on-ok="confirms" @on-change="handle"></DatePicker>
        <Button type="primary" @click="search" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
        <Button @click="reset" size="small">重置</Button>
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
import dayjs from 'dayjs'
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
      if (localStorage.dayPlayer == 'dayPlayer') {
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
      spinShow: false, //加载spin
      playerID: "",
      playerName: "",
      dayStatList: [],
      model1: "全部",
      showChat: false,
      
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
          slot: "winloseAmount"
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
    this.getGameList()
  },


  computed: {
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    }
  },
  methods: {
    //输赢金额
    winloseAmountConfig(row) {
      let color = row.winloseAmount < 0 ? "#f30" : "#0c0"
      return {winloseAmount: row.winloseAmount, color}   
    },
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
      let cacheTime = this.cacheTime.map(ite => {return ite.replace(/-/g,"")})
      this.getDate(cacheTime)
      this.showChat = true
      this.init();
    },
    changeSource(value) {
      this.init();
    },
    getGameList() {
      /* httpRequest("post","/gameBigType",{companyIden: -1},"game")
      .then(result => {
        this.gameType = result.payload
        this.gameType.unshift({type: 4, code: "", name: "全部", company: ""})
      }) */
      this.gameType = getGameType()
    },
    reset() {
      this.$refs.resetSelect.clearSingleSelect()
      this.showChat = false
      this.getDate();
      this.playerID = ""
      this.playerName = ""
      this.dayStatList = []
    },
    search() {
      if (this.playerID == "" && this.playerName == "") {
         this.$Message.info('请输入玩家账号或玩家ID');
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
      if (this.$route.name == 'dayPlayer' && localStorage.dayPlayer == 'dayPlayer') {
      
        let st = dayjs(this.$route.query.time[0]).format('YYYYMMDD')
        let et = dayjs(this.$route.query.time[1]).format('YYYYMMDD')

        /* let ps = await  httpRequest("post","/gameBigType",{companyIden: -1},"game")
        .then(result => {
          return result.payload
        })
        console.log(ps); */
        
        for (let index = 0; index < getGameType().length; index++) {
          if(this.$route.query.type == getGameType()[index].code) {
            this.model1 = getGameType()[index].name
            break;
          } else {
            this.model1 = '全部'
          }
        }

        this.defaultTime = []
        this.defaultTime.push(st,et)
        this.playerName = this.$route.query.name
        this.showChat = true
        this.managerName = this.$route.query.name
         this.gameCode = this.$route.query.type
        localStorage.removeItem('dayPlayer')
      }  

      let params = {
        userId: parseInt(this.playerID),//363048 数字
        userName: this.playerName,
        startTime: parseInt(this.defaultTime[0]), //当月一号
        endTime: parseInt(this.defaultTime[1]), //当日前一天
        gameType: parseInt(this.gameCode)
      };
      let req2 = this.$store.dispatch("getPlayerDayStat", params);
     
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [perms] = await this.axios.all([req2]);
     
      if (perms.code == 0 && perms.payload != undefined) {
        this.dayStatList = perms.payload;
      } else {
        this.showChat = false
      }

      if (perms.code == -1 || Object.keys(perms) == 1) {
        this.reset()
      }
      
      if (perms.payload != undefined && perms.payload.length == 0) {
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
      
    }
  },
 
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
    align-items: center;
    margin-bottom: 1rem;
    .title {
      display: flex;
      align-items: center;
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

