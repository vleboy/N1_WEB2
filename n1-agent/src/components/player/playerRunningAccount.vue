$
<template>
  <div class="p-playerAccount">
    <div class="-p-base">
      <Row class="-b-form">
        <Col span="17">
          <DatePicker
            :editable='false'
            :transfer='true'
            v-model="amountDate"
            :options="options"
            type="datetimerange"
            @on-change="changeDate"
            placeholder="选择日期范围" style="width: 300px">
          </DatePicker>
          <DatePicker
            v-model="monthDate"
            :transfer='true'
            type="month"
            @on-change="changeMonth"
            placeholder="按月选择" style="width:100px">
          </DatePicker>
          最近：
          <RadioGroup v-model="radioTime" @on-change="changeTime()" type="button">
            <Radio label="1">1周</Radio>
            <Radio label="2">1个月</Radio>
            <Radio label="3">1年</Radio>
          </RadioGroup>
        </Col>
        <Col span="7" class="text-right">
          <Button @click="isShowSearch = !isShowSearch" type="text">高级筛选
            <Icon type="arrow-down-b" v-if="!isShowSearch"></Icon>
            <Icon type="arrow-up-b" v-else></Icon>
          </Button>
          <Button type="primary" @click="exportData">导出数据</Button>
        </Col>
      </Row>
      <Row v-if="isShowSearch">
        <div class="from-search">
          <div class="-search-input">
            流水号：<Input v-model="sn" placeholder="请输入流水号" style="width: 70%;"></Input>
          </div>
        </div>
        <div class="from-search">
          <div class="-search-input">
            交易号：<Input v-model="betId" placeholder="请输入交易号" style="width: 70%;"></Input>
          </div>
        </div>
        <div class="from-search">
          厂商：
          <RadioGroup v-model="companyInfo" type="button" @on-change="changeCompany">
            <Radio v-for="(item,index) of companyList" :key="index" :label="item.company">{{item.company}}</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          游戏：
          <RadioGroup v-model="radioInfo" type="button">
            <Radio v-for="(item,index) of gameTypeList" :key="index" :label="item.code">{{item.name}}</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          类型：
          <RadioGroup v-model="radioType" type="button">
            <Radio label="">全部</Radio>
            <Radio label="3">下注</Radio>
            <Radio label="11">中心钱包</Radio>
            <Radio label="4">返奖</Radio>
            <Radio label="5">返还</Radio>
            <Radio label="6">冻结</Radio>
            <Radio label="13">商城</Radio>
          </RadioGroup>
        </div>
        <div class="from-search">
          资金流向：
          <RadioGroup v-model="radioMoney" type="button">
            <Radio label="">全部</Radio>
            <Radio label="1">本次发生金额（入）</Radio>
            <Radio label="-1">本次发生金额（出）</Radio>
          </RadioGroup>
        </div>
        <div class="form-button">
          <Button type="primary" size="large" @click="searchData(true)">筛选</Button>
          <Button type="ghost" size="large" @click="searchData(false)">重置</Button>
        </div>
      </Row>
    </div>

    <div class="-p-table">
      <div class="-t-form">
        <Table :columns="columns" :data="dataList"></Table>
        <Row style="padding: 20px 0">
        <Col span="24" class="text-right">
          <Page :total="playerAccountList.length"
                show-elevator
                :page-size="20"
                :current.sync="currentPage"
                @on-change="getNowpage"></Page>
        </Col>
        </Row>
      </div>
    </div>

    <Modal title="战绩详细" v-model="isOpenModalBill" class="g-text-center"  width="800" cancel-text="">
      <SportsModal ref="childMethod" v-if="propChild.gameType =='1130000'" :dataProp="propChild"></SportsModal>
    </Modal>

    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div>
</template>
<script type="text/ecmascript-6">
  import {formatUserName, thousandFormatter} from '@/config/format'
  import {httpRequest} from '@/service/index'
  import dayjs from "dayjs";
  import SportsModal from '@/components/player/sportsModal'

  export default {
    components: {SportsModal},
    data() {
      return {
        options: {
        shortcuts: [
          {
            text: "本周",
            value() {
              return [new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: "本月",
            value() {
              return [new Date(dayjs().startOf('month').valueOf()), new Date(dayjs().endOf('second').valueOf())]
            }
          },
          {
            text: "上周",
            value() {
              return [new Date(dayjs().add(-1, 'week').startOf('week').valueOf() + 24 * 60 * 60 * 1000), new Date(dayjs().startOf('week').valueOf() + 24 * 60 * 60 * 1000 - 1)]
            }
          },
          {
            text: "上月",
            value() {
              //-1 上月
              return [new Date(dayjs().add(-1, 'month').startOf('month').valueOf()), new Date(dayjs().startOf('month').valueOf() - 1)]
            }
          }
        ]
      }, 
        nowSize: 20,
        nowPage: 1,
        pageSize: 100,
        radioTime: '1',
        radioMoney: '',
        currentPage: 1,
        radioType: '',
        monthDate: '', // 月份快捷选择
        startDate: '', // 开始时间搓
        endDate: '', // 结束时间搓
        betId: '', // 交易号
        sn: '', // 流水号
        allAmount: 0,
        isShowSearch: false,
        isFetching: false,
        isLastMessage: false, // 主要判断是否是后台返回最后一次信息
        typeList: {
          '3': '下注',
          '4': '返奖',
          '5': '返还',
          '6': '冻结',
          '10': '系统升级原账结余',
          '11': '中心钱包',
          '12': '代理操作',
          '13': '商城'
        },
        GameNameEnum: {
          "70001": "塔罗之谜",
          "70002": "小厨娘",
          "70003": "降龙献瑞",
          "70004": "四方神兽",
          "70005": "财神进宝",
          "70006": "福运亨通",
          "70007": "熊猫传奇",
          "70010": "财源广进",
          "70011": "珠光宝气",
          "70012": "锦鲤",
          "70013": "金狮送福",
          "70014": "幸运钱庄",
          "70022": "年年有余",
          "70024": "猪年大吉",
          "70026": "财神到",
          "70028": "老寿星",
          "70030": "凤舞朝阳",
          "70032": "鲤跃龙门",
          "90001": "塔罗之谜",
          "90002": "小厨娘",
          "90003": "祥龙献瑞",
          "90004": "四方神兽",
          "90005": "财神进宝",
          "90006": "福运亨通",
          "90007": "熊猫传奇",
          "90008": "财源广进",
          "90009": "珠光宝气",
          "90010": "锦鲤",
          "90011": "金狮送福",
          "90012": "幸运钱庄",
          "90013": "年年有余",
          "90014": "猪年大吉",
          "90015": "财神到",
          "90016": "老寿星",
          "90017": "凤舞朝阳",
          "90018": "鲤跃龙门",
        },
        amountDate: [], // 时间日期选择
        playerAccountList: [], // 玩家流水账列表
        playerRecordList: [], // 玩家战绩列表
        playerAccountListStorage: [],
        playerAccountListStartKey: '',
        columns: [
          {
            title: '流水号',
            key: 'sn',
            width: 140
          },
          {
            title: '交易号',
            key: 'businessKey',
            width: 130
          },
          {
            title: '日期',
            key: '',
            width: 155,
            render: (h, params) => {
              return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"));
            }
          },
          {
            title: '游戏类型',
            key: 'gameName'
          },
           {
            title: "游戏ID",
            key: "gameId",
            render: (h, params) => {
            return h('span', this.GameNameEnum[params.row.gameId] ? `${params.row.gameId}(${this.GameNameEnum[params.row.gameId]})`: params.row.gameId)
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
          },
          {
            title: '操作',
            key: 'action',
            width: 90,
            align: 'center',
            render: (h, params) => {

              if (params.row.type == '3' && params.row.gameType == '1130000') {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'text',
                      size: 'small'
                    },
                    style: {
                      color:'#20a0ff',
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.openModalBill(params.row)
                      }
                    }
                  }, '查看战绩')
                ])
              }
            }
          }
        ],
        companyList: [],
        gameTypeList: [],
        radioInfo: '',
        companyInfo: '全部厂商',
        propChild: {},
        isOpenModalBill: false
      }
    },
    mounted() {
      this.changeTime()
      this.companySelectList()
    },
    computed: {
      dataList() {
        if (this.nowPage === 1) {
          return this.playerAccountList.slice(0, this.nowSize)
        } else {
          return this.playerAccountList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
        }
      },
      userName() {
        return formatUserName(localStorage.playerName)
      },
      formatNum() {
        this.allAmount = 0
        for (let item of this.playerAccountList) {
          this.allAmount += Number(item.amount)
        }
        return thousandFormatter(this.allAmount)
      }
    },
    methods: {
      getNowpage(page) {
        this.nowPage = page
        if (page == Math.ceil(this.playerAccountList.length / this.nowSize) && !this.isFetching && page != 1 && !this.isLastMessage) {
          this.playerAccountListStorage = JSON.parse(JSON.stringify(this.playerAccountList))
          this.getPlayerAccount()
        }
      },
      getPlayerAccount() {
        if (this.isFetching) return
        this.isFetching = true

        httpRequest('post', '/player/bill/flow', {
          userName: localStorage.playerName,
          type: this.radioType,
          action: this.radioMoney,
          company: this.companyInfo == '全部厂商' ? '-1' : this.companyInfo,
          gameType: this.radioInfo,
          startTime: this.amountDate ? this.startDate : '',
          endTime: this.amountDate ? this.endDate : '',
          startKey: this.playerAccountListStartKey,
          pageSize: this.pageSize,
          sn: this.sn,
          betId: this.betId,
        }).then(result => {
            this.isLastMessage = result.list < this.pageSize
            this.playerAccountList = result.list
            this.playerAccountListStartKey = result.startKey
            this.playerAccountUserName = result.userName
            this.playerAccountListStorage.length && (this.playerAccountList = this.playerAccountListStorage.concat(this.playerAccountList))
          }
        ).finally(()=>{
          this.isFetching = false
        })
      },
      changeTime() {
        const end = new Date();
        const start = new Date();
        if (this.radioTime) {
          this.monthDate = '';
        }
        switch (+this.radioTime) {
          case 1:
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            this.amountDate = [start, end];
            this.changeDate()
            break;
          case 2:
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            this.amountDate = [start, end];
            this.changeDate()
            break;
          case 3:
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            this.amountDate = [start, end];
            this.changeDate()
            break;
        }
      }, // 最近的时间快捷选择联动
      changeDate() {
        if (this.amountDate) {
          // this.startDate = new Date(this.amountDate[0].setMonth(this.amountDate[0].getMonth())).setHours(0, 0, 0, 0);
          // this.endDate = new Date(this.amountDate[1].setMonth(this.amountDate[1].getMonth())).setHours(0, 0, 0, 0) + 24 * 3600 * 1000 - 1;
          this.startDate = new Date(this.amountDate[0]).getTime()
          this.endDate = new Date(this.amountDate[1]).getTime()
        } else {
          this.radioTime = '';
          this.monthDate = '';
        }
        this.initData()
        this.getPlayerAccount()
      }, //日期改变联动
      changeMonth(date) {
        if (date && this.monthDate) {
          const month = new Date(date)
          const startDay = new Date(month.setMonth(month.getMonth(), 1));
          const endDay = new Date(month.setMonth(month.getMonth() + 1, 0));
          this.amountDate = [startDay, endDay]
          this.radioTime = ''
          this.changeDate()
        }
      }, // 月份联动
      searchData(bool) {
        if(!bool) {
          this.companyInfo = '全部厂商'
          this.radioMoney = ''
          this.radioType = ''
          this.sn = ''
          this.betId = ''
          this.changeCompany()
        }
        this.initData()
        this.getPlayerAccount()
      }, // 重置筛选条件
      initData() {
        this.currentPage = 1;
        this.nowPage = 1;
        this.playerAccountList = [];
        this.playerAccountListStorage = []
        this.playerAccountListStartKey = ''
      },
      exportData() {
        let url = process.env.NODE_ENV == 'production' ? 'https://n1admin.na12345.com' : 'https://d3prd6rbitzqm3.cloudfront.net'
        window.open(`${url}/player/bill/flow/download?userName=${localStorage.playerName}&type=${this.radioType}&action=${this.radioMoney}&startTime=${this.amountDate ? this.startDate : ''}&endTime=${this.amountDate ? this.endDate : ''}`)
      },
      companySelectList () {
        httpRequest('post','/companySelect',{
          parent: localStorage.loginRole == 1 ? '' : localStorage.loginId
        }).then(
          result => {
            this.companyList = result.payload || []
            this.companyList.unshift({
              company: '全部厂商',
            })
            this.changeCompany()
          }
        )
      }, //获取运营商列表
      changeCompany () {
        httpRequest('post','/gameBigType',{
          companyIden: this.companyInfo == '全部厂商' ? '-1' : this.companyInfo
        },'game').then(
          result => {
            this.gameTypeList = result.payload
            this.gameTypeList.unshift({
              code: '',
              name: '全部'
            })
            this.radioInfo = ''
          }
        )
      },
      openModalBill (data) {
        this.propChild = data;
        this.isOpenModalBill = true
        setTimeout(()=>{
          this.$refs.childMethod.getRealLife()
        },0)
      },
    },
    watch: {
      '$route': function (_new, _old) {
        if((_new.name == 'playDetail') && (localStorage.playerName != this.playerAccountUserName)) {
          this.initData()
          this.getPlayerAccount()
        }
      }
    },
    filter1s: {   //过滤器，所有数字保留两位小数
      currency(value) {
        return (value - 0).toFixed(2);
      }
    },
  }
</script>

<style scpoed type="text/less" lang="less">
  .p-playerAccount {
    .-p-base {
      .-b-form {
        padding: 0;
        font-size: 0.8rem;
        overflow: hidden;
        margin-bottom: 10px;
      }

      .from-search {
        font-size: 0.8rem;
        margin-top: 10px;
        overflow: hidden;
      }

      .-search-input{
        display: inline-block;
        width: 50%;
      }

      .form-button {
        position: absolute;
        top: 78%;
        right: 0;
      }
    }

    .-p-total {
      margin-bottom: 10px;
      font-size: 16px
    }

    .-p-table {
      padding: 6px 0 0 0;
      margin: 0 auto;
      vertical-align: baseline;

      .-t-form {
        padding: 0;
        font-size: 0.8rem;
        overflow: hidden;

        .total-all {
          background-color: #c2e7fd;
          padding: 10px;
          border-radius: 4px
        }

        .total-check {
          background-color: #ffebbd;
          padding: 10px;
          border-radius: 4px;
        }
      }
    }
    h4 {
      font-size: 1.3rem;
      font-weight: normal;
      padding: 16px 0;
      color: #5a5a5a
    }
    .-p-green {
      color: #00CC00
    }
    .-p-red {
      color: #FF3300
    }
    .text-right {
      text-align: right;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
