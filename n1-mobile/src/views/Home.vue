<template>
  <v-layout row wrap>
    <v-btn fab fixed top right @click="regPlayer">
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
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="password" prepend-icon="lock" label="密码" required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed @click="dialogReg = false">取消</v-btn>
          <v-btn dark depressed @click="dialogReg = false">确认创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">玩家设置</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-switch v-model="state" :label="state ?'启用':'停用'"></v-switch>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="password" prepend-icon="lock" label="输入新密码(留空不变更)" required></v-text-field>
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
    <!--错误提示-->
    <v-snackbar v-model="err" top auto-height :color="errColor">
      {{errMsg}}
      <v-btn color="gray" flat @click="()=>{this.$store.commit('setErr',false)}">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import Clipboard from "clipboard";
export default {
  computed: {
    openLoading: {
      get() {
        return this.$store.state.openLoading;
      },
      set(val) {
        this.$store.commit("openLoading", val);
      }
    },
    err: {
      get() {
        return this.$store.state.err;
      },
      set(val) {
        this.$store.commit("setErr", val);
      }
    },
    errMsg: {
      get() {
        return this.$store.state.errMsg;
      },
      set(val) {
        this.$store.commit("setErrMsg", val);
      }
    },
    errColor: {
      get() {
        return this.$store.state.errColor;
      },
      set(val) {
        this.$store.commit("setErrColor", val);
      }
    }
  },
  async created() {
    // 获取玩家列表
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
      password: "",
      state: 1,
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
    regPlayer() {
      this.userName = `${this.randomStr(3, 3)}${this.randomNum(100, 999)}`;
      this.password = "123456";
      this.dialogReg = true;
    },
    openEdit(item) {
      this.state = item.state;
      this.password = "";
      this.dialogEdit = true;
    },
    openURL(item) {
      this.copyURL = `${
        window.location.href.split("#")[0]
      }wqtip.html?userName=${item.userName}`;
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
