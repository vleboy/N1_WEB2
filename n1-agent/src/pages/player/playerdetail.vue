<template>
  <div class="p-detail">
    <div class="-d-title">
      <h2>{{detailInfo.userName}}</h2>
    </div>
     <Collapse v-model="panel1" :style="{marginBottom:'15px'}">
      <Panel name="1">
      基本信息  所属代理：: {{detailInfo.merchantName}} 
        <div slot="content">
          <div class="-d-base">
            <div class="-b-form">
              <Row>
                <Col span="6"><span class="-span-base">代理ID：{{detailInfo.buId}}</span></Col>
                <Col span="6"><span class="-span-base">所属代理：{{detailInfo.merchantName}}</span></Col>
                <Col span="6"><span class="-span-base">代理标识：{{detailInfo.sn}}</span></Col>
                <Col span="6">
                <span class="-span-base">
                    <div class="-player-title" >
                      密码：
                      <span v-if="!editPassword">{{detailInfo.password}}</span>
                      <Input v-model="password" placeholder="请输入密码" type="text" v-else style="width: 50%"></Input>
                      <Button type="text" @click="openPwdInput" v-if="!editPassword" class="-p-edit">修改</Button>
                      <span v-else style="margin-left: 0.5rem;color:#20a0ff ">
                        <Button size="small" type="primary" @click="updatePwd">确认</Button>
                        <Button size="small" type="primary" @click="editPassword = !editPassword">取消</Button>
                      </span>
                    </div>
                  </span>
                </Col>
              </Row>
              <Row>
                <Col span="6"><span class="-span-base">玩家ID：{{detailInfo.userId}}</span></Col>
                <Col span="6"><span class="-span-base">玩家昵称：{{detailInfo.nickname === 'NULL!' ? '无' : detailInfo.nickname}}</span></Col>
                <Col span="6"><span class="-span-base">游戏状态：{{gameStatus[detailInfo.gameState]}}</span></Col>
                <Col span="6"><span class="-span-base">余额: {{detailInfo.balance}}</span></Col>
              </Row>
              <Row>
                <Col span="6"><span class="-span-base">最近登录游戏：{{lastTime}}</span></Col>
              </Row>
              <Row>
                <Col span="4" v-for="(item,index) of detailInfo.gameList" :key="index">
                <span class="-span-base">{{item.name+'洗码比'}}：{{item.mix}}%</span>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Panel>
     </Collapse>
    <div class="-d-content">
      <RadioGroup v-model="reportType" type="button" :style="{paddingBottom:'10px'}">
        <Radio label="1">流水报表</Radio>
        <Radio label="2">交易记录</Radio>
      </RadioGroup>
      <div class="-c-info">
        <playerRunningAccount ref="childMethod" v-if="reportType==1"></playerRunningAccount>
        <transactionRecord :dataProp="playerDetailInfo" @updateBalance="getPlayerDetail"  v-else></transactionRecord>
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

  mounted () {
    this.getPlayerDetail()
  },
  data () {
    return {
      password: '',
      editPassword: false,
      isOpenModal: false,
      isFetching: false,
      balanceInfo: {},
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
  computed: {
    detailInfo () {
      return this.playerDetailInfo
    },
    lastTime () {
      return this.playerDetailInfo.joinTime ? dayjs(this.playerDetailInfo.joinTime).format("YYYY-MM-DD HH:mm:ss") : ''
    },
    optionOne_label () {
      let name = localStorage.loginUsername.split('_')[1]
      let x = ''
      if (localStorage.loginUsername.split('_')[0] === 'Agent') {
        x = '【平台管理员】'
      } else {
        x = localStorage.loginUsername.split('_')[0]
      }
      return x + ' ' + name
    } // 管理员姓名
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
        }
      ).finally(()=>{
        this.editPassword = false
        this.isFetching = false
      })
    },

    openPwdInput () {
      this.editPassword = !this.editPassword
      this.password = JSON.parse(JSON.stringify(this.detailInfo.password))
    },
    updatePwd () {
      let rex = new RegExp(/^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,16}$/)
      if (!rex.exec(this.password)) {
        return this.$Message.error('密码中必须包含6-16位由字母、数字、符号中至少两种组成')
      }

      httpRequest('post','/agent/player/password',{
        userName: this.detailInfo.userName,
        password: this.password
      }).then(
        result => {
          this.$Message.success('修改成功')
          this.getPlayerDetail()
          this.editPassword = false
        }
      )
    }
  },
  filters:{   //过滤器，所有数字保留两位小数
    currency(value){
      return (value-0).toFixed(2);
    }
  },
  watch: {
    '$route': function (_new, _old) {
      if((_new.name == 'playDetail') && (localStorage.playerName != this.playerDetailInfo.userName)) {
        this.getPlayerDetail()
      }
    }
  }
}
</script>

<style scpoed lang="less" type="text/less">
  .p-detail{
    min-height: 89vh;
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

      .-p-edit{
        margin-left: 0.5rem;
        padding: 0;
        color:#20a0ff
      }
    }

    .-d-content{

      // .-c-top{
      //   background-color: #f5f5f5;
      //   padding: 16px 16px 0 16px
      // }
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
  }
</style>
