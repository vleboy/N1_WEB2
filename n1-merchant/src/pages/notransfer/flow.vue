<template>
  <div class="flow">
    <div class="top">
      <div class="search">
        <Row class="row">
          <Col span="13">
            <span class="label">玩家ID</span>
            <Input v-model="userId" style="width: 100px" placeholder="请输入" size="small"></Input>
            <span class="label" style="margin-left:1rem">交易号</span>
            <Input v-model="businessKey" style="width: 150px" placeholder="请输入" size="small"></Input>
          </Col>
          <Col span="11" style="textAlign:right">
            <DatePicker
              type="datetimerange"
              :options="options"
              :editable="false"
              v-model="defaultTime"
              placeholder="选择日期时间范围(默认最近一周)"
              style="width: 300px;margin-right:1rem"
              @on-ok="search"
              size="small"
            ></DatePicker>
            <Button @click="search" style="margin-right:.3rem" size="small">搜索</Button>
            <Button @click="reset" size="small">重置</Button>
          </Col>
        </Row>
      </div>
    </div>
    <Row class="row selection">
      <Col span="8">
        <RadioGroup
          v-model="reportType"
          type="button"
          :style="{paddingBottom:'10px'}"
          @on-change="search"
          size="small"
        >
          <Radio label="1">流水记录</Radio>
          <Radio label="2">交易记录</Radio>
        </RadioGroup>
        <Select v-model="gameType" style="width:110px" @on-change="search" size="small">
          <Option
            v-for="item in gameTypeList"
            :value="item.value"
            :key="item.value"
          >{{ item.label }}</Option>
        </Select>
        <Select
          v-model="status"
          style="width:90px"
          v-if="reportType=='1'"
          @on-change="search"
          size="small"
        >
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
    </Row>
    <Table
      :columns="columns"
      no-data-text="请输入查询条件"
      size="small"
      v-if="reportType==1"
      :data="dataList"
    >
      <template slot-scope="{row, index}" slot="amount">
        <span :style="{color:amountConfig(row)}">{{row.amount}}</span>
      </template>
      <template slot-scope="{row, index}" slot="type">
        <span>{{typeConfig(row)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="status">
        <span :style="{color:statusConfig(row).color}">{{status1Config(row).text}}</span>
      </template>
      <template slot-scope="{row, index}" slot="createdAt">
        <span>{{createdAtConfig(row)}}</span>
      </template>
    </Table>
    <Table :columns="columns1" no-data-text="请输入查询条件" size="small" v-else :data="dataList">
      <template slot-scope="{row, index}" slot="status1">
        <span :style="{color:status1Config(row).color}">{{status1Config(row).text}}</span>
      </template>
      <template slot-scope="{row, index}" slot="winloseAmount1">
        <span :style="{color:winloseAmount1Config(row)}">{{row.winloseAmount}}</span>
      </template>
      <template slot-scope="{row, index}" slot="operation1">
        <Button type="test" size="small" color="#20a0ff" @click="operation1Config(row)">详情</Button>
      </template>
    </Table>
    <Row class="count_row" v-if="reportType=='1'">
      <Col span="4">
        当页数据总输赢金额:
        <span class="num">{{flowAmount|format}}</span>
      </Col>
    </Row>
    <Row class="count_row" v-else>
      <Col span="4">
        当页数据总下注次数:
        <span class="num">{{allBetCount|format}}</span>
      </Col>
      <Col span="4">
        当页数据总下注金额:
        <span class="num">{{allBetAmount|format}}</span>
      </Col>
      <Col span="4">
        当页数据总返还金额:
        <span class="num">{{allRet|format}}</span>
      </Col>
      <Col span="4">
        当页数据总返奖金额:
        <span class="num">{{allWin|format}}</span>
      </Col>
      <Col span="4">
        当页数据总退款金额:
        <span class="num">{{allRefund|format}}</span>
      </Col>
      <Col span="4">
        当页数据总输赢金额:
        <span class="num">{{allWinLose|format}}</span>
      </Col>
    </Row>
    <Page
      :total="total"
      class="page"
      show-elevator
      :page-size="nowSize"
      :current.sync="currentPage"
      @on-change="changepage"
    ></Page>
    <Spin size="large" fix v-if="spin">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <Modal title="流水详情" v-model="isOpenModalRunning" class="g-text-center" width="800">
      <Row class="g-text-left" style="margin-bottom: 15px">
        <Col span="12">交易号：{{rowDetail.businessKey}}</Col>
        <Col span="4">
          下注金额:
          <span :class="rowDetail.betAmount>0?'green':'red'">{{rowDetail.betAmount}}</span>
        </Col>
        <Col span="4">返奖金额：{{rowDetail.winAmount}}</Col>
        <Col span="4">退款金额：{{rowDetail.refundAmount}}</Col>
      </Row>
      <Row class="g-text-left" style="margin-bottom: 15px">
        <Col span="4">返还金额：{{rowDetail.retAmount}}</Col>
        <Col span="4">
          输赢金额:
          <span
            :class="{'green':rowDetail.winloseAmount>0,'red':rowDetail.winloseAmount<0}"
          >{{rowDetail.winloseAmount}}</span>
        </Col>
      </Row>
      <Table size="small" :columns="columns2" :data="runningDetail">
        <template slot-scope="{row, index}" slot="type2">
          <span>{{type2Config(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="status2">
          <span :style="{color:status2Config(row).color}">{{status2Config(row).text}}</span>
        </template>
        <template slot-scope="{row, index}" slot="createdAt2">
          <span>{{createdAt2Config(row)}}</span>
        </template>
      </Table>
    </Modal>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import util from "@/libs/util.js";
export default {
  name: "",
  components: {},
  filters: {
    format (v) {
      return v.toLocaleString();
    }
  },
  props: {},
  data () {
    return {

      gameType: "A",
      gameTypeList: [
        {
          value: "A",
          label: "全部大类"
        },
        {
          value: 70000,
          label: "H5电子游戏"
        }
      ],
      allBetCount: 0,
      allBetAmount: 0,
      allRefund: 0,
      allWinLose: 0,
      allRet: 0,
      allWin: 0,
      flowAmount: 0,
      nowPage: 1,
      currentPage: 1,
      isLast: false, //主要判断是否是后台返回最后一次信息
      pageSize: 200, //请求的数量
      nowSize: 20, //显示的数量
      flowStartKey: null,
      tradeStartKey: null,
      flowStorage: [],
      tradeStorage: [],
      rowDetail: {},
      status: "A",
      statusList: [
        {
          value: "A",
          label: "全部状态"
        },
        {
          value: "Y",
          label: "同步成功"
        },
        {
          value: "N",
          label: "下注成功"
        },
        {
          value: "E",
          label: "下注失败"
        }
      ],
      typeList: {
        "3": "下注",
        "4": "返奖",
        "5": "返还",
        "10": "系统升级原账结余",
        "11": "中心钱包",
        "12": "代理操作",
        "13": "商城"
      },
      showData: [],
      spin: false,
      runningDetail: [],
      isOpenModalRunning: false,
      plat: "",
      userId: "",
      businessKey: "",
      reportType: "1",
      defaultTime: getDefaultTime(true),
      columns: [
        {
          title: "交易号",
          align: "center",
          key: "businessKey"
        },
        {
          title: "流水号",
          align: "center",
          key: "sn"
        },
        {
          title: "接入方",
          align: "center",
          key: "plat",
          align: "center"
        },
        {
          title: "玩家ID",
          align: "center",
          key: "userId",
          align: "center"
        },
        {
          title: "玩家昵称",
          align: "center",
          key: "userNick",
          align: "center"
        },
        {
          title: "游戏大类",
          align: "center",
          key: "gameType",
          align: "center"
        },
        {
          title: "游戏ID",
          align: "center",
          key: "gameId",
          align: "center"
        },
        {
          title: "帐变金额",
          align: "center",
          slot: "amount",
          align: "center"
        },
        {
          title: "余额",
          align: "center",
          key: "balance",
          align: "center"
        },
        {
          title: "类型",
          align: "center",
          slot: "type"
        },
        {
          title: "状态",
          align: "center",
          status: "status"
        },
        {
          title: "同步时间",
          align: "center",
          slot: "createdAt",
          align: "center"
        }
      ],
      columns1: [
        {
          title: "交易号",
          align: "center",
          key: "businessKey"
        },
        {
          title: "接入方",
          key: "plat",
          align: "center"
        },
        {
          title: "玩家ID",
          key: "userId",
          align: "center"
        },
        {
          title: "玩家昵称",
          key: "userNick",
          align: "center"
        },
        {
          title: "游戏大类",
          key: "gameType",
          align: "center"
        },
        {
          title: "游戏ID",
          key: "gameId",
          align: "center"
        },
        {
          title: "状态",
          slot: "status1",
          align: "center"
        },
        {
          title: "下注金额",
          key: "betAmount",
          align: "center"
        },
        {
          title: "下注次数",
          key: "betCount",
          align: "center"
        },
        {
          title: "返奖金额",
          key: "winAmount",
          align: "center"
        },
        {
          title: "退款金额",
          key: "refundAmount",
          align: "center"
        },
        {
          title: "返还金额",
          key: "retAmount",
          align: "center"
        },
        {
          title: "输赢金额",
          slot: "winloseAmount1",
          align: "center"
        },
        {
          title: "操作",
          slot: "operation1",
          align: "center"
        }
      ],
      columns2: [
        {
          title: "流水号",
          align: "center",
          key: "sn"
        },
        {
          title: "类型",
          align: "center",
          slot: "type2"
        },
        {
          title: "帐变金额",
          align: "center",
          key: "amount"
        },
        {
          title: "状态",
          align: "center",
          slot: "status2"
        },
        {
          title: "余额",
          align: "center",
          key: "balance"
        },
        {
          title: "交易时间",
          align: "center",
          slot: "createdAt2"
        }
      ],
      tradeRecord: [],
      flowList: []
    };
  },
  computed: {
    options () {
      return {
        shortcuts: [
          {
            text: "本周",
            value () {
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
            value () {
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
            value () {
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
            value () {
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
      }
    },
    total () {
      let data = this.reportType == "1" ? this.flowList : this.tradeRecord;
      return data.length;
    },
    changedTime () {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    },
    dataList () {
      let list = [];
      if (this.reportType == "1") {
        if (this.nowPage === 1) {
          list = this.flowList.slice(0, this.nowSize);
          this.getFlowCount(list);
          return list;
        } else {
          list = this.flowList.slice(
            (this.nowPage - 1) * this.nowSize,
            this.nowSize * this.nowPage
          );
          this.getFlowCount(list);
          return list;
        }
      } else {
        if (this.nowPage === 1) {
          list = this.tradeRecord.slice(0, this.nowSize);
          this.getAllCount(list);
          return list;
        } else {
          list = this.tradeRecord.slice(
            (this.nowPage - 1) * this.nowSize,
            this.nowSize * this.nowPage
          );
          this.getAllCount(list);
          return list;
        }
      }
    }
  },
  watch: {
    $route: function (to, from) {
      if (from.name == "noTransferReport") {
        let userId = this.$route.query.userId;
        if (userId) {
          this.userId = userId;
          this.search();
        }
      }
    }
  },
  created () {
    let userId = this.$route.query.userId;
    if (userId) {
      this.userId = userId;
      this.search();
    }
  },
  methods: {
    /* columns配置 */
    //帐变金额
    amountConfig (row) {
      if (row.amount > 0) {
        return "#0c0";
      } else {
        return "#f30";
      }
    },
    //类型
    typeConfig (row) {
      return this.typeList[row.type];
    },
    //状态
    statusConfig (row) {
      let color, text;
      switch (row.status) {
        case "Y":
          color = "#0c0";
          text = "同步成功";
          break;
        case "N":
          color = "#0c0";
          text = "下注成功";
          break;
        case "E":
          color = "#f30";
          text = "下注失败";
          break;
      }
      return { text, color };
    },
    //同步时间
    createdAtConfig (row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    },

    /* columns1配置 */
    //状态
    status1Config (row) {
      let color, text;
      switch (row.status) {
        case "Y":
          color = "#0c0";
          text = "成功";
          break;
        case "N":
          color = "#f30";
          text = "失败";
          break;
        case "E":
          color = "#f30";
          text = "错误";
          break;
      }
      return { text, color };
    },
    //输赢金额
    winloseAmount1Config (row) {
      if (row.winloseAmount > 0) {
        return "#0c0";
      } else {
        return "#f30";
      }
    },
    //操作
    operation1Config (row) {
      this.openModalRunning(row.content);
      this.rowDetail = params.row;
    },

    /* columns2配置 */
    //类型
    type2Config (row) {
      return this.typeList[row.type];
    },
    //状态
    status2Config (row) {
      let color, text;
      switch (row.status) {
        case "Y":
          color = "#0c0";
          text = "成功";
          break;
        case "N":
          color = "#f30";
          text = "失败";
          break;
        case "E":
          color = "#f30";
          text = "错误";
          break;
      }
      return { text, color };
    },
    //交易时间
    createdAt2Config (row) {
      return dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    },

    getFlowCount (list) {
      this.flowAmount = 0;
      for (let item of list) {
        this.flowAmount += item.amount;
      }
      this.flowAmount = +this.flowAmount.toFixed(2);
    },
    getAllCount (list) {
      this.allBetCount = 0;
      this.allBetAmount = 0;
      this.allWinLose = 0;
      this.allRefund = 0;
      this.allWin = 0;
      this.allRet = 0;
      for (let item of list) {
        this.allBetCount += item.betCount;
        this.allBetAmount += item.betAmount;
        this.allWinLose += item.winloseAmount;
        this.allRefund += item.refundAmount;
        this.allRet += item.retAmount;
        this.allWin += item.winAmount;
      }
      this.allBetAmount = +this.allBetAmount.toFixed(2);
      this.allWinLose = +this.allWinLose.toFixed(2);
      this.allRefund = +this.allRefund.toFixed(2);
      this.allWin = +this.allWin.toFixed(2);
      this.allRet = +this.allRet.toFixed(2);
    },
    changepage (page) {
      this.nowPage = page;
      if (this.reportType == "1") {
        if (
          page == Math.ceil(this.flowList.length / this.nowSize) &&
          !this.spin &&
          page != 1 &&
          !this.isLast
        ) {
          this.flowStorage = JSON.parse(JSON.stringify(this.flowList));
          this.getData();
        }
      } else {
        if (
          page == Math.ceil(this.tradeRecord.length / this.nowSize) &&
          !this.spin &&
          page != 1 &&
          !this.isLast
        ) {
          this.tradeStorage = JSON.parse(JSON.stringify(this.tradeRecord));
          this.getData();
        }
      }
    },
    openModalRunning (data) {
      this.isOpenModalRunning = true;
      this.runningDetail = data;
    },
    reset () {
      this.userId = "";
      this.businessKey = "";
      this.status = "A";
      this.defaultTime = getDefaultTime(true);
      this.resetPage();
    },
    resetPage () {
      this.currentPage = 1;
      this.nowPage = 1;
      this.flowList = [];
      this.flowStorage = [];
      this.flowStartKey = null;
      this.tradeRecord = [];
      this.tradeStorage = [];
      this.tradeStartKey = null;
    },
    search () {
      this.resetPage();
      this.getData();
    },
    getData () {
      if (this.plat == "" && this.userId == "" && this.businessKey == "") {
        return this.$Message.warning("请输入查询条件");
      }
      this.spin = true;
      httpRequest("post", "/transferDetail", {
        userId: this.userId,
        isRound: this.reportType == "1" ? false : true,
        status: this.status,
        pageSize: this.pageSize,
        gameType: this.gameType,
        startKey:
          this.reportType == "1" ? this.flowStartKey : this.tradeStartKey,
        businessKey: this.businessKey,
        startTime: util.timeZoneConversion(this.changedTime[0], this.$store.state.timeZone),
        endTime: util.timeZoneConversion(this.changedTime[1], this.$store.state.timeZone)
      })
        .then(res => {
          if (res.code == 0) {
            if (res.payload) {
              this.isLast = res.payload.Items < this.pageSize;
              if (this.reportType == "1") {
                this.flowList = res.payload.Items;
                this.flowStartKey = res.payload.startKey;
                this.flowStorage.length &&
                  (this.flowList = this.flowStorage.concat(this.flowList));
              } else {
                this.tradeRecord = res.payload.Items;
                this.tradeStartKey = res.payload.startKey;
                this.tradeStorage.length &&
                  (this.tradeRecord = this.tradeStorage.concat(
                    this.tradeRecord
                  ));
              }
            }
          }
        })
        .finally(() => {
          this.spin = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.flow {
  min-height: 89vh;
  .row {
    line-height: 32px;
    padding-bottom: 16px;
  }
  .page {
    text-align: right;
    margin-top: 20px;
  }
  .count_row {
    line-height: 32px;
    padding: 20px 0;
  }
}
.green {
  color: #0c0;
}
.label {
  padding-right: 10px;
}
.red {
  color: #f30;
}
.ivu-select {
  vertical-align: top;
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
/deep/ .ivu-input {
  border-color: #000;
  background: #fff;
}
</style>
