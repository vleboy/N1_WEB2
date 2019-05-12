<template>
  <v-layout d-flex justify-center fill-height>
    <v-parallax style="background-color:gray" height="800">
      <div class="text-xs-center">建议您【添加到主屏幕】或【收藏】以便下次打开</div>
      <div class="text-xs-center">浏览器需开启【创建桌面快捷方式】权限</div>
      <!--登录/注册-->
      <v-layout align-center justify-center fill-height>
        <v-flex xs12 sm4 mr-1>
          <v-card class="elevation-12">
            <v-toolbar dark>
              <img
                src="data:image/png;base64,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"
              >
              <v-toolbar-title>代理</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text class="pb-0">
              <v-form>
                <v-text-field
                  v-model="username"
                  prepend-icon="person"
                  name="login"
                  label="输入代理帐号"
                  type="text"
                  :messages="['6-10位中英文数字']"
                  maxlength="20"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  label="输入密码"
                  id="password"
                  type="password"
                  maxlength="20"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pt-0">
              <v-spacer></v-spacer>
              <v-btn large dark @click="login" :loading="openLoading">登录</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <!--底部声明 ../img/icons/android-chrome-512x512.png -->
      <v-layout justify-center fill-height>
        <v-flex xs12 sm4>
          <!-- <v-img src="http://img.xserver.top/wenming_logo.png" max-height="512" max-width="512"> -->
          <div class="text-xs-center">2018-2019 &copy; New Asia</div>
          <!-- </v-img> -->
        </v-flex>
      </v-layout>
    </v-parallax>
    <!--错误提示-->
    <v-snackbar v-model="err" top auto-height :color="errColor">
      {{errMsg}}
      <v-btn color="gray" flat @click="()=>{this.$store.commit('setErr',false)}">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import bcrypt from "bcryptjs";
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
        this.$store.commit("err", val);
      }
    },
    errMsg: {
      get() {
        return this.$store.state.errMsg;
      },
      set(val) {
        this.$store.commit("errMsg", val);
      }
    },
    errColor: {
      get() {
        return this.$store.state.errColor;
      },
      set(val) {
        this.$store.commit("errColor", val);
      }
    }
  },
  data() {
    return {
      username: "",
      password: ""
    };
  },
  created: function() {
    // 身份认证有效期内，直接跳转
    if (localStorage.getItem("token")) {
      this.$router.push({ path: "/layout/home" });
    }
  },
  methods: {
    async login() {
      if (this.username && this.password) {
        let res = await this.$store.dispatch("login", {
          username: this.username,
          password: bcrypt.hashSync(this.password),
          role: "1000",
          mobileFlag: true
        });
        if (res.code == 0) {
          localStorage.setItem("token", JSON.stringify(res.payload));
          this.$router.push({ path: "/layout/home" });
        }
      } else {
        this.$store.commit("setErr", true);
        this.$store.commit("setErrMsg", "请输入帐号密码");
        this.$store.commit("setErrColor", "warning");
      }
    }
  }
};
</script>


