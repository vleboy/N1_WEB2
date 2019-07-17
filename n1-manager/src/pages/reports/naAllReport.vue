<template>
  <div class="naAll" :style="{width:getTabWidth}">
    <div class="nowList">
      <div class="top">
        <p class="title">
          {{$t('allReport.currentUser')}}
          <RadioGroup v-model="source" type="button" @on-change='changeSource' size="small">
             <Radio label="0">{{$t('allReport.formal')}}</Radio>
              <Radio label="1">{{$t('allReport.test')}}</Radio>
              <Radio label="2">{{$t('allReport.all')}}</Radio>
          </RadioGroup>
         <!-- <Button @click="exportdata('table_0')" size="small">导出数据</Button> -->
        </p>
        <div class="right">
          <DatePicker size="small" type="datetimerange" :options="options" :editable='false' v-model="defaultTime" placeholder="选择日期时间范围(默认最近一周)" style="width: 300px" @on-ok="confirm"></DatePicker>
          <Button type="primary" @click="search" size="small" style="margin: 0 .3rem 0 1rem">{{$t('allReport.search')}}</Button>
          <Button @click="reset" size="small">{{$t('allReport.reset')}}</Button>
        </div>
      </div>
      <Table :columns="columns11" :data="user" size="small" ref='table_0'>
        <template slot-scope="{row, index}" slot="userDisplayName">
          <span>{{row.displayName == 'NULL!' ? '-' : row.displayName}}</span>
        </template>
      </Table>
    </div>
    <div class="childList">
      <p class="title">
        {{$t('allReport.under')}}
        <!-- <Button @click="exportdata('table_1')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns11" :data="child" size="small" ref='table_1'>
        <template slot-scope="{row, index}" slot="userDisplayName">
          <span>{{row.displayName == 'NULL!' ? '-' : row.displayName}}</span>
        </template>
      </Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) {{$t('allReport.under')}}
        <!-- <Button @click="exportdata(index)" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns11" :data="item" size="small" :ref="'table'+index">
        <template slot-scope="{row, index}" slot="userDisplayName">
          <span>{{row.displayName == 'NULL!' ? '-' : row.displayName}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName"> ({{ userName }})</span>{{$t('allReport.PlayerList')}}
        <!-- <Button @click="exportdata('table_2')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns22" :data="playerList" size="small" ref='table_2'>
        <template slot-scope="{row, index}" slot="playerNickname">
          <span>{{row.nickname == 'NULL!' ? '-' : row.nickname}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>{{$t('allReport.loading')}}</div>
    </Spin>
  </div>
</template>
<script>
import _ from "lodash";
import dayjs from "dayjs";
import { getDefaultTime } from "@/config/getDefaultTime";
import { thousandFormatter } from "@/config/format";
import { getWinloseAmount } from "@/config/getWinloseAmount";
export default {
  data() {
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
      gameType: [70000,90000],
      columns11: [],
      columns22: [],
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
                      this.playerList=[]
                      let id = localStorage.loginId;
                      if ((params.row.userId = id)) {
                        this.$store
                          .dispatch("getUserChild", {
                            parent: id,
                            isTest:+this.source,
                            gameType: this.gameType,
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
                        showList = _.filter(showList, function(o) {
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '总游戏输赢金额' : 'Win/Lose Amount'
            )
          }
        },
        {
          title: "总游戏交公司",
          key: "submitAmount",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.submitAmount));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '总游戏交公司' : 'Submit Amount'
            )
          }
        },
        {
          title: "NA电子H5(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let color = "";
            let winloseAmount = 0;
            if (params.row.gameTypeMap) {
              if (params.row.gameTypeMap["70000"] !== undefined) {
                winloseAmount = params.row.gameTypeMap[
                  "70000"
                ].winloseAmount.toFixed(2);
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
            } else {
              return h("span", { style: { color: "#0c0" } }, 0);
            }
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA游戏(输赢金额)' : 'NA H5 Video(win/lose amount)'
            )
          }
        },
        {
          title: "NA电子H5(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            let submitAmount = 0;
            if (params.row.gameTypeMap) {
              if (params.row.gameTypeMap["70000"] !== undefined) {
                submitAmount = params.row.gameTypeMap[
                  "70000"
                ].submitAmount.toFixed(2);
              }
              return h("span", thousandFormatter(submitAmount));
            } else {
              return h("span", "0.00");
            }
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA游戏(商家交公司)' : 'NA H5 Video(submit amount)'
            )
          }
        },
        {
          title: "NA电子H5无神秘奖(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let color = "";
            let winloseAmount = 0;
            if (params.row.gameTypeMap) {
              if (params.row.gameTypeMap["90000"] !== undefined) {
                winloseAmount = params.row.gameTypeMap[
                  "90000"
                ].winloseAmount.toFixed(2);
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
            } else {
              return h("span", { style: { color: "#0c0" } }, 0);
            }
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA电子H5无神秘奖(输赢金额)' : 'NA H5 Video Without Mystery Award game(win/lose Amount)'
            )
          }
        },
        {
          title: "NA电子H5无神秘奖(商家交公司)",
          key: "submitAmount",
          render: (h, params) => {
            let submitAmount = 0;
            if (params.row.gameTypeMap) {
              if (params.row.gameTypeMap["90000"] !== undefined) {
                submitAmount = params.row.gameTypeMap[
                  "90000"
                ].submitAmount.toFixed(2);
              }
              return h("span", thousandFormatter(submitAmount));
            } else {
              return h("span", "0.00");
            }
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA游戏(商家交公司)' : 'NA H5 Video Without Mystery(submit amount)'
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
              this.$store.state.language == 'zh' ? '交易次数' : 'Transactions count'
            )
          }
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '总游戏输赢金额' : 'Win/Lose Amount'
            )
          }
        },
         {
          title: "NA电子H5(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let winloseAmount = 0;
            if (params.row.gameTypeMap["70000"] !== undefined) {
              winloseAmount = params.row.gameTypeMap[
                "70000"
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA电子H5(输赢金额)' : 'NA H5 Video(win/lose amount)'
            )
          }
        },
        {
          title: "NA电子H5无神秘奖(输赢金额)",
          key: "winloseAmount",
          render: (h, params) => {
            let winloseAmount = 0;
            if (params.row.gameTypeMap["90000"] !== undefined) {
              winloseAmount = params.row.gameTypeMap[
                "90000"
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
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? 'NA电子H5无神秘奖(输赢金额)' : 'NA H5 Video Without Mystery(win/lose amount)'
            )
          }
        }
      ]
    };
  },
  computed: {
    options() {
      return {
        shortcuts: [
          {
            text: this.$store.state.language == 'zh' ? '本周' : 'week',
            value() {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '本月' : 'month',
            value() {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上周' : 'last week',
            value() {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: this.$store.state.language == 'zh' ? '上月' : 'last month',
            value() {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      }
    },
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
    getTabWidth() {
      if (this.columns11.length <= 9) {
        return '100%'
      } else {
        return ((this.columns11.length) - 9) * 7 + 100 + '%'
      }
    }
  },
  methods: {
    confirm() {
      this.reportChild = [];
      this.init();
    },
    exportdata(table) {
      if(table=='table_0'){
        this.$refs.table_0.exportCsv({filename:'current'});
      }else if(table=='table_1'){
        this.$refs.table_1.exportCsv({filename:'next'});
      }else if(table=='table_2'){
        this.$refs.table_2.exportCsv({filename:'player'});
      }else{
        let ref='table'+table;
        this.$refs[ref][0].exportCsv({filename:ref})
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
    },
    reset() {
      this.defaultTime = getDefaultTime();
      this.reportChild = [];

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
      let userId = JSON.parse(localStorage.getItem("userInfo")).userId;
      this.playerList=[]
      let params1 = {
        userId: userId,
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let params2 = {
        parent: userId,
        isTest: +this.source,
        gameType: this.gameType,
        query: {
          createdAt: this.changedTime
        }
      };
      let req1 = this.$store.dispatch("getUserList", params1);
      let req2 = this.$store.dispatch("getUserChild", params2);
      this.spinShow = true;
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];

      this.columns11 = await _.cloneDeep(this.columns1)
      this.columns22 = await _.cloneDeep(this.columns2)

      let arr = perms.payload
      let removeArr = []
      let removeArr1 = []

      if (getWinloseAmount(arr, ["90000"]) == 0) {
        removeArr.push(9,10)
        removeArr1.push(6)
      }

      let rs = Array.from(new Set(removeArr));
      let rs1 = Array.from(new Set(removeArr1));
  
      let flg = true
      let flg1 = true
    
      for (let i = 0; i < rs.length; i++) {
        if (flg) {
          this.columns11.splice(rs[i], 1)
          flg = !flg
        } else {
          this.columns11.splice(rs[i] - i, 1)   
        }
          
      }

      for (let i = 0; i < rs1.length; i++) {
        if (flg1) {
          this.columns22.splice(rs1[i], 1)
          flg1 = !flg1
        } else {
          this.columns22.splice(rs1[i] - i, 1)   
        }
          
      }


      rs = []
      rs1 = []

      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.child = perms.payload;
      }
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.naAll {
  min-height: 87vh;
  width: 150%;
  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    margin-bottom: 1rem;
    .right {
      display: inline-block;
      padding-left: 20px;
    }
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
