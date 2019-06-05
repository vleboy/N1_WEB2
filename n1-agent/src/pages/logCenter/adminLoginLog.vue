<template>
  <div class="merchantLog">
    <div class="search">
      <Row class="row">
        <Col span='2' offset='4'> 代理账号:
        </Col>
        <Col span="4">
        <Input v-model.trim="username" placeholder="请输入"></Input>
        </Col>
        <Col span='2'> 代理昵称:
        </Col>
        <Col span="4">
        <Input v-model.trim="displayName" placeholder="请输入"></Input>
        </Col>
        <Col span="4">
        <div class="btns">
          <Button type="primary" class="searchbtn" @click="search">搜索</Button>
          <Button type="primary" class="searchbtn" @click="reset">重置</Button>
        </div>
        </Col>
      </Row>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="adminLoginLog" size="small" ></Table>
    </div>
    <div class="btn">
      <Button type="primary" :disabled='firstPage' class="lastpage" @click="homePage">首页</Button>
      <Button type="primary" class="nextpage" @click="nextPage">下一页</Button>
    </div>
    <Spin size="large" fix v-if="$store.state.log.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      username: "",
      displayName: "",
      firstPage: true,
      showList: [],
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 80
        },
        {
          title: "代理管理员账号",
          key: "username"
        },
        {
          title: "代理管理员昵称",
          key: "displayName"
        },
        {
          title: "最后登录IP",
          key: "lastIP"
        },
        {
          title: "最后登录时间",
          key: "",
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.lastLogin).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "账号详情",
          key: "",
          render: (h, params) => {
            if (params.row.ret == "Y") {
              return h(
                "span",
                {
                  style: {
                    color: "#0c0"
                  }
                },
                params.row.detail
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#f30"
                  }
                },
                params.row.detail
              );
            }
          }
        },
        {
          title: "登录状态",
          key: "",
          render: (h, params) => {
            if (params.row.ret == "Y") {
              return h(
                "span",
                {
                  style: {
                    color: "#0c0"
                  }
                },
                "正常"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#f30"
                  }
                },
                "异常"
              );
            }
          }
        }
      ]
    };
  },
  computed: {
    adminLoginLog() {
      return this.$store.state.log.adminLoginLog;
    }
  },
  methods: {
    nextPage() {
      let startKey = this.$store.state.log.startKey;
      this.$store.dispatch("getAdminLoginLog", {
        role: "1000",
        type: "login",
        pageSize: 50,
        startKey: startKey,
        level: 0,
        query: {}
      });
      this.firstPage = false;
    },
    homePage() {
      this.init();
      this.firstPage = true;
    },
    search() {
      let query = {
        username: this.username,
        displayName: this.displayName
      };
      if (!query.username) {
        delete query.username;
      }
      if (!query.displayName) {
        delete query.displayName;
      }
      this.$store.dispatch("getAdminLoginLog", {
        query,
        role: "1000",
        type: "login",
        pageSize: "50",
        level: 0,
        startKey: null
      });
    },
    init() {
      this.$store.dispatch("getAdminLoginLog", {
        role: "1000",
        type: "login",
        pageSize: "50",
        startKey: null,
        level: 0,
        query: {}
      });
    },
    reset() {
      this.username = "";
      this.displayName = "";
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.merchantLog {
  min-height: 89vh;
  .btn {
    text-align: right;
    .nextpage {
      margin: 20px;
    }
  }
  .search {
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
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

