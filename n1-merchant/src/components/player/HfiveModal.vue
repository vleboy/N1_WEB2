<template>
    <div class="h5">
        <div class="top">
            <p class="head_id">
                <label class="orange">BetId</label>
                <span>{{dataProp.betId}}</span>
            </p>
            <div class="count">
                <div class="item">
                    <p>{{dataProp.betAmount |format}}</p>
                    <p class="orange">Bet(CNY)</p>
                </div>
                <div class="item">
                    <p>{{dataProp.winloseAmount |format}}</p>
                    <p class="orange">Win/Lose(CNY)</p>
                </div>
                <div class="item">
                    <p>{{result.userInfo.balance|format}}</p>
                    <p class="orange">Balance(CNY)</p>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="info">
                <p class="orange">{{result.userInfo.mode}}</p>
                <p >Bet size {{result.userInfo.baseBet}}</p>
                <div v-if="result.treasureData">
                    <Row>
                        <Col :span="12"><span class="orange">鸿福巨奖:</span> {{result.treasureData.payTable[0] |format}} </Col>
                        <Col :span="12"><span class="orange">财运大奖:</span> {{result.treasureData.payTable[1] |format}} </Col>
                    </Row>
                    <Row>
                        <Col :span="12"><span class="orange">福运中奖:</span> {{result.treasureData.payTable[2] |format}} </Col>
                        <Col :span="12"><span class="orange">喜乐小奖:</span> {{result.treasureData.payTable[3] |format}} </Col>
                    </Row>
                </div>
            </div>
            <ul v-if="result.treasureData" class="treasureimgs">
                <li v-for="(item,index) of ImgList" :key="index">
                    <img class="img" :src="item" alt="oops">
                </li>
            </ul>
            <ul v-else class="imgs">
                <li v-for="(item,index) of ImgList" :key="index">
                    <img class="img" :src="item" alt="oops">
                </li>
            </ul>
            <p class="sepreate">PayOut</p>
        </div>
        <div class="detail">
            <div v-if="result.treasureData">
                <Row  style="height:65px;lineHeight:65px">
                    <Col :span="12"><img class="treasureImg" :src="treasureImg" alt=""> </Col>
                    <Col :span="12"><span>中奖:</span> {{result.totalGold|format}} </Col>
                </Row>
            </div>
            <div v-else>
                <ul v-if="result.winGrid.length>0">
                    <li v-for="(item,index) of winGrid" :key="index">
                        <Row style="height:38px">
                            <Col :span="4" style="lineHeight:36px">{{index+1}}</Col>
                            <Col :span="12" style="textAlign:left">
                            <div class="line">
                                <div v-for="(e,index) of item.line" :class="{'on':e==1,'off':e==0}"></div>
                            </div>
                            </Col>
                            <Col :span="8">
                            <p>CNY {{item.gold|format}}</p>
                            <p class="gray" v-if="item.multiplier!='1'">CNY {{item.baseGold}} x {{item.multiplier}} </p>
                            </Col>
                        </Row>
                    </li>
                </ul>
                <p style="paddingBottom:10px" v-else>No Winning Combination</p>
            </div>
        </div>
         <Spin size="large" fix v-if="spin">
          <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
          <div>加载中...</div>
        </Spin>
    </div>
</template>
<script>
export default {
  name: "",
  components: {},
  filters: {
      format(v) {
          if(v||v==0){
              return v.toLocaleString();
          }
    }
  },
  props: {
    dataProp: Object
  },
  data() {
    return {};
  },
  computed: {
    result() {
      return this.dataProp.roundResult;
    },
    spin(){
      return this.$store.state.loading
    },
    treasureImg(){
      let result = this.result.treasureData;
      let gameId=this.dataProp.gameId;
      let baseUrl = `http://img.na77.com/adminh5/${gameId}/treasure`;
      baseUrl=baseUrl+'_'+result.winIndex+'.png';
      return baseUrl
    },
    ImgList() {
      let result = this.result;
      let gameId=this.dataProp.gameId;
      let imgResult = [];
      if (result.treasureData) {
        let grid = result.treasureData.grid;
        let baseUrl = `http://img.na77.com/adminh5/${gameId}/treasure`;
        for (let item of grid) {
          let img = baseUrl + "_" + item + ".png";
          imgResult.push(img);
        }
        return imgResult;
      } else {
        let grid = result.viewGrid;
        let baseUrl = `http://img.na77.com/adminh5/${gameId}/Symbol`;
        for (let item of grid) {
          let img = baseUrl + "_" + item + ".png";
          imgResult.push(img);
        }
        return imgResult;
      }
    },
    winGrid() {
      return this.result.winGrid;
    }
  },
  watch: {},
  created() {
    this.$emit('loading')
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.h5 {
  text-align: center;
  li {
    list-style: none;
  }
  .orange {
    color: #ff6f00;
  }
  .gray {
    color: #999;
  }
  .top {
    background-color: #262a2d;
    color: #9f9679;
    padding-bottom: 10px;
    .head_id {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .count {
      display: flex;
      justify-content: center;
      .item {
        width: 33%;
      }
    }
  }
  .content {
    background-color: #363334;
    color: #9f9679;
    .imgs {
      padding: 10px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      li {
        width: 17%;
      }
      .img {
        width: 100%;
      }
    }
    .treasureimgs{
      padding: 20px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      li {
        width: 22%;
      }
      .img {
        width: 100%;
      }
    }
    .sepreate {
      padding-bottom: 10px;
    }
  }
  .detail {
    background-color: #363334;
    color: #9f9679;
    .treasureImg{
        width: 60px;
    }
    .line {
      border: 1px solid #f30;
      width: 52px;
      height: 36px;
      display: flex;
      flex-wrap: wrap;
    }
    .on,
    .off {
      width: 10px;
      height: 10px;
    }
    .on {
      background-color: #ff6f00;
      border: 1px solid #ccc;
    }
    .off {
      background-color: #363334;
    }
  }
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
