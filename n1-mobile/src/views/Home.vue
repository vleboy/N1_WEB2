<template>
  <v-layout row wrap>
    <v-btn fab fixed top right @click="regPlayer">
      <v-avatar>
        <v-icon size="40" color="blue-grey">person_add</v-icon>
      </v-avatar>
    </v-btn>

    <v-flex xs12 class="mt-2">
      <CardMain/>
    </v-flex>

    <v-flex xs12>
      <v-list subheader two-line>
        <v-subheader>
          活跃玩家列表
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>search</v-icon>
          </v-btn>
        </v-subheader>
        <template v-for="(item,index) in items">
          <v-list-tile :key="item.title" avatar ripple @click="()=>{}">
            <v-list-tile-avatar @click="openEdit(item)">
              <v-icon :color="item.state ? 'black' : 'grey'" size="36">mood</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content @click="openEdit(item)">
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action @click="openURL(item)">
              <v-list-tile-action-text>{{ item.action }}</v-list-tile-action-text>
              <v-btn dark color="blue-grey" depressed>生成游戏链接</v-btn>
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
        <v-card-text style="text-align:center" class="headline lighten-2 py-0">玩家001</v-card-text>
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
    <v-snackbar v-model="snackbar" top auto-height>
      已复制，粘贴发送给玩家即可
      <v-btn color="gray" flat @click="snackbar = false">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import CardMain from "../components/CardMain";
import Clipboard from "clipboard";

export default {
  components: {
    CardMain
  },
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
          title: "玩家001",
          subtitle: "余额1000",
          action: "当前状态：H5电子游戏"
        },
        {
          active: true,
          title: "玩家002",
          subtitle: "余额1000",
          action: "当前状态：H5电子游戏",
          state: 1
        },
        {
          title: "玩家003",
          subtitle: "余额1000",
          action: "当前状态：离线"
        },
        {
          title: "玩家004",
          subtitle: "余额1000",
          action: "当前状态：离线"
        },
        {
          title: "玩家005",
          subtitle: "余额1000",
          action: "当前状态：离线"
        },
        {
          title: "玩家006",
          subtitle: "余额1000",
          action: "当前状态：离线"
        },
        {
          title: "玩家007",
          subtitle: "余额1000",
          action: "当前状态：离线"
        },
        {
          title: "玩家008",
          subtitle: "余额1000",
          action: "当前状态：离线"
        }
      ],
      snackbar: false,
      dialogReg: false,
      dialogEdit: false,
      dialogURL: false,
      userName: "",
      password: "",
      state: 1,
      copyURL: `${window.location.href.split("#")[0]}wqtip.html?userName=`
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
        this.snackbar = true;
      }
    },
    regPlayer() {
      this.userName = `${this.randomStr(3, 3)}${this.randomNum(100, 999)}`;
      this.password = "123456";
      this.dialogReg = true;
    },
    openEdit() {
      this.password = "";
      this.dialogEdit = true;
    },
    openURL() {
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
