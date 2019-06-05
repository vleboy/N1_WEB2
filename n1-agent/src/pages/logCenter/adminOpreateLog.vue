<template>
    <div class="adminLog">
        <div class="reload">
        <Row class="row">
            <Col span="2" offset="6">操作人</Col>
            <Col span="4">
            <Input v-model.trim="userName" placeholder="请输入"></Input>
            </Col>
            <!-- <Col span="2">操作类型</Col>
            <Col span="4">
            <Input v-model.trim="opreateType" placeholder="请输入"></Input>
            </Col> -->
            <Col span="5" >
            <div class="btns">
              <Button type="primary" @click="search">搜索</Button>
              <Button type="ghost" @click="reset">重置</Button>
            </div>
            </Col>
          </Row>
        </div>
        <div class="table">
            <Table :columns="columns1" :data="adminLog" size="small" ></Table>
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
       userName:'',
      opreateType:'',
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
    adminLog() {
      return this.$store.state.log.adminOpreateLog;
    }
  },
  methods: {
    nextPage() {
      let startKey = this.$store.state.log.startKey;
      let params={
        role: "1000",
        type: "operate",
        level:0,
        pageSize: 100,
        query:{
          username:this.userName,
        },
        startKey: startKey
      }
      if(this.userName==""){
        delete params.query
      }
      this.$store.dispatch("getAdminLog", params);
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
        level:0,
         query:{
          username:this.userName,
        },
        startKey: null
      }
      if(this.userName==""){
        delete params.query
      }
      this.$store.dispatch("getAdminLog",params );
    },
     search(){
      this.init()
    },
    reset() {
      this.userName=''
      this.opreateType=''
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
  .btn {
    text-align: right;
    .nextpage {
      margin: 20px;
    }
  }
  .reload {
  text-align: center;
   line-height: 32px;
  padding-bottom: 16px;
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

