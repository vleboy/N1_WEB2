<template>
  <div class="personalcenter">
    <Table :columns="columns" :data="dataList" size="small">
      <template slot-scope="{row, index}" slot="username">{{usernameConfig(row)}}</template>
      <template slot-scope="{row, index}" slot="password">
        <span v-if="showPass">{{row.password}}</span>
        <span v-else>******</span>
        <span
          v-if="showPass"
          @click="showPass = !showPass"
          style="color:#20a0ff;cursor:pointer;margin:0 .3rem;"
        >隐藏</span>
        <span
          v-else
          @click="showPass = !showPass"
          style="color:#20a0ff;cursor:pointer;margin:0 .3rem;"
        >显示</span>
        <span @click="newPassword" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">修改密码</span>
      </template>
      <template slot-scope="{row, index}" slot="balance">{{balanceConfig(row)}}</template>
      <template slot-scope="{row, index}" slot="subRole">{{row.subRole}}</template>
      <template slot-scope="{row, index}" slot="loginAt">{{loginAtConfig(row)}}</template>
    </Table>
    <div class="manager-copertion">
      <h2 style="margin:1rem 0">
        财务信息
        <span
          style="color:#20a0ff;cursor:pointer;fontSize:1rem"
          @click="getWaterfallList"
        >(点击查询)</span>
      </h2>
      <Table :columns="columns1" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="createdAt">{{createdAtConfig(row)}}</template>
        <template slot-scope="{row, index}" slot="toUser">
          <span>{{row.fromLevel > row.toLevel ? row.toDisplayName + " 对 " + row.fromDisplayName : row.fromDisplayName + " 对 " + row.toDisplayName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="amountType">
          <span>{{row.amount > 0 ? "减点" : "加点"}}</span>
        </template>
        <template slot-scope="{row, index}" slot="oldBalance">{{oldBalanceConfig(row)}}</template>
        <template slot-scope="{row, index}" slot="amount">
          <span :style="{color:amountConfig(row).color}">{{amountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="newBalance">{{newBalanceConfig(row)}}</template>
        <template slot-scope="{row, index}" slot="operator">
          <span>{{row.operator.split("_")[1]}}</span>
        </template>
        <template slot-scope="{row, index}" slot="remark">
          <Tooltip v-if="remarkConfig(row).isShow" :content="remarkConfig(row).remark">
            <Icon type="ios-search"/>
          </Tooltip>
          <span v-else></span>
        </template>
      </Table>
      <Page
        :total="total"
        class="page"
        show-elevator
        :page-size="pageSize"
        show-total
        @on-change="changepage"
      ></Page>
    </div>
    <Modal v-model="modal" title="修改密码" :width="350" @on-ok="ok" @on-cancel="cancel">
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
    <Spin size="large" fix v-if="$store.state.login.loading">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { getWaterfall, adminCenter } from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  name: "ownSpace",
  data() {
    return {
      modal: false,
      showPass: false,
      thousandFormatter: thousandFormatter,
      password: "",
      repassword: "",
      dayjs: dayjs,
      pageSize: 100,
      admin: {},
      dataList: [],
      waterfall: [],
      showData: [],
      columns: [
        {
          title: "管理员账号",
          align: "center",
          slot: "username"
        },
        {
          title: "管理员密码号",
          align: "center",
          slot: "password"
        },
        {
          title: "管理员余额",
          align: "center",
          slot: "balance"
        },
        {
          title: "管理员角色",
          align: "center",
          slot: "subRole"
        },
        {
          title: "上次登录时间",
          align: "center",
          slot: "loginAt"
        },
        {
          title: "上次登录IP",
          align: "center",
          key: "lastIP"
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 60,
          align: "center"
        },
        {
          title: "交易时间",
          slot: "createdAt",
          sortable: true,
          align: "center"
        },
        {
          title: "交易对象",
          slot: "toUser",
          align: "center"
        },
        {
          title: "交易类型",
          slot: "amountType",
          align: "center",
          sortable: true,
          maxWidth: 120
        },
        {
          title: "交易前余额",
          slot: "oldBalance",
          align: "center",
          sortable: true
        },
        {
          title: "交易点数",
          slot: "amount",
          align: "center",
          sortable: true
        },
        {
          title: "交易后余额",
          align: "center",
          slot: "newBalance",
          sortable: true
        },
        {
          title: "操作人",
          slot: "operator",
          align: "center",
          sortable: true
        },
        {
          title: "备注",
          align: "center",
          slot: "remark",
          maxWidth: 60
        }
      ]
    };
  },
  computed: {
    total() {
      return this.waterfall.length;
    }
  },
  methods: {
    //Table
    //管理员账号
    usernameConfig(row) {
      return row.username ? row.username.toString().substr(9) : "";
    },

    //管理员余额
    balanceConfig(row) {
      return thousandFormatter(row.balance);
    },
    //上次登录时间
    loginAtConfig(row) {
      return dayjs(row.loginAt).format("YYYY-MM-DD HH:mm:ss");
    },

    //财务信息
    //交易时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss");
    },
    //交易前余额
    oldBalanceConfig(row) {
      return thousandFormatter(row.oldBalance);
    },
    //交易点数
    amountConfig(row) {
      let color = row.amount < 0 ? "#f30" : "#0c0";
      return { amount: thousandFormatter(row.amount), color };
    },
    //交易后余额
    newBalanceConfig(row) {
      return thousandFormatter(row.balance);
    },
    //备注
    remarkConfig(row) {
      if (row.remark == "NULL!" || row.remark == null) {
        return {isShow:false, remark: row.remark}
      } else {
       return {isShow:true, remark: row.remark}
      }
    },

    handlePage() {
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.total < this.pageSize) {
        this.showData = this.waterfall;
      } else {
        this.showData = this.waterfall.slice(0, this.pageSize);
      }
    },
    changepage(index) {
      let size = this.pageSize;
      let _start = (index - 1) * size;
      let _end = index * size;
      this.showData = this.waterfall.slice(_start, _end);
    },
    newPassword() {
      this.modal = true;
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
      let userId = "";
      if (localStorage.userInfo) {
        userId = JSON.parse(localStorage.getItem("userInfo")).userId;
      }
      let self = this;
      this.$store.commit("updateLoading", { params: true });
      this.$store
        .dispatch("changePassword", {
          userId: userId,
          password: this.repassword
        })
        .then(res => {
          if (res.code == 0) {
            self.password = "";
            self.repassword = "";
            adminCenter().then(res => {
              self.dataList = [];
              self.admin = res.payload;
              self.dataList.push(admin);
              self.$store.commit("updateLoading", { params: false });
              self.$Message.success("修改成功");
            });
          }
        });
    },
    cancel() {
      this.password = "";
      this.repassword = "";
    },
    passwordLevel(password) {
      let Modes = 0;
      let len = password.length;
      if (len < 6 || len > 16) {
        return 0;
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
    },
    reset() {
      this.init();
    },
    async getWaterfallList() {
      let userId = localStorage.loginId ? localStorage.getItem("loginId") : "";
      let req1 = getWaterfall(userId);
      this.$store.commit("updateLoading", { params: true });
      let waterfall = await this.axios.all([req1]);
      this.$store.commit("updateLoading", { params: false });
      this.showData = waterfall[0].payload;
    },
    async init() {
      this.dataList = [];
      this.$store.commit("updateLoading", { params: true });
      let req2 = adminCenter();
      let [admin] = await this.axios.all([req2]);
      this.$store.commit("updateLoading", { params: false });
      if (admin && admin.code == 0) {
        this.admin = admin.payload;
        this.dataList.push(admin.payload);
      }
      this.handlePage();
    }
  },

  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.personalcenter {
  min-height: 89vh;
  .manangeinfo {
    width: 100%;
    margin: 10px auto 20px;
    table {
      width: 100%;
      border-collapse: collapse;
      td {
        border: 1px solid #e9eaec;
        width: 32%;
        height: 50px;
        padding-left: 10px;
      }
    }
    .newPassword {
      margin-left: 0.5rem;
      color: #20a0ff;
      display: inline-block;
      // font-size: 1rem;
      font-weight: normal;
      cursor: pointer;
    }
  }
  .page {
    text-align: right;
  }
  .reload {
    text-align: right;
  }
}
.modal_input {
  margin-bottom: 10px;
}
.label {
  line-height: 32px;
}
.page {
  text-align: right;
  margin-top: 20px;
}
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
/deep/ .ivu-table-cell {
  padding: 0;
}
</style>


