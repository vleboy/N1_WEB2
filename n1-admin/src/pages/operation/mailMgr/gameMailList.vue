<template>
  <!--<div class="p-email">
     <p class="searchResult">共搜索到 {{mailList.length || 0}} 条数据</p>
    <div class="-p-m-header">
      <Col :span="11">
        <Button type="primary" @click="openModal()" v-if="permission.includes('创建邮件')">创建邮件</Button>
      </Col>
      <Col :span="13" class="-search-right">
        <Input placeholder="请输入邮件内容" class="input" v-model="searchInfo.content"></Input>
        <Button type="primary" @click="getMailList" style="margin-left: 10px">搜索</Button>
        <Button @click="resetSearch">重置</Button>
      </Col>
    </div>
    <div class="mailList">
      <Table :columns="columns" :data="getItems"></Table>
      <div class="page">
        <Page :total="mailList.length"
              show-elevator
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"></Page>
      </div>
    </div>
    <Modal title="发布邮件" v-model="isAddMail" width="700" :mask-closable="false">
      <Form :model="mailInfo" :label-width="80">
        <FormItem label="发送对象" style="text-align: left">
          <RadioGroup v-model="sendObj" @on-change="changeSendObj">
            <Radio label="1">商户</Radio>
            <Radio label="2">玩家</Radio>
            <Radio label="3">所有人（玩家）</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="商户列表" style="text-align: left" v-show="sendObj=='1'">
          <Select v-model="mailInfo.mNames" placeholder="请选择商户列表（支持多选 / 搜索）" filterable multiple style="width: 100%">
            <Option v-for="(item, index) in merchantList" :key="index" :value="item.username">{{item.username}}</Option>
          </Select>
        </FormItem>
        <FormItem label="商户列表" style="text-align: left" v-show="sendObj=='2'">
          <Select v-model="merchantInfo" placeholder="请选择商户列表（只能单选 / 搜索）" filterable style="width: 100%"
                  @on-change="changeMerchant">
            <Option v-for="(item, index) in merchantList" :key="index" :value="item.userId">{{item.username}}</Option>
          </Select>
        </FormItem>
        <FormItem label="玩家列表" style="text-align: left" v-if="sendObj == '2'">
          <Select v-model="mailInfo.names" placeholder="请选择玩家（支持多选 / 搜索）" style="width: 100%" filterable multiple
                  not-found-text="没有匹配的玩家" :loading=isFetchPlayer loading-text="获取玩家中...">
            <Option v-for="(item, index) in playerList" :key="index" :value="item.userName">{{item.userName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="邮件主题"  >
          <Input v-model="mailInfo.title" placeholder="请输入邮件主题" :maxlength='20'></Input>
        </FormItem>
        <FormItem label="邮件内容"  >
          <Input v-model="mailInfo.content" type="textarea" :rows="4" auto-complete="off" placeholder="请输入邮件内容"
                    :maxlength="200"></Input>
        </FormItem>
        <FormItem label="发送方式">
          <RadioGroup v-model="checkTime">
            <Radio label="1">立即发送</Radio>
            <Radio label="2">定时发送</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择时间"  v-if="checkTime == 2">
          <DatePicker
            :editable='false'
            :transfer='true'
            v-model="mailInfo.sendTime"
            type="datetime"
            placeholder="选择日期时间" style="width: 100%">
          </DatePicker>
        </FormItem>
         <FormItem label="包含物品"  v-if="role!='100'">
          <Row>
            <Col :span="7">
              <Col :span="4">类型</Col>
              <Col :span="18">
                <Select v-model="contentType" placeholder="请选择" style="width: 100%"
                        @on-change="changeType()" :disabled="isEditPackage">
                  <Option v-for="(item, index) in goodsType" :key="index" :value="item.name">{{item.name}}</Option>
                </Select>
              </Col>
            </Col>
            <Col :span="7">
              <Col :span="4">道具</Col>
              <Col :span="18">
                <Select v-model="addToolInfo.toolName" placeholder="请选择"  style="width: 100%">
                  <Option v-for="(item, index) in propList" :key="index" :value="item.toolName"
                          v-if="contentType == '道具列表'">{{item.toolName}}
                  </Option>
                  <Option v-for="(item, index) in packageList" :key="index"
                             :value="item.packageName" v-if="contentType == '礼包列表'">{{item.packageName}}
                  </Option>
                </Select>
              </Col>
            </Col>
            <Col :span="7">
              <Col :span="4">数量</Col>
              <Col :span="18">
                <Input v-model="addToolInfo.sum" placeholder="请输入数量"></Input>
              </Col>
            </Col>
            <Col :span="3" class="g-text-right">
              <Button @click="addProp" type="primary">{{isEditPackage ? '修改' : '添加'}}</Button>
            </Col>
          </Row>
          <div style="margin-top: 2rem">
            <Row class="-package-add">
              <Table :columns="columnsTool" :data="addToolList"></Table>
            </Row>
          </div>
        </FormItem> 
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="isAddMail = false">取 消</Button>
        <Button type="primary" :load="isSending" @click="submitProp()">{{isSending ? '提交中' : '确 定'}}</Button>
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
export default {
  name: 'app',
  created () {
    this.getMailList()
    // this.getPackageList()
    // this.getPropList()
    this.getMerchantList()
  },
  data () {
    return {
      nowSize: 20,
      nowPage: 1,
      currentPage: 1,
      isAddMail: false,
      isSending: false,
      isFetching: false,
      isFetchPlayer: false,
      checkTime: '1',
      merchantInfo: '',
      isEditPackage: false, // 新增礼包道具编辑状态控制
      contentType: '', // 选择物品的类型
      mailList: [],
      packageList: [],
      goodsType: [
        {
        code: 1,
        name: '道具列表'
        },
        {
          code: 2,
          name: '礼包列表'
        }
      ],
      mailInfo: {
        title: '',
        sendTime: '',
        content: '',
        mNames: [], // 商户数组
        names: [], // 玩家数组
        tools: []
      },
      searchInfo: {
        content: ''
      },
      addToolInfo: {
        toolName: '',
        sum: '',
        contentType: ''
      }, // 暂加新增的道具
      propList: [], // 获取道具列表
      addToolList: [], // 添加新增道具列表（本地暂加）
      merchantList: [], // 获取商户列表（单选）
      playerList: [], // 获取玩家列表
      sendObj:'', // 发送对象
      role: localStorage.loginRole, // 相应角色的权限（区分商户、线路商、平台角色）
      columns: [
        {
          title: '邮件主题',
          key: 'title'
        },
        {
          title: '邮件内容',
          key: 'content'
        },
        // {
        //   title: '包含物品',
        //   key: '',
        //   render: (h, params) => {
        //     let html = []
        //     if (params.row.tools.length) {
        //       for (let item of params.row.tools) {
        //         html.push(h('span',`${item.toolName}x${item.sum};`))
        //       }
        //       return h('div',html)
        //     } else {
        //       return h('span','暂无物品')
        //     }
        //   }
        // },
        {
          title: '发送对象',
          key: 'msn',
          render: (h, params) => {
            let nameMerchant = ''
            let namePlayer = ''

            if(params.row.mNames && params.row.mNames.length) {
              nameMerchant = params.row.mNames.join(',')
            }
            if(params.row.names && params.row.names.length) {
              nameMerchant = params.row.names.join(',')
            }

            return h('span', nameMerchant || namePlayer || '所有玩家')
          }
        },
        {
          title: '发送时间',
          key: '',
          render: (h, params) => {
            return h("span", dayjs(params.row.sendTime).format("YYYY-MM-DD HH:mm:ss"));
          }
        }
      ],
      columnsTool: [
        {
          title: '道具',
          key: 'toolName'
        },
        {
          title: '数量',
          key: 'sum'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    this.updatePackage(params.row)
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
                    this.delAddPackage(params.index)
                  }
                }
              },'删除')
            ]);
          }
        }
      ]
    }
  },
  computed: {
    getItems () {
      if (this.nowPage == 1) {
        return this.mailList.slice(0, this.nowSize)
      } else {
        return this.mailList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
      }
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    }
  },
  methods:  {
    getMailList () {
      if (this.searchInfo.content == '') {
        delete this.searchInfo.content
      }
      if(this.isFetching) return
      this.isFetching = true
      httpRequest('post', '/email/list', {
        query: this.searchInfo
      })
        .then(result => {
          this.mailList = result.list
        }).finally(()=>{
        this.isFetching = false
      })
    },
    submitProp () {
      this.mailInfo.tools = this.addToolList
      if(this.sendObj == '1' && !this.mailInfo.mNames.length) {
        return this.$Message.error('请选择发送的商户')
      } else if(this.sendObj == '2' && !this.mailInfo.names.length) {
        return this.$Message.error('请选择发送的玩家')
      } else if(this.sendObj == '') {
        return this.$Message.error('请选择发送对象')
      } else if (!this.mailInfo.title) {
        return this.$Message.error('请输入邮件标题')
      } else if (!this.mailInfo.content) {
        return this.$Message.error('请输入邮件内容')
      } else if (!this.mailInfo.sendTime && (this.checkTime == 2)) {
        return this.$Message.error('请选择发送时间')
      }
      this.mailInfo.sendTime = this.mailInfo.sendTime ? new Date(this.mailInfo.sendTime).getTime() : new Date().getTime()
      if (this.isSending) return // 防止重复提交
      this.isSending = true
      httpRequest('post', '/email/add', this.mailInfo).then(
        result => {
          this.$Message.success('提交成功')
          this.addToolList = []
          this.isAddMail = false
          this.isSending = false
          this.getMailList()
        }
      )
    },
    openModal () {
      this.isAddMail = true
      this.isEditPackage = false
      this.merchantInfo = ''
      this.sendObj = ''
      this.mailInfo = {
        title: '',
        sendTime: '',
        content: '',
        mNames: [],
        names: [],
        tools: []
      }
      this.addToolInfo = {
        toolName: '',
        sum: ''
      }
      this.addToolList = []
      this.contentType = ''
    },
    resetSearch () {
      this.searchInfo = {}
      this.getMailList()
    },
    getNowpage (page) {
      this.nowPage = page
      // console.log('当前是第:' + page + '页')
    },
    getPropList () {
      httpRequest('post', '/toolList', {}, 'game').then(
        result => {
          for (let item of result.payload) {
            if (item.toolStatus) {
              this.propList.push(item)
            }
          }
        }
      )
    }, // 获取道具列表
    getPackageList () {
      httpRequest('post', '/packageList', {}, 'game').then(
        result => {
          this.packageList = result.payload
        }
      )
    }, // 获取礼包列表
    getMerchantList () {
      httpRequest('post', '/merchants').then(
        result => {
          this.merchantList = result.payload
        }
      )
    }, // 获取商户列表
    getPlayerList () {
      this.playerList = []
      if(this.isFetchPlayer) return
      this.isFetchPlayer = true
      httpRequest('post', '/merchant/player/list',{
        userId: this.merchantInfo
      }).then(
        result => {
          this.playerList = result.list
        }
      ).finally(()=>{
        this.isFetchPlayer = false
      })
    }, // 获取商户下玩家列表
    addProp () {
      let reg = new RegExp(/^[0-9]*[1-9][0-9]*$/)
      if (!this.addToolInfo.toolName) {
        return this.$Message.error('请选择道具')
      } else if (!this.addToolInfo.sum) {
        return this.$Message.error('请选择数量')
      } else if (!reg.exec(this.addToolInfo.sum)) {
        return this.$Message.error('道具数量范围为1-1000,000,00的正整数')
      } else if (this.addToolList.length > 12) {
        return this.$Message.error('物品数量不能多于12个')
      }
      if (this.isEditPackage) {
        let updateTool = {}
        if (this.contentType == '道具列表') {
          this.propList.forEach(item => {
            if (item.toolName == this.addToolInfo.toolName) {
              updateTool = JSON.parse(JSON.stringify(Object.assign(this.addToolInfo, item)))
            }
          })
          this.addToolList.forEach((item, index, array) => {
            if (item.id == updateTool.id) {
              array.splice(index, 1, updateTool)
            }
          })
        } else {
          this.packageList.forEach(item => {
            if (item.packageName == this.addToolInfo.toolName) {
              updateTool = JSON.parse(JSON.stringify(Object.assign(this.addToolInfo, item)))
            }
          })
          this.addToolList.forEach((item, index, array) => {
            if (item.id == updateTool.id) {
              array.splice(index, 1, updateTool)
            }
          })
        }
        this.isEditPackage = false
      } else {
        if (this.contentType == '道具列表') {
          let toolObj = {}
          this.propList.forEach(item => {
            if (item.toolName == this.addToolInfo.toolName) {
              this.addToolInfo.id = this.addToolList.length + 1
              this.addToolInfo.contentType = this.contentType == '道具列表' ? 1 : 2
              toolObj = JSON.parse(JSON.stringify(Object.assign(this.addToolInfo, item)))
              this.addToolList.push(toolObj)
            }
          })
        } else {
          let packObj = {}
          this.packageList.forEach(item => {
            if (item.packageName == this.addToolInfo.toolName) {
              this.addToolInfo.id = this.addToolList.length + 1
              this.addToolInfo.contentType = this.contentType == '道具列表' ? 1 : 2
              packObj = JSON.parse(JSON.stringify(Object.assign(this.addToolInfo, item)))
              this.addToolList.push(packObj)
            }
          })
        }
      }
      // console.log(this.addToolList, 'addToolList')
    }, // 新增道具
    delAddPackage (index) {
      if(!this.isEditPackage) {
        this.addToolList.splice(index, 1)
      } else {
        this.$Message.error('编辑状态无法删除')
      }

    }, // 删除新增的道具
    updatePackage (row) {
      this.isEditPackage = true
      this.addToolInfo = JSON.parse(JSON.stringify(row))
      this.contentType = this.addToolInfo.contentType == 1 ? '道具列表' : '礼包列表'
    },
    changeType () {
      if (!this.isEditPackage) {
        this.addToolInfo = {
          toolName: '',
          sum: ''
        }
      }
    },
    changeSendObj () {
      this.merchantInfo = ''
      this.mailInfo.names = []
      this.mailInfo.mNames = []
    },
    changeMerchant () {
      if(this.sendObj == '2') {
        this.getPlayerList()
        this.mailInfo.names = []
      }
    }
  }
} */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" type="text/less">
  /* .p-email{
    min-height: 89vh;
    .-p-m-header{
      overflow: hidden;
      padding-bottom: 16px;
    }
    .-search-right{
      text-align: right;
    }
    .input{
      width: 48%
    }

    .page {
      padding-bottom: 2rem;
      text-align: right;
      margin-right: 1%;
      margin-top: 2rem
    }
    .-package-add{
      max-height: 154px;
      overflow: auto;
    }
    .demo-spin-icon-load{
      animation: ani-demo-spin 1s linear infinite;
    }
  }
 */
</style>
