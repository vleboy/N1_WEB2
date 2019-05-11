<template>
  <v-layout row wrap>
    <v-btn fab fixed top right @click="regUser">
      <!-- <v-badge overlap> -->
      <!-- <span slot="badge">3</span> -->
      <v-avatar>
        <v-icon size="40" color="blue-grey">person_add</v-icon>
      </v-avatar>
      <!-- </v-badge> -->
    </v-btn>
    <v-flex xs12>
      <v-item-group multiple style="width:100%">
        <v-item>
          <v-chip label>上月洗码量：1000</v-chip>
        </v-item>
        <v-item>
          <v-chip label>本月洗码量：1000</v-chip>
        </v-item>
        <v-item>
          <v-chip label>上周洗码量：1000</v-chip>
        </v-item>
        <v-item>
          <v-chip label>本周洗码量：1000</v-chip>
        </v-item>
      </v-item-group>
    </v-flex>
    <v-flex xs12>
      <v-list subheader two-line>
        <v-subheader>
          下级代理列表
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-subheader>
        <template v-for="(item,index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="()=>{}">
            <v-list-tile-avatar @click="openEdit(item)">
              <v-icon :color="item.status ? 'black' : 'grey'" size="36">person</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content @click="openEdit(item)">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action @click="openURL(item)">
              <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
              <v-btn dark color="blue-grey" depressed>生成系统链接</v-btn>
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
                  v-model="username"
                  prepend-icon="person"
                  label="帐号"
                  :messages="['已随机自动生成']"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field v-model="password" prepend-icon="lock" label="密码" required></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="displayName"
                  prepend-icon="person_outline"
                  label="昵称（建议输入中文，例：李哥）"
                  required
                ></v-text-field>
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
          <v-btn depressed @click="dialogReg = false">取消</v-btn>
          <v-btn dark depressed @click="dialogReg = false">确认创建</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogEdit" persistent>
      <v-card>
        <v-card-title class="pb-0">
          <span class="headline">代理设置</span>
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
          <v-btn dark depressed @click="dialogEdit = false">确认修改</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogURL" persistent>
      <v-card>
        <v-card-text style="text-align:center" class="headline lighten-2 py-0">代理001</v-card-text>
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
    <v-snackbar v-model="snackbar" top auto-height>
      已复制，粘贴发送给下级代理即可
      <v-btn color="gray" flat @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>
<script>
import Clipboard from "clipboard";

export default {
  components: {},
  created() {},
  mounted() {
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
      const clipboard = new Clipboard(this.$refs.copyButton);
      clipboard.on("success", e => {
        this.dialogURL = false;
        this.snackbar = true;
      });
      clipboard.on("error", e => {
        this.dialogURL = false;
        alert("复制失败，请再次尝试或手动复制");
      });
    }
  },
  data() {
    return {
      items: [
        {
          active: true,
          title: "代理001",
          subtitle: "余额1000",
          action: "玩家数量：10"
        },
        {
          active: true,
          title: "代理002",
          subtitle: "余额1000",
          action: "玩家数量：10",
          status: 1
        },
        {
          title: "代理003",
          subtitle: "余额1000",
          action: "玩家数量：10"
        },
        {
          title: "代理004",
          subtitle: "余额1000",
          action: "玩家数量：10"
        },
        {
          title: "代理005",
          subtitle: "余额1000",
          action: "玩家数量：10"
        },
        {
          title: "代理006",
          subtitle: "余额1000",
          action: "玩家数量：10"
        },
        {
          title: "代理007",
          subtitle: "余额1000",
          action: "玩家数量：10"
        },
        {
          title: "代理008",
          subtitle: "余额1000",
          action: "玩家数量：10"
        }
      ],
      gameTypes: ["H5电子游戏", "H5电子游戏-无神秘奖"],
      selectedGameTypes: [],
      snackbar: false,
      dialogReg: false,
      dialogEdit: false,
      dialogURL: false,
      username: "",
      password: "",
      displayName:"",
      status: 1,
      copyURL: `${window.location.href.split("#")[0]}index.html`
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
        this.snackbar = true;
      }
    },
    openEdit() {
      this.dialogEdit = true;
    },
    openURL() {
      this.copyURL = `${window.location.href.split("#")[0]}index.html?username=${JSON.parse(localStorage.getItem("token")).username}`
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
    regUser() {
      this.username = `${this.randomStr(3, 3)}${this.randomNum(100, 999)}`;
      this.password = "123456";
      this.dialogReg = true;
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
    // handleScroll() {
    //   this.statScrollNum =
    //     window.pageYOffset ||
    //     document.documentElement.scrollTop ||
    //     document.body.scrollTop;
    // }
  }
  // beforeDestroy() {
  //   this.$store.commit("setStatScroll", this.statScrollNum);
  // }
};
</script>