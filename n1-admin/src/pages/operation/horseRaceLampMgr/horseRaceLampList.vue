<template>
  <!-- <div class="p-horseRaceLampList">
    <div class="-p-m-header">
      <Col :span="11">
        <Button type="primary" class="justfy1" @click="openModal()" v-if="permission.includes('创建跑马灯')">创建跑马灯</Button>
      </Col>
      <Col :span="13" class="g-text-right">
        <Input placeholder="请输入跑马灯内容" class="input" v-model="searchInfo.content"></Input>
        <Button style="margin-left: 10px" type="primary" @click="getHorseRaceLampList">搜索</Button>
        <Button @click="resetSearch">重置</Button>
      </Col>
    </div>

    <div>
      <Table :columns="columns" :data="getItems"></Table>
      <div class="page">
        <Page :total="horseRaceLampList.length"
              show-elevator
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"></Page>
      </div>
    </div>

    <Modal title="发布公告" v-model="isOpenModal" width="700">
      <Form :model="horseRaceLampInfo" :label-width="140" >
        <FormItem label="公告内容">
          <Input v-model="horseRaceLampInfo.content" type="textarea" :rows="4" auto-complete="off" placeholder="请输入公告内容"
                    :maxlength="200" @on-blur="changeShowTime()"></Input>
        </FormItem>
        <FormItem label="时间间隔">
          <DatePicker
            :editable='false'
            :transfer='true'
            v-model="dateTimeArray"
            type="datetimerange"
            @on-change="changeDatePicker"
            placeholder="选择日期范围" style="width: 300px">
          </DatePicker>
        </FormItem>
        <FormItem label="播放时间间隔">
          <Col :span="6">
            <InputNumber  class="-hrl-time" v-model="timeObj.day" placeholder="请输入天"
                          @on-change="changeCount" :min=0 :max=365></InputNumber > 天
          </Col>
          <Col :span="6">
            <InputNumber  class="-hrl-time" v-model="timeObj.hour" placeholder="请输入小时"
                          @on-change="changeCount" :min=0 :max=24></InputNumber > 时
          </Col>
          <Col :span="6">
            <InputNumber  class="-hrl-time" v-model="timeObj.minute" placeholder="请输入分钟"
                          @on-change="changeCount" :min=0 :max=60></InputNumber > 分
          </Col>
          <Col :span="6">
            <InputNumber  class="-hrl-time" v-model="timeObj.second" placeholder="请输入秒数"
                          @on-change="changeCount" :min=0 :max=60></InputNumber > 秒
          </Col>
        </FormItem>
        <FormItem label="单条公告显示时间">
          <div>{{(horseRaceLampInfo.showTime||'0')+'s'}}</div>
        </FormItem>
        <FormItem label="预计播放最多次数">
          <div>{{(horseRaceLampInfo.count||0)+'次'}}</div>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="isOpenModal = false">取 消</Button>
        <Button type="primary" :load="isSending" @click="submitProp(horseRaceLampInfo.noid)">{{isSending ? '提交中' : '确 定'}}</Button>
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
import { httpRequest } from '@/service/index'
import dayjs from "dayjs";
export default {
  beforeCreate () {
  },
  created () {
    this.getHorseRaceLampList()
  },
  data () {
    return {
      nowSize: 20,
      nowPage: 1,
      currentPage: 1,
      isOpenModal: false,
      isSending: false,
      isFetching: false,
      dateTimeArray: [],
      horseRaceLampList: [],
      horseRaceLampInfo: {
        startTime: '',
        endTime: '',
        splitTime: '',
        showTime: '',
        content: '',
        count: ''
      },
      timeObj: {
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      },
      searchInfo: {
        content: ''
      },
      searchArray: [], // 暂时加储
      dateOption: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      columns: [
        {
          title: '内容',
          key: 'content'
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
        },
        {
          title: '间隔时间',
          key: '',
          render: (h, params) => {
            return h("span", formatMillisecond(params.row.splitTime));
          }
        },
        {
          title: '播放次数',
          key: 'count'
        },
        {
          title: '操作',
          key: '',
          align: 'center',
          render: (h, params) => {
            return h('div',[
              h('Button', {
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
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  color:'#20a0ff'
                },
                on: {
                  click: () => {
                    this.delItem(params.row)
                  }
                }
              }, '删除'),
              //  h('Button', {
              //   props: {
              //     type: 'text',
              //     size: 'small'
              //   },
              //   style: {
              //     color:'#20a0ff'
              //   },
              //   on: {
              //     click: () => {
              //       console.log(1);
              //     }
              //   }
              // }, '停用'),
            ])
          }
        }
      ]
    }
  },
  computed: {
    getItems () {
      if (this.nowPage === 1) {
        return this.horseRaceLampList.slice(0, this.nowSize)
      } else {
        return this.horseRaceLampList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
      }
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    }
  },
  methods: {
    getHorseRaceLampList () {
      if (this.searchInfo.content == '') {
        delete this.searchInfo.content
      }
      if(this.isFetching) return
      this.isFetching =  true
      httpRequest('post', '/notice/list', {
        query: this.searchInfo
      })
      .then(
        result => {
          this.horseRaceLampList = result.list.Items
          this.searchArray =result.list.Items
        }
      ).finally(()=>{
        this.isFetching = false
      })
    },
    submitProp (id) {
      const time = this.horseRaceLampInfo.endTime - this.horseRaceLampInfo.startTime
      if (!this.horseRaceLampInfo.startTime || !this.horseRaceLampInfo.endTime) {
        return this.$message.error('请选择时间段')
      } else if (!this.horseRaceLampInfo.content) {
        return this.$message.error('请输入公告内容')
      } else if (time < this.horseRaceLampInfo.splitTime) {
        return this.$message.error('时间间隔不能小于播放间隔时间')
      } else if (this.timeObj.day<0) {
        return this.$message.error('天数不能为负')
      } else if (this.timeObj.hour<0) {
        return this.$message.error('时数不能为负')
      } else if (this.timeObj.minute<0) {
        return this.$message.error('分数不能为负')
      } else if (this.timeObj.second<0) {
        return this.$message.error('秒数不能为负')
      }
      if (this.isSending) return // 防止重复提交
      this.isSending = true

      httpRequest('post', `${id ? '/notice/update' : '/notice/add'}`, this.horseRaceLampInfo)
      .then(
        result => {
          this.$Message.success('提交成功')
          this.isOpenModal = false
          this.getHorseRaceLampList()
        }
      ).finally(()=>{
        this.isSending = false
      })
    },
    openModal (row = {}) {
      this.isOpenModal = true
      if (JSON.stringify(row) !== '{}') {
        this.horseRaceLampInfo = JSON.parse(JSON.stringify(row))
        this.dateTimeArray = [new Date(this.horseRaceLampInfo.startTime), new Date(this.horseRaceLampInfo.endTime)]
        this.timeObj.day = parseInt(this.horseRaceLampInfo.splitTime / (1000 * 60 * 60 * 24))
        this.timeObj.hour = parseInt((this.horseRaceLampInfo.splitTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        this.timeObj.minute = parseInt((this.horseRaceLampInfo.splitTime % (1000 * 60 * 60)) / (1000 * 60))
        this.timeObj.second = (this.horseRaceLampInfo.splitTime % (1000 * 60)) / 1000
      } else {
        this.horseRaceLampInfo = {}
        this.dateTimeArray = []
        this.timeObj = {
          day: 0,
          hour: 0,
          minute: 0,
          second: 0
        }
      }
    },
    resetSearch () {
      this.searchInfo = {}
      this.searchArray = []
      this.getHorseRaceLampList()
    },
    getNowpage (page) {
      this.nowPage = page
      // console.log('当前是第:' + page + '页')
    },
    delItem (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除该公告吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: ()=>{
          httpRequest('post', '/notice/remove', {
            noid: row.noid
          })
            .then(
              result => {
                this.$Message.success('删除成功')
                this.isOpenModal = false
                this.getHorseRaceLampList()
              }
            )
        },
        onCancel: () => {
          this.$Message.info('已取消删除')
        }
      })
    }, // 删除公告
    changeShowTime () {
      if (this.horseRaceLampInfo.content) {
        const contentLength = this.horseRaceLampInfo.content.length
        this.horseRaceLampInfo.showTime = (contentLength * 0.25) + (25 * 0.5)
      }
      this.changeDatePicker()
      this.changeCount()
//      this.dateTimeArray = []
    }, // 公告内容失去焦点 计算需要显示的时间
    changeDatePicker () {
      this.horseRaceLampInfo.startTime = new Date(this.dateTimeArray[0]).getTime()
      this.horseRaceLampInfo.endTime = new Date(this.dateTimeArray[1]).getTime()
      const dataTime = this.horseRaceLampInfo.endTime - this.horseRaceLampInfo.startTime
      this.horseRaceLampInfo.count = parseInt(dataTime / (this.horseRaceLampInfo.showTime * 1000))
    }, // 处理选择时间
    changeCount () {
      const dataTime = this.horseRaceLampInfo.endTime - this.horseRaceLampInfo.startTime
      const showTime = this.horseRaceLampInfo.showTime * 1000
      const segmentationDay = this.timeObj.day * 24 * 60 * 60 * 1000
      const segmentationHour = this.timeObj.hour * 60 * 60 * 1000
      const segmentationMinute = this.timeObj.minute * 60 * 1000
      const segmentationSecond = this.timeObj.second * 1000
      this.horseRaceLampInfo.splitTime = segmentationHour + segmentationMinute + segmentationSecond + segmentationDay
      this.horseRaceLampInfo.count = parseInt(dataTime / (showTime + this.horseRaceLampInfo.splitTime))
    } // 获取次数
  }
} */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  /* .p-horseRaceLampList{
    min-height: 89vh;
    .-p-m-header{
      overflow: hidden;
      padding-bottom: 16px;
      .g-text-right{
        text-align: right;
      }
    }
    .input{width: 48%}
    .-p-h-remark{
      word-wrap: break-word;
      word-break: normal;
      width: 200px
    }
    .text-ellipsis{
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .page {
      padding-bottom: 2rem;
      text-align: right;
      margin-right: 1%;
      margin-top: 2rem
    }
    .-hrl-time{
      width: 80%
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  } */


</style>
