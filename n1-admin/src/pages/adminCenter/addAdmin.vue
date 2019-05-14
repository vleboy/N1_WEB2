<template>
  <div class="addadmin">
    <div class="adminform">
      <h2>基本信息</h2>
      <Form ref='addform' :model="formItem" :label-width="110" :rules="ruleValidate">
        <FormItem label="管理员角色" prop="subRole">
          <Select v-model="formItem.subRole" placeholder="请选择">
            <Option v-for="item in subRoleList" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="管理员用户名" prop="username">
          <Input v-model="formItem.username" placeholder="5-16位,限英文和数字"></Input>
        </FormItem>
        <FormItem label="管理员密码" prop='password'>
          <Input v-model="formItem.password" placeholder="6-16位由字母、数字、符号中至少两种组成"></Input>
        </FormItem>
        <FormItem label="管理员姓名" prop="adminName">
          <Input v-model="formItem.adminName" placeholder="2~16位,只能输入中英文"></Input>
        </FormItem>
        <FormItem label="管理员邮箱" prop="adminEmail">
          <Input v-model="formItem.adminEmail" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="管理员联系方式" prop="adminContact">
          <Input v-model="formItem.adminContact" placeholder="5~40位,只能输入中英文及数字"></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="addAdmin('addform')">提交</Button>
          <Button type="primary" class="reset" @click="reset('addform')">重置</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</template>
<script>
import { getsbuRole, createAdmin } from "@/service/index";
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名不能为空"));
      } else {
        let nameReg = /^[a-zA-Z0-9]{5,16}$/;
        if (!nameReg.test(value)) {
          callback(new Error("5-16位,限英文和数字"));
        } else {
          callback();
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.passwordLevel(value) < 2) {
            callback(new Error("密码中必须包含6-16位由字母、数字、符号中至少两种组成"));
          } else {
            callback();
          }
      }
    };
    const validateName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("姓名不能为空"));
      } else {
        let testReg = /^[\u4E00-\u9FA5a-zA-Z]{2,16}$/;
        if (!testReg.test(value)) {
          callback(new Error("2~16位,只能输入中英文"));
        } else {
          callback();
        }
      }
    };
    const validateContact = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("联系方式不能为空"));
      } else {
        let testReg = /^[\u4E00-\u9FA5a-zA-Z0-9]{5,40}$/;
        if (!testReg.test(value)) {
          callback(new Error("5~40位,只能输入中英文及数字"));
        } else {
          callback();
        }
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("邮箱不能为空"));
      } else {
        let testReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!testReg.test(value)) {
          callback(new Error("邮箱格式不对"));
        } else {
          callback();
        }
      }
    };
    return {
      formItem: {
        subRole: "",
        username: "",
        password: "",
        adminName: "",
        adminEmail: "",
        adminContact: ""
      },
      subRoleList: [],
      ruleValidate: {
        subRole: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        username: [
          {
            validator: validateUsername,
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        adminName: [
          {
            validator: validateName,
            trigger: "blur"
          }
        ],
        adminEmail: [
          {
            validator: validateEmail,
            trigger: "blur"
          }
        ],
        adminContact: [
          {
            validator: validateContact,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    addAdmin(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.passwordLevel(this.formItem.password) < 2) {
            this.$Message.warning({
              content: "密码中必须包含6-16位由字母、数字、符号中至少两种组成"
            });
            return;
          }
          createAdmin({
            ...this.formItem,
            role: 1
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success({
                content: "创建成功"
              });
              this.formItem = {};
              this.$router.push({ name: "adminList" });
            }
          });
        } else {
          this.$Message.error("输入信息有误");
        }
      });
    },
    reset(name) {
      this.$refs[name].resetFields();
    },
    init() {
      // this.$refs['addform'].resetFields();
      getsbuRole().then(res => {
        if (res.code == 0) {
          this.subRoleList = res.payload.Items;
        }
      });
    },
    passwordLevel(password) {
      let Modes = 0;
      let len=password.length;
      if(len<6||len>16){
        return 0
      }
      for (let i = 0; i < password.length; i++) {
        Modes |= CharMode(password.charCodeAt(i));
      }
      return bitTotal(Modes);
      //CharMode函数
      function CharMode(iN) {
        if (iN >= 48 && iN <= 57)
          //数字
          return 1;
        if (iN >= 65 && iN <= 90)
          //大写字母
          return 2;
        if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90))
          //大小写
          return 4;
        else return 8; //特殊字符
      }
      //bitTotal函数
      function bitTotal(num) {
        let modes = 0;
        for (let i = 0; i < 4; i++) {
          if (num & 1) modes++;
          num >>>= 1;
        }
        return modes;
      }
    }
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      this.reset("addform");
      this.init();
    }
  }
};
</script>
<style lang="less" scoped>
.addadmin {
  min-height: 89vh;
  .adminform {
    width: 26rem;
    margin: 0 auto;
    margin-top: 4rem;
    .reset {
      margin-left: 80px;
    }
  }
}
</style>
