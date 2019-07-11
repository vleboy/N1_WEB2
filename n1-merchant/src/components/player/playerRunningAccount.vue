$
<template>
  <div class="p-playerAccount">
    <div class="from-search" style="margin-bottom:1rem">
      <!-- 厂商：-->
      <RadioGroup v-model="companyInfo" type="button" size="small" @on-change="changeCompany">
        <Radio v-for="(value,index) of getCompanyList" :key="index" :label="value">{{value}}</Radio>
      </RadioGroup>
    </div>
    <div class="from-search" style="margin-bottom:1rem">
      <!-- 游戏： -->
      <RadioGroup v-model="radioInfo" type="button" size="small" @on-change="changeGameType">
        <Radio v-for="(value,index) of gameTypeList" :key="index" :label="value">{{value}}</Radio>
      </RadioGroup>
    </div>

    <div class="-p-base">
      <Row class="-b-form">
        <Col class="text-right" style="display:flex;justify-content:space-between">
          <div>
            <DatePicker
              :editable="false"
              :transfer="true"
              :options="options"
              v-model="amountDate"
              type="datetimerange"
              @on-change="changeDate"
              placeholder="选择日期范围"
              style="width: 300px"
              size="small"
              @on-ok="getDate"
            ></DatePicker>
          </div>
          <div style="display:flex;">
            <div style="margin-right:1rem;width: 12rem;">
              <Input v-model="sn" :placeholder="$t('playerDetail.flow')" size="small"></Input>
            </div>
            <div style="margin-right:1rem;width: 12rem;">
              <Input v-model="betId" :placeholder="$t('playerDetail.trade')" size="small"></Input>
            </div>

            <Button @click="isShowSearch = !isShowSearch" type="text" size="small">
              {{$t('playerDetail.screening')}}
              <Icon type="arrow-down-b" v-if="!isShowSearch"></Icon>
              <Icon type="arrow-up-b" v-else></Icon>
            </Button>
            <Button
              @click="searchData"
              style="margin-right:.3rem"
              size="small"
              type="primary"
            >{{$t('playerDetail.search')}}</Button>
            <Button
              @click="reset()"
              style="margin-right:.3rem"
              size="small"
            >{{$t('playerDetail.reset')}}</Button>
            <Button @click="exportData" size="small">{{$t('playerDetail.exportData')}}</Button>
          </div>
        </Col>
      </Row>
      <Row v-if="isShowSearch">
        <div class="from-search">
          {{$t('playerDetail.type')}}
          <RadioGroup v-model="radioType" type="button" size="small">
            <Radio label>{{$t('playerDetail.all')}}</Radio>
            <Radio label="3">{{$t('playerDetail.bets')}}</Radio>
            <Radio label="11">{{$t('playerDetail.centralWallet')}}</Radio>
            <Radio label="4">{{$t('playerDetail.returnPrize')}}</Radio>
            <Radio label="5">{{$t('playerDetail.return')}}</Radio>
            <Radio label="6">{{$t('playerDetail.frozen')}}</Radio>
            <Radio label="13">{{$t('playerDetail.shoppingMall')}}</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          {{$t('playerDetail.moneyFlow')}}
          <RadioGroup v-model="radioMoney" type="button" size="small">
            <Radio label>{{$t('playerDetail.all')}}</Radio>
            <Radio label="1">{{$t('playerDetail.thisEnter')}}</Radio>
            <Radio label="-1">{{$t('playerDetail.thisout')}}</Radio>
          </RadioGroup>
        </div>
      </Row>
    </div>

    <div class="-p-table">
      <div class="-t-form">
        <Table :columns="columns" :data="dataList">
          <template slot-scope="{row, index}" slot="dateTime">
            <span>{{dateTimeConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="gameId">
            <span>{{gameIdConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="msn">
            <span>{{msnConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="originalAmount">
            <span>{{originalAmountConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="amount">
            <span :style="{color:amountConfig(row).color}">{{amountConfig(row).amount}}</span>
          </template>
          <template slot-scope="{row, index}" slot="afterAmount">
            <span>{{afterAmountConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="action">
            <Button
              v-if="actionConfig(row)"
              type="text"
              size="small"
              style="color:#20a0ff;marginRight:5px"
              @click="record(row)"
            ></Button>
            <span v-else></span>
          </template>
        </Table>
        <Row style="padding: 20px 0">
          <Col span="24" class="text-right">
            <Page
              :total="playerAccountList.length"
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"
            ></Page>
          </Col>
        </Row>
      </div>
    </div>

    <Modal title="战绩详细" v-model="isOpenModalBill" class="g-text-center" width="800" cancel-text>
      <SportsModal ref="childMethod" v-if="propChild.gameType =='1130000'" :dataProp="propChild"></SportsModal>
    </Modal>
    <Spin size="large" fix v-if="isFetching">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatUserName, thousandFormatter } from "@/config/format";
import { getCNGameType, getENGameType } from "@/config/getGameType";
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
import SportsModal from "@/components/record/sportsModal";
import _ from "lodash";

export default {
  components: { SportsModal },
  data() {
    return {
      options: {
        shortcuts: [
          {
            text: this.$store.state.language == "zh" ? "本周" : "This week",
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
            text: this.$store.state.language == "zh" ? "本月" : "This month",
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
            text: this.$store.state.language == "zh" ? "本周" : "Last week",
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
            text: this.$store.state.language == "zh" ? "上月" : "Last month",
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
      nowSize: 20,
      nowPage: 1,
      pageSize: 100,
      radioTime: "1",
      radioMoney: "",
      currentPage: 1,
      radioType: "",
      monthDate: "", // 月份快捷选择
      startDate: "", // 开始时间搓
      endDate: "", // 结束时间搓
      betId: "", // 交易号
      sn: "", // 流水号
      allAmount: 0,
      isShowSearch: false,
      isFetching: false,
      isLastMessage: false, // 主要判断是否是后台返回最后一次信息
      typeList: {
        "3": "下注",
        "4": "返奖",
        "5": "返还",
        "6": "冻结",
        "10": "系统升级原账结余",
        "11": "中心钱包",
        "12": "代理操作",
        "13": "商城"
      },
      removeArr: [
        "NA棋牌游戏",
        "NA捕鱼游戏",
        "NA街机游戏",
        "NA真人游戏",
        "NA电子游戏",
        "NA真人视讯"
      ],

      amountDate: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 6),
        new Date()
      ], // 时间日期选择
      playerAccountList: [], // 玩家流水账列表
      playerRecordList: [], // 玩家战绩列表
      playerAccountListStorage: [],
      playerAccountListStartKey: "",
      columns: [
        {
          title: "流水号",
          key: "sn",
          align: "center",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "流水号" : "Pipeline number"
            );
          }
        },
        {
          title: "交易号",
          align: "center",
          key: "businessKey",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "交易号" : "Trading number"
            );
          }
        },
        {
          title: "日期",
          align: "center",
          slot: "dateTime",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "日期" : "Date"
            );
          }
        },
        {
          title: "游戏类型",
          align: "center",
          key: "gameName",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "游戏类型" : "Game type"
            );
          }
        },
        {
          title: "游戏ID",
          align: "center",
          slot: "gameId",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "游戏ID" : "Game ID"
            );
          }
        },
        {
          title: "交易类型",
          align: "center",
          slot: "msn",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "交易类型" : "Trading type"
            );
          }
        },
        {
          title: "帐变前余额",
          align: "center",
          slot: "originalAmount",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh"
                ? "帐变前余额"
                : "Pre-account balance"
            );
          }
        },
        {
          title: "帐变金额",
          align: "center",
          slot: "amount",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh"
                ? "帐变金额"
                : "Account balance"
            );
          }
        },
        {
          title: "帐变后金额",
          align: "center",
          slot: "afterAmount",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh"
                ? "帐变后金额"
                : "After account Change"
            );
          }
        },
        {
          title: "操作",
          slot: "action",
          align: "center",
          renderHeader: (h, params) => {
            return h(
              "span",
              this.$store.state.language == "zh" ? "操作" : "Operate"
            );
          }
        }
      ],
      radioInfo: "全部",
      companyInfo: "全部厂商",
      propChild: {},
      isOpenModalBill: false
    };
  },
  mounted() {
    this.searchData();
  },
  computed: {
    dataList() {
      if (this.nowPage === 1) {
        return this.playerAccountList.slice(0, this.nowSize);
      } else {
        return this.playerAccountList.slice(
          (this.nowPage - 1) * this.nowSize,
          this.nowSize * this.nowPage
        );
      }
    },
    userName() {
      return formatUserName(localStorage.playerName);
    },
    formatNum() {
      this.allAmount = 0;
      for (let item of this.playerAccountList) {
        this.allAmount += Number(item.amount);
      }
      return thousandFormatter(this.allAmount);
    },
    //获取游戏厂商
    getCompanyList() {
      let arr = JSON.parse(localStorage.getItem("userInfo")).gameList.map(
        item => {
          return item;
        }
      );

      for (let i = 0; i < this.removeArr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (this.removeArr[i] == arr[j].name) {
            arr.splice(j, 1);
          }
        }
      }

      let gameList = Array.from(
        new Set(
          arr.map(item => {
            return item.company;
          })
        )
      );

      for (let i = 0; i < gameList.length; i++) {
        if (gameList[i] == "NA") {
          gameList.splice(i, 1);
        }
      }
      gameList.unshift("NA");
      if (this.$store.state.language == "zh") {
        gameList.unshift("全部厂商");
        //this.companyInfo == "全部厂商"
      } else {
        gameList.unshift("All manufacturers");
        //this.companyInfo == 'All manufacturers'
      }

      return gameList;
    },
    //获取游戏列表
    gameTypeList() {
      /* let arr = JSON.parse(localStorage.getItem("userInfo")).gameList.map(
          item => {
            return item;
          }
        );
        
        for (let i = 0; i < this.removeArr.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (this.removeArr[i] == arr[j].name) {
              arr.splice(j, 1);
            }
          }
        }
        
        
        let gameType = [];
        if (this.sel == "全部厂商") {
          gameType = arr.map(item => {
            return item.name;
          });
        } else {
          arr.map(item => {
            if (this.sel == item.company) {
              gameType.push(item.name);
            }
          });
        }

        for (let i = 0; i < gameType.length; i++) {
          if (gameType[i] == "H5电子游戏") {
            gameType.splice(i, 1);
            gameType.unshift("H5电子游戏");
          }
          if (gameType[i] == "H5电子-无神秘奖游戏") {
            gameType.splice(i, 1);
            gameType.unshift("H5电子-无神秘奖游戏");
          }
        }

        gameType.unshift("全部");
        //this.radioInfo = '全部'
        
        return gameType;
    } */
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
          this.companyInfo == "All manufacturers"
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

        if (this.companyInfo == "All manufacturers") {
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
  methods: {
    //日期
    dateTimeConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    },
    //游戏ID
    gameIdConfig(row) {
      let GameNameEnum = {
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
      };
      if (GameNameEnum[row.gameId]) {
        return `${row.gameId}(${GameNameEnum[row.gameId]})`;
      } else {
        return row.gameId;
      }
    },
    //交易类型
    msnConfig(row) {
      return this.typeList[row.type];
    },
    //帐变前余额
    originalAmountConfig(row) {
      return thousandFormatter(row.originalAmount);
    },
    //帐变金额
    amountConfig(row) {
      if (row.amount >= 0) {
        return { amount: thousandFormatter(row.amount), color: "green" };
      } else {
        return { amount: thousandFormatter(row.amount), color: "red" };
      }
    },
    //账变后余额
    afterAmountConfig(row) {
      return thousandFormatter(row.balance);
    },
    //操作
    actionConfig(row) {
      if (row.type == "3" && row.gameType == "1130000") {
        return true;
      } else {
        return false;
      }
    },
    record(row) {
      if (row.type == "3" && row.gameType == "1130000") {
        this.openModalBill(row);
      }
    },
    reset() {
      if (this.$store.state.language == "zh") {
        this.companyInfo = "全部厂商";
        this.radioInfo = "全部";
      } else {
        this.companyInfo = "All manufacturers";
        this.radioInfo = "All";
      }
      this.betId = "";
      this.sn = "";
      this.radioType = "";
      this.radioMoney = "";
      this.amountDate = [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 6),
        new Date()
      ];
      this.initData();
      this.getPlayerAccount();
    },
    getNowpage(page) {
      this.nowPage = page;
      if (
        page == Math.ceil(this.playerAccountList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage &&
        this.playerAccountList.length >= 100
      ) {
        this.playerAccountListStorage = JSON.parse(
          JSON.stringify(this.playerAccountList)
        );
        this.getPlayerAccount();
      }
    },
    getPlayerAccount() {
      if (this.isFetching) return;
      this.isFetching = true;
      let code = "";

      let company = "";
      if (this.$store.state.language == "zh") {
        getCNGameType().map(item => {
          if (this.radioInfo == item.name) {
            code = item.code;
            return;
          }
        });
        company = company == "全部厂商" ? "-1" : this.companyInfo;
      } else {
        getENGameType().map(item => {
          if (this.radioInfo == item.name) {
            code = item.code;
            return;
          }
        });
        company = company == "All manufacturers" ? "-1" : this.companyInfo;
      }

      httpRequest("post", "/player/bill/flow", {
        userName: localStorage.playerName,
        type: this.radioType,
        action: this.radioMoney,
        company: company,
        gameType: code,
        startTime: this.amountDate[0].getTime(),
        endTime: this.amountDate[1].getTime(),
        startKey: this.playerAccountListStartKey,
        pageSize: this.pageSize,
        sn: this.sn,
        betId: this.betId
      })
        .then(result => {
          this.isLastMessage = result.list < this.pageSize;
          this.playerAccountList = result.list;
          this.playerAccountListStartKey = result.startKey;
          this.playerAccountUserName = result.userName;
          this.playerAccountListStorage.length &&
            (this.playerAccountList = this.playerAccountListStorage.concat(
              this.playerAccountList
            ));
        })
        .finally(() => {
          this.isFetching = false;
        });
    },
    // 最近的时间快捷选择联动
    changeDate() {
      if (this.amountDate) {
        this.startDate = new Date(this.amountDate[0]).getTime();
        this.endDate = new Date(this.amountDate[1]).getTime();
      } else {
        this.radioTime = "";
        this.monthDate = "";
      }
      /*  */
    },
    //日期改变联动
    getDate() {
      this.initData();
      this.getPlayerAccount();
    },
    changeMonth(date) {
      if (date && this.monthDate) {
        const month = new Date(date);
        const startDay = new Date(month.setMonth(month.getMonth(), 1));
        const endDay = new Date(month.setMonth(month.getMonth() + 1, 0));
        this.amountDate = [startDay, endDay];
        this.radioTime = "";
        this.changeDate();
      }
    },
    changeGameType(val) {
      //(val);

      this.radioInfo == undefined ? "全部" : val;
      this.initData();
      this.getPlayerAccount();
    },
    // 月份联动
    selectionChange(val) {
      this.checkedArray = val;
      this.checkFormatNum = 0;
      for (let item of this.checkedArray) {
        this.checkFormatNum += Number(item.amount);
      }
      this.checkFormatNum = thousandFormatter(this.checkFormatNum);
    },
    //多选
    searchData() {
      this.initData();
      this.getPlayerAccount();
    },
    // 重置筛选条件
    initData() {
      this.currentPage = 1;
      this.nowPage = 1;
      this.playerAccountList = [];
      this.playerAccountListStorage = [];
      this.playerAccountListStartKey = "";
    },
    exportData() {
      let url =
        process.env.NODE_ENV == "production"
          ? "https://n1admin.na12345.com"
          : "https://d3rqtlfdd4m9wd.cloudfront.net";
      window.open(
        `${url}/player/bill/flow/download?userName=${
          localStorage.playerName
        }&type=${this.radioType}&action=${this.radioMoney}&startTime=${
          this.amountDate ? this.startDate : ""
        }&endTime=${this.amountDate ? this.endDate : ""}`
      );
    },
    changeCompany(val) {
      this.companyInfo = val;
      this.radioInfo = "";
      this.initData();
    },
    openModalBill(data) {
      this.propChild = data;
      this.isOpenModalBill = true;
      setTimeout(() => {
        this.$refs.childMethod.getRealLife();
      }, 0);
    }
  },
  watch: {
    $route: {
      handler: function(_new, _old) {
        if (
          _new.name == "playDetail" &&
          localStorage.playDetail == "playDetail"
        ) {
          this.amountDate = [];
          if (this.$route.query.type != undefined) {
            this.radioInfo = String(this.$route.query.type);

            if (this.radioInfo != "") {
              getGameType().map(item => {
                if (item.code == this.radioInfo) {
                  this.companyInfo = item.company;
                }
              });
            } else {
              this.companyInfo == "全部厂商";
            }
            JSON.parse(localStorage.getItem("userInfo")).gameList.map(item => {
              if (this.radioInfo == item.code) {
                this.radioInfo = item.name;
                return;
              }
            });
            let st = this.$route.query.time[0];
            let et = this.$route.query.time[1];
            this.amountDate = [new Date(st), new Date(et)];
          } else {
            this.amountDate = [
              new Date(new Date().getTime() - 3600 * 1000 * 24 * 6),
              new Date()
            ];
          }
          this.searchData();
        }
        localStorage.removeItem("playDetail");
      },
      immediate: true
    },
    "$store.state.language": function() {
      if (this.$route.name == "playDetail") {
        this.reset();
      }
    }
  },
  filter1s: {
    //过滤器，所有数字保留两位小数
    currency(value) {
      return (value - 0).toFixed(2);
    }
  }
};
</script>

<style scpoed type="text/less" lang="less">
/deep/ .ivu-btn-small {
  color: red;
}
/deep/.ivu-btn:hover {
  background: #000 !important;
  color: #fff !important;
}
.p-playerAccount {
  .-p-base {
    .-b-form {
      padding: 0;
      font-size: 0.8rem;
      overflow: hidden;
      margin-bottom: 10px;
    }

    .from-search {
      font-size: 0.8rem;
      margin-top: 10px;
      overflow: hidden;
    }

    .-search-input {
      display: inline-block;
      width: 50%;
    }

    .form-button {
      position: absolute;
      top: 78%;
      right: 0;
    }
  }

  .-p-total {
    margin-bottom: 10px;
    font-size: 16px;
  }

  .-p-table {
    padding: 6px 0 0 0;
    margin: 0 auto;
    vertical-align: baseline;

    .-t-form {
      padding: 0;
      font-size: 0.8rem;
      overflow: hidden;

      .total-all {
        background-color: #c2e7fd;
        padding: 10px;
        border-radius: 4px;
      }

      .total-check {
        background-color: #ffebbd;
        padding: 10px;
        border-radius: 4px;
      }
    }
  }
  h4 {
    font-size: 1.3rem;
    font-weight: normal;
    padding: 16px 0;
    color: #5a5a5a;
  }
  .text-right {
    text-align: right;
  }
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
/deep/ .ivu-picker-panel-shortcut {
  padding: 6px 5px;
}
</style>
