<template>
  <div class="realLife_modal">
    <Row class="record-row">
      <Col :span="12">运动名称：{{roundResult.SPORT}}</Col>
      <Col :span="12" class="-row-left">投注类型：{{betType[roundResult.BETTYPE]}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">投注模式：{{betMode[roundResult.BETMODE]}}</Col>
      <Col :span="12" class="-row-left">比赛名称：{{roundResult.EVNAME}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">押注队伍：{{roundResult.SELNAME}}</Col>
      <Col :span="12" class="-row-left">投注选项：{{betTypeId[roundResult.BETTYPEID]}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">赔率：{{roundResult.ODDS}}</Col>
      <Col :span="12" class="-row-left">盘口：{{roundResult.VALUE || '无'}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">盘口格式：{{oddsFormat[roundResult.ODDFORMAT]}}</Col>
      <Col :span="12" class="-row-left">投注时间：{{formatterTime(sportsInfo.betTime)}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">投注金额：{{sportsInfo.betAmount}}</Col>
      <Col :span="12" class="-row-left" v-if="sportsInfo.betAmount">返奖金额：{{sportsInfo.winAmount}}</Col>
    </Row>
    <Row class="record-row" v-if="sportsInfo.betAmount">
      <Col :span="12">输赢金额：
        <span :class="{'-p-green': sportsInfo.winloseAmount>0, '-p-red':sportsInfo.winloseAmount<0}">
          {{sportsInfo.winloseAmount}}
        </span>
      </Col>
      <Col :span="12" class="-row-left">局输赢状态：{{winLostState[sportsInfo.roundStatus]}}</Col>
    </Row>
    <Spin size="large" fix v-if="dialogLoading">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>

<script type="text/ecmascript-6">
  import dayjs from "dayjs";
  import { httpRequest } from '@/service/index'

export default {
  props:['dataProp'],
  data () {
    return {
      dialogLoading: false,
      sportsInfo: {}, // 获取战绩所有对象
      roundResult: {}, // 获取战绩所有对象
      propInfo: {}, // 组件信息
      winLostState:['取消','输','赢','和'],
      betType:{
        1: '单式投注',
        2: '乐透',
        3: '连串过关',
      },//投注状态
      betMode:{
        '0': '桌面网站',
        '1': '手机版',
        '2': 'NA',
        '3': '苹果系统',
        '4': '安卓系统',
        '5': '',
        '6': '客户端',
        '7': '易胜博新安卓app',
        '8': '易胜博新苹果app',
      },//投注模式
      oddsFormat:{
        '0': '欧洲盘',
        '3': '马来盘',
        '4': '印尼盘',
        '5': '香港盘'
      },//盘口格式
      betTypeId:{
        1: "独赢",
        2: "让分盘",
        3: "亚洲让分盘",
        4: "总分以上或以下",
        5: "首名入球球员",
        6: "首支开球球队",
        7: "首支入球球队",
        8: "首张黄卡",
        9: "半全场",
        10: "正确比分",
        11: "净赢比分数",
        12: "购买点数",
        13: "固定赔率",
        14: "菜池",
        15: "位置连赢",
        16: "调头位置连赢",
        17: "连赢",
        18: "三重彩",
        19: "搅珠",
        20: "总数上盘",
        21: "总数下盘",
        22: "总数单数",
        23: "总数双数",
        24: "总数范围",
        25: "总数上盘(包括特别号码)",
        26: "总数下盘(包括特别号码)",
        27: "总数单数(包括特别号码)",
        28: "总数双数(包括特别号码)",
        29: "总数范围(包括特别号码)",
        30: "单号颜色",
        31: "单数",
        32: "双数",
        33: "上盘",
        34: "下盘",
        35: "单号范围",
        36: "单号号码",
        37: "特别号码",
        38: "特别号码上盘",
        39: "特别号码下盘",
        40: "特别号码单数",
        41: "特别号码双数",
        42: "特别号码范围",
        43: "特别号码颜色",
        44: "特别号码总数上盘",
        45: "特别号码总数下盘",
        46: "特别号码总数单数",
        47: "特别号码总数双数",
        48: "特别号码总数范围",
        49: "定位连赢",
        50: "晋级队伍",
        51: "连赢",
        52: "每局投注",
        53: "每回合投注",
        54: "生肖",
        55: "三组後位数",
        56: "四组後位数",
        57: "颜色",
        58: "单生肖",
        59: "足球净赢比分数",
        60: "单队得分总数大小盘",
        61: "单数/双数",
        62: "-",
        64: "最高节",
        65: "蓝球净赢比分数",
        66: "蓝球半全场"
      },//投注选项
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
          this.sportsInfo = result.data
          this.roundResult = this.sportsInfo.betDetail
          if (this.sportsInfo.winloseAmount > 0) {
            this.sportsInfo.roundStatus = '2'
          } else if (this.sportsInfo.winloseAmount < 0) {
            this.sportsInfo.roundStatus = '1'
          } else {
            this.sportsInfo.roundStatus = '3'
          }
        }
      ).finally(()=>{
        this.dialogLoading = false
      })
    }
  }
}
</script>

<style scoped lang="less" type="text/less">

  .realLife_modal{
    font-size: 15px;
    .record-row {
      padding: 10px;
      padding-left: 20px;
      text-align: left;
    }
    .-row-left {
      /*padding-left:50px;*/
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
    .-p-green{
      color: #00CC00
    }
    .-p-red{
      color: #FF3300
    }
  }
</style>
