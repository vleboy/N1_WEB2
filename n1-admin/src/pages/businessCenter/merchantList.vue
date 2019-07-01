<template>
  <div class="business">
    <div class="search">
      <Row class="row" type="flex" justify="start">
        <span style="margin:0 1rem 0 0">商户ID</span>
        <Col span="3">
          <Input v-model="displayId" placeholder="请输入" size="small"></Input>
        </Col>
        <span style="margin:0 1rem">商户标识</span>
        <Col span="3">
          <Input v-model="sn" placeholder="请输入" size="small"></Input>
        </Col>
        <span style="margin:0 1rem">商户昵称</span>
        <Col span="3">
          <Input v-model="displayName" placeholder="请输入" size="small"></Input>
        </Col>
        <span style="margin:0 1rem">上级标识</span>
        <Col span="3">
          <Input v-model="supSuffix" placeholder="请输入" size="small"></Input>
        </Col>
        <Col span="3">
          <div class="btns">
            <Button type="primary" @click="init" style="margin:0 .3rem 0 0" size="small">搜索</Button>
            <Button @click="reset" size="small">重置</Button>
          </div>
        </Col>
      </Row>
    </div>
    <div class="option">
      <p class="create">
        <Button type="primary" @click="addMerchant" v-if="permission.includes('创建商户')" size="small">创建商户</Button>
        <span :style="{paddingLeft:'10px',marginRight:'.2rem'}">H5接线</span>
        <i-switch v-model="isH5" @on-change="init" size="small"></i-switch>
        <RadioGroup v-model="source" class="radioGroup" type="button" @on-change="init" size="small">
          <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
          <Radio label="1">测试</Radio>
          <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
        </RadioGroup>
      </p>
    </div>

    <div class="table">
      <Table :columns="columns1" :data="showData" size="small">
        <template
          slot-scope="{row, index}"
          slot="parentDisplayName"
        >{{`${row.parentDisplayName}(${row.parentSuffix})`}}</template>
        <template slot-scope="{row, index}" slot="playerCount">
          <Tooltip content="前往玩家列表" placement="top">
            <span
              style="color:#20a0ff;cursor:pointer;"
              @click="playerCountConfig(row)"
            >{{row.playerCount}}</span>
          </Tooltip>
        </template>
        <template slot-scope="{row, index}" slot="balance">
          <span>{{balanceCount(row)}}</span>
          <p v-if="permission.includes('商户加减点')">
            <span
              style="color:#20a0ff;cursor:pointer;margin-right:.3rem"
              @click="addBalance(row)"
            >加点</span>
            <span style="color:#20a0ff;cursor:pointer;" @click="reduceBalance(row)">减点</span>
          </p>
        </template>
        <template slot-scope="{row, index}" slot="merchantGame">
          <Poptip trigger="hover" placement="bottom" transfer>
            <span style="color:#20a0ff;cursor:pointer;">{{`${row.gameList.length}款游戏`}}</span>
            <div slot="content">
              <Table
                :columns="merchantGameConfig(row).columns"
                :data="merchantGameConfig(row).data"
                size="small"
              ></Table>
            </div>
          </Poptip>
        </template>
        <!-- <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createdAtConfig(row)}}</span>
        </template> -->
        <!-- <template slot-scope="{row, index}" slot="loginAt">
          <span>{{loginAtConfig(row)}}</span>
        </template> -->
        <template slot-scope="{row, index}" slot="status">
          <Button type="text" size="small" :style="{borderColor: statusConfig(row, true),color:statusConfig(row, true)}">{{row.status == 1 ? "已启用" : "未启用"}}</Button>
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
          <p style="color:#20a0ff;cursor:pointer;" @click="opertaeGo(row)">前往商户系统</p>
        </template>
      </Table>
    </div>

    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
    <!-- 加点减点 -->
    <Modal v-model="modal" @on-ok="ok" id="plusModal" @on-cancel="cancel">
      <h2 v-if="plus">加点操作</h2>
      <h2 v-else>减点操作</h2>
      <Row class-name="modalrow">
        <Col span="4" v-if="plus">增加点数</Col>
        <Col span="4" v-else>减少点数</Col>
        <Col span="16">
          <Tooltip :content="tooltip" @on-popper-show="focus" placement="top" :disabled="disabled">
            <Input v-model="point" placeholder="请输入点数" :disabled="disabled"></Input>
          </Tooltip>
        </Col>
      </Row>
      <Row class-name="modalrow">
        <Col span="4">起始账户</Col>
        <Col span="16">
          <Select v-model="select" v-if="plus" @on-change="changeOption">
            <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <p v-else>【商户】{{uname}}</p>
        </Col>
      </Row>
      <Row v-if="plus" class-name="modalrow">
        <Col span="4">增加账户</Col>
        <Col span="16">
          <p>【商户】{{uname}}</p>
        </Col>
      </Row>
      <Row v-else class-name="modalrow">
        <Col span="4">转入账户</Col>
        <Col span="16">
          <Select v-model="select" @on-change="changeOption">
            <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row class-name="textrow">
        <Col span="4">备注</Col>
        <Col span="16">
          <textarea
            v-model="note"
            id="textRow"
            placeholder="注明备注,如没有可不填"
            rows="6"
            autocomplete="off"
            maxlength="180"
          ></textarea>
        </Col>
      </Row>
    </Modal>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { userChangeStatus, getMerchants } from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  beforeRouteEnter(to, from, next) {
    /* console.log(this, 'beforeRouteEnter'); // undefined
    console.log(to, '组件独享守卫beforeRouteEnter第一个参数');
    console.log(from, '组件独享守卫beforeRouteEnter第二个参数');
    console.log(next, '组件独享守卫beforeRouteEnter第三个参数'); */
    next(vm => {
      //因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      //console.log(vm);//当前组件的实例
      //(localStorage);
      if (localStorage.merchantList == "merchantList") {
        vm.supSuffix = vm.$route.query.suffix;
        vm.displayId = vm.$route.query.buId;
        //console.log(1);
        
        vm.init();
      }
    });
  },
  data() {
    return {
      sn: "", //标识
      isH5: true,
      username: "", //
      supSuffix: "",
      displayName: "",
      displayId: "",
      uname: "", //modal增加账户
      point: "", //点数
      note: "", //备注
      options: [], //select
      plus: null, //加点
      source: "1",
      modal: false, //加点弹窗
      select: "", //加点select
      fromUserId: "", //id
      toRole: " ",
      toUser: "",
      stopMerchant: false,
      goMerchant: false,
      disabled: true, //加点禁用
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          align: "center",
          maxWidth: 40
        },
        {
          title: "商户ID",
          key: "displayId",
          sortable: true,
          align: "center"
        },
        {
          title: "商户标识",
          key: "sn",
          sortable: true,
          align: "center"
        },
        {
          title: "商户昵称",
          key: "displayName",
          sortable: true,
          align: "center"
        },
        {
          title: "上级线路商",
          slot: "parentDisplayName",
          sortable: true,
          align: "center"
        },
        {
          title: "玩家数量",
          slot: "playerCount",
          align: "center"
        },
        {
          title: "剩余点数",
          slot: "balance",
          sortable: true,
          align: "center"
        },
        {
          title: "商户游戏",
          slot: "merchantGame",
          align: "center"
        },
        {
          title: "创建时间",
          key: "createdAt",
          sortable: true,
          align: "center",
          render: (h, params) => {
            return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD"));
          },
        },
        {
          title: "最后登录时间",
          key: "loginAt",
          sortable: true,
          align: "center",
          render: (h, params) => {
            return h("span", dayjs(params.row.loginAt).format("YYYY-MM-DD"));
          },
        },
        {
          title: "状态",
          slot: "status",
          align: "center"
        },
        {
          title: "操作",
          slot: "operate",
          align: "center"
        }
      ],
      showData: [],
      spinShow: false
    };
  },
  methods: {
    //玩家数量
    playerCountConfig(row) {
      this.$router.push({ name: "playList", query: { sn: row.sn } });
      localStorage.setItem("playList", "playList");
    },
    /* 点数 */
    //剩余点数
    balanceCount(row) {
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
          value: row.parent,
          label: "【线路商】" + row.parentDisplayName
        };
        option.push(another);
      }
      this.options = option;
      this.toRole = "100";
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
      this.$store.commit("updateBill", { params: row.balance });
      if (row.parent != "01") {
        let another = {
          value: row.parent,
          label: "【线路商】" + row.parentDisplayName,
          role: row.parentRole,
          userName: row.parentName
        };
        option.push(another);
      }
      this.options = option;
      this.fromUserId = row.userId;
    },
    //商户游戏
    merchantGameConfig(row) {
      let columns = [
        {
          title: "商户游戏",
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
    /* createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD");
    }, */
    //登录时间
    /* loginAtConfig(row) {
      return dayjs(row.loginAt).format("YYYY-MM-DD");
    }, */
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
    //启用停用
    operateStatus(row) {
      let text = row.status == 1 ? "停用" : "启用";
      let status = row.status == 1 ? 0 : 1
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
              this.init();
            }
          });
        }
      });
    },
    //前往商户系统
    opertaeGo(row) {
      let url =
        process.env.NODE_ENV == "production"
          ? "http://sh.na12345.com/#/login"
          : "http://dev-merchant.na12345.com/#/login";
      //http://localhost:8080   http://dev-merchant.na12345.com/#/login
      let uname = row.uname;
      let sn = row.sn;
      url = url + "?uname=" + uname + "&sn=" + sn;
      window.open(url);
    },
    addMerchant() {
      this.$router.push({ name: "addMerchant" });
    },
    async changeOption(id) {
      if (this.plus) {
        if (id) {
          await this.$store.dispatch("otherBill", id);
          this.disabled = false;
        }
      } else {
        this.disabled = false;
      }
    },
    focus() {
      this.tooltip = "起始账户余额为" + this.$store.state.merchants.bill;
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
      this.$store.commit("changeLoading", { params: true });
      await this.$store.dispatch("transferBussnessBill", {
        fromUserId: this.fromUserId,
        toRole: this.toRole,
        toUser: this.toUser,
        amount: this.point || 0,
        remark: this.note
      });
      setTimeout(() => {
        this.init();
      }, 200);
      this.select = "";
      this.note = "";
      this.point = "";
    },
    cancel() {
      this.select = "";
      this.note = "";
      this.point = "";
    },
    reset() {
      this.sn = "";
      this.displayName = "";
      this.displayId = "";
      this.msn = "";
      this.supSuffix = "";
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.init();
    },
    init() {
      this.spinShow = true;
      if (
        this.$route.name == "merchantList" &&
        localStorage.merchantList == "merchantList"
      ) {
        localStorage.removeItem("merchantList");
      }
      let query = {
        sn: this.sn,
        uname: this.username,
        parentSuffix: this.supSuffix,
        displayName: this.displayName,
        displayId: this.displayId
      };
      if (!query.sn) {
        delete query.sn;
      }
      if (!query.displayName) {
        delete query.displayName;
      }
      if (!query.parentSuffix) {
        delete query.parentSuffix;
      }
      if (!query.uname) {
        delete query.uname;
      }
      if (!query.displayId) {
        delete query.displayId;
      }
      let params = {
        query,
        isH5: this.isH5,
        isTest: +this.source,
        sortkey: "createdAt",
        sort: "desc"
      };
      getMerchants(params).then(res => {
        this.showData = res.payload;
        this.spinShow = false;
      });
    }
  },
  computed: {
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    }
  },
  mounted() {
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    if (this.permission.includes("停启用商户")) {
      this.stopMerchant = true;
    }
    if (this.permission.includes("前往商户系统")) {
      this.goMerchant = true;
    }
    this.init();
  },
  watch: {
    $route(to, from) {
      if (from.name == "addMerchant") {
        if (this.permission.includes("正式数据")) {
          this.source = "0";
        }
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.business {
  min-height: 89vh;
}
.business .search {
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
.radioGroup {
  padding-left: 20px;
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
  padding: 0;
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
