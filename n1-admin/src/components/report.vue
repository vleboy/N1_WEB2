<template>
  <div class="report">
    <div class="nowList">
      <div class="top">
        <p class="title">
          当前用户列表
          <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
          <Button type="ghost" @click="exportdata('table_0')">导出数据</Button>
        </p>
        <div class="right">
          <DatePicker
            type="datetimerange"
            :options="options"
            :editable="false"
            v-model="defaultTime"
            placeholder="选择日期时间范围(默认最近一周)"
            style="width: 300px"
            @on-ok="confirm"
            clearable
            @on-clear="claer"
          ></DatePicker>
          <Button type="primary" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref="table_0"></Table>
    </div>
    <div class="childList">
      <p class="title">
        直属下级列表
        <Button type="ghost" @click="exportdata('table_1')">导出数据</Button>
      </p>
      <Table :columns="columns1" :data="child" size="small" ref="table_1"></Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
        <Button type="ghost" @click="exportdata(index)">导出数据</Button>
      </p>
      <Table :columns="columns1" :data="item" size="small" :ref="'table'+index"></Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName">({{ userName }})</span>所属玩家列表
        <Button type="ghost" @click="exportdata('table_2')">导出数据</Button>
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref="table_2"></Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
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
      defaultTime: getDefaultTime(),
      spinShow: false, //加载spin
      showName: false, //上级商家
      userName: "", //上级商家名字
      reportChild: [], //点击渲染的下级
      playerList: [], //玩家列表
      user: [], //当前管理员
      child: [], //管理员下级
      // option: {
      //   disabledDate(date) {
      //     return date && date.valueOf() > Date.now() - 180000;
      //   }
      // },
      source: "1",
      columns1: [
        {
          title: "序号",
          type: "index",
          width: 100
        },
        {
          title: "类型",
          key: "role",
          render: (h, params) => {
            return h("span", this.types(params.row.role));
          },
          width: 100
        },
        {
          title: "昵称",
          key: "displayName",
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                style: {
                  cursor: "pointer",
                  color: "#20a0ff"
                },
                props: {
                  content: "前往日报表",
                  placement: "top"
                }
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        let time = this.changedTime;

                        if (params.row.role == "1") {
                          this.$router.push({
                            name: "dayCompany",
                            query: {
                              name: "dayCompany",
                              time: time,
                              type: this.gameType,
                              source: this.source
                            }
                          });
                          localStorage.setItem("dayCompany", "dayCompany");
                        } else if (params.row.role == "10") {
                          this.$router.push({
                            name: "dayManager",
                            query: {
                              name: params.row.suffix,
                              time: time,
                              type: this.gameType,
                              source: this.source
                            }
                          });
                          localStorage.setItem("dayManager", "dayManager");
                        } else {
                          this.$router.push({
                            name: "dayMerchant",
                            query: {
                              name: params.row.sn,
                              time: time,
                              type: this.gameType
                            }
                          });
                          localStorage.setItem("dayMerchant", "dayMerchant");
                        }
                      }
                    }
                  },
                  params.row.displayName
                )
              ]
            );
          },
          width: 200
        },
        {
          title: "账号/标识",
          key: "uname",
          render: (h, params) => {
            //console.log(params);
            var name = "";
            if (params.row.role == "1") {
              name = params.row.uname;
            } else if (params.row.role == "10") {
              name = params.row.suffix;
            } else {
              name = params.row.sn;
            }
            return h(
              "Tooltip",
              {
                style: {
                  cursor: "pointer",
                  color: "#20a0ff"
                },
                props: {
                  content: "显示下一级",
                  placement: "top"
                }
              },
              [
                h(
                  "span",
                  {
                    on: {
                      click: async () => {
                        this.spinShow = true;
                        if (params.row.role == "1") {
                          //管理员
                          this.$store
                            .dispatch("getUserChild", {
                              parent: "01",
                              isTest: +this.source,
                              gameType: this.gameType,
                              query: {
                                createdAt: this.changedTime
                              }
                            })
                            .then(res => {
                              this.child = res.payload;
                              this.showName = false;
                              this.playerList = [];
                              this.reportChild = [];
                              this.spinShow = false;
                            });
                        } else if (params.row.role == "100") {
                          //商户
                          this.userName = params.row.displayName;
                          this.showName = true;
                          let userId = params.row.userId;
                          let level = params.row.level;
                          let oldArr = this.reportChild;
                          let len = oldArr.length;
                          if (len > 0) {
                            while (len--) {
                              if (oldArr[len][0].level >= level + 1) {
                                oldArr.splice(len, 1);
                              }
                            }
                          }
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
                            });
                          let anchor = this.$el.querySelector("#playerList");
                          document.documentElement.scrollTop = anchor.offsetTop;
                        } else if (params.row.role == "10") {
                          //线路商
                          this.playerList = [];
                          this.showName = false;
                          let userId = params.row.userId;
                          let level = params.row.level;
                          if (level == 1) {
                            this.reportChild = [];
                          }
                          let oldArr = this.reportChild;
                          let len = oldArr.length;
                          if (len > 0) {
                            while (len--) {
                              if (oldArr[len][0].level > level + 1) {
                                oldArr.splice(len, 1);
                              }
                            }
                          }
                          let showList = await this.getNextLevel(
                            this.reportChild,
                            userId
                          );
                          showList = _.filter(showList, function(o) {
                            return o.length;
                          });
                          this.reportChild = showList;
                        }
                      }
                    }
                  },
                  name
                )
              ]
            );
          }
        },
        {
          title: "交易次数",
          key: "betCount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            for (let item of arr) {
              count += item.betCount;
            }
            if (params.row.role == "1") {
              return h("span", count);
            } else {
              return h("span", params.row.betCount);
            }
          }
        },
        {
          title: "投注金额",
          key: "betAmount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            for (let item of arr) {
              count += item.betAmount;
            }
            if (params.row.role == "1") {
              return h("span", thousandFormatter(count.toFixed(2)));
            } else {
              return h("span", thousandFormatter(params.row.betAmount));
            }
          }
        },
        {
          title: "输赢金额",
          key: "winloseAmount",
          render: (h, params) => {
            let arr = this.child;
            let count = 0;
            for (let item of arr) {
              count += item.winloseAmount;
            }
            let color = "";
            if (params.row.role == "1") {
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
          title: "商家占成",
          key: "",
          render: (h, params) => {
            if (params.row.role != "1") {
              let arr = params.row.gameList;
              let result = null;
              for (let item of arr) {
                if (item.code == this.gameType) {
                  result = item.rate;
                }
              }
              return h("span", result + "%");
            } else {
              return h("span", "100%");
            }
          }
        },
        {
          title: "商家交公司",
          key: "submitAmount",
          render: (h, params) => {
            if (params.row.role == "1") {
              return h("span", 0);
            } else {
              return h("span", thousandFormatter(params.row.submitAmount));
            }
          }
        },
        {
          title: "获利比例",
          key: "rate",
          render: (h, params) => {
            if (params.row.role == "1") {
              let arr = this.child;
              let winloseAmount = 0;
              let mixAmount = 0;
              for (let item of arr) {
                winloseAmount += item.winloseAmount;
                mixAmount += item.mixAmount;
              }
              let result = "";
              if (winloseAmount != 0) {
                result = ((100 * winloseAmount) / mixAmount).toFixed(2) + "%";
              } else {
                result = 0;
              }
              return h("span", result);
            } else {
              return h(
                "span",
                (
                  100 *
                  (params.row.winloseAmount / params.row.mixAmount)
                ).toFixed(2) + "%"
              );
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
          title: "昵称",
          key: "nickname",
          render: (h, params) => {
            return h(
              "Tooltip",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                props: {
                  content: "前往日报表",
                  placement: "top"
                },
                
              },
              [h('span',{
                on: {
                  click: () => {
                    this.$router.push({
                      name: "dayPlayer",
                      query: {
                        name: params.row.userName,
                        time: this.changedTime,
                        type: this.gameType
                      }
                    });
                    localStorage.setItem("dayPlayer", "dayPlayer");
                  }
                }
              },params.row.nickname)]
            );
          }
        },
        {
          title: "账号",
          key: "userName",
          render: (h, params) => {
            //console.log(params);

            let name = params.row.userName;
            return h(
              "Tooltip",
              {
                style: {
                  color: "#20a0ff",
                  cursor: "pointer"
                },
                props: {
                  content: "前往玩家详情",
                  placement: "top"
                },
                
              },[
              h('span',{
                on: {
                  click: () => {
                    localStorage.setItem("playerName", name);
                    this.$router.push({
                      name: "playDetail",
                      query: {
                        name: name
                      }
                    });
                  }
                }
              },name)]
              
            );
          }
        },

        {
          title: "交易次数",
          key: "betCount"
        },
        {
          title: "投注金额",
          key: "betAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.betAmount));
          }
        },
        {
          title: "输赢金额",
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
          title: "洗码量",
          key: "mixAmount"
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

      //console.log(time);

      return time;
    },
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    }
  },

  methods: {
    confirm() {
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;

      this.init();
    },
    claer() {
      this.defaultTime = getDefaultTime();
    },
    changeSource(value) {
      this.init();
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
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
    reset() {
      this.defaultTime = getDefaultTime();
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.init();
    },

    search() {
      this.reportChild = [];
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
            isTest: +this.source,
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
      //console.log(new Date(dayjs().endOf('second').valueOf()));

      let userId = JSON.parse(localStorage.getItem("userInfo")).userId;
      let params1 = { userId: userId, isTest: +this.source };
      let params2 = {
        parent: "01",
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getUserChild", params2);
      this.spinShow = true;
      //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];
      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.child = perms.payload;
      }
    }
  },
  created() {
    // console.log(this.defaultTime);
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    this.init();
  },
  props: ["gameType"]
};
</script>
<style lang="less" scoped>
.report {
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
