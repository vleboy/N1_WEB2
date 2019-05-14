<template>
  <div class="lineNumList">
    <div class="search">
      <Row class="row">
        <Col span="4" offset="8">
        <Input v-model="msn" placeholder="请输入需要查询的线路号"></Input>
        </Col>
        <Col span="4">
        <div class="btns">
          <Button type="primary" class="searchbtn" @click="search">搜索</Button>
          <Button type="ghost" @click="reset">重置</Button>
        </div>
        </Col>
      </Row>
      <Row class="row">
        <p class="warning">线路号已废弃，该功能页仅提供基础查询</p>
      </Row>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="lineNumList" size="small" ></Table>
    </div>
    <Spin size="large" fix v-if="$store.state.admin.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import { changeLineStatus } from "@/service/index";
export default {
  data() {
    return {
      msn: "",
      columns1: [
        {
          title: "线路号",
          key: "msn",
        },
        // {
        //   title: "状态",
        //   key: "status",
        //   render: (h, params) => {
        //     let text = "";
        //     let color = "";
        //     if (params.row.status == 1) {
        //       color = "#f30";
        //       text = "已使用";
        //     } else if (params.row.status == 0) {
        //       color = "#0c0";
        //       text = "未使用";
        //     } else {
        //       color = "#108de9";
        //       text = "已停用";
        //     }
        //     return h(
        //       "span",
        //       {
        //         style: {
        //           color: color
        //         }
        //       },
        //       text
        //     );
        //   }
        // },
        {
          title: "商户",
          key: "displayName",
          render: (h, params) => {
            if (params.row.displayName != undefined) {
              return h("span", params.row.displayName);
            } else {
              return h("span", "暂无");
            }
          }
        },
        // {
        //   title: "操作",
        //   key: "",
        //   render: (h, params) => {
        //     let text = "";
        //     let opreate = null;
        //     let color = "";
        //     if (params.row.status == 0) {
        //       text = "停用";
        //       opreate = 2;
        //       color = "#0c0";
        //     } else if (params.row.status == 2) {
        //       text = "启用";
        //       opreate = 0;
        //       color = "#20a0ff";
        //     }
        //     if (params.row.status == 0 || params.row.status == 2) {
        //       return h(
        //         "span",
        //         {
        //           style: {
        //             color: color,
        //             cursor: "pointer"
        //           },
        //           on: {
        //             click: () => {
        //               let msn = params.row.msn;
        //               this.$Modal.confirm({
        //                 title: "提示!",
        //                 content: `<p>是否${text}线路号</p>`,
        //                 onOk: async () => {
        //                   this.$store.commit("logLoading", { params: true });
        //                   await changeLineStatus(msn, opreate);
        //                   this.$store.dispatch("getLineNumList", {});
        //                   this.$Message.success(`${text}成功`);
        //                 }
        //               });
        //             }
        //           }
        //         },
        //         text
        //       );
        //     } else {
        //       return h("span", "");
        //     }
        //   }
        // }
      ],
      spinShow: false
    };
  },
  computed: {
    lineNumList() {
      return this.$store.state.admin.lineNumList;
    }
  },
  methods: {
    reset() {
      this.msn = "";
      this.$store.commit("logLoading", { params: true });
      this.$store.dispatch("getLineNumList", {});
    },
    search() {
      this.$store.commit("logLoading", { params: true });
      this.$store.dispatch("getLineNumList", {
        msn: this.msn
      });
    }
  },
  created() {
    this.$store.commit("logLoading", { params: true });
    this.$store.dispatch("getLineNumList", {});
  }
};
</script>
<style lang="less" scoped>
.lineNumList {
  min-height: 89vh;
  .search {
    // background-color: #f2f2f2;
    // height: 60px;
    .warning{
      font-size: 16px;
      font-weight: bold;
      color: #f00;
    }
    .row {
      line-height: 32px;
      text-align: center;
      padding-bottom: 16px;
      .searchbtn {
        margin-left: 5px;
        margin-right: 5px;
      }
    }
  }
  .option {
    .count {
      line-height: 28px;
      padding-top: 5px;
      padding-bottom: 5px;
    }
    .create {
      padding-bottom: 16px;
    }
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
