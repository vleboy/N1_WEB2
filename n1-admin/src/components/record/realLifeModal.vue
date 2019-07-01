<template>
  <div class="realLife_modal">
    <Row class="record-row">
      <Col :span="12">游戏名称：{{recordInfo.gameName}}</Col>
      <Col :span="12" class="-row-left">投注编号：{{recordInfo.betId}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">投注时间：{{formatterTime(recordInfo.betTime)}}</Col>
      <Col :span="12" class="-row-left">派彩时间：{{formatterTime(recordInfo.settleTime)}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">会员：{{recordInfo.userName}}</Col>
      <Col :span="12" class="-row-left">玩家下注：{{recordInfo.betNum || '无'}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12" v-if="gameType!='30003'">游戏结果：{{brandResult[recordInfo.bpresult]}}（庄：
      <span v-for="(item,index) in recordInfo.b">
              <img style="width: 3%" :src="brandImg[item.m]">:{{brandList[item.n]}},
            </span> 闲：
      <span v-for="(item,index) in recordInfo.p">
              <img style="width: 3%" :src="brandImg[item.m]">:{{brandList[item.n]}},
            </span>）
      </Col>
      <Col v-else :span="12">
        游戏结果：{{recordInfo.roundResult}}
      </Col>
    </Row>
  </div>
</template>

<script type="text/ecmascript-6">
  import dayjs from "dayjs";
  import { httpRequest } from '@/service/index'

export default {
  name: 'RealLifeModal',
  props:['dataProp'],
  data () {
    return {
      dialogLoading: false,
      recordInfo: {}, // 获取战绩所有对象
      propInfo: {}, // 组件信息
      gameType: '', // 真人视讯下游戏类别
      winLostState:['取消','输','赢','和'],
      brandImg:{
        'C': 'https://d38xgux2jezyfx.cloudfront.net/recordImg/brand/C.png',
        'D': 'https://d38xgux2jezyfx.cloudfront.net/recordImg/brand/D.png',
        'H': 'https://d38xgux2jezyfx.cloudfront.net/recordImg/brand/H.png',
        'S': 'https://d38xgux2jezyfx.cloudfront.net/recordImg/brand/S.png'
      },// 牌型
      brandList:{
        '1': 'A',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '10': '10',
        '11': 'J',
        '12': 'Q',
        '13': 'k'
      },//牌型点数
      brandResult:{
        '0': '庄',
        '1': '闲',
        '2': '和',
        '3': '庄、庄对',
        '4': '庄、闲对',
        '5': '和、庄对',
        '6': '和、闲对',
        '7': '闲、庄对',
        '8': '闲、闲对',
        '9': '庄、庄对、闲对',
        '10': '和、庄对、闲对',
        '11': '闲、庄对、闲对'
      }//牌型点数
    }
  },
  methods:{
    formatterTime (row) {
      return dayjs(row).format("YYYY-MM-DD HH:mm:ss")
    }, // 格式化创建时间
    getRealLife() {
      if(this.dialogLoading) return
      this.dialogLoading = true
      httpRequest('post','/player/bill/record',{
        userName: localStorage.playerName,
        betId: this.dataProp.businessKey
      }).then(
        result => {
          this.gameType =  result.data.gameId
          this.recordInfo = result.data
          this.recordInfo.roundResult = JSON.parse(this.recordInfo.roundResult)
          this.recordInfo.betNum = this.recordInfo.betDetail && this.recordInfo.betDetail.betNum
          this.recordInfo.p = this.recordInfo.roundResult.p
          this.recordInfo.b = this.recordInfo.roundResult.b
          this.recordInfo.bpresult  = this.recordInfo.roundResult.bpresult
          this.dialogLoading = false
        }
      )
    }
  }
}
</script>

<style scoped lang="less" type="text/less">

  .realLife_modal{

    .record-row {
      padding: 20px;
      padding-left: 50px;
      text-align: left;
    }
    .-row-left {
      padding-left: 100px;
    }
  }
</style>
