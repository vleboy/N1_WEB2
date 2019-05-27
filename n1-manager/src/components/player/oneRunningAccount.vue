<template>
  <div>
    <Row class="g-text-left" style="margin-bottom: 15px">
      <Col span="6">交易时间：{{formatterTime(dataProp.createdAt)}}</Col>
      <Col span="6">交易类型：{{dataProp.typeName}}</Col>
    </Row>
    <Row class="g-text-left" style="margin-bottom: 15px">
      <Col span="6">结算前余额：{{formatPoints(dataProp.originalAmount)}}</Col>
      <Col span="4">操作金额：{{formatPoints(dataProp.betAmount)}}</Col>
      <Col span="4">返还金额：{{formatPoints(dataProp.retAmount)}}</Col>
      <Col span="4">净利润：
        <span :class="{'-p-green':dataProp.profitAmount>0,'-p-red':dataProp.profitAmount<0}">{{formatPoints(dataProp.profitAmount)}}</span>
      </Col>
      <!--<Col span="6">结算余额：-->
        <!--<span :class="{'-p-green':dataProp.balance>0,'-p-red':dataProp.balance<0}">{{formatPoints(dataProp.balance)}}</span>-->
      <!--</Col>-->
    </Row>
    <Table :columns="columns" :data="dataList"></Table>
  </div>
</template>

<script type="text/ecmascript-6">
  import { thousandFormatter } from '@/config/format'
  import dayjs from "dayjs";

  export default {
    name: 'oneRunningAccount',
    props:['dataProp'],
    data () {
      return {
        typeList: {
          '3': '下注',
          '4': '返奖',
          '5': '返还',
          '10': '系统升级原账结余',
          '11': '中心钱包',
          '12': '代理操作',
          '13': '商城'
        },
        columns: [
          {
            title: '流水号',
            key: 'sn'
          },
          {
            title: '交易时间',
            key: '',
            render: (h, params) => {
              return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"));
            }
          },
          {
            title: '交易类型',
            key: 'msn',
            render: (h, params) => {
              return h('span', this.typeList[params.row.type])
            }
          },
           {
          title: "游戏ID",
          key: "gameId"
          },
          {
            title: '帐变前余额',
            key: 'originalAmount',
            render: (h, params) => {
              return h('span', thousandFormatter(params.row.originalAmount))
            }
          },
          {
            title: '帐变金额',
            key: '',
            render: (h, params) => {
              return h('span', {
                class: {
                  '-p-green': params.row.amount >= 0,
                  '-p-red': params.row.amount < 0
                },
              }, thousandFormatter(params.row.amount))
            }
          },
          {
            title: '帐变后金额',
            key: '',
            render: (h, params) => {
              return h('span', thousandFormatter(params.row.balance))
            }
          }
        ],
      }
    },
    computed:{
      dataList(){
       return this.dataProp.content
      }
    },
    methods:{
      formatterTime (row) {
        return row ? dayjs(row).format("YYYY-MM-DD HH:mm:ss") : '-'
      }, // 格式化创建时间
      formatPoints (num) {
        return thousandFormatter(num)
      } // 千位符格式化
    }
  }
</script>

<style scoped lang="less" type="text/less">
  .-p-green{color: #00CC00}
  .-p-red{color: #FF3300}
</style>
