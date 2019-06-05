<template>
  <div class="-player-add">
    <div class="addmanager">
      <h2>创建玩家</h2>
      <div class="-player-form">
        <Form :model="playerInfo" ref="addPlayer" :label-width="100" label-position="right" :rules="rules">
          <FormItem label="用户名" prop="userName">
            <Input v-model="playerInfo.userName" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="密码" prop="userPwd">
            <div style="position: relative">
              <Input v-model="playerInfo.userPwd" placeholder="请输入"></Input>
            </div>
               </FormItem>
          <FormItem label="直属上级">
            <Select v-model="playerInfo.parentId" placeholder="请选择上级代理商" clearable style="width: 100%" @on-change="changeList">
              <Option v-for="(item, index) in childrenList" :key="index" :label="item.displayName" :value="item.userId"></Option>
            </Select>
          </FormItem>
          <FormItem label="玩家洗码比">
            <div v-for="item of gameList">
              <Col span="4" class="-a-input">{{item.name}}</Col>
              <Col span="20" class="-a-input">
                <Tooltip effect="dark" :content="item.playerMix" placement="right">
                <InputNumber v-model="item.percentage" placeholder="请输入玩家洗码比（必填）" mix=0 class="input-number"
                       @on-blur="changeMix(item)"></InputNumber>
              </Tooltip>
              </Col>
            </div>
          </FormItem>
          <FormItem label="分配点数" prop="points">
            <Tooltip :content="parentPoints" placement="right">
              <Input v-model="playerInfo.points" placeholder="请输入" :disabled="playerInfo.parentId==''"></Input>
            </Tooltip>
          </FormItem>
          <FormItem label="备注" prop="remark">
            <Input v-model="playerInfo.remark" class="input" type="textarea" :rows="4" auto-complete="off"
                      placeholder="请输入" :maxlength="200"></Input>
          </FormItem>
          <FormItem>
            <div style="text-align: center">
              <Button type="primary" class="subBtn" @click="addPlayer"> 创建玩家</Button>
              <Button type="primary" class="subBtn" @click="resetAdmin"> 重置</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { httpRequest } from '@/service/index'
  import { pattern } from '@/config/regexp'
  export default {
    created () {
      this.getChildrenList()
    },
    data () {
      let checkUserName = (rule, value, callback) => {
        var regName = new RegExp(/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){6,16}$/)
        if (value === '') {
          callback(new Error('请输入用户名名称'))
          this.status.isCheckUserName = false
        } else if (!regName.exec(value)) {
          callback(new Error('请输入6-16位中英文或者数字'))
          this.status.isCheckUserName = false
        } else {
          callback()
          this.status.isCheckUserName = true
        }
      } // 用户名
      let checkPassWord = (rule, value, callback) => {
        var regName = new RegExp(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/)
        if (value === '') {
          callback(new Error('请输入密码'))
          this.status.isCheckPwd = false
        } else if (!regName.exec(value)) {
          callback(new Error('密码由6-16字母和数字组成'))
          this.status.isCheckPwd = false
        } else {
          callback()
          this.status.isCheckPwd = true
        }
      } // 密码
      let checkPoints = (rule, value, callback) => {
        var regName = new RegExp(/^([1-9]\d*|[0]{1,1})$/)
        if (!value) {
          callback(new Error('请输入要分配的点数'))
          this.status.isCheckPoints = false
        } else if (!regName.exec(value)) {
          callback(new Error(`请输入 0 ~ ${this.mixInfo.points} (所选上级余额) 之间的正整数`))
          this.status.isCheckPoints = false
        } else if (value > this.mixInfo.points) {
          callback(new Error(`上级代理可分配点数为${this.mixInfo.points} 已超出最大可分配点数`))
          this.status.isCheckPoints = false
        } else {
          callback()
          this.status.isCheckPoints = true
        }
      } // 分配点数
      return {
        playerInfo: {
          userName: '',
          userPwd: '',
          points: '',
          parentId: '',
          remark: ''
        },
        childrenList: [],
        mixInfo: {},
        status: {
          isCheckUserName: false,
          isCheckPwd: false,
          isCheckPoints: false,
          isSending: false
        },
        rules: {
          userName: [
            {validator: checkUserName, trigger: 'blur'}
          ],
          userPwd: [
            {validator: checkPassWord, trigger: 'blur'}
          ],
          points: [
            {validator: checkPoints, trigger: 'blur'}
          ]
        },
        gameList: [],
        columns: [
          {
            title: '游戏类别',
            key: 'name'
          },
          {
            title: '玩家洗码比（%）',
            key: '',
            render: (h,params)=>{
              return h('Tooltip',{
                props:{
                  content: params.row.playerMix,
                  placement: 'right'
                }
              },[
                h('InputNumber',{
                  props: {
                    placeholder: '请输入玩家洗码比（必填）',
                    mix: 0
                  },
                  on: {
                    blur: ()=>{
                      this.changeMix(params.row)
                    }
                  }
                })
              ])
            }
          }
        ]
      }
    },
    computed: {
      parentPoints () {
        return `上级代理可分配点数为:${this.mixInfo.points || 0}`
      }
    },
    methods: {
      getChildrenList () {
        httpRequest('post','/agent/children/list')
        .then(
          result => {
            this.childrenList = result.list
            this.playerInfo.parentId = ''
          }
        )
      },
      changeList () {
        for (let item of this.childrenList) {
          if (item.userId === this.playerInfo.parentId) {
            this.mixInfo = item
            this.gameList = item.gameList
          }
        }
        for (let data of this.gameList) {
          data.playerMix = `该玩家游戏洗码比范围为: 0% ~ ${data.mix}%`
          data.isPercentage = false
        }
      },
      changeMix (row) {
        if (row.percentage > row.mix || !pattern.positive.exec(row.percentage)){
          this.$Message.error(`请输入正确的${row.name}洗码比范围`)
          row.isPercentage = false
        } else {
          row.isPercentage = true
        }
      },
      addPlayer () {
        let isCheck = this.gameList.some(item=>{
          return item.isPercentage == false
        })
        let newGameList = []
        for (let item of this.gameList) {
          newGameList.push({
            mix: item.percentage,
            code: item.code,
            name: item.name
          })
        }
        if (!this.status.isCheckUserName || !this.status.isCheckPwd || !this.status.isCheckPoints) {
          return this.$Message.error('请完善配置信息')
        } else if (!this.playerInfo.parentId) {
          return this.$Message.error('请选择直属上级')
        } else if (isCheck) {
          return this.$Message.error('请输入正确的玩家洗码比')
        }
        this.playerInfo.gameList = newGameList
        if (this.status.isSending) return
        this.status.isSending = true
        httpRequest('post','/agent/player/create',this.playerInfo)
          .then(
          result => {
            this.$Message({
              message: '创建成功',
              type: 'success'
            })
            this.$router.push('play')
          }
        ).finally(()=>{
          this.status.isSending = false
        })
      },
      resetAdmin () {
        this.playerInfo = {
          userName: '',
          userPwd: '',
          points: '',
          parentId: '',
          remark: ''
        }
      }
    }
  }
</script>

<style scpoed type="text/less" lang="less">
  .-player-add{
    min-height: 87vh;
    h2{
      text-align:center;
      font-size: 1.8rem;
      font-weight: normal;
      padding: 16px 0;
    }
    .addmanager{
      width:48rem;
      margin: 0 auto;
    }
    .-p-addPwd{
      position: absolute;
      top: 0;
      right: -40px
    }
    .input-number{
      width: 200px;
    }
    .-a-input{
      text-align: center;
    }
    .subBtn{
      margin-top: 1rem;
      margin-left: 2rem;
      margin-right: 4rem
    }
    .ivu-tooltip{
      width: 100%;
      .ivu-tooltip-rel{
        width: 100%;
      }
    }
  }
</style>
