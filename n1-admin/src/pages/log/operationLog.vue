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
     
        <p style="margin:0 1rem">操作人</p>
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
      <Table :columns="columns1" :data="dataList" size="small">
        <template slot-scope="{row, index}" slot="operator">
          <span>{{row.operateToken ? row.operateToken.username : row.username}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operateTime">
          <span>{{operateTimeConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="operateResult">
          <Button type="text" size="small" :style="{borderColor:operateResultConfig(row),color:operateResultConfig(row)}">{{row.ret == "Y" ? "成功" : "失败"}}</Button>
        </template>
      </Table>
    </div>
     <Page :total="totalPage" class="page" :page-size="pageSize" @on-change="changepage"></Page>
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
          role: "7",
          value: "系统",
          label: "系统"
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
      columns2: [],
      dataList: []
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
      this.spinShow = true
      let query = {
        username: this.userName,
      };
      if (!query.username) {
        delete query.username;
      }
      let type = this.role == "7" ? "autoControl" : "operate" 
      let params = {
        role: this.role,
        type: type,
        pageSize: "100",
        startKey: this.startKey,
        query: query
      }
      httpRequest("post", "/logList", params).then(res => {
        
        this.startKey = res.payload.LastEvaluatedKey
        this.spinShow = false
        if (this.showNext) {
          this.columns2 = this.columns2.concat(res.payload.Items);
          this.totalPage = this.columns2.length
        } else {
          this.columns2 = res.payload.Items;
          this.totalPage = this.columns2.length
          this.dataList = _.chunk(this.columns2, 20)[0];
        }
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

