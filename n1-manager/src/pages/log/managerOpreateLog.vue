<template>
  <div class="opreateLog">
    <div class="search">
      <Button type="primary" class="searchbtn" @click="reset">刷新</Button>
    </div>
    <div class="table">
      <Table :columns="columns1" :data="showData" size="small"></Table>
      <Page :total="total" class="page" show-elevator :page-size='pageSize' show-total @on-change="changepage"></Page>
    </div>
    <Spin size="large" fix v-if="$store.state.loading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { logList } from "@/service/index";
export default {
  data() {
    return {
      username: "",
      displayName: "",
      firstPage: true,
      opreateLog: [],
      showData:[],
      pageSize:40,
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
              name=params.row.operateToken.displayName
            }else{
              name=params.row.username
            }
            return h('span',name)
          }
        },
        {
          title: "操作",
          key: "action"
        },
        {
          title: "操作时间",
          key: "createdAt",
          render: (h, params) => {
            return h("span",dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss")
            );
          }
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
    total(){
      return this.opreateLog.length
    }
  },
  methods: {
     handlePage() {
      // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
      if (this.total < this.pageSize) {
        this.showData = this.opreateLog;
      } else {
        this.showData = this.opreateLog.slice(0, this.pageSize);
      }
    },
    changepage(index) {
      let size = this.pageSize;
      let _start = (index - 1) * size;
      let _end = index * size;
      this.showData = this.opreateLog.slice(_start, _end);
      // console.log(this.showData);
    },
    init() {
      this.$store.commit('globalLoading',{params:true})
      logList({
        role: "10",
        type: "operate",
        pageSize: 40,
        startKey: null
      }).then(res=>{
        if(res.code==0){
          this.opreateLog=res.payload.Items
          this.handlePage()
        }
      }).finally(()=>{
      this.$store.commit('globalLoading',{params:false})
      })
    },
    reset() {
      this.init();
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="less" scoped>
.opreateLog {
  min-height: 89vh;
  .search {
    text-align: right;
      .searchbtn {
        margin-bottom: 16px;
        margin-right: 5px;
      }
  }
  .page{
    text-align: right
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>

