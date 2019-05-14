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
          <DatePicker v-model="amountDate" type="datetimerange" :options="options" :transfer='true' style="width: 300px" @on-ok="searchAmount" placeholder="选择日期时间范围">
        </DatePicker>
        </Col>
        <Col span="17" style="float: right; text-align: right">
        <Input v-model="betId" placeholder="请输入交易号" style="width: 30%;"></Input>
        <Button type="primary" @click="searchAmount">搜索</Button>
        <Button type="ghost" @click="reset">重置</Button>
        <Button type="primary" @click="exportData">导出数据</Button>
        </Col>
        <!-- <Col span="7"> -->
        <!-- <span class="justfy2">当前剩余点数：<span style="color: #F7BA2A">{{formatPoints(balance)}}</span></span> -->
        <!-- <Button @click="resultGetPlayerDetail">刷新</Button> -->
        </Col>
      </Row>
    </div>

    <div class="-p-content">
      <Table :columns="columns" :data="dataList"></Table>
      <Row style="padding: 20px 0">
        <Col span="12" class="g-text-right">
        <div style="margin-bottom: 10px;font-size: 15px;" v-if='radioInfo!=-1'>本页输赢总计:
          <span :class="{'-p-green':this.allAmount>0,'-p-red':this.allAmount<0}">
            {{formatPoints(allAmountFun)}}
          </span>
        </div>
        </Col>
        <Col span="12" style="text-align: right;font-size: 12px">
        <Page :total="playerDetailList.length" show-elevator :page-size="20" :current.sync="currentPage" @on-change="getNowpage"></Page>
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

    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>

<script type="text/ecmascript-6">
import { thousandFormatter } from "@/config/format";
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
      nowSize: 20,
      nowPage: 1,
      pageSize: 100,
      currentPage: 1,
      allAmount: 0,
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
      GameListEnum: {
        All:[
          { company: "全部", code: "", name: "全部" },
          /* { company: "NA", code: "10000", name: "NA棋牌游戏" },
          { company: "NA", code: "30000", name: "NA真人视讯" },
          { company: "NA", code: "40000", name: "NA电子游戏" },
          { company: "NA", code: "50000", name: "NA街机游戏" },
          { company: "NA", code: "60000", name: "NA捕鱼游戏" }, */
          { company: "NA", code: "70000", name: "H5电子游戏" },
          //{ company: "NA", code: "80000", name: "H5真人视讯" },
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
        NA: [
          // { company: 'NA', code: '3', name: 'NA商城' },
          { company: "全部", code: "", name: "全部" },
          /* { company: "NA", code: "10000", name: "NA棋牌游戏" },
          { company: "NA", code: "30000", name: "NA真人视讯" },
          { company: "NA", code: "40000", name: "NA电子游戏" },
          { company: "NA", code: "50000", name: "NA街机游戏" },
          { company: "NA", code: "60000", name: "NA捕鱼游戏" }, */
          { company: "NA", code: "70000", name: "H5电子游戏" },
          //{ company: "NA", code: "80000", name: "H5真人视讯" },
          { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" }
        ],
        KY: [
          { company: "全部", code: "", name: "全部" },
          { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        ],
        TTG: [{ company: "全部", code: "", name: "全部" },{ company: "TTG", code: "1010000", name: "TTG电子游戏" }],
        PNG: [{ company: "全部", code: "", name: "全部" },{ company: "PNG", code: "1020000", name: "PNG电子游戏" }],
        MG: [{ company: "全部", code: "", name: "全部" },{ company: "MG", code: "10300000", name: "MG电子游戏" }],
        HABA: [{ company: "全部", code: "", name: "全部" },{ company: "HABA", code: "1040000", name: "HABA电子游戏" }],
        AG: [{ company: "全部", code: "", name: "全部" },{ company: "AG", code: "1050000", name: "AG真人游戏" }],
        SA: [
          { company: "全部", code: "", name: "全部" },
          { company: "SA", code: "1060000", name: "SA真人游戏" },
          { company: "SA", code: "1110000", name: "SA捕鱼游戏" }
        ],
        PG: [{ company: "全部", code: "", name: "全部" },{ company: "PG", code: "1090000", name: "PG电子游戏" }],
        YSB: [{ company: "全部", code: "", name: "全部" },{ company: "YSB", code: "1130000", name: "YSB体育游戏" }],
        RTG: [{ company: "全部", code: "", name: "全部" },{ company: "RTG", code: "1140000", name: "RTG电子游戏" }],
        SB: [
          { company: "全部", code: "", name: "全部" },
          { company: "SB", code: "1080000", name: "SB电子游戏" },
          { company: "SB", code: "1120000", name: "SB真人游戏" }
        ],
        DT: [{ company: "全部", code: "", name: "全部" },{ company: "DT", code: "1150000", name: "DT电子游戏" }],
        PP: [{ company: "全部", code: "", name: "全部" },{ company: "PP", code: "1160000", name: "PP电子游戏" }]
      },
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
          minWidth: 120
        },
        {
          title: "交易时间",
          key: "",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "游戏类型",
          key: "typeName"
        },
        {
          title: "游戏ID",
          key: "gameId",
          render: (h, params) => {
            return h('span', this.GameNameEnum[params.row.gameId] ? `${params.row.gameId}(${this.GameNameEnum[params.row.gameId]})`: params.row.gameId)    
          }
        },
        {
          title: "结算前余额",
          key: "",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.originalAmount));
          }
        },
        {
          title: "操作金额",
          key: "",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.betAmount));
          }
        },
        {
          title: "返还金额",
          key: "",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.retAmount));
          }
        },
        {
          title: "净利润",
          key: "",
          render: (h, params) => {
            return h(
              "span",
              {
                class: {
                  "-p-green": params.row.profitAmount >= 0,
                  "-p-red": params.row.profitAmount < 0
                }
              },
              thousandFormatter(params.row.profitAmount)
            );
          }
        },
        // {
        //   title: '成数',
        //   key: '',
        //   render: (h, params) => {
        //     return h('span', `${params.row.rate}%`)
        //   }
        // },
        // {
        //   title: '洗码比',
        //   key: '',
        //   render: (h, params) => {
        //     return h('span', `${params.row.mix}%`)
        //   }
        // },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            if (
              params.row.gameType != 1 &&
              params.row.gameType != 2 &&
              params.row.gameType != 3
            ) {
              return h("div", [
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    style: {
                      color: "#20a0ff"
                      // marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.mystical=false
                        this.fudai=false;
                        this.nomalType=false
                        this.openModalBill(params.row);
                      }
                    }
                  },
                  "查看战绩"
                ),
                h(
                  "Button",
                  {
                    props: {
                      type: "text",
                      size: "small"
                    },
                    style: {
                      color: "#20a0ff"
                    },
                    on: {
                      click: () => {
                        this.openModalRunning(params.row);
                      }
                    }
                  },
                  "流水详情"
                )
              ]);
            }
          }
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
    getGameTypeList() {
     
      return this.GameListEnum[this.selType == '全部厂商' ? 'All' : this.selType]
    }
  },
  mounted() {
     this.getTransactionRecord()
    //this.companySelectList();
  },
  methods: {
    reset() {
      this.companyInfo = '全部厂商'
      this.selType = 'All'
      this.startKey = ''
      this.betId = ''
      this.amountDate = [new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()]
      this.changeRadio()
    },
    getNowpage(page) {
      this.nowPage = page;
      if (
        page == Math.ceil(this.playerDetailList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage
      ) {
        this.playerDetailListStorage = JSON.parse(
          JSON.stringify(this.playerDetailList)
        );
        this.getTransactionRecord();
      }
    },
    async openModalBill(data) {
      console.log(data);
      
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
     this.playerDetailStartKey = ''
     this.radioInfo = val
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
        // this.balance = result.balance
        this.playerDetailStartKey = result.startKey;
        this.playerDetailListStorage.length &&
          (this.playerDetailList = this.playerDetailListStorage.concat(
            this.playerDetailList
          ));
        this.isFetching = false;
      });
    },
    companySelectList() {
      /* httpRequest(
        "post",
        "/companySelect",
        {
          parent: localStorage.loginRole == 1 ? "" : localStorage.loginId
        },
        "game"
      ).then(result => {
        this.companyList = result.payload || [];
        this.companyList.unshift({
          company: "全部厂商"
        });
        this.changeCompany();
        // this.$store.commit('closeLoading')
      }); */
    }, //获取运营商列表
    changeCompany(val) {
     
      this.selType = val
      
    },
    searchAmount(val) {
      this.radioInfo = val
      this.changeRadio()
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
