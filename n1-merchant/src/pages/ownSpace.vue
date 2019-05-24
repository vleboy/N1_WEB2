<template>
  <div class="personalcenter">
    <div class="personalInfo">
      <Table :columns="columns2" :data="showData2" size="small">
        <template slot-scope="{row, index}" slot="password">
          <span v-if="showPass">{{row.password}}</span>
          <span v-else>******</span>
          <span v-if="showPass" @click="showPass = !showPass" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">隐藏</span>
          <span v-else @click="showPass = !showPass" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">显示</span>
          <span class="newPassword" @click="newPassword">修改密码</span>
        </template>
        <template slot-scope="{row, index}" slot="apiKey">
          <span v-if="showKey">{{row.apiKey}}</span>
          <span v-else>******</span>
          <span  @click="showKey=!showKey" v-if="showKey" style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">隐藏</span>
          <span  @click="showKey=!showKey" v-else style="color:#20a0ff;cursor:pointer;margin:0 .3rem;">显示</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <span @click="refresh" style="color:#20a0ff;cursor:pointer">刷新</span>
        </template>
      </Table>

    </div>
    <div class="financial">
      <h2>财务信息
        <span style="color:#20a0ff;cursor:pointer;fontSize:1rem" @click="getWaterfallList">(点击查询)</span>
      </h2>
      <Table :columns="columns1" :data="showWaterList" size="small">
        <template slot-scope="{ row, index }" slot="createdAt">
          <span>{{dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="toUser">
          <span>{{toUserConfig(row)}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="amountType">
          <span>{{amountConfig1(row)}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="oldBalance">
          <span>{{oldBalanceConfig(row)}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="amountCode">
          <span :style="{color:amountConfig2(row).color}">{{amountConfig2(row).amount}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="balance">
          <span>{{balanceConfig(row)}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="operator">
          <span>{{operatorConfig(row)}}</span>  
        </template>
        <template slot-scope="{ row, index }" slot="remark">
          <Tooltip :content="remarkConfig(row).content" v-if="remarkConfig(row).isShow">
            <Icon type="md-search" color="#20a0ff" />
          </Tooltip>
          <span v-else>{{remarkConfig(row).content}}</span>  
        </template>
      </Table>
      <Page :total="totalPage" class="page" :page-size='pageSize' @on-change="changepage"></Page>
    </div>
    <Modal v-model="modal" title="修改密码" :width='350' @on-ok="ok" @on-cancel='cancel'>
      <p class="modal_input">
        <Row>
          <Col span="6" class="label">新密码</Col>
          <Col span="14">
          <Input v-model="password" placeholder="6-16位密码,包含英文数字"></Input>
          </Col>
        </Row>
      </p>
      <p class="modal_input">
        <Row>
          <Col span="6" class="label">重复新密码</Col>
          <Col span="14">
          <Input v-model="repassword"></Input>
          </Col>
        </Row>
      </p>
    </Modal>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { httpRequest, oneMerchants } from "@/service/index";
import { thousandFormatter } from "@/config/format";
import { validatePwd } from "@/config/regexp";
export default {
  data() {
    return {
      spinShow: false,
      tableColor: '',
      modal: false,
      password: "",
      showPass: false,
      showKey:false,
      repassword: "",
      dayjs: dayjs,
      pageSize: 50, 
      admin: {},
      waterfall: [],
      showData: [],
      showData2: [],
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 60
        },
        {
          title: "交易时间",
          slot: "createdAt",
          sortable: true,
          align: 'center',
        },
        {
          title: "交易对象",
          slot: "toUser",
          align: 'center',
          minWidth:50
        },
        {
          title: "交易类型",
          slot: "amountType",
          align: 'center',
          maxWidth: 120,
          sortable: true
        },
         {
          title: "交易前余额",
          slot: "oldBalance",
          align: 'center',
          sortable: true
        },
        {
          title: "交易点数",
          slot: "amountCode",
          align: 'center',
          maxWidth: 200,
          sortable: true
        },
        {
          title: "交易后余额",
          slot: "balance",
          align: 'center',
          sortable: true,
        },
        {
          title: "操作人",
          slot: "operator",
          align: 'center',
          sortable: true
        },
        {
          title: "备注",
          slot: "remark",
          maxWidth: 60,
          align: 'center'
        }
      ],
      columns2: [
        {
          title: "商户标识",
          key: "sn",
          align: "center"
        },
        { 
          title: "商户ID",
          align: 'center',
          key: "displayId",
          maxWidth: 60
        },
        {
          title: "管理员账号",
          key: "uname",
          align: "center"
        },
        {
          title: "管理员密码",
          slot: "password",
          align: "center"
        },
        
        {
          title: "商户API密钥",
          minWidth: 100,
          slot: "apiKey",
          align: "center"
        },
        {
          title: "操作",
          slot: "operate",
          maxWidth: 60
        }
      ],
      showWaterList:[],
      totalPage: 20, //数据总量
      pageSize: 20, //每页显示数据量
      currentPage: 1, //当前页码
      showNext: false //是否显示下100条
    };
  },
  computed: {
    total() {
      return this.waterfall.length;
    },
  },
  methods: {
    //管理员密码配置
    passwordConfig(row) {

    },
    //财务信息交易对象
    toUserConfig(row) {
      if (row.fromLevel > row.toLevel) {
        return row.toDisplayName + " 对 " + row.fromDisplayName
      } else {
        return row.fromDisplayName + " 对 " + row.toDisplayName
      }
    },
    //财务信息交易类型
    amountConfig1(row) {
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
    },
    //财务信息交易前余额
    oldBalanceConfig(row) {
      return thousandFormatter(row.oldBalance)
    },
    //财务信息交易点数
    amountConfig2(row, index) {
      if (row.amount < 0) {
          return {amount:thousandFormatter(row.amount), color:"#f30"}
        } else {
          return {amount:thousandFormatter(row.amount), color:"#0c0"}
        }
    },
    //财务信息交易后余额
    balanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    //财务信息操作人
    operatorConfig(row) {
      return row.operator.split("_")[1]
    },
    //财务信息备注
    remarkConfig(row) {
      if (row.remark == "NULL!" || row.remark == null) {
        return {isShow: false}
      } else {
        return {content: row.remark, isShow: true}
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
      let pwdReg = /^(\w){6,16}$/
      if (!pwdReg.test(this.password)) {
        this.$Message.warning({
          content: "密码中必须包含6-16位"
        })
        this.spinShow = false
        return
      } 
      
      let userId = "";
      if (localStorage.userInfo) {
        userId = JSON.parse(localStorage.getItem("userInfo")).userId;
      }
      let self = this;
      this.spinShow = true
      this.$store
        .dispatch("changePassword", {
          userId: userId,
          password: this.repassword
        })
        .then(res => {
          if (res.code == 0) {
            self.password = "";
            self.repassword = "";
            oneMerchants(userId).then(res => {
              self.admin = res.payload;
              //console.log(self.admin);
              
              self.spinShow = false
              self.$Message.success("修改成功");
              this.refresh()
            });
          }
        }).catch(()=>{
          self.spinShow = false
        })
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
    refresh() {
      this.init();
    },
    //切页
    changepage(index) {
      if (this.showData.length >= 100) {
          if (index % 5 == 0 && this.showData.length <= index * 20) {
          //(this.showData.length);
          
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
        //(this.showData[this.showData.length - 1].oldBalance);
        
        let params = {
          createdAt: this.startKey.createdAt,
          sn: this.startKey.sn,
          balance: this.showData[this.showData.length - 1].oldBalance
        };
       this.spinShow = true
        let waterfall = await httpRequest(
          "get",
          `/waterfall/${userId}`,
          params
        );
        this.spinShow = false
        this.showData = this.showData.concat(waterfall.payload);
        this.totalPage = this.showData.length;
        this.startKey = waterfall.startKey;
      } else {
        let params = "";
        this.spinShow = true
        let waterfall = await httpRequest(
          "get",
          `/waterfall/${userId}`,
          params
        );
        this.spinShow = false
        this.showData = waterfall.payload;
        this.totalPage = this.showData.length;
        this.startKey = waterfall.startKey;
        this.showWaterList = _.chunk(this.showData, 20)[0];
      }
      
    },
    async init() {
      this.spinShow = true
      let userId = localStorage.loginId ? localStorage.getItem("loginId") : "";
      let req2 = oneMerchants(userId);
      let [admin] = await this.axios.all([req2]);
      this.spinShow = false
      if (admin && admin.code == 0) {
        this.admin = admin.payload;
      }this.showData2 = []
      this.showData2.push(this.admin)
      
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
  .personalInfo {
    width: 100%;
    margin: 10px auto 20px;
    table {
      width: 100%;
      border-collapse: collapse;
      td {
        border: 1px solid #e9eaec;
        width: 60px;
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
  padding: 0
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


