<template>
  <div class="line">
    <div class="search">
        <p>{{$t('managerList.sn')}}</p>
        <p style="margin: 0 1rem;">
          <Input v-model="suffix" size="small"></Input>
        </p>
        <p>{{$t('managerList.nickname')}}</p>
        <p style="margin: 0 1rem;">
          <Input v-model="displayName" size="small"></Input>
        </p>
        <p>
        <div class="btns">
          <Button type="primary" @click="init" style="margin-right: .3rem;" size="small">{{$t('managerList.search')}}</Button>
          <Button @click="reset" size="small">{{$t('managerList.reset')}}</Button>
        </div>
        </p>
    </div>
    <div class="option">
      <span>{{$t('managerList.h5')}}</span>
      <i-switch v-model="isH5" @on-change="init" style="margin: 0 1rem 0 .3rem;" size="small"></i-switch>
      <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init' size="small">
        <Radio label="0">{{$t('merchantList.formal')}}</Radio>
        <Radio label="1">{{$t('merchantList.test')}}</Radio>
        <Radio label="1">{{$t('merchantList.all')}}</Radio>
      </RadioGroup>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="balance">
          <p>{{balanceConfig(row)}}</p>
          <div style="display:flex;justify-content:center">
            <p style="color:#20a0ff;cursor:pointer;margin-right:1rem" @click="addBalance(row)">{{$t('merchantList.add')}}</p>
            <p style="color:#20a0ff;cursor:pointer" @click="reduceBalance(row)">{{$t('merchantList.reduce')}}</p>
          </div>
        </template>
        <template slot-scope="{row, index}" slot="managerGame">
          <Poptip trigger="hover" transfer placement="right">
            <p style="color:#20a0ff;cursor:pointer">{{`${row.gameList.length}`}}{{$t('managerList.game')}}</p>
            <div slot="content">
              <Table :columns="managerGame(row).columns" :data="managerGame(row).data" border size="small" width="250"></Table>
            </div>
          </Poptip>
        </template>
        <template slot-scope="{row, index}" slot="status">
          <Button size="small" type="text" :style="{borderColor:statusConfig(row, true), color:statusConfig(row, true)}">{{statusConfig1(row, true)}}</Button>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="text" size="small" style="color:#20a0ff" @click="operateCheck(row)">{{$t('managerList.see')}}</Button>
          <Button type="text" size="small" :style="{color:statusConfig(row, false)}" @click="operateConfig(row)">{{statusConfig1(row, false)}}</Button>
        </template>
      </Table>
      
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>{{$t('managerList.loading')}}</div>
    </Spin>
    <Modal v-model="modal" @on-ok="ok" id="plusModal" @on-cancel='cancel'>
      <h2 v-if='plus'>{{$t('managerList.addOperate')}}</h2>
      <h2 v-else>{{$t('managerList.reduceOperate')}}</h2>
      <Row class-name='modalrow'>
        <Col span="4" v-if='plus'>{{$t('managerList.addPoint')}}</Col>
        <Col span="4" v-else>{{$t('managerList.reducePoint')}}</Col>
        <Col span="16">
        <Tooltip :content="tooltip" placement="top">
          <Input v-model="point"></Input>
        </Tooltip>
        </Col>
      </Row>
      <Row class-name='modalrow'>
        <Col span="4">{{$t('managerList.startAccount')}}</Col>
        <Col span="16">
        <p v-if="plus">【{{$t('managerList.manager')}}】 {{parentAcount}}</p>
        <p v-else>【{{$t('managerList.manager')}}】 {{uname}}</p>
        </Col>
      </Row>
      <Row v-if="plus" class-name='modalrow'>
        <Col span="4">{{$t('managerList.addAccount')}}</Col>
        <Col span="16">
        <p>【{{$t('managerList.manager')}}】{{uname}}</p>
        </Col>
      </Row>
      <Row v-else class-name='modalrow'>
        <Col span="4">{{$t('managerList.transferAccount')}}</Col>
        <Col span="16">
        <p>【{{$t('managerList.manager')}}】 {{parentAcount}} </p>
        </Col>
      </Row>
      <Row class-name='textrow'>
        <Col span="4">{{$t('managerList.remark')}}</Col>
        <Col span="16">
        <textarea v-model="note" id="textRow" rows="6" autocomplete="off" maxlength="180"></textarea>
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
      source: "0",
      toUser: "",
      displayName: "",
      suffix: "", //前缀
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 40,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "线路商标识",
          key: "suffix",
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '线路商标识' : 'SN'
            )
          }
        },
        {
          title: "线路商昵称",
          key: "displayName",
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '线路商昵称' : 'Nickname'
            )
          }
        },
        {
          title: "上级线路商",
          key: "parentDisplayName",
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '上级线路商' : 'Superior Manager'
            )
          }
        },
        {
          title: "剩余点数",
          slot: "balance",
          align: 'center',
          sortable: true,
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '剩余点数' : 'Points'
            )
          }
        },
        {
          title: "线路商游戏",
          slot: "managerGame",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户游戏' : 'Games'
            )
          }
        },
        {
          title: "创建时间",
          key: "createdAt",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD"));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '创建时间' : 'Create Time'
            )
          }
        },
        {
          title: "状态",
          slot: "status",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '状态' : 'Status'
            )
          }
        },
        {
          title: "操作",
          slot: "operate",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作' : 'Operation'
            )
          }
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
      console.log(row)
      
      let adminId = localStorage.loginId;
      this.plus = true;
      this.modal = true;
      this.uname = `${row.displayName}（${row.username}）`
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
      this.uname = `${row.displayName}（${row.username}）`
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
    /* createAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD") 
    }, */
  
    //状态
    statusConfig(row,bool) {
      if (bool) { 
        return row.status == 1 ? "green" : "#f5141e"
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
        text = this.$store.state.language == 'zh' ? "停用" : "disable";
        status = 0;
      } else {
        text = this.$store.state.language == 'zh' ? "启用" : "enable";
        status = 1;
      }
        this.$Modal.confirm({
        title: this.$store.state.language == 'zh' ? "提示!" : 'Hint',
        content: this.$store.state.language == 'zh' ? `<p>是否${text}线路商</p>` : `<p>${text} manager</p>`,
        onOk: () => {
          userChangeStatus({
            role: "10",
            status,
            userId: row.userId
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success(`success`);
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
    statusConfig1(row,bool) {
      if (this.$store.state.language == 'zh') {
        if (bool) {
          return row.status == 1 ? "已启用" : "已停用"
        } else {
          return row.status == 1 ? "停用" : "启用"
        }
      } else {
        if (bool) {
          return row.status == 1 ? "enabled" : "disabled"
        } else {
          return row.status == 1 ? "disable" : "enable"
        }
      }
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
        isTest:this.source,
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
      let name = JSON.parse(localStorage.getItem("userInfo"));
      name = `${name.displayName}（${name.username}）`;
      return name;
    },
    
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
