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
              <v-toolbar-title>登录</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="username"
                  prepend-icon="person"
                  name="login"
                  label="输入代理帐号"
                  type="text"
                  :messages="['6-10位中英文数字']"
                  maxlength="5"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  prepend-icon="lock"
                  name="password"
                  label="输入密码"
                  id="password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn dark @click="login">登录</v-btn>
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
    <v-snackbar v-model="err" top auto-height color="warning">
      {{errMsg}}
      <v-btn color="gray" flat @click="err = false">关闭</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
      err: false,
      errMsg: ""
    };
  },
  created: function() {
    // 身份认证有效期内，直接跳转
    if (localStorage.getItem("token")) {
      this.$router.push({ path: "/layout/home" });
    }
  },
  methods: {
    // 登录
    async login() {
      if (this.username && this.password) {
        // let res = await this.$store.dispatch("login", {
        //   nickName: this.nickName
        // });
        let res = { err: false, res: { username: "NAagent" } };
        if (res.err) {
          this.err = res.err;
          this.errMsg = res.res;
        } else {
          localStorage.setItem("token", JSON.stringify(res.res));
          this.$router.push({ path: "/layout/home" });
        }
      } else {
        this.err = true;
        this.errMsg = "请输入帐号密码";
      }
    }
  }
};
</script>


