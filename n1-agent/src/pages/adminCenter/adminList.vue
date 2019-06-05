<template>
  <div class="adminList">
    <div class="option">
      <p class="create">
        <Button type="primary" @click="addAdmin">创建管理员</Button>
        <Button type="primary" class="searchbtn" @click="reset">刷新</Button>
      </p>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="adminList" size="small"></Table>
    </div>
    <Modal v-model="modal" title="修改密码" :width='350' @on-ok="ok" @on-cancel='cancel'>
      <p class="modal_input">
        <Row>
          <Col span="6" class="label">新密码</Col>
          <Col span="14">
          <Input v-model="password" placeholder="请输入新密码"></Input>
          </Col>
        </Row>
      </p>
      <p class="modal_input">
        <Row>
          <Col span="6" class="label">重复新密码</Col>
          <Col span="14">
          <Input v-model="repassword" placeholder="请重复新密码"></Input>
          </Col>
        </Row>
      </p>
    </Modal>
    <Modal v-model="roleModal" title="修改角色" :width='400' @on-ok="updateRole" @on-cancel='cancelRole'>
      <p class="select">
        <Row>
          <Col span="14" offset="5">
          <Select v-model="subRole" placeholder="请选择">
            <Option v-for="item in subRoleList" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
          </Col>
        </Row>
      </p>
    </Modal>
    <Modal v-model="adminModal" title="添加管理员" :width='400' @on-ok="add" @on-cancel='addcancel'>
      <Form ref='addform' :model="adminInfo" label-position='left' :label-width="90" :rules="ruleValidate">
        <FormItem label="管理员账号" prop="username">
          <Input v-model="adminInfo.username" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="管理员密码" prop="password">
          <Input v-model="adminInfo.password" placeholder="请输入"></Input>
        </FormItem>
         <FormItem label="管理员角色" prop="role">
          <Select v-model="adminInfo.subRole" placeholder="请选择">
            <Option v-for="item in subRoleList" :value="item.name" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Spin size="large" fix v-if="spin">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import {
  agentAdminList,
  updatePassword,
  agentAdminNew,
  checkExit,
  getsbuRole,
  updateSubrole
} from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("账号不能为空"));
      } else {
        let nameReg = /^[a-zA-Z0-9]{5,16}$/;
        if (!nameReg.test(value)) {
          callback(new Error("5-16位,限英文和数字"));
        } else {
          checkExit({
            user: { role: "1000", suffix: "", username: value }
          }).then(res => {
            if (res.payload == true) {
              callback();
            } else {
              callback(new Error("账号不可用,请重新输入"));
            }
          });
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      } else {
        let testReg = /^[a-zA-Z0-9@_#$%^&*!.~-]{6,16}$/;
        if (!testReg.test(value)) {
          callback(new Error("6~16位,包含字母、数字及符号"));
        } else {
          callback();
        }
      }
    };
    return {
      modal: false, //修改密码modal
      password: "",
      repassword: "",
      adminModal: false, //添加管理员modal
      adminInfo: {
        username: "",
        password: "",
        subRole:''
      },
      spin: false,
      adminList: [],
      userId: "",
      subRole: "",
      subRoleList: [],
      roleModal: false,
      ruleValidate: {
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
        ]
      },
      columns1: [
        {
          title: "序号",
          align: 'center',
          type: "index",
          maxWidth: 80
        },
        {
          title: "账号",
          align: 'center',
          key: "uname"
        },
        {
          title: "昵称",
          align: 'center',
          key: "displayName"
        },
        {
          title: "管理员角色",
          align: 'center',
          key: "subRole"
        },
        {
          title: "剩余点数",
          align: 'center',
          key: "balance",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.balance));
          }
        },
        {
          title: "创建时间",
          align: 'center',
          key: "createdAt",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h("p", [
              h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer",
                    paddingRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.modal = true;
                      this.userId = params.row.userId;
                    }
                  }
                },
                "修改密码"
              ),
              h("span", "|"),
              h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer",
                    paddingLeft: "5px"
                  },
                  on: {
                    click: () => {
                      this.userId = params.row.userId;
                      this.subRole = params.row.subRole;
                      this.roleModal = true;
                    }
                  }
                },
                "修改角色"
              )
            ]);
          }
        }
      ],
      spinShow: false
    };
  },
  computed: {},
  methods: {
    addAdmin() {
      this.adminModal = true;
    },
    ok() {
      if (this.password != this.repassword) {
        this.$Message.warning({
          content: "两次密码不一致"
        });
        return;
      }
      if (this.passwordLevel(this.repassword) < 2) {
        this.$Message.warning({
          content: "密码中必须包含6-16位由字母、数字、符号中至少两种组成"
        });
        return;
      }
      updatePassword({
        userId: this.userId,
        password: this.repassword
      }).then(() => {
        this.$Message.success({
          content: "修改成功"
        });
        this.password = "";
        this.repassword = "";
        // this.init()
      });
    },
    cancel() {
      this.password = "";
      this.repassword = "";
    },
    add() {
      if (this.passwordLevel(this.adminInfo.password) < 2) {
        this.$Message.warning({
          content: "密码中必须包含6-16位由字母、数字、符号中至少两种组成"
        });
        return;
      }
      agentAdminNew({
        ...this.adminInfo,
        role: "1000"
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("创建成功");
          this.$refs["addform"].resetFields();
          this.init();
        }
      });
    },
    addcancel() {
      this.$refs["addform"].resetFields();
      this.adminInfo.subRole=''
    },
    reset() {
      this.init();
    },
    updateRole() {
      updateSubrole({
        subRole: this.subRole,
        userId: this.userId
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
          this.spin = true;
          agentAdminList({
            query: {},
            sortkey: "createdAt",
            sort: "desc"
          }).then(res => {
            if (res.code == 0) {
              this.adminList = res.payload;
              this.spin = false;
            }
          });
        }
      });
    },
    cancelRole() {
      this.subRole = "";
    },
    init() {
      this.spin = true;
      agentAdminList({
        query: {},
        sortkey: "createdAt",
        sort: "desc"
      }).then(res => {
        if (res.code == 0) {
          this.adminList = res.payload;
          this.spin = false;
        }
      });
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
      if (from.name == "addAdmin") {
        this.$store.dispatch("getAdminList", {
          query: {},
          sortkey: "createdAt",
          sort: "desc"
        });
      }
    }
  }
};
</script>
<style lang="less" scoped>
.adminList {
  min-height: 89vh;
  .option {
    .create {
      padding-bottom: 16px;
    }
    .searchbtn {
      float: right;
      margin-right: 10px;
    }
  }
}
.modal_input {
  margin-bottom: 10px;
}
.label {
  line-height: 32px;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
