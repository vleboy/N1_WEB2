<template>
  <div class="adminList">
    <!-- <div class="search">
      <Row class="row">
        <Col span="2" offset="14">用户名</Col>
        <Col span="4">
        <Input v-model="username" placeholder="请输入"></Input>
        </Col>
        <Col span="3">
        <div class="btns">
          <Button type="primary" class="searchbtn">搜索</Button>
          <Button type="ghost">重置</Button>
        </div>
        </Col>
      </Row>
    </div> -->
    <div class="option">
      <p class="create">
        <Button type="primary" @click="addAdmin">创建管理员</Button>
        <Button type="primary" class="searchbtn" @click="reset">刷新</Button>
      </p>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="adminList" size="small" ></Table>
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
    <Spin size="large" fix v-if="$store.state.admin.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { getsbuRole, adminUpdate } from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    return {
      subRoleList: [],
      subRole: "",
      roleModal: false, //修改角色modal
      username: "",
      modal: false, //修改密码modal
      password: "",
      repassword: "",
      userId: "",
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 60
        },
        {
          title: "账号",
          key: "uname",
          align: 'center',
          sortable:true
        },
        {
          title: "真实姓名",
          key: "adminName",
          align: 'center',
          sortable:true
        },
        {
          title: "管理员角色",
          key: "subRole",
          align: 'center',
          sortable:true
        },
        {
          title: "剩余点数",
          key: "balance",
          align: 'center',
          sortable:true,
          render:(h,params)=>{
            return h('span',thousandFormatter(params.row.balance))
          }
        },
        {
          title: "创建时间",
          key: "createdAt",
          align: 'center',
          sortable:true,
          minWidth:20,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "邮箱",
          key: "adminEmail",
          align: 'center',
          sortable:true
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          minWidth:20,
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
  computed: {
    adminList() {
      return this.$store.state.admin.adminList;
    }
  },
  methods: {
    addAdmin() {
      this.$router.push({ name: "addAdmin" });
    },
    ok() {
      // let passReg = /^[a-zA-Z0-9@_#$%^&*!~-]{8,16}$/;
      // if (!passReg.test(this.password)) {
      //   this.$Message.warning({
      //     content: "密码为8-16位的(英文、数字、符号)"
      //   });
      //   return;
      // }
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
      this.$store
        .dispatch("updatePwd", {
          userId: this.userId,
          password: this.repassword
        })
        .then(() => {
          this.password = "";
          this.repassword = "";
        });
    },
    cancel() {
      this.password = "";
      this.repassword = "";
    },
    reset() {
      this.init();
    },
    init() {
      this.$store.commit("logLoading", { params: true });
      getsbuRole().then(res => {
        if (res.code == 0) {
          this.subRoleList = res.payload.Items;
        }
      });
      this.$store.dispatch("getAdminList", {
        query: {},
        sortkey: "createdAt",
        sort: "desc"
      });
    },
    updateRole() {
      adminUpdate({
        subRole: this.subRole,
        userId: this.userId
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
          this.$store.dispatch("getAdminList", {
            query: {},
            sortkey: "createdAt",
            sort: "desc"
          });
        }
      });
    },
    cancelRole() {
      this.subRole = "";
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
