<template>
  <v-layout row wrap>
    <v-btn fab fixed top right @click="openReg">
      <v-avatar>
        <v-icon size="40" color="blue-grey">person_add</v-icon>
      </v-avatar>
    </v-btn>
    <v-flex xs12>
      <v-btn-toggle mandatory style="width:100%" class="pl-2">
        <v-btn large flat value="left">今日实时洗码量</v-btn>
        <v-btn large flat value="center">今日实时投注次数</v-btn>
      </v-btn-toggle>
    </v-flex>
    <v-flex xs12>
      <v-card color="blue-grey darken-1" dark>
        <v-card-title primary-title class="py-2">
          <div>
            <div class="headline">
              <animate-number
                ref="num0"
                from="0"
                to="2000.55"
                duration="1000"
                easing="easeInQuad"
                :formatter="num => new Intl.NumberFormat().format(num)"
              ></animate-number>
            </div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>

    <v-flex xs12>
      <v-list subheader two-line>
        <v-subheader>
          活跃玩家列表
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-subheader>
        <template v-for="(item,index) in items">
          <v-list-tile :key="item.userName" avatar ripple @click="()=>{}">
            <v-list-tile-avatar @click="openEdit(item)">
              <v-icon :color="item.state ? 'teal' : 'grey'" size="36">face</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content @click="openEdit(item)">
              <v-list-tile-title>{{ item.userName }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ `余额:${item.balance}` }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action @click="openURL(item)">
              <v-list-tile-action-text>{{ `${item.gameState != 1 ? '在线' : '离线'}` }}</v-list-tile-action-text>
              <v-btn dark color="teal" outline depressed>生成游戏链接</v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-flex>
    <v-dialog v-model="dialogReg" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">创建玩家</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  v-model="userName"
                  prepend-icon="person"
                  label="帐号"
                  :messages="['已随机自动生成']"
                  maxlength="16"
                  required
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="userPwd"
                  prepend-icon="lock"
                  label="密码"
                  maxlength="16"
                  required
                  clearable
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed @click="dialogReg = false">取消</v-btn>
          <v-btn dark depressed @click="regPlayer">确认创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">玩家设置[{{userName}}]</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 class="py-0">
                <v-switch v-model="state" :label="state ?'启用':'停用'"></v-switch>
              </v-flex>
              <v-flex xs12 class="text-xs-center">
                玩家余额：{{balance}}{{balance==balanceTemp?null:'='}}{{balance==balanceTemp?null:balanceTemp}}{{balance > balanceTemp ? '+' : null}}{{parseFloat((balance-balanceTemp).toFixed(2)) != 0 ? ((balance-balanceTemp).toFixed(2)) : null}} &nbsp;&nbsp;
                <v-btn icon @click="balance=balanceTemp">
                  <v-icon>refresh</v-icon>撤销
                </v-btn>
              </v-flex>
              <v-flex xs12 class="text-xs-center py-0">
                <v-btn color="error" @click="parseFloat((balance+=100).toFixed(2))">加100点</v-btn>
                <v-btn
                  color="success"
                  @click="balance = parseFloat((balance-100).toFixed(2)) < 0 ? 0 : parseFloat((balance-100).toFixed(2))"
                >减100点</v-btn>
              </v-flex>
              <v-flex xs12 class="text-xs-center py-0">
                <v-btn color="error" @click="parseFloat((balance+=1000).toFixed(2))">加1000点</v-btn>
                <v-btn
                  color="success"
                  @click="balance = parseFloat((balance-1000).toFixed(2)) < 0 ? 0 : parseFloat((balance-1000).toFixed(2))"
                >减1000点</v-btn>
              </v-flex>
              <v-flex xs12 class="py-0">
                <v-text-field
                  v-model="userPwd"
                  prepend-icon="lock"
                  label="输入新密码(留空不变更)"
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
          <v-btn dark depressed @click="updatePlayer">确认修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogURL" persistent>
      <v-card>
        <v-card-text style="text-align:center" class="headline lighten-2 py-0">{{userName}}</v-card-text>
        <v-card-text style="text-align:center" class="pa-0">
          <vue-qr :text="copyURL" :size="200"></vue-qr>
        </v-card-text>
        <v-card-title class="headline grey lighten-2 py-0" primary-title>请将游戏链接复制给玩家</v-card-title>
        <v-card-text class="py-0">{{copyURL}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="blue darken-1" flat @click="doCopy">复制到剪贴板</v-btn> -->
          <button
            style="box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);background-color: white;color: black;border: 1px solid black;padding:5px"
            ref="copyButton"
            :data-clipboard-text="copyURL"
            @click="doCopy"
          >复制到剪贴板</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import Clipboard from "clipboard";
export default {
  async created() {
    // 获取列表
    let res = await this.$store.dispatch("getPlayerPage");
    this.items = res.list;
    // 更新实时数据
    setInterval(() => {
      this.$refs["num0"] ? this.$refs["num0"].start() : null;
    }, 5000);
  },
  mounted() {
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const clipboard = new Clipboard(this.$refs.copyButton);
      clipboard.on("success", e => {
        this.dialogURL = false;
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "已复制，粘贴发送给玩家即可");
        this.$store.commit("setErrColor", "gray");
      });
      clipboard.on("error", e => {
        this.dialogURL = false;
        alert("复制失败，请再次尝试或手动复制");
      });
    }
  },
  data() {
    return {
      items: [],
      dialogReg: false,
      dialogEdit: false,
      dialogURL: false,
      // 输入框
      userName: "",
      userPwd: "",
      state: 1,
      balance: 0,
      balanceTemp: 0,
      // 游戏链接
      copyURL: ""
    };
  },
  methods: {
    doCopy() {
      if (!navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        const el = document.createElement("textarea");
        el.addEventListener("focusin", e => e.stopPropagation());
        el.value = this.copyURL;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        this.dialogURL = false;
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "已复制，粘贴发送给玩家即可");
        this.$store.commit("setErrColor", "gray");
      }
    },
    openReg() {
      this.userName = `${this.randomStr(3, 3)}${this.randomNum(100, 999)}`;
      this.userPwd = "123456";
      this.dialogReg = true;
    },
    async regPlayer() {
      if (this.userName && this.userPwd) {
        if (this.userName.length >= 6 && this.userPwd.length >= 6) {
          let res = await this.$store.dispatch("regPlayer", {
            userName: this.userName,
            userPwd: this.userPwd,
            parentId: JSON.parse(localStorage.getItem("token")).userId,
            points: 0,
            gameList: []
          });
          this.dialogReg = false;
          this.items.unshift({
            userName: this.userName,
            state: 1,
            gameState: 1,
            balance: 0
          });
          this.$store.commit("setErr", true);
          this.$store.commit("setErrMsg", "创建成功，请进一步为玩家加点");
          this.$store.commit("setErrColor", "success");
        } else {
          this.$store.commit("setErr", true);
          this.$store.commit("setErrMsg", "帐号密码最少6位");
          this.$store.commit("setErrColor", "warning");
        }
      } else {
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "请输入玩家帐号和密码");
        this.$store.commit("setErrColor", "warning");
      }
    },
    openEdit(item) {
      this.userId = item.userId;
      this.userName = item.userName;
      this.state = item.state;
      this.balance = item.balance;
      this.balanceTemp = item.balance;
      this.userPwd = "";
      this.dialogEdit = true;
    },
    async updatePlayer() {
      await this.$store.dispatch("updatePlayer", {
        userName: this.userName,
        state: this.state ? 1 : 0
      });
      if (this.userPwd) {
        await this.$store.dispatch("updatePlayerPassword", {
          userName: this.userName,
          password: this.userPwd
        });
      }
      let amount = parseFloat((this.balance - this.balanceTemp).toFixed(2));
      // if (amount > 0) {
      //   await this.$store.dispatch("playerDeposit", {
      //     amount: Math.abs(amount),
      //     fromUserId: JSON.parse(localStorage.getItem("token")).userId,
      //     toRole: "1000",
      //     toUser: this.userName
      //   });
      // }
      // if (amount < 0) {
      //   await this.$store.dispatch("playerTake", {
      //     amount: Math.abs(amount),
      //     fromUserId: this.userId,
      //     toRole: "1000",
      //     toUser: JSON.parse(localStorage.getItem("token")).username
      //   });
      // }
      let player = this.items.find(o => o.userName == this.userName);
      this.dialogEdit = false;
      this.state = player.state;
      this.balance = player.balance;
      this.$store.commit("setErr", true);
      this.$store.commit("setErrMsg", "修改成功");
      this.$store.commit("setErrColor", "success");
    },

    openURL(item) {
      let arr = window.location.href.split("/");
      this.copyURL = `${arr[0]}//${arr[1]}${arr[2]}/wqtip.html?userName=${
        item.userName
      }`;
      this.userName = item.userName;
      this.dialogURL = true;
    },
    randomStr(min, max) {
      let str = "",
        range = min,
        arr = [
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "g",
          "h",
          "i",
          "j",
          "k",
          "l",
          "m",
          "n",
          "o",
          "p",
          "q",
          "r",
          "s",
          "t",
          "u",
          "v",
          "w",
          "x",
          "y",
          "z"
        ];
      // 随机产生
      range = Math.round(Math.random() * (max - min)) + min;
      for (let i = 0; i < range; i++) {
        let pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
    randomNum(min, max) {
      return min + Math.round(Math.random() * (max - min));
    }
  }
};
</script>

<style>
</style>
