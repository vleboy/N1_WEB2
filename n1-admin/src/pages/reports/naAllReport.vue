<template>
  <div class="naAll" :style="{width:getTabWidth}">
    <div class="nowList">
      <div class="top">
        <h2>当前用户列表</h2>
        <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource" size="small" style="margin:0 1rem">
          <Radio label="0" v-if="permission.includes('正式数据')" size="small">正式</Radio>
          <Radio label="1">测试</Radio>
          <Radio label="2" v-if="permission.includes('正式数据')" size="small">全部</Radio>
        </RadioGroup>
        <Button  @click="exportdata('table_0')" size="small" style="margin-right:1rem">导出数据</Button>
        <DatePicker
          type="datetimerange"
          :options="options"
          :editable="false"
          v-model="defaultTime"
          placeholder="选择日期时间范围(默认最近一周)"
          style="width: 300px"
          @on-ok="confirm"
          size="small"
        ></DatePicker>
        <Button type="primary" @click="search" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
        <Button  @click="reset" size="small">重置</Button>
      </div>
      <Table :columns="columns11" :data="user" size="small" ref="table_0">
        <template slot-scope="{row, index}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uname">
          <Tooltip content="显示下一级" placement="top">
            <span @click="unameConfig(row)" style="color:#20a0ff;cursor:pointer">
               {{row.uname}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="betCount">
          <span>{{betCountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="submitAmount">
          <span>{{submitAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5WinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '70000').color}">{{gameWinloseAmount(row, '70000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5SubmitAmount">
          <span>{{gameSubmitAmount(row, '70000')}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5noWinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '90000').color}">{{gameWinloseAmount(row, '90000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5noSubmitAmount">
          <span>{{gameSubmitAmount(row, '90000')}}</span>
        </template>
      </Table>
    </div>
    <div class="childList">
      <p class="title">
        直属下级列表
        <Button  @click="exportdata('table_1')" size="small">导出数据</Button>
      </p>
      <Table :columns="columns11" :data="child" size="small" ref="table_1">
        <template slot-scope="{row, index}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uname">
          <Tooltip content="显示下一级" placement="top">
            <span @click="unameConfig(row)" style="color:#20a0ff;cursor:pointer">
               {{row.uname}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="betCount">
          <span>{{betCountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="submitAmount">
          <span>{{submitAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5WinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '70000').color}">{{gameWinloseAmount(row, '70000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5SubmitAmount">
          <span>{{gameSubmitAmount(row, '70000')}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5noWinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '90000').color}">{{gameWinloseAmount(row, '90000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5noSubmitAmount">
          <span>{{gameSubmitAmount(row, '90000')}}</span>
        </template>
      </Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
        <Button  @click="exportdata(index)">导出数据</Button>
      </p>
      <Table :columns="columns11" :data="item" size="small" :ref="'table'+index">
        <template slot-scope="{row, index}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="uname">
          <Tooltip content="显示下一级" placement="top">
            <span @click="unameConfig(row)" style="color:#20a0ff;cursor:pointer">
              {{row.uname}}
            </span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="betCount">
          <span>{{betCountConfig(row)}}</span>
        </template>
         <template slot-scope="{row, index}" slot="userWinloseAmount">
          <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="submitAmount">
          <span>{{submitAmountConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5WinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '70000').color}">{{gameWinloseAmount(row, '70000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5SubmitAmount">
          <span>{{gameSubmitAmount(row, '70000')}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5noWinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '90000').color}">{{gameWinloseAmount(row, '90000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="h5noSubmitAmount">
          <span>{{gameSubmitAmount(row, '90000')}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName">({{ userName }})</span>所属玩家列表
        <Button  @click="exportdata('table_2')" size="small">导出数据</Button>
      </p>
      <Table :columns="columns22" :data="playerList" size="small" ref="table_2">
        <template slot-scope="{row, index}" slot="playerName">
          <Tooltip content="前往玩家详情">
            <span style="color:#20a0ff;cursor:pointer" @click="playerName(row)">{{row.userName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="playerWinloseAmount">
          <span :style="{color:winloseAmountConfig(row).color}">{{winloseAmountConfig(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pH5WinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '70000').color}">{{gameWinloseAmount(row, '70000').winloseAmount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="pH5noWinloseAmount">
          <span :style="{color:gameWinloseAmount(row, '90000').color}">{{gameWinloseAmount(row, '90000').winloseAmount}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
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
      gameType: [70000, 90000],
      source: "1",
      columns11: [],
      columns22: [],
      columns1: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "类型",
          slot: "role"
        },
        {
          title: "昵称",
          key: "displayName"
        },
        {
          title: "管理员账号",
          slot: "uname"
        },
        {
          title: "交易次数",
          slot: "betCount"
        },
        {
          title: "总游戏输赢金额",
          slot: "userWinloseAmount"
        },
        {
          title: "总游戏交公司",
          slot: "submitAmount"
        },
        {
          title: "NA电子H5(输赢金额)",
          slot: "h5WinloseAmount"
        },
        {
          title: "NA电子H5(商家交公司)",
          slot: "h5SubmitAmount"
        },

        {
          title: "NA电子H5无神秘奖(输赢金额)",
          slot: "h5noWinloseAmount"
        },
        {
          title: "NA电子H5无神秘奖(商家交公司)",
          slot: "h5noSubmitAmount"
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "用户名",
          slot: "playerName"
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
          slot: "playerWinloseAmount"
        },
        {
          title: "NA电子H5(输赢金额)",
          slot: "pH5WinloseAmount"
        },
        {
          title: "NA电子H5无神秘奖(输赢金额)",
          slot: "pH5noWinloseAmount"
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
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    },
    getTabWidth() {
      if (this.columns11.length <= 9) {
        return "100%";
      } else {
        return (this.columns11.length - 9) * 7 + 100 + "%";
      }
    }
  },
  methods: {
    //类型
    roleConfig(row) {
      return this.types(row.role)
    },
    //管理员账号
    async unameConfig(row) {
      this.spinShow = true;
      if (row.role == "1") {
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
            this.reportChild = [];
            this.showName = false;
            this.playerList = [];
            this.spinShow = false;
          });
      } else if (row.role == "100") {
        //商户
        this.userName = row.displayName;
        this.showName = true;
        let userId = row.userId;
        let level = row.level;
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
      } else if (row.role == "10") {
        //线路商
        this.playerList = [];
        this.showName = false;
        let userId = row.userId;
        let level = row.level;
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
    },
    //交易次数
    betCountConfig(row) {
      let arr = this.child;
      let count = 0;
      for (let item of arr) {
        count += item.betCount;
      }
      if (row.role == "1") {
        return count
      } else {
        return row.betCount
      }   
    },
    //总游戏输赢金额
    winloseAmountConfig(row) {
      let arr = this.child;
      let count = 0;
      let color = "";
      if (row.role == "1") {
        for (let item of arr) {
          count += item.winloseAmount;
        }
        color = count < 0 ? "#f30" : "#0c0";
        return {winloseAmount: thousandFormatter(count.toFixed(2)), color}
      } else {
        color = row.winloseAmount < 0 ? "#f30" : "#0c0";
        return {winloseAmount: thousandFormatter(row.winloseAmount), color}
      }   
    },
    //总游戏交公司
    submitAmountConfig(row) {
      if (row.role == "1") {
        return 0
      } else {
        return thousandFormatter(row.submitAmount.toFixed(2))
      }
    },
    //游戏输赢金额
    gameWinloseAmount(row,gameCode) {
      let arr = this.child;
      let count = 0;
      let color = "";
      if (row.role == "1") {
        for (let item of arr) {
          for (let key in item.gameTypeMap) {
            if (key == gameCode) {
              count += item.gameTypeMap[key].winloseAmount;
            }
          }
        }
        color = count < 0 ? "#f30" : "#0c0";
        return {winloseAmount:thousandFormatter(count.toFixed(2)), color}
      } else {
        let winloseAmount = 0;
        if (row.gameTypeMap[gameCode] !== undefined) {
          winloseAmount = row.gameTypeMap[
            gameCode
          ].winloseAmount.toFixed(2);
        }
        color = winloseAmount < 0 ? "#f30" : "#0c0";
        return {winloseAmount:thousandFormatter(winloseAmount), color}
      }  
    },
    //游戏商家交公司
    gameSubmitAmount(row, gameCode) {
      if (row.role == "1") {
        return "0.00"
      } else {
        let submitAmount = 0;
        if (row.gameTypeMap[gameCode] !== undefined) {
          submitAmount = row.gameTypeMap[
            gameCode
          ].submitAmount.toFixed(2);
        }
        return thousandFormatter(submitAmount)
      }  
    },
    /* 玩家 */
    //用户名
    playerName(row) {
      let name = row.userName;
      localStorage.setItem("playerName", name);
      this.$router.push({
        name: "playDetail",
        query: {
          name: name
        }
      })
    },  
    confirm() {
      this.reportChild = [];
      this.playerList = [];
      this.showName = false;
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
      let [acct, perms] = await this.axios.all([req1, req2]);
      this.spinShow = false;
      this.user = [];

      this.columns11 = await _.cloneDeep(this.columns1);
      this.columns22 = await _.cloneDeep(this.columns2);

      let arr = perms.payload;
      let removeArr = [];
      let removeArr1 = [];

      if (getWinloseAmount(arr, ["90000"]) == 0) {
        removeArr.push(9, 10);
        removeArr1.push(6);
      }

      let rs = Array.from(new Set(removeArr));
      let rs1 = Array.from(new Set(removeArr1));

      let flg = true;
      let flg1 = true;

      for (let i = 0; i < rs.length; i++) {
        if (flg) {
          this.columns11.splice(rs[i], 1);
          flg = !flg;
        } else {
          this.columns11.splice(rs[i] - i, 1);
        }
      }

      for (let i = 0; i < rs1.length; i++) {
        if (flg1) {
          this.columns22.splice(rs1[i], 1);
          flg1 = !flg1;
        } else {
          this.columns22.splice(rs1[i] - i, 1);
        }
      }

      rs = [];
      rs1 = [];

      if (acct && acct.code == 0) {
        this.user.push(acct.payload);
      }
      if (perms && perms.code == 0) {
        this.child = perms.payload;
      }
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
.naAll {
  min-height: 87vh;

  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
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
  .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
}
</style>
