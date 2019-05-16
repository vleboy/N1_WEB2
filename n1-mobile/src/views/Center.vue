<template>
  <v-layout row wrap>
    <v-btn fab fixed top right @click="openReg">
      <v-avatar>
        <v-icon size="40" color="blue-grey">person_add</v-icon>
      </v-avatar>
    </v-btn>
    <v-flex xs12>
      <v-btn-toggle mandatory style="width:100%" class="pl-2">
        <v-btn large flat value="left">上周洗码量</v-btn>
        <v-btn large flat value="center">本周洗码量</v-btn>
      </v-btn-toggle>
    </v-flex>
    <v-flex xs12>
      <v-card color="grey darken-1" dark>
        <v-card-title primary-title class="py-2">
          <div>
            <div class="headline">{{total}}</div>
          </div>
        </v-card-title>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-list subheader two-line>
        <v-subheader>
          下级代理列表
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-subheader>
        <template v-for="(item,index) in items">
          <v-list-tile :key="item.username" avatar ripple @click="()=>{}">
            <v-list-tile-avatar @click="openEdit(item)">
              <v-icon :color="item.status ? 'black' : 'grey'" size="36">person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content @click="openEdit(item)">
              <v-list-tile-title>{{ item.displayName }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ `余额:${item.balance}` }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action @click="openURL(item)">
              <v-list-tile-action-text>{{ `玩家数量:${item.playerCount}` }}</v-list-tile-action-text>
              <v-btn dark color="blue-grey" outline depressed>生成系统链接</v-btn>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-flex>
    <v-dialog v-model="dialogReg" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">创建代理</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-text-field
                v-model="sn"
                prepend-icon="person"
                label="标识"
                :messages="['已随机自动生成']"
                required
                clearable
              ></v-text-field>
              <v-text-field
                v-model="username"
                prepend-icon="person"
                label="帐号"
                :messages="['已随机自动生成']"
                required
                clearable
              ></v-text-field>
              <v-text-field
                v-model="password"
                prepend-icon="lock"
                label="密码"
                maxlength="16"
                required
                clearable
              ></v-text-field>
              <v-text-field
                v-model="displayName"
                prepend-icon="person_outline"
                label="昵称（建议输入中文，例：李哥）"
                required
                clearable
              ></v-text-field>
              <v-text-field
                v-model="rate"
                prepend-icon="data_usage"
                label="成数（百分比，不能超过上级）"
                required
                suffix="%"
                :messages="`上级成数：${rate}%`"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="mix"
                prepend-icon="data_usage"
                label="洗码比（百分比，不能超过上级）"
                required
                suffix="%"
                :messages="`上级洗码比：${mix}%`"
                clearable
              ></v-text-field>
              <v-select
                v-model="selectedGameTypes"
                :items="gameTypes"
                label="选择游戏"
                multiple
                readonly
              >
                <template v-slot:prepend-item>
                  <v-list-tile ripple @click="toggle">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <a>全部</a>
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </template>
              </v-select>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed @click="dialogReg = false">取消</v-btn>
          <v-btn dark depressed @click="regUser">确认创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">代理设置[{{displayName}}]</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 class="py-0">
                <v-switch v-model="status" :label="status ?'启用':'停用'"></v-switch>
              </v-flex>
              <v-flex xs12 class="py-0 text-xs-center">
                代理余额：{{balance}}{{balance==balanceTemp?null:'='}}{{balance==balanceTemp?null:balanceTemp}}{{balance > balanceTemp ? '+' : null}}{{parseFloat((balance-balanceTemp).toFixed(2)) != 0 ? ((balance-balanceTemp).toFixed(2)) : null}} &nbsp;&nbsp;
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
              <!-- <v-flex xs12>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  label="输入新密码(留空不变更)"
                  maxlength="16"
                  clearable
                ></v-text-field>
              </v-flex>-->
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed @click="dialogEdit = false">取消</v-btn>
          <v-btn dark depressed @click="updateUser">确认修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogURL" persistent>
      <v-card>
        <v-card-text style="text-align:center" class="headline lighten-2 py-0">{{displayName}}</v-card-text>
        <v-card-text style="text-align:center" class="pa-0">
          <vue-qr :text="copyURL" :size="200"></vue-qr>
        </v-card-text>
        <v-card-title class="headline grey lighten-2 py-0" primary-title>请将链接复制给下级代理</v-card-title>
        <v-card-text class="py-0">{{copyURL}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <button
            style="box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);background-color: white;color: black;border: 1px solid black;padding:5px"
            ref="copyButton"
            :data-clipboard-text="copyURL"
            @click="doCopy"
          >复制到剪贴板</button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--错误提示-->
    <!-- <v-snackbar v-model="err" top auto-height :color="errColor">
      {{errMsg}}
      <v-btn color="gray" flat @click="()=>{this.$store.commit('setErr',false)}">关闭</v-btn>
    </v-snackbar>-->
  </v-layout>
</template>
<script>
import Clipboard from "clipboard";
export default {
  async created() {
    // 获取列表
    let res = await this.$store.dispatch("getUserPage");
    this.items = res.payload;
  },
  mounted() {
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const clipboard = new Clipboard(this.$refs.copyButton);
      clipboard.on("success", e => {
        this.dialogURL = false;
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "已复制，粘贴发送给下级代理即可");
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
      total: 0,
      // 输入框
      parent: {},
      gameTypes: ["H5电子游戏"],
      selectedGameTypes: ["H5电子游戏"],
      sn: "",
      username: "",
      password: "",
      displayName: "",
      status: 1,
      gameList: [],
      mix: "",
      rate: "",
      balance: 0,
      balanceTemp: 0,
      // 代理链接
      copyURL: ""
    };
  },
  computed: {
    likesAllFruit() {
      return this.selectedGameTypes.length === this.gameTypes.length;
    },
    likesSomeFruit() {
      return this.selectedGameTypes.length > 0 && !this.likesAllFruit;
    }
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
        this.$store.commit("setErrMsg", "已复制，粘贴发送给下级代理即可");
        this.$store.commit("setErrColor", "gray");
      }
    },
    openURL(item) {
      let arr = window.location.href.split("/");
      this.copyURL = `${arr[0]}//${arr[1]}${arr[2]}/index.html?username=${
        item.username
      }`;
      this.username = item.username;
      this.displayName = item.displayName;
      this.dialogURL = true;
    },
    async openReg() {
      let res = await this.$store.dispatch(
        "getUser",
        JSON.parse(localStorage.getItem("token"))
      );
      this.parent = res.payload;
      this.rate = this.parent.rate;
      this.mix = this.parent.gameList.find(o => o.code == "70000")
        ? this.parent.gameList.find(o => o.code == "70000").mix
        : 5;

      this.sn = this.randomStr(3, 3);
      this.username = `${this.sn}${this.randomNum(100, 999)}`;
      this.password = "123456";
      this.displayName = "";
      this.dialogReg = true;
    },
    async regUser() {
      if (
        this.username &&
        this.password &&
        this.displayName &&
        this.mix &&
        this.rate
      ) {
        if (this.mix > this.parent.mix || this.rate > this.parent.rate) {
          this.$store.commit("setErr", true);
          this.$store.commit("setErrMsg", "成数和洗码比不能超过上级");
          this.$store.commit("setErrColor", "warning");
          return;
        }
        this.gameList = [
          {
            company: "NA",
            type: 2,
            code: "70000",
            name: "H5电子游戏",
            mix: this.mix
          }
        ];
        let res = await this.$store.dispatch("regUser", {
          role: "1000",
          sn: this.sn,
          parent: this.parent.userId,
          username: this.username,
          password: this.payload,
          displayName: this.displayName,
          gameList: this.gameList,
          rate: this.rate,
          points: 0
        });
        this.dialogReg = false;
        this.items.unshift({
          userId: res.payload.userId,
          username: this.username,
          displayName: this.displayName,
          playerCount: 0,
          status: 1,
          balance: 0
        });
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "创建成功，请进一步为代理加点");
        this.$store.commit("setErrColor", "success");
      } else {
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "请完善必填项");
        this.$store.commit("setErrColor", "warning");
      }
    },
    async openEdit(item) {
      // let res = await this.$store.dispatch(
      //   "getUser",
      //   JSON.parse(localStorage.getItem("token"))
      // );
      // this.parent = res.payload;
      this.userId = item.userId;
      this.username = item.username;
      this.displayName = item.displayName;
      this.status = item.status;
      this.balance = item.balance;
      this.balanceTemp = item.balance;
      this.dialogEdit = true;
    },
    async updateUser() {
      let user = this.items.find(o => o.userId == this.userId);
      // 是否更新状态
      if (user.status != (this.status ? 1 : 0)) {
        await this.$store.dispatch("updateUser", {
          role: "1000",
          userId: this.userId,
          status: this.status ? 1 : 0
        });
      }
      // 是否加减点
      let amount = parseFloat((this.balance - this.balanceTemp).toFixed(2));
      if (amount > 0) {
        await this.$store.dispatch("billTransfer", {
          amount: Math.abs(amount),
          fromUserId: JSON.parse(localStorage.getItem("token")).userId,
          toRole: "1000",
          toUser: this.username
        });
      }
      if (amount < 0) {
        await this.$store.dispatch("billTransfer", {
          amount: Math.abs(amount),
          fromUserId: this.userId,
          toRole: "1000",
          toUser: JSON.parse(localStorage.getItem("token")).username
        });
      }
      user.status = this.status ? 1 : 0;
      user.balance = this.balance;
      this.dialogEdit = false;
      this.$store.commit("setErr", true);
      this.$store.commit("setErrMsg", "修改成功");
      this.$store.commit("setErrColor", "success");
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
    },
    toggle() {
      this.$nextTick(() => {
        if (this.likesAllFruit) {
          this.selectedGameTypes = [];
        } else {
          this.selectedGameTypes = this.gameTypes.slice();
        }
      });
    }
  }
};
</script>