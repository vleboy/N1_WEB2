<template>
  <div class="createRole">
    <section class="create">
      <h2>创建角色</h2>
      <Form ref='createRole' :model="admin" :label-width="80">
        <FormItem label="创建角色" prop="name">
          <Row>
            <Col span="20">
            <Input v-model="admin.name" placeholder="输入创建角色名称"></Input>
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
      <div class="btn">
        <Button type="primary" @click="createNew">确认创建</Button>
        <Button type="primary" class="reset" @click="reset">重置</Button>
      </div>
    </section>
  </div>
</template>
<script>
import { subRoleNew } from "@/service/index";
export default {
  data() {
    return {
      admin: {
        name: "",
        remark: ""
      },
      treeData: [
        {
          title: "所有权限",
          expand: true,
          children: [
            /* {
              title: "看板"
            }, */
            {
              title: "数据看板"
            },
            {
              title: "个人中心"
            },
            {
              title: "输赢报表",
              expand: true,
              children: [
                {
                  title: "公司输赢总报表"
                },
                {
                  title: "玩家输赢报表"
                },
                {
                  title: "NA游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "NA游戏总报表"
                    } ,
                   /* {
                      title: "NA电子游戏报表"
                    },
                    {
                      title: "NA街机游戏报表"
                    },
                    {
                      title: "NA棋牌游戏报表"
                    }, */
                     {
                      title: "NA电子H5报表"
                    },
                    {
                      title: "NA电子H5无神秘奖报表"
                    }
                    /* ,
                     {
                      title: "NA真人h5报表"
                    },
                    {
                      title: "NA真人游戏报表"
                    },
                    {
                      title: "NA捕鱼游戏报表"
                    } */
                  ]
                },
                {
                  title: "KY游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "KY棋牌游戏报表"
                    }
                  ]
                },
                {
                  title: "TTG游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "TTG电子游戏报表"
                    }
                  ]
                },
                {
                  title: "SA游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "SA游戏总报表"
                    },
                    {
                      title: "SA真人游戏报表"
                    },
                    {
                      title: "SA捕鱼游戏报表"
                    }
                  ]
                },
                {
                  title: "SB游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "SB游戏总报表"
                    },
                    {
                      title: "SB真人游戏报表"
                    },
                    {
                      title: "SB电子游戏报表"
                    }
                  ]
                },
                {
                  title: "MG游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "MG电子游戏报表"
                    }
                  ]
                },
                {
                  title: "AG游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "AG真人游戏报表"
                    }
                  ]
                },
                {
                  title: "YSB游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "YSB体育游戏报表"
                    }
                  ]
                },
                {
                  title: "RTG游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "RTG电子游戏报表"
                    }
                  ]
                },
                {
                  title: "DT游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "DT电子游戏报表"
                    }
                  ]
                },
                {
                  title: "PP游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "PP电子游戏报表"
                    }
                  ]
                },
                {
                  title: "PG游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "PG电子游戏报表"
                    }
                  ]
                },
                {
                  title: "HABA游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "HABA电子游戏报表"
                    }
                  ]
                },
                {
                  title: "PNG游戏报表",
                  expand: true,
                  children: [
                    {
                      title: "PNG电子游戏报表"
                    }
                  ]
                }
              ]
            },
            {
              title: "商户中心",
              expand: true,
              children: [
                {
                  title: "线路商列表"
                },
                {
                  title: "停启用线路商"
                },
                 {
                  title: "前往线路商系统"
                },
                {
                  title: "线路商加减点"
                },
                {
                  title: "创建线路商"
                },
                {
                  title: "商户列表"
                },
                {
                  title:'停启用商户'
                },
                 {
                  title:'前往商户系统'
                },
                {
                  title: "商户加减点"
                },
                {
                  title: "创建商户"
                },
                {
                  title: "编辑"
                },
                {
                  title: "接入商点数警告列表"
                },
                {
                  title: "接入商停启用"
                },
                {
                  title: "设定接入商告警上限"
                }
              ]
            },
            {
              title: "玩家中心",
              expand: true,
              children: [
                {
                  title: "玩家列表"
                }
              ]
            },
            {
              title: "管理员中心",
              expand: true,
              children: [
                {
                  title: "管理员列表"
                },
                {
                  title: "管理员角色列表"
                }
              ]
            },
            {
              title: "日志中心",
              expand: true,
              children: [
                {
                  title: "登录日志"
                },
                {
                  title: "操作日志"
                },
                {
                  title: "DEBUG日志"
                }
              ]
            },
            {
              title: "运营中心",
              expand: true,
              children: [
                  {
                  title: "神秘大奖"
                },
                {
                  title: "电子游戏配置"
                },
                {
                  title: "游戏管理"
                }
              ]
            },
             {
            title: "免转中心",
            expand: true,
            children: [
              {
                title: "流水交易",
              },
            ]
          },
            {
            title: "数据权限",
            expand: true,
            children: [
              {
                title: "正式数据"
              },
              {
                title: "查看密码"
              },
              {
                title: "商户密匙"
              },
            ]
          },
          ]
        }
      ]
    };
  },
  methods: {
    createNew() {
      let trees = this.$refs.tree.getCheckedNodes();
      let permissions = [];
      for (let item of trees) {
        permissions.push(item.title);
      }
      subRoleNew({
        ...this.admin,
        permissions
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("创建成功");
          this.$router.push({ name: "adminRole" });
        }
      });
    },
    reset() {
      this.$refs["createRole"].resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
.createRole {
  min-height: 89vh;
  .create {
    width: 40rem;
    margin: 0 auto;
    margin-top: 1rem;
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
}
</style>

