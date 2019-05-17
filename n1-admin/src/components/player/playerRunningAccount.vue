$
<template>
  <div class="p-playerAccount">
    <div class="-p-base">
      <Row style="margin-bottom: 1rem">
        <div class="from-search">
          <RadioGroup v-model="companyInfo" type="button" @on-change="changeCompany" size="small">
            <Radio
              v-for="(item,index) of companyList"
              :key="index"
              :label="item.company"
            >{{item.company}}</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          <RadioGroup v-model="radioInfo" type="button" size="small" @on-change="changeGameType">
            <Radio
              v-for="(item,index) of getGameTypeList"
              :key="index"
              :label="item.code"
            >{{item.name}}</Radio>
          </RadioGroup>
        </div>
      </Row>
      <Row class="-b-form">
        <Col span="12">
          <DatePicker
            :editable="false"
            :transfer="true"
            v-model="amountDate"
            type="datetimerange"
            :options="options"
            @on-change="changeDate"
            placeholder="选择日期范围"
            style="width: 300px"
            size="small"
          ></DatePicker>
        </Col>
        <Col span="12" class="text-right fr">
          <div style="margin-right:1rem;width: 50rem;">
            <Input v-model="sn" placeholder="请输入流水号" size="small"></Input>
          </div>
          <div style="margin-right:.5rem;width: 50rem;">
            <Input v-model="betId" placeholder="请输入交易号" size="small"></Input>
          </div>
          <Button @click="isShowSearch = !isShowSearch" type="text" size="small">
            高级筛选
            <Icon type="arrow-down-b" v-if="!isShowSearch"></Icon>
            <Icon type="arrow-up-b" v-else></Icon>
          </Button>
          <Button type="primary" @click="searchData(true)" style="margin-right:.3rem" size="small">搜索</Button>
          <Button @click="reset" style="margin-right:.3rem" size="small">重置</Button>
          <Button type="primary" @click="exportData" size="small">导出数据</Button>
        </Col>
      </Row>
      <Row v-if="isShowSearch" class="adFilter">
        <div class="from-search" style="margin-right:2rem">
          类型：
          <RadioGroup v-model="radioType" type="button">
            <Radio label>全部</Radio>
            <Radio label="3">下注</Radio>
            <Radio label="11">中心钱包</Radio>
            <Radio label="4">返奖</Radio>
            <Radio label="5">返还</Radio>
            <Radio label="6">冻结</Radio>
            <Radio label="13">商城</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          资金流向：
          <RadioGroup v-model="radioMoney" type="button">
            <Radio label>全部</Radio>
            <Radio label="1">本次发生金额（入）</Radio>
            <Radio label="-1">本次发生金额（出）</Radio>
          </RadioGroup>
        </div>
      </Row>
    </div>
    <div class="-p-table">
      <div class="-t-form">

        <Table :columns="columns" :data="dataList" size="small">
          <template slot-scope="{row, index}" slot="dateTime">
            <span>{{dateTimeConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="gameId">
            <span>{{gameIdConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="tradeType">
            <span>{{tradeTypeConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="oldBalance">
            <span>{{oldBalanceConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="balance">
            <span :style="{color:balanceConfig(row).color}">{{balanceConfig(row).amount}}</span>
          </template>
          <template slot-scope="{row, index}" slot="newBalance">
            <span>{{newBalanceConfig(row)}}</span>
          </template>
          <template slot-scope="{row, index}" slot="operate">
            <Button v-if="operateState(row)" type="text" size="small" style="color:#20a0ff" @click="operateConfig(row)">查看战绩</Button>
          </template>
        </Table>



        <Row style="padding: 20px 0">
          <Col span="24" class="text-right">
            <Page
              :total="playerAccountList.length"
              show-elevator
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
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatUserName, thousandFormatter } from "@/config/format";
import { getGameListEnum } from "@/config/getGameType";
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
import SportsModal from "@/components/record/sportsModal";

export default {
  components: { SportsModal },
  data() {
    return {
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
      gameListItem: [],
      selType: "全部厂商",
      
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
      amountDate: [], // 时间日期选择
      playerAccountList: [], // 玩家流水账列表
      playerRecordList: [], // 玩家战绩列表
      playerAccountListStorage: [],
      playerAccountListStartKey: "",
      columns: [
        {
          title: "流水号",
          key: "sn",
          align: "center",
          width: 140
        },
        {
          title: "交易号",
          align: "center",
          key: "businessKey",
          width: 130
        },
        {
          title: "日期",
          align: "center",
          slot: "dateTime",
          width: 155
        },
        {
          title: "游戏类型",
          align: "center",
          key: "gameName"
        },
        {
          title: "游戏ID",
          align: "center",
          slot: "gameId"
        },
        {
          title: "交易类型",
          align: "center",
          slot: "tradeType"
        },
        {
          title: "帐变前金额",
          align: "center",
          slot: "oldBalance"
        },
        {
          title: "帐变金额",
          align: "center",
          slot: "balance"
        },
        {
          title: "帐变后金额",
          align: "center",
          slot: "newBalance"
        },
        {
          title: "操作",
          key: "operate",
          width: 90,
          align: "center"
        }
      ],
      companyList: [
        { company: "全部厂商" },
        { company: "NA" },
        { company: "MG" },
        { company: "KY" },
        { company: "DT" },
        { company: "RTG" },
        { company: "PP" },
        { company: "PG" },
        { company: "PNG" },
        { company: "TTG" },
        { company: "HABA" },
        { company: "AG" },
        { company: "SA" },
        { company: "SB" },
        { company: "YSB" }
      ],
      gameTypeList: [],
      radioInfo: "",
      companyInfo: "全部厂商",
      propChild: {},
      isOpenModalBill: false
    };
  },
  mounted() {
    this.changeTime();
    /* this.companySelectList(); */
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
    getGameTypeList() {
     
      
      return getGameListEnum()[
        this.selType == "全部厂商" ? "All" : this.selType
      ];
    }
  },
  methods: {
    //日期
    dateTimeConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    //游戏ID
    gameIdConfig(row) {
      return this.GameNameEnum[row.gameId] ? `${row.gameId}(${this.GameNameEnum[row.gameId]})` : row.gameId 
    },
    //交易类型
    tradeTypeConfig(row) {
      return this.typeList[row.type]
    },
    //帐变前金额
    oldBalanceConfig(row) {
      return thousandFormatter(row.originalAmount)    
    },
    //帐变金额
    balanceConfig(row) {
      let color = row.amount >= 0 ? "green" : "red"
      return {amount: thousandFormatter(row.amount), color}      
    },
    //账变后金额      
    newBalanceConfig(row) {
      return thousandFormatter(row.balance) 
    }, 
    //操作
    operateState(row) {
      return row.type == "3" && row.gameType == "1130000" ? true : false
    },
    operateConfig(row) {
      this.openModalBill(params.row);
    },









    reset() {
      this.companyInfo = '全部厂商'
      this.selType = 'All'
      this.betId = ''
      this.sn = ''
      this.radioType = ''
      this.radioMoney = ''
      this.amountDate = [new Date().getTime() - 3600 * 1000 * 24 * 6, new Date()];
      this.changeGameType()
    },
    getNowpage(page) {
      this.nowPage = page;
      if (
        page == Math.ceil(this.playerAccountList.length / this.nowSize) &&
        !this.isFetching &&
        page != 1 &&
        !this.isLastMessage
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

      httpRequest("post", "/player/bill/flow", {
        userName: localStorage.playerName,
        type: this.radioType,
        company: this.companyInfo == "全部厂商" ? "-1" : this.companyInfo,
        gameType: this.radioInfo,
        action: this.radioMoney,
        startTime: this.amountDate ? this.startDate : "",
        endTime: this.amountDate ? this.endDate : "",
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
    changeTime() {
      const end = new Date();
      const start = new Date();
      if (this.radioTime) {
        this.monthDate = "";
      }
      switch (+this.radioTime) {
        case 1:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
          this.amountDate = [start, end];
          this.changeDate();
          break;
        case 2:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
          this.amountDate = [start, end];
          this.changeDate();
          break;
        case 3:
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
          this.amountDate = [start, end];
          this.changeDate();
          break;
      }
    }, // 最近的时间快捷选择联动
    changeDate() {
      if (this.amountDate) {
        // this.startDate = new Date(this.amountDate[0].setMonth(this.amountDate[0].getMonth())).setHours(0, 0, 0, 0);
        // this.endDate = new Date(this.amountDate[1].setMonth(this.amountDate[1].getMonth())).setHours(0, 0, 0, 0) + 24 * 3600 * 1000 - 1;
        this.startDate = new Date(this.amountDate[0]).getTime();
        this.endDate = new Date(this.amountDate[1]).getTime();
      } else {
        this.radioTime = "";
        this.monthDate = "";
      }
      this.initData();
      this.changeGameType();
    }, //日期改变联动
    changeMonth(date) {
      if (date && this.monthDate) {
        const month = new Date(date);
        const startDay = new Date(month.setMonth(month.getMonth(), 1));
        const endDay = new Date(month.setMonth(month.getMonth() + 1, 0));
        this.amountDate = [startDay, endDay];
        this.radioTime = "";
        this.changeDate();
      }
    }, // 月份联动
    changeGameType(val) {
      this.radioInfo = val;
      this.playerAccountListStartKey = ''
      this.getPlayerAccount();
    },
    searchData(bool) {
      if (!bool) {
        this.companyInfo = "全部厂商";
        this.radioMoney = "";
        this.radioType = "";
        this.sn = "";
        this.betId = "";
      }
      this.initData();
      this.changeGameType();
    }, // 重置筛选条件
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
    //获取运营商列表
    changeCompany(val) {
      this.selType = val;
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
    $route: function(_new, _old) {
      if (
        _new.name == "playDetail" &&
        localStorage.playerName != this.playerAccountUserName
      ) {
        this.initData();
        this.changeGameType();
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
.adFilter {
  display: flex;
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
  .-p-green {
    color: #00cc00;
  }
  .-p-red {
    color: #ff3300;
  }
  .text-right {
    text-align: right;
  }
  .fr {
    display: flex;
    justify-content: flex-end;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
