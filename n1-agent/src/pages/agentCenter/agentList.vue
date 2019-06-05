<template>
  <div class="agetlist">
    <div class="nowList">
      <p class="title">
        当前代理
      </p>
      <Table :columns="columns1" :data="userInfo" size="small"></Table>
    </div>
    <div class="childList">
      <div class="top">
        <span class="title left">
          下级代理列表
          <span :style="{paddingLeft:'10px',fontWeight:'normal',fontSize:'16px'}">H5接线</span>
          <i-switch v-model="isH5" @on-change="searchAgent"></i-switch>
          <RadioGroup v-model="source" v-if="level==0" class="radioGroup" type="button" @on-change='changeSource'>
            <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
            <Radio label="1">测试</Radio>
            <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
          </RadioGroup>
        </span>
        <div class="search">
          <Input v-model.trim="userName" placeholder="请输入代理账号" style="width: 150px"></Input>
          <Button type="primary" @click="searchAgent">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
      </div>
      <div class="table">
        <Table :columns="columns1" :data="agentList" size="small"></Table>
      </div>
    </div>
    <div class="childList" v-for="(item,index) in agentChild" :key="index">
      <p class="title">
        ({{item.childItem.length > 0 && item.childItem[0].parentDisplayName ? item.childItem[0].parentDisplayName : parentNameChild}}) 下级代理列表
        <span :style="{paddingLeft:'10px',fontWeight:'normal',fontSize:'16px'}">H5接线</span>
        <i-switch v-model="item.isH5" @on-change="changeChildType(item)"></i-switch>
        <RadioGroup v-model="item.isTest" v-if="level==0" class="radioGroup" type="button" @on-change='changeChildType(item)'>
          <Radio label="0">正式</Radio>
          <Radio label="1">测试</Radio>
          <Radio label="2">全部</Radio>
        </RadioGroup>
      </p>
      <Table :columns="columns1" :data="item.childItem" size="small"></Table>
    </div>
    <div class="playerList" id="playerList">
      <div class="top">
        <span class="title left">
          所属玩家列表
        </span>
      </div>
      <div class="table">
        <Table :columns="columns2" :data="playerList" size="small"></Table>
      </div>
    </div>
    <Spin size="large" fix v-if="$store.state.agent.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
    <Modal v-model="modal" @on-ok="ok" id="plusModal" @on-cancel='cancel'>
      <h2 v-if='plus'>加点操作</h2>
      <h2 v-else>减点操作</h2>
      <Form :label-width="100">
        <FormItem label="存入点数" v-if="plus">
          <Tooltip :content="maxBalance">
            <Input type="text" v-model="point" placeholder="请输入点数" style="width: 280px"> </Input>
          </Tooltip>
        </FormItem>
        <FormItem label="减少点数" v-else>
          <Tooltip :content="maxBalance">
            <Input type="text" v-model="point" placeholder="请输入点数" style="width: 280px"> </Input>
          </Tooltip>
        </FormItem>
        <div v-if="plus">
          <FormItem label="起始账户">
            {{parentDisplayName}}
          </FormItem>
          <FormItem label="转入账户">
            {{currentDisplayName}}
          </FormItem>
        </div>
        <div v-else>
          <FormItem label="起始账户">
            {{currentDisplayName}}
          </FormItem>
          <FormItem label="转入账户">
            {{parentDisplayName}}
          </FormItem>
        </div>
        <FormItem label="备注">
          <Input v-model="remark" type="textarea" :rows="4" placeholder="注明备注,如没有可不填" style="width: 280px"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="agentModal" @on-ok="createAgent" width='550' title="创建代理" @on-cancel='resetAgent'>
      <Form ref='agentForm' :label-width="100" :model="agent" :rules='agentValidate'>
        <FormItem label="所属代理" :required='true'>
          <Select v-model="agent.parent" placeholder="请选择" @on-change='selectParent'>
            <Option v-for="item in parentList" :value="item.userId" :key="item.userId">{{ item.displayName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理类别" :required='true'>
          <Select v-model="agentType" placeholder="请选择" @on-change='selectType' :disabled='Topdisabled'>
            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="代理标识" prop='sn'>
          <p v-if='defaultSn'>{{parentSn}}</p>
          <Input v-else v-model="agent.sn" placeholder="3~5位,只能包含中英文、数字、@、_"></Input>
        </FormItem>
        <FormItem label="代理账号" prop='username'>
          <Input v-model="agent.username" placeholder="5~16位,只能包含英文或数字"></Input>
        </FormItem>
        <FormItem label="代理密码" prop='password'>
          <Input v-model="agent.password" placeholder="6~16位,必须包含英文、数字和符号任意两种组合"></Input>
        </FormItem>
        <FormItem label="代理昵称" prop='displayName'>
          <Input v-model="agent.displayName" placeholder="2~10位,只能包含中文、英文或数字"></Input>
        </FormItem>
        <FormItem label="备注">
          <textarea v-model="agent.remark" id="textRow" placeholder="注明备注,如没有可不填" rows="2" autocomplete="off" maxlength="2000"></textarea>
        </FormItem>
        <FormItem label="代理拥有的游戏" :required='true'>
          <Row>
            <Col span="10">
            <Select :disabled='disabled' v-model="agent.select" placeholder="请选择" @on-change="selectCompany">
              <Option v-for="item in gameType" :value="item.company" :key="item.company">{{ item.company }}</Option>
            </Select>
            </Col>
            <Col span="10">
            <Select placeholder="请选择" v-model="agent.game" @on-change="selectGame" :label-in-value='true' clearable ref="resetSelect">
              <Option v-for="item in gameList" :value="item.code" :key="item.name">{{ item.name }}</Option>
            </Select>
            </Col>
          </Row>
        </FormItem>
        <FormItem v-if="selected" prop='balance' :required='true'>
          <label for="" slot="label">{{game}}洗码比(%)</label>
          <Row>
            <Col span="10">
            <Tooltip :content="tipContent">
              <Input v-model="balance" @on-keyup="checkFloat()" placeholder="0~1,不超过上级洗码比"></Input>
            </Tooltip>
            </Col>
            <Col span="4">
            <span class="add" @click="addGame">添加</span>
            </Col>
          </Row>
        </FormItem>
        <Table :columns="columns" :data="gameDetail" class="table" size="small"></Table>
        <FormItem label="代理点数" prop='points'>
          <Tooltip :content="pointContent">
            <Input v-model="agent.points" placeholder="请输入点数,不超过上级点数"></Input>
          </Tooltip>
        </FormItem>
        <FormItem label="代理成数" prop='rate'>
          <Tooltip :content="rateContent">
            <Input v-model="agent.rate" placeholder="0~100,不超过上级成数"></Input>
          </Tooltip>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="playerModal" @on-ok="addPlayerConfirm" title="创建玩家" @on-cancel='cancelPlayer'>
      <Form :label-width="80" ref="playerForm" :model="player" :rules='playerValidate'>
        <FormItem label="用户名" prop='userName'>
          <!-- 6-16位中英文或者数字 -->
          <Input v-model="player.userName" placeholder="6~16位,只能包含英文或数字"></Input>
        </FormItem>
        <FormItem label="密码" prop='userPwd'>
          <Input v-model="player.userPwd" placeholder="密码由6-16位字母和数字至少两种组成"></Input>
        </FormItem>
        <FormItem label="直属上级" :required='true'>
          <Select v-model="player.parentId" placeholder="请选择" @on-change='selectPlayerParent'>
            <Option v-for="item in parentList" :value="item.userId" :key="item.userId">{{ item.displayName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="玩家洗码比" :required='true'>
          <Table :columns="playerCol" :data="playerMix" class="table" size="small"></Table>
          </Input>
        </FormItem>
        <FormItem label="分配点数" prop='points'>
          <Tooltip :content="pointContent">
            <Input type="text" :disabled='disabled' v-model="player.points" placeholder="请输入点数"></Input>
          </Tooltip>
        </FormItem>
        <FormItem label="备注">
          <Input v-model="player.remark" type="textarea" :rows="4" placeholder="注明备注,如没有可不填"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import dayjs from "dayjs";
import _ from "lodash";
import {
  availableAgents,
  userChangeStatus,
  checkAgentMix,
  gameBigType,
  checkExit,
  agentOne,
  agentNew,
  getagentList,
  creatPlayer,
  getBill,
  frozen
} from "@/service/index";
import { thousandFormatter } from "@/config/format";
export default {
  data() {
    const validatePlayerName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名不能为空"));
      } else {
        let nameReg = /^[A-Za-z0-9]{6,16}$/;
        if (!nameReg.test(value)) {
          callback(new Error("6~16位,只能包含英文或数字"));
        } else {
          callback();
        }
      }
    };
    const validatePlayerPass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      } else {
        let nameReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$$/;
        if (!nameReg.test(value)) {
          callback(new Error("密码由6-16位字母和数字组成"));
        } else {
          callback();
        }
      }
    };
    const validateSn = (rule, value, callback) => {
      if (!this.defaultSn) {
        if (value == "") {
          callback(new Error("标识不能为空"));
        } else {
          let nameReg = /^[\u4e00-\u9fa5A-Za-z0-9@_]{3,5}$/;
          if (!nameReg.test(value)) {
            callback(new Error("3~5位,只能包含中英文、数字、@、_"));
          } else {
            callback();
            // checkExit({ nick: { role: "10", displayName: value } }).then(res => {
            //   if (res.payload == true) {
            //     callback();
            //   } else {
            //     callback(new Error("昵称不可用,请重新输入"));
            //   }
            // });
          }
        }
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("用户名不能为空"));
      } else {
        let nameReg = /^[A-Za-z0-9]{5,16}$/;
        if (!nameReg.test(value)) {
          callback(new Error("5~16位,只能包含英文或数字"));
        } else {
          checkExit({
            user: { role: "1000", suffix: "", username: value }
          }).then(res => {
            if (res.payload == true) {
              callback();
            } else {
              callback(new Error("用户名不可用,请重新输入"));
            }
          });
        }
      }
    };
    const validateNickname = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("昵称不能为空"));
      } else {
        let nameReg = /^[\u4e00-\u9fa5A-Za-z0-9]{2,10}$/;
        if (!nameReg.test(value)) {
          callback(new Error("2~10位,只能输入中英文及数字"));
        } else {
          checkExit({ nick: { role: "1000", displayName: value } }).then(
            res => {
              if (res.payload == true) {
                callback();
              } else {
                callback(new Error("昵称不可用,请重新输入"));
              }
            }
          );
        }
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("密码不能为空"));
      } else {
        if (this.passwordLevel(value) < 2) {
          callback(
            new Error("密码中必须包含6-16位由字母、数字、符号中至少两种组成")
          );
        } else {
          callback();
        }
      }
    };
    const validatePoint = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("点数不能为空"));
      } else {
        let testReg = /^[0-9]\d*$/;
        if (!testReg.test(value)) {
          callback(new Error("点数需为数字"));
        } else {
          if (value > this.parentBalance) {
            callback(new Error("点数超过了上级余额"));
          } else {
            callback();
          }
        }
      }
    };
    const validateRate = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("成数不能为空"));
      } else {
        let testReg = /^\d*$/;
        if (!testReg.test(value)) {
          callback(new Error("成数需为数字"));
        } else {
          if (value > this.parentRate) {
            callback(new Error("成数超过了上级成数"));
          } else {
            callback();
          }
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
      plus: null,
      userInfo: [],
      modal: false,
      point: "",
      remark: "",
      userName: "",
      isH5:true,
      //权限
      startStop: false,
      createAgents: false,
      // search2: "",
      admin: false, //当前代理
      parentDisplayName: "",
      playerPoint: false,
      agentChild: [],
      currentLevel: null,
      fromUserId: "", //modal data
      toRole: "",
      source: "1",
      toUser: "",
      parent: "",
      newPlayer: false,
      currentPlayer: "none", //创建玩家
      maxBalance: "上级代理余额为:",
      topBalance: 0,
      //创建agnet
      agentModal: false,
      Topdisabled: false,
      code: "",
      agentType: 1,
      defaultSn: true,
      parentSn: "",
      selected: false,
      game: "", //选择的游戏
      balance: "",
      parentList: [],
      tipContent: "上级游戏洗码比为",
      pointContent: "上级代理余额为:",
      rateContent: "上级代理成数为:",
      parentBalace: 0,
      parentRate: 0,
      parentGameList: [],
      typeList: [
        {
          label: "与上级相同",
          value: 1
        },
        {
          label: "分配代理标识",
          value: 2
        }
      ],
      disabled: true,
      gameType: [],
      gameList: [],
      gameDetail: [],
      agent: {
        parent: "",
        sn: "",
        username: "",
        password: "",
        displayName: "",
        remark: "",
        points: "",
        rate: "",
        select: "",
        game: ""
      },
      agentValidate: {
        sn: [
          {
            validator: validateSn,
            trigger: "blur",
            required: true
          }
        ],
        username: [
          {
            validator: validateName,
            trigger: "blur",
            required: true
          }
        ],
        displayName: [
          {
            validator: validateNickname,
            trigger: "blur",
            required: true
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur",
            required: true
          }
        ],
        points: [
          {
            validator: validatePoint,
            trigger: "blur",
            required: true
          }
        ],
        rate: [
          {
            validator: validateRate,
            trigger: "blur",
            required: true
          }
        ]
      },
      //添加玩家
      playerModal: false,
      currentDisplayName: "",
      player: {
        userName: "",
        userPwd: "",
        parentId: "",
        points: "",
        remark: ""
      },
      playerValidate: {
        userName: [
          {
            validator: validatePlayerName,
            trigger: "blur",
            required: true
          }
        ],
        userPwd: [
          {
            validator: validatePlayerPass,
            trigger: "blur",
            required: true
          }
        ],
        points: [
          {
            required: true,
            validator: validatePoint,
            trigger: "blur"
          }
        ]
      },
      playerCol: [
        {
          title: "游戏类别",
          key: "name"
        },
        {
          title: "玩家洗码比（%）",
          key: "",
          render: (h, params) => {
            let mix = params.row.mix;
            return h("InputNumber", {
              props: {
                min: 0,
                max: parseFloat(mix),
                value: parseFloat(mix),
                step: 0.01,
                placeholder: "请输入玩家洗码比(必填)"
              },
              on: {
                "on-change": value => {
                  let playerMix = _.cloneDeep(this.playerMix);
                  let index = params.row._index;
                  playerMix[index].mix = value;
                  this.playerMixClone = playerMix;
                }
              }
            });
          }
        }
      ],
      playerMix: [],
      playerMixClone: [],
      parentNameChild: "",
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
          title: "洗码比",
          key: "mix",
          render: (h, params) => {
            return h("span", params.row.mix + "%");
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
      columns1: [
        {
          title: "代理账号",
          key: "username",
          align: 'center',
          sortable: true,
          render: (h, params) => {
            let currentId = localStorage.userId;
            if (params.row.userId == currentId) {
              return h(
                "span",
                {
                  style: {
                    cursor: "pointer",
                    color: "#20a0ff"
                  },
                  on: {
                    click: async () => {
                      this.init();
                    }
                  }
                },
                params.row.username
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    cursor: "pointer",
                    color: "#20a0ff"
                  },
                  on: {
                    click: async () => {
                      this.$store.commit("changePlayer", {
                        params: []
                      });
                      let userId = params.row.userId;
                      let level = params.row.level;
                      this.parentNameChild = params.row.displayName;
                      this.currentLevel = level + 1;
                      let showList = await this.getNextAgent(
                        this.agentChild,
                        userId
                      );
                      //去空数组
                      showList = _.filter(showList, function(o) {
                        return o.childItem.length;
                      });
                      //去下级
                      let len = showList.length;
                      if (len > 0) {
                        while (len--) {
                          if (
                            showList[len].childItem.length &&
                            showList[len].childItem[0].level > level + 1
                          ) {
                            showList.splice(len, 1);
                          }
                        }
                      }
                      this.agentChild = showList;
                      this.$store.dispatch("getAgentPlayer", {
                        fromUserId: userId
                      });
                    }
                  }
                },
                params.row.username
              );
            }
          }
        },
        {
          title: "代理昵称",
          key: "displayName",
          align: 'center',
          sortable: true,
          render: (h, params) => {
            if (params.row.isTest == 1) {
              return h("div", [
                h(
                  "span",
                  {
                    style: {
                      color: "#ff9900"
                    }
                  },
                  params.row.displayName
                ),
                h(
                  "Tooltip",
                  {
                    props: {
                      content: "测试帐号，在看板和报表统计中可选显示"
                    }
                  },
                  [
                    h("Icon", {
                      props: {
                        type: "help-circled"
                      },
                      style: {
                        paddingLeft: "8px"
                      }
                    })
                  ]
                )
              ]);
            } else {
              return h("span", params.row.displayName);
            }
          }
        },
        {
          title: "上级代理",
          key: "parentDisplayName",
          align: 'center',
          sortable: true,
          render: (h, params) => {
            if (params.row.parent == "00") {
              return h("span", "");
            } else {
              return h("span", params.row.parentDisplayName);
            }
          }
        },
        {
          title: "代理游戏",
          key: "",
          align: 'center',
          render: (h, params) => {
            if (params.row.parent == "00") {
              return h("span", "");
            } else {
              let column = [
                {
                  title: "代理游戏",
                  key: "name"
                },
                {
                  title: "洗码比",
                  key: "mix"
                }
              ];
              let data = [];
              let gameList = params.row.gameList;
              let len = gameList.length;
              for (let item of gameList) {
                let obj = {};
                obj.mix = item.mix + "%";
                obj.name = item.name;
                data.push(obj);
              }
              return h(
                "Poptip",
                {
                  props: {
                    trigger: "hover"
                  }
                },
                [
                  h(
                    "span",
                    {
                      style: {
                        cursor: "pointer",
                        color: "#20a0ff"
                      }
                    },
                    len + "款游戏"
                  ),
                  h("Table", {
                    props: {
                      columns: column,
                      data: data,
                      border: true,
                      size: "small",
                      width: 250
                    },
                    slot: "content"
                  })
                ]
              );
            }
          }
        },
        {
          title: "下级代理数量",
          align: 'center',
          minWidth:35,
          key: "agentCount"
        },
        {
          title: "玩家数量",
          align: 'center',
          key: "playerCount"
        },
        {
          title: "代理成数",
          align: 'center',
          key: "rate",
          sortable: true,
          render: (h, params) => {
            return h("span", params.row.rate + "%");
          }
        },
        {
          title: "剩余点数",
          key: "balance",
          align: 'center',
          sortable: true,
          render: (h, params) => {
            let currentId = localStorage.userId;
            if (params.row.userId == currentId) {
              return h("span", thousandFormatter(params.row.balance));
            } else {
              let permission = this.permission;
              if (permission.includes("代理加减点") || this.level != 0) {
                return h("div", [
                  h("p", thousandFormatter(params.row.balance)),
                  h("p", [
                    h(
                      "span",
                      {
                        style: {
                          color: "#20a0ff",
                          cursor: "pointer"
                        },
                        on: {
                          click: () => {
                            this.modal = true;
                            this.plus = true;
                            this.currentDisplayName =
                              "【" +
                              params.row.displayName +
                              "】" +
                              params.row.username;
                            this.parentDisplayName =
                              "【" +
                              params.row.parentDisplayName +
                              "】" +
                              params.row.parentName;
                            let id =
                              params.row.parent == "01"
                                ? localStorage.userId
                                : params.row.parent;
                            getBill(id).then(res => {
                              this.maxBalance =
                                "上级代理余额为:" + res.payload.balance;
                              this.topBalance = res.payload.balance;
                            });
                            if (params.row.parent == "01") {
                              this.fromUserId = localStorage.userId;
                            } else {
                              this.fromUserId = params.row.parent;
                            }
                            this.parent = params.row.parent;
                            this.toRole = params.row.role;
                            this.toUser = params.row.username;
                          }
                        }
                      },
                      "加点"
                    ),
                    h(
                      "span",
                      {
                        style: {
                          color: "#20a0ff",
                          cursor: "pointer",
                          paddingLeft: "10px"
                        },
                        on: {
                          click: () => {
                            this.modal = true;
                             this.currentDisplayName=
                             "【" +
                              params.row.displayName +
                              "】" +
                              params.row.username;
                            this.plus = false;
                            let id =
                              params.row.parent == "01"
                                ? localStorage.userId
                                : params.row.parent;
                            this.maxBalance =
                              "起始账户余额为:" + params.row.balance;
                            this.topBalance = params.row.balance;
                            this.parentDisplayName =
                              "【" +
                              params.row.parentDisplayName +
                              "】" +
                              params.row.parentName;
                            this.parent = params.row.parent;
                            this.fromUserId = params.row.userId;
                            this.toRole = params.row.parentRole;
                            this.toUser = params.row.parentName;
                          }
                        }
                      },
                      "减点"
                    )
                  ])
                ]);
              } else {
                return h("span", thousandFormatter(params.row.balance));
              }
            }
          }
        },
        {
          title: "创建时间",
          key: "createdAt",
          align: 'center',
          sortable: true,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "状态",
          key: "status",
          align: 'center',
          sortable: true,
          render: (h, params) => {
            if (params.row.parent == "00") {
              return h("span", "");
            } else {
              if (params.row.status == 1) {
                return h(
                  "Tag",
                  {
                    props: {
                      type: "border",
                      color: "green"
                    }
                  },
                  "正常"
                );
              } else {
                return h(
                  "Tag",
                  {
                    props: {
                      type: "border",
                      color: "red"
                    }
                  },
                  "锁定"
                );
              }
            }
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "",
          render: (h, params) => {
            if (params.row.current == true) {
              return h("div", [
                h(
                  "Button",
                  {
                    style: {
                      color: "#20a0ff",
                      display: this.createAgents ? "inline" : "none"
                    },
                     props: {
                      type: "text",
                      size: "small"
                    },
                    on: {
                      click: async () => {
                        //代理管理员
                        this.agent.parent = "";
                        this.admin = true;
                        this.defaultSn = false;
                        this.agentModal = true;
                        this.agentType = 2;
                        this.Topdisabled = true;
                        let parent =
                          params.row.level == 0 ? "01" : params.row.userId;
                        let res = await availableAgents({ parent });
                        if (res.code == 0) {
                          this.parentList = res.payload;
                          this.agent.parent = parent; //默认代理
                          this.selectParent(parent);
                        }
                        this.parentRate = params.row.rate;
                        this.selected = false;
                        this.rateContent = "上级代理成数为:" + params.row.rate;
                      }
                    }
                  },
                  "创建代理"
                ),
                h(
                  "Button",
                  {
                     props: {
                      type: "text",
                      size: "small"
                    },
                    style: {
                      color: "#20a0ff",
                      display: this.currentPlayer
                    },
                    on: {
                      click: () => {
                        this.playerModal = true;
                        this.newPlayer = true;
                        let userId = params.row.userId;
                        availableAgents({ parent: userId }).then(res => {
                          if (res.code == 0) {
                            this.parentList = res.payload;
                            this.player.parentId = userId;
                            this.selectPlayerParent(userId);
                          }
                        });
                      }
                    }
                  },
                  "创建玩家"
                )
              ]);
            } else {
              let color = "";
              let text = "";
              let status = null;
              if (params.row.status == 1) {
                text = "锁定";
                color = "#f30";
                status = 0;
                return h("div", [
                  h(
                    "Button",
                    {
                       props: {
                      type: "text",
                      size: "small"
                      },
                      style: {
                        color: "#20a0ff",
                      },
                      on: {
                        click: () => {
                          let userId = params.row.userId;
                          let displayName = params.row.displayName;
                          let parent = params.row.parent;
                          this.$router.push({
                            path: "/agentDetail",
                            query: {
                              userId,
                              displayName,
                              parent
                            }
                          });
                        }
                      }
                    },
                    "查看"
                  ),
                  h(
                    "Button",
                    {
                       props: {
                      type: "text",
                      size: "small"
                    },
                      style: {
                        color: color,
                        display: this.startStop ? "inline" : "none"
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: "提示!",
                            content: `<p>是否${text}该代理</p>`,
                            onOk: () => {
                              userChangeStatus({
                                role: "1000",
                                status,
                                userId: params.row.userId
                              }).then(res => {
                                if (res.code == 0) {
                                  this.$Message.success(`${text}成功`);
                                  this.init();
                                }
                              });
                            }
                          });
                        }
                      }
                    },
                    text
                  ),
                  h(
                    "Button",
                    {
                       props: {
                      type: "text",
                      size: "small"
                    },
                      style: {
                        color: "#20a0ff",
                        display: this.createAgents ? "inline" : "none"
                      },
                      on: {
                        click: async () => {
                          this.agent.parent = "";
                          this.agentModal = true;
                          this.parentSn = params.row.sn || "NA369";
                          let userId = params.row.userId;
                          let res = await availableAgents({ parent: userId });
                          if (res.code == 0) {
                            this.parentList = res.payload;
                            this.agent.parent = userId;
                            this.selectParent(userId);
                          }
                          this.parentRate = params.row.rate;
                          this.rateContent =
                            "上级代理成数为:" + params.row.rate;
                        }
                      }
                    },
                    "创建代理"
                  ),
                  h(
                    "Button",
                    {
                       props: {
                      type: "text",
                      size: "small"
                    },
                      style: {
                        color: "#20a0ff",
                      },
                      on: {
                        click: () => {
                          this.playerModal = true;
                          let userId = params.row.userId;
                          availableAgents({ parent: userId }).then(res => {
                            if (res.code == 0) {
                              this.parentList = res.payload;
                              this.player.parentId = userId;
                             this.selectPlayerParent(userId);
                            }
                          });
                        }
                      }
                    },
                    "创建玩家"
                  )
                ]);
              } else {
                text = "解锁";
                color = "#19be6b";
                status = 1;
                return h("div", [
                  h(
                    "Button",
                    {
                       props: {
                      type: "text",
                      size: "small"
                    },
                      style: {
                        color: "#20a0ff",
                      },
                      on: {
                        click: () => {
                          let userId = params.row.userId;
                          let username = params.row.username;
                          let parent = params.row.parent;
                          this.$router.push({
                            path: "/agentDetail",
                            query: {
                              userId,
                              username,
                              parent
                            }
                          });
                        }
                      }
                    },
                    "查看"
                  ),
                  h(
                    "Button",
                    {
                       props: {
                      type: "text",
                      size: "small"
                    },
                      style: {
                        color: color,
                        display: this.startStop ? "inline" : "none"
                      },
                      on: {
                        click: () => {
                          this.$Modal.confirm({
                            title: "提示!",
                            content: `<p>是否${text}该代理</p>`,
                            onOk: () => {
                              userChangeStatus({
                                role: "1000",
                                status,
                                userId: params.row.userId
                              }).then(res => {
                                if (res.code == 0) {
                                  this.$Message.success(`${text}成功`);
                                  this.init();
                                }
                              });
                            }
                          });
                        }
                      }
                    },
                    text
                  )
                ]);
              }
            }
          }
        }
      ],
      columns2: [
        {
          title: "序号",
          align: 'center',
          type: "index"
        },
        {
          title: "用户名",
          align: 'center',
          key: "userName",
          sortable: true,
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
                    localStorage.setItem("playerName", params.row.userName);
                    this.$router.push({
                      name: "playDetail",
                      query: {
                        name: params.row.userName
                      }
                    });
                  }
                }
              },
              params.row.userName
            );
          }
        },
        {
          title: "点数",
          align: 'center',
          key: "balance",
          sortable: true,
          render: (h, params) => {
            return h("div", [
              h("p", params.row.balance),
              h("p", [
                h(
                  "span",
                  {
                    style: {
                      color: "#20a0ff",
                      cursor: "pointer"
                    },
                    on: {
                      click: () => {
                        this.modal = true;
                        let id =
                          params.row.parent == "01"
                            ? localStorage.userId
                            : params.row.parent;
                        getBill(id).then(res => {
                          this.maxBalance =
                            "上级代理余额为:" + res.payload.balance;
                          this.topBalance = res.payload.balance;
                        });
                        this.playerPoint = true;
                        this.plus = true;
                        this.parentDisplayName =
                          "【代理】" + params.row.parentName;
                        this.fromUserId = params.row.parent;
                        this.toUser = params.row.userName;
                      }
                    }
                  },
                  "加点"
                ),
                h(
                  "span",
                  {
                    style: {
                      color: "#20a0ff",
                      cursor: "pointer",
                      paddingLeft: "10px"
                    },
                    on: {
                      click: () => {
                        this.modal = true;
                        this.playerPoint = true;
                        let id =
                          params.row.parent == "01"
                            ? localStorage.userId
                            : params.row.parent;
                        getBill(id).then(res => {
                          this.maxBalance =
                            "上级代理余额为:" + res.payload.balance;
                          this.topBalance = res.payload.balance;
                        });
                        this.plus = false;
                        this.parentDisplayName =
                          "【代理】" + params.row.parentName;
                        this.fromUserId = params.row.parent;
                        this.toUser = params.row.userName;
                      }
                    }
                  },
                  "减点"
                )
              ])
            ]);
          }
        },
        {
          title: "直属代理",
          align: 'center',
          key: "parentName",
          sortable: true
        },
        {
          title: "最后登录时间",
          align: 'center',
          key: "updateAt",
          sortable: true,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.updateAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "状态",
          align: 'center',
          key: "state",
          sortable: true,
          render: (h, params) => {
            if (params.row.state == 1) {
              return h(
                "Tag",
                {
                  props: {
                    type: "border",
                    color: "green"
                  }
                },
                "正常"
              );
            } else {
              return h(
                "Tag",
                {
                  props: {
                    type: "border",
                    color: "red"
                  }
                },
                "锁定"
              );
            }
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "",
          render: (h, params) => {
            let color = "";
            let text = "";
            let state = null;
            if (params.row.state == 1) {
              text = "锁定";
              color = "#f30";
              state = 0;
            } else {
              text = "解锁";
              color = "#19be6b";
              state = 1;
            }
            return h("div", [
              h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer",
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      localStorage.setItem("playerName", params.row.userName);
                      this.$router.push({
                        name: "playDetail",
                        query: {
                          name: params.row.userName
                        }
                      });
                    }
                  }
                },
                "查看"
              ),
              h(
                "span",
                {
                  style: {
                    color: color,
                    cursor: "pointer",
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      let userId = params.row.parent;
                      this.$Modal.confirm({
                        title: "提示!",
                        content: `<p>是否${text}该玩家</p>`,
                        onOk: () => {
                          this.$store.commit("agentLoading", { params: true });
                          frozen({
                            state,
                            userName: params.row.userName
                          }).then(res => {
                            if (res.code == 0) {
                              this.$Message.success(`${text}成功`);
                              this.$store
                                .dispatch("getAgentPlayer", {
                                  fromUserId: userId
                                })
                                .finally(() => {
                                  this.$store.commit("agentLoading", {
                                    params: false
                                  });
                                });
                            }
                          });
                        }
                      });
                    }
                  }
                },
                text
              )
            ]);
          }
        }
      ]
    };
  },
  methods: {
    searchAgent() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let userId = userInfo.userId;
      let level = userInfo.level;
      let username = this.userName;
      let parent = "";
      if (level == 0) {
        parent = "01";
      } else {
        parent = userId;
      }
      let params = {
        parent,
        isTest: +this.source,
        isH5:this.isH5,
        query: { username },
        sort: "desc",
        sortkey: "createdAt"
      };
      if (level != 0) {
        params.isTest = 0;
      }
      if (!username) {
        delete params.query;
      }
      this.$store.commit("agentLoading", { params: true });
      this.$store.dispatch("getAgentList", params);
    },
    reset() {
      this.userName = "";
      if (this.permission.includes("正式数据")) {
        this.source = "0";
      }
      this.init();
    },
    selectParent(id) {
      //代理
      if (id) {
        this.disabled = false;
        agentOne(id).then(res => {
          if (res.code == 0) {
            this.gameType = res.payload.companyArr;
            this.parentBalance = res.payload.balance;
            this.pointContent = "上级代理余额为:" + res.payload.balance;
            this.parentGameList = res.payload.gameList || [];
          }
        })
      }
    },
    selectType(v) {
      if (v == 2) {
        this.defaultSn = false;
      } else {
        this.defaultSn = true;
      }
    },
    selectCompany(value) {
      /* let userId = this.agent.parent;
      if (value) {
        let params = { companyIden: value, userId };
        if (userId == "01") {
          delete params.userId;
        }
        gameBigType(params).then(res => {
          if (res.code == 0) {
            this.gameList = res.payload;
          }
        });
      } */
      this.$refs.resetSelect.clearSingleSelect()
      this.gameList = this.GameListEnum[value]
    },
    selectGame(o) {
      let parentGameList = this.parentGameList;
      let maxMix = null;
      if (this.agent.game) {
        this.selected = true;
        this.game = o.label;
        this.code = o.value;
        if (parentGameList.length > 0) {
          for (let item of parentGameList) {
            if (item.code == o.value) {
              maxMix = item.mix;
              this.tipContent = `上级游戏洗码比为:${maxMix}`;
            }
          }
        } else {
          this.tipContent = `上级游戏洗码比为:1`;
        }
      }
    },
    checkFloat(){
      this.balance = this.balance.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); 
    },
    addGame() {
      let gamelist = this.gameList;
      let gameName = this.game;
      let gameItem = {};
      let balance = this.balance;
      let parentGameList = this.parentGameList;
      let maxMix = null;
      if (parentGameList.length > 0) {
        for (let item of parentGameList) {
          if (item.code == this.code) {
            maxMix = item.mix;
          }
        }
      } else {
        maxMix = 1;
      }
      if (balance > maxMix && maxMix != null) {
        this.$Message.warning({
          content: "不能超过上级洗码比",
          duration: 2.5
        });
        return;
      }
      if (balance < 0 && maxMix != null) {
        this.$Message.warning({
          content: "不能小于0",
          duration: 2.5
        });
        return;
      }
      if (typeof(this.balance) == "string") {
        this.$Message.warning({
          content: "请输入数字",
          duration: 2.5
        });
        return;
      }
      for (let item of gamelist) {
        if (item.name == gameName) {
          gameItem = item;
        }
      }
      gameItem.mix = balance;
      if (gameItem.mix) {
        this.gameDetail.push(gameItem);
        this.gameDetail = _.uniqWith(this.gameDetail, _.isEqual);
      }
    },
    createAgent() {
      this.$refs["agentForm"].validate(valid => {
        let userInfo = JSON.parse(localStorage.getItem("userInfo"));
        let userId = userInfo.userId;
        let level = userInfo.level;
        let parent = "";
        if (level == 0) {
          parent = "01";
        } else {
          parent = userId;
        }
        let params = {
          parent,
          query: {},
          isTest: +this.source,
          sort: "desc",
          sortkey: "createdAt"
        };
        if (valid) {
          if (_.isEmpty(this.gameDetail)) {
            this.$Message.error("尚未选择游戏");
            return;
          }
          let agent = this.agent;
          this.$store.commit("agentLoading", { params: true });
          agentNew({
            sn: this.defaultSn == true ? this.parentSn : agent.sn,
            parent: agent.parent,
            username: agent.username,
            password: agent.password,
            displayName: agent.displayName,
            remark: agent.remark,
            points: agent.points,
            rate: agent.rate,
            role: "1000",
            gameList: this.gameDetail
          })
            .then(res => {
              if (res.code == 0) {
                this.$Message.success("创建成功");
                this.$store.dispatch("getAgentList", params);
                if (this.admin) {
                  agentOne(userId).then(res => {
                    if (res.code == 0) {
                      let arr = [];
                      res.payload.current = true;
                      arr.push(res.payload);
                      this.userInfo = arr;
                    }
                  });
                }
                this.resetAgent();
              }
            })
            .finally(() => {
              this.$store.commit("agentLoading", { params: false });
            });
        } else {
          this.$Message.error("请检查输入项");
        }
      });
    },
    resetAgent() {
      this.$refs["agentForm"].resetFields();
      this.parentList = [];
      this.balance = "";
      this.gameDetail = [];
      this.disabled = true;
      this.Topdisabled = false;
      this.gameList = [];
      this.selected = false;
      this.agent.game = "";
      this.agent.select = "";
      this.agentType = 1;
      this.admin = false;
      this.agent.remark = ""; 
    },
    ok() {
      //bill
      if (+this.point > +this.topBalance) {
        this.point = "";
        return this.$Message.warning("输入点数超出,请重新输入");
      }
      let parent = this.level == 0 ? "01" : localStorage.userId;
      let params = {
        parent,
        isTest: +this.source,
        query: {},
        sort: "desc",
        sortkey: "createdAt"
      };
      let userInfo = this.userInfo[0];
      let userId = localStorage.userId;
      if (this.level != 0) {
        params.isTest = 0;
      }
      if (userInfo.isTest == 1) {
        params.isTest = 1;
      }
      if (this.playerPoint == false) {
        //代理加点
        this.$store
          .dispatch("transferBill", {
            amount: this.point || 0,
            fromUserId: this.fromUserId,
            toRole: this.toRole,
            toUser: this.toUser,
            remark: this.remark
          })
          .then(() => {
            if (parent == this.parent) {
              //第一级
              setTimeout(() => {
                this.$store.dispatch("getAgentList", params);
                agentOne(userId).then(res => {
                  if (res.code == 0) {
                    let arr = [];
                    res.payload.current = true;
                    arr.push(res.payload);
                    this.userInfo = arr;
                  }
                });
                this.point = "";
                this.remark = "";
              }, 200);
            } else {
              params.parent = this.parent;
              setTimeout(() => {
                getagentList(params)
                  .then(res => {
                    let agentList = this.agentChild;
                    //更新列表
                    for (let item of agentList) {
                      if (item.id == this.parent) {
                        item.childItem = res.payload;
                      }
                    }
                    this.point = "";
                    this.remark = "";
                  })
                  .finally(() => {
                    this.$store.commit("agentLoading", { params: false });
                  });
              }, 100);
            }
          });
      } else {
        //player加点
        if (this.plus == true) {
          this.$store
            .dispatch("playAddBill", {
              amount: this.point || 0,
              fromUserId: this.fromUserId,
              remark: this.remark,
              toUser: this.toUser
            })
            .then(() => {
              this.point = "";
              this.remark = "";
              this.playerPoint = false;
              this.maxBalance = "上级代理余额为:";
            });
        } else {
          this.$store
            .dispatch("playReduceBill", {
              amount: this.point || 0,
              fromUserId: this.fromUserId,
              remark: this.remark,
              toUser: this.toUser
            })
            .then(() => {
              this.point = "";
              this.remark = "";
              this.playerPoint = false;
              this.maxBalance = "上级代理余额为:";
            });
        }
      }
    },
    cancel() {
      this.point = "";
      this.remark = "";
      this.playerPoint = false;
      this.maxBalance = "上级代理余额为:";
    },
    changeSource() {
      this.init();
      this.agentChild = [];
      this.$store.commit("changePlayer", { params: [] });
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
    async getNextAgent(showList, userId) {
      let level = this.currentLevel;
      return new Promise((resolve, reject) => {
        this.$store.commit("agentLoading", { params: true });
        this.$store
          .dispatch("getAgentNext", {
            parent: userId,
            isTest: +this.source,
            sort: "desc",
            sortkey: "createdAt",
            query: {}
          })
          .then(res => {
            let len = showList.length;
            if (len > 0) {
              while (len--) {
                if (
                  showList[len].childItem.length &&
                  showList[len].childItem[0].level >= level
                ) {
                  showList.splice(len, 1);
                }
                showList.push({
                  id: userId,
                  isTest: this.source,
                  childItem: res.payload
                });
              }
            } else {
              showList.push({
                id: userId,
                isTest: this.source,
                childItem: res.payload
              });
            }
            showList = _.uniqWith(showList, _.isEqual); //去重
            resolve(showList);
          });
      });
    },
    init() {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      let userId = userInfo.userId;
      let level = userInfo.level;
      let parent = "";
      this.agentChild = [];
      if (level == 0) {
        parent = "01";
      } else {
        parent = userId;
        this.source = 2;
        this.$store.dispatch("getAgentPlayer", {
          fromUserId: userId
        });
      }
      this.$store.commit("agentLoading", { params: true });
      agentOne(userId).then(res => {
        if (res.code == 0) {
          let arr = [];
          res.payload.current = true;
          arr.push(res.payload);
          this.userInfo = arr;
        }
      });
      let params = {
        parent,
        isTest: +this.source,
        isH5:this.isH5,
        query: {},
        sort: "desc",
        sortkey: "createdAt"
      };
      this.$store.dispatch("getAgentList", params);
    }, //添加玩家
    addPlayerConfirm() {
      this.$refs["playerForm"].validate(valid => {
        if (valid) {
          creatPlayer({
            ...this.player,
            gameList: this.playerMixClone
          }).then(res => {
            if (res.code == 0) {
              this.$Message.success("创建成功");
              this.$refs["playerForm"].resetFields();
              this.playerMix = [];
              if (this.newPlayer) {
                let userId = localStorage.userId;
                this.$store.dispatch("getAgentPlayer", {
                  fromUserId: userId
                });
                this.newPlayer = false;
              }
            }
          });
        } else {
          return this.$Message.warning("请填写完整信息");
        }
      });
    },
    cancelPlayer() {
      this.$refs["playerForm"].resetFields();
      this.playerMix = [];
      this.player.remark = "";
      this.newPlayer = false;
    },
    selectPlayerParent(id) {
      this.disabled = false;
      if (id) {
        agentOne(id).then(res => {
          if (res.code == 0) {
            this.playerMix = res.payload.gameList;
            this.parentBalance = res.payload.balance;
            this.pointContent = "上级代理余额为:" + res.payload.balance;
          }
        })
      }
    },
    changeChildType(item) {
      let isTest = item.isTest;
      let isH5=item.isH5;
      let parent = item.id;
      let params = {
        parent,
        isH5,
        isTest: +isTest,
        sort: "desc",
        sortkey: "createdAt",
        query: {}
      };
      this.$store.commit("agentLoading", { params: true });
      this.$store.dispatch("getAgentNext", params)
        .then(res => {
          let agentList = this.agentChild;
          for (let item of agentList) {
            if (item.id == parent) {
              item.childItem = res.payload;
            }
          }
        })
        .finally(() => {
          this.$store.commit("agentLoading", { params: false });
        });
    }
  },
  computed: {
    agentList() {
      return this.$store.state.agent.agentList;
    },
    level() {
      return localStorage.level;
    },
    playerList() {
      return this.$store.state.agent.playerList;
    },
    permission() {
      return (
        JSON.parse(localStorage.getItem("userInfo")).subRolePermission || []
      );
    }
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = "0";
    }
    this.init();
    if (this.permission.includes("创建代理") || this.level != 0) {
      this.createAgents = true;
    }
    if (this.permission.includes("停启用代理") || this.level != 0) {
      this.startStop = true;
    }
    if (this.level != 0) {
      this.currentPlayer = "inline";
    }
  }
};
</script>
<style lang="less" scoped>
.agetlist {
  min-height: 89vh;
  .top {
    clear: both;
    height: 48px;
    .left {
      float: left;
    }
    .search {
      float: right;
      line-height: 40px;
      padding-top: 4px;
    }
  }
  .radioGroup {
    padding-left: 20px;
  }
  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
  }

  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
}
#plusModal {
  h2 {
    margin-bottom: 22px;
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
.add {
  color: #20a0ff;
  margin-left: 15px;
  cursor: pointer;
}
</style>
