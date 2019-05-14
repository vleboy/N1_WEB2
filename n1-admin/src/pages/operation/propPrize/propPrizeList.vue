<template>
 <!--  <div class="p-propPrizeList">
    <div class="propPrizeList -search">
      <Row class="transition-box">
        <Col class="-s-text" span="2" offset="4">物品ID</Col>
        <Col span="4">
        <Input v-model="searchInfo.toolId" placeholder="请输入"></Input>
        </Col>
        <Col class="-s-text" span="2">道具名称</Col>
        <Col span="4">
        <Input v-model="searchInfo.toolName" placeholder="请输入"></Input>
        </Col>

        <Col span="5">
        <div class="btns">
          <Button type="primary" @click="getPropPrizeList">搜索</Button>
          <Button type="ghost" @click="resetSearch">重置</Button>
        </div>
        </Col>
      </Row>
    </div> -->
    <!-- <p class="searchResult">共搜索到 {{propPrizeList.length || 0}} 条数据</p> -->
    <!-- <div class="propPrizeList">
      <Table :columns="columns" :data="getItems"></Table>
      <div class="page">
        <Page :total="propPrizeList.length"
              show-elevator
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"></Page>
      </div>
    </div>
    <Modal title="编辑定价" v-model="isOpenModal">
      <Form :model="propPrizeInfo" :label-width="180">
        <FormItem  label="道具名称" >
          <div style="text-align: left">{{propPrizeInfo.toolName}}</div>
        </FormItem >
        <FormItem  label="道具基准价格">
          <Input v-model="propPrizeInfo.toolPrice" placeholder="请输入道具基本价格"
                    :maxlength="200"></Input>
        </FormItem >
        <FormItem  label="商户最低定价下浮百分比">
          <Input v-model="propPrizeInfo.lowerRatio" placeholder="请输入商户最低定价下浮百分比（范围0.00~100.00）"
                    :maxlength="200"></Input>
        </FormItem >
        <FormItem  label="商户最高定价上浮百分比">
          <Input v-model="propPrizeInfo.comeUpRatio" placeholder="请输入商户最高定价上浮百分比（大于0）"
                    :maxlength="200" :disabled="!isUnlimited"></Input>
        </FormItem >
        <FormItem  label="是否限制商户最高定价">
          <RadioGroup v-model="unlimitedInfo" @on-change="changeSwitch()">
            <Radio label="1">限制</Radio>
            <Radio label="0">不限制</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="isOpenModal = false">取 消</Button>
        <Button type="primary" :load="isSending" @click="submitProp(propPrizeInfo)">{{isSending ? '提交中' : '确 定'}}</Button>
      </div>
    </Modal>
    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div> -->
</template>

<script type="text/ecmascript-6">
/* import { formatMillisecond } from '@/config/format'
import { pattern } from '@/config/regexp'
import { httpRequest } from '@/service/index'
import dayjs from "dayjs";
export default {
  beforeCreate () {
  },
  created () {
    this.getPropPrizeList()
  },
  data () {
    return {
      nowSize: 20,
      nowPage: 1,
      currentPage: 1,
      isOpenModal: false,
      isSending: false,
      isFetching: false,
      isUnlimited: false,
      unlimitedInfo: '0',
      propPrizeList: [],
      propPrizeInfo: {
        toolPrice: '',
        comeUpRatio: '',
        lowerRatio: '',
        status: ''
      },
      searchInfo: {},
      columns: [
        {
          title: '物品ID',
          key: 'toolId'
        },
        {
          title: '道具名称',
          key: 'toolName'
        },
        {
          title: '道具单价',
          key: '',
          render: (h, params) => {
            return h('span',params.row.toolPrice === 'NULL!' ? '-' : params.row.toolPrice)
          }
        },
        {
          title: '商户最低定价下浮百分比',
          key: 'msn',
          render: (h, params) => {
            return h('span', params.row.lowerRatio === 'NULL!' ? '无限制' : params.row.lowerRatio)
          }
        },
        {
          title: '商户最高定价上浮百分比',
          key: 'msn',
          render: (h, params) => {
            return h('span', params.row.comeUpRatio === 'NULL!' ? '无限制' : params.row.comeUpRatio)
          }
        },
        {
          title: '备注',
          key: '',
          render: (h, params) => {
            let remark = params.row.remark;
            if (remark != "NULL!") {
              return h(
                "Tooltip",
                {
                  props: {
                    content: remark
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "search",
                      color: "#20a0ff"
                    }
                  })
                ]
              );
            } else {
              return h("span", "");
            }
          }
        },
        {
          title: '操作',
          key: '',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text',
                size: 'small'
              },
              style: {
                color:'#20a0ff'
              },
              on: {
                click: () => {
                  this.openModal(params.row)
                }
              }
            }, '定价')
          }
        }
      ]
    }
  },
  computed: {
    getItems () {
      if (this.nowPage === 1) {
        return this.propPrizeList.slice(0, this.nowSize)
      } else {
        return this.propPrizeList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
      }
    }
  },
  methods: {
    getPropPrizeList () {

      if(this.searchInfo.toolId == ''){
        delete this.searchInfo.toolId
      }
      if (this.searchInfo.toolName == '') {
        delete this.searchInfo.toolName
      }
      if(this.isFetching) return
      this.isFetching = true
      httpRequest('post','/toolList',{
        query:this.searchInfo
      },'game').then(
        result => {
          this.propPrizeList = result.payload
        }
      ).finally(()=> {
        this.isFetching = false
      })
    },
    submitProp () {
      if (!pattern.digitalRange.exec(this.propPrizeInfo.lowerRatio) || !this.propPrizeInfo.lowerRatio) {
        return this.$Message.error('请输入正确的商户最低定价下浮百分比 范围0~100')
      } else if (!pattern.positive.exec(this.propPrizeInfo.toolPrice) || !this.propPrizeInfo.toolPrice) {
        return this.$Message.error('请输入正确的道具价格，范围0.00~限制')
      } else if ((!pattern.positive.exec(this.propPrizeInfo.comeUpRatio)||!this.propPrizeInfo.comeUpRatio) && this.isUnlimited) {
        return this.$Message.error('请输入正确的商户最高定价上浮百分比 范围0.00~无限制')
      }
      if (this.isSending) return // 防止重复提交
      this.isSending = true
      this.propPrizeInfo.status = this.isUnlimited ? '2' : '1'

      httpRequest('post','/toolSetPrice',this.propPrizeInfo,'game').then(
        result => {
          this.$Message.success('提交成功')
          this.isOpenModal = false
          this.getPropPrizeList()
        }
      ).finally(()=> {
        this.isSending = false
      })
    },
    openModal (row = {}) {
      this.isOpenModal = true
      if (JSON.stringify(row) !== '{}') {
        this.propPrizeInfo = JSON.parse(JSON.stringify(row))
        this.propPrizeInfo.toolPrice = (this.propPrizeInfo.toolPrice === 'NULL!') ? '' : this.propPrizeInfo.toolPrice
        this.propPrizeInfo.comeUpRatio = (this.propPrizeInfo.comeUpRatio === 'NULL!') ? '' : this.propPrizeInfo.comeUpRatio
        this.propPrizeInfo.lowerRatio = (this.propPrizeInfo.lowerRatio === 'NULL!') ? '' : this.propPrizeInfo.lowerRatio
//        this.propPrizeInfo.status = this.isUnlimited ? '2' : '1'
        this.isUnlimited = this.propPrizeInfo.status == 2
        this.unlimitedInfo = this.propPrizeInfo.status == 2 ? '1' : '0'
      } else {
        this.propPrizeInfo = {}
      }
    },
    resetSearch () {
      this.searchInfo = {}
      this.getPropPrizeList()
    },
    changeSwitch () {
      this.isUnlimited = (this.unlimitedInfo == '1')
      if(!this.isUnlimited){
        this.propPrizeInfo.comeUpRatio = ""
      }
    }, // 格式化创建时间
    getNowpage (page) {
      this.nowPage = page
      // console.log('当前是第:' + page + '页')
    }
  }
} */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  /* .p-propPrizeList {
    min-height: 89vh;
    .-search{
      padding-bottom: 16px;
      text-align: center
    }
    .input{
      width: 80%
    }
    .searchResult{
      padding-bottom: 16px;
    }
    .page {
      padding-bottom: 2rem;
      text-align: right;
      margin-right: 1%;
      margin-top: 2rem
    }
  } */
</style>
