<template>
  <div class="saAll">
    <div class="nowList">
      <div class="top">
        <p class="title">
          当前用户列表
          <RadioGroup v-model="source" v-if="level==0" type="button" @on-change='changeSource' size="small">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
          <!-- <Button type="ghost" @click="exportdata('table_0')" size="small">导出数据</Button> -->
        </p>
        <div class="right">
          <DatePicker type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="confirm"></DatePicker>
          <Button type="primary" @click="search" size="small">搜索</Button>
          <Button type="ghost" @click="reset" size="small">重置</Button>
        </div>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref='table_1'></Table>
    </div>
    <div class="childList">
      <p class="title">
        直属下级列表
        <!-- <Button type="ghost" @click="exportdata('table_1')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns1" :data="child" size="small" ref='table_1'></Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
        <!-- <Button type="ghost" @click="exportdata(index)" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns1" :data="item" size="small" :ref="'table'+index"></Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName"> ({{ userName }})</span>所属玩家列表
        <!-- <Button type="ghost" @click="exportdata('table_2')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref='table_2'></Table>
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
      showName: false, //上级商家
      userName: "", //上级商家名字
      reportChild: [], //点击渲染的下级
      playerList: [], //玩家列表
      user: [], //当前管理员
      child: [], //管理员下级
      userId: localStorage.getItem("userId"),
      gameType: [1060000, 1110000],
      source: "1",
      // option: {
      //   disabledDate(date) {
      //     return date && date.valueOf() > Date.now() - 180000;
      //   }
      // },
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 70
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
          key: "username",
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#20a0ff"
                },
                on: {
                  click: async () => {
                    this.spinShow = true;
                    let userId = localStorage.userId;
                    let level=localStorage.level;
                    let parent=''
                    if (params.row.userId == userId) {
                      if(level==0){
                        parent='01'
                        this.playerList=[]
                      }else{
                        parent=userId
                        this.$store
                        .dispatch("getPlayerList", {
                          parentId: userId,
                          gameType: this.gameType,
                          query: {
                            createdAt: this.changedTime
                          }
                        })
                        .then(res => {
                          this.playerList = res.payload;
                        });
                      }
                      this.$store
                        .dispatch("getUserChild", {
                          parent: parent,
                          gameType: this.gameType,
                          isTest:+this.source,
                          query: {
                            createdAt: this.changedTime
                          }
                        })
                        .then(res => {
                          // console.log(res);
                          this.reportChild=[]
                          this.showName=false
                          this.child = res.payload;
                          this.spinShow = false;
                        });
                    } else {
                      this.userName = params.row.displayName;
                      this.showName = true;
                      let userId = params.row.userId;
                      let level = params.row.level;
                      let showList = await this.getNextLevel(
                        this.reportChild,
                        userId
                      );
                      showList = _.filter(showList, function(o) {
                        return o.length;
                      });
                      let len = showList.length;
                      if (len > 0) {
                        while (len--) {
                          if (showList[len][0].level > level + 1) {
                            showList.splice(len, 1);
                          }
                        }
                      }
                      this.reportChild = showList;
                      this.$store
                        .dispatch("getPlayerList", {
                          parentId: userId,
                          gameType: this.gameType,
                          query: {
                            createdAt: this.changedTime
                          }
                        })
                        .then(res => {
                          this.playerList = res.payload;
                          this.spinShow = false;
                          // console.log(res);
                        });
                      let anchor = this.$el.querySelector("#playerList");
                      document.documentElement.scrollTop = anchor.offsetTop;
                    }
                    // console.log(params.row);
                  }
                }
              },
              params.row.username
            );
          }
        },
        {
          title: "交易次数",
          key: "betCount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            if (arr.length > 0) {
              for (let item of arr) {
                count += item.betCount;
              }
            }
            if (params.row.level == 0) {
              return h("span", count);
            } else {
              return h("span", params.row.betCount);
            }
          }
        },
        {
          title: "总游戏输赢金额",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            for (let item of arr) {
              count += item.winloseAmount;
            }
            let color = "";
            if (params.row.level == 0) {
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            } else {
              color = params.row.winloseAmount < 0 ? "#f30" : "#0c0";
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
          }
        },
        {
          title: "总游戏交公司",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", 0);
            } else {
              if (params.row.submitAmount) {
                return h(
                  "span",
                  thousandFormatter(params.row.submitAmount.toFixed(2))
                );
              } else {
                return h("span", 0);
              }
            }
          }
        },
        {
          title: "总游戏洗码量",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let count = 0;
              for (let item of arr) {
                count += item.mixAmount;
              }
              return h("span", thousandFormatter(count));
            } else {
              return h("span", thousandFormatter(params.row.mixAmount));
            }
          }
        },
        {
          title: "SA真人游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            if (arr.length > 0) {
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1060000") {
                    count += item.gameTypeMap[key].winloseAmount;
                  }
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            } else {
              let winloseAmount = 0;
              if (params.row.gameTypeMap) {
                if (params.row.gameTypeMap["1060000"]) {
                  winloseAmount = params.row.gameTypeMap[
                    "1060000"
                  ].winloseAmount.toFixed(2);
                }
              }
              color = winloseAmount < 0 ? "#f30" : "#0c0";
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
        },
        {
          title: "SA真人游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let submitAmount = 0;
              if (params.row.gameTypeMap) {
                if (params.row.gameTypeMap["1060000"]) {
                  submitAmount = params.row.gameTypeMap[
                    "1060000"
                  ].submitAmount.toFixed(2);
                }
              }
              return h("span", thousandFormatter(submitAmount));
            }
          }
        },
        {
          title: "SA真人游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let count = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1060000") {
                    count += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(count));
            } else {
              let mixAmount = 0;
              if (params.row.gameTypeMap) {
                if (params.row.gameTypeMap["1060000"]) {
                  mixAmount = params.row.gameTypeMap["1060000"].mixAmount;
                }
              }
              return h("span", thousandFormatter(mixAmount));
            }
          }
        },
        {
          title: "SA捕鱼游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            if (arr.length > 0) {
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1110000") {
                    count += item.gameTypeMap[key].winloseAmount;
                  }
                }
              }
            }
            let color = "";
            if (params.row.level == 0) {
              color = count < 0 ? "#f30" : "#0c0";
              return h(
                "span",
                {
                  style: {
                    color: color
                  }
                },
                thousandFormatter(count.toFixed(2))
              );
            } else {
              let winloseAmount = 0;
              if (params.row.gameTypeMap) {
                if (params.row.gameTypeMap["1110000"]) {
                  winloseAmount = params.row.gameTypeMap[
                    "1110000"
                  ].winloseAmount.toFixed(2);
                }
              }
              color = winloseAmount < 0 ? "#f30" : "#0c0";
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
        },
        {
          title: "SA捕鱼游戏(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              return h("span", "0.00");
            } else {
              let submitAmount = 0;
              if (params.row.gameTypeMap) {
                if (params.row.gameTypeMap["1110000"]) {
                  submitAmount = params.row.gameTypeMap[
                    "1110000"
                  ].submitAmount.toFixed(2);
                }
              }
              return h("span", thousandFormatter(submitAmount));
            }
          }
        },
        {
          title: "SA捕鱼游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            if (params.row.level == 0) {
              let arr = this.child;
              let count = 0;
              for (let item of arr) {
                for (let key in item.gameTypeMap) {
                  if (key == "1110000") {
                    count += item.gameTypeMap[key].mixAmount;
                  }
                }
              }
              return h("span", thousandFormatter(count));
            } else {
              let mixAmount = 0;
              if (params.row.gameTypeMap) {
                if (params.row.gameTypeMap["1110000"]) {
                  mixAmount = params.row.gameTypeMap["1110000"].mixAmount;
                }
              }
              return h("span", thousandFormatter(mixAmount));
            }
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
          title: "总游戏洗码量",
          key: "mixAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.mixAmount));
          }
        },
        {
          title: "SA真人游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let winloseAmount = 0;
            if (params.row.gameTypeMap["1060000"] != undefined) {
              winloseAmount = params.row.gameTypeMap[
                "1060000"
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
          title: "SA真人游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1060000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
          }
        },
        {
          title: "SA捕鱼游戏(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let winloseAmount = 0;
            if (params.row.gameTypeMap["1110000"] != undefined) {
              winloseAmount = params.row.gameTypeMap[
                "1110000"
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
          title: "SA捕鱼游戏(洗码量)",
          key: "mixAmount",
          render: (h, params) => {
            let obj = params.row.gameTypeMap;
            let count = 0;
            for (let key in obj) {
              if (key == "1110000") {
                count += obj[key].mixAmount;
              }
            }
            return h("span", thousandFormatter(count));
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
    },
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission ||[];
    },
     level() {
      return JSON.parse(localStorage.getItem("userInfo")).level;
    },
  },
  methods: {
    confirm() {
      this.init();
    },
    exportdata(table) {
      if (table == "table_0") {
        this.$refs.table_0.exportCsv({ filename: "current" });
      } else if (table == "table_1") {
        this.$refs.table_1.exportCsv({ filename: "next" });
      } else if (table == "table_2") {
        this.$refs.table_2.exportCsv({ filename: "player" });
      } else {
        let ref = "table" + table;
        this.$refs[ref][0].exportCsv({ filename: ref });
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
    changeSource() {
      this.init();
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
    },
    reset() {
      this.defaultTime = getDefaultTime();
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
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
    async getNextLevel(showList, userId) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("getUserChild", {
            parent: userId,
            isTest:+this.source,
            gameType: this.gameType,
            query: {
              createdAt: this.changedTime
            }
          })
          .then(res => {
            showList.push(res.payload);
            showList = _.uniqWith(showList, _.isEqual);
            this.spinShow = false;
            resolve(showList);
          });
      });
    },
    async init() {
      this.spinShow = true;
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let userId = userInfo.userId;
      let level = userInfo.level;
      let parent = "";
      let params1={}
      if (level == 0) {
        params1 =  { userId: userId, isTest: +this.source };
        parent = "01";
      } else {
        parent = userId;
        this.source=2
         params1 = { 
          userId: userId,
          isTest: +this.source,
          gameType: this.gameType,
          query: {
            createdAt: this.changedTime
          } };
         this.$store
        .dispatch("getPlayerList", {
          parentId: userId,
          gameType: this.gameType,
          query: {
            createdAt: this.changedTime
          }
        })
        .then(res => {
          this.playerList = res.payload;
        });
      }
      let params2 = {
        parent: parent,
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getUserChild", params2);
      let [acct, perms] = await this.axios.all([req1, req2]);
     
      this.user = [];
      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.child = perms.payload;
      }
      this.spinShow = false;
    }
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    this.init();
  }
};
</script>
<style lang="less" scoped>
.saAll {
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
