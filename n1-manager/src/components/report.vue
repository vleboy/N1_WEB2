<template>
  <div class="report">
    <div class="nowList">
      <div class="top">
        <p class="title">
          {{$t('allReport.currentUser')}}
          <RadioGroup v-model="source" type="button" @on-change="changeSource" size="small">
            <Radio label="0">{{$t('allReport.formal')}}</Radio>
            <Radio label="1">{{$t('allReport.test')}}</Radio>
            <Radio label="2">{{$t('allReport.all')}}</Radio>
          </RadioGroup>
          <!-- <Button size="small" @click="exportdata('table_0')" style="margin:0 1rem">导出数据</Button> -->
        </p>
        <div class="right">
          <DatePicker
            size="small"
            type="datetimerange"
            :options="options"
            :editable="false"
            v-model="defaultTime"
            placeholder="选择日期时间范围(默认最近一周)"
            style="width: 300px;margin-left:1rem"
            @on-ok="confirm"
          ></DatePicker>
          <Button
            type="primary"
            @click="search"
            size="small"
            style="margin:0 .3rem 0 1rem"
          >{{$t('allReport.search')}}</Button>
          <Button size="small" @click="reset">{{$t('allReport.reset')}}</Button>
        </div>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref="table_0">
        <template slot-scope="{row, index}" slot="userDisplayName">
          <Tooltip content="前往日报表" transfer>
            <span
              style="color:#20a0ff;cursor:pointer"
              @click="userDisplayName(row)"
            >{{row.displayName}}</span>
          </Tooltip>
        </template>
      </Table>
    </div>
    <div class="childList">
      <p class="title">
        {{$t('allReport.under')}}
        <!-- <Button size="small" @click="exportdata('table_1')">导出数据</Button> -->
      </p>
      <Table :columns="columns1" :data="child" size="small" ref="table_1">
        <template slot-scope="{row, index}" slot="userDisplayName">
          <Tooltip :content="$t('allReport.toDayReport')" transfer>
            <span
              style="color:#20a0ff;cursor:pointer"
              @click="userDisplayName(row)"
            >{{row.displayName}}</span>
          </Tooltip>
        </template>
      </Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) {{$t('allReport.under')}}
        <!-- <Button size="small" @click="exportdata(index)">导出数据</Button> -->
      </p>
      <Table :columns="columns1" :data="item" size="small" :ref="'table'+index">
        <template slot-scope="{row, index}" slot="userDisplayName">
          <Tooltip :content="$t('allReport.toDayReport')" transfer>
            <span
              style="color:#20a0ff;cursor:pointer"
              @click="userDisplayName(row)"
            >{{row.displayName}}</span>
          </Tooltip>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName">({{ userName }})</span>
        {{$t('allReport.PlayerList')}}
        <!-- <Button size="small" @click="exportdata('table_2')">导出数据</Button> -->
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref="table_2">
        <template slot-scope="{row, index}" slot="playerNickname">
          <span>{{row.nickname == 'NULL!' ? '-' : row.nickname}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>{{$t('allReport.loading')}}</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import { thousandFormatter } from "@/config/format";
import { spawn } from 'child_process';
import util from "@/libs/util.js";
export default {
  data () {
    return {

      defaultTime: getDefaultTime(),
      spinShow: false, //加载spin
      showName: false, //上级商家
      userName: "", //上级商家名字
      reportChild: [], //点击渲染的下级
      playerList: [], //玩家列表
      user: [], //当前管理员
      child: [], //管理员下级
      source: "0",
      // option: {
      //   disabledDate(date) {
      //     return date && date.valueOf() > Date.now() - 180000;
      //   }
      // },
      columns1: [
        {
          title: "序号",
          type: "index",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "类型",
          key: "role",
          render: (h, params) => {
            return h("span", this.types(params.row.role));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '类型' : 'Type'
            )
          }
        },
        {
          title: "昵称",
          slot: "userDisplayName",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '昵称' : 'Nickname'
            )
          }
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
                    if (params.row.role == "100") {
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
                      this.playerList = []
                      let id = localStorage.loginId;
                      if ((params.row.userId == id)) {
                        this.$store
                          .dispatch("getUserChild", {
                            parent: id,
                            gameType: this.gameType,
                            isTest: +this.source,
                            query: {
                              createdAt: this.changedTime
                            }
                          })
                          .then(res => {
                            this.child = res.payload;
                            this.spinShow = false;
                          });
                      } else {
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
                        showList = _.filter(showList, function (o) {
                          return o.length;
                        });
                        this.reportChild = showList;
                      }
                    }
                  }
                }
              },
              params.row.uname
            );
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '管理员账号' : 'Account'
            )
          }
        },
        {
          title: "交易次数",
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易次数' : 'Transactions Count'
            )
          }
        },
        {
          title: "投注金额",
          key: "betAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.betAmount));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '投注金额' : 'Bet Amount'
            )
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "商家占成",
          key: "",
          render: (h, params) => {
            if (params.row.role != "1") {
              let arr = params.row.gameList;
              let result = 0;
              for (let item of arr) {
                if (item.code == this.gameType) {
                  result = item.rate;
                }
              }
              return h("span", result + "%");
            } else {
              return h("span", "100%");
            }
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商家占成' : 'Merchant Occupies'
            )
          }
        },
        {
          title: "商家交公司",
          key: "submitAmount",
          render: (h, params) => {
            return h('span', thousandFormatter(params.row.submitAmount))
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商家交公司' : 'Submit Amount'
            )
          }
        },
        {
          title: "获利比例",
          key: "rate",
          render: (h, params) => {
            let userId = localStorage.loginId;
            if (params.row.userId == userId) {
              let arr = this.child;
              let winloseAmount = 0;
              let mixAmount = 0;
              for (let item of arr) {
                winloseAmount += item.winloseAmount;
                mixAmount += item.mixAmount;
              }
              let result = "";
              if (winloseAmount != 0) {
                result = (100 * winloseAmount / mixAmount).toFixed(2) + "%";
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '获利比例' : 'Profit'
            )
          }
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
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
                  cursor: 'pointer'
                },
                on: {
                  click: () => {
                    localStorage.setItem("playerName", name);
                    this.$router.push({
                      name: "playDetail",
                      query: {
                        name: name,
                        time: this.changedTime,
                        type: this.gameType
                      }
                    });
                    localStorage.setItem("playDetail", "playDetail")
                  }
                }
              },
              name
            );
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '用户名' : 'Username'
            )
          }
        },
        {
          title: "昵称",
          slot: "playerNickname",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '昵称' : 'Nickname'
            )
          }
        },
        {
          title: "交易次数",
          key: "betCount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易次数' : 'Transactions Count'
            )
          }
        },
        {
          title: "投注金额",
          key: "betAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.betAmount));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '投注金额' : 'Bet Amount'
            )
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "洗码量",
          key: "mixAmount",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '洗码量' : 'Washing quantity'
            )
          }
        }
      ]
    };
  },
  computed: {
    options () {
      return {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
            value () {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
            value () {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
            value () {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
            value () {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      }
    },
    changedTime () {
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
  },
  methods: {
    /* 用户列表 */
    //昵称
    userDisplayName (row) {
      let time = this.changedTime
      if (row.role == 10) {
        this.$router.push({ name: "dayCompany", query: { time: time, type: this.gameType } })
        localStorage.setItem('dayCompany', 'dayCompany')
      } else {
        this.$router.push({ name: "dayMerchant", query: { name: row.sn, time: time, type: this.gameType } })
        localStorage.setItem('dayMerchant', 'dayMerchant')
      }
    },
    /* 玩家列表 */















































































    confirm () {
      this.reportChild = [];
      this.init();
    },
    exportdata (table) {
      if (table == 'table_0') {
        this.$refs.table_0.exportCsv({ filename: 'current' });
      } else if (table == 'table_1') {
        this.$refs.table_1.exportCsv({ filename: 'next' });
      } else if (table == 'table_2') {
        this.$refs.table_2.exportCsv({ filename: 'player' });
      } else {
        let ref = 'table' + table;
        this.$refs[ref][0].exportCsv({ filename: ref })
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
    changeSource () {
      this.init();
    },
    reset () {
      this.defaultTime = getDefaultTime();
      this.reportChild = [];
      this.source = '0'
      this.init();
    },
    search () {
      this.reportChild = [];
      this.init();
    },
    types (value) {
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
    async getNextLevel (showList, userId) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch("getUserChild", {
            parent: userId,
            gameType: this.gameType,
            isTest: +this.source,
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
    async init () {
      let userId = JSON.parse(localStorage.getItem("userInfo")).userId;
      this.spinShow = true;
      this.playerList = []
      let params1 = {
        userId: userId,
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: [
            util.timeZoneConversion(this.changedTime[0], this.$store.state.timeZone),
            util.timeZoneConversion(this.changedTime[1], this.$store.state.timeZone)
          ]
        }
      };
      let params2 = {
        parent: userId,
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: [
            util.timeZoneConversion(this.changedTime[0], this.$store.state.timeZone),
            util.timeZoneConversion(this.changedTime[1], this.$store.state.timeZone)
          ]
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getUserChild", params2);
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
  created () {
    // console.log(this.defaultTime);
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
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper {
    border: 1px solid #ccc;
    color: #000;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
  /deep/.ivu-select-selection {
    border-color: #000;
  }
  /deep/ .ivu-picker-panel-shortcut {
    padding: 6px 5px;
  }
}
</style>
