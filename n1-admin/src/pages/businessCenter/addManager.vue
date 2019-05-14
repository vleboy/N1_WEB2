<template>
  <div class="addLineMerchant">
    <Row>
      <Col span="12">
      <div class="basic">
        <h2>基本信息</h2>
        <Form ref="basicform" :model="basic" :label-width="120" :rules="basicValidate">
          <FormItem label="线路商标识" prop="suffix">
            <Row>
              <Col span="20">
              <Input v-model="basic.suffix" placeholder="2~6 位,只能输入英文和数字(以字母开头)"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="线路商昵称" prop="displayName">
            <Row>
              <Col span="20">
              <Input v-model="basic.displayName" placeholder="2~10位,只能输入中英文及数字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="上级线路商" prop="parent" :required='true'>
            <Row>
              <Col span="20">
              <Select v-model="basic.parent" placeholder="请选择" @on-change='selectPre'>
                <Option v-for="item in subRoleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="初始线路商点数" prop="points">
            <Row>
              <Col span="20">
              <Tooltip :content="tooltip" placement="top" @on-popper-show="focus" :disabled='disabled'>
                <Input v-model="basic.points" placeholder="请输入" :disabled='disabled'></Input>
              </Tooltip>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </div>
      <div class="admin">
        <h2>线路商后台管理员</h2>
        <Form ref='adminform' :model="admin" :label-width="110" :rules="adminValidate">
          <FormItem label="管理员账号" prop="username">
            <Row>
              <Col span="20">
              <Input v-model="admin.username" placeholder="5~16位,只能输入英文及数字"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="管理员密码" prop="password">
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
        <Form ref='gameList' :model="detail" :label-width="120" :rules="detailValidate">
          <FormItem label="线路商拥有的游戏" prop="ownGame" :required='true'>
            <Row>
              <Col span="10">
              <Select v-model="detail.gameType" :disabled='disabled' placeholder="请选择" @on-change="selectCompany">
                <Option v-for="item in gameType" :value="item.company" :key="item.company">{{ item.company }}</Option>
              </Select>
              </Col>
              <Col span="10">
              <Select v-model="detail.gameList" placeholder="请选择" @on-change="selectGame" :label-in-value='true' clearable ref="resetSelect">
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
          <FormItem label="备注" prop="remark">
            <Input v-model="admin.remark" type="textarea" :maxlength='200' :rows="4" placeholder="请输入备注,最多不超过200个字符" style="margin-left:0"></Input>
          </FormItem>
        </Form>
      </div>
      </Col>
    </Row>
    <Row>
      <div class="btn">
        <Button type="primary" @click="addlineMerchant">提交</Button>
        <Button type="primary" class="reset" @click="reset">重置</Button>
      </div>
    </Row>
    <Spin size="large" fix v-if="$store.state.login.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import { checkExit, gameBigType, oneManagers } from "@/service/index";
import {passwordLevel} from '@/config/getDefaultTime'
import _ from "lodash";
export default {
  data() {
    const validateNickname = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("昵称不能为空"));
      } else {
        let nameReg = /^[\u4e00-\u9fa5A-Za-z0-9]{2,10}$/;
        if (!nameReg.test(value)) {
          callback(new Error("2~10位,只能输入中英文及数字"));
        } else {
          checkExit({ nick: { role: "10", displayName: value } }).then(res => {
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
    const validatesuffix = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("标识不能为空"));
      } else {
        let testReg = /^[a-zA-Z][a-zA-Z0-9]{1,5}$/;
        if (!testReg.test(value)) {
          callback(new Error("2~6位,只能输入英文数字(字母开头)"));
        } else {
          checkExit({
            suffix: { role: "10", suffix: value }
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
        callback(new Error("初始线路商点数不能为空"));
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
      GameListEnum: {
        NA: [
          { company: "NA", code: "70000", name: "H5电子游戏" },
          { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" }
        ],
        KY: [
          { company: "KY", code: "1070000", name: "KY棋牌游戏" },
        ],
        TTG: [
          { company: "TTG", code: "1010000", name: "TTG电子游戏" }
        ],
        PNG: [
          { company: "PNG", code: "1020000", name: "PNG电子游戏" }
        ],
        MG: [
          { company: "MG", code: "10300000", name: "MG电子游戏" }
        ],
        HABA: [
          { company: "HABA", code: "1040000", name: "HABA电子游戏" }
        ],
        AG: [
          { company: "AG", code: "1050000", name: "AG真人游戏" }
        ],
        SA: [
          { company: "SA", code: "1060000", name: "SA真人游戏" },
          { company: "SA", code: "1110000", name: "SA捕鱼游戏" }
        ],
        PG: [
          { company: "PG", code: "1090000", name: "PG电子游戏" }
        ],
        YSB: [
          { company: "YSB", code: "1130000", name: "YSB体育游戏" }
        ],
        RTG: [
          { company: "RTG", code: "1140000", name: "RTG电子游戏" }
        ],
        SB: [
          { company: "SB", code: "1080000", name: "SB电子游戏" },
          { company: "SB", code: "1120000", name: "SB真人游戏" }
        ],
        DT: [
          { company: "DT", code: "1150000", name: "DT电子游戏" }
        ],
        PP: [
          { company: "PP", code: "1160000", name: "PP电子游戏" }
        ]
      },
      regFlg: true,
      basic: {
        suffix: "",
        displayName: "",
        parent: "",
        points: null
      },
      parentId: "",
      parentGameList: [], //parent rate
      selected: false,
      game: "",
      tipContent: "上级游戏占成为:",
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
        gameType: "",
        gameList: "",
        balance: ""
      },
      admin: {
        username: "",
        password: "",
        remark: ""
      },
      code: "",
      disabled: true,
      parentBalance: "",
      gameType: [],
      gameList: [],
      gameDetail: [],
      tooltip: "当前所属上级余额:",
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
        suffix: [
          {
            required: true,
            validator: validatesuffix,
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
        gameType: "",
        gameList: "",
        balance: ""
      };
      this.gameDetail = [];
    },
    selectPre(id) {
      if (id) {
        this.$store.commit("updateLoading", { params: true });
        this.disabled = false;
        let params = { parent: id };
        oneManagers(id).then(res => {
          if (res.code == 0) {
            this.gameType = res.payload.companyArr;
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
      /* let userId = this.parentId;
      let params = { companyIden: value, userId };
      if (userId == "01") {
        delete params.userId;
      }
      gameBigType(params).then(res => {
        if (res.code == 0) {
          this.gameList = res.payload;
        }
      }); */
      this.$refs.resetSelect.clearSingleSelect()
      this.gameList = this.GameListEnum[value]
    },
    selectGame(o) {
      if (o != undefined) {
        this.selected = true;
        this.game = o.label;
        this.code = o.value;
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
        maxRate=100;
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
      
    }, //生成密码
    addlineMerchant() {
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
                  role: "10",
                  ...this.admin,
                  ...this.basic,
                  gameList: this.gameDetail
                })
                .then(res => {
                  if (res.code == 0) {
                    this.$store.commit("updateLoading", { params: false });
                    this.$Message.success("添加成功");
                    this.$router.push({ name: "dealerList" });
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
.addLineMerchant {
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
