<template>
  <div class="login">
    
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
      sn:'',
      validate:'',
      showCode:true,
      codeSrc:'',
      loadImg:false
    };
  },
  computed: {
    loading() {
      return this.$store.state.login.loading;
    }
  },
  created() {
  },
  mounted(){
    /* let sn=this.$route.query.sn
    let uname=this.$route.query.uname
    this.username=uname;
    this.sn=sn; */
  },
  methods: {
    /* getCode(){
      if(!this.username){
        return this.$Message.warning('请填写账号')
      }
      if(!this.sn){
        return this.$Message.warning('请填写标识')
      }
      this.loadImg=true;
      httpRequest('post','/captcha',{
        relKey:`${this.sn}_${this.username}`
      }).then(res=>{
        if(res.code==0){
          this.showCode=false;
          this.codeSrc='data:image/png;base64,'+res.payload
        }
      }).finally(()=>{
        this.loadImg=false
      })
    },
    login() {
      // let passReg = /^[a-zA-Z0-9@_#$%^&*!~-]{7,16}$/;
      let nameReg = /^[a-zA-Z0-9@_-]{5,16}$/;
      let self = this;
      if (!nameReg.test(this.username)) {
        this.$Message.warning({
          content: "用户名为5-16位的（英文、数字、@、_、-）"
        });
        return;
      }
      // if (!passReg.test(this.password)) {
      //   this.$Message.warning({
      //     content: "密码为8-16位的(英文、数字、符号)"
      //   });
      //   return;
      // }
       if (!this.validate) {
        this.$Message.warning({
          content: "请填写验证码"
        });
        return;
      }
      this.$store.commit("updateLoading", { params: true });
      let password = bcrypt.hashSync(this.password, 10);
      this.$store.dispatch("userlogin", {
        role: "100",
        username: this.username,
        password: password,
        sn:this.sn,
        captcha:this.validate,
        cb: () => {
          this.$store.commit("updateLoading", { params: false });
          this.$router.push({ name: "home" });
        },
        err: () => {
            this.showCode=true;
            this.validate=''
        }
      });
    } */
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
  .validateImg{
   vertical-align: middle;
   padding-left: 10px
  }
</style>
