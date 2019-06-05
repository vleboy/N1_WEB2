<template>
  <div class="agentLog">
    <div class="reload">
        <span v-if="agentLevel==0">
          <span class="searchLabel">操作人:</span>
          <Input v-model.trim="userName" placeholder="请输入" style="width: 200px"></Input>
          <span class="selectText">代理层级:</span>
          <Select v-model="level" style="width:200px" placeholder="请选择代理层级" @on-change="changeLevel">
            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.value }}</Option>
          </Select>
        </span>
        <!-- <Col span="2">操作类型</Col>
        <Col span="4">
        <Input v-model.trim="opreateType" placeholder="请输入"></Input>
        </Col> -->
        <span class="btns">
          <Button type="primary" @click="search" v-if="agentLevel==0">搜索</Button>
          <Button type="primary" @click="reset">重置</Button>
        </span>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="agentLog" size="small"></Table>
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
      firstPage: true,
      level: "1",
      userName:'',
      opreateType:'',
      levelList: [
        {
          value: "1"
        },
        {
          value: "2"
        },
        {
          value: "3"
        },
        {
          value: "4"
        },
        {
          value: "5"
        },
        {
          value: "6"
        },
        {
          value: "7"
        },
        {
          value: "8"
        },
        {
          value: "9"
        },
        {
          value: "10"
        }
      ],
      columns1: [
        {
          title: "序号",
          type: "index",
          maxWidth: 80
        },
          {
          title: "操作人",
          key: "username",
          render:(h,params)=>{
            let name=''
            if(params.row.operateToken){
              name=params.row.operateToken.username
            }else{
              name=params.row.username
            }
            return h('span',name)
          }
        },
        {
          title: "操作时间",
          key: "",
          render: (h, params) => {
            return h(
              "span",
              dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        },
       {
          title: "操作",
          key: "action"
        },
        {
          title: "操作结果",
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
      ]
    };
  },
  computed: {
    agentLevel(){
      return +localStorage.level
    },
    agentLog() {
      return this.$store.state.log.agentOpreateLog;
    }
  },
  methods: {
    nextPage() {
      let startKey = this.$store.state.log.startKey;
      let params={
        role: "1000",
        type: "operate",
        pageSize: 100,
         query:{
          username:this.userName,
        },
        level: +this.level,
        startKey: startKey
      }
       if(this.userName==""){
        delete params.query
      }
      this.$store.dispatch("getAgentOpreateLog", params);
      this.firstPage = false;
    },
    homePage() {
      this.init();
      this.firstPage = true;
    },
    init() {
      let params={
        role: "1000",
        type: "operate",
        pageSize: 100,
         query:{
          username:this.userName,
        },
        level: +this.level,
        startKey: null
      }
       if(this.userName==""){
        delete params.query
      }
      this.$store.dispatch("getAgentOpreateLog", params);
    },
    search(){
      this.init()
    },
    reset() {
      this.userName=''
      this.opreateType=''
      this.init();
    },
    changeLevel() {
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.agentLog {
  min-height: 89vh;
  .btn {
    text-align: right;
    .nextpage {
      margin: 20px;
    }
  }
  .btns{
    position: absolute;
    right: 18px;
  }
  .reload {
   text-align: center;
   line-height: 32px;
   height: 32px;
   margin-bottom: 16px;
   position: relative;
    .selectText {
     padding-left: 10px;
    }
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

