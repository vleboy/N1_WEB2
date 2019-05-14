<template>
  <div class="flow">
    <div class="top">
      <div class="search">
        <Row class="row">
          <Col span="13">
          <span class="label">接入方标识</span>
          <Input v-model="plat" style="width: 100px" placeholder="请输入"></Input>
          <span class="label">玩家ID</span>
          <Input v-model="userId" style="width: 100px" placeholder="请输入"></Input>
          <span class="label">交易号</span>
          <Input v-model="businessKey" style="width: 120px" placeholder="请输入"></Input>
          </Col>
          <Col span="11" style="textAlign:right">
          <DatePicker type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="search"></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
          </Col>
        </Row>
      </div>
    </div>
    <Row class="row selection">
      <Col span="8">
      <RadioGroup v-model="reportType" type="button" :style="{paddingBottom:'10px'}" @on-change="search">
        <Radio label="1">流水记录</Radio>
        <Radio label="2">交易记录</Radio>
      </RadioGroup>
        <Select v-model="gameType" style="width:110px" @on-change="search">
          <Option v-for="item in gameTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      <Select v-model="status" style="width:90px" v-if="reportType=='1'" @on-change="search">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      </Col>
      <!-- <Col span="8">
       <span>分页数量:</span>
      <Select v-model="pageSize" style="width:90px" @on-change="search">
        <Option v-for="item in sizeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      </Col> -->
    </Row>
    <Table :columns="columns" no-data-text='请输入查询条件' size="small" v-if="reportType==1" :data="dataList"></Table>
    <Table :columns="columns1" no-data-text='请输入查询条件' size="small" v-else :data="dataList"></Table>
    <Row class="count_row" v-if="reportType=='1'">
      <Col span="4">
      当页数据总输赢金额: <span class="num">{{flowAmount|format}}</span>
      </Col>
    </Row>
    <Row class="count_row" v-else>
      <Col span="4">
      当页数据总下注次数: <span class="num">{{allBetCount|format}}</span>
      </Col>
      <Col span="4">
      当页数据总下注金额: <span class="num">{{allBetAmount|format}}</span>
      </Col>
      <Col span="4">
      当页数据总返还金额: <span class="num">{{allRet|format}}</span>
      </Col>
      <Col span="4">
      当页数据总返奖金额: <span class="num">{{allWin|format}}</span>
      </Col>
      <Col span="4">
      当页数据总退款金额: <span class="num">{{allRefund|format}}</span>
      </Col>
      <Col span="4">
      当页数据总输赢金额: <span class="num">{{allWinLose|format}}</span>
      </Col>
    </Row>
    <Page :total="total" class="page" show-elevator :page-size='nowSize' :current.sync="currentPage" @on-change="changepage"></Page>
    <Spin size="large" fix v-if="spin">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <Modal title="流水详情" v-model="isOpenModalRunning" class="g-text-center" width="800">
      <Row class="g-text-left" style="margin-bottom: 15px">
        <Col span="12">交易号：{{rowDetail.businessKey}}</Col>
        <Col span="4">下注金额:<span :class="rowDetail.betAmount>0?'green':'red'">{{rowDetail.betAmount}}</span></Col>
        <Col span="4">返奖金额：{{rowDetail.winAmount}}</Col>
        <Col span="4">退款金额：{{rowDetail.refundAmount}}</Col>
      </Row>
      <Row class="g-text-left" style="margin-bottom: 15px">
        <Col span="4">返还金额：{{rowDetail.retAmount}}</Col>
        <Col span="4">输赢金额:
        <span :class="{'green':rowDetail.winloseAmount>0,'red':rowDetail.winloseAmount<0}">{{rowDetail.winloseAmount}}</span>
        </Col>
      </Row>
      <Table size="small" :columns="columns2" :data="runningDetail"></Table>
    </Modal>
  </div>
</template>
<script>
import { httpRequest } from "@/service/index";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
export default {
  name: "",
  components: {},
  filters: {
    format(v) {
      return v.toLocaleString();
    }
  },
  props: {},
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
      //  sizeList: [
      //   {
      //     value: 200,
      //     label: "200"
      //   },
      //   {
      //     value: 100,
      //     label: "100"
      //   },
      //   {
      //     value: 20,
      //     label: "20"
      //   }
      // ],
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
          align: 'center',
          key: "businessKey"
        },
        {
          title: "流水号",
          key: "sn",
          align: 'center',
        },
        {
          title: "接入方",
          key: "plat",
          align: 'center',
        },
        {
          title: "玩家ID",
          key: "userId",
          align: 'center',
        },
        {
          title: "玩家昵称",
          key: "userNick",
          align: 'center',
        },
        {
          title: "游戏大类",
          key: "gameType",
          align: 'center',
        },
        {
          title: "游戏ID",
          key: "gameId",
          align: 'center',
        },
        {
          title: "帐变金额",
          key: "amount",
          align: 'center',
          render: (h, params) => {
            let color = params.row.amount > 0 ? "#0c0" : "#f30";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              params.row.amount
            );
          }
        },
        {
          title: "余额",
          key: "balance",
          align: 'center',
        },
        {
          title: "类型",
          key: "type",
          align: 'center',
          render: (h, params) => {
            return h("span", this.typeList[params.row.type]);
          }
        },
        {
          title: "状态",
          key: "status",
          align: 'center',
          render: (h, params) => {
            let color, text;
            switch (params.row.status) {
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
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "同步时间",
          key: "createdAt",
          align: "center",
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        }
      ],
      columns1: [
        {
          title: "交易号",
          key: "businessKey",
          width: 200
        },
        {
          title: "接入方",
          key: "plat",
          width: 100,
          align: "center"
        },
        {
          title: "玩家ID",
          key: "userId",
          width: 100,
          align: "center"
        },
        {
          title: "玩家昵称",
          key: "userNick",
          width: 100,
          align: "center"
        },
        {
          title: "游戏大类",
          key: "gameType",
          width: 100,
          align: "center"
        },
        {
          title: "游戏ID",
          key: "gameId",
          width: 100,
          align: "center"
        },
        {
          title: "状态",
          key: "status",
          width: 100,
          align: "center",
          render: (h, params) => {
            let color, text;
            switch (params.row.status) {
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
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "下注金额",
          key: "betAmount",
          width: 100,
          align: "center"
        },
        {
          title: "下注次数",
          key: "betCount",
          width: 100,
          align: "center"
        },
        {
          title: "返奖金额",
          key: "winAmount",
          width: 100,
          align: "center"
        },
        {
          title: "退款金额",
          key: "refundAmount",
          width: 100,
          align: "center"
        },
        {
          title: "返还金额",
          key: "retAmount",
          width: 100,
          align: "center"
        },
        {
          title: "输赢金额",
          key: "winloseAmount",
          width: 100,
          align: "center",
          render: (h, params) => {
            let color = params.row.winloseAmount > 0 ? "#0c0" : "#f30";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              params.row.winloseAmount
            );
          }
        },
        {
          title: "操作",
          key: "",
          minWidth: 100,
          align: "center",
          render: (h, params) => {
            return h(
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
                    this.openModalRunning(params.row.content);
                    this.rowDetail = params.row;
                  }
                }
              },
              "详情"
            );
          }
        }
      ],
      columns2: [
        {
          title: "流水号",
          key: "sn"
        },
        {
          title: "类型",
          key: "type",
          render: (h, params) => {
            return h("span", this.typeList[params.row.type]);
          }
        },
        {
          title: "帐变金额",
          key: "amount"
        },
        {
          title: "状态",
          key: "status",
          render: (h, params) => {
            let color, text;
            switch (params.row.status) {
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
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: "余额",
          key: "balance"
        },
        {
          title: "交易时间",
          key: "createdAt",
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        }
      ],
      tradeRecord: [],
      flowList: []
    };
  },
  computed: {
    total() {
      let data = this.reportType == "1" ? this.flowList : this.tradeRecord;
      return data.length;
    },
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    },
    dataList() {
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
    $route: function(to, from) {
      if (from.name == "noTransferReport") {
        let userId = this.$route.query.userId;
        if (userId) {
          this.userId = userId;
          this.search();
        }
      }
    }
  },
  created() {//初始化
    let userId = this.$route.query.userId;
    if (userId) {
      this.userId = userId;
      this.search();
    }
  },
  methods: {
    getFlowCount(list) {
      this.flowAmount = 0;
      for (let item of list) {
        this.flowAmount += item.amount;
      }
      this.flowAmount = +this.flowAmount.toFixed(2);
    },
    getAllCount(list) {
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
    changepage(page) {
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
    openModalRunning(data) {
      this.isOpenModalRunning = true;
      this.runningDetail = data;
    },
    reset() {
      this.userId = "";
      this.plat = "";
      this.businessKey = "";
      this.status = "A";
      this.defaultTime = getDefaultTime(true);
      this.resetPage();
    },
    resetPage() {
      this.currentPage = 1;
      this.nowPage = 1;
      this.flowList = [];
      this.flowStorage = [];
      this.flowStartKey = null;
      this.tradeRecord = [];
      this.tradeStorage = [];
      this.tradeStartKey = null;
    },
    search() {
      this.resetPage();
      this.getData();
    },
    getData() {
      if (this.plat == "" && this.userId == "" && this.businessKey == "") {
        return this.$Message.warning("请输入查询条件");
      }
      this.spin = true;
      httpRequest("post", "/transferDetail", {
        userId: this.userId,
        isRound: this.reportType == "1" ? false : true,
        plat: this.plat,
        status: this.status,
        pageSize: this.pageSize,
        gameType:this.gameType,
        startKey:this.reportType == "1" ? this.flowStartKey : this.tradeStartKey,
        businessKey: this.businessKey,
        startTime: this.changedTime[0],
        endTime: this.changedTime[1]
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
</style>
