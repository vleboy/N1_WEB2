<template>
  <div class="adminLogin">
    <div class="search">
      <Row class="row">
        <Col span="3">
          <Select v-model="model1" style="width:100%" >
            <Option v-for="item in members" :value="item.value" :key="item.value" @click.native="selRole(item.role)">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span='1' offset="0"> 账号:
        </Col>
        <Col span="3">
        <Input v-model="username" placeholder="请输入"></Input>
        </Col>
        <Col span='1'> 昵称:
        </Col>
        <Col span="3">
        <Input v-model="displayName" placeholder="请输入"></Input>
        </Col>
        <Col span="3">
        <div class="btns">
          <Button type="primary" class="searchbtn" @click="search">搜索</Button>
          <Button type="primary" class="searchbtn" @click="reset">重置</Button>
        </div>
        </Col>
      </Row>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="columns2" size="small" ></Table>
    </div>
    <div class="btn">
      <Button type="primary" :disabled='firstPage' class="lastpage" @click="homePage">首页</Button>
      <Button type="primary" class="nextpage" @click="nextPage">下一页</Button>
    </div>
    <Spin size="large" fix v-show="spinShow">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { httpRequest } from "@/service/index";
export default {
  data() {
    return {
      spinShow: false,
      role: '1',
      startKey: null,
      members: [
        {
          role: '1',
          value: "管理员",
          label: "管理员"
        },
        {
          role: '10',
          value: "线路商",
          label: "线路商"
        },
        {
          role: '100',
          value: "商户",
          label: "商户"
        },
      ],
      model1: "管理员",
      username: "",
      displayName: "",
      firstPage: true,
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 60
        },
          {
            title: "账号",
            align: 'center',
            key: "username"
          },
        {
          title: "昵称",
          maxWidth: 100,
          align: 'center',
          key: "displayName"
        },
        {
          title: "最后登录IP",
          align: 'center',
          key: "lastIP"
        },
        {
          title: "最后登录时间",
          align: 'center',
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
          align: 'center',
          maxWidth: 120,
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
          maxWidth: 120,
          align: 'center',
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
      ],
      columns2: []
    };
  },
  methods: {
    selRole(value) {
      this.username = "";
      this.displayName = "";
      this.role = value
      this.startKey = null
      this.init()
    },
    nextPage() {
      this.firstPage = false
      this.init()
    },
    homePage() {
      this.startKey = null
      this.firstPage = true;
      this.init();
    },
    init() {
      this.spinShow = true
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
      let params = {
        role: this.role,
        type: "login",
        pageSize: "50",
        startKey: this.startKey,
        query: query
      }
      httpRequest("post", "/logList", params).then(res => {
        this.columns2 = res.payload.Items
        this.startKey = res.payload.LastEvaluatedKey
        this.spinShow = false
      })
    },
    search() {
      this.startKey = null
      this.init()
    },
    reset() {
      this.username = "";
      this.displayName = "";
      this.model1 = '管理员';
      this.role = '1';
      this.startKey = null
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.adminLogin {
  min-height: 89vh;

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
  .btn {
    text-align: right;
    .nextpage {
      margin: 20px;
    }
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

