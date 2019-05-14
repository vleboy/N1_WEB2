<template>
  <div class="line">
    <div class="search">
      <Row class="row">
        <Col span="2" offset="4">线路商标识</Col>
        <Col span="4">
        <Input v-model="suffix" placeholder="请输入"></Input>
        </Col>
        <Col span="2">线路商昵称</Col>
        <Col span="4">
        <Input v-model="displayName" placeholder="请输入"></Input>
        </Col>
        <Col span="5">
        <div class="btns">
          <Button type="primary" @click="init">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
        </Col>
      </Row>
    </div>
    <div class="option">
      <p class="create">
        <Button type="primary" @click="createLine" v-if="permission.includes('创建线路商')">创建线路商</Button>
         <span :style="{paddingLeft:'10px'}">H5接线</span>
        <i-switch v-model="isH5" @on-change="init"></i-switch>
        <RadioGroup v-model="source" class="radioGroup" type="button" @on-change='init'>
          <Radio label="0" v-if="permission.includes('正式数据')">正式</Radio>
          <Radio label="1">测试</Radio>
          <Radio label="2" v-if="permission.includes('正式数据')">全部</Radio>
        </RadioGroup>
      </p>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="showData" size="small"></Table>
      <!-- <Page :total="total" class="page" show-elevator :page-size='50' show-total @on-change="changepage"></Page> -->
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
        <Tooltip :content="tooltip" @on-popper-show="focus" placement="top" :disabled='disabled'>
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
import dayjs from "dayjs";
import { thousandFormatter } from "@/config/format";
import { userChangeStatus } from "@/service/index";
export default {
  data() {
    return {
      isH5:true,
      uname: "", //modal增加账户
      point: "", //点数
      note: "", //备注
      options: [], //select
      plus: null, //加点
      modal: false, //加点弹窗
      select: "", //加点select
      fromUserId: "", //id
      toRole: " ",
      source: "1",
      toUser: "",
      displayName: "",
      stopManager:false,
      goManager:false,
      suffix: "", //前缀
      disabled: true, //加点禁用
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 40,
          align: 'center'
        },
        {
          title: "线路商标识",
          key: "suffix",
          sortable: true,
          align: 'center'
        },
        {
          title: "线路商昵称",
          key: "displayName",
          sortable: true,
          align: 'center',
        },
        {
          title: "上级线路商",
          key: "parentDisplayName",
          sortable: true,
          align: 'center',
        },
        {
          title:'商户数量',
          key:'merchantCount',
          align: 'center',
  
          render: (h, params) => {
            console.log(params);
            
            return h(
              'Tooltip',
              {
                style: {
                  color: "#20a0ff",
                  cursor:'pointer'
                },
                props: {
                  content: "前往商户列表",
                  placement: "top"
                },
              },
              [
                h('span',{
                  on: {
                  click: () => {
                     this.$router.push({name: "merchantList",query:{suffix:params.row.suffix}})
                     localStorage.setItem('merchantList','merchantList')
                  }
                }
                },params.row.merchantCount)
              ]
              )
          }
        },
        {
          title: "剩余点数",
          key: "balance",
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let admininfo = JSON.parse(localStorage.getItem("userInfo"));
            let admin = admininfo.uname;
            let adminId = admininfo.userId;
            let userName = admininfo.username;
            let permission = this.permission;
            if (permission.includes("线路商加减点")) {
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
                          this.disabled = true;
                          this.uname = params.row.uname;
                          let option = [
                            {
                              value: adminId,
                              label: "【管理员】" + admin
                            }
                          ];
                          if (params.row.parent != "01") {
                            let another = {
                              value: params.row.parent,
                              label: "【线路商】" + params.row.parentDisplayName
                            };
                            option.push(another);
                          }
                          this.options = option;
                          this.toRole = "10";
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
                          this.plus = false;
                          this.modal = true;
                          this.disabled = true;
                          this.uname = params.row.uname;
                          let option = [
                            {
                              value: adminId,
                              label: "【管理员】" + admin,
                              role: "1",
                              userName: userName
                            }
                          ];
                          this.$store.commit('updateBill',{params:params.row.balance})
                          if (params.row.parent != "01") {
                            let another = {
                              value: params.row.parent,
                              label:
                                "【线路商】" + params.row.parentDisplayName,
                              role: params.row.parentRole,
                              userName: params.row.parentName
                            };
                            option.push(another);
                          }
                          this.options = option;
                          this.fromUserId = params.row.userId;
                        }
                      }
                    },
                    "减点"
                  )
                ])
              ]);
            } else {
              return h("p", params.row.balance.toFixed(2));
            }
          }
        },
        {
          title: "线路商游戏",
          key: "gameList",
          align: 'center',
          render: (h, params) => {
            let column = [
              {
                title: "线路商游戏",
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
                        let username = params.row.username;
                        let parent = params.row.parent;
                        this.$router.push({
                          path: "/dealerDetail",
                          query: {
                            userId,
                            displayName,
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
                      display: this.stopManager ? "inline" : "none"
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: "提示!",
                          content: `<p>是否${text}线路商</p>`,
                          onOk: () => {
                            userChangeStatus({
                              role: "10",
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
                      color: '#20a0ff',
                      display: this.goManager ? "inline" : "none"
                    },
                    on:{
                      click:()=>{
                        let url=process.env.NODE_ENV == 'production'?'http://xl.na12345.com/#/login':'http://dev-manager.na12345.com/#/login';
                        //http://localhost:8080   http://dev-merchant.na12345.com/#/login
                        let uname=params.row.uname;
                        let suffix=params.row.suffix;
                        url=url+'?uname='+uname+'&suffix='+suffix;
                        window.open(url)
                      }
                    }
                  },
                  '前往线路商系统'
                )
              ]);
          }
        }
      ]
    };
  },
  methods: {
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
      // console.log(this.toRole, this.select);
      this.$store.commit('changeLoading',{params:true})
      await this.$store.dispatch("transferBill", {
          fromUserId: this.fromUserId,
          toRole: this.toRole,
          toUser: this.toUser,
          amount: this.point||0,
          remark: this.note
        })
        setTimeout(()=>{
          this.init()
        },200)
        this.select = "";
        this.note = "";
        this.point = "";
      
    },
    cancel() {
      this.select = "";
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
    async changeOption(id) {
      if(this.plus){
        if (id) {
          await this.$store.dispatch("otherBill", id);
           this.disabled = false;
        }
      }else{
          this.disabled = false;  
      }
    },
    focus() {
      this.tooltip = "起始账户余额为" + this.$store.state.merchants.bill;
    },
    createLine() {
      this.$router.push({ name: "addManager" });
    },
    reset() {
      this.suffix = "";
      this.displayName = "";
      if (this.permission.includes("正式数据")) {
        this.source = '0';
      }
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
        isTest: +this.source,
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
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    },
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = '0';
    }
    if (this.permission.includes("停启用线路商")) {
       this.stopManager = true;
    }
    if (this.permission.includes("前往线路商系统")) {
      this.goManager = true;
    }
    this.init();
  },
  watch: {
    $route(to, from) {
      if (from.name == "addManager") {
        if (this.permission.includes("正式数据")) {
          this.source = '0';
        }
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.line {
  min-height: 89vh;
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
}
.radioGroup {
  padding-left: 20px;
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
</style>
