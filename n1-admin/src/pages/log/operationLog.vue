<template>
  <div class="adminLog">
    <div class="reload">
      <Row class="row" style="display:flex;align-items:center">
        
          <Select v-model="model1" style="width:150px" size="small">
            <Option
              v-for="item in members"
              :value="item.value"
              :key="item.value"
              @click.native="selRole(item.role)"
              
            >{{ item.label }}</Option>
          </Select>
     
        <p style="margin:0 1rem">操作人:</p>
        <p span="4">
          <Input v-model.trim="userName" placeholder="请输入" size="small"></Input>
        </p>
       
          <div class="btns">
            <Button type="primary" @click="search" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
            <Button  @click="reset" size="small">重置</Button>
          </div>
      
      </Row>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="columns2" size="small">
        <template slot-scope="{row, index}" slot="operator">
          <span>{{row.operateToken ? row.operateToken.username : row.username}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operateTime">
          <span>{{operateTimeConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operateResult">
          <span :style="{color:operateResultConfig(row)}">{{row.ret == "Y" ? "成功" : "失败"}}</span>
        </template>
      </Table>
    </div>
    <div class="btn">
      <Button type="primary" :disabled="firstPage" class="lastpage" @click="homePage">首页</Button>
      <Button type="primary" class="nextpage" @click="nextPage">下一页</Button>
    </div>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
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
          slot: "operator"
        },
        {
          title: "操作时间",
          align: 'center',
          slot: "operateTime"
        },
        {
          title: "操作",
          align: 'center',
          key: "action"
        },
        {
          title: "操作结果",
          align: 'center',
          slot: "operateResult"
        }
      ],
      columns2: []
    };
  },
  methods: {
    //操作时间
    operateTimeConfig(row) {
      return this.dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    //操作结果
    operateResultConfig(row) {
      return row.ret == "Y" ? "#0c0" : "#f30"
    },





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
/deep/ .ivu-input {
    border-color: #000;
    background: #fff;
  }
  /deep/.ivu-select-selection {
    border-color: #000;
  }
  .ivu-btn {
    background: #fff;
    color: #000;
    border-color: #000;
  }
  .ivu-btn:hover {
    background: #000;
    color: #fff;
  }
</style>

