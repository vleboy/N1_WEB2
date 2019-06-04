<template>
  <div class="line">
    <div class="search">
      <Row class="row" type="flex">
        <span style="margin-right:2rem">线路商标识</span>
        <Col span="4">
        <Input v-model="suffix" placeholder="请输入" size="small"></Input>
        </Col>
        <Col span="2">线路商昵称</Col>
        <Col span="4" style="margin-right:2rem">
        <Input v-model="displayName" placeholder="请输入" size="small"></Input>
        </Col>
        <div class="btns">
          <Button type="primary" @click="init" style="margin-right:.3rem" size="small">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
      </Row>
    </div>
    <div class="option">
      <p class="create">
        <Button type="primary" @click="createLine" v-if="permission.includes('创建线路商')" size="small">创建线路商</Button>
         <span :style="{paddingLeft:'10px',marginRight:'.3rem'}">H5接线</span>
        <i-switch v-model="isH5" @on-change="init" size="small"></i-switch>
        <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init' size="small">
          <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
          <Radio label="1">测试</Radio>
          <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
        </RadioGroup>
      </p>
    </div>
    <div class="table">
      

      <Table :columns="columns1" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="merchantCount">
          <Tooltip content="前往商户列表" placement="top">
            <span style="color:#20a0ff;cursor:pointer" @click="merchantCountConfig(row)">{{row.merchantCount}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceCount(row)}}</span>
          <p v-if="permission.includes('线路商加减点')">
            <span
              style="color:#20a0ff;cursor:pointer;margin-right:.3rem"
              @click="addBalance(row)"
            >加点</span>
            <span style="color:#20a0ff;cursor:pointer;" @click="reduceBalance(row)">减点</span>
          </p>
        </template>
        <template slot-scope="{row, index}" slot="managerGame">
          <Poptip trigger="hover" placement="bottom" transfer >
            <span style="color:#20a0ff;cursor:pointer;">{{`${row.gameList.length}款游戏`}}</span>
            <div slot="content">
              <Table
                :columns="managerGameConfig(row).columns"
                :data="managerGameConfig(row).data"
                size="small"
              ></Table>
            </div>
          </Poptip>
        </template>
        <template slot-scope="{row, index}" slot="createdAt">
         <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="status">
          <Button type="text" size="small" :style="{borderColor:statusConfig(row, true), color: statusConfig(row, true)}">{{row.status == 1 ? "已启用" : "未启用"}}</Button>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <span
            style="color:#20a0ff;cursor:pointer;margin-right:.3rem"
            @click="operateCheck(row)"
          >查看</span>
          <span
            :style="{color:statusConfig(row, false),cursor:'pointer'}"
            @click="operateStatus(row)"
          >{{row.status == 1 ? "停用" : "启用"}}</span>
          <p style="color:#20a0ff;cursor:pointer;" @click="opertaeGo(row)">前往线路商系统</p>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
    <Modal v-model="modal" @on-ok="ok" id="plusModal" @on-cancel='cancel'>
      <h2 v-if='plus'>加点操作</h2>
      <h2 v-else>减点操作</h2>
      <Row class-name='modalrow'>
        <Col span="4" v-if='plus'>增加点数</Col>
        <Col span="4" v-else>减少点数</Col>
        <Col span="16">
        <Tooltip :content="tooltip" @on-popper-show="focus" placement="top" :disabled='disabled'>
          <Input v-model="point" placeholder="请输入点数" :disabled='disabled'></Input>
        </Tooltip>
        </Col>
      </Row>
      <Row class-name='modalrow'>
        <Col span="4">起始账户</Col>
        <Col span="16">
        <Select v-model="select" v-if='plus' @on-change='changeOption'>
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <p v-else>【线路商】{{uname}}</p>
        </Col>
      </Row>
      <Row v-if="plus" class-name='modalrow'>
        <Col span="4">增加账户</Col>
        <Col span="16">
        <p>【线路商】{{uname}}</p>
        </Col>
      </Row>
      <Row v-else class-name='modalrow'>
        <Col span="4">转入账户</Col>
        <Col span="16">
        <Select v-model="select" @on-change='changeOption'>
          <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        </Col>
      </Row>
      <Row class-name='textrow'>
        <Col span="4">备注</Col>
        <Col span="16">
        <textarea v-model="note" id="textRow" placeholder="注明备注,如没有可不填" rows="6" autocomplete="off" maxlength="180"></textarea>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import { userChangeStatus, getManagers } from "@/service/index";
export default {
  data() {
    return {
      isH5:true,
      spinShow: false,
      uname: "", //modal增加账户
      point: "", //点数
      note: "", //备注
      options: [], //select
      plus: null, //加点
      modal: false, //加点弹窗
      select: "", //加点select
      fromUserId: "", //id
      toRole: " ",
      source: "1",
      toUser: "",
      displayName: "",
      stopManager:false,
      goManager:false,
      suffix: "", //前缀
      disabled: true, //加点禁用
      showData: [],
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 40,
          align: 'center'
        },
        {
          title: "线路商标识",
          key: "suffix",
          sortable: true,
          align: 'center'
        },
        {
          title: "线路商昵称",
          key: "displayName",
          sortable: true,
          align: 'center',
        },
        {
          title: "上级线路商",
          key: "parentDisplayName",
          sortable: true,
          align: 'center',
        },
        {
          title:'商户数量',
          slot:'merchantCount',
          align: 'center'
        },
        {
          title: "剩余点数",
          slot: "balance",
          sortable: true,
          align: 'center'
        },
        {
          title: "线路商游戏",
          slot: "managerGame",
          align: 'center'
        },
        {
          title: "创建时间",
          slot: "createdAt",
          align: 'center',
          sortable: true
        },
        {
          title: "状态",
          slot: "status",
          sortable: true,
          align: 'center'
        },
        {
          title: "操作",
          slot: "operate",
          align: 'center'
        }
      ]
    };
  },
  methods: {
    //商户数量
    merchantCountConfig(row) {
      this.$router.push({name: "merchantList",query:{suffix:row.suffix}})
      localStorage.setItem('merchantList','merchantList')
    },
    /* 点数 */
    // 剩余点数
    balanceCount(row) {
      console.log(row);
      
      return thousandFormatter(row.balance.toFixed(2));
    },
    //加点
    addBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.uname;
      let adminId = admininfo.userId;
      let userName = admininfo.username;

      this.plus = true;
      this.modal = true;
      this.disabled = true;
      this.uname = row.uname;
      let option = [
        {
          value: adminId,
          label: "【管理员】" + admin
        }
      ];
      if (row.parent != "01") {
        let another = {
          value: params.row.parent,
          label: "【线路商】" + row.parentDisplayName
        };
        option.push(another);
      }
      this.options = option;
      this.toRole = "10";
      this.toUser = row.username;
    },
    //减点
    reduceBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.uname;
      let adminId = admininfo.userId;
      let userName = admininfo.username;

      this.plus = false;
      this.modal = true;
      this.disabled = true;
      this.uname = row.uname;
      let option = [
        {
          value: adminId,
          label: "【管理员】" + admin,
          role: "1",
          userName: userName
        }
      ];
      this.$store.commit('updateBill',{params:row.balance})
      if (row.parent != "01") {
        let another = {
          value: row.parent,
          label:
            "【线路商】" + row.parentDisplayName,
          role: row.parentRole,
          userName: row.parentName
        };
        option.push(another);
      }
      this.options = option;
      this.fromUserId = row.userId;
    },
    //线路商户游戏
    managerGameConfig(row) {
      let columns = [
        {
          title: "游戏",
          key: "name",
          align: "center"
        },
        {
          title: "商户占成",
          align: "center",
          key: "rate"
        }
      ];
      let data = [];
      for (let item of row.gameList) {
        let obj = {};
        obj.rate = item.rate + "%";
        obj.name = item.name;
        data.push(obj);
      }
      return { columns, data };
    },
    //创建时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD")
    },
    //状态
    statusConfig(row, bool) {
      if (bool) {
        return row.status == 1 ? "green" : "#f5141e";
      } else {
        return row.status == 1 ? "#f5141e" : "#20a0ff";
      }
    },

    /* 操作 */
    //查看
    operateCheck(row) {
      let userId = row.userId;
      let displayName = row.displayName;
      let username = row.username;
      let parent = row.parent;
      this.$router.push({
        path: "/dealerDetail",
        query: {
          userId,
          displayName,
          username,
          parent
        }
      });
    },
    //启用停用
    operateStatus(row) {
      let text = row.status == 1 ? "停用" : "启用";
      let status = row.status == 1 ? 0 : 1
      this.$Modal.confirm({
        title: "提示!",
        content: `<p>是否${text}线路商</p>`,
        onOk: () => {
          userChangeStatus({
            role: "10",
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
    //前往商户系统
    opertaeGo(row) {
      let url=process.env.NODE_ENV == 'production'?'http://xl.na12345.com/#/login':'http://dev-manager.na12345.com/#/login';
      //http://localhost:8080   http://dev-merchant.na12345.com/#/login
      let uname=row.uname;
      let suffix=row.suffix;
      url=url+'?uname='+uname+'&suffix='+suffix;
      window.open(url)
    },
























    async ok() {
      if (this.plus == true) {
        this.fromUserId = this.select;
      } else {
        let selectId = this.select;
        let option = this.options;
        for (let key in option) {
          if (option[key].value == selectId) {
            this.toRole = option[key].role;
            this.toUser = option[key].userName;
          }
        }
      }
      this.$store.commit('changeLoading',{params:true})
      await this.$store.dispatch("transferBill", {
          fromUserId: this.fromUserId,
          toRole: this.toRole,
          toUser: this.toUser,
          amount: this.point||0,
          remark: this.note
        })
        setTimeout(()=>{
          this.init()
        },200)
        this.select = "";
        this.note = "";
        this.point = "";
      
    },
    cancel() {
      this.select = "";
      this.note = "";
      this.point = "";
    },
    
    async changeOption(id) {
      if(this.plus){
        if (id) {
          await this.$store.dispatch("otherBill", id);
           this.disabled = false;
        }
      }else{
          this.disabled = false;  
      }
    },
    focus() {
      this.tooltip = "起始账户余额为" + this.$store.state.merchants.bill;
    },
    createLine() {
      this.$router.push({ name: "addManager" });
    },
    reset() {
      this.suffix = "";
      this.displayName = "";
      if (this.permission.includes("正式数据")) {
        this.source = '0';
      }
      this.init();
    },
    init() {
      this.spinShow = true
       let query = {
        suffix: this.suffix,
        displayName: this.displayName
      };
      if (!query.suffix) {
        delete query.suffix;
      }
      if (!query.displayName) {
        delete query.displayName;
      }
      let params = {
        query,
        isH5:this.isH5,
        isTest: +this.source,
        sortkey: "createdAt",
        sort: "desc"
      };
      getManagers(params).then(res => {
        this.showData = res.payload
        this.spinShow = false
      })
    },
  },
  computed: {
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    },
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = '0';
    }
    if (this.permission.includes("停启用线路商")) {
       this.stopManager = true;
    }
    if (this.permission.includes("前往线路商系统")) {
      this.goManager = true;
    }
    this.init();
  },
  watch: {
    $route(to, from) {
      if (from.name == "addManager") {
        if (this.permission.includes("正式数据")) {
          this.source = '0';
        }
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.line {
  min-height: 89vh;
  .row {
    line-height: 32px;
    text-align: center;
    padding-bottom: 16px;
}
  .option {
    .create {
      padding-bottom: 16px;
    }
  }
  .table {
    .page {
      text-align: right;
    }
  }
}
.radioGroup {
  padding-left: 20px;
}
#textRow {
  display: block;
  resize: vertical;
  padding: 5px 7px;
  line-height: 1.5;
  width: 100%;
  color: #1f2d3d;
  border: 1px solid #bfcbd9;
  border-radius: 4px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
#plusModal {
  h2 {
    margin-bottom: 22px;
  }
}
.modalrow {
  height: 36px;
  line-height: 36px;
  margin-bottom: 22px;
}
.ivu-modal-body {
  padding: 30px 20px;
  font-size: 14px;
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
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper {
    border: 1px solid #ccc;
    color: #000;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #000;
    color: #fff;
  }
  
</style>
