<template>
  <div class="p-transaction">
    <div class="-p-header">
      <div class="from-search" style="margin:.5rem 0">
          <RadioGroup v-model="companyInfo" type="button" size="small" @on-change="changeCompany">
            <Radio v-for="(item,index) of getCompanyList" :key="index" :label="item.company">{{item.company}}</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          <RadioGroup v-model="radioInfo" type="button" size="small" @on-change="changeGameType">
            <Radio v-for="(item,index) of gameTypeList" :key="index" :label="item.name">{{item.name}}</Radio>
          </RadioGroup> 
        </div>
      <Row style="display:flex;align-items:center;margin-top:1rem">
        <Col span="8">
          <DatePicker size="small" v-model="amountDate" :options="options" type="datetimerange" :transfer='true' style="width: 300px" @on-ok="searchAmount" placeholder="选择日期时间范围">
        </DatePicker>
        </Col>
        <Col span="16" style="float: right; text-align: right">
        <Input v-model="betId" placeholder="请输入交易号" style="width: 30%;" size="small"></Input>
        <Button type="primary" @click="searchAmount" size="small">搜索</Button>
        <Button type="ghost" @click="reset" size="small">重置</Button>
        <Button type="primary" @click="exportData" size="small">导出数据</Button>
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
        <Page :total="playerDetailList.length" :page-size="20" :current.sync="currentPage" @on-change="getNowpage"></Page>
        </Col>
      </Row>
    </div>
    <playerRecharge v-if="isOpenModal" ref="childMethod" @updateInfo="updatePlayerInfo" :dataProp="balanceInfo" @closeModal="closeRechargeModal"></playerRecharge>
    <Modal title="战绩详细" v-model="isOpenModalBill" class="g-text-center" width="940" cancel-text="">
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
import { httpRequest, agentOne } from "@/service/index";
import HfiveModal from "@/components/player/HfiveModal";
import SecreatModal from '@/components/player/SecreatModal'
import {getGameType, getGameListEnum} from '@/config/getGameType'
// import api from '@/api/api'
// import ArcadeModal from '@/components/record/arcadeModal'
import RealLifeModal from "@/components/player/realLifeModal";
// import OneArmBanditModal from '@/components/record/oneArmBanditModal'
import SportsModal from "@/components/player/sportsModal";
import oneRunningAccount from "@/components/player/oneRunningAccount";
import playerRecharge from "@/components/player/playerRecharge";
export default {
  components: { oneRunningAccount, playerRecharge, RealLifeModal, SportsModal,HfiveModal,SecreatModal },
  name: "transactionRecord",
  props: ["parentId"],
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
      mystical:false,
      nomalType:false,
      fudai:false,
      hProp: {
        gameId:70010,
        betId:'',
        betAmount:0,
        winloseAmount:0,
        roundResult: {
          userInfo: {},
          viewGrid: [],
          winGrid: [],
          treasureData: {}
        }
      },
      naHfive: false,
      nowSize: 20,
      nowPage: 1,
      pageSize: 100,
      currentPage: 1,
      allAmount: 0,
      isFetching: false,
      isLastMessage: false, // 主要判断是否是后台返回最后一次信息
      isOpenModalBill: false,
      isOpenModal: false,
      isOpenModalRunning: false,
      radioInfo: "全部",
      amountDate: [],
      companyList: [],
      companyInfo: "全部厂商",
      playerDetailList: [],
      playerDetailListStorage: [],
      playerDetailStartKey: "",
      balance: "",
      betId: "",
      propChild: {},
      runningDetail: {},
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
      columns: [
        {
          title: "交易号",
          align: 'center',
          key: "businessKey",
          width: 200
        },
        {
          title: "交易时间",
          align: 'center',
          key: "",
          width: 160,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
         {
          title: "游戏类型",
          align: 'center',
          key: "typeName"
        },
        {
          title: "游戏ID",
          align: 'center',
          key: "gameId",
           render: (h, params) => {
            return h('span', this.GameNameEnum[params.row.gameId] ? `${params.row.gameId}(${this.GameNameEnum[params.row.gameId]})`: params.row.gameId)
          }
        },
        {
          title: "结算前余额",
          align: 'center',
          key: "",
          width: 140,
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.originalAmount));
          }
        },
        {
          title: "操作金额",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.betAmount));
          }
        },
        {
          title: "返还金额",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.retAmount));
          }
        },
        {
          title: "净利润",
          align: 'center',
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
        {
          title: "成数",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("span", `${params.row.rate}%`);
          }
        },
        {
          title: "洗码比",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("span", `${params.row.mix}%`);
          }
        },
        {
          title: "操作",
          key: "action",
          width: 90,
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
                      color: "#20a0ff",
                      marginRight: "5px"
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
      balanceInfo: {},
      gameCompanyArr: [],
      gameTypeArr: [],
      realTypeIds: ["30000", "1050000", "1060000"]
    };
  },
  computed: {
    getCompanyList() {
        this.gameCompanyArr.unshift({company: '全部厂商'})
        return this.gameCompanyArr
      },
      gameTypeList() {
        let gameType = [];
        
        
        if (this.companyInfo == "全部厂商") {
          gameType = this.gameTypeArr.map(item => {
            return item;
          });
        } else {
          gameType = this.gameTypeArr.map(item => {
            if (this.companyInfo == item.company) {
              return item;
            }
          });
        }
        gameType.unshift({name: '全部', code: ''});

        return gameType
      },
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
    }
  },
  mounted() {
    this.companySelectList()
    this.searchAmount()
  },
  methods: {
    reset() {
      this.companyInfo = '全部厂商'
      this.radioInfo = "全部";
      this.betId = ''
      this.amountDate = [new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()]
      this.initData()
      this.getTransactionRecord()
    },
    getNowpage(page) {
      this.nowPage = page;
      if (
        page == Math.ceil(this.playerDetailList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage 
        && this.playerDetailList.length >= 100
      ) {
        this.playerDetailListStorage = JSON.parse(
          JSON.stringify(this.playerDetailList)
        );
        this.getTransactionRecord();
      }
    },
    updatePlayerInfo() {
      this.$emit("updateBalance");
    },
    openModal(bool) {
      this.isOpenModal = true;
      this.balanceInfo = {
        userName: this.dataProp.userName,
        parentName: this.dataProp.merchantName,
        remark: "",
        balance: this.balance,
        points: 0,
        fromUserId: this.dataProp.parent,
        isSave: bool
      };
      setTimeout(() => {
        this.$refs.childMethod.openRechargeModal();
      }, 0);
    },
    closeRechargeModal() {
      // this.isOpenModal = false
      this.initData();
      this.getTransactionRecord();
    },
    async openModalBill(data) {
      this.propChild = data;
      // if (this.propChild.gameType == '40000') {
      //   this.isOpenModalBill = true
      //   setTimeout(()=>{
      //     this.$refs.childMethod.getOneArmBandit()
      //   },0)
      // } else if (this.propChild.gameType == '30000') {
      //   this.isOpenModalBill = true
      //   setTimeout(()=>{
      //     this.$refs.childMethod.getRealLife()
      //   },0)
      // } else if (this.propChild.gameType == '50000') {
      //   this.isOpenModalBill = true
      //   setTimeout(()=>{
      //     this.$refs.childMethod.getRecordSLXY()
      //   },0)
      // }
      if (this.propChild.gameType == "1130000") {
        this.isOpenModalBill = true;
        setTimeout(() => {
          this.$refs.childMethod.getRealLife();
        }, 0);
      } else if (this.isRealLife) {
        this.isOpenModalBill = true;
        setTimeout(() => {
          this.$refs.childMethod.getRealLife();
        }, 0);
      } else if (data.gameType == "70000") {
        await this.getHfiveData(data.businessKey);
      } else if (data.gameType == "90000") {
        await this.getHfiveData(data.businessKey);
      } else {
        this.$Message.error("对不起，该游戏不支持查看战绩");
      }
    },
    getHfiveData(betId) {
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
    openModalRunning(data) {
      this.isOpenModalRunning = true;
      this.runningDetail = data;
    },
    
    getTransactionRecord() {
      this.isFetching = true;
      this.initTime();
      let name = localStorage.playerName;
      let [startTime, endTime] = this.amountDate;
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      let code = ''
        for (var val of this.gameTypeArr) {
          if (this.radioInfo == val.name) {
            code = val.code
          }
          if (this.radioInfo == '全部') {
            code = ''
          }
        }
      httpRequest("post", "/player/bill/detail", {
        userName: name,
        company: this.companyInfo == "全部厂商" ? "-1" : this.companyInfo,
        gameType: code,
        startTime: startTime,
        endTime: endTime,
        startKey: this.playerDetailStartKey,
        pageSize: this.pageSize,
        betId: this.betId
      }).then(result => {
        this.isLastMessage = result.list < this.pageSize;
        this.playerDetailList = result.list;
        this.balance = result.balance;
        this.playerDetailStartKey = result.startKey;
        this.playerDetailListStorage.length &&
          (this.playerDetailList = this.playerDetailListStorage.concat(
            this.playerDetailList
          ));
        this.isFetching = false;
      });
    },
    companySelectList() {
      agentOne(this.parentId).then(res => {      
        if (res.code == 0) {
          if (res.payload.level == 0) {
            this.gameCompanyArr = getGameType()
            this.gameTypeArr = getGameListEnum()
          } else {
            this.gameCompanyArr = res.payload.companyArr
            this.gameTypeArr = res.payload.gameList
          }
        }
      });
    }, //获取运营商列表
    changeCompany(val) {
      this.companyInfo = val;
      this.radioInfo = '';
      this.initData()
    },
    changeGameType(val) {
      this.radioInfo == undefined ? "全部" : val;
      this.initData()
      this.getTransactionRecord()
    },
    searchAmount() {
      this.initData();
      this.getTransactionRecord();
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
    resultGetPlayerDetail() {
      this.amountDate = []; // 处理时间不更新，列表页筛选不了最新数据问题
      this.initData();
      this.getTransactionRecord();
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
          : "https://d3prd6rbitzqm3.cloudfront.net";
      let [startTime, endTime] = this.amountDate;
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      window.open(
        `${url}/player/bill/detail/download?userName=${
          localStorage.playerName
        }&company=${this.companyInfo}&gameType=${
          this.radioInfo
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
  .-color {
    padding: 0 5px;
    color: #20a0ff;
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
