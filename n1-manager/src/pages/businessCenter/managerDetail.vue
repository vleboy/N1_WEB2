<template>
  <div class="lineDetail">
    <div class="userName">
      <span>{{$route.query.displayName}} ({{$route.query.username }})</span>
      <span class="btns">
        <Button type="primary" class="edit" @click="reload" size="small" style="margin-left:.3rem">刷新</Button>
        <Button type="primary" class="edit" @click.stop="editBtn" v-if="isedit" size="small">编辑</Button>
        <Button type="primary" class="edit" @click.stop="save" v-else size="small">提交修改</Button>
      </span>
    </div>
    <Collapse v-model="value">
      <Panel name="1">
        基本信息
        <div slot="content">
          <Form label-position="left" :label-width="100">
            <Row>
               <Col span="8">
              <FormItem label="上级线路商">
                {{lineDetail.parentDisplayName}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="线路商ID">
                {{ lineDetail.displayId}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="线路商标识">
                {{lineDetail.suffix}}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="管理员账号">
                {{ lineDetail.uname}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="创建时间">
                {{dayjs(lineDetail.createdAt).format("YYYY-MM-DD HH:mm:ss")}}
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="上次登录时间">
                {{dayjs(lineDetail.updatedAt).format("YYYY-MM-DD HH:mm:ss")}}
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="上次登录IP">
                {{lineDetail.lastIP}}
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Panel>
      <Panel name="2">
        配置信息
        <div slot="content">
          <Form ref='basicform' :model="basic" label-position="left" :label-width="100">
            <Row>
              <Col span="8">
              <FormItem label="管理员密码" v-if="edit">
                <Col span="6">
                <span v-if="showPass">{{lineDetail.password}}</span>
                <span v-else>********</span>
                </Col>
                <Col span="6">
                <span class="showpass" @click="showPass=!showPass" v-if="!showPass">显示</span>
                <span class="showpass" @click="showPass=!showPass" v-else>隐藏</span>
                </Col>
              </FormItem>
              <FormItem label="管理员密码" prop="password" v-else>
                <Row>
                  <Col span="10">
                  <Input v-model="basic.password" placeholder="6~16位,包含字母、数字及符号中至少两种组合"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
              <Col span="8">
              <Checkbox class="browser" :disabled='edit' v-model="isTest">测试号</Checkbox>
              </Col>
            </Row>
            <Row>
              <Col span="16">
              <FormItem label="备注" v-if="edit">
                {{lineDetail.remark}}
              </FormItem>
              <FormItem label="备注" prop="remark" v-else>
                <Row>
                  <Col span="20">
                  <Input v-model="basic.remark" type="textarea" :maxlength='200' :rows="1" placeholder="请输入备注,最多不超过200个字符"></Input>
                  </Col>
                </Row>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Panel>
      <Panel name="3">
        游戏信息
        <div slot="content">
          <Form ref='gameList' :model="gameForm" :label-width="110" v-if="!edit" :rules="gameValidate">
            <FormItem prop="ownGame">
              <Row>
                <Col span="3">
                <Select v-model="gameForm.gameType" placeholder="请选择" @on-change="selectCompany">
                  <Option v-for="item in gameType" :value="item.company" :key="item.company">{{ item.company }}</Option>
                </Select>
                </Col>
                <Col span="3">
                <Select v-model="gameForm.gamelist" placeholder="请选择" @on-change="selectGame">
                  <Option v-for="item in gameList" :value="item.name" :key="item.name">{{ item.name }}</Option>
                </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-if="selected">
              <label slot="label">{{game}}商家占成(%)</label>
              <Row>
                <Col span="4">
                <Tooltip :content="rateTip" placement="top">
                  <Input v-model="gameForm.balance" placeholder="请输入0.00~100.00之间的数字"></Input>
                </Tooltip>
                </Col>
                <Col span="2">
                <span class="add" @click="addGame">添加</span>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <Table :columns="columns1" :data="gameDetail" width='500' class="table" size="small"></Table>
        </div>
      </Panel>
    </Collapse>
    <div class="finance">
      <h2>财务信息
        <span
          style="color:#20a0ff;cursor:pointer;fontSize:1rem"
          @click="getWaterfallList"
        >(点击查询)</span>
      </h2>
      
      <Table :columns="columns" :data="showWaterList" size="small">
        <template slot-scope="{row, index}" slot="tradeAt">
          <span>{{tradeAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="toUser">
          <span>{{row.fromLevel > row.toLevel ? `${row.toDisplayName}对row.fromDisplayName` : `${row.fromDisplayName}对${row.toDisplayName}`}}</span>
        </template>
        <template slot-scope="{row, index}" slot="tradeType">
          <span>{{row.fromLevel > row.toLevel ? "减点" : "加点"}}</span>
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
      <Page :total="totalPage" class="page" :page-size='pageSize' @on-change="changepage"></Page>
    </div>
    <div class="next">
      <h2>下级线路商列表</h2>
      <Table :columns="columns2" :data="nextLine" size="small">
        <template slot-scope="{row, index}" slot="maDisplayName">
           <span style="color:#20a0ff;cursor:pointer" @click="maDisplayNameConfig(row)">{{row.displayName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="maBalance">
          <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="maCreatedAt">
          <span>{{tradeAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="maRemark">
          <Tooltip :content="remarkConfig(row).content" v-if="remarkConfig(row).isShow">
            <Icon type="ios-search" color="#20a0ff" />
          </Tooltip>
          <span v-else></span>
        </template>
        <template slot-scope="{row, index}" slot="maOperate">
          <Button type="text" size="small" style="color:#20a0ff" @click="maAddBalance(row)">加点</Button>
          <Button type="text" size="small" style="color:#20a0ff" @click="maReduceBalance(row)">减点</Button>
          <Button type="text" size="small" :style="{color:statusConfig(row, false)}" @click="maOperateConfig(row)">{{row.status == 1 ? "停用" : "启用"}}</Button>
        </template>
      </Table>
    </div>
    <div class="ownedMerchant">
      <h2>拥有商户列表</h2>
      <Table :columns="columns3" :data="ownedbusiness" size="small">
        <template slot-scope="{row, index}" slot="meDisplayName">
           <span style="color:#20a0ff;cursor:pointer" @click="meDisplayNameConfig(row)">{{row.displayName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="meBalance">
          <span>{{balanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="meCreatedAt">
          <span>{{tradeAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="meRemark">
          <Tooltip :content="remarkConfig(row).content" v-if="remarkConfig(row).isShow">
            <Icon type="ios-search" color="#20a0ff" />
          </Tooltip>
          <span v-else></span>
        </template>
        <template slot-scope="{row, index}" slot="meOperate">
          <Button type="text" size="small" style="color:#20a0ff" @click="meAddBalance(row)">加点</Button>
          <Button type="text" size="small" style="color:#20a0ff" @click="meReduceBalance(row)">减点</Button>
          <Button type="text" size="small" :style="{color:statusConfig(row, false)}" @click="meOperateConfig(row)">{{row.status == 1 ? "停用" : "启用"}}</Button>
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
        <Tooltip :content="tooltip" placement="top" @on-popper-show="focus" :disabled='disabled'>
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
import {
  getWaterfall,
  oneManagers,
  companySelect,
  childList,
  gameBigType,
  updateManagers,
  userChangeStatus,
  httpRequest
} from "@/service/index";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import _ from "lodash";
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
      //localStorage.removeItem('dayCompany')
      //console.log(233);
      vm.spinShow = true;
      vm.showWaterList = []
      vm.init();
    });
  },
  data() {
    const validateRate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("占成不能为空"));
      } else {
        let testReg = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
        if (!testReg.test(value)) {
          callback(new Error("请输入0.00~100.00之间的数字"));
        } else {
          callback();
        }
      }
    };
    return {
      startKey: '',
      showWaterList: [],
      totalPage: 20, //数据总量
      pageSize: 20, //每页显示数据量
      currentPage: 1, //当前页码
      showNext: false, //是否显示下100条
      isTest: 0,
      parent: "",
      value: "",
      dayjs: dayjs,
      edit: true, //可编辑
      game: "",
      role: "",
      rateTip: "",
      parentGame: [],
      showData: [], //分页显示的data
      isedit: true,
      spinShow: false,
      defaultBrower: false,
      gameDetail: [],
      iaTest: false,
      showPass: false,
      selected: false,
      modal: false, //加减点modal
      plus: true,
      uname: "",
      disabled: true,
      tooltip: "起始账户余额为",
      point: "",
      select: "",
      options: [],
      note: "",
      fromUserId: "",
      toRole: " ",
      toUser: "",
      gameForm: {
        gameType: "",
        gamelist: "",
        balance: ""
      },
      gameValidate: {
        balance: [
          {
            required: true,
            trigger: "blur",
            validator: validateRate
          }
        ]
      },
      basic: {
        password: "",
        remark: ""
      },
      gameType: [],
      gameList: [], //select
      lineDetail: {},
      nextLine: [], //下级线路商列表
      ownedbusiness: [], //拥有商户列表
      columns2: [
        {
          title: "序号",
          type: "index",
          align: "center",
          maxWidth: 80
        },
        {
          title: "线路商标识",
          align: "center",
          key: "suffix"
        },
        {
          title: "线路商昵称",
          slot: "maDisplayName",
          align: "center"
        },
        {
          title: "剩余点数",
          slot: "maBalance",
          align: "center"
        },
        {
          title: "创建时间",
          align: "center",
          slot: "maCreatedAt"
        },
        {
          title: "备注",
          key: "maRemark",
          align: "center"
        },
        {
          title: "操作(对旗下线路商操作)",
          slot: "maOperate",
          align: "center"
        }
      ],
      columns3: [
        {
          title: "序号",
          type: "index",
          maxWidth: 80
        },
        {
          title: "商户标识",
          key: "sn"
        },
        {
          title: "商户昵称",
          slot: "meDisplayName"
        },
        {
          title: "剩余点数",
          slot: "meBalance"
        },
        {
          title: "创建时间",
          slot: "meCreatedAt"
        },
        {
          title: "备注",
          slot: "meRemark"
        },
        {
          title: "操作(对旗下商户操作)",
          slot: "meOperate"
        }
      ],
      columns1: [
        {
          title: "公司",
          key: "company"
        },
        {
          title: "游戏",
          key: "name"
        },
        {
          title: "商家占成",
          key: "rate",
          render: (h, params) => {
            return h("span", params.row.rate + "%");
          }
        },
        {
          title: "操作",
          key: "opreate",
          render: (h, params) => {
            if (!this.edit) {
              return h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      let index = params.row._index;
                      this.gameDetail.splice(index, 1);
                    }
                  }
                },
                "删除"
              );
            }
          }
        }
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          maxWidth: 80
        },
        {
          title: "交易时间",
          slot: "tradeAt",
          minWidth: 100
        },
        {
          title: "交易对象",
          slot: "toUser",
          minWidth: 250
        },
        {
          title: "交易类型",
          slot: "tradeType"
        },
        {
          title: "交易前余额",
          slot: "oldBalance"
        },
        {
          title: "交易点数",
          slot: "amount"
        },
        {
          title: "交易后余额",
          slot: "balance"
        },
        {
          title: "操作人",
          slot: "operator"
        },
        {
          title: "备注",
          slot: "remark"
        }
      ],
      waterfall: []
    };
  },
  created() {
    console.log(1);
    
    this.init();
  },
  computed: {
    total() {
      return this.waterfall.length;
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "dealerDetail") {
        this.init();
      }
    }
  },
  methods: {
    /* 财务信息 */
    //交易时间
    tradeAtConfig(row) {
      return this.dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    //交易前余额
    oldBalanceConfig(row) {
      return thousandFormatter(row.oldBalance)
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

    /* 下级线路商列表 */
    //线路商昵称
    maDisplayNameConfig(row) {
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

    statusConfig(row) {
      return row.status == 1 ? "#f5141e" : "#20a0ff"
    },
    //加点
    maAddBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.displayName
      let name = admininfo.username
      let adminId = admininfo.userId;
      let userName = admininfo.username;
      this.role = "10";
      this.plus = true;
      this.modal = true;
      this.disabled = true;
      this.uname = row.uname;
      let option = [
        {
          value: adminId,
          label: `【线路商】${admin}（${name}）`
        }
      ];
      if (row.parent != "01") {
        let another = {
          value: row.parent,
          label: `【线路商】${row.parentDisplayName}（${row.parentName}）`
        };
        option.push(another);
      }
      this.options = option;
      this.toRole = "10";
      this.toUser = row.username;
    },
    //减点
    maReduceBalance(row) {
      console.log(row)
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.displayName
      let name = admininfo.username
      let adminId = admininfo.userId;
      let userName = admininfo.username;
      let userId = this.$route.query.userId;
      this.role = "10";
      this.plus = false;
      this.modal = true;
      this.disabled = true;
      this.uname = row.uname;
      let option = [
        {
          value: adminId,
          label: `【线路商】${admin}（${name}）`,
          role: "1",
          userName: userName
        }
      ];
      if (row.parent != "01") {
        let another = {
          value: row.parent,
          label: `【线路商】${row.parentDisplayName}（${row.parentName}）`,
          role: row.parentRole,
          userName: row.parentName
        };
        option.push(another);
      }
      this.options = option;
      this.fromUserId = row.userId;
    },
    //停用启用
    maOperateConfig(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let userId = this.$route.query.userId;
      let text = "";
      let status = null;
      let role = row.role;
      if (row.status == 1) {
        text = "停用";
        status = 0;
      } else {
        text = "开启";
        status = 1;
      }
      this.$Modal.confirm({
        title: "提示!",
        content: `<p>是否${text}线路商</p>`,
        onOk: () => {
          userChangeStatus({
            role,
            status,
            userId: row.userId
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success(`${text}成功`);
              childList(userId, "10").then(res => {
                this.nextLine = res.payload;
              });
            }
          });
        }
      });
    },
   

    /* 拥有商户列表 */
    //商户昵称
    meDisplayNameConfig(row) {
     
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
    //加点
    meAddBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.displayName
      let name = admininfo.username;
      let adminId = admininfo.userId;
      let userName = admininfo.username;
      this.role = "100";
      this.plus = true;
      this.modal = true;
      this.disabled = true;
      this.uname = row.uname;
      let option = [
        {
          value: adminId,
          label: `【线路商】${admin}（${name}）`
        }
      ];
      if (row.parent != "01") {
        let another = {
          value: row.parent,
          label: `【线路商】${row.parentDisplayName}（${row.parentName}）`
        };
        option.push(another);
      }
      this.options = option;
      this.toRole = "100";
      this.toUser = row.username;
    },
    //减点
    meReduceBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.displayName;
      let name = admininfo.username
      let adminId = admininfo.userId;
      let userName = admininfo.username;
      this.role = "100";
      this.plus = true;
      this.modal = true;
      this.disabled = true;
      this.uname = row.uname;
      let option = [
        {
          value: adminId,
          label: `【线路商】 ${admin}（${name}）`
        }
      ];
      if (row.parent != "01") {
        let another = {
          value: row.parent,
          label: `【线路商】${row.parentDisplayName}（${row.parentName}）`
        };
        option.push(another);
      }
      this.options = option;
      this.toRole = "100";
      this.toUser = row.username;
    },
    //停用启用
    meOperateConfig(row) {
      let userId = this.$route.query.userId;
      let text = "";
      let status = null;
      let role = row.role;
      if (row.status == 1) {
        text = "停用";
        status = 0;
      } else {
        text = "开启";
        status = 1;
      }
      this.$Modal.confirm({
        title: "提示!",
        content: `<p>是否${text}线路商</p>`,
        onOk: () => {
          userChangeStatus({
            role,
            status,
            userId: row.userId
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success(`${text}成功`);
              childList(userId, "100").then(res => {
                this.ownedbusiness = res.payload;
              });
            }
          });
        }
      });
    },

    changepage(index) {
      let size = this.pageSize;
      let _start = (index - 1) * size;
      let _end = index * size;
      this.showData = this.waterfall.slice(_start, _end);
      // console.log(this.showData);
    },
    editBtn() {
      this.edit = false;
      this.isedit = false;
      this.value = ["2", "3"];
      this.basic.password = this.lineDetail.password;
      this.basic.remark = this.lineDetail.remark;
      // reset
      this.gameForm.gameType = "";
      this.gameForm.gamelist = "";
      this.gameForm.balance = "";
      this.gameList = [];
      this.selected = false;
    },
    changeOption(id) {
      this.disabled = false;
      if (id) {
        this.$store.dispatch("otherBill", id);
      }
    },
    reload() {
      this.init();
    },
    ok() {
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
      // console.log(this.toRole, this.select);
      this.$store
        .dispatch("detailBill", {
          fromUserId: this.fromUserId,
          toRole: this.toRole,
          toUser: this.toUser,
          amount: this.point,
          remark: this.note
        })
        .then(res => {
          if (res.code == 0) {
            this.$Message.success("操作成功");
            this.select = "";
            this.note = "";
            this.point = "";
            let userId = this.$route.query.userId;
            if (this.role == "10") {
              childList(userId, "10").then(res => {
                this.nextLine = res.payload;
              });
            } else {
              childList(userId, "100").then(res => {
                this.ownedbusiness = res.payload;
              });
            }
          }
        });
    },
    cancel() {
      this.select = "";
      this.note = "";
      this.point = "";
    },
    focus() {
      this.tooltip = "起始账户余额为" + this.$store.state.merchants.bill;
    },
    save() {
      let password = this.basic.password;
      if (password == "") {
        this.$Message.warning("密码不能为空");
        return;
      }else{
         if (this.passwordLevel(password) < 2) {
         return  this.$Message.warning({
          content: "密码中必须包含6-16位由字母、数字、符号中至少两种组成"
        });
       }
      }
      //  else {
      //   let testReg = /^[a-zA-Z0-9@_#$%^&*!.~-]{6,16}$/;
      //   if (!testReg.test(password)) {
      //     this.$Message.warning("密码为6~16位,包含字母、数字及符号");
      //     return;
      //   }
      // }
      this.edit = true;
      this.isedit = true;
      let userId = this.userId;
      let params = this.lineDetail;
      let suffix = this.lineDetail.suffix;
      params.password = password;
      params.remark = this.basic.remark;
      params.gameList = this.gameDetail;
      params.isTest = this.isTest == true ? 1 : 0;
      this.spinShow = true;
      if (_.isEmpty(params.gameList)) {
        this.$Message.success("尚未选择游戏");
        this.spinShow = false;
        return;
      }
      updateManagers(userId, params).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
        } else {
          this.resetPass()
          }
          this.spinShow = false;
      });
    },
    selectCompany(value) {
      let userId = this.parent;
      let params = { companyIden: value, userId };
      if (userId == "01") {
        delete params.userId;
      }
      gameBigType(params).then(res => {
        if (res.code == 0) {
          this.gameList = res.payload;
        }
      });
    },
    selectGame(value) {
      this.selected = true;
      this.game = value;
      let rate = 0;
      let parentGame = this.parentGame;
      if (parentGame.length > 0) {
        for (let item of parentGame) {
          if (item.name == value) {
            rate = item.rate;
          }
        }
      } else {
        rate = 100;
      }
      this.rateTip = `该上级线路商${value}占成为${rate}%`;
    },
    addGame() {
      let gamelist = this.gameList;
      let gameName = this.game;
      let gameItem = {};
      for (let item of gamelist) {
        if (item.name == gameName) {
          gameItem = item;
        }
      }
      let oldGame = this.gameDetail;
      for (let item of oldGame) {
        if (item.name == gameName) {
          this.$Message.warning("已选择该游戏");
          return;
        }
      }
      let re = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
      if (re.test(this.gameForm.balance)) {
        gameItem.rate = this.gameForm.balance;
        this.gameDetail.push(gameItem);
        this.gameDetail = _.uniqWith(this.gameDetail, _.isEqual);
      } else {
        this.$Message.warning("占成为0-100数字");
      }
    }, //生成密码
    resetPass(){
      let userId = this.$route.query.userId;
      oneManagers(userId).then(res=>{
       this.lineDetail = res.payload;
        this.isTest = res.payload.isTest == 1 ? true : false;
        this.gameDetail = res.payload.gameList;
      })
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
      
      let userId = this.$route.query.userId;
    
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
      this.spinShow = true;
      let userId = this.$route.query.userId;
      let parent = this.$route.query.parent;
      this.parent = parent;
      this.userId = userId;
      this.edit = true;
      this.isedit = true;
      let req2 = oneManagers(userId);
      let req3 = companySelect({ parent });
      let req4 = childList(userId, "10"); //线路商
      let req5 = childList(userId, "100"); //商户
      let [
        managers,
        company,
        lineChild,
        ownBusiness
      ] = await this.axios.all([req2, req3, req4, req5]);
      this.spinShow = false;
      
      if (managers && managers.code == 0) {
        this.lineDetail = managers.payload;
        this.isTest = managers.payload.isTest == 1 ? true : false;
        this.gameDetail = managers.payload.gameList;
      }
      if (company && company.code == 0) {
        this.gameType = company.payload;
      }
      if (lineChild && lineChild.code == 0) {
        this.nextLine = lineChild.payload;
      }
      if (ownBusiness && ownBusiness.code == 0) {
        this.ownedbusiness = ownBusiness.payload;
      }
      oneManagers(parent).then(res => {
        if (res.code == 0) {
          this.parentGame = res.payload.gameList || [];
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.lineDetail {
  min-height: 89vh;
  .userName {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
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
  .showpass {
    margin-left: 0.5rem;
    color: #20a0ff;
    display: inline-block;
    // font-size: 1rem;
    font-weight: normal;
    cursor: pointer;
  }
  .finance {
    margin-top: 15px;
  }
  .edit {
    float: right;
    margin-top: 1rem;
  }
  
  .logo {
    width: 200px;
  }
  .next,
  .ownedMerchant {
    margin: 20px auto;
  }
  .add,
  .create {
    color: #20a0ff;
    margin-left: 15px;
    cursor: pointer;
  }
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
.page {
  text-align: right;
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
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

