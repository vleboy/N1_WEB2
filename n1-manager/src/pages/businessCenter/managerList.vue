<template>
  <div class="line">
    <div class="search">
        <p>线路商标识</p>
        <p style="margin: 0 1rem;">
          <Input v-model="suffix" placeholder="请输入" size="small"></Input>
        </p>
        <p>线路商昵称</p>
        <p style="margin: 0 1rem;">
          <Input v-model="displayName" placeholder="请输入" size="small"></Input>
        </p>
        <p>
        <div class="btns">
          <Button type="primary" @click="init" style="margin-right: .3rem;" size="small">搜索</Button>
          <Button @click="reset" size="small">重置</Button>
        </div>
        </p>
    </div>
    <div class="option">
      <span>H5接线</span>
      <i-switch v-model="isH5" @on-change="init" style="margin: 0 1rem 0 .3rem;" size="small"></i-switch>
      <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init' size="small">
        <Radio label="正式"></Radio>
        <Radio label="测试"></Radio>
        <Radio label="全部"></Radio>
      </RadioGroup>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="balance">
          <p>{{balanceConfig(row)}}</p>
          <div style="display:flex;justify-content:center">
            <p style="color:#20a0ff;cursor:pointer;margin-right:1rem" @click="addBalance(row)">加点</p>
            <p style="color:#20a0ff;cursor:pointer" @click="reduceBalance(row)">减点</p>
          </div>
        </template>
        <template slot-scope="{row, index}" slot="managerGame">
          <Poptip trigger="hover" transfer placement="right">
            <p style="color:#20a0ff;cursor:pointer">{{`${row.gameList.length}款游戏`}}</p>
            <div slot="content">
              <Table :columns="managerGame(row).columns" :data="managerGame(row).data" border size="small" width="250"></Table>
            </div>
          </Poptip>
        </template>
         <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="status">
          <span :style="{color:statusConfig(row, true)}">{{row.status == 1 ? "已启用" : "已停用"}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="text" size="small" style="color:#20a0ff" @click="operateCheck(row)">查看</Button>
          <Button type="text" size="small" :style="{color:statusConfig(row, false)}" @click="operateConfig(row)">{{row.status == 1 ? "停用" : "启用"}}</Button>
        </template>
      </Table>
      
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <Modal v-model="modal" @on-ok="ok" id="plusModal" @on-cancel='cancel'>
      <h2 v-if='plus'>加点操作</h2>
      <h2 v-else>减点操作</h2>
      <Row class-name='modalrow'>
        <Col span="4" v-if='plus'>增加点数</Col>
        <Col span="4" v-else>减少点数</Col>
        <Col span="16">
        <Tooltip :content="tooltip" placement="top">
          <Input v-model="point" placeholder="请输入点数"></Input>
        </Tooltip>
        </Col>
      </Row>
      <Row class-name='modalrow'>
        <Col span="4">起始账户</Col>
        <Col span="16">
        <p v-if="plus">【线路商】 {{parentAcount}} </p>
        <p v-else>【线路商】 {{uname}}</p>
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
        <p>【线路商】 {{parentAcount}} </p>
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
import { userChangeStatus, getBill } from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    return {
      isH5:true,
      uname: "", //modal增加账户
      point: "", //点数
      note: "", //备注
      plus: null, //加点
      modal: false, //加点弹窗
      select: "", //加点select
      fromUserId: "", //id
      toRole: " ",
      source: "正式",
      toUser: "",
      displayName: "",
      suffix: "", //前缀
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 40
        },
        {
          title: "线路商标识",
          key: "suffix",
          align: 'center',
          sortable: true
        },
        {
          title: "线路商昵称",
          key: "displayName",
          align: 'center',
          sortable: true
        },
        {
          title: "上级线路商",
          key: "parentDisplayName",
          align: 'center',
          sortable: true
        },
        {
          title: "剩余点数",
          slot: "balance",
          align: 'center',
          sortable: true
        },
        {
          title: "线路商游戏",
          slot: "managerGame",
          align: 'center'
        },
        {
          title: "创建时间",
          slot: "createdAt",
          sortable: true,
          align: 'center'
        },
        {
          title: "状态",
          slot: "status",
          align: 'center',
          sortable: true
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
    /* 剩余点数 */
    //点数
    balanceConfig(row) {
      return thousandFormatter(row.balance.toFixed(2))
    },
    //加点
    addBalance(row) {
      let adminId = localStorage.loginId;
      this.plus = true;
      this.modal = true;
      this.uname = row.uname;
      this.fromUserId = adminId;
      this.toRole = "10";
      this.toUser = row.username;
      getBill(adminId).then(res => {
        this.tooltip = "起始账户余额为" + res.payload.balance;
      });
    },
    //减点
    reduceBalance(row) {
      let userName = JSON.parse(localStorage.userInfo).username;
      this.plus = false;
      this.modal = true;
      this.uname = row.uname;
      this.fromUserId = row.userId;
      this.toRole = "10";
      this.toUser = userName;
      this.tooltip = "起始账户余额为" + row.balance;
    },
    //商户游戏
    managerGame(row) {
      
      let columns = [
        {
          title: "线路商游戏",
          key: "name",
          align: "center"
        },
        {
          title: "线路商占成",
          key: "rate",
          align: "center"
        }
      ];
      let data = [];
      let gameList = row.gameList;
      let len = gameList.length;
      for (let item of gameList) {
        let obj = {};
        obj.rate = item.rate + "%";
        obj.name = item.name;
        data.push(obj);
      }
      
      return {columns, data}
          
    },
    //创建时间
    createAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD") 
    },
  
    //状态
    statusConfig(row,bool) {
      if (bool) { 
        return row.status == 1 ? "#20a0ff" : "#f5141e"
      } else {
        return row.status == 1 ? "#f5141e" : "#20a0ff"
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
    //启用禁用
    operateConfig(row) {
      let text = "";
      let status = null;
      if (row.status == 1) {
        text = "停用";
        status = 0;
      } else {
        text = "启用";
        status = 1;
      }
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
              this.$store.dispatch("getManagerList", {
                query: {},
                sortkey: "createdAt",
                sort: "desc"
              });
            }
          });
        }
      });
    },

















    ok() {
      this.$store
        .dispatch("transferBill", {
          fromUserId: this.fromUserId,
          toRole: this.toRole,
          toUser: this.toUser,
          amount: this.point,
          remark: this.note
        })
        .then(() => {
          this.note = "";
          this.point = "";
        });
    },
    cancel() {
      this.note = "";
      this.point = "";
    },
    // changepage(index) {
    //   var _start = (index - 1) * 50;
    //   var _end = index * 50;
    //   this.showData = this.waterfall.slice(_start, _end);
    // },
    // handlePage() {
    //   // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
    //   if (this.total < 50) {
    //     this.showData = this.waterfall;
    //   } else {
    //     this.showData = this.waterfall.slice(0, 50);
    //   }
    // },
    reset() {
      this.suffix = "";
      this.displayName = "";
      this.init();
    },
    init() {
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
      this.$store.dispatch("getManagerList", params);
    },
  },
  computed: {
    showData() {
      return this.$store.state.merchants.managerList;
    },
    spinShow() {
      return this.$store.state.merchants.spinShow;
    },
    parentAcount() {
      let name = JSON.parse(localStorage.getItem("userInfo")).username;
      name = name.split("_")[1];
      return name;
    },
    isTest() {
      let source = this.source;
      if (source == "正式") {
        return 0;
      } else if (source == "测试") {
        return 1;
      } else {
        return 2;
      }
    }
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less" scoped>
.line {
  min-height: 89vh;
  .search {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
  }
  .option {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  } 
  .table {
    .page {
      text-align: right;
    }
  }
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
/deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  } 
  
</style>
