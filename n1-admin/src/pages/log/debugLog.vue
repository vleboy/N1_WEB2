<template>
  <div class="debugLog">
    <div class="option">
      <Row class="row" style="margin-bottom:1rem">
        <Col span="16">
        <RadioGroup v-model="role" @on-change="changeRole" type="button" size="small">
            <Radio v-for="item in selectOption" :label="item.value" :key="item.value">{{ item.label }}</Radio>
        </RadioGroup>
        <!-- <Select style="width:200px;float:right" @on-change='changeRole' v-model="role">
          <Option v-for="item in selectOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select> -->
        </Col>
      </Row>
          
    </div>
    <div class="table">
      <Table :columns="columns1" :data="debugLog" size="small" >
        <template slot-scope="{row, index}" slot="createdAt">
          <span>{{createdAtConfig(row)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="inparams">
          <span>{{JSON.stringify(row.inparams)}}</span>
        </template>
        <template slot-scope="{row, index}" slot="state">
          <Button type="text" size=:small :style="{borderColor:stateConfig(row),color: stateConfig(row)}">{{row.ret == "Y" ? "已处理" : "未处理"}}</Button>
        </template>
      </Table>
    </div>
    <div class="btn">
      <Button type="primary" :disabled='firstPage' class="lastpage" @click="homePage">首页</Button>
      <Button type="primary" class="nextpage" @click="nextPage">下一页</Button>
    </div>
  
    <Spin size="large" fix v-show="$store.state.admin.loading" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  data() {
    return {
      firstPage: true,
      role: "4",
      selectOption: [
        {
          value: "4",
          label: "第三方战绩异常"
        },
        {
          value: "3",
          label: "超时流水异常"
        },
        {
          value: "2",
          label: "系统异常"
        },
         {
          value: "6",
          label: "玩家退出"
        },
        {
          value: "7",
          label: "控分停用"
        },
         {
          value: "8",
          label: "变更拥有游戏"
        }
      ],
      columns1: [
        {
          title: "时间",
          align: 'center',
          slot: "createdAt"
        },
        {
          title: "状态",
          align: 'center',
          slot: "state"
        },
        {
          title: "详情",
          align: 'center',
          key: "detail"
        },
        {
          title: "参数",
          align: 'center',
          slot: "inparams"
        }
      ]
    };
  },
  computed: {
    debugLog() {
      return this.$store.state.admin.debugLog;
    }
  },
  methods: {

    //时间
    createdAtConfig(row) {
      return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
    },
    //状态
    stateConfig(row) {
      return row.ret == "Y" ? "#0c0" : "#f30"
    },

    nextPage() {
      let startKey = this.$store.state.admin.startKey;
      let role = this.role;
      this.$store.dispatch("getDebugLog", {
        role: role,
        type: "settlement",
        pageSize: 20,
        startKey: startKey
      });
      this.firstPage = false;
    },
    homePage() {
      let role = this.role;
      this.$store.dispatch("getDebugLog", {
        role: role,
        type: "settlement",
        pageSize: 20,
        startKey: ""
      });
      this.firstPage = true;
    },
    changeRole(val) {
      this.$store.dispatch("getDebugLog", {
        role: val,
        type: "settlement",
        pageSize: 20,
        startKey: ""
      });
    }
  },
  created() {
    this.$store.dispatch("getDebugLog", {
      role: '4',
      type: "settlement",
      pageSize: 20,
      startKey: ""
    });
  }
};
</script>
<style lang="less" scoped>
.debugLog {
  min-height: 89vh;
  .searchbtn {
    margin-left: 10px;
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
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper {
    border: 1px solid #ccc;
    color: #000;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper:hover {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper-checked {
    background: #000;
    color: #fff;
  }
  /deep/ .ivu-input {
    border-color: #000;
    background: #fff;
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

