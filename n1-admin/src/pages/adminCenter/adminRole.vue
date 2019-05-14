<template>
  <div class="adminrole">
    <p class="create">
      <Button type="primary" @click="addRole">创建新角色</Button>
      <Button type="primary" class="searchbtn" @click="reset">刷新</Button>
    </p>
    <Table :columns="columns" :data="subRoleList" size="small"></Table>
    <Modal v-model="modal" :width='600' @on-ok="ok" :scrollable='true'>
      <section class="createSection">
        <h2 slot="title">编辑角色</h2>
        <Form ref='createRole' :model="admin" :label-width="80">
          <FormItem label="角色名称" prop="name">
            <Row>
              <Col span="20">
              <Input v-model="admin.name" disabled placeholder="角色名称"></Input>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="角色权限" prop="authority">
            <Row>
              <Col span="20">
              <Tree :data="treeData" show-checkbox ref='tree'></Tree>
              </Col>
            </Row>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Row>
              <Col span="20">
              <Input v-model="admin.remark" :maxlength='200' type="textarea" class="remark" :rows="4" placeholder="请输入备注(如没有可不填),最多不超过200个字符"></Input>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </section>
    </Modal>
    <Spin size="large" fix v-if="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import _ from "lodash";
import { getsbuRole, subRoleDelete, subRoleUpdate } from "@/service/index";
export default {
  data() {
    const oldTree = [
      {
        title: "所有权限",
        expand: true,
        checked: false,
        children: [
          /* {
            title: "看板",
            checked: false
          }, */
          {
            title: "数据看板",
            checked: false
          },
          {
            title: "个人中心",
            checked: false
          },
          {
            title: "输赢报表",
            expand: true,
            checked: false,
            children: [
              {
                title: "公司输赢总报表",
                checked: false
              },
              {
                title: "玩家输赢报表",
                checked: false
              },
              {
                title: "NA游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "NA游戏总报表",
                    checked: false
                  },
                  /* {
                    title: "NA电子游戏报表",
                    checked: false
                  },
                  {
                    title: "NA街机游戏报表",
                    checked: false
                  },
                  {
                    title: "NA棋牌游戏报表",
                    checked: false
                  }, */
                  {
                    title: "NA电子H5报表",
                    checked: false
                  },
                  {
                    title: "NA电子H5无神秘奖报表",
                    checked: false
                  }/* ,
                   {
                    title: "NA真人h5报表",
                    checked: false
                  },
                  {
                    title: "NA真人游戏报表",
                    checked: false
                  }, {
                    title: "NA捕鱼游戏报表",
                    checked: false
                  } */
                ]
              },
              {
                title: "KY游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "KY棋牌游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "TTG游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "TTG电子游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "SA游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "SA游戏总报表",
                    checked: false
                  },
                  {
                    title: "SA真人游戏报表",
                    checked: false
                  },
                  {
                    title: "SA捕鱼游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "SB游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "SB游戏总报表",
                    checked: false
                  },
                  {
                    title: "SB真人游戏报表",
                    checked: false
                  },
                  {
                    title: "SB电子游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "MG游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "MG电子游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "AG游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "AG真人游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "YSB游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "YSB体育游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "RTG游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "RTG电子游戏报表",
                    checked: false
                  }
                ]
              },
               {
                title: "DT游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "DT电子游戏报表",
                    checked: false
                  }
                ]
              },
              {
                title: "PP游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "PP电子游戏报表",
                    checked: false
                  }
                ]
              },
               {
                title: "PG游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "PG电子游戏报表",
                    checked: false
                  }
                ]
              },
               {
                title: "HABA游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "HABA电子游戏报表",
                    checked: false
                  }
                ]
              },
               {
                title: "PNG游戏报表",
                expand: true,
                checked: false,
                children: [
                  {
                    title: "PNG电子游戏报表",
                    checked: false
                  }
                ]
              }
            ]
          },
          {
            title: "日报表",
            checked: false,
            children:[
              {
                title: "公司日报表",
                checked: false
              },
              {
                title: "商户日报表",
                checked: false
              },
              {
                title: "线路商日报表",
                checked: false
              },
              {
                title: "玩家日报表",
                checked: false
              }
            ]
          },
          {
            title: "商户中心",
            expand: true,
            checked: false,
            children: [
              {
                title: "线路商列表",
                checked: false
              },
              {
                title:'停启用线路商',
                checked:false
              },
               {
                title:'前往线路商系统',
                checked:false
              },
              {
                title: "线路商加减点",
                checked: false
              },
              {
                title: "创建线路商",
                checked: false
              },
              {
                title: "商户列表",
                checked: false
              },
              {
                title:'停启用商户',
                checked:false
              },
                {
                title:'前往商户系统',
                checked:false
              },
              {
                title: "商户加减点",
                checked: false
              },
              {
                title: "创建商户",
                checked: false
              },
              {
                title: "编辑",
                checked: false
              },
              {
                title: "接入商点数警告列表",
                checked: false
              },
              {
                title: "接入商停启用",
                checked: false
              },
              {
                title: "设定接入商告警上限",
                checked: false
              }
            ]
          },
          {
            title: "管理员中心",
            checked: false,
            expand: true,
            children: [
              {
                title: "管理员列表",
                checked: false
              },
              {
                title: "管理员角色列表",
                checked: false
              }
            ]
          },
          {
            title: "玩家中心",
            expand: true,
            checked: false,
            children: [
              {
                title: "玩家列表",
                checked: false
              }
            ]
          },
          {
            title: "日志中心",
            expand: true,
            checked: false,
            children: [
              {
                title: "登录日志",
                checked: false
              },
              {
                title: "操作日志",
                checked: false
              },
              {
                title: "DEBUG日志",
                checked: false
              }
            ]
          },
          {
            title: "运营中心",
            expand: true,
            checked: false,
            children: [
              {
                title: "神秘大奖",
                checked: false
              },
              {
                title: "电子游戏配置",
                checked: false
              },
              {
                 title: "游戏管理",
                checked: false
              }
            ]
          },
          {
            title: "免转中心",
            expand: true,
            checked: false,
            children: [
              {
                title: "流水交易",
                checked: false
              },
            ]
          },
          {
            title: "数据权限",
            expand: true,
            checked: false,
            children: [
              {
                title: "正式数据",
                checked: false
              },
              {
                title: "查看密码",
                checked: false
              },
              {
                title: "商户密匙",
                checked: false
              },
            ]
          },
        ]
      }
    ];
    return {
      spinShow: false,
      modal: false,
      subRoleList: [],
      admin: {
        remark: "",
        name: ""
      },
      columns: [
        {
          title: "序号",
          type: "index",
          align: 'center',
        },
        {
          title: "角色名",
          key: "name",
          sortable:true,
          align: 'center',
        },
        {
          title: "权限",
          key: "",
          align: 'center',
          render: (h, params) => {
            let tags = params.row.permissions;
            return h(
              "Tooltip",
              {
                props: {
                  placement: 'bottom-start'
                }
              },
              //`${params.row.permissions.length}项权限`
              [
                h('div',`${params.row.permissions.length}项权限`),
                /* params.row.permissions.map(
                  item => {
                    return h('span',{slot:'content',props:{maxWidth:10}},item)
                  }
                ) */
                h('div',{slot:'content'},[
                   params.row.permissions.map(
                  item => {
                    return h('p',{slot:'content',props:{maxWidth:10}},item)
                  }
                )
                ])
              ]
            );
          }
        },
        {
          title: "创建时间",
          key: "createdAt",
          align: 'center',
          sortable:true,
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD")
            );
          }
        },
        {
          title: "备注",
          key: "",
          align: 'center',
         
          render: (h, params) => {
            let remark = params.row.remark;
            let result = Object.prototype.toString.call(remark);
            if (result.includes("String")) {
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
          }
        },
        {
          title: "操作",
          key: "",
          maxWidth: 120,
          render: (h, params) => {
            return h("p", [
              h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer",
                    paddingRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.admin.name = params.row.name;
                      this.admin.remark = params.row.remark;
                      let permissions = params.row.permissions;
                      this.treeData = _.cloneDeep(oldTree);
                      let tree = this.treeData[0];
                      let second = tree.children;
                      for (let item of second) {
                        if (permissions.includes(item.title)) {
                          item.checked = true;
                        }
                        if (item.children) {
                          let third = item.children;
                          for (let thirdItem of third) {
                            if (permissions.includes(thirdItem.title)) {
                              thirdItem.checked = true;
                            }
                            if (thirdItem.children) {
                              let four = thirdItem.children;
                              for (let fourItem of four) {
                                if (permissions.includes(fourItem.title)) {
                                  fourItem.checked = true;
                                }
                              }
                            }
                          }
                        }
                      }
                      this.modal = true;
                    }
                  }
                },
                "编辑"
              ),
              h("span", "|"),
              h(
                "span",
                {
                  style: {
                    color: "#20a0ff",
                    cursor: "pointer",
                    paddingLeft: "5px"
                  },
                  on: {
                    click: () => {
                      let name = params.row.name;
                      this.$Modal.confirm({
                        title: "提示",
                        content: "<p>此操作将永久删除该角色, 是否继续?</p>",
                        onOk: () => {
                          subRoleDelete({ name: name }).then(res => {
                            if (res.code == 0) {
                              this.init();
                            }
                          });
                        }
                      });
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      treeData: oldTree
    };
  },
  methods: {
    addRole() {
      this.$router.push({ name: "createRole" });
    },
    ok() {
      let trees = this.$refs.tree.getCheckedNodes();
      let permissions = [];
      for (let item of trees) {
        permissions.push(item.title);
      }
      subRoleUpdate({
        ...this.admin,
        permissions
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("保存成功");
          this.init();
        }
      });
    },
    reset() {
      this.init();
    },
    init() {
      this.spinShow = true;
      getsbuRole().then(res => {
        if (res.code == 0) {
          this.subRoleList = res.payload.Items;
          this.spinShow = false;
        }
      });
    }
  },
  created() {
    this.init();
  },
  watch: {
    $route(to, from) {
      if (from.name == "createRole") {
        this.init();
      }
    }
  }
};
</script>
<style lang="less" scoped>
.adminrole {
  min-height: 89vh;
  .create {
    margin-bottom: 16px;
  }
  .searchbtn {
    float: right;
    margin-right: 10px;
  }
}
.createSection {
  width: 40rem;
  margin: 0 auto;
  .remark {
    width: 21rem;
  }
  .btn {
    margin-left: 60px;
    .reset {
      margin-left: 100px;
    }
  }
}


/deep/ .ivu-tooltip-popper {
          background: #495060;
        .ivu-tooltip-content {
          background: #495060;
        }
        .ivu-tooltip-inner {
          div {
            display: flex;
            justify-content: space-between;
             flex-direction: row;
            flex-wrap: wrap;
            p {

              color:#fff;
              margin-right: 1rem;
            }
          }
          }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
