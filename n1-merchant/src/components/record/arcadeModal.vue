<template>
  <div class="arcade_modal">
    <div class="arcade_modal_bg" :class="backgroundUrl">
      <div class="arcade_modal_head" v-if="recordArray.length">
        <img class="head_img" :src="recordAllObj.winType">
        <span class="head_text">{{recordAllObj.userWin}}</span>
      </div>
      <div class="arcade_modal_content">
        <div v-for="(data,index) in recordArray" :key="index" class="arcade_modal_wrap">
          <div v-for="(item,indexChild) in data" :key="indexChild" class="arcade_modal_low"
               :style="{'background-image': 'url(' + item.img + ')','background-repeat':'no-repeat','background-size':'100%'}">
            <div class="item_left_all" :class="item_left">x{{item.rate||0}}</div>
            <div class="item_right">
              <div class="right_top">{{item.total||0}}</div>
              <div class="right_bottom">{{item.bet||0}}</div>
            </div>
          </div>
          <div v-for="(item,indexChild) in data" :key="indexChild"  class="arcade_modal_low " :class="{'layer':!item.isWin}"></div>
        </div>
      </div>
      <div class="arcade_modal_footer">
        <div class="footer-div footer_left">
          <span>{{recordAllObj.totalBets||0}}</span>
        </div>
        <div class="footer-div footer_center">
          <span>{{recordAllObj.userWin||0}}</span>
        </div>
        <div class="footer-div footer_right">
          <span>1</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatUserName, thousandFormatter } from '@/config/format'
import { httpRequest } from '@/service/index'

export default {
  name: 'ArcadeModal',
  props:['dataProp'],
  data () {
    return {
      recordAllObj: {}, // 获取战绩所有对象
      propInfo: {}, // 组件信息
      roundRates: [], // 赔率
      roundBets: [], // 下注数
      recordArray: [],
      roundIconSLXY:[],
      roundIconJSSK:[],
      roundIconFKSG:[],
      winResultObjSLXY: {},
      winResultObjJSSK: {},
      winResultObjFKSG: {},
      imgPrefix: 'https://d38xgux2jezyfx.cloudfront.net/recordImg/'
    }
  },
  computed: {
    backgroundUrl () {
      let classType = {}
      classType = {
        'record-slxy': this.recordAllObj.gameId == '50001',
        'record-jssk': this.recordAllObj.gameId == '50002',
        'record-fksg': this.recordAllObj.gameId == '50003',
        'record-bsmf': this.recordAllObj.gameId == '50004'
      }
      return classType
    },
    item_left () {
      let item_left = {}
      item_left = {
        'item_left_slxy': this.recordAllObj.gameId == '50001',
        'item_left_jssk': this.recordAllObj.gameId == '50002',
        'item_left_fksg': this.recordAllObj.gameId == '50003',
        'item_left_bsmf': this.recordAllObj.gameId == '50004'
      }
      return item_left
    },
    gameTypeIcon () {
      let resultIcon = {}
      resultIcon  = {
        '50001': this.roundIconSLXY,
        '50002': this.roundIconJSSK,
        '50003': this.roundIconFKSG,
        '50004': this.roundIconBSMF
      }
      return resultIcon
    },
    gameTypeResult () {
      let resultSuc = {}
      resultSuc  = {
        '50001': this.winResultObjSLXY,
        '50002': this.winResultObjJSSK,
        '50003': this.winResultObjFKSG,
        '50004': this.winResultObjBSMF
      }
      return resultSuc
    }
  },
  methods:{
    init() {
      this.roundIconSLXY = [
        {
          imgOne: `${this.imgPrefix}slxy/1hong.png`,
          imgTwo: `${this.imgPrefix}slxy/1hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/1huang.png`,
          imgTwo:`${this.imgPrefix}slxy/1huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/1lv.png`,
          imgTwo:`${this.imgPrefix}slxy/1lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/2hong.png`,
          imgTwo:`${this.imgPrefix}slxy/2hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/2huang.png`,
          imgTwo:`${this.imgPrefix}slxy/2huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/2lv.png`,
          imgTwo:`${this.imgPrefix}slxy/2lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/3hong.png`,
          imgTwo:`${this.imgPrefix}slxy/3hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/3huang.png`,
          imgTwo:`${this.imgPrefix}slxy/3huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/3lv.png`,
          imgTwo:`${this.imgPrefix}slxy/3lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/4hong.png`,
          imgTwo:`${this.imgPrefix}slxy/4hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/4huang.png`,
          imgTwo:`${this.imgPrefix}slxy/4huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/4lv.png`,
          imgTwo:`${this.imgPrefix}slxy/4lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/lanmogu.png`,
          imgTwo:`${this.imgPrefix}slxy/lanmogu_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/baoxiang.png`,
          imgTwo:`${this.imgPrefix}slxy/baoxiang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}slxy/hongmogu.png`,
          imgTwo:`${this.imgPrefix}slxy/hongmogu_x.png`
        }
      ]
      this.roundIconJSSK = [
        {
          imgOne:`${this.imgPrefix}jssk/1hong.png`,
          imgTwo:`${this.imgPrefix}jssk/1hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/1huang.png`,
          imgTwo:`${this.imgPrefix}jssk/1huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/1lv.png`,
          imgTwo:`${this.imgPrefix}jssk/1lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/2hong.png`,
          imgTwo:`${this.imgPrefix}jssk/2hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/2huang.png`,
          imgTwo:`${this.imgPrefix}jssk/2huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/2lv.png`,
          imgTwo:`${this.imgPrefix}jssk/2lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/3hong.png`,
          imgTwo:`${this.imgPrefix}jssk/3hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/3huang.png`,
          imgTwo:`${this.imgPrefix}jssk/3huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/3lv.png`,
          imgTwo:`${this.imgPrefix}jssk/3lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/4hong.png`,
          imgTwo:`${this.imgPrefix}jssk/4hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/4huang.png`,
          imgTwo:`${this.imgPrefix}jssk/4huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/4lv.png`,
          imgTwo:`${this.imgPrefix}jssk/4lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/D.png`,
          imgTwo:`${this.imgPrefix}jssk/D_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/P.png`,
          imgTwo:`${this.imgPrefix}jssk/P_x.png`
        },
        {
          imgOne:`${this.imgPrefix}jssk/R.png`,
          imgTwo:`${this.imgPrefix}jssk/R_x.png`
        }
      ]
      this.roundIconFKSG = [
        {
          imgOne:`${this.imgPrefix}fksg/1hong.png`,
          imgTwo:`${this.imgPrefix}fksg/1hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/1huang.png`,
          imgTwo:`${this.imgPrefix}fksg/1huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/1lv.png`,
          imgTwo:`${this.imgPrefix}fksg/1lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/2hong.png`,
          imgTwo:`${this.imgPrefix}fksg/2hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/2huang.png`,
          imgTwo:`${this.imgPrefix}fksg/2huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/2lv.png`,
          imgTwo:`${this.imgPrefix}fksg/2lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/3hong.png`,
          imgTwo:`${this.imgPrefix}fksg/3hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/3huang.png`,
          imgTwo:`${this.imgPrefix}fksg/3huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/3lv.png`,
          imgTwo:`${this.imgPrefix}fksg/3lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/4hong.png`,
          imgTwo:`${this.imgPrefix}fksg/4hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/4huang.png`,
          imgTwo:`${this.imgPrefix}fksg/4huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/4lv.png`,
          imgTwo:`${this.imgPrefix}fksg/4lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/shuangxing.png`,
          imgTwo:`${this.imgPrefix}fksg/shuangxing_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/bar.png`,
          imgTwo:`${this.imgPrefix}fksg/bar_x.png`
        },
        {
          imgOne:`${this.imgPrefix}fksg/lingdang.png`,
          imgTwo:`${this.imgPrefix}fksg/lingdang_x.png`
        }
      ]
      this.roundIconBSMF = [
        {
          imgOne:`${this.imgPrefix}bsmf/1hong.png`,
          imgTwo:`${this.imgPrefix}bsmf/1hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/1huang.png`,
          imgTwo:`${this.imgPrefix}bsmf/1huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/1lv.png`,
          imgTwo:`${this.imgPrefix}bsmf/1lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/2hong.png`,
          imgTwo:`${this.imgPrefix}bsmf/2hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/2huang.png`,
          imgTwo:`${this.imgPrefix}bsmf/2huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/2lv.png`,
          imgTwo:`${this.imgPrefix}bsmf/2lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/3hong.png`,
          imgTwo:`${this.imgPrefix}bsmf/3hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/3huang.png`,
          imgTwo:`${this.imgPrefix}bsmf/3huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/3lv.png`,
          imgTwo:`${this.imgPrefix}bsmf/3lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/4hong.png`,
          imgTwo:`${this.imgPrefix}bsmf/4hong_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/4huang.png`,
          imgTwo:`${this.imgPrefix}bsmf/4huang_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/4lv.png`,
          imgTwo:`${this.imgPrefix}bsmf/4lv_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/jiezhi.png`,
          imgTwo:`${this.imgPrefix}bsmf/jiezhi_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/huangguan.png`,
          imgTwo:`${this.imgPrefix}bsmf/huangguan_x.png`
        },
        {
          imgOne:`${this.imgPrefix}bsmf/xianglian.png`,
          imgTwo:`${this.imgPrefix}bsmf/xianglian_x.png`
        }
      ]
      this.winResultObjSLXY = {
        '1': `${this.imgPrefix}slxy/slxy_youwin.png` ,
        '2': `${this.imgPrefix}slxy/slxy_bigwin.png` ,
        '3': `${this.imgPrefix}slxy/slxy_magic.png` ,
        '4': `${this.imgPrefix}slxy/slxy_super.png`
      }
      this.winResultObjJSSK = {
        '1': `${this.imgPrefix}jssk/bcbm_youwin.png` ,
        '2': `${this.imgPrefix}jssk/bcbm_bigwin.png` ,
        '3': `${this.imgPrefix}jssk/bcbm_magic.png` ,
        '4': `${this.imgPrefix}jssk/bcbm_super.png`
      }
      this.winResultObjFKSG = {
        '1': `${this.imgPrefix}fksg/fksg_youwin.png` ,
        '2': `${this.imgPrefix}fksg/fksg_bigwin.png` ,
        '3': `${this.imgPrefix}fksg/fksg_magic.png` ,
        '4': `${this.imgPrefix}fksg/fksg_super.png`
      }
      this.winResultObjBSMF = {
        '1': `${this.imgPrefix}fksg/fksg_youwin.png` ,
        '2': `${this.imgPrefix}fksg/fksg_bigwin.png` ,
        '3': `${this.imgPrefix}fksg/fksg_magic.png` ,
        '4': `${this.imgPrefix}fksg/fksg_super.png`
      }
    },
    getRecordSLXY() {
      this.init()
      this.recordArray = []
      httpRequest('post','/player/bill/record',{
        userName: localStorage.playerName,
        betId: this.dataProp.businessKey
      }).then(
        result => {
          this.recordAllObj = result.data.record;

          if(this.recordAllObj.userWin<'100'){
            this.recordAllObj.winType = this.gameTypeResult[this.recordAllObj.gameId][1]
          } else if (this.recordAllObj.userWin >= '100' && this.recordAllObj.userWin < '500') {
            this.recordAllObj.winType = this.gameTypeResult[this.recordAllObj.gameId][2]
          } else if (this.recordAllObj.userWin >= '500' && this.recordAllObj.userWin < '1000') {
            this.recordAllObj.winType = this.gameTypeResult[this.recordAllObj.gameId][3]
          } else if (this.recordAllObj.userWin >= '1000') {
            this.recordAllObj.winType = this.gameTypeResult[this.recordAllObj.gameId][4]
          }
          // 组装渲染的列表
          for (let [index,item] of this.recordAllObj.roundBets.entries()) {
            this.recordArray.push({
              id: index+1,
              bet: item,
              rate: this.recordAllObj.roundRates[index],
              total: this.recordAllObj.roundBetsTotal[index],
              isWin: false,
              img: item > 0  ? this.gameTypeIcon[this.recordAllObj.gameId][index].imgTwo : this.gameTypeIcon[this.recordAllObj.gameId][index].imgOne
            })
          }
          // 判断中奖位置
          for (let data of this.recordAllObj.goalIndex){
            for (let data1 of this.recordArray){
              if (data == data1.id){
                data1.isWin = true
              }
            }
          }
          this.recordArray = this.split_array(this.recordArray,3);
        }
      )
    },
    split_array (arr, len) {
      var a_len = arr.length;
      var result = [];
      for(var i=0;i<a_len;i+=len){
        result.push(arr.slice(i,i+len));
      }
      return result;
    }
  }
}
</script>

<style scoped lang="less" type="text/less">
  .arcade_modal{
    .arcade_modal_bg{
      background-repeat:no-repeat!important;
      background-size: 100% auto!important;
      height: 500px;
      position: relative;
    }
    .record-slxy{
      background: url("https://d38xgux2jezyfx.cloudfront.net/recordImg/slxy/slxy_bg.jpg");
    }
    .record-jssk{
      background: url("https://d38xgux2jezyfx.cloudfront.net/recordImg/jssk/jssk_bg.jpg");
    }
    .record-fksg{
      background: url("https://d38xgux2jezyfx.cloudfront.net/recordImg/fksg/fksg_bg.jpg");
    }
    .record-bsmf{
      background: url("https://d38xgux2jezyfx.cloudfront.net/recordImg/bsmf/bsmf_bg.jpg");
    }
    .arcade_modal_head{
      position: absolute;
      width: 100%;
      top: 10%;

      .head_img{
        width: 42%;
      }
      .head_text{
        font-size: 5.8rem;
        color: #ffffff;
        margin-left: 20px;
      }
    }
    .arcade_modal_content{
      position: absolute;
      top:34%;
      width: 100%;

      /*.no-win{*/
        /*background-color: #10171d;*/
        /*opacity: 0.7;*/
      /*}*/

      .layer{
        background-color: #050708;
        position: relative;
        top: -255px;
        opacity: 0.4;
      }
    }
    .arcade_modal_wrap{
      display: inline-block;
      overflow:hidden;

      .item_left_all{
        float: left;
        color: #eca420;
        position: relative;
      }
      .item_left_slxy{
        top: 66px;
        left: 38px;
      }
      .item_left_jssk{
        top: 60px;
        left: 26px;
      }
      .item_left_fksg{
        top: 64px;
        left: 32px;
      }
      .item_left_bsmf{
        top: 53px;
        left: 28px;
        color: #fbe806;
      }
      .item_right{
        width: 100px;
        float: right;
        position: relative;
        top: 16px;
        font-size: 16px;
      }

      .right_top{
        color: #01deff;
        margin-bottom:8px;
      }

      .right_bottom{
        color: #ffffff;
      }
    }
    .arcade_modal_low{
      display: block;
      width: 170px;
      height: 84px;
    }
    .arcade_modal_footer{
      position: absolute;
      bottom:34px;
      font-size: 18px;
      color: #e4e4e4;
      width: 100%;
      .footer-div{
        display: inline-block;
        width: 100px;
      }
    }
    .footer_left{
      position: absolute;
      left: 85px;
    }
    .footer_center{
      position: absolute;
      left: 184px;
    }
    .footer_right{
      position: absolute;
      right: 126px;
    }
  }
</style>
