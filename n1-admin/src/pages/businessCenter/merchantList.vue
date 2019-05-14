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
     <!--    <Col span="2" offset="4">商户账号</Col>
        <Col span="4">
        <Input v-model="username" placeholder="请输入"></Input>
        </Col> -->
        <Col span="2" offset="4">商户昵称</Col>
        <Col span="4">
        <Input v-model="displayName" placeholder="请输入"></Input>
        </Col>
        <Col span="2">上级标识</Col>
        <Col span="4">
        <Input v-model="supSuffix" placeholder="请输入"></Input>
        </Col>
      </Row>
    </div>
    <div class="option">
      <p class="create">
        <Button type="primary" @click="addMerchant" v-if="permission.includes('创建商户')">创建商户</Button>
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
        <p v-else>【商户】{{uname}}</p>
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
import { userChangeStatus } from "@/service/index";
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
      if (localStorage.merchantList == 'merchantList') {
        vm.supSuffix = vm.$route.query.suffix;
        vm.displayId = vm.$route.query.buId;
        vm.init()
      }

    });
  },
  data() {
    return {
      sn: "", //标识
      isH5:true,
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
      stopMerchant:false,
      goMerchant:false,
      disabled: true, //加点禁用
      tooltip: "起始账户余额为", //tooltip content
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth:40
        },
        {
          title: "商户ID",
          key: "displayId",
          sortable: true,
          align: 'center',
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
          align: 'center',
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
              "Tooltip",
              {
                style: {
                  color: "#20a0ff",
                  cursor:'pointer'
                },
                props: {
                  content: "前往玩家列表",
                  placement: "top"
                },
                
              },
              [h('span',{
                on: {
                  click: () => {
                     this.$router.push({name: "playList",query:{sn:params.row.sn}})
                     localStorage.setItem('playList','playList')
                  }
                }
              },params.row.playerCount)]
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
            if (permission.includes("商户加减点")) {
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
                          this.toRole = "100";
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
          title: "商户游戏",
          key: "",
          align: 'center',
          render: (h, params) => {
            //console.log(params);
            
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
                      color: color,
                      display: this.stopMerchant ? "inline" : "none"
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
                      display: this.goMerchant ? "inline" : "none"
                    },
                    on:{
                      click:()=>{
                        let url=process.env.NODE_ENV == 'production'?'http://sh.na12345.com/#/login':'http://dev-merchant.na12345.com/#/login';
                        //http://localhost:8080   http://dev-merchant.na12345.com/#/login
                        let uname=params.row.uname;
                        let sn=params.row.sn;
                        url=url+'?uname='+uname+'&sn='+sn;
                        window.open(url)
                      }
                    }
                  },
                  '前往商户系统'
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
    addMerchant() {
      this.$router.push({ name: "addMerchant" });
    },
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
      this.$store.commit('changeLoading',{params:true})
      await this.$store.dispatch("transferBussnessBill", {
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
    reset() {
      this.sn = "";
      this.displayName = "";
      this.displayId = "";
      this.msn = "";
      this.supSuffix = '';
      if (this.permission.includes("正式数据")) {
        this.source = '0';
      }
      this.init();
    },
    init() {
      console.log(this.supSuffix);
      
      if (this.$route.name == 'merchantList' && localStorage.merchantList == 'merchantList') {
        localStorage.removeItem('merchantList')
      }
       let query = {
        sn: this.suffix,
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
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    },
  },
  created() {
    if (this.permission.includes("正式数据")) {
      this.source = '0';
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
          this.source = '0';
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
  padding: 0
}  
</style>
