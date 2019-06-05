<template>
  <Modal class="p-modal-recharge" :title="isSaveStatus ? '玩家存点' : '玩家提点'" v-model="isOpenModalChild" size="tiny"
         @on-visible-change="change">
    <Form :model="balanceInfo" v-if="!isSuccess"  :label-width="100">
      <FormItem :label="isSaveStatus ? '起始账户' : '转入账户'" >
        {{agentName}}
      </FormItem>
      <FormItem :label="isSaveStatus ? '存点数' : '提点数'">
        <Tooltip effect="dark" :content="parentPoints" placement="right">
          <Input v-model="balanceInfo.points" :placeholder="isSaveStatus ? '请输入存点数' : '请输入提点数'" class="input"></Input>
        </Tooltip>
      </FormItem>
      <FormItem label="备注">
        <Input placeholder="请输入备注" type="textarea" :rows="6" :maxlength="180" class="input"
               v-model="balanceInfo.remark"></Input>
      </FormItem>
    </Form>
    <div v-else>
      <h3 class="-p-m-tips g-text-center"><Icon type="checkmark-circled" class=" -p-green"></Icon> 操作成功</h3>
      <Form>
        <FormItem label="起始账户："  >
          {{isSaveStatus ? agentName : balanceInfo.userName}} 减少点数：
          <span class="-p-red">{{formatPoints(balanceInfo.points || 0)}}</span>,
          当前剩余点数：{{formatPoints(isSaveStatus ? agentPoints-balanceInfo.points : balanceInfo.balance-balanceInfo.points)}}
        </FormItem>

        <FormItem label="转入账户："  >
          {{isSaveStatus ? balanceInfo.userName : agentName}} 增加点数：
          <span class="-p-green">{{formatPoints(balanceInfo.points || 0)}}</span>,
          当前点数：{{formatPoints(isSaveStatus ? balanceInfo.balance+Number(balanceInfo.points) : agentPoints+Number(balanceInfo.points))}}
        </FormItem>
      </Form>
    </div>
    <div slot="footer">
      <Button v-if="!isSuccess" @click="isOpenModalChild = false">取 消</Button>
      <Button v-if="!isSuccess" type="primary" :loading="isSending" @click="submit()">确 定</Button>
    </div>
  </Modal>
</template>

<script type="text/ecmascript-6">
  import { thousandFormatter } from '@/config/format'
  import { httpRequest } from '@/service/index'

  export default {
    props:['dataProp'],
    data () {
      return {
        isOpenModalChild: false,
        isSending: false,
        isSuccess: false,
        agentPoints: ''
      }
    },
    computed:{
      isSaveStatus () {
        return this.dataProp.isSave == 0
      },
      agentName () {
        return `【代理】${this.dataProp.parentName}`
      },
      balanceInfo () {
        return this.dataProp
      },
      parentPoints () {
        return this.isSaveStatus ? `上级代理可分配点数为:${this.agentPoints || 0}` : `当前玩家剩余点数为：${this.dataProp.balance}`
      }
    },
    methods:{
      getList() {
        // if (!this.isSaveStatus) return
        httpRequest('post','/agent/point',{
          userId: this.dataProp.fromUserId
        }).then(
          result => {
            this.agentPoints = result.points
          }
        )
      },
      openRechargeModal () {
        this.isSuccess = false
        this.isOpenModalChild = true
        this.balanceInfo.remark = ''
        this.balanceInfo.points = ''
        this.getList()
      },
      submit () {
        var rex = new RegExp(/^[0-9]*[1-9][0-9]*$/)
        if (this.isSave && (!rex.exec(this.balanceInfo.points) || this.balanceInfo.points > 1000000000)) {
          return this.$Message.error('存点数范围为1-1000,000,00的正整数')
        } else if (!rex.exec(this.balanceInfo.points)) {
          return this.$Message.error(`${this.isSaveStatus ? '存点' : '提点'}数为正整数`)
        }
        if (this.isSending) return
        this.isSending = true
        httpRequest('post',`${this.isSaveStatus ? '/agent/player/deposit' : '/agent/player/take'}`,{
          fromUserId: this.balanceInfo.fromUserId,
          toUser: this.balanceInfo.userName,
          amount: this.balanceInfo.points,
          remark: this.balanceInfo.remark
        }).then(
          result => {
            if(result.code == '0') {
              this.$Message.success('提交成功')
              this.isSuccess = true
              setTimeout(()=> {
                this.isOpenModalChild = false;
                this.$emit('updateInfo')
              },1000)
            }
          }
        ).finally(()=>{
          this.isSending = false
        })
      },
      change(bool){
        if(!bool){
          this.$emit('closeModal')
          this.isOpenModalChild = false
        }
      },
      formatPoints (num) {
        return thousandFormatter(num)
      } // 千位符格式化
    }
  }
</script>

<style scoped type="text/less" lang="less">
  .p-modal-recharge{
    .-p-m-tips{
      font-size: 16px;
      margin-bottom: 20px
    }
    .-p-green{
      color: #00CC00
    }
    .-p-red{
      color: #FF3300
    }
    .g-text-center{
      text-align: center;
    }
  }
  .ivu-tooltip{
    width: 100%;
  }
  .ivu-input-number{
    width: 100%;
  }
</style>
