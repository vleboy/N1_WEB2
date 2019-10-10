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
      <Table :columns="columns1" :data="showWaterList" size="small">
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
      <Page :total="totalPage" class="page" :page-size="pageSize" @on-change="changepage"></Page>
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

    <Spin size="large" fix v-show="$store.state.login.loading" style="z-index:200;">
      <Icon type="ios-loading" size="64" class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { httpRequest, adminCenter } from "@/service/index";
import { thousandFormatter } from "@/config/format";
import _ from "lodash";
export default {
  name: "ownSpace",
  data() {
    return {
      modal: false,
      showPass: false,
      startKey: false,
      thousandFormatter: thousandFormatter,
      password: "",
      repassword: "",
      dayjs: dayjs,
      admin: {},
      dataList: [],
      showWaterList: [],
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

          maxWidth: 120
        },
        {
          title: "交易前余额",
          slot: "oldBalance",
          align: "center"
        },
        {
          title: "交易点数",
          slot: "amount",
          align: "center"
        },
        {
          title: "交易后余额",
          align: "center",
          slot: "newBalance"
        },
        {
          title: "操作人",
          slot: "operator",
          align: "center"
        },
        {
          title: "备注",
          align: "center",
          slot: "remark",
          maxWidth: 60
        }
      ],
      totalPage: 20, //数据总量
      pageSize: 20, //每页显示数据量
      currentPage: 1, //当前页码
      showNext: false //是否显示下100条
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
        return { isShow: false, remark: row.remark };
      } else {
        return { isShow: true, remark: row.remark };
      }
    },

    handlePage() {
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      console.log(this.waterfall)
      if (this.total < this.pageSize) {
        this.showData = this.waterfall;
      } else {
        this.showData = this.waterfall.slice(0, this.pageSize);
      }
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

              self.dataList.push(self.admin);
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
    //切页
    changepage(index) {
      if (this.showData.length >= 100) {
          if (index % 5 == 0 && this.showData.length <= index * 20) {
          this.showNext = true;
          this.getWaterfallList();
        }
      }
      
      this.showWaterList = _.chunk(this.showData, 20)[index - 1];
    },
    //获取流水列表
    async getWaterfallList() {
      let userId = localStorage.loginId ? localStorage.getItem("loginId") : "";
      if (this.showNext) {
        let params = {
          createdAt: this.startKey.createdAt,
          sn: this.startKey.sn,
          balance: this.showData[this.showData.length - 1].oldBalance
        };
        this.$store.commit("updateLoading", { params: true });
        let waterfall = await httpRequest(
          "get",
          `/waterfall/${userId}`,
          params
        );
        this.$store.commit("updateLoading", { params: false });
        this.showData = this.showData.concat(waterfall.payload);
        this.totalPage = this.showData.length;
        this.startKey = waterfall.startKey;
      } else {
        let params = "";
        this.$store.commit("updateLoading", { params: true });
        let waterfall = await httpRequest(
          "get",
          `/waterfall/${userId}`,
          params
        );
        this.$store.commit("updateLoading", { params: false });
        this.showData = waterfall.payload;
        this.totalPage = this.showData.length;
        this.startKey = waterfall.startKey;
        this.showWaterList = _.chunk(this.showData, 20)[0];
      }
    },
    async init() {
      this.dataList = [];
      this.$store.commit("updateLoading", { params: true });
      let req2 = adminCenter();
      let [admin] = await this.axios.all([req2]);
      await this.getWaterfallList()
      this.$store.commit("updateLoading", { params: false });
      if (admin && admin.code == 0) {
        this.admin = admin.payload;
        this.dataList.push(admin.payload);
      }
      // this.handlePage();
    }
  },

  created() {
    this.init();
    this.showWaterList = []
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


