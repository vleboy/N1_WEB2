<template>
  <div class="adminLogin">
    <div class="search">
      <Row class="row" style="display:flex;align-items:center">
          <Select v-model="model1" style="width:150px" size="small">
            <Option
              v-for="item in members"
              :value="item.value"
              :key="item.value"
              @click.native="selRole(item.role)"
              size="small"
            >{{ item.label }}</Option>
          </Select>
        <p style="margin:0 1rem">账号</p>
        <p>
          <Input v-model="username" placeholder="请输入" size="small"></Input>
        </p>
        <p style="margin:0 1rem">昵称</p>
        <p>
          <Input v-model="displayName" placeholder="请输入" size="small"></Input>
        </p>
            <Button type="primary" class="searchbtn" @click="search" size="small" style="margin:0 .3rem 0 1rem">搜索</Button>
            <Button type="primary" class="searchbtn" @click="reset" size="small"> 重置</Button>
      </Row>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="dataList" size="small">
        <template slot-scope="{row, index}" slot="lastTime">
          <span>{{lastTimeConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="userNameDetail">
          <Button type="text" size="small" :style="{borderColor:userNameDetailConfig(row),color:userNameDetailConfig(row)}">{{row.detail}}</Button>
        </template>
        <template slot-scope="{row, index}" slot="loginState">
          <Button type="text" size="small" :style="{borderColor:loginStateConfig(row),color:loginStateConfig(row)}">{{row.ret == "Y" ? "正常" : "异常"}}</Button>
        </template>
      </Table>
    </div>
    <Page :total="totalPage" class="page" :page-size="pageSize" @on-change="changepage"></Page>
    <!-- <div class="btn">
      <Button type="primary" :disabled="firstPage" class="lastpage" @click="homePage">首页</Button>
      <Button type="primary" class="nextpage" @click="nextPage">下一页</Button>
    </div> -->
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
      totalPage: 100, //数据总量
      pageSize: 20, //每页显示数据量
      currentPage: 1, //当前页码
      showNext: false, //是否显示下100条
      spinShow: false,
      role: "1",
      startKey: null,
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
        },
        {
          role: "100",
          value: "商户",
          label: "商户"
        }
      ],
      model1: "管理员",
      username: "",
      displayName: "",
      firstPage: true,
      columns1: [
        {
          title: "序号",
          type: "index",
          align: "center",
          maxWidth: 60
        },
        {
          title: "账号",
          align: "center",
          key: "username"
        },
        {
          title: "昵称",
          
          align: "center",
          key: "displayName"
        },
        {
          title: "最后登录IP",
          align: "center",
          key: "lastIP"
        },
        {
          title: "最后登录时间",
          align: "center",
          slot: "lastTime"
        },
        {
          title: "账号详情",
          align: "center",
          slot: "userNameDetail",
        },
        {
          title: "登录状态",
          align: "center",
          slot: "loginState"
        }
      ],
      columns2: [],
      dataList: []
    };
  },
  methods: {
    //最后登录时间
    lastTimeConfig(row) {
      return dayjs(row.lastLogin).format("YYYY-MM-DD HH:mm:ss")  
    },
    //账号详情
    userNameDetailConfig(row) {
      return row.ret == "Y" ? "#0c0" : "#f30"
    },
    //登录状态
    loginStateConfig(row) {
      return row.ret == "Y" ? "#0c0" : "#f30" 
    },


    selRole(value) {
      this.username = "";
      this.displayName = "";
      this.role = value;
      this.startKey = null;
      this.init();
    },
    //切页
    changepage(index) {

      //console.log(this.columns2)
     
      
      this.showNext = true
      if (this.currentPage < index) {
        this.init()
      }
      this.dataList = _.chunk(this.columns2, 20)[index - 1];
      this.currentPage = index
    },
    
    init() {
      this.spinShow = true;
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
        pageSize: 100,//返回的数据总量
        startKey: this.startKey,
        query: query
      };
      httpRequest("post", "/logList", params).then(res => {
        if (this.showNext) {
          this.columns2 = this.columns2.concat(res.payload.Items);
        } else {
          this.columns2 = res.payload.Items;
        }
        this.totalPage = this.columns2.length
        this.startKey = res.payload.LastEvaluatedKey;
        this.spinShow = false;
        this.dataList = _.chunk(this.columns2, 20)[0];
      });
    },
    search() {
      this.startKey = null;
      this.init();
    },
    reset() {
      this.username = "";
      this.displayName = "";
      this.model1 = "管理员";
      this.role = "1";
      this.startKey = null;
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
  .page {
    margin-top: 1rem;
    text-align: right;
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

