<template>
  <v-layout row wrap>
    <v-speed-dial fixed top right direction="bottom" transition="scale-transition">
      <template v-slot:activator>
        <v-btn fab>
          <v-icon size="40" color="blue-grey">settings</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="blue-grey" @click="dialogEdit = true">
        <v-icon size="25">edit</v-icon>
      </v-btn>
      <v-btn fab dark small color="red darken-4" @click="logout">
        <v-icon size="30">exit_to_app</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-flex xs12>
      <v-btn-toggle mandatory style="width:100%" class="pl-1">
        <v-btn large flat value="left">上月</v-btn>
        <v-btn large flat value="center">上周</v-btn>
        <v-btn large flat value="right">本月</v-btn>
        <v-btn large flat value="justify">本周</v-btn>
      </v-btn-toggle>
    </v-flex>
    <v-flex xs12>
      <v-list subheader two-line>
        <v-subheader>
          玩家输赢报表
          <v-spacer></v-spacer>
        </v-subheader>
        <template v-for="(item,index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="()=>{}">
            <v-list-tile-avatar>
              <v-icon :color="item.state ? 'black' : 'grey'" size="36">mood</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
              <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
              <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-flex>
    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">修改登录密码</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field v-model="username" prepend-icon="person" label="帐号" readonly required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="password" prepend-icon="lock" label="输入新密码" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed @click="dialogEdit = false">取消</v-btn>
          <v-btn dark depressed @click="dialogEdit = false">确认修改</v-btn>
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
      items: [
        {
          active: true,
          title: "玩家001",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          active: true,
          title: "玩家002",
          subtitle: "输赢金额1000",
          action: "投注次数：10",
          state: 1
        },
        {
          title: "玩家003",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          title: "玩家004",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          title: "玩家005",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          title: "玩家006",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          title: "玩家007",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          title: "玩家008",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        },
        {
          title: "玩家009",
          subtitle: "输赢金额1000",
          action: "投注次数：10"
        }
      ],
      dialogEdit: false,
      username: "代理001",
      password: ""
    };
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({ path: "/" });
    }
  }
};
</script>
