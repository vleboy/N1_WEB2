<template>
  <div class="prize">
    <div class="top">
      <p class="head_id">
        <label class="orange">BetId</label>
        <span>{{hProp.betId}}</span>
      </p>
      <div class="count">
        <div class="item">
          <p>{{hProp.betAmount |format}}</p>
          <p class="orange">Bet(CNY)</p>
        </div>
        <div class="item">
          <p>{{hProp.winloseAmount |format}}</p>
          <p class="orange">Win/Lose(CNY)</p>
        </div>
        <div class="item">
          <p>{{balance|format}}</p>
          <p class="orange">Balance(CNY)</p>
        </div>
      </div>
    </div>
    <div class="fudai" v-if="fudai">
      <div class="fudai_number">
        <img
          v-for="(item,index) in numberList"
          :key="index"
          :src="item"
          alt="oops"
          class="number_img"
        >
      </div>
    </div>
    <div class="mys" v-else>
      <div class="number">
        <img
          v-for="(item,index) in numberList"
          :key="index"
          :src="item"
          alt="oops"
          class="number_img"
        >
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
  name: "secretBonus",
  //   components: {},
    filters: {
      format(v) {
          if(v||v==0){
              return v.toLocaleString();
          }
    }
    },
  props: {
   hProp:Object,
   fudai:{
     type:Boolean,
     default:false
   }
  },
  data() {
    return {};
  },
  computed: {
    spin(){
      return this.$store.state.loading
    },
    numberList() {
      let secretBonus = this.hProp.winloseAmount.toFixed(2)
      let list = secretBonus.split("");
      let imgList;
      if (this.fudai) {
        imgList = list.map(item => {
          if (item == ".") {
            return "http://img.na77.com/adminh5/yaoqianshu/_.png";
          }
          return `http://img.na77.com/adminh5/yaoqianshu/${item}.png`;
        });
      } else {
        imgList = list.map(item => {
          if (item == ".") {
            return "http://img.na77.com/adminh5/common/_.png";
          }
          return `http://img.na77.com/adminh5/common/${item}.png`;
        });
      }
      return imgList;
    },
    balance(){
      return this.hProp.roundResult.userInfo.balance
    }
  },
  //   watch: {},
    created(){
    this.$emit('loading')
  }
  //   methods: {}
};
</script>
<style lang="less" scoped>
.mys {
  height: 300px;
  background: url(http://img.na77.com/adminh5/common/bg_bouns.png) no-repeat;
  background-size: cover;
}
.prize{
  text-align: center;
  background-color: #262a2d;
  .orange {
    color: #ff6f00;
  }
   .top {
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
}
.number {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 160px;
}
.fudai_number {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 165px;
}
.number_img {
  width: 50px;
}
.fudai {
  height: 300px;
  background: url(http://img.na77.com/adminh5/yaoqianshu/bg_bouns.png) no-repeat;
  background-size: contain;
}
.demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
