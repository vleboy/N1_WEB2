<template>
  <div class="adminLog">
    <div class="reload">
      <Row class="row">
        <Col span="3">
          <Select v-model="model1" style="width:100%">
            <Option
              v-for="item in members"
              :value="item.value"
              :key="item.value"
              @click.native="selRole(item.role)"
            >{{ item.label }}</Option>
          </Select>
        </Col>
        <Col span="1" offset="1">操作人:</Col>
        <Col span="4">
          <Input v-model.trim="userName" placeholder="请输入"></Input>
        </Col>
        <Col span="3">
          <div class="btns">
            <Button type="primary" @click="search">搜索</Button>
            <Button type="ghost" @click="reset">重置</Button>
          </div>
        </Col>
      </Row>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="columns2" size="small"></Table>
    </div>
    <div class="btn">
      <Button type="primary" :disabled="firstPage" class="lastpage" @click="homePage">首页</Button>
      <Button type="primary" class="nextpage" @click="nextPage">下一页</Button>
    </div>
    <Spin size="large" fix v-show="spinShow">
      <Icon type="load-c" size="18" class="demo-spin-icon-load"></Icon>
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
      members: [
        {
          role: "1",
          value: "管理员",
          label: "管理员"
        },
        {
          role: "10",
          value: "线路商",
          label: "线路商"
        }
      ],
      role: "1",
      model1: '管理员',
      spinShow: false,
      dayjs: dayjs,
      firstPage: true,
      userName: "",
      columns1: [
        {
          title: "序号",
          type: "index",
          align: 'center',
          maxWidth: 60
        },
        {
          title: "操作人",
          align: 'center',
          key: "username",
          render: (h, params) => {
            let name = "";
            if (params.row.operateToken) {
              name = params.row.operateToken.username;
            } else {
              name = params.row.username;
            }
            return h("span", name);
          }
        },
        {
          title: "操作时间",
          align: 'center',
          key: "",
          render: (h, params) => {
            return h(
              "span",
              this.dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
        {
          title: "操作",
          align: 'center',
          key: "action"
        },
        {
          title: "操作结果",
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
                "成功"
              );
            } else {
              return h(
                "span",
                {
                  style: {
                    color: "#f30"
                  }
                },
                "失败"
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
      this.userName = "";
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
        username: this.userName,
      };
      if (!query.username) {
        delete query.username;
      }
      let params = {
        role: this.role,
        type: "operate",
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
      this.init();
    },
    reset() {
      this.userName = "";
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
.adminLog {
  min-height: 89vh;
  .row {
    line-height: 32px;
    text-align: center;
    padding-bottom: 16px;
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

