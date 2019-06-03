<template>
  <div class="adminList">
    <div class="option">
      <div class="create">
        <Button type="primary" @click="addAdmin" size="small">创建管理员</Button>
        <p>
          <Select v-model="model1" style="width:120px;margin-left:1rem;" size="small" @on-change="changeStatus">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
        </p>
      </div>
      <Button type="primary" class="searchbtn" @click="reset" size="small">刷新</Button>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="adminList" size="small" >
        <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <span style="color: #20a0ff;cursor:pointer;" @click="operatePwd(row)">修改密码</span>
          <span style="margin:0 .3rem">|</span>
          <span style="color: #20a0ff;cursor:pointer;" @click="operateRole(row)">修改角色</span>
          <span style="margin:0 .3rem">|</span>
          <span :style="{color: statusConfig(row),cursor: 'pointer'}" @click="operateStatus(row)">{{row.status == 1 ? "停用" : "启用"}}</span>
        </template>
      </Table>
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
   
    <Spin size="large" fix v-show="$store.state.admin.loading" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { getsbuRole, adminUpdate,userChangeStatus } from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    return {
      model1: '启用',
      subRoleList: [],
      subRole: "",
      roleModal: false, //修改角色modal
      username: "",
      modal: false, //修改密码modal
      password: "",
      repassword: "",
      userId: "",
      switchStatus: true,
      statusList: [
        {
          code: '1',
          value: '启用'
        },
        {
          code: '0',
          value: '停用'
        }
      ],
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
          slot: "balance",
          align: 'center',
          sortable:true
        },
        {
          title: "创建时间",
          slot: "createdAt",
          align: 'center',
          sortable:true,
          minWidth:20
        },
        {
          title: "邮箱",
          key: "adminEmail",
          align: 'center',
          sortable:true
        },
        {
          title: "操作",
          slot: "operate",
          align: 'center',
          minWidth:40
        }
      ],
      spinShow: false
    };
  },
  computed: {
    adminList() {
      let on = []//启用的管理员列表
      let off = []//禁用的管理员列表
      for (let i = 0; i < this.$store.state.admin.adminList.length; i++) {
        if (this.$store.state.admin.adminList[i].status == 1) {
          on.push(this.$store.state.admin.adminList[i])
        } else {
          off.push(this.$store.state.admin.adminList[i])
        }  
      }
     
      return this.switchStatus ? on : off
      //return on
      
    }
  },
  methods: {
    //创建时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD")   
    },
    //剩余点数
    balanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    /* 操作 */
    //修改面膜
    operatePwd(row) {
      this.modal = true;
      this.userId = row.userId;
    },
    //修改角色
    operateRole(row) {
      this.userId = row.userId;
      this.subRole = row.subRole;
      this.roleModal = true;
    },
    //启用禁用
    statusConfig(row) {
      return row.status == 1 ? "#f5141e" : "#20a0ff"
    },
    operateStatus(row) {
      let text = row.status == 1 ? "停用" : "启用"
      let status = row.status == 1 ? 0 : 1
      this.$Modal.confirm({
        title: "提示!",
        content: `<p>是否${text}管理员</p>`,
        onOk: () => {
          userChangeStatus({
            role: "1",
            status,
            userId: row.userId
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success(`${text}成功`);
              this.init();
            }
          });
        }
      });
    },         
    changeStatus(val) {
      this.switchStatus = val == "停用" ? false : true
    },

    addAdmin() {
      this.$router.push({ name: "addAdmin" });
    },
    userShow (status) {
      console.log(status)
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
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    .create {
      display: flex;
      justify-content: start;
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
  .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
</style>
