<template>
  <div class="sbAll">
    <div class="nowList">
      <div class="top">
        <p class="title">
          当前用户列表
          <Button type="ghost" @click="exportdata('table_0')">导出数据</Button>
        </p>
        <div class="right">
          <DatePicker type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="confirm"></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref='table_0'></Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        所属玩家列表
        <Button type="ghost" @click="exportdata('table_1')">导出数据</Button>
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref='table_1'></Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import { thousandFormatter } from "@/config/format";
export default {
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
      defaultTime: getDefaultTime(),
      spinShow: false, //加载spin
      playerList: [], //玩家列表
      user: [], //当前商户
      gameType: [1120000, 1080000],
      columns1: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "类型",
          key: "role",
          render: (h, params) => {
            return h("span", this.types(params.row.role));
          }
        },
        {
          title: "昵称",
          key: "displayName"
        },
        {
          title: "管理员账号",
          key: "username"
        },
        {
          title: "交易次数",
          key: "betCount"
        },
        {
          title: "总游戏输赢金额",
          key: "winloseAmount",
          render: (h, params) => {
            let color = params.row.winloseAmount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(params.row.winloseAmount)
            );
          }
        },
        {
          title: "总游戏交公司",
          key: "submitAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.submitAmount));
          }
        },
        {
          title: "SB真人游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let gameList = params.row.gameTypeMap;
            let count = 0;
            for (let key in gameList) {
              if (key == "1120000") {
                count += gameList[key].winloseAmount;
              }
            }
            if (count) {
              count = count.toFixed(2);
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "SB真人游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            let gameList = params.row.gameTypeMap;
            let count = 0;
            for (let key in gameList) {
              if (key == "1120000") {
                count += gameList[key].submitAmount;
              }
            }
            if (count) {
              count = count.toFixed(2);
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "SB电子游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let gameList = params.row.gameTypeMap;
            let count = 0;
            for (let key in gameList) {
              if (key == "1080000") {
                count += gameList[key].winloseAmount;
              }
            }
            if (count) {
              count = count.toFixed(2);
            }
            let color = count < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(count)
            );
          }
        },
        {
          title: "SB电子游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            let gameList = params.row.gameTypeMap;
            let count = 0;
            for (let key in gameList) {
              if (key == "1080000") {
                count += gameList[key].submitAmount;
              }
            }
            if (count) {
              count = count.toFixed(2);
            }
            return h("span", thousandFormatter(count));
          }
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "用户名",
          key: "userName",
          render: (h, params) => {
            let name = params.row.userName;
            return h(
              "span",
              {
                style: {
                  color: "#20a0ff",
                  cursor:'pointer'
                },
                on: {
                  click: () => {
                    localStorage.setItem("playerName", name);
                    this.$router.push({
                      name: "playDetail",
                      query: {
                        name:name
                      }
                    });
                  }
                }
              },
              name
            );
          }
        },
        {
          title: "昵称",
          key: "nickname"
        },
        {
          title: "交易次数",
          key: "betCount"
        },
        {
          title: "总游戏输赢金额",
          key: "winloseAmount",
          render: (h, params) => {
            let color = params.row.winloseAmount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(params.row.winloseAmount)
            );
          }
        },
        {
          title: "SB真人游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let winloseAmount = 0;
            if (params.row.gameTypeMap["1120000"] !== undefined) {
              winloseAmount = params.row.gameTypeMap[
                "1120000"
              ].winloseAmount.toFixed(2);
            }
            let color = winloseAmount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(winloseAmount)
            );
          }
        },
        {
          title: "SB电子游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let winloseAmount = 0;
            if (params.row.gameTypeMap["1080000"] !== undefined) {
              winloseAmount = params.row.gameTypeMap[
                "1080000"
              ].winloseAmount.toFixed(2);
            }
            let color = winloseAmount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              thousandFormatter(winloseAmount)
            );
          }
        }
      ]
    };
  },
  computed: {
    changedTime() {
      let time = this.defaultTime;
      time = time.map((item, index) => {
        if (index == 1 && item.getTime() > Date.now() - 180000) {
          return Date.now() - 180000;
        }
        return item.getTime();
      });
      this.defaultTime = [new Date(time[0]), new Date(time[1])];
      return time;
    }
  },
  methods: {
    confirm() {
      this.init();
    },
    exportdata(table) {
      if (table == "table_0") {
        this.$refs.table_0.exportCsv({ filename: "current" });
      } else if (table == "table_1") {
        this.$refs.table_1.exportCsv({ filename: "player" });
      }
       this.$Notice.config({
        top: 200,
        duration: 10
      });
      this.$Notice.success({
        title: "温馨提示:",
        desc:
          "因导出报表含中文字符,导出后请进行转码操作,方法是：1、先用记事本打开；2、点击文件-另存为-设置编码为ASNI-保存覆盖"
      });
    },
    reset() {
      this.defaultTime = getDefaultTime();
      this.init();
    },
    search() {
      this.init();
    },
    types(value) {
      switch (value) {
        case "0":
          return "超级管理员";
          break;
        case "1":
          return "管理员";
          break;
        case "10":
          return "线路商";
          break;
        case "100":
          return "商户";
          break;
        case "1000":
          return "代理";
          break;
        case "10000":
          return "玩家";
          break;
      }
    },
    async init() {
      let userId = localStorage.loginId;
      this.spinShow = true;
      let params1 = {
        userId: userId,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let params2 = {
        parentId: userId,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getPlayerList", params2);
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];
      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.playerList = perms.payload;
      }
    }
  },
  created() {
    // console.log(this.defaultTime);
    this.init();
  }
};
</script>
<style lang="less" scoped>
.sbAll {
  min-height: 90vh;
  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    clear: both;
    .right {
      float: right;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
}
</style>
