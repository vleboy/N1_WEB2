<template>
  <div class="report">
    <div class="nowList">
      <div class="top" style="margin-bottom:1rem">
        <p class="title" style="margin:0">
          当前用户列表
          <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="changeSource" size="small" style="margin:0 1rem">
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
          <!-- <Button  @click="exportdata('table_0')" size="small" style="margin-right:1rem">导出数据</Button> -->
        </p>
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
            size="small"
            
          ></DatePicker>
          <Button type="primary" @click="search" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
          <Button  @click="reset" size="small">重置</Button>
      </div>
      <Table :columns="columns1" :data="user" size="small" ref="table_0">
        <template slot-scope="{row, inedx}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userDisplayName">
          <Tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="userDisplayName(row)">{{row.displayName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="userAccount">
          <Tooltip content="显示下一级" placement="top">
            <span style="cursor:pointer;color:#20a0ff" @click="userAccount(row)">{{userAccountConfig(row)}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="betCount">
          <span>{{betCount(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userBetAmount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="rate">
          <span>{{rateConfig(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="submitAmount">
          <span>{{submitAmount(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="mixAmount">
          <span>{{mixAmount(row)}}</span>
        </template>
      </Table>
    </div>
    <div class="childList">
      <p class="title">
        直属下级列表
        <!-- <Button  @click="exportdata('table_1')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns1" :data="child" size="small" ref="table_1">
        <template slot-scope="{row, inedx}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userDisplayName">
          <Tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="userDisplayName(row)">{{row.displayName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="userAccount">
          <Tooltip content="显示下一级" placement="top">
            <span style="cursor:pointer;color:#20a0ff" @click="userAccount(row)">{{userAccountConfig(row)}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="betCount">
          <span>{{betCount(row)}}</span>
        </template>
         <template slot-scope="{row, inedx}" slot="userBetAmount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="rate">
          <span>{{rateConfig(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="submitAmount">
          <span>{{submitAmount(row)}}</span>
        </template>
         <template slot-scope="{row, inedx}" slot="mixAmount">
          <span>{{mixAmount(row)}}</span>
        </template>
      </Table>
    </div>
    <div class="childList" v-for="(item,index) in reportChild" :key="index">
      <p class="title">
        ({{item.length > 0 && item[0].parentDisplayName ? item[0].parentDisplayName : ''}}) 直属下级列表
        <!-- <Button  @click="exportdata(index)">导出数据</Button> -->
      </p>
      <Table :columns="columns1" :data="item" size="small" :ref="'table'+index">
        <template slot-scope="{row, inedx}" slot="role">
          <span>{{roleConfig(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userDisplayName">
          <Tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="userDisplayName(row)">{{row.displayName}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="userAccount">
          <Tooltip content="显示下一级" placement="top">
            <span style="cursor:pointer;color:#20a0ff" @click="userAccount(row)">{{userAccountConfig(row)}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="betCount">
          <span>{{betCount(row)}}</span>
        </template>
         <template slot-scope="{row, inedx}" slot="userBetAmount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="userWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="rate">
          <span>{{rateConfig(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="submitAmount">
          <span>{{submitAmount(row)}}</span>
        </template>
         <template slot-scope="{row, inedx}" slot="mixAmount">
          <span>{{mixAmount(row)}}</span>
        </template>
      </Table>
    </div>
    <div class="playerList" id="playerList">
      <p class="title">
        <span v-show="showName">({{ userName }})</span>所属玩家列表
        <!-- <Button  @click="exportdata('table_2')" size="small">导出数据</Button> -->
      </p>
      <Table :columns="columns2" :data="playerList" size="small" ref="table_2">
        <template slot-scope="{row, inedx}" slot="playerNickname">
          <Tooltip content="前往日报表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="playerNickname(row)">{{row.nickname == "NULL!" ? "-" : row.nickname}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, inedx}" slot="playerUsername">
          <Tooltip content="前往玩家详情" placement="top">
            <span style="color:#21a0ff;cursor:pointer" @click="playerUsername(row)">{{row.userName}}</span>
          </Tooltip>
        </template>
         <template slot-scope="{row, inedx}" slot="playerBetAmount">
          <span>{{betAmount(row)}}</span>
        </template>
        <template slot-scope="{row, inedx}" slot="playerWinloseAmount">
          <span :style="{color:winloseAmount(row).color}">{{winloseAmount(row).winloseAmount}}</span>
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
        },
        {
          title: "类型",
          slot: "role",
        },
        {
          title: "昵称",
          slot: "userDisplayName"
        },
        {
          title: "账号/标识",
          slot: "userAccount"
        },
        {
          title: "交易次数",
          slot: "betCount"
        },
        {
          title: "投注金额",
          slot: "userBetAmount"
        },
        {
          title: "输赢金额",
          slot: "userWinloseAmount"
        },
        {
          title: "商家占成",
          slot: "rate"
        },
        {
          title: "商家交公司",
          slot: "submitAmount"
        },
        {
          title: "获利比例",
          slot: "mixAmount"
        }
      ],
      columns2: [
        {
          title: "序号",
          type: "index"
        },
        {
          title: "昵称",
          slot: "playerNickname"
        },
        {
          title: "账号",
          slot: "playerUsername"
        },

        {
          title: "交易次数",
          key: "betCount"
        },
        {
          title: "投注金额",
          slot: "playerBetAmount"
        },
        {
          title: "输赢金额",
          slot: "playerWinloseAmount"
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
    /* 用户 */
    //类型
    roleConfig(row) {
      return this.types(row.role)
    },
    //用户昵称
    userDisplayName(row) {
      
      let time = this.changedTime;

      if (row.role == "1") {
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
      } else if (row.role == "10") {
        this.$router.push({
          name: "dayManager",
          query: {
            name: row.suffix,
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
            name: row.sn,
            time: time,
            type: this.gameType
          }
        });
        localStorage.setItem("dayMerchant", "dayMerchant");
      }   
    },
    //账号/标识
    userAccountConfig(row) {
      if (row.role == "1") {
        return row.uname
      } else if (row.role == "10") {
        return row.suffix
      } else {
        return row.sn
      }
    },
    async userAccount(row) {
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
              this.showName = false;
              this.playerList = [];
              this.reportChild = [];
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
    betCount(row) {
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
    //投注金额
    betAmount(row) {
      let arr = this.child;
      let count = 0;
      for (let item of arr) {
        count += item.betAmount;
      }
      if (row.role == "1") {
        return thousandFormatter(count.toFixed(2))
      } else {
        return thousandFormatter(row.betAmount)
      }
          
    },
    //输赢金额
    winloseAmount(row) {
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
    //商家占成
    rateConfig(row) {
      if (row.role != "1") {
        let arr = row.gameList;
        let result = null;
        for (let item of arr) {
          if (item.code == this.gameType) {
            result = item.rate;
          }
        }
        return result + "%"
      } else {
        return"100%"
      }
          
    },
    //商家交公司
    submitAmount(row) {
      if (row.role == "1") {
        return 0
      } else {
        return thousandFormatter(row.submitAmount)
      }     
    },
    //获利比例
    mixAmount(row) {
      if (row.role == "1") {
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
        return result
      } else {
        return  (100 * row.winloseAmount / row.mixAmount).toFixed(2) + "%"
      }
    },   
    /* 玩家 */
    //昵称
    playerNickname(row) {
      this.$router.push({
        name: "dayPlayer",
        query: {
          name: row.userName,
          time: this.changedTime,
          type: this.gameType
        }
      })
      localStorage.setItem("dayPlayer", "dayPlayer")    
    },
    //账号
    playerUsername(row) {
      localStorage.setItem("playerName", row.userName);
      this.$router.push({
        name: "playDetail",
        query: {
          name: row.userName,
          time: this.changedTime,
          type: this.gameType
        }
      })
      localStorage.setItem("playDetail", "playDetail")
    },












































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
    margin: 1rem 0;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    display: flex;
    align-items: center;
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
