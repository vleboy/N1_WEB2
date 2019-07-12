<template>
  <div class="p-transaction">
    <div class="-p-header">
      <Row>
        <Col class="-p-h-bottom">
          <RadioGroup v-model="companyInfo" @on-change="changeCompany" type="button" size="small">
            <Radio v-for="(value,index) of getCompanyList" :key="index" :label="value">{{value}}</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <Row>
        <Col class="-p-h-bottom">
          <RadioGroup v-model="radioInfo" @on-change="changeRadio" type="button" size="small">
            <Radio v-for="(value,index) of gameTypeList" :key="index" :label="value">{{value}}</Radio>
          </RadioGroup>
        </Col>
      </Row>

      <div style="display:flex;justify-content:space-between">
        <div>
          <DatePicker
            v-model="amountDate"
            :options="options"
            type="datetimerange"
            :transfer="true"
            style="width: 300px"
            @on-ok="searchAmount"
            placeholder="选择日期时间范围"
            size="small"
          ></DatePicker>
        </div>
        <div style="display:flex;">
          <Input v-model="betId" :placeholder="$t('playerDetail.trade')" style="width: 12rem;margin-right:1rem" size="small"></Input>
          <Button type="primary" @click="searchAmount" size="small" style="margin:0 .3rem 0 0rem">{{$t('playerDetail.search')}}</Button>
          <Button @click="reset" size="small" style="margin-right:.3rem">{{$t('playerDetail.reset')}}</Button>
          <Button @click="exportData" size="small">{{$t('playerDetail.exportData')}}</Button>
        </div>
      </div>
    </div>

    <div class="-p-content">
      <Table :columns="columns" :data="dataList">
        <template slot-scope="{row, index}" slot="dateTime">
          <span>{{dateTimeConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="gameId">
          <span>{{gameIdConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="beSettleMoney">
          <span>{{beSettleMoneyConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operateMoney">
          <span>{{operateMoneyConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="retMoney">
          <span>{{retMoneyConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="profit">
          <span :style="{color:profitConfig(row).color}">{{profitConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="action">
          <Button v-if="actionConfig(row)" type="text" size="small" style="color:#20a0ff;" @click="record(row)">{{$t('playerDetail.look')}}</Button>
          <Button v-if="actionConfig(row)" type="text" size="small" style="color:#20a0ff;" @click="waterDetaill(row)">{{$t('playerDetail.running')}}</Button>
        </template>
      </Table>

      <Row style="padding: 20px 0">
        <Col span="12" class="g-text-right">
          <Row type="flex"> 
            <Col style="margin-right:1rem">
              {{$t('playerDetail.pageAmount')}}:
              <span>
                {{formatPoints(allBetAmountFun)}}
              </span>
            </Col>
            <Col>
              {{$t('playerDetail.pageWinlose')}}:
              <span :class="{'-p-green':this.allAmount>0,'-p-red':this.allAmount<0}">
                {{formatPoints(allAmountFun)}}
              </span>
            </Col>
          </Row>
          <Row type="flex">
            <Col style="margin-right:1rem">
              {{$t('playerDetail.total')}}:
              <span>
                {{formatPoints(playerBetAmount)}}
              </span>
            </Col>
            <Col style="margin-right:1rem">
              {{$t('playerDetail.effectiveAmount')}}:
              <span>
                {{formatPoints(playerMixAmount)}}
              </span>
            </Col>
            <Col>
              {{$t('playerDetail.totalAmount')}}:
              <span :class="{'-p-green':this.playerWinloseAmount>0,'-p-red':this.playerWinloseAmount<0}">
                {{formatPoints(playerWinloseAmount)}}
              </span>
            </Col>
          </Row>
        </Col>
        <Col span="12" style="text-align: right;font-size: 12px">
          <Page
            :total="playerDetailList.length"
            :page-size="20"
            :current.sync="currentPage"
            @on-change="getNowpage"
          ></Page>
        </Col>
      </Row>
    </div>

    <Modal :title="$t('playerDetail.recordDetail')" v-model="isOpenModalBill" class="g-text-center" width="940" cancel-text>
      <!--<OneArmBanditModal ref="childMethod" v-if="propChild.gameType =='40000'" :dataProp="propChild"></OneArmBanditModal>-->
      <RealLifeModal ref="childMethod" v-if="isRealLife" :dataProp="propChild"></RealLifeModal>
      <!--<ArcadeModal ref="childMethod" v-if="propChild.gameType =='50000'" :dataProp="propChild"></ArcadeModal>-->
      <sportsModal ref="childMethod" v-if="propChild.gameType =='1130000'" :dataProp="propChild"></sportsModal>
    </Modal>
    <Modal :title="$t('playerDetail.h5RecordDetail')" v-model="naHfive" class="g-text-center" width="500">
      <secreat-modal v-if="mystical" :hProp="hProp" v-on:loading="Load" :fudai="fudai"/>
      <hfive-modal v-if="nomalType" v-on:loading="Load" :dataProp="hProp"/>
    </Modal>
    <Modal :title="$t('playerDetail.running')" v-model="isOpenModalRunning" class="g-text-center" width="800" cancel-text>
      <oneRunningAccount :dataProp="runningDetail"></oneRunningAccount>
    </Modal>

    <Spin size="large" fix v-if="isFetching">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div>{{$t('playerDetail.loading')}}</div>
    </Spin>
  </div>
</template>

<script type="text/ecmascript-6">
import { thousandFormatter } from "@/config/format";
import dayjs from "dayjs";
import { httpRequest } from "@/service/index";
import { getCNGameType, getENGameType } from "@/config/getGameType";
import RealLifeModal from "@/components/record/realLifeModal";
import oneRunningAccount from "@/components/player/oneRunningAccount";
import SportsModal from "@/components/record/sportsModal";
import HfiveModal from "@/components/player/HfiveModal";
import SecreatModal from "@/components/player/SecreatModal";

export default {
  components: {
    oneRunningAccount,
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
      },
      mystical: false,
      nomalType: false,
      fudai: false,
      hProp: {
        gameId: 70010,
        betId: "",
        betAmount: 0,
        winloseAmount: 0,
        roundResult: {
          userInfo: {},
          viewGrid: [],
          winGrid: []
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
      isOpenModalRunning: false,
      radioInfo: "全部",
      amountDate: [],
      companyList: [],
      companyInfo: "全部厂商",
      playerDetailList: [],
      playerDetailListStorage: [],
      playerDetailStartKey: "",
      // balance: '',
      betId: "",
      propChild: {},
      runningDetail: {},
      playerBetAmount: '',
      playerMixAmount: '',
      playerWinloseAmount: '',
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
        "90018": "鲤跃龙门"
      },
      removeArr: ['NA棋牌游戏', 'NA捕鱼游戏', 'NA街机游戏', 'NA真人游戏','NA电子游戏', 'NA真人视讯'],//移除的权限
      columns: [
        {
          title: "交易号",
          key: "businessKey",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易号' : 'Transaction ID'
            )
          }
        },
        {
          title: "交易时间",
          slot: "dateTime",
          width: 160,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易时间' : 'Transaction Time'
            )
          }
        },
        {
          title: "游戏类型",
          align: 'center',
          key: "typeName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '游戏类型' : 'Game Type'
            )
          }
        },
        {
          title: "游戏ID",
          align: 'center',
          slot: "gameId",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '游戏ID' : 'Game ID'
            )
          }
        },
        {
          title: "结算前余额",
          slot: "beSettleMoney",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '结算前余额' : 'Pre Balance'
            )
          }
        },
        {
          title: "操作金额",
          slot: "operateMoney",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作金额' : 'Operation Amount'
            )
          }
        },
        {
          title: "返还金额",
          slot: "retMoney",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '返还金额' : 'Return Amount'
            )
          }
        },
        {
          title: "净利润",
          slot: "profit",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '净利润' : 'Profit'
            )
          }
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作' : 'Operation'
            )
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
    allBetAmountFun() {
      this.allBetAmount = 0;
      for (let item of this.dataList) {
        if (item.gameType != "2") {
          this.allBetAmount = item.betAmount + this.allBetAmount;
        }
      }
      return this.allBetAmount;
    },
    getCompanyList() {

       let arr = JSON.parse(localStorage.getItem("userInfo")).gameList.map(
        item => {
          return item;
        }
      )

      for (let i = 0; i < this.removeArr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (this.removeArr[i] == arr[j].name) {
            arr.splice(j,1)
          }
        }
      }  

      let gameList = Array.from(new Set(arr.map(item => {return item.company})))

      for (let i =0; i<gameList.length; i++) {
          if (gameList[i] == 'NA') {
            gameList.splice(i, 1)
          }
        }  
        
      gameList.unshift('NA')



      if (this.$store.state.language == "zh") {
        gameList.unshift("全部厂商");
        //this.companyInfo == "全部厂商"
      } else {
        gameList.unshift("All");
        //this.companyInfo == 'All manufacturers'
      }

      return gameList 

      /* let arr = Array.from(
        new Set(
          JSON.parse(localStorage.getItem("userInfo")).gameList.map(item => {
            return item.company;
          })
        )
      );
      arr.unshift("全部厂商");
      return arr; */
    },
    gameTypeList() {
      let gameType = [];
      let arr = [];
      let val = JSON.parse(localStorage.getItem("userInfo")).gameList;
      if (this.$store.state.language == "zh") {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < getCNGameType().length; j++) {
            if (val[i].code == getCNGameType()[j].code) {
              arr.push(getCNGameType()[j]);
            }
          }
        }

        if (
          this.companyInfo == "全部厂商" ||
          this.companyInfo == "All"
        ) {
          gameType = arr.map(item => {
            return item.name;
          });
        } else {
          arr.map(item => {
            if (this.companyInfo == item.company) {
              gameType.push(item.name);
            }
          });
        }
        gameType.unshift("全部");
        return gameType;
      } else {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < getENGameType().length; j++) {
            if (val[i].code == getENGameType()[j].code) {
              arr.push(getENGameType()[j]);
            }
          }
        }

        if (this.companyInfo == "All") {
          gameType = arr.map(item => {
            return item.name;
          });
        } else {
          arr.map(item => {
            if (this.companyInfo == item.company) {
              gameType.push(item.name);
            }
          });
        }
        gameType.unshift("All");
        return gameType;
      }

      return gameType;
    }  
  },
  mounted() {
    if (this.$store.state.language == "zh") {
        this.companyInfo = "全部厂商";
        this.radioInfo = "全部";
      } else {
        this.companyInfo = "All";
        this.radioInfo = "All";
      }
    this.getTransactionRecord();

  },
  methods: {
    //日期
    dateTimeConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
     //游戏ID
    gameIdConfig(row) {
      if (this.GameNameEnum[row.gameId]) {
        return `${row.gameId}(${this.GameNameEnum[row.gameId]})`
      } else {
        return row.gameId
      }
    },
    //结算前金额
    beSettleMoneyConfig(row) {
      return thousandFormatter(row.originalAmount)
    },
    //操作金额
    operateMoneyConfig(row) {
      return thousandFormatter(row.betAmount)
    },
    //返还金额
    retMoneyConfig(row) {
      return thousandFormatter(row.retAmount)
    },
    //净利润
    profitConfig(row) {
      if (row.profitAmount >= 0) {
        return {amount: thousandFormatter(row.profitAmount), color: 'green'}
      } else {
        return {amount: thousandFormatter(row.profitAmount), color: 'red'}
      }    
    },
    //操作
    actionConfig(row) {
      if (row.gameType != 1 && row.gameType != 2 && row.gameType != 3) {
        return true
      } else {
        return false
      }   
    },
    record(row) {
      this.mystical = false
      this.fudai = false
      this.nomalType = false
      this.openModalBill(row)
    },
    waterDetaill(row) {
      this.openModalRunning(row);
    },
    reset() {
      console.log(123);
      
      if (this.$store.state.language == "zh") {
        this.companyInfo = "全部厂商";
        this.radioInfo = "全部";
      } else {
        this.companyInfo = "All";
        this.radioInfo = "All";
      }
      this.startKey = ''
      this.betId = ''
      this.amountDate = [new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()]
      this.initData()
      this.changeRadio()
    },
    getNowpage(page) {
      this.nowPage = page;
      if (
        page == Math.ceil(this.playerDetailList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage &&
        this.playerDetailList.length >=100
      ) {
        this.playerDetailListStorage = JSON.parse(
          JSON.stringify(this.playerDetailList)
        );
        this.getTransactionRecord();
      }
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
        await this.getHfiveData(data.businessKey);
      } else if (data.gameType == "90000") {
        await this.getHfiveData(data.businessKey);
      } else {
        this.$Message.error("对不起，该游戏不支持查看战绩");
      }
    },
    getHfiveData(betId) {
      httpRequest("post", "/player/bill/record", {
        userName: localStorage.playerName,
        betId
      }).then(res => {
        let mode = res.data.mode;
        if (mode == "Secret Bonus") {
          this.mystical = true;
        } else if (mode == "FuDai Game") {
          this.mystical = true;
          this.fudai = true;
        } else {
          this.nomalType = true;
        }
        this.hProp = res.data;
        this.naHfive = true;
      });
    },
    Load() {
      this.$store.commit("globalLoading", { params: true });
      setTimeout(() => {
        this.$store.commit("globalLoading", { params: false });
      }, 500);
    },
    openModalRunning(data) {
      this.isOpenModalRunning = true;
      this.runningDetail = data;
    },
    changeRadio(val) {
      this.radioInfo == undefined ? '全部' : val;
      this.initData()
      this.getTransactionRecord();
    },
    getTransactionRecord() {
      if (this.isFetching) return;
      this.isFetching = true;
      this.initTime();
      let code = "";
      let company = "";
      if (this.$store.state.language == "zh") {
        getCNGameType().map(item => {
          if (this.radioInfo == item.name) {
            code = item.code;
            return;
          }
        });
        company = this.companyInfo == "全部厂商" ? "-1" : this.companyInfo;
      } else {
        getENGameType().map(item => {
          if (this.radioInfo == item.name) {
            code = item.code;
            return;
          }
        });
      
        
        company = this.companyInfo == "All" ? "-1" : this.companyInfo;

      
        
      }
      let name = localStorage.playerName;

      this.amountDate[0] = this.amountDate[0] > new Date() ? new Date() : this.amountDate[0]
      this.amountDate[1] = this.amountDate[1] > new Date() ? new Date() : this.amountDate[1]

      let [startTime, endTime] = this.amountDate;
      startTime = new Date(startTime).getTime();
      endTime = new Date(endTime).getTime();
      httpRequest("post", "/player/bill/detail", {
        userName: name,
        company: company,
        gameType: code,
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


      httpRequest("post", "/querySinglePlayerStat",{
        userName: name,
        company: company,
        gameType: code,
        startTime: startTime,
        endTime: endTime,
      }).then(res => {
        
        this.playerBetAmount = res.payload[0].betAmount
        this.playerMixAmount = res.payload[0].mixAmount
        this.playerWinloseAmount = res.payload[0].winloseAmount

      })
    },
 //获取运营商列表
    changeCompany(val) {
      this.radioInfo = null
      this.companyInfo = val;
      this.initData()
    },
    searchAmount() {
      this.initData();
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
    resultGetPlayerDetail() {
      this.amountDate = []; // 处理时间不更新，列表页筛选不了最新数据问题
      this.initData();
      this.changeRadio();
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
          this.radioInfo
        }&startTime=${startTime}&endTime=${endTime}`
      );
    }
  },
  watch: {
    "$store.state.language": function() {
      if (this.$route.name == "playDetail") {
        this.reset();
      }
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
  /deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
</style>
