<template>
 <!--  <div class="businessRecordList">
    <div class="propList-search propList">
      <Row class="transition-box">
        <Col span="2" offset="4">商户ID</Col>
        <Col span="4">
        <Input v-model="searchInfo.operatorDisplayId" placeholder="请输入"></Input>
        </Col>
        <Col span="2">商户标识</Col>
        <Col span="4">
        <Input v-model="searchInfo.operatorSn" placeholder="请输入"></Input>
        </Col>

        <Col span="5">
        <div class="btns">
          <Button type="primary" @click="changeRadio()">搜索</Button>
          <Button @click="resultSearch">重置</Button>
        </div>
        </Col>
      </Row>
      <div class="rebackinfo">
        类型：
        <RadioGroup v-model="radioType" @on-change="changeRadio()" type="button">
          <Radio label="1">跑马灯管理</Radio>
          <Radio label="2">公告管理</Radio>
          <Radio label="3">邮件管理</Radio>
          <!-- <Radio label="4">展位管理</Radio>
        </RadioGroup>
      </div>
      <div class="rebackinfo" style="padding-top: 0">
         <p>共搜索到 {{businessRecordList.length || 0}} 条数据</p>
      </div>
      <div class="playerform">
        <Table :columns="columnsHorse" :data="getItems" v-show="radioType == '1'"></Table>
        <Table :columns="columnsNotice" :data="getItems" v-show="radioType == '2'"></Table>
        <Table :columns="columnsMail" :data="getItems" v-show="radioType == '3'"></Table>
        <Table :columns="columnsBooth" :data="getItems" v-show="radioType == '4'"></Table>
        <div style="text-align: right;margin:2rem 0">
          <Page :total="businessRecordList.length"
                show-elevator
                :page-size="20"
                :current.sync="currentPage"
                @on-change="getNowpage"></Page>
        </div>
      </div>
    </div>
    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div> -->
</template>

<script type="text/ecmascript-6">
  /* import { httpRequest } from '@/service/index'
  import dayjs from "dayjs";
  import {formatUserName, unFormatUserName, thousandFormatter} from '@/config/format'

  export default {
    beforeCreate() {
    },
    data() {
      return {
        nowSize: 20,
        isFetching: false,
        nowPage: 1,
        currentPage: 1,
        businessRecordList: [],
        noticeStatus: ['已停用', '正常'],
        radioType: '1',
        searchInfo: {
          operatorDisplayId: '',
          operatorSn: ''
        },
        columnsHorse: [
          {
            title: '商户ID',
            key: 'operatorDisplayId'
          },
          {
            title: '商户标识',
            key: 'operatorSn'
          },
          {
            title: '商户昵称',
            key: 'operatorDisplayName'
          },
          {
            title: '播放次数',
            key: 'count'
          },
          {
            title: '内容',
            key: '',
            render: (h,params) => {
              return h('div',params.row.content)
            }
          },
          {
            title: '开始时间',
            key: '',
            render: (h, params) => {
              return h("span", dayjs(params.row.startTime).format("YYYY-MM-DD HH:mm:ss"));
            }
          },
          {
            title: '结束时间',
            key: '',
            render: (h, params) => {
              return h("span", dayjs(params.row.endTime).format("YYYY-MM-DD HH:mm:ss"));
            }
          }
        ],
        columnsNotice: [
          {
            title: '商户ID',
            key: 'operatorDisplayId'
          },
          {
            title: '商户标识',
            key: 'operatorSn'
          },
          {
            title: '商户昵称',
            key: 'operatorDisplayName'
          },
          {
            title: '公告名称',
            key: 'adName'
          },
          {
            title: '公告类型',
            render: (h,params) => {
              return h('span', params.row.type== 'normal' ? '普通公告' : '活动公告')
            }
          },
          {
            title: '公告模式',
            render: (h,params) => {
              return h('span', params.row.model== 'text' ? '文字' : '图片')
            }
          },
          {
            title: '文字',
            render: (h,params) => {
              return h('span', params.row.text || '无')
            }
          },
          {
            title: '图片',
            key: '',
            render: (h,params) => {
              if(params.row.model== 'text') {
                return h('span','无')
              } else {
                return h('img', {
                  attrs: {
                    src: params.row.img
                  },
                  style: {
                    width: '40px',
                    height: '40px'
                  }
                })
              }
            }
          },
          {
            title: '创建时间',
            key: '',
            render: (h, params) => {
              return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"));
            }
          },
          {
            title: '状态',
            key: '',
            render: (h, params) => {
              return h("Tag", {
                props: {
                  type: 'border',
                  color: params.row.adStatus == 1 ? 'green' : ''
                }
              }, this.noticeStatus[params.row.adStatus]);
            }
          }
        ],
        columnsMail: [
          {
            title: '商户ID',
            key: 'operatorDisplayId'
          },
          {
            title: '商户标识',
            key: 'operatorSn'
          },
          {
            title: '商户昵称',
            key: 'operatorDisplayName'
          },
          {
            title: '邮件内容',
            key: 'content'
          },
          {
            title: '发送对象',
            key: '',
            render: (h,params) => {
              let nameMerchant = ''

              if(params.row.mNames && params.row.mNames.length) {
                nameMerchant = params.row.mNames.join(',')
              }
              if(params.row.names && params.row.names.length) {
                nameMerchant = params.row.names.join(',')
              }

              return h('span', nameMerchant || '所有玩家')
            }
          },
          {
            title: '创建时间',
            key: '',
            render: (h, params) => {
              return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"));
            }
          }
        ],
        columnsBooth: [
          {
            title: '商户ID',
            key: 'operatorDisplayId'
          },
          {
            title: '商户标识',
            key: 'operatorSn'
          },
          {
            title: '商户昵称',
            key: 'operatorDisplayName'
          },
          {
            title: '展位1',
            key: '',
            render: (h,params) => {
              if(params.row.name0!='') {
                return h('div',[
                  h('div',`${params.row.name0}X ${params.row.sum0}  总价：${params.row.sum0*params.row.prize0}`),
                  h('Tag',{
                    props: {
                      type: 'border',
                      color: params.row.status0==2 ? 'red' : ''
                    }
                  },'促')
                ])
              } else {
                return h('span', '暂无信息')
              }
            }
          },
          {
            title: '展位2',
            key: '',
            render: (h,params) => {
              if(params.row.name1!='') {
                return h('div',[
                  h('span',`${params.row.name1}X ${params.row.sum1}  总价：${params.row.sum1}*${params.row.prize1}`),
                  h('Tag',{
                    props: {
                      type: 'border',
                      color: params.row.status1==2 ? 'red' : ''
                    }
                  },'促')
                ])
              } else {
                return h('span', '暂无信息')
              }
            }
          },
          {
            title: '展位3',
            key: '',
            render: (h,params) => {
              if(params.row.name2!='') {
                return h('div',[
                  h('span',`${params.row.name2}X ${params.row.sum2}  总价：${params.row.sum2}*${params.row.prize2}`),
                  h('Tag',{
                    props: {
                      type: 'border',
                      color: params.row.status2==2 ? 'red' : ''
                    }
                  },'促')
                ])
              } else {
                return h('span', '暂无信息')
              }
            }
          },
          {
            title: '展位4',
            key: '',
            render: (h,params) => {
              if(params.row.name3!='') {
                return h('div',[
                  h('span',`${params.row.name3}X ${params.row.sum3}  总价：${params.row.sum3}*${params.row.prize3}`),
                  h('Tag',{
                    props: {
                      type: 'border',
                      color: params.row.status3==2 ? 'red' : ''
                    }
                  },'促')
                ])
              } else {
                return h('span', '暂无信息')
              }
            }
          },
          {
            title: '展位5',
            key: '',
            render: (h,params) => {
              if(params.row.name4!='') {
                return h('div',[
                  h('span',`${params.row.name4}X ${params.row.sum4}  总价：${params.row.sum4}*${params.row.prize4}`),
                  h('Tag',{
                    props: {
                      type: 'border',
                      color: params.row.status4==2 ? 'red' : ''
                    }
                  },'促')
                ])
              } else {
                return h('span', '暂无信息')
              }
            }
          },
          {
            title: '展位6',
            key: '',
            render: (h,params) => {
              if(params.row.name5!='') {
                return h('div',[
                  h('span',`${params.row.name5}X ${params.row.sum5}  总价：${params.row.sum5}*${params.row.prize5}`),
                  h('Tag',{
                    props: {
                      type: 'border',
                      color: params.row.status5==2 ? 'red' : ''
                    }
                  },'促')
                ])
              } else {
                return h('span', '暂无信息')
              }
            }
          }
        ]
      }
    },
    created() {
      this.changeRadio()
    },
    computed: {
      getItems() {
        if (this.nowPage === 1) {
          return this.businessRecordList.slice(0, this.nowSize)
        } else {
          return this.businessRecordList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
        }
      }
    },
    methods: {
      changeRadio() {
        if (!this.searchInfo.operatorDisplayId) {
          delete this.searchInfo.operatorDisplayId
        }
        if (!this.searchInfo.operatorSn) {
          delete this.searchInfo.operatorSn
        }

        this.businessRecordList = []
        switch (+(this.radioType)) {
          case 1:
            this.getHorseRaceLampList()
            break;
          case 2:
            this.getGameNoticeList()
            break;
          case 3:
            this.getMailList()
            break;
          case 4:
            this.getBoothList()
            break;
        }
      },
      getHorseRaceLampList() {
        if(this.isFetching) return
        this.isFetching = true
        httpRequest('post', '/notice/operate/list', {
          operatorRole: '100',
          query: this.searchInfo
        }).then(
          result => {
            this.businessRecordList = result.list.Items
          }
        ).finally(()=>{
          this.isFetching = false
        })
      }, // 跑马灯列表
      getGameNoticeList() {
        if(this.isFetching) return
        this.isFetching = true
        httpRequest('post', '/adList', {
          operatorRole: '100',
          query: this.searchInfo
        }).then(
          result => {
            this.businessRecordList = result.payload
          }
        ).finally(()=>{
          this.isFetching = false
        })
      }, //公告列表
      getMailList() {
        if(this.isFetching) return
        this.isFetching = true
        httpRequest('post', '/email/operate/list', {
          operatorRole: '100',
          query: this.searchInfo
        }).then(
          result => {
            this.businessRecordList = result.list
          }
        ).finally(()=>{
          this.isFetching = false
        })
      },// 邮件列表
      getBoothList() {
        if(this.isFetching) return
        this.isFetching = true
        httpRequest('post', '/seatAllList', {
          seatType: '2',
          operatorRole: '100',
          query: this.searchInfo
        },'game').then(
          result => {
            this.storageObj = []
            this.businessRecordList = result.payload

            for (let item of this.businessRecordList) {
              for (let i = 0; i < (10 - item.length); i++) {
                item.push({
                  operatorDisplayId: '',
                  operatorSn: '',
                  operatorDisplayName: '',
                  prop: '',
                  price: '0',
                  remark: 'NULL!',
                  seatStatus: '',
                  sum: ''
                })
              }
            }

            for (let items of this.businessRecordList) {
              this.storageObj.push({
                operatorDisplayId: items[0].operatorDisplayId,
                operatorDisplayName: items[0].operatorDisplayName,
                operatorSn: items[0].operatorSn,
                name0: items[0].prop,
                status0: items[0].seatStatus,
                sum0: items[0].sum,
                name1: items[1].prop,
                status1: items[1].seatStatus,
                sum1: items[1].sum,
                name2: items[2].prop,
                status2: items[2].seatStatus,
                sum2: items[2].sum,
                name3: items[3].prop,
                status3: items[3].seatStatus,
                sum3: items[3].sum,
                name4: items[4].prop,
                status4: items[4].seatStatus,
                sum4: items[4].sum,
                name5: items[5].prop,
                status5: items[5].seatStatus,
                sum5: items[5].sum,
                prize0: items[0].price,
                prize1: items[1].price,
                prize2: items[2].price,
                prize3: items[3].price,
                prize4: items[4].price,
                prize5: items[5].price
              })
            }
            this.businessRecordList = this.storageObj
          }
        ).finally(()=>{
          this.isFetching = false
        })
      }, // 展位列表
      formatterTime(row) {
        return dayjs(row).format("YYYY-MM-DD HH:mm:ss")
      }, // 格式化创建时间
      getNowpage(page) {
        this.nowPage = page
      },
      resultSearch() {
        this.searchInfo = {
          operatorDisplayId: '',
          operatorSn: ''
        }
        this.changeRadio()
      }
    }
  } */
</script>

<style scpoed lang="less" type="text/less">
  /* .businessRecordList {
    min-height: 89vh;
    .transition-box {
      padding-bottom: 16px;
      text-align: center;
    }

    .-p-h-remark {
      word-wrap: break-word;
      word-break: normal;
      width: 200px;
    }

    .input {
      width: 80% !important;
    }

    .rebackinfo {
      padding-bottom: 16px;
    }

    .playerform {

    }

    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  } */
</style>
