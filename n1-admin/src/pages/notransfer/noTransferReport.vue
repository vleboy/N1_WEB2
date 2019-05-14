<template>
  <div class="notransfer">
    <div class="search">
      <Row class="row">
        <Col span="12">
        <span class="label">接入方标识</span>
        <Input v-model="plat" @keyup.native.enter="search" style="width: 150px" placeholder="请输入"></Input>
        <Select v-model="gameType" style="width:110px" @on-change="search">
          <Option v-for="item in gameTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
        <Col span="12" style="textAlign:right">
        <DatePicker type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="search"></DatePicker>
        <Button type="primary" @click="search">搜索</Button>
        <Button type="ghost" @click="reset">重置</Button>
        </Col>
      </Row>
    </div>
    <Table :columns="columns" size="small" :data="reportList"></Table>
    <div v-if="showPlayer">
      <p class="sum"> {{parent}} 所属玩家汇总</p>
      <Table :columns="columns1" size="small" :data="playerList"></Table>
    </div>
    <Modal v-model="pointModal" title="预警点数" :width='450' @on-ok="changePoint" @on-cancel='cancel'>
      <p class='gameTitle'>H5电子游戏</p>
      <p class="current">当前值 {{winloseAmount}}/{{topAmount}}</p>
      <Row class="current">
        <Col span="8"> 设定值:{{winloseAmount}}/
        </Col>
        <Col span="12">
        <Input v-model="newAmount" :number='true' size="small" placeholder="请输入"></Input>
        </Col>
      </Row>
    </Modal>
    <Spin size="large" fix v-if="spin">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { httpRequest } from "@/service/index";
import { getDefaultTime } from "@/config/getDefaultTime";
export default {
  name: "notransferReport",
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      plat: "",
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
      newAmount: "",
      winloseAmount: "",
      topAmount: "",
      pointModal: false,
      spin: false,
      parent: "",
      showPlayer: false,
      defaultTime: getDefaultTime(true),
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
      columns: [
        {
          title: "接入方标识",
          align: 'center',
          key: "plat",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.parent = params.row.plat;
                    this.showPlayer = true;
                    this.getPlayerList(params.row.plat);
                  }
                }
              },
              params.row.plat
            );
          }
        },
        {
          title: "下注次数",
          align: 'center',
          key: "betCount"
        },
        {
          title: "下注金额",
          align: 'center',
          key: "betAmount"
        },
        {
          title: "退款金额",
          align: 'center',
          key: "refundAmount"
        },
        {
          title: "返还金额",
          align: 'center',
          key: "retAmount"
        },
        {
          title: "返奖金额",
          align: 'center',
          key: "winAmount"
        },
        {
          title: "输赢金额",
          align: 'center',
          key: "winloseAmount",
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
          title: "接入商",
          align: 'center',
          key: "",
          render: (h, params) => {
            let transferMap = params.row.transferMap["70000"];
            return h("span", transferMap.name);
          }
        },
        {
          title: "历史游戏点数消耗",
          align: 'center',
          key: "",
          render: (h, params) => {
            if (params.row.transferMap) {
              let transferMap = params.row.transferMap["70000"];
              let topAmount = transferMap.topAmount;
              let winloseAmount = transferMap.winloseAmountMap.winloseAmount.toFixed(
                2
              );
              let text = winloseAmount + "/" + topAmount;
              let width = 0;
              let color = "#fff";
              if (
                winloseAmount < topAmount &&
                winloseAmount > 0 &&
                topAmount > 0
              ) {
                width = ((100 * winloseAmount) / topAmount).toFixed(2) + "%";
                if (winloseAmount / topAmount > 0.8) {
                  color = "red";
                } else {
                  color = "#0c0";
                }
              } else if (
                winloseAmount > 0 &&
                topAmount > 0 &&
                winloseAmount > topAmount
              ) {
                (width = "100%"), (color = "red");
              }
              return h(
                "div",
                {
                  style: {
                    margin: "8px 0px",
                    border: "1px solid rgb(0, 0, 0)",
                    borderRadius: "5px",
                    textAlign: "center",
                    height: "24px"
                  }
                },
                [
                  h("span", text),
                  h("div", {
                    style: {
                      width: width,
                      backgroundColor: color,
                      marginTop: "-18px",
                      borderRadius: "5px",
                      height: "22px"
                    }
                  })
                ]
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.setTop(params.row);
                  }
                }
              },
              "设定点数告警上限"
            );
          }
        }
      ],
      columns1: [
        {
          title: "玩家ID",
          key: "userId",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                on: {
                  click: () => {
                    this.$router.push({
                      path: "/transfer/flow",
                      query: {
                        userId: params.row.userId
                      }
                    });
                  }
                }
              },
              params.row.userId
            );
          }
        },
        {
          title: "玩家昵称",
          key: "userNick"
        },
        {
          title: "下注次数",
          key: "betCount"
        },
        {
          title: "下注金额",
          key: "betAmount"
        },
        {
          title: "退款金额",
          key: "refundAmount"
        },
        {
          title: "返还金额",
          key: "retAmount"
        },
        {
          title: "返奖金额",
          key: "winAmount"
        },
        {
          title: "输赢金额",
          key: "winloseAmount",
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
        }
      ],
      reportList: [],
      playerList: []
    };
  },
  computed: {
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    }
  },
  watch: {},
  created() {
    this.getReportList();
  },
  methods: {
    setTop(row) {
      let transferMap = row.transferMap["70000"];
      let topAmount = transferMap.topAmount;
      let winloseAmount = transferMap.winloseAmountMap.winloseAmount.toFixed(2);
      this.topAmount = topAmount;
      this.winloseAmount = winloseAmount;
      this.plat = row.plat;
      this.pointModal = true;
    },
    changePoint() {
      httpRequest("post", "/transferMap", {
        topAmount: this.newAmount,
        gameType: "70000",
        plat: this.plat
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("操作成功");
          this.newAmount = "";
          this.reset();
        }
      });
    },
    search() {
      this.getReportList();
    },
    cancel() {
      this.plat = "";
      this.newAmount = "";
    },
    reset() {
      this.plat = "";
      this.defaultTime = getDefaultTime(true);
      this.reportList = [];
      this.showPlayer = false;
      this.playerList = [];
      this.getReportList();
    },
    getReportList() {
      this.spin = true;
      httpRequest("post", "/transferUserStat", {
        startTime: this.changedTime[0],
        endTime: this.changedTime[1],
        gameType:this.gameType,
        plat: this.plat
      })
        .then(res => {
          if (res.code == 0) {
            this.reportList = res.payload;
          }
        })
        .finally(() => {
          this.spin = false;
        });
    },
    getPlayerList(plat) {
      this.spin = true;
      httpRequest("post", "/transferUserStat", {
        startTime: this.changedTime[0],
        endTime: this.changedTime[1],
        plat: plat,
        gameType:this.gameType,
        handleType: "player"
      })
        .then(res => {
          if (res.code == 0) {
            this.playerList = res.payload;
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
.notransfer {
  min-height: 89vh;
  .search {
    margin-bottom: 10px;
    .label {
      padding-right: 15px;
    }
  }
  .sum {
    line-height: 36px;
  }
}
.gameTitle {
  text-align: center;
  margin: 10px auto;
  font-size: 16px;
}
.current {
  margin: 20px auto;
  font-size: 14px;
  text-indent: 1em;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
/deep/ .ivu-table-cell {
  padding: 0
} 
</style>
