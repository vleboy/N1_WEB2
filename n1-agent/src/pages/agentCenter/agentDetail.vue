<template>
  <div class="agentDetail">
    <div class="userName">
      <span>{{$route.query.displayName }}</span>
      <span class="btns">
        <Button type="primary" class="edit" @click="reload">刷新</Button>
        <span v-if="permission.includes('编辑代理')">
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
                <FormItem label="上级">{{ agentDetail.parentDisplayName}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem label="代理ID">{{ agentDetail.displayId}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem label="代理标识">{{agentDetail.sn}}</FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem label="管理员账号">{{ agentDetail.username}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem label="上次登录IP">{{agentDetail.lastIP}}</FormItem>
              </Col>
              <Col span="8">
                <FormItem
                  label="上次登录时间"
                >{{dayjs(agentDetail.loginAt).format("YYYY-MM-DD HH:mm:ss")}}</FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
                <FormItem
                  label="创建时间"
                >{{dayjs(agentDetail.createdAt).format("YYYY-MM-DD HH:mm:ss")}}</FormItem>
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
                  <Col span="6">
                    <span v-if="showPass">{{agentDetail.password}}</span>
                    <span v-else>********</span>
                  </Col>
                  <Col span="4" v-if="permission.includes('查看密码')||level!=0">
                    <span class="showpass" @click="showPass=!showPass" v-if="!showPass">显示</span>
                    <span class="showpass" @click="showPass=!showPass" v-else>隐藏</span>
                  </Col>
                  <Col span="12" v-if="level!=0">
                    <span class="showpass" @click="editPassword" v-if="!editPass">修改密码</span>
                    <div v-else>
                      <Input v-model="basic.password" placeholder="6~16位,包含字母、数字及符号中至少两种组成"></Input>
                      <span class="showpass" @click="changeNextAgentPass">确认修改</span>
                    </div>
                  </Col>
                </FormItem>
                <FormItem label="管理员密码" prop="password" v-else>
                  <Row>
                    <Col span="10">
                      <Input v-model="basic.password" placeholder="6~16位,包含字母、数字及符号中至少两种组成"></Input>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem label="代理成数" v-if="edit">{{agentDetail.rate}}</FormItem>
                <FormItem label="代理成数" v-else prop="rate">
                  <Tooltip :content="tipContent">
                    <Input v-model="basic.rate" placeholder="0~100,不超过上级代理成数"></Input>
                  </Tooltip>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="16">
                <FormItem label="备注" v-if="edit">{{agentDetail.remark}}</FormItem>
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
                  <Select v-model="gameForm.gamelist" placeholder="请选择" @on-change="selectGame">
                    <Option
                      v-for="item in gameList"
                      :value="item.name"
                      :key="item.name"
                    >{{ item.name }}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
            <FormItem v-if="selected">
              <label slot="label">{{game}}洗码比(%)</label>
              <Row>
                <Col span="3">
                  <Tooltip :content="mixTip" placement="top">
                    <Input v-model="gameForm.balance" placeholder="0~1,不超过上级洗码比"></Input>
                  </Tooltip>
                </Col>
                <Col span="2">
                  <span class="add" @click="addGame">添加</span>
                </Col>
              </Row>
            </FormItem>
          </Form>
          <Table :columns="columns1" :data="gameDetail" width="500" class="table" size="small"></Table>
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
      <Table :columns="columns" :data="showData" size="small"></Table>
      <Page
        :total="total"
        class="page"
        show-elevator
        :page-size="pageSize"
        show-total
        @on-change="changepage"
      ></Page>
    </div>
    <div class="next">
      <h2>一级代理列表</h2>
      <Table :columns="columns2" :data="agentListOne" size="small"></Table>
    </div>
    <div class="ownedMerchant">
      <h2>直属玩家列表</h2>
      <Table :columns="columns3" :data="agentPlayerList" size="small"></Table>
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
          <Tooltip :content="tooltip" placement="top">
            <Input v-model="point" placeholder="请输入点数"></Input>
          </Tooltip>
        </Col>
      </Row>
      <Row class-name="modalrow" v-if="plus">
        <Col span="4">起始账户</Col>
        <Col span="16">
          <p>【代理】{{agentDetail.username}}</p>
        </Col>
      </Row>
      <Row class-name="modalrow" v-else>
        <Col span="4">转入账户</Col>
        <Col span="16">
          <p>【代理】{{agentDetail.username}}</p>
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
  getagentList,
  agentOne,
  playerList,
  billTransfer,
  gameBigType,
  userChangeStatus,
  agentUpdate,
  addBill,
  reduceBill
} from "@/service/index";
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import _ from "lodash";
export default {
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
      GameListEnum: {
        NA: [
          { company: "NA", code: "70000", name: "H5电子游戏" },
          { company: "NA", code: "90000", name: "H5电子游戏-无神秘奖" }
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
      parent: "",
      value: "",
      editPass: false,
      dayjs: dayjs,
      parentGame: [],
      maxMix: 0,
      edit: true, //可编辑
      game: "",
      showPass: false,
      isTest: false,
      role: "",
      mixTip: "",
      pageSize: 100, //分页
      showData: [], //分页显示的data
      isedit: true,
      spinShow: false,
      gameDetail: [],
      selected: false,
      modal: false, //加减点modal
      plus: true,
      point: "",
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
        remark: "",
        rate: ""
      },
      gameType: [],
      gameList: [], //select
      agentDetail: {},
      agentListOne: [], //代理列表
      agentPlayerList: [], //拥有玩家列表
      columns2: [
        {
          title: "序号",
          type: "index",
          maxWidth: 80
        },
        {
          title: "代理昵称",
          key: "displayName"
        },
        {
          title: "剩余点数",
          key: "balance",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.balance));
          }
        },
        {
          title: "创建时间",
          key: "",
          render: (h, params) => {
            let time = params.row.createdAt;
            return h("span", this.dayjs(time).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: "备注",
          key: "remark",
          render: (h, params) => {
            if (params.row.remark == "NULL!" || params.row.remark == null) {
              return h("span", "");
            } else {
              return h(
                "Tooltip",
                {
                  props: {
                    content: params.row.remark
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "search",
                      color: "#20a0ff"
                    }
                  })
                ]
              );
            }
          }
        },
        {
          title: "操作(对旗下代理操作)",
          key: "",
          render: (h, params) => {
            let userId = this.$route.query.userId;
            let text = "";
            let status = null;
            let color = "";
            let role = params.row.role;
            if (params.row.status == 1) {
              text = "停用";
              status = 0;
              color = "#f5141e";
            } else {
              text = "开启";
              status = 1;
              color = "#20a0ff";
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
                      this.role = "1000";
                      this.plus = true;
                      this.modal = true;
                      this.toRole = "1000";
                      this.fromUserId = this.agentDetail.userId;
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
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.role = "1000";
                      this.plus = false;
                      this.modal = true;
                      this.fromUserId = params.row.userId;
                      this.toRole = "1000";
                      this.toUser = this.agentDetail.username;
                    }
                  }
                },
                "减点"
              ),
              h(
                "span",
                {
                  style: {
                    color: color,
                    cursor: "pointer"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示!",
                        content: `<p>是否${text}代理</p>`,
                        onOk: () => {
                          userChangeStatus({
                            role,
                            status,
                            userId: params.row.userId
                          }).then(res => {
                            if (res.code == 0) {
                              this.$Message.success(`${text}成功`);
                              getagentList({
                                parent: userId,
                                query: {},
                                sortkey: "createdAt",
                                sort: "desc"
                              }).then(res => {
                                if (res.code == 0) {
                                  this.agentListOne = res.payload;
                                }
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
      ],
      columns3: [
        {
          title: "序号",
          type: "index",
          maxWidth: 80
        },
        {
          title: "用户名",
          key: "userName"
        },
        {
          title: "玩家昵称",
          key: "nickname",
          render: (h, params) => {
            let nick = params.row.nickname;
            return h("span", nick == "NULL!" ? "" : nick);
          }
        },
        {
          title: "剩余点数",
          key: "balance",
          render: (h, params) => {
            return h("span", thousandFormatter(params.row.balance));
          }
        },
        {
          title: "创建时间",
          key: "",
          render: (h, params) => {
            let time = params.row.createdAt;
            return h("span", this.dayjs(time).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: "操作(对直属玩家操作)",
          key: "",
          render: (h, params) => {
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
                      this.role = "10000";
                      this.plus = true;
                      this.modal = true;
                      this.fromUserId = this.agentDetail.userId;
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
                    marginRight: "10px"
                  },
                  on: {
                    click: () => {
                      this.role = "10000";
                      this.plus = false;
                      this.modal = true;
                      this.fromUserId = params.row.userId;
                      this.fromUserId = this.agentDetail.userId;
                      this.toUser = params.row.userName;
                    }
                  }
                },
                "减点"
              )
            ]);
          }
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
          key: "createdAt",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              this.dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "交易对象",
          key: "toUser",
          minWidth: 120,
          render: (h, params) => {
            let row = params.row;
            if (row.fromLevel > row.toLevel) {
              return h(
                "span",
                row.toDisplayName + " 对 " + row.fromDisplayName
              );
            } else {
              return h(
                "span",
                row.fromDisplayName + " 对 " + row.toDisplayName
              );
            }
          }
        },
        {
          title: "交易类型",
          key: "action",
          render: (h, params) => {
            let row = params.row;
            if (row.fromLevel > row.toLevel) {
              return h("span", "减点");
            } else {
              return h("span", "加点");
            }
          }
        },
        {
          title: "交易前余额",
          key: "oldBalance"
        },
        {
          title: "交易点数",
          key: "amount",
          render: (h, params) => {
            let color = params.row.amount < 0 ? "#f30" : "#0c0";
            return h(
              "span",
              {
                style: {
                  color: color
                }
              },
              params.row.amount
            );
          }
        },
        {
          title: "交易后余额",
          key: "balance"
        },
        {
          title: "操作人",
          key: "operator",
          render: (h, params) => {
            return h("span", params.row.operator);
          }
        },
        {
          title: "备注",
          key: "remark",
          maxWidth: 80,
          render: (h, params) => {
            if (params.row.remark == "NULL!" || params.row.remark == null) {
              return h("span", "");
            } else {
              return h(
                "Tooltip",
                {
                  props: {
                    content: params.row.remark
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "search",
                      color: "#20a0ff"
                    }
                  })
                ]
              );
            }
          }
        }
      ],
      waterfall: []
    };
  },
  created() {
    this.init();
  },
  computed: {
    total() {
      return this.waterfall.length;
    },
    level() {
      return JSON.parse(localStorage.getItem("userInfo")).level;
    },
    tipContent() {
      return "上级代理成数为" + this.agentDetail.rate;
    },
    tooltip() {
      return "上级代理点数为" + this.agentDetail.balance;
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission || [];
    }
  },
  watch: {
    $route(to, from) {
      if (to.name == "agentDetail") {
        this.init();
      }
    }
  },
  methods: {
    async getWaterfallList() {
      let userId = this.$route.query.userId;
      let req1 = getWaterfall(userId);
      this.spinShow = true;
      let waterfall = await this.axios.all([req1]);
      this.spinShow = false;
      /* if (waterfall && waterfall.code == 0) {
        this.waterfall = waterfall.payload;
        console.log(this.waterfall);
      } */
      //console.log(waterfall[0].payload);

      this.showData = waterfall[0].payload;
    },
    handlePage() {
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.total < this.pageSize) {
        this.showData = this.waterfall;
      } else {
        this.showData = this.waterfall.slice(0, this.pageSize);
      }
    },
    changepage(index) {
      let size = this.pageSize;
      let _start = (index - 1) * size;
      let _end = index * size;
      this.showData = this.waterfall.slice(_start, _end);
      // console.log(this.showData);
    },
    changeNextAgentPass() {
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
      let params = this.agentDetail;
      params.password = password;
      this.spinShow = true;
      agentUpdate(params).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
          this.basic.password = "";
          this.editPass = false;
        } else {
          this.$Message.error("修改有误");
          this.resetPass();
        }
        this.spinShow = false;
      });
    },
    editPassword() {
      this.editPass = !this.editPass;
      this.showPass = true;
    },
    editBtn() {
      this.edit = false;
      this.isedit = false;
      this.value = ["2", "3"];
      this.basic.password = this.agentDetail.password;
      this.basic.remark = this.agentDetail.remark;
      this.basic.rate = this.agentDetail.rate;
      //重置game
      this.gameForm.gameType = "";
      this.gameForm.gamelist = "";
      this.gameList = [];
      this.selected = false;
      this.gameForm.balance = "";
    },
    reload() {
      this.init();
    },
    ok() {
      let userId = this.$route.query.userId;
      this.spinShow = true;
      if (this.role == "1000") {
        billTransfer({
          fromUserId: this.fromUserId,
          toRole: this.toRole,
          toUser: this.toUser,
          amount: this.point,
          remark: this.note
        }).then(res => {
          if (res.code == 0) {
            this.$Message.success("操作成功");
            this.note = "";
            this.point = "";
            getagentList({
              parent: userId,
              query: {},
              sortkey: "createdAt",
              sort: "desc"
            }).then(res => {
              if (res.code == 0) {
                this.agentListOne = res.payload;
                this.spinShow = false;
              }
            });
          } else {
            this.spinShow = false;
          }
        });
      } else {
        let params = {
          amount: this.point,
          ramark: this.note,
          fromUserId: this.fromUserId,
          toUser: this.toUser
        };
        if (this.plus == true) {
          addBill(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.note = "";
              this.point = "";
              playerList({ fromUserId: userId }).then(res => {
                if (res.code == 0) {
                  this.agentPlayerList = res.list;
                  this.spinShow = false;
                }
              });
            } else {
              this.spinShow = false;
            }
          });
        } else {
          reduceBill(params).then(res => {
            if (res.code == 0) {
              this.$Message.success("操作成功");
              this.note = "";
              this.point = "";
              playerList({ fromUserId: userId }).then(res => {
                if (res.code == 0) {
                  this.agentPlayerList = res.list;
                  this.spinShow = false;
                }
              });
            } else {
              this.spinShow = false;
            }
          });
        }
      }
    },
    cancel() {
      this.note = "";
      this.point = "";
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
      // else {
      //   let testReg = /^[a-zA-Z0-9@_#$%^&*!.~-]{6,16}$/;
      //   if (!testReg.test(password)) {
      //     this.$Message.warning("密码为6~16位,包含字母、数字及符号");
      //     return;
      //   }
      // }
      this.edit = true;
      this.isedit = true;
      let params = this.agentDetail;
      params.password = password;
      params.remark = this.basic.remark;
      params.gameList = this.gameDetail;
      params.rate = this.basic.rate;
      params.isTest = this.isTest == true ? 1 : 0;
      this.spinShow = true;
      if (_.isEmpty(params.gameList)) {
        this.$Message.success("尚未选择游戏");
        this.spinShow = false;
        return;
      }
      agentUpdate(params).then(res => {
        if (res.code == 0) {
          this.$Message.success("修改成功");
        } else {
          this.$Message.error("修改有误");
          this.resetPass();
        }
        this.spinShow = false;
      });
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
      this.gameList = this.GameListEnum[value]
    },
    selectGame(value) {
      this.selected = true;
      this.game = value;
      let mix = 0;
      let parentGame = this.parentGame;
      if (parentGame.length > 0) {
        for (let item of parentGame) {
          if (item.name == value) {
            mix = item.mix;
            this.maxMix = mix;
          }
        }
      } else {
        mix = 1;
        this.maxMix = mix;
      }
      this.mixTip = `该上级代理${value}洗码比为${mix}%`;
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
      let balance = parseFloat(this.gameForm.balance);
      let oldGame = this.gameDetail;
      for (let item of oldGame) {
        if (item.name == gameName) {
          this.$Message.warning("已选择该游戏");
          return;
        }
      }
      if (balance <= 1 && balance <= this.maxMix) {
        gameItem.mix = this.gameForm.balance;
      } else {
        return this.$Message.warning("洗码比为0-1数字,且不超过上级游戏洗码比");
      }
      this.gameDetail.push(gameItem);
      this.gameDetail = _.uniqWith(this.gameDetail, _.isEqual);
    }, //生成密码
    resetPass() {
      let userId = this.$route.query.userId;
      agentOne(userId).then(res => {
        this.agentDetail = res.payload;
        this.isTest = res.payload.isTest == 1 ? true : false;
        this.gameDetail = res.payload.gameList;
      });
    },
    async init() {
      this.spinShow = true;
      let userId = this.$route.query.userId;
      let parent = this.$route.query.parent;
      this.parent = parent;
      this.userId = userId;
      this.edit = true;
      this.isedit = true;
      //let req1 = getWaterfall(userId);
      let req2 = agentOne(userId);
      let req3 = getagentList({
        parent: userId,
        query: {},
        sortkey: "createdAt",
        sort: "desc"
      }); //线路商
      let req4 = playerList({ fromUserId: userId }); //商户
      let [
        agentInfo,
        agentChild,
        agentPlayer
      ] = await this.axios.all([req2, req3, req4]);
      this.spinShow = false;
      if (agentInfo && agentInfo.code == 0) {
        this.agentDetail = agentInfo.payload;
        this.isTest = agentInfo.payload.isTest == 1 ? true : false;
        this.gameDetail = agentInfo.payload.gameList;
      }
      if (agentChild && agentChild.code == 0) {
        this.agentListOne = agentChild.payload;
      }
      if (agentPlayer && agentPlayer.code == 0) {
        this.agentPlayerList = agentPlayer.list;
      }
      agentOne(parent).then(res => {
        if (res.code == 0) {
          this.parentGame = res.payload.gameList || [];
          this.gameType = res.payload.companyArr;
        }
      });
      this.handlePage();

      console.log(this.agentDetail);
      

    }
  }
};
</script>
<style lang="less" scoped>
.agentDetail {
  min-height: 89vh;
  .showpass {
    margin-left: 0.5rem;
    color: #20a0ff;
    display: inline-block;
    // font-size: 1rem;
    font-weight: normal;
    cursor: pointer;
  }
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

