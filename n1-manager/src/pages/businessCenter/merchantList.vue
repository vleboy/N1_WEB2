<template>
  <div class="business">
    <div class="search">
      <p>商户标识</p>
      <p style="margin:0 1rem">
      <Input v-model="sn" placeholder="请输入" size="small"></Input>
      </p>
      <p>商户ID</p>
      <p style="margin:0 1rem">
      <Input v-model="displayId" placeholder="请输入" size="small"></Input>
      </p>
      <p>
      </p>
      <p>商户昵称</p>
      <p style="margin:0 1rem">
        <Input v-model="displayName" placeholder="请输入" size="small"></Input>
      </p>
      <p>上级标识</p>
      <p style="margin:0 1rem">
        <Input v-model="supSuffix" placeholder="请输入" size="small"></Input>
      </p>
      <div class="btns">
        <Button type="primary" @click="init" size="small" style="margin-right:.3rem">搜索</Button>
        <Button@click="reset" size="small">重置</Button>
      </div>
    </div>
    
    <div class="option">
      <span>H5接线</span>
      <i-switch v-model="isH5" @on-change="init" size="small" style="margin:0 1rem 0 .3rem"></i-switch>
      <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init' size="small">
        <Radio label="正式"></Radio>
        <Radio label="测试"></Radio>
        <Radio label="全部"></Radio>
      </RadioGroup>
    </div>

    <div class="table">
      <Table :columns="columns1" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="parentDisplayName">
          <span>{{`${row.parentDisplayName}(${row.parentSuffix})`}}</span>
        </template>
        <template slot-scope="{row, index}" slot="playerCount">
          <Tooltip content="前往玩家列表" transfer>
            <span style="color:#20a0ff;cursor:pointer" @click="playerCount(row)">{{row.playerCount}}</span>
          </Tooltip> 
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <p>{{balanceConfig(row)}}</p>
          <div style="display:flex;justify-content:center">
            <p style="color:#20a0ff;cursor:pointer;margin-right:1rem" @click="addBalance(row)">加点</p>
            <p style="color:#20a0ff;cursor:pointer" @click="reduceBalance(row)">减点</p>
          </div>
        </template>
        <template slot-scope="{row, index}" slot="merchantGame">
          <Poptip trigger="hover" transfer placement="right">
            <p style="color:#20a0ff;cursor:pointer">{{`${row.gameList.length}款游戏`}}</p>
            <div slot="content">
              <Table :columns="merchantGame(row).columns" :data="merchantGame(row).data" border size="small" width="250"></Table>
            </div>
          </Poptip>
        </template>
         <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
          <span>{{joinTimeConfig(row)}}</span>
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
        <p v-else>【商户】 {{uname}}</p>
        </Col>
      </Row>
      <Row v-if="plus" class-name='modalrow'>
        <Col span="4">增加账户</Col>
        <Col span="16">
        <p>【商户】{{uname}}</p>
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
import { thousandFormatter } from "@/config/format";
import { userChangeStatus, getBill } from "@/service/index";
import { spawn } from 'child_process';
export default {
  data() {
    return {
      supSuffix: '',
      isH5:true,
      sn: "", //标识
      username: "", //
      displayName: "",
      displayId: "",
      uname: "", //modal增加账户
      point: "", //点数
      note: "", //备注
      plus: null, //加点
      modal: false, //加点弹窗
      fromUserId: "", //id
      source: "正式",
      toRole: " ",
      toUser: "",
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 40,
          align: 'center'
        },
        {
          title: "商户ID",
          key: "displayId",
          sortable: true,
          align: 'center'
        },
        {
          title: "商户标识",
          key: "sn",
          sortable: true,
          align: 'center'
        },
        {
          title: "商户昵称",
          key: "displayName",
          sortable: true,
          align: 'center'
        },
        {
          title: "上级线路商",
          slot: "parentDisplayName",
          sortable: true,
          align: 'center',
          
        },
        {
          title:'玩家数量',
          slot:'playerCount',
          align: 'center'
        },
        {
          title: "剩余点数",
          slot: "balance",
          sortable: true,
          align: 'center'
        },
        {
          title: "商户游戏",
          slot: "merchantGame",
          align: 'center'
        },
        {
          title: "创建时间",
          slot: "createdAt",
          sortable: true,
          align: 'center'
        },
        {
          title: "最后登录时间",
          slot: "joinTime",
          sortable: true,
          align: 'center'
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
    //玩家数量
    playerCount(row) {
      this.$router.push({name: "playList",query:{sn:row.sn}})
      localStorage.setItem('playList','playList')        
    },
    /* 剩余点数 */
    //点数
    balanceConfig(row) {
      return thousandFormatter(row.balance.toFixed(2))
    },
    //加点
    addBalance(row) {
      let adminId = localStorage.loginId
      this.plus = true;
      this.modal = true;
      this.uname = row.uname;
      this.fromUserId = adminId;
      this.toUser = row.username;
      this.toRole = "100";
      getBill(adminId).then(res => {
        this.tooltip = "起始账户余额为" + res.payload.balance;
      })
    },
    //减点
    reduceBalance(row) {
      let userName = JSON.parse(localStorage.userInfo).username;
      this.plus = false;
      this.modal = true;
      this.uname = row.uname;
      this.toRole = "10";
      this.toUser = userName;
      this.fromUserId = row.userId;
      this.tooltip = "起始账户余额为" + row.balance;
    },
    //商户游戏
    merchantGame(row) {
      
      let columns = [
        {
          title: "商户游戏",
          key: "name",
          align: "center"
        },
        {
          title: "商户占成",
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
    //最近登录时间
    joinTimeConfig(row) {
      return dayjs(row.loginAt).format("YYYY-MM-DD")
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
      let parent = row.parent;
      let username = row.username;
      let parentDisplayName = row.parentDisplayName;
      this.$router.push({
        path: "/merchantDetail",
        query: {
          userId,
          displayName,
          username,
          parent,
          parentDisplayName
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
          content: `<p>是否${text}商户</p>`,
          onOk: () => {
            userChangeStatus({
              role: "100",
              status,
              userId: row.userId
            }).then(res => {
              if (res.code == 0) {
                this.$Message.success(`${text}成功`);
                this.$store.dispatch("getMerchantsList", {
                  query: {},
                  sortkey: "createdAt",
                  sort: "desc"
                });
              }
            });
          }
        })
    },

























    ok() {
      this.$store
        .dispatch("transferBussnessBill", {
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
    reset() {
      this.sn = "";
      this.displayName = "";
      this.msn = "";
      this.init();
    },
    init() {
       let query = {
        sn: this.sn,
        uname: this.username,
        displayName: this.displayName,
        displayId: this.displayId
      };
      if (!query.sn) {
        delete query.sn;
      }
      if (!query.displayName) {
        delete query.displayName;
      }
      if (!query.uname) {
        delete query.uname;
      }
      if (!query.displayId) {
        delete query.displayId;
      }
      let params = {
        query,
        isH5:this.isH5,
        isTest: +this.source,
        sortkey: "createdAt",
        sort: "desc"
      };
      this.$store.dispatch("getMerchantsList", params);
    },
  },
  computed: {
    showData() {
      return this.$store.state.merchants.merchantsList;
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
.business {
  min-height: 89vh;
  .search {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
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
}
.row {
  line-height: 32px;
  text-align: center;
  padding-bottom: 16px;
}
.table {
  .page {
    text-align: right;
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
.ivu-modal-footer {
  text-align: center;
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
