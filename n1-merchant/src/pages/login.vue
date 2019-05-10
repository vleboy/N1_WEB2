<template>
  <div class="login">
    <div class="login-left">
      <p class="title-big">NA商户后台管理系统</p>
    </div>
    <div class="login-center"></div>
    <div class="login-right">
      <Form
        label-position="left"
        :label-width="80"
        :model="formValidate"
        :rules="ruleValidate"
        ref="formValidate"
      >
        <FormItem label="账号" prop="username">
          <Row>
            <Col span="8">
              <Input v-model="formValidate.username" :maxlength="16"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Row>
            <Col span="8">
              <Input v-model="formValidate.password" type="password" :maxlength="16"></Input>
            </Col>
          </Row>

        </FormItem>
        <FormItem label="标识" prop="sn">
          <Row>
            <Col span="8">
              <Input v-model="formValidate.sn"></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="验证">
          <Row>
            <Col span="8" style="background:grey;display:flex;justify-content:space-between;">
              <Input v-model="validateCode" style="width: 80px;" :maxlength="4"></Input>
              <span class="getCode" v-if="showCode" @click="getCode" style="margin-right:1rem;padding-left:0">点击显示验证码</span>
              <img class="validateImg" v-else :src="codeSrc" @click="getCode" style="margin-right:1rem">
              <Spin fix v-if="loadImg"></Spin>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="8">
              <Button class="loginbtn" :loading="isLoading" @click="login">
                <span v-if="!isLoading">登录</span>
                <span v-else>Loading...</span>
              </Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import bcrypt from "bcryptjs";
import { httpRequest, logIn } from "@/service/index";
import { validateUsername, validatePwd, validateSn } from "@/config/regexp";
export default {
  data() {
    return {
      formValidate: {
        username: "", // 用户名
        password: "", // 密码
        sn: "" //商户标识
      },
      ruleValidate: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePwd, trigger: "blur" }],
        sn: [{ validator: validateSn, trigger: "blur" }]
      },
      validateCode: "",
      showCode: true,
      codeSrc: "",
      loadImg: false,
      isLoading: false
    };
  },
  mounted() {
    let sn = this.$route.query.sn;
    let uname = this.$route.query.uname;
    this.username = uname;
    this.sn = sn;
  },
  methods: {
    //获取验证码
    getCode() {
      this.loadImg = true;
      httpRequest("post", "/captcha", {
        relKey: `${this.formValidate.sn}_${this.formValidate.username}`
      })
        .then(res => {
          if (res.code == 0) {
            this.showCode = false;
            this.codeSrc = "data:image/png;base64," + res.payload;
          }
        })
        .finally(() => {
          this.loadImg = false;
        });
    },
    login() {
      if (!this.validateCode) {
        this.$Message.warning({
          content: "请填写验证码"
        });
        return;
      }
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.isLoading = true;
          let password = bcrypt.hashSync(this.formValidate.password, 10);
          let params = {
            role: "100",
            username: this.formValidate.username,
            password: password,
            sn: this.formValidate.sn,
            captcha: this.validateCode
          };
          logIn(params)
            .then(res => {
              if (res.code == 0) {
                if (localStorage.getItem("merchantToken")) {
                  localStorage.removeItem("merchantToken");
                  localStorage.setItem("merchantToken", res.payload.token);
                } else {
                  localStorage.setItem("merchantToken", res.payload.token);
                }
                setTimeout(
                  () => localStorage.removeItem("merchantToken"),
                  259200000
                );
                localStorage.setItem("userInfo", JSON.stringify(res.payload));
                localStorage.setItem("loginId", res.payload.userId);
                localStorage.setItem("loginRole", res.payload.role);
                this.$store.commit("saveInfo", { params: res.payload });
                this.$router.push({ name: "home" });
              } else {
                this.showCode = true;
                this.isLoading = false;
                this.validateCode = "";
              }
            })
            .catch(err => {
              this.showCode = true;
              this.validateCode = "";
            });
        } else {
          return;
        }
      });
    }
  }
};
/* userlogin({ commit }, params) {
            let {cb,err,...rest}=params
            logIn(rest).then(res => {
                if (res.code == 0) {
                    if (localStorage.getItem('merchantToken')) {
                        localStorage.removeItem('merchantToken');
                        localStorage.setItem('merchantToken', res.payload.token)
                    } else {
                        localStorage.setItem('merchantToken', res.payload.token);
                    }
                    setTimeout(() => localStorage.removeItem('merchantToken'), 259200000);
                    localStorage.setItem('userInfo', JSON.stringify(res.payload))
                    localStorage.setItem('loginId', res.payload.userId)
                    localStorage.setItem('loginRole', res.payload.role)
                    commit('saveInfo', { params: res.payload });
                    cb && cb()
                } else {
                    commit('updateLoading', { params: false });
                    err && err()
                }
            })
        }, */
</script>

<style lang='less' scoped>
.login {
  /deep/.ivu-form .ivu-form-item-label {
    color: #fff;
  }
  background: rgb(72, 80, 95);
  color: #fff;
  display: -webkit-flex;
  display: flex;
  -webkit-align-items: center;
  align-items: center;
  -webkit-justify-content: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .login-left {
    flex: 0.45;
    text-align: right;
  }
  .login-center {
    flex: 0.1;
    text-align: center;
  }
  .login-right {
    flex: 0.45;
    text-align: left;
  }
}
/**/
.title-big {
  font-size: 3rem;
}
.getCode {
  padding-left: 15px;
  cursor: pointer;
}
.loginbtn {
  width: 100%;
}
.validateImg {
  vertical-align: middle;
  padding-left: 10px;
}

</style>
