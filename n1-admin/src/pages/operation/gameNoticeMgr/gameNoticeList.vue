<template>
  <!-- <div class="p-gameNoticeList">
    <div class="-p-m-header">
      <Col :span="11">
      <Button type="primary" @click="openModal()">创建公告</Button>
      </Col>
      <Col :span="13" class="g-text-right">
      <Input placeholder="请输入公告名称" class="input" v-model="searchInfo.adName"></Input>
      <Button style="margin-left: 10px" type="primary" @click="getGameNoticeList">搜索</Button>
      <Button @click="resetSearch">重置</Button>
      </Col>
    </div>

    <div class="gameNoticeList">
      <Table :columns="columns" :data="getItems"></Table>
      <div class="page">
        <Page :total="gameNoticeList.length"
              show-elevator
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"></Page>
      </div>
    </div>

    <Modal title="发布公告" v-model="isOpenModal">
      <Form :model="noticeInfo" :label-width="70">
        <FormItem label="公告类型"  class="ivu-form-item-required">
          <RadioGroup v-model="noticeInfo.type" size="small" type="button">
            <Radio label="normal">普通公告</Radio>
            <Radio label="activity">活动公告</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="公告模式"  class="ivu-form-item-required">
          <RadioGroup v-model="noticeInfo.model" size="small" type="button">
            <Radio label="image">图片</Radio>
            <Radio label="text">文字</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="公告名称"  class="ivu-form-item-required">
          <Input v-model="noticeInfo.adName" auto-complete="off" placeholder="请输入公告名称" :maxlength="20"></Input>
        </FormItem>
        <FormItem label="发布时间" >
          <DatePicker
            v-model="publishTime"
            type="datetime"
            :transfer='true'
            style="width: 300px"
            placeholder="选择日期时间范围">
          </DatePicker>
        </FormItem>
        <FormItem label="跳转链接" >
          <Input v-model="noticeInfo.url" auto-complete="off" placeholder="请输入跳转的链接 例（http://www.xxxx.com）" :maxlength="500"></Input>
        </FormItem>
        <FormItem label="优先级"  class="ivu-form-item-required">
          <InputNumber style="width: 100%;" v-model="noticeInfo.priority" auto-complete="off" :min=1  :max=1000
                       placeholder="请输入（根据优先级确定公告排序）"></InputNumber>
        </FormItem>
        <FormItem label="公告图标" style="text-align: left"  class="ivu-form-item-required" v-if="this.noticeInfo.model == 'image'">
          <Upload
            ref="upload"
            :show-upload-list="false"
            :max-size="2048"
            :before-upload="beforeUpload"
            :action="actionUrl"
            style="display: inline-block;width:58px;">
            <Button type="ghost" icon="ios-cloud-upload-outline" :loading="loadingStatus">请选择需要上传文件</Button>
          </Upload>
          <div style="padding: 16px 0">只能上传一张jpg/png文件，且不超过2M</div>
          <div style="overflow: hidden"><img style="width: 80%" :src="noticeInfo.img"></div>
        </FormItem>
        <FormItem label="文字"  class="ivu-form-item-required" v-if="this.noticeInfo.model == 'text'">
          <Input v-model="noticeInfo.text" type="textarea" :rows="4" auto-complete="off" placeholder="请输入文字公告"
                    :maxlength="200"></Input>
        </FormItem>
        <FormItem label="备注" >
          <Input v-model="noticeInfo.remark" type="textarea" :rows="4" auto-complete="off" placeholder="请输入备注"
                    :maxlength="200"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="isOpenModal = false">取 消</Button>
        <Button type="primary" :load="isSending" @click="submitProp(noticeInfo.adId)">{{isSending ? '提交中' : '确 定'}}</Button>
      </div>
    </Modal>

    <Modal title="公告排序" v-model="isOpenInput" width="300">
      <Form :model="noticeInfo" :label-width="50">
        <FormItem label="优先级"  >
          <InputNumber style="width: 100%;" v-model="noticeInfo.priority" auto-complete="off" :min=1  :max=1000 placeholder="请输入（根据优先级确定公告排序）"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="isOpenInput = false">取 消</Button>
        <Button type="primary" @click="submitProp(noticeInfo.adId)">{{isSending ? '提交中' : '确 定'}}</Button>
      </div>
    </Modal>

    <Spin size="large" fix v-if="isFetching">
      <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
      <div>加载中...</div>
    </Spin>
  </div> -->
</template>

<script type="text/ecmascript-6">
  /* import { httpRequest } from '@/service/index'
  import dayjs from "dayjs";
  import { pattern } from '@/config/regexp'
export default {
  created () {
    this.getGameNoticeList()
  },
  data () {
    return {
      nowSize: 20,
      nowPage: 1,
      currentPage: 1,
      actionUrl: '',
      isOpenModal: false,
      isFetching: false,
      isSending: false,
      loadingStatus: false,
      isOpenInput: false,
      fileList: [],
      uploadAction: '',
      imgFile: '',
      noticeStatus: ['已停用', '正常'],
      gameNoticeList: [],
      publishTime:'',
      noticeInfo: {
        adName: '',
        url: '',
        img: '',
        imgAli: '',
        type: '',
        model: '',
        publishTime: '',
        remark: ''
      },
      searchInfo: {
        adId: '',
        adName: ''
      },
      columns: [
        {
          title: '优先级',
          key: 'priority'
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
          title: '发布时间',
          key: '',
          width:180,
          render: (h, params) => {
            return h("span", params.row.publishTime ? dayjs(params.row.publishTime).format("YYYY-MM-DD HH:mm:ss") : dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: '状态',
          key: '',
          render: (h, params) => {
            return h('Tag', {
              props: {
                type: 'border',
                color: params.row.adStatus == 1 ? 'green' : 'gray'
              }
            },this.noticeStatus[params.row.adStatus])
          }
        },
        {
          title: '备注',
          key: 'count',
          render: (h,params)=> {
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
              return h("span", "暂无");
            }
          }
        },
        {
          title: '操作',
          key: '',
          width: 150,
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
                    this.changeStatus(params.row)
                  }
                }
              }, params.row.adStatus==1 ? '停用' : '开启'),
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
                    this.openInput(params.row)
                  }
                }
              }, '排序'),
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
              }, '删除')
            ])
          }
        }
      ],
      defaultList: []
    }
  },
  computed: {
    getItems () {
      if (this.nowPage === 1) {
        return this.gameNoticeList.slice(0, this.nowSize)
      } else {
        return this.gameNoticeList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
      }
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    }
  },
  methods: {
    getGameNoticeList () {
      if(this.searchInfo.adId == ''){
        delete this.searchInfo.adId
      }
      if (this.searchInfo.adName == '') {
        delete this.searchInfo.adName
      }
      if(this.isFetching) return
      this.isFetching = true
      httpRequest('post','/adList', {
        query: this.searchInfo
      }).then(
        result => {
          this.gameNoticeList = result.payload
        }
      ).finally(()=>{
        this.isFetching = false
      })
    },
    submitProp (id) {
      // console.log(pattern.url.exec(this.noticeInfo.url), this.noticeInfo.url)
      if(this.noticeInfo.url =='NULL!') this.noticeInfo.url = '';
      if (!this.noticeInfo.adName) {
        return this.$Message.error('请输入公告名称')
      } else if (!this.noticeInfo.type) {
        return this.$Message.error('请选择公告类型')
      } else if (!this.noticeInfo.model) {
        return this.$Message.error('请选择公告模式')
      } else if (this.noticeInfo.adName.length>10) {
        return this.$Message.error('公告长度不能超过10位')
      } else if (this.noticeInfo.url && !pattern.url.exec(this.noticeInfo.url)) {
        return this.$Message.error('请输入格式正确的跳转链接')
      } else if (this.noticeInfo.model == 'image' && !this.noticeInfo.img) {
        return this.$Message.error('请选择上传图片')
      } else if (this.noticeInfo.model == 'text' && !this.noticeInfo.text) {
        return this.$Message.error('请输入公告内容')
      } else if (!this.noticeInfo.priority) {
        return this.$Message.error('请输入优先级')
      } else if (!pattern.positiveInteger.exec(this.noticeInfo.priority)) {
        return this.$Message.error('请输入正整数')
      }
      if (this.isSending) return // 防止重复提交
      this.isSending = true
      this.noticeInfo.publishTime = this.publishTime!='' ? new Date(this.publishTime).getTime() : new Date().getTime()
      httpRequest('post',`${id ? '/adUpdate' : '/adNew'}`,this.noticeInfo)
        .then(
        result => {
          this.$Message.success('提交成功')
          this.isOpenModal = false
          this.isOpenInput = false
          this.getGameNoticeList()
          this.fileList = []
        }
      ).finally(()=>{
        this.isSending = false
      })
    },
    openModal (row = {}) {
      this.isOpenModal = true
      this.isSending = false
      if (JSON.stringify(row) !== '{}') {
        this.fileList = []
        this.noticeInfo = JSON.parse(JSON.stringify(row))
        this.noticeInfo.remark = this.noticeInfo.remark === 'NULL!' ? '' : this.noticeInfo.remark
        this.noticeInfo.url = this.noticeInfo.url === 'NULL!' ? '' : this.noticeInfo.url
        this.publishTime = new Date(this.noticeInfo.publishTime)
        this.fileList.push({
          name: '',
          url: this.noticeInfo.img
        })
      } else {
        this.noticeInfo = {
          adName: '',
          url: '',
          img: '',
          type: '',
          model: '',
          priority: 1,
          imgAli: '',
          publishTime: '',
          remark: ''
        }
        this.fileList = []
        this.publishTime = new Date()
      }
    },
    openInput (row) {
      this.isOpenInput = true
      this.noticeInfo = JSON.parse(JSON.stringify(row))
    },
    changeStatus (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定${row.adStatus ? '停用' : '开启'}该公告吗？`,
        onText: '确定',
        cancelText: '取消',
        onOk: ()=>{
          httpRequest('post','/adChangeStatus',{
            adId: row.adId,
            status: row.adStatus ? 0 : 1
          }).then(
            result => {
              this.$Message.success('状态改变成功')
              this.getGameNoticeList()
            }
          )
        },
        onCancel: ()=>{
          this.$Message.info('已取消删除')
        }
      })
    }, // 更改道具状态
    resetSearch () {
      this.searchInfo = {}
      this.getGameNoticeList()
    },
    getNowpage (page) {
      this.nowPage = page
      // console.log('当前是第:' + page + '页')
    },
    delItem (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除该公告吗',
        onText: '确定',
        cancelText: '取消',
        onOk: ()=>{
          httpRequest('post','/adDelete',{
            adId: row.adId
          }).then(
            result => {
              this.$Message.success('删除成功!')
              this.isOpenModal = false
              this.getGameNoticeList()
            }
          )
        },
        onCancel: ()=>{
          this.$Message.info('已取消删除')
        }
      })
    }, // 删除公告
    uploadAli () {
      localStorage.setItem("nowUrl", 'gameNoticeList');
      this.actionUrl = 'http://assetdownload.oss-cn-hangzhou.aliyuncs.com'
      let mi = new OSS.Wrapper({
        region: 'oss-cn-hangzhou',
        accessKeyId: this.uploadAction[1].ali.AccessKeyId,
        accessKeySecret: this.uploadAction[1].ali.AccessKeySecret,
        stsToken: this.uploadAction[1].ali.SecurityToken,
        bucket: 'assetdownload'
      })
      // console.log(this.imgFile.name)
      let suffix = this.suffixFun(this.imgFile.name)
      let date = new Date().getTime()
      let fileName = `image/${suffix[0]+date}.${suffix[1]}`
      mi.multipartUpload(fileName, this.imgFile, {
      }).then((results) => {
        this.$Message.success('阿里云上传成功')
        this.loadingStatus = false
        this.noticeInfo.imgAli = `http://app.risheng3d.com/${results.name}` || results.url
        // console.log(results,this.noticeInfo.img, 'src')
      }).catch((err) => {
        this.loadingStatus = false
        // console.log(err);
      });
    },
    uploadAws () {
      const dev = `https://s3-ap-southeast-1.amazonaws.com/image-na-dev/${this.imgFile.fileName}` //测试环境
      const prod = `http://img.na77.com/${this.imgFile.fileName}` //开发环境

      httpRequest('put',`${this.uploadAction[0].aws}`, this.imgFile)
        .then(res => {
          this.$Message.success('亚马逊上传成功')
          this.noticeInfo.img = (process.env.NODE_ENV == 'development') ? dev : prod
      }).finally(()=>{
        this.loadingStatus = false
      })
    },
    beforeUpload (file) {
      let fileName = this.suffixFun(file.name)
      let reg = new RegExp(/^[0-9a-zA-Z]*$/)
      const isLt1M = file.size / 1024 / 1024 < 2
      const suffix = fileName[1].toLowerCase()
      const fileType = ['png', 'jpg']
      this.imgFile = file
      this.imgFile.fileName = `${fileName[0]+new Date().getTime()}.${fileName[1]}`
      if (!(fileType.indexOf(suffix) > -1)) {
        return this.$Message.error('上传图片只能是 JPG或者PNG 格式!')
      } else if (!isLt1M) {
        return this.$Message.error('大小不能超过 2MB!')
      } else if (!reg.exec(this.suffixFun(this.imgFile.fileName)[0])) {
        return this.$Message.error("文件名只能是英文或者数字！");
      }
      return new Promise((resolve, reject) =>{
        this.loadingStatus = true
        httpRequest('post','/upload', {
          contentType: 'image',
          filePath: this.imgFile.fileName
        }).then(res => {
          this.uploadAction = res.payload
          this.actionUrl = res.payload[0].aws
          this.uploadAws()
          this.uploadAli()
          resolve(true)
        }).catch(err => {
          reject(false)
        })
      })
    }, // 上传前的检验
    suffixFun (o) {
      let arr = o.split('.')
      return arr
    } // 截取文件名的后缀
  }
} */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  /* .p-gameNoticeList{
    min-height: 89vh;
    .-p-m-header{
      overflow: hidden;
      padding-bottom: 16px;
      .g-text-right{
        text-align: right;
      }
    }
    .input{
      width: 60%
    }
    .searchResult{
      margin: 16px 0;
    }
    .page {
      padding-bottom: 2rem;
      text-align: right;
      margin-top: 2rem
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  } */
</style>
