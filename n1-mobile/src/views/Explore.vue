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
      <v-card color="grey darken-1" dark>
        <v-card-title primary-title class="py-2">
          <div>
            <div class="headline">{{total}}（洗码量）</div>
          </div>
        </v-card-title>
      </v-card>
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
import TimeUtil from "../plugins/time.js";
export default {
  created() {},
  data() {
    return {
      items: [],
      dialogEdit: false,
      username: JSON.parse(localStorage.getItem("token")).username,
      password: "",
      startTime: TimeUtil.getWeekStartDate().getTime(),
      endTime: TimeUtil.getWeekEndDate().getTime(),
      total: 0
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
          this.startTime = TimeUtil.getWeekStartDate().getTime();
          this.endTime = Date.now();
          break;
        case "month":
          this.startTime = TimeUtil.getMonthStartDate().getTime();
          this.endTime = Date.now();
          break;
        case "lastWeek":
          this.startTime = TimeUtil.getLastWeekStartDate().getTime();
          this.endTime = TimeUtil.getLastWeekEndDate().getTime();
          break;
        case "lastMonth":
          this.startTime = TimeUtil.getLastMonthStartDate().getTime();
          this.endTime = TimeUtil.getLastMonthEndDate().getTime();
          break;
        default:
          this.startTime = TimeUtil.getWeekStartDate().getTime();
          this.endTime = Date.now();
          break;
      }
      // 获取输赢报表
      let res = await this.$store.dispatch("getReportList", {
        startTime: +this.startTime,
        endTime: +this.endTime
      });
      this.items = res.payload;
      this.total = this.items.reduce((acc, cur) => {
        return acc + cur.mixAmount;
      }, 0);
      this.total = this.total.toFixed(2);
    }
  }
};
</script>
