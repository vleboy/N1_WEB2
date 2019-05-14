<template>
  <div class="login">
    <div class="login-left">
      <p class="title-big">NA后台管理系统</p>
    </div>
    <div class="login-center"></div>
    <div class="login-right">
      <Form label-position="left" :label-width="80">
        <FormItem label="账号">
          <Row>
            <Col span="8">
            <Input v-model="username" :maxlength='16'></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="密码">
          <Row>
            <Col span="8">
            <Input v-model="password" type="password" :maxlength='16'></Input>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="验证">
          <Row>
            <Col span="8">
            <Input v-model="validate" style="width: 80px" :maxlength='4'></Input>
              <span class="getCode" v-if='showCode' @click="getCode">点击显示验证码</span>
              <img class="validateImg" v-else :src="codeSrc" alt="oo" @click="getCode">
              <Spin fix v-if='loadImg'>
             </Spin>
            <!-- <div id="vaptcha_container">
              <div class="vaptcha-init-main">
                <div class="vaptcha-init-loading">
                  <img src="https://cdn.vaptcha.com/vaptcha-loading.gif" />
                  <span class="vaptcha-text">智能验证码加载中...</span>
                </div>
              </div>
            </div>  -->
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Row>
            <Col span="8">
            <Button class="loginbtn" :loading="loading" type="ghost" @click="login">
              <span v-if="!loading">登录</span>
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
import { httpRequest } from "@/service/index";

export default {
  data() {
    return {
      username: "", // 用户名
      password: "", // 密码
      validate:'',
      showCode:true,
      codeSrc:'',
      loadImg:false
    };
  },
  watch: {},
  computed: {
    loading() {
      return this.$store.state.login.loading;
    }
  },
  created() {
    // this.initVaptcha();
  },
  methods: {
    // initVaptcha() {
    //   let self = this;
    //   this.axios.post(api.getVaptcha).then(function(r) {
    //     const options = {
    //       vid: r.data.vid,
    //       challenge: r.data.challenge,
    //       type: "float", //验证码类型,string,默认float,可选择float,popup,embed,
    //       checkingAnimation: "display", //是否显示智能检测动画，"hide"则为隐藏
    //       outage: api.getDownTime, //服务器端配置的宕机模式接口地址
    //       container: "#vaptcha_container",
    //       success: function(token, challenge) {
    //         //当验证成功时执行回调,function,参数token为string,必选
    //         self.userdata.token = token;
    //         self.userdata.challenge = challenge;
    //       },
    //       fail: function() {//验证失败回调函数  
    //         self.initVaptcha();     
    //       }
    //     };
    //     //vaptcha对象初始化
    //     window.vaptcha(options, function(obj) {
    //       self.vaptchaObj = obj;
    //       self.vaptchaObj.init();
    //     });
    //   })
    //   .catch(function(err){
    //       self.initVaptcha();     
    //   });
    // },
    getCode(){
      if(!this.username){
        return this.$Message.warning('请填写账号')
      }
      this.loadImg=true;
      httpRequest('post','/captcha',{
        relKey:`PLAT_${this.username}`
      }).then(res=>{
        if(res.code==0){
          this.showCode=false;
          this.codeSrc='data:image/png;base64,'+res.payload
        }
      }).finally(()=>{
        this.loadImg=false;
      })
    },
    login() {
      // let passReg = /^[a-zA-Z0-9@_#$%^&*!~-]{8,16}$/;
      let nameReg = /^[a-zA-Z0-9@_-]{5,16}$/;
      if (!nameReg.test(this.username)) {
        this.$Message.warning({
          content: "用户名为5-16位的（英文、数字、@、_、-）"
        });
        return;
      }
      if (!this.validate) {
        return this.$Message.warning('请填写验证码');
        ;
      }
      // if (!passReg.test(this.password)) {
      //   this.$Message.warning({
      //     content: "密码为8-16位的(英文、数字、符号)"
      //   }); 
      //   return;
      // }
      this.$store.commit("updateLoading", { params: true });
      let password = bcrypt.hashSync(this.password, 10);
      this.$store.dispatch("userlogin", {
        role: "1",
        username: this.username,
        password: password,
        captcha:this.validate,
        cb: () => {
          this.$store.commit("updateLoading", { params: false });
          this.$router.push({ name: "home" });
        },
        err: () => {
          this.validate=''
          this.showCode=true;
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
.login {
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
  .validateImg{
   vertical-align: middle;
   padding-left: 10px
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
</style>
