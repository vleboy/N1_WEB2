<template>
  <div>
    <Row class="g-text-left" style="margin-bottom: 15px">
      <Col span="8">{{$t('playerDetail.transactionTime')}}：{{formatterTime(dataProp.createdAt)}}</Col>
      <Col span="8">{{$t('playerDetail.transactionType')}}：{{dataProp.typeName}}</Col>
    </Row>
    <Row class="g-text-left" style="margin-bottom: 15px">
      <Col span="8">{{$t('playerDetail.preBalance')}}：{{formatPoints(dataProp.originalAmount)}}</Col>
      <Col span="6">{{$t('playerDetail.operateAccount')}}：{{formatPoints(dataProp.betAmount)}}</Col>
      <Col span="6">{{$t('playerDetail.returnAccount')}}：{{formatPoints(dataProp.retAmount)}}</Col>
      <Col span="4">{{$t('playerDetail.netProfit')}}：
        <span :class="{'-p-green':dataProp.profitAmount>0,'-p-red':dataProp.profitAmount<0}">{{formatPoints(dataProp.profitAmount)}}</span>
      </Col>

    </Row>
    <Table :columns="columns" :data="dataList">
      <template slot-scope="{row, index}" slot="dateTime">
        <span>{{dateTimeConfig(row)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="type">
        <span>{{typeConfig(row)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="beforeAmount">
        <span>{{beforeAmountConfig(row)}}</span>
      </template>
      <template slot-scope="{row, index}" slot="amount">
        <span :style="{color: amountConfig(row).color}">{{amountConfig(row).amount}}</span>
      </template>
      <template slot-scope="{row, index}" slot="afterAmount">
        <span>{{afterAmountConfig(row)}}</span>
      </template>
    </Table>
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
        
        columns: [
          {
            title: '流水号',
            align: 'center',
            key: 'sn',
            renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '流水号' : 'Serial Number'
            )
          }
          },
          {
            title: '交易时间',
            align: 'center',
            slot: 'dateTime',
            renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易时间' : 'Time'
            )
          }
          },
          {
            title: '交易类型',
            align: 'center',
            slot: 'type',
            renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '交易类型' : 'Type'
            )
          }
          },
          {
            title: '帐变前余额',
            align: 'center',
            slot: 'beforeAmount',
            renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '帐变前余额' : 'Pre Balance'
            )
          }
          },
          {
            title: '帐变金额',
            align: 'center',
            slot: 'amount',
            renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '操作' : 'Amount'
            )
          }
          },
          {
            title: '帐变后金额',
            align: 'center',
            slot: 'afterAmount',
            renderHeader: (h, params) => {
            return h(
              'span',
              this.$store.state.language == 'zh' ? '帐变后金额' : 'Balance'
            )
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
      //交易时间
      dateTimeConfig(row) {
        return dayjs(row.createdAt).format("YYYY-MM-DD HH:mm:ss")
      },
      //交易类型
      typeConfig(row) {
        let typeList = {}
        if (this.$store.state.language == 'zh') {
          typeList =  {
            '3': '下注',
            '4': '返奖',
            '5': '返还',
            '10': '系统升级原账结余',
            '11': '中心钱包',
            '12': '代理操作',
            '13': '商城'
          }
        } else {
          typeList =  {
            '3': 'Bets',
            '4': 'Return prize',
            '5': 'Return',
            '10': 'System Upgrade Original Account Balance',
            '11': 'Central wallet',
            '12': 'Proxy operation',
            '13': 'Shopping mall'
          }
        }
        return typeList[row.type]
      },
      //账变前余额
      beforeAmountConfig(row) {
        return thousandFormatter(row.originalAmount)
      },
      //账变余额
      amountConfig(row) {
        if (row.amount >= 0) {
          return {amount:row.amount, color: 'green'}
        } else {
          return {amount:row.amount, color: 'red'}
        }      
      },
      //账变后余额
      afterAmountConfig(row) {
        return thousandFormatter(row.balance)
      },

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
