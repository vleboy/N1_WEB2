<template>
  <div class="lineDetail">
    <div class="userName">
      <span>{{$route.query.displayName}} ({{$route.query.username }})</span>
      <span class="btns">
        <Button type="primary" class="edit" @click="reload">刷新</Button>
        <span v-if="permission.includes('编辑')">
          <Button type="primary" class="edit" @click.stop="editBtn" v-if="isedit">编辑</Button>
          <Button type="primary" class="edit" @click.stop="save" v-else>提交修改</Button>
        </span>
      </span>
    </div>
    <Collapse v-model="value">
      <Panel name="1">
        基本信息
        <div slot="content">
          <Form label-position="left" :label-width="100">
            <Row>
              <Col span="8">
                <FormItem label="线路商ID">{{ lineDetail.displayId}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem label="上级线路商">{{lineDetail.parentDisplayName}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem label="线路商标识">{{lineDetail.suffix}}</FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="管理员账号">{{ lineDetail.uname}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem
                  label="最后登录时间"
                >{{dayjs(lineDetail.updatedAt).format("YYYY-MM-DD HH:mm:ss")}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem label="上次登录IP">{{lineDetail.lastIP}}</FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="创建时间">{{dayjs(lineDetail.createdAt).format("YYYY-MM-DD HH:mm:ss")}}</FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </Panel>
      <Panel name="2">
        配置信息
        <div slot="content">
          <Form ref="basicform" :model="basic" label-position="left" :label-width="100">
            <Row>
              <Col span="8">
                <Checkbox class="browser" :disabled="edit" v-model="isTest">测试号</Checkbox>
              </Col>
               <Col span="8">
                <FormItem label="管理员密码" v-if="edit">
                  <Row>
                    <Col span="6">
                      <span v-if="showPass">{{lineDetail.password}}</span>
                      <span v-else>********</span>
                    </Col>
                    <Col span="6" v-if="permission.includes('查看密码')">
                      <span class="password" @click="showPass=!showPass" v-if="!showPass">显示</span>
                      <span class="password" @click="showPass=!showPass" v-else>隐藏</span>
                    </Col>
                  </Row>
                </FormItem>
                <FormItem label="管理员密码" prop="password" v-else>
                  <Row>
                    <Col span="10">
                      <Input v-model="basic.password" placeholder="6~16位,包含字母、数字及符号中任意三种组合"></Input>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="备注" v-if="edit">{{lineDetail.remark}}</FormItem>
                <FormItem label="备注" prop="remark" v-else>
                  <Row>
                    <Col span="20">
                      <Input
                        v-model="basic.remark"
                        type="textarea"
                        :maxlength="200"
                        :rows="1"
                        placeholder="请输入备注,最多不超过200个字符"
                      ></Input>
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
          <Form
            ref="gameList"
            :model="gameForm"
            :label-width="110"
            v-if="!edit"
            :rules="gameValidate"
          >
            <FormItem prop="ownGame">
              <Row>
                <Col span="3">
                  <Select v-model="gameForm.gameType" placeholder="请选择" @on-change="selectCompany">
                    <Option
                      v-for="item in gameType"
                      :value="item.company"
                      :key="item.company"
                    >{{ item.company }}</Option>
                  </Select>
                </Col>
                <Col span="3">
                  <Select
                    v-model="gameForm.gamelist"
                    placeholder="请选择"
                    @on-change="selectGame"
                    :label-in-value="true"
                  >
                    <Option
                      v-for="item in gameList"
                      :value="item.code"
                      :key="item.name"
                    >{{ item.name }}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-if="selected">
              <label slot="label">{{game}}商家占成(%)</label>
              <Row>
                <Col span="4">
                  <Tooltip :content="tipContent">
                    <Input v-model="gameForm.balance" placeholder="请输入0.00~100.00之间的数字"></Input>
                  </Tooltip>
                </Col>
                <Col span="2">
                  <span class="add" @click="addGame">添加</span>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <Table :columns="columns1" :data="gameDetail" width="500" class="table" size="small">
            <template slot-scope="{row, index}" slot="gameOperate">
              <span style="color:#20a0ff;cursor:pointer" v-if="!edit" @click="gameOperateConfig(row)">删除</span>
            </template>
          </Table>
        </div>
      </Panel>
    </Collapse>
    <div class="finance">
      <h2>
        财务信息
        <span
          style="color:#20a0ff;cursor:pointer;fontSize:1rem"
          @click="getWaterfallList"
        >(点击查询)</span>
      </h2>
      <Table :columns="columns" :data="showData" size="small">
        <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="toUser">
          <span>{{row.fromLevel > row.toLevel ? row.toDisplayName + " 对 " + row.fromDisplayName : row.fromDisplayName + " 对 " + row.toDisplayName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="tradeType">
          <span>{{row.fromLevel > row.toLevel ? '加点' : '减点'}}</span>
        </template>
        <template slot-scope="{row, index}" slot="oldBalance">
          <span>{{oldBalanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="amount">
          <span :style="{color: amountConfig(row).color}">{{amountConfig(row).amount}}</span>
        </template>
        <template slot-scope="{row, index}" slot="newBalance">
          <span>{{newBalanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operator">
          <span>{{row.operator.split("_")[1]}}</span>
        </template>
        <template slot-scope="{row, index}" slot="remark">
          <Tooltip v-if="remarkConfig(row).isShow" :content="remarkConfig(row).remark" transfer>
            <Icon color="#20a0ff" type="ios-search"></Icon>
          </Tooltip>
          <span v-else></span>
        </template>
      </Table>
      <Page
        :total="total"
        class="page"
        :page-size="pageSize"
        show-total
        @on-change="changepage"
      ></Page>
    </div>
    <div class="next">
      <h2>下级线路商列表</h2>
      <Table :columns="columns2" :data="nextLine" size="small">
        <template slot-scope="{row, index}" slot="subDisplayName">
          <span style="color:#20a0ff;cursor:pointer" @click="subDisplayNameConfig(row)">{{row.displayName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="subBalance">
          <span>{{subBalanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="subCreatedAt">
          <span>{{subCreatedAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="subRemark">
          <Tooltip v-if="remarkConfig(row).isShow" :content="remarkConfig(row).remark" transfer>
            <Icon color="#20a0ff" type="ios-search"></Icon>
          </Tooltip>
          <span v-else></span>
        </template>
        <template slot-scope="{row, index}" slot="subOperate">
          <span style="color:#20a0ff;cursor:pointer;margin-right:.3rem" @click="subAddBalance(row)">加点</span>
          <span style="color:#20a0ff;cursor:pointer;margin-right:.3rem" @click="subReduceBalance(row)">减点</span>
          <span :style="{color:statusConfig(row),cursor: 'pointer'}" @click="subOperate(row)">{{row.status == 1 ? "禁用" : "启用"}}</span>
        </template>
      </Table>
    </div>
    <div class="ownedMerchant">
      <h2>拥有商户列表</h2>
      <Table :columns="columns3" :data="ownedbusiness" size="small">
        <template slot-scope="{row, index}" slot="mcDisplayName">
          <span style="color:#20a0ff;cursor:pointer" @click="mcDisplayNameConfig(row)">{{row.displayName}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mcBalance">
          <span>{{subBalanceConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mcCreatedAt">
          <span>{{subCreatedAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="mcRemark">
          <Tooltip v-if="remarkConfig(row).isShow" :content="remarkConfig(row).remark" transfer>
            <Icon color="#20a0ff" type="ios-search"></Icon>
          </Tooltip>
          <span v-else></span>
        </template>
        <template slot-scope="{row, index}" slot="mcOperate">
          <span style="color:#20a0ff;cursor:pointer;margin-right:.3rem" @click="mcAddBalance(row)">加点</span>
          <span style="color:#20a0ff;cursor:pointer;margin-right:.3rem" @click="mcReduceBalance(row)">减点</span>
          <span :style="{color:statusConfig(row),cursor: 'pointer'}" @click="mcOperate(row)">{{row.status == 1 ? "禁用" : "启用"}}</span>
        </template>
      </Table>
    </div>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
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
          <p v-else>【线路商】{{uname}}</p>
        </Col>
      </Row>
      <Row v-if="plus" class-name="modalrow">
        <Col span="4">增加账户</Col>
        <Col span="16">
          <p>【线路商】{{uname}}</p>
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
import {
  getWaterfall,
  oneManagers,
  companySelect,
  childList,
  gameBigType,
  updateManagers,
  userChangeStatus
} from "@/service/index";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import { GameListEnum } from "@/config/getGameType";
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
        vm.spinShow = true
        vm.init()
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
      parent: "",
      isTest: false,
      value: "",
      dayjs: dayjs,
      edit: true, //可编辑
      game: "",
      showPass: false,
      role: "",
      pageSize: 100, //分页
      showData: [], //分页显示的data
      isedit: true,
      spinShow: false,
      defaultBrower: false,
      gameDetail: [],
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
      tipContent: "上级游戏占成为:",
      code: "",
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
          maxWidth: 80
        },
        {
          title: "线路商标识",
          key: "suffix"
        },
        {
          title: "线路商昵称",
          slot: "subDisplayName"
        },
        {
          title: "剩余点数",
          slot: "subBalance"
        },
        {
          title: "创建时间",
          slot: "subCreatedAt"
        },
        {
          title: "备注",
          slot: "subRemark"
        },
        {
          title: "操作(对旗下线路商操作)",
          slot: "subOperate"
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
          slot: "mcDisplayName"
        },
        {
          title: "剩余点数",
          slot: "mcBalance"
        },
        {
          title: "创建时间",
          slot: "mcCreatedAt"
        },
        {
          title: "备注",
          slot: "mcRemark"
        },
        {
          title: "操作(对旗下商户操作)",
          slot: "mcOperate"
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
          slot: "gameOperate"
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
          slot: "createdAt",
          minWidth: 40
        },
        {
          title: "交易对象",
          slot: "toUser",
          minWidth: 140
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
          slot: "newBalance"
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
    /* this.init(); */
  },
  computed: {
    total() {
      return this.waterfall.length;
    },
    permission() {
      return JSON.parse(localStorage.getItem("userInfo")).subRolePermission;
    }
  },
  /* watch: {
    $route(to, from) {
      if (to.name == "dealerDetail") {
        //console.log('in magager');
        this.spinShow = true;
        this.init();
      }
    }
  }, */
  methods: {
    /* 游戏信息 */
    //操作
    gameOperateConfig(row) {
      let index = row._index
      this.gameDetail.splice(index, 1)
    },




    /* 财务信息 */
    //交易时间
    createdAtConfig(row) {
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
    newBalanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    //备注
    remarkConfig(row) {
      if (row.remark == "NULL!" || row.remark == null) {
        return { isShow: false };
      } else {
        return { isShow: true, remark: row.remark };
      }
    },

    /* 下级线路商 */
    //线路商昵称
    subDisplayNameConfig(row) {      
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
      }) 
    },
    //剩余点数
    subBalanceConfig(row) {
      return thousandFormatter(row.balance)
    },
    //创建时间
    subCreatedAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    
    /* 操作 */
    //状态
    statusConfig(row, bool) {
      if (bool) {
        return row.status == 1 ? "#20a0ff" : "#f5141e";
      } else {
        return row.status == 1 ? "#f5141e" : "20a0ff";
      }
    },
    //加点
    subAddBalance(row) {

      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.username.substr(9);
      let adminId = admininfo.userId;
      let userName = admininfo.username;
      let userId = this.$route.query.userId;
      let role = row.role;

      this.role = "10";
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
      this.toRole = "10";
      this.toUser = row.username;
    },
    //减点
    subReduceBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.username.substr(9);
      let adminId = admininfo.userId;
      let userName = admininfo.username;
      let userId = this.$route.query.userId;
      let role = row.role;

      this.role = "10";
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
    //启用停用
    subOperate(row) {
      let text = row.status == 1 ? "禁用" : "启用";
      let status = null;
      let role = row.role;
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
    mcDisplayNameConfig(row) {
      let userId = row.userId;
      let displayName = row.displayName;
      let parent = paraparent;
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
      }) 
    },
    /* 操作 */
  
    //加点
    mcAddBalance(row) {
      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.username.substr(9);
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
    mcReduceBalance(row) {

      let admininfo = JSON.parse(localStorage.getItem("userInfo"));
      let admin = admininfo.username.substr(9);
      let adminId = admininfo.userId;
      let userName = admininfo.username;

      this.role = "100";
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
    //启用停用
    mcOperate(row) {
      let text = row.status == 1 ? "禁用" : "启用";
      let status = null;
      let role = row.role;
      this.$Modal.confirm({
        title: "提示!",
        content: `<p>是否${text}线路商</p>`,
        onOk: () => {
          userChangeStatus({
            role,
            status,
            userId: params.row.userId
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






























    handlePage() {
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.total < this.pageSize) {
        this.showData = this.waterfall;
      } else {
        this.showData = this.waterfall.slice(0, this.pageSize);
      }
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
      //reset
      this.gameForm.gameType = "";
      this.gameForm.gamelist = "";
      this.gameList = [];
      this.selected = false;
      this.gameForm.balance = "";
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
      } else {
        if (this.passwordLevel(password) < 2) {
          return this.$Message.warning({
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
          this.resetPass();
        }
        this.spinShow = false;
      });
    },
    selectCompany(value) {
      /* let userId = this.parent;
      let params = { companyIden: value, userId };
      if (userId == "01") {
        delete params.userId;
      }
      gameBigType(params).then(res => {
        if (res.code == 0) {
          this.gameList = res.payload;
        }
      }); */
      this.gameList = GameListEnum()[value]
    },
    selectGame(o) {
      this.selected = true;
      this.game = o.label;
      this.code = o.value;
      let gameDetail = this.gameDetail;
      let maxRate = 0;
      if (gameDetail.length > 0) {
        for (let item of gameDetail) {
          if (item.code == o.value) {
            maxRate = item.rate;
            this.tipContent = `上级游戏占成为:${maxRate}`;
            break;
          } else {
            this.tipContent = `上级游戏占成为:100`;
          }
        }
      } else {
        this.tipContent = `上级游戏占成为:100`;
      }
    },
    addGame() {
      let gamelist = this.gameList;
      let gameName = this.game;
      let gameItem = {};
      let gameDetail = this.gameDetail;
      let balance = this.gameForm.balance;
      let maxRate = null;
      if (gameDetail.length > 0) {
        for (let item of gameDetail) {
          if (item.code == this.code) {
            maxRate = item.rate;
          }
        }
      } else {
        maxRate = 100;
      }
      if (balance > maxRate && maxRate != null) {
        this.$Message.warning({
          content: `不能超过上级占成`,
          duration: 2.5
        });
        return;
      }
      for (let item of gamelist) {
        if (item.name == gameName) {
          gameItem = item;
        }
      }
      for (let item of gameDetail) {
        if (item.code == this.code) {
          this.$Message.warning("已选择该游戏");
          return;
        }
      }
      let re = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
      if (re.test(balance)) {
        gameItem.rate = balance;
        this.gameDetail.push(gameItem);
        this.gameDetail = _.uniqWith(this.gameDetail, _.isEqual);
      } else {
        this.$Message.warning("占成为0-100数字");
      }
    },
    resetPass() {
      let userId = this.$route.query.userId;
      oneManagers(userId).then(res => {
        this.lineDetail = res.payload;
        this.isTest = res.payload.isTest == 1 ? true : false;
        this.gameDetail = res.payload.gameList;
      });
    },
    async getWaterfallList() {
      let userId = this.$route.query.userId;
      let req1 = getWaterfall(userId);
      this.spinShow = true;
      let waterfall = await this.axios.all([req1]);
      this.spinShow = false;

      this.showData = waterfall[0].payload;
    },
    async init() {
      this.showData = [];
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
      let [managers, company, lineChild, ownBusiness] = await this.axios.all([
        req2,
        req3,
        req4,
        req5
      ]);
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
      this.handlePage();
    }
  }
};
</script>
<style lang="less" scoped>
.lineDetail {
  min-height: 89vh;
  .userName {
    line-height: 36px;
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .finance {
    margin-top: 15px;
  }
  .edit {
    float: right;
    margin-right: 20px;
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
  .password {
    margin-left: 1rem;
    color: #20a0ff;
    display: inline-block;
    // font-size: 1rem;
    font-weight: normal;
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

