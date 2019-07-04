<template>
  <div class="p-transaction">
    <div class="-p-header">
      <Row>
        <Col class="-p-h-bottom">
        <RadioGroup v-model="companyInfo" @on-change="changeCompany" type="button" size="small">
          <Radio v-for="(item,index) of companyList" :key="index" :label="item.company">{{item.company}}</Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row>
        <Col class="-p-h-bottom">
        <RadioGroup v-model="radioInfo"  @on-change="changeRadio" type="button" size="small">
          <Radio v-for="(item,index) of getGameTypeList" :key="index" :label="item.code">{{item.name}}</Radio>
        </RadioGroup>
        </Col>
      </Row>
      <Row>
        <Col span="7">
          <DatePicker size="small" v-model="amountDate" type="datetimerange" :options="options" :transfer='true' style="width: 300px" @on-ok="confirms" placeholder="选择日期时间范围">
        </DatePicker>
        </Col>
        <Col span="17" style="float: right; text-align: right">
        <Input v-model="betId" placeholder="请输入交易号" style="width: 30%;" size="small"></Input>
        <Button type="primary" @click="searchAmount" size="small" style="margin:.3rem">搜索</Button>
        <Button @click="reset" size="small" style="margin-right:.3rem">重置</Button>
        <Button type="primary" @click="exportData" size="small">导出数据</Button>
        </Col>
        <!-- <Col span="7"> -->
        <!-- <span class="justfy2">当前剩余点数：<span style="color: #F7BA2A">{{formatPoints(balance)}}</span></span> -->
        <!-- <Button @click="resultGetPlayerDetail">刷新</Button> -->
        </Col>
      </Row>
    </div>

    <div class="-p-content">

      <Table :columns="columns" :data="dataList">
        <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="gameId">
          <span>{{gameIdConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="oldBalance">
          <span>{{oldBalanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="newBalance">
          <span>{{newBalanceConfig(row)}}</span>
        </template>   
        <template slot-scope="{row, index}" slot="profit">
          <span :style="{color:profitConfig(row).color}">{{profitConfig(row).profit}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
            <Button v-if="operateState(row)" type="text" size="small" style="color:#20a0ff" @click="operateCheck(row)">查看战绩</Button>   
            <Button v-if="operateState(row)" type="text" size="small" style="color:#20a0ff" @click="operateWater(row)">流水详情</Button>   
        </template>
      </Table>

      <Row style="padding: 20px 0;font-size:1rem">
        <Col span="12" class="g-text-right">
          <Row type="flex"> 
            <Col style="margin-right:1rem">
              本页投注:
              <span>
                {{formatPoints(allBetAmountFun)}}
              </span>
            </Col>
            <Col>
              本页输赢:
              <span :class="{'-p-green':this.allAmount>0,'-p-red':this.allAmount<0}">
                {{formatPoints(allAmountFun)}}
              </span>
            </Col>
          </Row>
          <Row type="flex">
            <Col style="margin-right:1rem">
              总计投注:
              <span>
                {{formatPoints(playerBetAmount)}}
              </span>
            </Col>
            <Col style="margin-right:1rem">
              有效投注:
              <span>
                {{formatPoints(playerMixAmount)}}
              </span>
            </Col>
            <Col>
              总计输赢:
              <span :class="{'-p-green':this.playerWinloseAmount>0,'-p-red':this.playerWinloseAmount<0}">
                {{formatPoints(playerWinloseAmount)}}
              </span>
            </Col>
          </Row>
        </Col>
        <Col span="12" style="text-align: right;font-size: 12px">
        <Page :total="playerDetailList.length" :page-size="20" :current.sync="currentPage" @on-change="getNowpage"></Page>
        </Col>
      </Row>
    </div>

    <Modal title="战绩详细" v-model="isOpenModalBill" class="g-text-center" width="800" cancel-text="">
      <!--<OneArmBanditModal ref="childMethod" v-if="propChild.gameType =='40000'" :dataProp="propChild"></OneArmBanditModal>-->
      <RealLifeModal ref="childMethod" v-if="isRealLife" :dataProp="propChild"></RealLifeModal>
      <!--<ArcadeModal ref="childMethod" v-if="propChild.gameType =='50000'" :dataProp="propChild"></ArcadeModal>-->
      <sportsModal ref="childMethod" v-if="propChild.gameType =='1130000'" :dataProp="propChild"></sportsModal>
    </Modal>
    <Modal title="h5战绩详细" v-model="naHfive" class="g-text-center" width="500">
      <secreat-modal v-if="mystical" :hProp='hProp'  v-on:loading="Load" :fudai='fudai'/>
      <hfive-modal v-if="nomalType" v-on:loading="Load" :dataProp='hProp'/>
    </Modal>

    <Modal title="流水详情" v-model="isOpenModalRunning" class="g-text-center" width="800" cancel-text="">
      <oneRunningAccount :dataProp="runningDetail"></oneRunningAccount>
    </Modal>

    <Spin size="large" fix v-show="isFetching" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script type="text/ecmascript-6">
import { thousandFormatter } from "@/config/format";
import { getGameListEnum } from "@/config/getGameType";
import dayjs from "dayjs";
import { httpRequest } from "@/service/index";
// import api from '@/api/api'
import SecreatModal from '@/components/player/SecreatModal'
import ArcadeModal from "@/components/record/arcadeModal";
import RealLifeModal from "@/components/record/realLifeModal";
import OneArmBanditModal from "@/components/record/oneArmBanditModal";
import oneRunningAccount from "@/components/player/oneRunningAccount";
import SportsModal from "@/components/record/sportsModal";
import HfiveModal from "@/components/player/HfiveModal";
export default {
  components: {
    oneRunningAccount,
    OneArmBanditModal,
    ArcadeModal,
    RealLifeModal,
    SportsModal,
    HfiveModal,
    SecreatModal
  },
  name: "transactionRecord",
  props: ["dataProp"],
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
      GameNameEnum: {
          "70001": "塔罗之谜",
          "70002": "小厨娘",
          "70003": "降龙献瑞",
          "70004": "四方神兽",
          "70005": "财神进宝",
          "70006": "福运亨通",
          "70007": "熊猫传奇",
          "70010": "财源广进",
          "70011": "珠光宝气",
          "70012": "锦鲤",
          "70013": "金狮送福",
          "70014": "幸运钱庄",
          "70022": "年年有余",
          "70024": "猪年大吉",
          "70026": "财神到",
          "70028": "老寿星",
          "70030": "凤舞朝阳",
          "70032": "鲤跃龙门",
          "90001": "塔罗之谜",
          "90002": "小厨娘",
          "90003": "祥龙献瑞",
          "90004": "四方神兽",
          "90005": "财神进宝",
          "90006": "福运亨通",
          "90007": "熊猫传奇",
          "90008": "财源广进",
          "90009": "珠光宝气",
          "90010": "锦鲤",
          "90011": "金狮送福",
          "90012": "幸运钱庄",
          "90013": "年年有余",
          "90014": "猪年大吉",
          "90015": "财神到",
          "90016": "老寿星",
          "90017": "凤舞朝阳",
          "90018": "鲤跃龙门",
        },
      mystical:false,
      nomalType:false,
      fudai:false,
      hProp: {
        gameId:70010,
        betId:'',
        betAmount:0,
        winloseAmount:0,
        roundResult:{
          userInfo:{ },
          viewGrid:[],
          winGrid:[],
        }
      },
      playerBetAmount: '',
      playerMixAmount: '',
      playerWinloseAmount: '',
      nowSize: 20,
      nowPage: 1,
      pageSize: 100,
      currentPage: 1,
      allAmount: 0,
      allBetAmount: 0,
      naHfive: false,
      isFetching: false,
      isLastMessage: false, // 主要判断是否是后台返回最后一次信息
      isOpenModalBill: false,
      isOpenModalRunning: false,
      radioInfo: "",
      amountDate: [],
      selType: 'All',
      companyList: [
        {company: '全部厂商'},
        {company: 'NA'},
        {company: 'MG'},
        {company: 'KY'},
        {company: 'DT'},
        {company: 'RTG'},
        {company: 'PP'},
        {company: 'PG'},
        {company: 'PNG'},
        {company: 'TTG'},
        {company: 'HABA'},
        {company: 'AG'},
        {company: 'SA'},
        {company: 'SB'},
        {company: 'YSB'},
      ],
      
      gameTypeList: [],
      companyInfo: "全部厂商",
      playerDetailList: [],
      playerDetailListStorage: [],
      playerDetailStartKey: "",
      // balance: '',
      betId: "",
      propChild: {},
      runningDetail: {},
      columns: [
        {
          title: "交易号",
          key: "businessKey",
          minWidth: 120,
          align: "center"
        },
        {
          title: "交易时间",
          slot: "createdAt",
          minWidth: 120,
          align: "center"
        },
        {
          title: "游戏类型",
          key: "typeName",
          align: "center"
        },
        {
          title: "游戏ID",
          slot: "gameId",
          align: "center"
        },
        {
          title: "结算前金额",
          slot: "oldBalance",
          align: "center"
        },
        {
          title: "操作金额",
          slot: "balance",
          align: "center"
        },
        {
          title: "返还金额",
          slot: "newBalance",
          align: "center"
        },
        {
          title: "净利润",
          slot: "profit",
          align: "center"
        },
        
        {
          title: "操作",
          slot: "operate",
          align: "center"
        }
      ],
      realTypeIds: ["30000", "1050000", "1060000"]
    };
  },
  computed: {
    isRealLife() {
      let array = this.realTypeIds.some(item => {
        return item == this.propChild.gameType;
      });

      return array;
    },
    dataList() {
      if (this.nowPage === 1) {
        return this.playerDetailList.slice(0, this.nowSize);
      } else {
        return this.playerDetailList.slice(
          (this.nowPage - 1) * this.nowSize,
          this.nowSize * this.nowPage
        );
      }
    },
    allAmountFun() {
      this.allAmount = 0;
      for (let item of this.dataList) {
        if (item.gameType != "2") {
          this.allAmount = item.winloseAmount + this.allAmount;
        }
      }
      return this.allAmount;
    },
    allBetAmountFun() {
      this.allBetAmount = 0;
      for (let item of this.dataList) {
        if (item.gameType != "2") {
          this.allBetAmount = item.betAmount + this.allBetAmount;
        }
      }
      return this.allBetAmount;
    },
    getGameTypeList() {
     
      return getGameListEnum()[this.selType == '全部厂商' ? 'All' : this.selType]
    }
  },
  mounted() {
   
    
     this.getTransactionRecord()
    //this.companySelectList();
  },
  methods: {
    //交易时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")  
    },
    //游戏ID
    gameIdConfig(row) {
      return this.GameNameEnum[row.gameId] ? `${row.gameId}(${this.GameNameEnum[row.gameId]})`: row.gameId   
    },
    //结算前金额
    oldBalanceConfig(row) {
      return thousandFormatter(row.originalAmount)
    },
    //操作金额
    balanceConfig(row) {
      return thousandFormatter(row.betAmount)
    },
    //返还金额
    newBalanceConfig(row) {
      return thousandFormatter(row.retAmount)
    },
    //利润
    profitConfig(row) {
      let color =     row.profitAmount >=0 ? "green" : "red"
      return {profit: thousandFormatter(row.profitAmount), color}
    },
    /* 操作 */
    //显示状态
    operateState(row) {
      return row.gameType != 1 && row.gameType != 2 && row.gameType != 3 ? true : false
    },
    //查看战绩
    operateCheck(row) {
      this.mystical=false
      this.fudai=false;
      this.nomalType=false
      this.openModalBill(row);
    },
    //流水详情
    operateWater(row) {
      this.openModalRunning(row);
    },
    reset() {
      this.companyInfo = '全部厂商'
      this.selType = 'All'
      this.startKey = ''
      this.betId = ''
      this.radioInfo = ''
      this.radioMoney = ''
      this.playerDetailStartKey = ''
      this.amountDate = [new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()]
      this.initData()
      this.getTransactionRecord()
    },
    getNowpage(page) {
      this.nowPage = page;
      console.log(this.playerDetailList.length);
      console.log(this.playerDetailList.length / this.nowSize);
      
      if (
        page == Math.ceil(this.playerDetailList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage
        && this.playerDetailList.length >=100
      ) {
        this.playerDetailListStorage = JSON.parse(
          JSON.stringify(this.playerDetailList)
        );
        this.getTransactionRecord();
      }
    },
    async openModalBill(data) {
      this.propChild = data;
      if (this.isRealLife) {
        this.isOpenModalBill = true;
        setTimeout(() => {
          this.$refs.childMethod.getRealLife();
        }, 0);
      } else if (this.propChild.gameType == "1130000") {
        this.isOpenModalBill = true;
        setTimeout(() => {
          this.$refs.childMethod.getRealLife();
        }, 0);
      } else if (data.gameType == "70000") {
        try {
          await this.getHfiveData(data.businessKey)
        }catch(err){
          this.$Message.error(err)
        }
      } else if (data.gameType == "90000") {
        try {
          await this.getHfiveData(data.businessKey)
        }catch(err){
          this.$Message.error(err)
        }
      } else {
        this.$Message.error("对不起，该游戏不支持查看战绩");
      }
    },
    openModalRunning(data) {
      this.isOpenModalRunning = true;
      this.runningDetail = data;
    },
    changeRadio(val) {
     this.radioInfo = val
     this.initData()
     this.getTransactionRecord()
    },
    getHfiveData(betId){
      httpRequest('post','/player/bill/record',{
        userName: localStorage.playerName,
        betId
      }).then(res=>{
        let mode=res.data.mode
        if(mode=='Secret Bonus'){
          this.mystical=true
        }else if(mode=='FuDai Game'){
          this.mystical=true
          this.fudai=true;
        }else{
          this.nomalType=true
        }
        this.hProp=res.data
        this.naHfive = true;
      })
    },
    Load(){
      this.$store.commit('globalLoading',{params:true})
      setTimeout(()=>{
         this.$store.commit('globalLoading',{params:false})
      },500)
    },
    getTransactionRecord() {
      if (this.isFetching) return;
      this.isFetching = true;
      this.initTime();
      let name = localStorage.playerName;
      let [startTime, endTime] = this.amountDate;
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      httpRequest("post", "/player/bill/detail", {
        userName: name,
        company: this.companyInfo == "全部厂商" ? "-1" : this.companyInfo,
        gameType: this.radioInfo,
        startTime: startTime,
        endTime: endTime,
        startKey: this.playerDetailStartKey,
        pageSize: this.pageSize,
        betId: this.betId
      }).then(result => {
        this.isLastMessage = result.list < this.pageSize;
        this.playerDetailList = result.list;
        this.playerDetailStartKey = result.startKey;
        this.playerDetailListStorage.length &&
          (this.playerDetailList = this.playerDetailListStorage.concat(
            this.playerDetailList
          ));
        this.isFetching = false;
      });

      httpRequest("post", "/querySinglePlayerStat",{
        userName: name,
        company: this.companyInfo == "全部厂商" ? "-1" : this.companyInfo,
        gameType: this.radioInfo,
        startTime: startTime,
        endTime: endTime,
      }).then(res => {
       
        this.playerBetAmount = res.payload[0].betAmount
        this.playerMixAmount = res.payload[0].mixAmount
        this.playerWinloseAmount = res.payload[0].winloseAmount

      })

     ;
      
    },
    //获取运营商列表
    changeCompany(val) {
      this.selType = val
      this.radioInfo = null
      this.initData()
    },
    confirms() {
      this.initData()
      this.playerAccountListStartKey = "";
      this.getTransactionRecord()
    },
    searchAmount() {
      this.initData()
      this.getTransactionRecord()
    },
    initTime() {
      const start = this.amountDate[0]
        ? new Date(this.amountDate[0])
        : new Date();
      const end = this.amountDate[1]
        ? new Date(this.amountDate[1])
        : new Date();
      !this.amountDate[0] &&
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      this.amountDate = [start, end];
    },
   
    initData() {
      this.playerBetAmount = 0
      this.playerMixAmount = 0
      this.playerWinloseAmount = 0
      this.currentPage = 1;
      this.nowPage = 1;
      this.playerDetailList = [];
      this.playerDetailListStorage = [];
      this.playerDetailStartKey = "";
    },
    formatPoints(data) {
      return thousandFormatter(data);
    },
    exportData() {
      let url =
        process.env.NODE_ENV == "production"
          ? "https://n1admin.na12345.com"
          : "https://d3rqtlfdd4m9wd.cloudfront.net";
      let [startTime, endTime] = this.amountDate;
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      window.open(
        `${url}/player/bill/detail/download?userName=${
          localStorage.playerName
        }&company=${this.companyInfo}&gameType=${
          this.radioInfo ? this.radioInfo : ''
        }&startTime=${startTime}&endTime=${endTime}`
      );
    }
  }
};
</script>

<style lang="less" scoped type="text/less">
.p-transaction {
  .-p-content {
    padding: 16px 0 0 0;
  }
  .-p-h-bottom {
    margin-bottom: 16px;
  }

  .-p-green {
    color: #00cc00;
  }
  .-p-red {
    color: #ff3300;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
