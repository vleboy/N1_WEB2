<template>
  <div class="p-detail">
    <div>
     <Table :columns="columns" :data="dataList" size="small" style="margin-bottom:1rem">
       <template slot-scope="{row, index}" slot="gameState">
         <span>{{gameStateConfig(row)}}</span>
       </template>
       <template slot-scope="{row, index}" slot="joinTime">
         <span>{{joinTimeConfig(row)}}</span>
       </template>
     </Table>
    </div>
    <div class="-d-content">
      <!-- <h4>消费信息</h4> -->
      <RadioGroup v-model="reportType" type="button" :style="{paddingBottom:'10px'}" size="small">
        <Radio label="1">流水报表</Radio>
        <Radio label="2">交易记录</Radio>
      </RadioGroup>
      <div class="-c-info">
        <playerRunningAccount ref="childMethod" v-if="reportType==1"></playerRunningAccount>
        <transactionRecord v-else></transactionRecord>
      </div>
    </div>
    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script type="text/ecmascript-6">
import { formatUserName, thousandFormatter } from '@/config/format'
import { httpRequest } from '@/service/index'
import dayjs from "dayjs";
import playerRunningAccount from '@/components/player/playerRunningAccount'
import transactionRecord from '@/components/player/transactionRecord'

export default {
  components:{playerRunningAccount, transactionRecord},
  beforeCreate () {
    // this.$store.commit('returnLocalStorage')
    // this.$store.commit({
    //   type: 'recordNowindex',
    //   data: 'playerdetail'
    // })
  },
  data () {
    return {
      isFetching: false,
      playerDetailInfo: '',
      reportType: '1',
      panel1:'',
      gameStatus: {
        '1': '离线',
        '2': '在线',
        '3': '游戏中'
      },
      columns: [
        {
          title: "商户ID",
          key: "buId"
        },
        {
          title: "所属商户",
          align: "center",
          key: "merchantName"
        },
        {
          title: "商户标识",
           align: "center",
          key: "sn"
        },
        {
          title: "线路号",
           align: "center",
          key: "msn"
        },
        {
          title: "玩家ID",
           align: "center",
          key: "userId"
        },
        {
          title: "游戏状态",
           align: "center",
          slot: "gameState"
        },
        {
          title: "余额",
           align: "center",
          key: "balance"
        },
        {
          title: "最近登录游戏",
           align: "center",
          slot: "joinTime"
        },
      ],
      dataList: []
    }
  },
  mounted () {
    this.getPlayerDetail()
  },
  computed: {
    detailInfo () {
      return this.playerDetailInfo
    },
    lastTime () {
      return this.playerDetailInfo.joinTime ? dayjs(this.playerDetailInfo.joinTime).format("YYYY-MM-DD HH:mm:ss") : ''
    },
    userName () {
      return this.playerDetailInfo.userName || localStorage.playerName
    }
  },
  methods: {
    //游戏状态
    gameStateConfig(row) {
      return this.gameStatus[row.gameState]
    },
    //最近登录时间
    joinTimeConfig(row) {
      return dayjs(row.joinTime).format("YYYY-MM-DD HH:mm:ss")
    },

    getPlayerDetail () {
      this.dataList = []
      if(this.isFetching) return
      this.isFetching = true
      let name = localStorage.playerName
      // this.$store.commit('startLoading')
      httpRequest('post','/player/info',{
        userName: name
      }).then(
        result => {
          this.playerDetailInfo = result.userInfo
          this.dataList.push(this.playerDetailInfo)
          this.reportType = '1'
          // this.$store.commit('closeLoading')
        }
      ).finally(()=>{
        this.isFetching = false
      })
    }
  },
  watch: {
    '$route': function (_new, _old) {
      if((_new.name == 'playDetail') && (localStorage.playerName != this.playerDetailInfo.userName)) {
        this.getPlayerDetail()
      }
    }
  },
  filters:{   //过滤器，所有数字保留两位小数
    currency(value){
      return (value-0).toFixed(2);
    }
  }
}
</script>

<style scpoed lang="less" type="text/less">
  .p-detail{
    min-height: 89vh;
    .-d-title{
      text-align: center;
      // h2{
      //   font-size: 2.5rem;
      //   color: #5a5a5a;
      // }
    }

    .-d-base{
      margin: 0 auto;
      vertical-align: baseline;

      .-b-form{
        // background-color: #f5f5f5;
        padding: 0 16px;
      }
      .-span-base{
        display: inline-block;
        padding: 16px 0;
      }
    }

    .-d-content{

      // .-c-top{
      //   // background-color: #f5f5f5;
      //   // padding: 16px 16px 0 16px
      // }
      .-c-info{
        // background-color: #f5f5f5;
        font-size: 1.1rem;
        // padding:1px;
        // overflow: hidden
      }
    }

    .-p-green{
      color: #00CC00
    }
    .-p-red{
      color: #FF3300
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
    /deep/ .ivu-tabs-bar {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-nav-container {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs-nav {
    height: 2.25rem;
  }
  /deep/ .ivu-tabs-nav-scroll {
    height: 2.25rem;
  }
  
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
    border-color: #000;
    color: #000;
    background: #fff;
  }
 
  /deep/ .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
    background: #000;
    color: #fff;
  }
  
  /deep/.ivu-select-selection {
    border-color: #000;
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
  }
</style>
