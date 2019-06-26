<template>
  <div class="addMerchant">
    <Row>
      <Col span="12">
      <div class="basic">
        <h2>基本信息</h2>
        <Form ref='basicform' :model="basic" :label-width="120" :rules="basicValidate">
          <FormItem label="商户标识" prop="sn">
            <Row>
              <Col span="20">
              <Input v-model="basic.sn" placeholder="3~6位,只能输入英文、数字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="商户昵称" prop="displayName">
            <Row>
              <Col span="20">
              <Input v-model="basic.displayName" placeholder="2~10位,只能输入中英文及数字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="所属线路商" prop="parent" :required="true">
            <Row>
              <Col span="20">
              <Select v-model="basic.parent" placeholder="请选择" @on-change='selectPre'>
                <Option v-for="item in subRoleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="商户初始点数" prop="points">
            <Row>
              <Col span="20">
              <Tooltip :content="tooltip" @on-popper-show="focus" placement="top" :disabled='disabled'>
                <Input v-model="basic.points" :disabled='disabled' placeholder="请输入"></Input>
              </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      <div class="admin">
        <h2>管理账号</h2>
        <Form ref='adminform' :model="admin" :label-width="120" :rules="adminValidate">
          <FormItem label="商户管理员账号" prop="username">
            <Row>
              <Col span="20">
              <Input v-model="admin.username" placeholder="5~16位,只能输入英文及数字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="商户管理员密码" prop="password">
            <Row>
              <Col span="20">
              <Input v-model="admin.password" placeholder="6~16位,包含字母、数字及符号中任意三种组合"></Input>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      </Col>
      <Col span="12">
      <div class="detail">
        <h2>拓展信息</h2>
        <Form ref='gameList' :model="detail" :label-width="110" :rules="detailValidate">
          <FormItem label="商户拥有的游戏" prop="ownGame">
            <Row>
              <Col span="10">
              <Select v-model="detail.gameType" :disabled='disabled' placeholder="请选择" @on-change="selectCompany">
                <Option v-for="item in gameType" :value="item.company" :key="item.company">{{ item.company }}</Option>
              </Select>
              </Col>
              <Col span="10">
              <Select v-model="detail.gamelist" placeholder="请选择" @on-change="selectGame" :label-in-value='true' clearable ref="resetSelect">
                <Option v-for="item in gameList" :value="item.code" :key="item.name">{{ item.name }}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem v-if="selected" prop='balance'>
            <label for="" slot="label">{{game}}商家占成(%)</label>
            <Row>
              <Col span="10">
              <Tooltip :content="tipContent">
                <Input v-model.number="detail.balance" placeholder="请输入0.00~100.00之间的数字"></Input>
              </Tooltip>
              </Col>
              <Col span="4">
              <span class="add" @click="addGame">添加</span>
              </Col>
            </Row>
          </FormItem>
          <Table :columns="columns" :data="gameDetail" class="table" size="small"></Table>
          <FormItem label="商户API白名单" prop='loginWhiteList'>
            <Row>
              <Col span="20">
              <Input v-model="detail.loginWhiteList" type="textarea" :rows="4" placeholder="请输入IP地址或IP范围,一行一个规则,每行以分号结尾,0.0.0.0为不限制任何IP"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Row>
              <Col span="20">
              <Input v-model="admin.remark" :maxlength='200' type="textarea" :rows="4" placeholder="请输入备注,最多不超过200个字符"></Input>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      </Col>
    </Row>
    <Row>
      <div class="btn">
        <Button type="primary" @click="addMerchant">提交</Button>
        <Button type="primary" class="reset" @click="reset">重置</Button>
      </div>
    </Row>
   
    <Spin size="large" fix v-show="$store.state.login.loading" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import {
  checkExit,
  gameBigType,
  oneManagers
} from "@/service/index";
import _ from "lodash";
import {passwordLevel} from '@/config/getDefaultTime'
import {GameListEnum, getGameType} from '@/config/getGameType'
export default {
  data() {
    const validateNickname = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("昵称不能为空"));
      } else {
        let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{2,10}$/;
        if (!nameReg.test(value)) {
          callback(new Error("2~10位,只能输入中英文及数字"));
        } else {
          checkExit({ nick: { role: "100", displayName: value } }).then(res => {
            if (res.payload == true) {
              callback();
            } else {
              callback(new Error("昵称不可用,请重新输入"));
            }
          });
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      } else {
         if (passwordLevel(value) < 2) {
            callback(new Error("密码中必须包含6-16位由字母、数字、符号中至少两种组成"));
          } else {
            callback();
          }
      }
    };
    // const validatesuffix = (rule, value, callback) => {
    //   if (value == "") {
    //     callback(new Error("前缀不能为空"));
    //   } else {
    //     let testReg = /^[a-zA-Z][a-zA-Z0-9]{1,5}$/;
    //     if (!testReg.test(value)) {
    //       callback(new Error("2~6位,只能输入英文数字(字母开头)"));
    //     } else {
    //       checkExit({
    //         suffix: { role: "100", suffix: value }
    //       }).then(res => {
    //         if (res.code == 0) {
    //           if (res.payload == true) {
    //             callback();
    //           } else {
    //             callback(new Error("前缀不可用,请重新输入"));
    //           }
    //         }
    //       });
    //     }
    //   }
    // };
    const validateSn = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("标识不能为空"));
      } else {
        let testReg = /^[A-Za-z0-9]{3,6}$/;
        if (!testReg.test(value)) {
          callback(new Error("3~6位,只能输入中英文、数字"));
        } else {
          checkExit({
            sn: { sn: value }
          }).then(res => {
            if (res.code == 0) {
              if (res.payload == true) {
                callback();
              } else {
                callback(new Error("标识不可用,请重新输入"));
              }
            }
          });
        }
      }
    };
    const validateBalance = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("商户点数不能为空"));
      } else {
        let testReg = /^[0-9]*$/;
        if (!testReg.test(value)) {
          callback(new Error("点数需为数字"));
        } else if (value > this.parentBalance) {
          callback(new Error("点数已超出上级余额数"));
        } else {
          callback();
        }
      }
    };
    const validateUserName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("账号不能为空"));
      } else {
        let testReg = /^[a-zA-Z0-9]{5,16}$/;
        if (!testReg.test(value)) {
          callback(new Error("5-16位,限英文和数字"));
        } else {
          callback();
        }
      }
    };
    const validateRate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("占成不能为空"));
      } else {
        let testReg = /^(\d{1,2}(\.\d{1,2})?|100(\.0{1,2})?)$/;
        if (!testReg.test(value)) {
          this.regFlg = false
          callback(new Error("请输入0.00~100.00之间的数字"));
        } else {
          this.regFlg = true
          callback();
        }
      }
    };
    return {
      regFlg: true,
      basic: {
        // suffix: "",
        sn: "",
        displayName: "",
        parent: "",
        points: null
      },
      // skinList:[{
      //   value:'1',
      //   name:'默认'
      // },{
      //   value:'2',
      //   name:'2'
      // }],
      parentId: "",
      selected: false,
      tipContent: "上级游戏占成为:",
      parentGameList: [], //parent rate
      code: "",
      columns: [
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
      ],
      detail: {
        balance: "",
        gameType: "",
        gamelist: "",
        loginWhiteList: "",
        httpType: "http://",
        url: "",
        chargeType: "http://",
        chargeUrl: "",
        registType: "http://",
        registUrl: "",
        serviceType: "http://",
        serviceUrl: "",
        // skin:'1'
      },
      admin: {
        username: "",
        password: "",
        remark: ""
      },
      gameListArr:[],
      disabled: true,
      parentBalance: "",
      gameType: [],
      gameList: [],
      gameDetail: [],
      tooltip: "当前所属上级余额:",
      game: "",
      defaultBrower: false,
      basicValidate: {
        subRole: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change"
          }
        ],
        displayName: [
          {
            required: true,
            validator: validateNickname,
            trigger: "blur"
          }
        ],
        // suffix: [
        //   {
        //     required: true,
        //     validator: validatesuffix,
        //     trigger: "blur"
        //   }
        // ],
        sn: [
          {
            required: true,
            validator: validateSn,
            trigger: "blur"
          }
        ],
        points: [
          {
            required: true,
            validator: validateBalance,
            trigger: "blur"
          }
        ]
      },
      adminValidate: {
        username: [
          {
            required: true,
            validator: validateUserName,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            validator: validatePass,
            trigger: "blur"
          }
        ]
      },
      detailValidate: {
        balance: [
          {
            validator: validateRate,
            trigger: "blur"
          }
        ],
        loginWhiteList: [
          {
            required: true
          }
        ]
      }
    };
  },
  beforeCreate() {
    this.$store.dispatch("getSubrole");
  },
  methods: {
    reset() {
      this.$refs["basicform"].resetFields();
      this.$refs["adminform"].resetFields();
      this.$refs["gameList"].resetFields();
      this.detail = {
        balance: "",
        gameType: "",
        gamelist: "",
        loginWhiteList: "",
        httpType: "http://",
        url: "",
        chargeType: "http://",
        chargeUrl: "",
        registType: "http://",
        registUrl: "",
        serviceType: "http://",
        serviceUrl: ""
      };
      this.gameDetail = [];
      this.defaultBrower = false;
    },
    selectPre(id) {
      if (id) {
        this.$store.commit("updateLoading", { params: true });
        this.disabled = false;
        let params = { parent: id };
        oneManagers(id).then(res => {
          console.log(res);
          
          if (res.code == 0) {
            this.gameType = res.payload.companyArr;
            if (res.payload.level == 0) {
              this.gameListArr = getGameType()
            } else {
              this.gameListArr = res.payload.gameList
            }
            this.parentGameList = res.payload.gameList || [];
            this.parentBalance = res.payload.balance;
            this.$store.commit("updateLoading", { params: false });
          }
        });
      this.parentId = id;
      }
     
    },
    focus() {
      this.tooltip = "当前所属上级余额:" + this.parentBalance;
    },
    selectCompany(value) {
      
      this.gameList = []
      this.$refs.resetSelect.clearSingleSelect()
      let list = _.cloneDeep(this.gameListArr)
      
      for (let i = 0; i < list.length; i++) {
        
        if (list[i].company == value) {
         
          this.gameList.push(list[i])
        }
      }
      
      //console.log(this.gameList);
      
      /* this.gameList = GameListEnum()[value] */
    },
    selectGame(o) {
      if (o != undefined) {
        this.selected = true;
        this.game = o.label ? o.label : '';
        this.code = o.value ? o.value : '';
        let parentGameList = this.parentGameList;
        let maxRate = null;
        if (parentGameList.length > 0) {
          for (let item of parentGameList) {
            if (item.code == o.value) {
              maxRate = item.rate;
              this.tipContent = `上级游戏占成为:${maxRate}`;
            }
          }
        }else{
          this.tipContent = `上级游戏占成为:100`;
          }
      }
    },
    addGame() {
      let gamelist = this.gameList;
      let gameName = this.game;
      let gameItem = {};
      let balance = this.detail.balance;
      let parentGameList = this.parentGameList;
      let maxRate = null;
      if (parentGameList.length > 0) {
        for (let item of parentGameList) {
          if (item.code == this.code) {
            maxRate = item.rate;
          }
        }
      }else{
        maxRate=100
      }
      if (balance > maxRate && maxRate != null) {
        this.$Message.warning({
          content: `不能超过上级占成`,
          duration: 2.5
        });
        return;
      }
      if (balance > 100) {
        this.$Message.warning({
          content: `不能超过100`,
          duration: 2.5
        });
        return;
      }
      for (let item of gamelist) {
        if (item.name == gameName) {
          gameItem = item;
        }
      }
      gameItem.rate = balance;
      if (this.regFlg) {
        if (gameItem.rate) {
        this.gameDetail.push(gameItem);
        this.gameDetail = _.uniqWith(this.gameDetail, _.isEqual);
      }
      }
        
      
    },
    merchantUrl() {
      let url = this.detail.httpType + this.detail.url;
      window.open(url);
    },
    chargeurl() {
      let url = this.detail.chargeType + this.detail.chargeUrl;
      window.open(url);
    },
    registurl() {
      let url = this.detail.registType + this.detail.registUrl;
      window.open(url);
    },
    serviceurl() {
      let url = this.detail.serviceType + this.detail.serviceUrl;
      window.open(url);
    },
    addMerchant() {
      this.$refs["basicform"].validate(valid => {
        if (valid) {
          this.$refs["adminform"].validate(valid => {
            if (valid) {
              if (_.isEmpty(this.gameDetail)) {
                this.$Message.error("尚未选择游戏");
                return;
              }
              this.$store.commit("updateLoading", { params: true });
              this.$store
                .dispatch("newUser", {
                  role: "100",
                  ...this.admin,
                  ...this.basic,
                  gameList: this.gameDetail,
                  // skin:this.detail.skin,
                  loginWhiteList: this.detail.loginWhiteList,
                  moneyURL: this.detail.chargeType + this.detail.chargeUrl,
                  registerURL: this.detail.registType + this.detail.registUrl,
                  frontURL: this.detail.httpType + this.detail.url,
                  feedbackURL: this.detail.serviceType + this.detail.serviceUrl,
                  isOpenBrowser: this.defaultBrower
                })
                .then(res => {
                  if (res.code == 0) {
                    this.$store.commit("updateLoading", { params: false });
                    this.$Message.success("添加成功");
                    this.$router.push({ name: "merchantList" });
                  } else {
                    this.$store.commit("updateLoading", { params: false });
                  }
                });
            } else {
              this.$Message.error("请检查输入项");
            }
          });
        } else {
          this.$Message.error("请检查输入项");
        }
      });
    }
  },
  computed: {
    subRoleList() {
      return this.$store.state.add.subRoleList;
    }
  },
  watch: {
    $route(to, from) {
      this.reset();
      this.$store.dispatch("getSubrole");
    }
  }
};
</script>

<style lang="less" scoped>
.addMerchant {
  min-height: 89vh;
  .basic,
  .admin,
  .detail {
    margin: 20px 60px;
    width: 500px;
  }
  .btn {
    width: 250px;
    margin: 0 auto;
    .reset {
      margin-left: 50px;
    }
  }
  .random,
  .add,
  .check,
  .create {
    color: #20a0ff;
    margin-left: 15px;
    cursor: pointer;
  }
  .table {
    margin-bottom: 24px;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
