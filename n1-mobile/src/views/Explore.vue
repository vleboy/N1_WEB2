<template>
  <v-layout row wrap>
    <v-speed-dial fixed top right direction="bottom" transition="scale-transition">
      <template v-slot:activator>
        <v-btn fab>
          <v-icon size="40" color="blue-grey">settings</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="blue-grey" @click="openEdit">
        <v-icon size="25">edit</v-icon>
      </v-btn>
      <v-btn fab dark small color="red darken-4" @click="logout">
        <v-icon size="30">exit_to_app</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-flex xs12>
      <v-btn-toggle mandatory style="width:100%" class="pl-2" @change="changeTime">
        <v-btn large flat value="week">本周</v-btn>
        <v-btn large flat value="month">本月</v-btn>
        <v-btn large flat value="lastWeek">上周</v-btn>
        <v-btn large flat value="lastMonth">上月</v-btn>
      </v-btn-toggle>
    </v-flex>
    <v-flex xs12>
      <v-list subheader two-line>
        <v-subheader>
          玩家输赢报表
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-subheader>
        <template v-for="(item,index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="()=>{}">
            <v-list-tile-avatar>
              <v-icon :color="item.state ? 'teal' : 'grey'" size="36">face</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.userName }}</v-list-tile-title>
              <v-list-tile-sub-title>洗码量: {{ item.mixAmount }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>投注次数: {{ item.betCount }}</v-list-tile-action-text>
              <v-list-tile-action-text>投注金额: {{ item.betAmount }}</v-list-tile-action-text>
              <v-list-tile-action-text>输赢金额: {{ item.winloseAmount }}</v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-flex>
    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">修改登录密码 | {{username}}</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  label="输入新密码"
                  required
                  maxlength="16"
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed @click="dialogEdit = false">取消</v-btn>
          <v-btn dark depressed @click="updateUserPassword">确认修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  created() {},
  data() {
    return {
      items: [],
      dialogEdit: false,
      username: JSON.parse(localStorage.getItem("token")).username,
      password: "",
      startTime: getWeekStartDate().getTime(),
      endTime: getWeekEndDate().getTime()
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ name: "login", params: {} });
    },
    openEdit() {
      this.password = "";
      this.dialogEdit = true;
    },
    async updateUserPassword() {
      await this.$store.dispatch("updateUserPassword", {
        userId: JSON.parse(localStorage.getItem("token")).userId,
        password: this.password
      });
      this.dialogEdit = false;
      this.$store.commit("setErr", true);
      this.$store.commit("setErrMsg", "登录密码已修改");
      this.$store.commit("setErrColor", "success");
    },
    async changeTime(e) {
      switch (e) {
        case "week":
          this.startTime = getWeekStartDate().getTime();
          this.endTime = Date.now();
          break;
        case "month":
          this.startTime = getMonthStartDate().getTime();
          this.endTime = Date.now();
          break;
        case "lastWeek":
          this.startTime = getLastWeekStartDate().getTime();
          this.endTime = getLastWeekEndDate().getTime();
          break;
        case "lastMonth":
          this.startTime = getLastMonthStartDate().getTime();
          this.endTime = getLastMonthEndDate().getTime();
          break;
        default:
          this.startTime = getWeekStartDate().getTime();
          this.endTime = Date.now();
          break;
      }
      // 获取输赢报表
      let res = await this.$store.dispatch("getReportList", {
        startTime: +this.startTime,
        endTime: +this.endTime
      });
      this.items = res.payload;
    }
  }
};

/**
 * 获取上周、本周、上月、本月、上季度、本季度的开始日期、结束日期 start
 * 获取上月开始结束日期考虑了年份的变化
 */
var now = new Date(); //当前日期
var nowDayOfWeek = now.getDay() - 1; //今天本周的第几天
var nowDay = now.getDate(); //当前日
var nowMonth = now.getMonth(); //当前月
var nowYear = now.getYear(); //当前年
nowYear += nowYear < 2000 ? 1900 : 0; //
var lastMonthDate = new Date(); //上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
var lastYear = lastMonthDate.getYear();
var lastMonth = lastMonthDate.getMonth();
//获得某月的天数
function getMonthDays(myMonth) {
  var monthStartDate = new Date(nowYear, myMonth, 1);
  var monthEndDate = new Date(nowYear, myMonth + 1, 1);
  var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}
//获得本季度的开始月份
function getQuarterStartMonth() {
  var quarterStartMonth = 0;
  if (nowMonth < 3) {
    quarterStartMonth = 0;
  }
  if (2 < nowMonth && nowMonth < 6) {
    quarterStartMonth = 3;
  }
  if (5 < nowMonth && nowMonth < 9) {
    quarterStartMonth = 6;
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}
//获得本周的开始日期
function getWeekStartDate() {
  return new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
}
//获得本周的结束日期
function getWeekEndDate() {
  return new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
}
//获得上周的开始日期
function getLastWeekStartDate() {
  return new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 7);
}
//获得上周的结束日期
function getLastWeekEndDate() {
  return new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 1);
}
//获得本月的开始日期
function getMonthStartDate() {
  return new Date(nowYear, nowMonth, 1);
}
//获得本月的结束日期
function getMonthEndDate() {
  return new Date(nowYear, nowMonth, getMonthDays(nowMonth));
}
//获得上月开始时间
function getLastMonthStartDate() {
  if (lastMonth == 11) {
    var lastMonthStartDate = new Date(nowYear - 1, lastMonth, 1);
  } else {
    var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  }
  return lastMonthStartDate;
}
//获得上月结束时间
function getLastMonthEndDate() {
  if (lastMonth == 11) {
    var lastMonthEndDate = new Date(
      nowYear - 1,
      lastMonth,
      getMonthDays(lastMonth)
    );
  } else {
    var lastMonthEndDate = new Date(
      nowYear,
      lastMonth,
      getMonthDays(lastMonth)
    );
  }
  return lastMonthEndDate;
}
//获得本季度的开始日期
function getQuarterStartDate() {
  return new Date(nowYear, getQuarterStartMonth(), 1);
}
//或的本季度的结束日期
function getQuarterEndDate() {
  var quarterEndMonth = getQuarterStartMonth() + 2;
  return new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));
}
/**
 * 获取时间 end
 */
</script>
