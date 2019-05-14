<template>
  <!-- <div class="p-boothList">
    <div class="-search">
      <Row class="row -search-row">
        <Col class="-s-text" span="2" offset="4">物品ID</Col>
        <Col span="4">
        <Input v-model="searchInfo.toolId" placeholder="请输入"></Input>
        </Col>
        <Col class="-s-text" span="2">物品名称</Col>
        <Col span="4">
        <Input v-model="searchInfo.toolName" placeholder="请输入"></Input>
        </Col>

        <Col span="5">
        <div class="btns">
          <Button type="primary" @click="startSearch">搜索</Button>
          <Button type="ghost" @click="resetSearch">重置</Button>
        </div>
        </Col>
      </Row>
    </div>
    <!--<p class="searchResult">共搜索到 {{boothList.length || 0}} 条数据</p>
    <div class="-booth-searchResult">-->
      <!--<Col :span="5">-->
        <!--<el-radio-group v-model="radioInfo" @change="changeRadio()">-->
          <!--<el-radio-button v-for="(item, index) in boothType" :key="index" :label="item.code" >{{item.name}}</el-radio-button>-->
        <!--</el-radio-group>-->
      <!--</Col>-->
      <!-- <Col :span="24">
        <Button type="primary" @click="openModal()" v-if="permission.includes('物品上架')">物品上架</Button>
      </Col>
    </div>
    <div>
      <Table :columns="columns" :data="getItems"></Table>
      <div class="page">
        <Page :total="boothList.length"
              show-elevator
              :page-size="20"
              :current.sync="currentPage"
              @on-change="getNowpage"></Page>
      </div>
    </div>
    <Modal title="物品上架" v-model="isAddProp" >
      <Form :model="boothInfo" :label-width="80"> -->
        <!--<FormItem label="选择上架展位" label-width="110px" >-->
          <!--<el-select v-model="boothInfo.seatType" placeholder="请选择上架展位" clearable style="width: 100%" @change="changeType()">-->
            <!--<el-option v-for="(item, index) in boothType" :key="index" :label="item.name" :value="item.code"></el-option>-->
          <!--</el-select>-->
        <!--</FormItem>-->
        <!-- <FormItem label="展位编号">
          <InputNumber v-model="boothInfo.order" placeholder="请输入展位编号" :min=0 :max=20 style="width:100%"></InputNumber>
        </FormItem>
        <FormItem label="物品类型">
          <Select v-model="boothInfo.contentType" placeholder="请选择物品类型" clearable style="width: 100%"
                     @on-change="changeGoods()">
            <Option v-for="(item, index) in goodsType" :key="index" :label="item.name" :value="item.code"></Option>
          </Select>
        </FormItem>
        <FormItem label="选择物品">
          <Select v-model="boothInfo.prop" placeholder="请选择上架物品" filterable clearable :disabled="!isCheckGoods" style="width: 100%">
            <Option v-for="(item, index) in oldPropList" :key="index" :laber="item.toolName"
                       :value="item.toolName" v-if="boothInfo.contentType==1">
            </Option>
            <Option v-for="(item, index) in packageList" :key="index" :laber="item.packageName"
                       :value="item.packageName" v-if="boothInfo.contentType==2">
            </Option>
          </Select>
        </FormItem>
        <FormItem label="物品数量"  >
          <InputNumber v-model="boothInfo.sum" placeholder="请输入物品数量" :min=0 :max=100000000 style="width:100%"></InputNumber>
        </FormItem>
        <FormItem label="物品售价"  >
          <InputNumber v-model="boothInfo.price" placeholder="请输入物品售价" :min=0 :max=100000000 style="width:100%"></InputNumber>
        </FormItem>
        <FormItem label="是否促销"  style="text-align: left">
          <Checkbox  v-model="isChecked"></Checkbox>
        </FormItem>
        <FormItem label="自定义图标"  style="text-align: left">
          <Checkbox v-model="isShowIcon"></Checkbox>
        </FormItem>
        <FormItem label="图标名称"  v-if="isShowIcon">
          <Input v-model="boothInfo.icon" placeholder="请输入图标名称" :maxlength='20'></Input>
        </FormItem>
        <FormItem label="备注"  >
          <Input v-model="boothInfo.remark" type="textarea" :rows="4" auto-complete="off" placeholder="请输入备注"
                    :maxlength="200"></Input>
        </FormItem>
      </Form>
      <div slot="footer" class="dialog-footer">
        <Button @click="isAddProp = false">取 消</Button>
        <Button type="primary" :load="isSending" @click="submitProp(boothInfo.seatId)">{{isSending ? '提交中' : '确 定'}}</Button>
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
    this.getPropList()
    this.getBoothList()
    this.getPackageList()
  },
  data () {
    return {
      nowSize: 20,
      nowPage: 1,
      currentPage: 1,
      isAddProp: false,
      isSending: false,
      isChecked: false, // 是否促销
      isShowIcon: false, // 是否显示自定义图标
      isCheckGoods: false,
      isFetching: false,
      radioInfo: '1',
      boothType: [],
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
      boothClassStatus: ['', 'green', 'red'],
      boothStatus: ['已停用', '正常', '促销'],
      boothList: [],
      oldPropList: [],
      propList: [],
      packageList: [],
      boothInfo: {
        seatType: 2,
        remark: '',
        order: 0,
        sum: 0,
        price: 0,
        prop: '',
        seatStatus: '',
        contentType: '',
        icon: '',
        content: ''
      },
      searchInfo: {
        toolName: '',
        toolId: ''
      },
      searchArray: [], // 暂时加储
      columns: [
        {
          title: '展位',
          key: 'order',
          width: 60,
        },
        {
          title: '物品名称',
          key: 'userNameParent',
          width:200,
          render: (h,params) => {
            return h('span', params.row.content.toolName || params.row.content.packageName)
          }
        },
        {
          title: '道具售价',
          key: 'price'
        },
        {
          title: '数量',
          key: 'sum'
        },
        {
          title: '物品类型',
          key: '',
          render: (h,params) => {
            return h('span', params.row.contentType==1 ? '道具' : '礼包')
          }
        },
        {
          title: '状态',
          key: 'state',
          render: (h,params) => {
            return h('Tag', {
              props: {
                type: 'border',
                color: this.boothClassStatus[params.row.seatStatus]
              }
            },this.boothStatus[params.row.seatStatus])
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
              return h("span", "暂无");
            }
          }
        },
        {
          title: '创建时间',
          key: '',
          width: 160,
          render: (h, params) => {
            return h("span", dayjs(params.row.createdAt).format("YYYY-MM-DD HH:mm:ss"));
          }
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
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
                    this.delProp(params.row)
                  }
                }
              }, '删除')
            ]);
          }
        }
      ]
    }
  },
  computed: {
    getItems () {
      if (this.nowPage === 1) {
        return this.boothList.slice(0, this.nowSize)
      } else {
        return this.boothList.slice(((this.nowPage - 1) * this.nowSize), this.nowSize * this.nowPage)
      }
    },
    permission() {
      return JSON.parse(localStorage.userInfo).subRolePermission;
    }
  },
  methods: {
    getBoothList (type) {
      if(this.isFetching) return
      this.isFetching = true
      httpRequest('post','/seatList', {
        seatType: type || '2'
      },'game').then(
        result => {
          this.boothList = result.payload
          this.searchArray = result.payload
        }
      ).finally(()=>{
        this.isFetching = false
      })
    },
    submitProp (id) {
      this.boothInfo.seatStatus = this.isChecked ? '2' : '1'
      this.boothInfo.icon = this.isShowIcon ? this.boothInfo.icon : ''
      if (this.boothInfo.contentType === 1) {
        this.oldPropList.forEach(item => {
          if (item.toolName === this.boothInfo.prop) {
            this.boothInfo.content = item
          }
        })
      } else if (this.boothInfo.contentType === 2) {
        this.packageList.forEach(item => {
          if (item.packageName === this.boothInfo.prop) {
            this.boothInfo.content = item
          }
        })
      }
      if (!this.boothInfo.seatType) {
        return this.$Message.error('请选择展位')
      } else if (!this.boothInfo.order) {
        return this.$Message.error('请输入展位编号')
      } else if (!pattern.positiveInteger.exec(this.boothInfo.order)) {
        return this.$Message.error('展位编号为正整数')
      } else if (!this.boothInfo.content) {
        return this.$Message.error('请选择物品')
      } else if (!this.boothInfo.price) {
        return this.$Message.error('请输入物品售价')
      } else if (!this.boothInfo.sum) {
        return this.$Message.error('请输入物品数量')
      } else if (!pattern.positiveInteger.exec(this.boothInfo.price) || this.boothInfo.price > 100000000) {
        return this.$Message.error('物品售价范围为1-1000,000,00的正整数')
      } else if (!pattern.positiveInteger.exec(this.boothInfo.sum) || this.boothInfo.sum > 100000000) {
        return this.$Message.error('物品数量范围为1-1000,000,00的正整数')
      } else if (this.isShowIcon && (!this.boothInfo.icon || this.boothInfo.icon=='NULL!')) {
        return this.$Message.error('请选择自定义图标')
      }
      if (this.isSending) return // 防止重复提交
      this.isSending = true
      httpRequest('post',`${id ? '/seatUpdate' : '/seatNew' }`,this.boothInfo, 'game')
        .then(() => {
          this.$Message.success('提交成功')
          this.isAddProp = false
          this.getBoothList()
          this.isSending = false
        }
      )
    },
    delProp (row) {
      this.$Modal.confirm({
        title: '提示',
        content: `确定将${row.order}号展位中的物品下架吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: ()=>{
          httpRequest('post','/seatDelete', {
            seatId: row.seatId
          }, 'game').then(
            result => {
              this.$Message.success('删除成功')
              this.isAddProp = false
              this.getBoothList()
            }
          )
        },
        onCancel: () => {
          this.$Message.info('已取消删除')
        }
      })
    }, // 删除
    openModal (row = {}) {
      this.isAddProp = true
      this.boothInfo = JSON.parse(JSON.stringify(row))
      if (JSON.stringify(row) !== '{}') {
        this.isShowIcon = this.boothInfo.icon != "NULL!" // 看是否设定了自定义图
        this.boothInfo.remark = this.boothInfo.remark === 'NULL!' ? '' : this.boothInfo.remark
        this.isChecked = this.boothInfo.seatStatus === 2
        this.boothInfo.prop = (this.boothInfo.content.toolName || this.boothInfo.content.packageName)
        this.isCheckGoods = true
      } else {
        this.boothInfo = {
          seatType: 2,
          remark: '',
          order: 0,
          sum: 0,
          price: 0,
          prop: '',
          seatStatus: '',
          contentType: '',
          content: ''
        }
        this.isShowIcon = false
        this.isChecked = false
      }
    },
    startSearch () {
      let {toolId, toolName} = this.searchInfo
      this.arrayLocal = JSON.parse(JSON.stringify(this.searchArray))
      // console.log(this.arrayLocal, 111)
      if ((!toolId && !toolName)) {
        this.searchArray = []
        this.getBoothList()
      } else if (toolName && toolId) {
        this.boothList = this.arrayLocal.filter(item => {
          return ((item.content.toolName ? item.content.toolName : item.content.packageName) === this.searchInfo.toolName &&
          (item.content.toolId ? item.content.toolId : item.content.packageId) === this.searchInfo.toolId)
        })
      } else {
        if (toolName) {
          this.boothList = this.arrayLocal.filter(item => {
            return (item.content.toolName ? item.content.toolName : item.content.packageName) === this.searchInfo.toolName
          })
        } else if (toolId) {
          this.boothList = this.arrayLocal.filter(item => {
            return (item.content.toolId ? item.content.toolId : item.content.packageId) === this.searchInfo.toolId
          })
        }
      }
    }, // 控制搜索条件
    resetSearch () {
      this.searchInfo = {}
      this.searchArray = []
      this.getBoothList()
    },
    changeRadio () {
      this.getBoothList(this.radioInfo)
    },
    getNowpage (page) {
      this.nowPage = page
      // console.log('当前是第:' + page + '页')
    },
    getPropList () {
      httpRequest('post','/toolList',{},'game')
        .then(result => {
          for (let item of result.payload) {
            if (item.toolStatus) {
              this.oldPropList.push(item)
            }
          }
        }
      )
    }, // 新增礼包获取道具列表
    getPackageList () {
      httpRequest('post','/packageList',{},'game')
        .then(result => {
          for (let item of result.payload) {
            if (item.packageStatus) {
              this.packageList.push(item)
            }
          }
        }
      )
    }, // 新增礼包获取道具列表
    changeGoods () {
      if (this.boothInfo.contentType === 1) {
        this.boothInfo.prop = this.boothInfo.content.toolName
        this.isCheckGoods = true
      } else if (this.boothInfo.contentType === 2) {
        this.boothInfo.prop = this.boothInfo.content.packageName
        this.isCheckGoods = true
      } else {
        this.isCheckGoods = false
      }
    }, // 改变物品类型
    changeType () {
      if (this.boothInfo.seatType === '1') {
        this.propList = this.oldPropList.filter(item => {
          return (item.toolId === '100000')
        })
      } else {
        this.propList = this.oldPropList
      }
    } // 改变展品类型
  }
} */
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped type="text/less" lang="less">
  /* .p-boothList{
    min-height: 89vh;
    .-search{
      text-align: center
    }
    .-s-text{
      height: 32px;
      line-height: 32px;
    }
    .input{
      width: 80%
    }
    .searchResult{
      padding: 1rem 2rem
    }
    .-booth-searchResult{
      overflow: hidden;
      padding-bottom: 16px
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
