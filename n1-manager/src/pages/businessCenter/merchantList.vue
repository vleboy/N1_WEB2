<template>
  <div class="business">
    <div class="search">
      <p>{{$t('merchantList.sn')}}</p>
      <p style="margin:0 1rem">
      <Input v-model="sn" size="small"></Input>
      </p>
      <p>{{$t('merchantList.id')}}</p>
      <p style="margin:0 1rem">
      <Input v-model="displayId" size="small"></Input>
      </p>
      <p>
      </p>
      <p>{{$t('merchantList.nickname')}}</p>
      <p style="margin:0 1rem">
        <Input v-model="displayName" size="small"></Input>
      </p>
      <p>{{$t('merchantList.upSn')}}</p>
      <p style="margin:0 1rem">
        <Input v-model="supSuffix" size="small"></Input>
      </p>
      <div class="btns">
        <Button type="primary" @click="init" size="small" style="margin-right:.3rem">{{$t('merchantList.search')}}</Button>
        <Button@click="reset" size="small">{{$t('merchantList.reset')}}</Button>
      </div>
    </div>
    
    <div class="option">
      <span>{{$t('merchantList.h5')}}</span>
      <i-switch v-model="isH5" @on-change="init" size="small" style="margin:0 1rem 0 .3rem"></i-switch>
      <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init' size="small">
        <Radio label="0">{{$t('merchantList.formal')}}</Radio>
        <Radio label="1">{{$t('merchantList.test')}}</Radio>
        <Radio label="2">{{$t('merchantList.all')}}</Radio>
      </RadioGroup>
    </div>

    <div class="table">
      <Table :columns="columns1" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="parentDisplayName">
          <span>{{`${row.parentDisplayName}(${row.parentSuffix})`}}</span>
        </template>
        <template slot-scope="{row, index}" slot="playerCount">
          <Tooltip :content="$t('merchantList.toPlayer')" transfer>
            <span style="color:#20a0ff;cursor:pointer" @click="playerCount(row)">{{row.playerCount}}</span>
          </Tooltip> 
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <p>{{balanceConfig(row)}}</p>
          <div style="display:flex;justify-content:center">
            <p style="color:#20a0ff;cursor:pointer;margin-right:1rem" @click="addBalance(row)">{{$t('merchantList.add')}}</p>
            <p style="color:#20a0ff;cursor:pointer" @click="reduceBalance(row)">{{$t('merchantList.reduce')}}</p>
          </div>
        </template>
        <template slot-scope="{row, index}" slot="merchantGame">
          <Poptip trigger="hover" transfer placement="right">
            <p style="color:#20a0ff;cursor:pointer">{{`${row.gameList.length}`}}{{$t('merchantList.game')}}</p>
            <div slot="content">
              <Table :columns="merchantGame(row).columns" :data="merchantGame(row).data" border size="small" width="250"></Table>
            </div>
          </Poptip>
        </template>
         <!-- <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
          <span>{{joinTimeConfig(row)}}</span>
        </template> -->
        <template slot-scope="{row, index}" slot="status">
          <Button type="text" size="small" :style="{borderColor: statusConfig(row, true), color:statusConfig(row, true)}">{{statusConfig1(row, true)}}</Button>
        </template>
        <template slot-scope="{row, index}" slot="operate">
          <Button type="text" size="small" style="color:#20a0ff" @click="operateCheck(row)">{{$t('merchantList.see')}}</Button>
          <Button type="text" size="small" :style="{color:statusConfig(row, false)}" @click="operateConfig(row)">{{statusConfig1(row, false)}}</Button>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>{{$t('merchantList.loading')}}</div>
    </Spin>
    <Modal v-model="modal" @on-ok="ok" id="plusModal" @on-cancel='cancel'>
      <h2 v-if='plus'>{{$t('merchantList.addOperate')}}</h2>
      <h2 v-else>{{$t('merchantList.reduceOperate')}}</h2>
      <Row class-name='modalrow'>
        <Col span="4" v-if='plus'>{{$t('merchantList.addPoint')}}</Col>
        <Col span="4" v-else>{{$t('merchantList.reducePoint')}}</Col>
        <Col span="16">
        <Tooltip :content="tooltip" placement="top">
          <Input v-model="point"></Input>
        </Tooltip>
        </Col>
      </Row>
      <Row class-name='modalrow'>
        <Col span="4">{{$t('merchantList.startAccount')}}</Col>
        <Col span="16">
        <p v-if="plus">【{{$t('merchantList.manager')}}】 {{parentAcount}} </p>
        <p v-else>【{{$t('merchantList.merchant')}}】 {{uname}}</p>
        </Col>
      </Row>
      <Row v-if="plus" class-name='modalrow'>
        <Col span="4">{{$t('merchantList.addAccount')}}</Col>
        <Col span="16">
        <p>【{{$t('merchantList.merchant')}}】{{uname}}</p>
        </Col>
      </Row>
      <Row v-else class-name='modalrow'>
        <Col span="4">{{$t('merchantList.transferAccount')}}</Col>
        <Col span="16">
        <p>【{{$t('merchantList.manager')}}】 {{parentAcount}} </p>
        </Col>
      </Row>
      <Row class-name='textrow'>
        <Col span="4">{{$t('merchantList.remark')}}</Col>
        <Col span="16">
        <textarea v-model="note" id="textRow" rows="6" autocomplete="off" maxlength="180"></textarea>
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
      source: "0",
      toRole: " ",
      toUser: "",
      tooltip: '',
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 40,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '序号' : 'NO.'
            )
          }
        },
        {
          title: "商户ID",
          key: "displayId",
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户ID' : 'ID.'
            )
          }
        },
        {
          title: "商户标识",
          key: "sn",
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户标识' : 'SN'
            )
          }
        },
        {
          title: "商户昵称",
          key: "displayName",
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户昵称' : 'Nickname'
            )
          }
        },
        {
          title: "上级线路商",
          slot: "parentDisplayName",
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '上级线路商' : 'UP Manager'
            )
          }
          
        },
        {
          title:'玩家数量',
          slot:'playerCount',
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '玩家数量' : 'Player Count'
            )
          }
        },
        {
          title: "剩余点数",
          slot: "balance",
          sortable: true,
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '剩余点数' : 'Surplus Points'
            )
          }
        },
        {
          title: "商户游戏",
          slot: "merchantGame",
          align: 'center',
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '商户游戏' : 'Merchant Games'
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
          title: "最后登录时间",
          key: "joinTime",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h("span", dayjs(params.row.joinTime).format("YYYY-MM-DD"));
          },
          renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '最后登录时间' : 'Latest Login'
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
      this.uname = `${row.displayName}（${row.username}）`
      this.fromUserId = adminId;
      this.toUser = row.username;
      this.toRole = "100";
      getBill(adminId).then(res => {
        if (this.$store.state.language == 'zh') {
          this.tooltip = "起始账户余额为" + res.payload.balance;
        } else {
          this.tooltip = "Start Account Balance :" + res.payload.balance;
        }
      })
    },
    //减点
    reduceBalance(row) {
      let userName = JSON.parse(localStorage.userInfo).username;
      this.plus = false;
      this.modal = true;
      this.uname = `${row.displayName}（${row.username}）`
      this.toRole = "10";
      this.toUser = userName;
      this.fromUserId = row.userId;
      this.tooltip = "Start Account Balance :" + row.balance;
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
    /* createAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD") 
    }, */
    //最近登录时间
    /* joinTimeConfig(row) {
      return dayjs(row.loginAt).format("YYYY-MM-DD")
    }, */
    //状态
    statusConfig(row,bool) {
      if (bool) { 
        return row.status == 1 ? "green" : "#f5141e"
      } else {
        return row.status == 1 ? "#f5141e" : "#20a0ff"
      }
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
          return row.status == 1 ? "enable" : "disable"
        }
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
      console.log(233);
      
      let text = "";
      let status = null;
      if (row.status == 1) {
        text = this.$store.state.language == 'zh' ? "停用" : 'disable';
        status = 0;
      } else {
        text = this.$store.state.language == 'zh' ? "停用" : 'enable';
        status = 1;
      }
        this.$Modal.confirm({
          title: this.$store.state.language == 'zh' ? "提示" : 'Hint',
          content: this.$store.state.language == 'zh' ? `<p>是否${text}商户</p>` : `<p>${text} Merchant</p>` ,
          onOk: () => {
            userChangeStatus({
              role: "100",
              status,
              userId: row.userId
            }).then(res => {
              if (res.code == 0) {
                this.$Message.success(this.$store.state.language == 'zh' ?`${text}成功` : 'success');
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
        isTest: this.source,
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
