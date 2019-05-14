<template>
  <div class="p-detail">
    <div class="-d-title">
      <h2>{{userName}}</h2>
    </div>
     <Collapse v-model="panel1" :style="{marginBottom:'15px'}">
      <Panel name="1">
      基本信息  所属商户: {{detailInfo.merchantName}} 
        <div slot="content">
          <div class="-d-base">
            <!-- <h4>基本信息</h4> -->
            <div class="-b-form">
              <Row>
                <Col span="6"><span class="-span-base">商户ID：{{detailInfo.buId}}</span></Col>
                <Col span="6"><span class="-span-base">所属商户：{{detailInfo.merchantName}}</span></Col>
                <Col span="6"><span class="-span-base">商户标识：{{detailInfo.sn}}</span></Col>
                <Col span="6"><span class="-span-base">线路号：{{detailInfo.msn}}</span></Col>
              </Row>
              <Row>
                <Col span="6"><span class="-span-base">玩家ID：{{detailInfo.userId}}</span></Col>
                <Col span="6"><span class="-span-base" >游戏状态：{{gameStatus[detailInfo.gameState]}}</span></Col>
                <Col span="6"><span class="-span-base" >余额：{{detailInfo.balance}}</span></Col>
                <Col span="6"><span class="-span-base">最近登录游戏：{{lastTime}}</span></Col>
              </Row>
              <Row>
                <Col span="6" v-for="(item,index) of detailInfo.gameList" :key="index">
                <span class="-span-base">{{item.name+'洗码比'}}：{{item.mix}}%</span>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Panel>
     </Collapse>
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
      }
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
    getPlayerDetail () {
      if(this.isFetching) return
      this.isFetching = true
      let name = localStorage.playerName
      // this.$store.commit('startLoading')
      httpRequest('post','/player/info',{
        userName: name
      }).then(
        result => {
          this.playerDetailInfo = result.userInfo
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
  }
</style>
