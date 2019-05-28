<template>
  <div class="p-detail">
    <div class="playerInfo">
      <Table :columns="columns" :data="dataList" size="small">
        <template slot-scope="{row, index}" slot="gameStatus">
          {{gameStatusConfig(row)}}
        </template>
        <template slot-scope="{row, index}" slot="joinTime">
          {{joinTimeConfig(row)}}
        </template>
      </Table>
    </div>
    <div class="-d-content">
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
      dataList: [],
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
          align: "center",
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
          title: "线路号：",
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
          slot: "gameStatus"
        },
        {
          title: "余额",
          align: "center",
          key: "balance"
        },
        {
          title: "最近登录游戏时间",
          align: "center",
          slot: "joinTime"
        },
      ]
    }
  },
  mounted () {
    this.getPlayerDetail()
  },
  computed: {
    
  },
  methods: {
    //游戏状态
    gameStatusConfig(row) {
      return this.gameStatus[row.gameState]
    },
    //最近登录时间
    joinTimeConfig(row) {
       return row.joinTime ? dayjs(row.joinTime).format("YYYY-MM-DD HH:mm:ss") : ''
    },
    getPlayerDetail () {
      if(this.isFetching) return
      this.isFetching = true
      let name = localStorage.playerName
      // this.$store.commit('startLoading')
      httpRequest('post','/player/info',{
        userName: name
      }).then(
        result => {
          this.dataList = []
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
    .playerInfo {
      margin-bottom: 1rem;
    }
    .-d-title{
      text-align: center;
    }

    .-d-base{
      margin: 0 auto;
      vertical-align: baseline;

      .-b-form{
        padding: 0 16px;
      }
      .-span-base{
        display: inline-block;
        padding: 16px 0;
      }
    }

    .-d-content{

      .-c-info{
        font-size: 1.1rem;
        // padding:16px;
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
