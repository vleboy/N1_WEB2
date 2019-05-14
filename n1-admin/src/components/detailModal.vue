<template>
  <div class="realLife_modal">
    <Row class="record-row">
      <Col :span="24" class="-row-title">游戏名称：{{detailInfo.gameName}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">供应商标识：{{detailInfo.companyIden}}</Col>
      <Col :span="12" class="-row-left">游戏ID：{{detailInfo.kindId}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">游戏状态：{{detailInfo.gameStatus ? '正常' : '下线'}}</Col>
      <Col :span="12" class="-row-left">游戏简介：{{detailInfo.gameRecommend == 'NULL!' ? '' : detailInfo.gameRecommend}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="12">创建时间：{{formatterTime(detailInfo.createdAt)}}</Col>
    </Row>
     <Row class="record-row">
      <Col :span="24">网页地址：{{detailInfo.gameLink || '暂无'}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="24">图片链接（亚马逊）：{{detailInfo.gameImg}}</Col>
    </Row>
    <Row class="record-row">
      <Col :span="24">图片链接（阿里云）：{{detailInfo.gameImgAli || '无'}}</Col>
    </Row>
  </div>
</template>

<script type="text/ecmascript-6">
  import dayjs from "dayjs";

export default {
  name: 'detailModal',
  props:['dataProp'],
  data () {
    return {

    }
  },
  computed: {
    detailInfo () {
      console.log(this.dataProp);
      
      return this.dataProp
    }
  },
  methods:{
    formatterTime (row) {
      return dayjs(row).format("YYYY-MM-DD HH:mm:ss")
    } // 格式化创建时间
  }
}
</script>

<style scoped lang="less" type="text/less">

  .realLife_modal{

    .-row-title {
      font-size: 18px;
      font-weight: bold;
      text-align: center;
    }
    .record-row {
      padding: 20px;
      padding-left: 50px;
      text-align: left;
    }
    .-row-left {
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
      padding-left: 100px;
    }
  }
</style>
