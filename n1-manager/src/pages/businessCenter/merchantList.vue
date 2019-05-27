<template>
  <div class="business">
    <div class="search">
      <Row class="row">
        <Col span="2" offset="4">商户标识</Col>
        <Col span="4">
        <Input v-model="sn" placeholder="请输入"></Input>
        </Col>
        <Col span="2">商户ID</Col>
        <Col span="4">
        <Input v-model="displayId" placeholder="请输入"></Input>
        </Col>
        <Col span="5">
        <div class="btns">
          <Button type="primary" @click="init">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
        </Col>
      </Row>
      <Row class="row">
        <Col span="2" offset="4">商户昵称</Col>
        <Col span="4">
        <Input v-model="displayName" placeholder="请输入"></Input>
        </Col>
        <Col span="2" >上级标识</Col>
        <Col span="4">
        <Input v-model="supSuffix" placeholder="请输入"></Input>
        </Col>
      </Row>
    </div>
    <div class="option">
      <span>H5接线</span>
      <i-switch v-model="isH5" @on-change="init"></i-switch>
      <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init'>
        <Radio label="正式"></Radio>
        <Radio label="测试"></Radio>
        <Radio label="全部"></Radio>
      </RadioGroup>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="showData" size="small"></Table>
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
          key: "parentDisplayName",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            //console.log(params);
            
            return h(
              "span",
               `${params.row.parentDisplayName}(${params.row.parentSuffix})` 
              )
          }
        },
        {
          title:'玩家数量',
          key:'playerCount',
          align: 'center',
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: "#20a0ff",
                  cursor:'pointer'
                },
                on: {
                  click: () => {
                     this.$router.push({name: "playList",query:{sn:params.row.sn}})
                     localStorage.setItem('playList','playList')
                  }
                }
              },
              params.row.playerCount)
          }
        },
        {
          title: "剩余点数",
          key: "balance",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let adminId = localStorage.loginId;
            return h("div", [
              h("p", thousandFormatter(params.row.balance.toFixed(2))),
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
                        this.plus = true;
                        this.modal = true;
                        this.uname = params.row.uname;
                        this.fromUserId = adminId;
                        this.toUser = params.row.username;
                        this.toRole = "100";
                        getBill(adminId).then(res => {
                          this.tooltip = "起始账户余额为" + res.payload.balance;
                        });
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
                        let userName = JSON.parse(localStorage.userInfo)
                          .username;
                        this.plus = false;
                        this.modal = true;
                        this.uname = params.row.uname;
                        this.toRole = "10";
                        this.toUser = userName;
                        this.fromUserId = params.row.userId;
                        this.tooltip = "起始账户余额为" + params.row.balance;
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
          title: "商户游戏",
          key: "",
          align: 'center',
          render: (h, params) => {
            let column = [
              {
                title: "商户游戏",
                key: "name"
              },
              {
                title: "商户占成",
                key: "rate"
              }
            ];
            let data = [];
            let gameList = params.row.gameList;
            let len = gameList.length;
            for (let item of gameList) {
              let obj = {};
              obj.rate = item.rate + "%";
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
        },
        {
          title: "创建时间",
          key: "createdAt",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "最后登录时间",
          key: "loginAt",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.loginAt).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "状态",
          key: "status",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            if (params.row.status == 1) {
              return h(
                "span",
                {
                  style: {
                    color: "#20a0ff"
                  }
                },
                "已启用"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#f5141e"
                  }
                },
                "未启用"
              );
            }
          }
        },
        /* {
          title: "备注",
          key: "remark",
          width:50,
          render: (h, params) => {
            let remark = params.row.remark;
            let result = Object.prototype.toString.call(remark);
            if (result.includes("String")) {
              if (remark != "NULL!") {
                return h(
                  "Tooltip",
                  {
                    props: {
                      content: remark
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
              } else {
                return h("span", "");
              }
            } else {
              return h("span", "");
            }
          }
        }, */
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            let text = "";
            let status = null;
            let color = "";
            if (params.row.status == 1) {
              text = "停用";
              status = 0;
              color = "#f5141e";
            } else {
              text = "启用";
              status = 1;
              color = "#20a0ff";
            }
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    color: "#20a0ff"
                  },
                  on: {
                    click: () => {
                      let userId = params.row.userId;
                      let displayName = params.row.displayName;
                      let parent = params.row.parent;
                      let username = params.row.username;
                      let parentDisplayName = params.row.parentDisplayName;
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
                    color: color
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: "提示!",
                        content: `<p>是否${text}商户</p>`,
                        onOk: () => {
                          userChangeStatus({
                            role: "100",
                            status,
                            userId: params.row.userId
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
.option {
  padding-bottom: 10px;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
/deep/ .ivu-table-cell {
  padding: 0
}   
</style>
