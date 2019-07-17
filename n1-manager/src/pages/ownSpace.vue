<template>
  <div class="personalcenter">
    <div class="manangeinfo">
      <Table :columns="columns" :data="dataList">
        <template slot-scope="{row, index}" slot="password">
          <span v-if="showPass">{{row.password}}</span>
          <span v-else>******</span>
          <span v-if="showPass" @click="showPass = !showPass" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">{{$t('ownSpace.hide')}}</span>
          <span v-else @click="showPass = !showPass" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">{{$t('ownSpace.show')}}</span>
          <span class="newPassword" @click="newPassword">{{$t('ownSpace.changePwd')}}</span>
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
          <span>{{joinTimeConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="apiKey">
          <span v-if="showKey">{{row.apiKey}}</span>
          <span v-else>******</span>
          <span  @click="showKey=!showKey" v-if="showKey" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">{{$t('ownSpace.hide')}}</span>
          <span  @click="showKey=!showKey" v-else style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">{{$t('ownSpace.show')}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <span @click="reset" style="color:#20a0ff;cursor:pointer">{{$t('ownSpace.refresh')}}</span>
        </template>
      </Table>
    </div>
    <div class="manager-copertion">
      <h2>{{$t('ownSpace.infomation')}}
        <span style="color:#20a0ff;cursor:pointer;fontSize:1rem" @click="getWaterfallList">{{$t('ownSpace.query')}}</span>
      </h2>
      <Table :columns="columns1" :data="showWaterList" size="small">
        <template slot-scope="{row, index}" slot="waterCreatedAt">
          <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="amountType">
          <span>{{amountConfig1(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="toUser">
          <span>{{row.fromLevel > row.toLevel ? `${row.toDisplayName}对${row.fromDisplayName}` : `${row.fromDisplayName}对${row.toDisplayName}`}}</span>
        </template>
        <template slot-scope="{row, index}" slot="oldBalance">
          <span>{{oldBalanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="amount">
          <span :style="{color: amountConfig(row).color}">{{amountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operator">
          <span>{{row.operator.split("_")[1]}}</span>
        </template>
        
        <template slot-scope="{row, index}" slot="remark">
          <Tooltip :content="remarkConfig(row).content" v-if="remarkConfig(row).isShow">
            <Icon type="ios-search" color="#20a0ff" />
          </Tooltip>
          <span v-else></span>
        </template>
      </Table>
      <Page :total="total" class="page" :page-size='pageSize' @on-change="changepage"></Page>
    </div>
    <Modal v-model="modal" :title="$t('ownSpace.changePwd')" :width='350' @on-ok="ok" @on-cancel='cancel'>
      <p class="modal_input">
        <Row>
          <Col span="6" class="label">{{$t('ownSpace.newPWd')}}</Col>
          <Col span="14">
          <Input v-model="password" :placeholder="$t('ownSpace.regPwd')"></Input>
          </Col>
        </Row>
      </p>
      <p class="modal_input">
        <Row>
          <Col span="6" class="label">{{$t('ownSpace.rePwd')}}</Col>
          <Col span="14">
          <Input v-model="repassword"></Input>
          </Col>
        </Row>
      </p>
    </Modal>
    <Spin size="large" fix v-if="$store.state.login.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>{{$t('ownSpace.loading')}}</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { httpRequest,getWaterfall, oneManagers } from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    return {
      showKey:false,
      modal: false,
      password: "",
      showPass: false,
      repassword: "",
      dayjs: dayjs,
      pageSize: 50,
      admin: {},
      dataList: [],
      waterfall: [],
      showData: [],
      showWaterList:[],
      totalPage: 100, //数据总量
      pageSize: 20, //每页显示数据量
      currentPage: 1, //当前页码
      showNext: false, //是否显示下100条
      columns: [
        {
          title: "线路商标识",
          align: "center",
          key: "suffix",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '线路商标识' : 'SN'
            )
          }
        },
        {
          title: "线路商ID",
          align: "center",
          minWidth: 30,
          key: "displayId",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '线路商ID' : 'Manager ID'
            )
          }
        },
        {
          title: "线路商账号",
          align: "center",
          key: "uname",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '线路商账号' : 'Account'
            )
          }
        },
        {
          title: "线路商密码",
          align: "center",
          slot: "password",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '线路商密码' : 'Password'
            )
          }
        },
        {
          title: "上次登录IP",
          align: "center",
          key: "lastIP",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '上次登录IP' : 'Last IP'
            )
          }
        },
        {
          title: "上次登录时间",
          align: "center",
          slot: "joinTime",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '上次登录时间' : 'Last Time'
            )
          }
        },
        {
          title: "创建时间",
          align: "center",
          slot: "createdAt",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '创建时间' : 'Create Time'
            )
          }
        },
        {
          title: "商户API密钥",
          minWidth: 100,
          slot: "apiKey",
          align: "center",
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户API密钥' : 'API Key'
            )
          }
        },
        {
          title: "操作",
          align: "center",
          slot: "operate",
          minWidth: 30,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作' : 'Operation'
            )
          }
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 90,
          minWidth: 50,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "交易时间",
          slot: "waterCreatedAt",
          align: 'center',
          sortable: true,
          minWidth: 60,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易时间' : 'Transaction Time'
            )
          }
        },
        {
          title: "交易对象",
          minWidth: 30,
          slot: "toUser",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易对象' : 'Target'
            )
          }
        },
        {
          title: "交易类型",
          slot: "amountType",
          maxWidth: 140,
          minWidth: 100,
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易类型' : 'Transaction Type'
            )
          }
        },
        {
          title: "交易前余额",
          slot: "oldBalance",
          sortable: true,
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易前余额' : 'Pre Balance'
            )
          }
        },
        {
          title: "交易点数",
          slot: "amount",
          align: 'center',
          sortable: true,
          maxWidth: 200,
          minWidth: 20,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易点数' : 'Point'
            )
          }
        },
        {
          title: "交易后余额",
          slot: "balance",
          sortable: true,
          align: 'center',
          minWidth: 100,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易后余额' : 'Balance'
            )
          }
        },
        {
          title: "操作人",
          slot: "operator",
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作人' : 'Operator'
            )
          }
        },
        {
          title: "备注",
          slot: "remark",
          align: 'center',
          maxWidth: 60,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '备注' : 'Remark'
            )
          }
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
    /* 线路商信息 */
    //线路商密码
    passwordConfig(row) {

    },
    //上次登录时间
    joinTimeConfig(row) {
      return dayjs(row.joinTime).format('YYYY-MM-DD HH:mm:ss')
    },
    //创建时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
    /* 财务信息 */
    //交易前余额
    oldBalanceConfig(row) {
      return thousandFormatter(row.oldBalance)
    },
    amountConfig1(row) {
      if (this.$store.state.language == 'zh') {
        if(row.fromDisplayName == row.toDisplayName){
          if(row.amount<0){
            return '玩家充值'
          }else{
            return '玩家提现'
          }
        }else{
          if (row.fromLevel > row.toLevel) {
            return "减点"
          } else {
            return "加点"
          }
        }
      } else {
        if(row.fromDisplayName == row.toDisplayName){
          if(row.amount<0){
            return 'Player recharge'
          }else{
            return 'Player withdrawal'
          }
        }else{
          if (row.fromLevel > row.toLevel) {
            return "Reduce point"
          } else {
            return "Add point"
          }
        }
      }
    },
    //交易点数
    amountConfig(row) {
      let color = row.amount < 0 ? "#f30" : "#0c0";
      return {amount: thousandFormatter(row.amount), color}
    },
    //交易后余额
    balanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    //备注
    remarkConfig(row) {
      if (row.remark == "NULL!" || row.remark == null) {
        return false
      } else {
        return {isShow: true, content: row.remark}
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
      // console.log(this.showData);
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
          self.dataList = []
          if (res.code == 0) {
            self.password = "";
            self.repassword = "";
            oneManagers(userId).then(res => {
              self.admin = res.payload;
              self.dataList.push(self.admin)
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
    },
    reset() {
      this.init();
    },
    //切页
    changepage(index) {
      if (this.showData.length >= 100) {
          if (index % 5 == 0 && this.showData.length <= index * 20) {
          console.log(this.showData.length);
          
          this.showNext = true;
          this.getWaterfallList();
        }
      }
      
      this.showWaterList = _.chunk(this.showData, 20)[index - 1];
    },
    //获取流水列表
    async getWaterfallList() {
      /* let userId = localStorage.loginId ? localStorage.getItem("loginId") : "";
      let req1 = getWaterfall(userId);
      this.$store.commit("updateLoading", { params: true });
      let waterfall = await this.axios.all([req1])
      this.$store.commit("updateLoading", { params: false });
      this.showData = waterfall[0].payload */
      let userId = localStorage.loginId ? localStorage.getItem("loginId") : "";
    
      if (this.showNext) {
        console.log(this.showData[this.showData.length - 1].oldBalance);
        
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
      this.dataList = []
      this.$store.commit("updateLoading", { params: true });
      let userId = localStorage.loginId ? localStorage.getItem("loginId") : "";
      let req2 = oneManagers(userId);
      let [admin] = await this.axios.all([req2]);
      this.$store.commit("updateLoading", { params: false });
      if (admin && admin.code == 0) {
        this.admin = admin.payload;
        this.dataList.push(this.admin)
      }
      this.handlePage();
    }
  },
  filters: {
    getName(value) {
      if (!value) return "";
      value = value.toString();
      return value.substr(9);
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


