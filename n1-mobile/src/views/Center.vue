<template>
  <v-layout row wrap>
    <v-btn fab fixed top right @click="openReg">
      <v-avatar>
        <v-icon size="40" color="blue-grey">person_add</v-icon>
      </v-avatar>
    </v-btn>
    <v-flex xs12>
      <v-btn-toggle mandatory style="width:100%" class="pl-2">
        <v-btn large flat value="left">上周洗码量：1000</v-btn>
        <v-btn large flat value="center">本周洗码量：1000</v-btn>
      </v-btn-toggle>
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
              <v-flex xs12>
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
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="password" prepend-icon="lock" label="密码" required clearable></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="displayName"
                  prepend-icon="person_outline"
                  label="昵称（建议输入中文，例：李哥）"
                  required
                  clearable
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  v-model="selectedGameTypes"
                  :items="gameTypes"
                  label="选择游戏"
                  multiple
                  clearable
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
              </v-flex>
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
              <v-flex xs12>
                <v-switch v-model="status" :label="status ?'启用':'停用'"></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-select v-model="selectedGameTypes" :items="gameTypes" label="选择游戏" multiple>
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
              </v-flex>
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
      // 输入框
      gameTypes: ["H5电子游戏", "H5电子游戏-无神秘奖"],
      selectedGameTypes: [],
      sn: "",
      username: "",
      password: "",
      displayName: "",
      status: 1,
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
    openEdit(item) {
      this.username = item.username;
      this.displayName = item.displayName;
      this.status = item.status;
      this.dialogEdit = true;
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
    openReg() {
      this.sn = this.randomStr(3, 3);
      this.username = `${this.sn}${this.randomNum(100, 999)}`;
      this.password = "123456";
      this.displayName = "";
      this.dialogReg = true;
    },
    async regUser() {
      await this.$store.dispatch("regUser", {
        role: "1000",
        sn: this.sn,
        username: this.username,
        password: this.payload,
        displayName: this.displayName,
        gameList: [],
        rate: 0,
        points: 0
      });
      this.dialogReg = false;
      this.items.unshift({
        username: this.username,
        displayName: this.displayName,
        playerCount: 0,
        status: 1,
        balance: 0
      });
      this.$store.commit("setErr", true);
      this.$store.commit("setErrMsg", "创建成功，请进一步为代理加点");
      this.$store.commit("setErrColor", "success");
    },
    async updateUser() {
      await this.$store.dispatch("updateUser", {
        role: "1000",
        userId: JSON.parse(localStorage.getItem("token")).userId,
        status: this.status ? 1 : 0
      });
      this.items.find(o => o.username == this.username).status = this.status;
      this.dialogEdit = false;
      this.$store.commit("setErr", true);
      this.$store.commit("setErrMsg", "修改成功");
      this.$store.commit("setErrColor", "success");
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