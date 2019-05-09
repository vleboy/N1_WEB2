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
            align: 'center',
            key: 'sn'
          },
          {
            title: '交易时间',
            align: 'center',
            slot: 'dateTime'
          },
          {
            title: '交易类型',
            align: 'center',
            slot: 'type'
          },
          {
            title: '帐变前余额',
            align: 'center',
            slot: 'beforeAmount'
          },
          {
            title: '帐变金额',
            align: 'center',
            slot: 'amount'
          },
          {
            title: '帐变后金额',
            align: 'center',
            slot: 'afterAmount'
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
        return this.typeList[row.type]
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
