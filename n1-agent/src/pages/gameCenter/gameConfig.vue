<template>
    <div class="config">
        <div class="content">
            <h2>包房代理配置</h2>
            <Form ref='gameConfig' :model="config" label-position='left' :label-width="100">
                <FormItem label="庄对">
                    <InputNumber :min='0' :max="100" v-model="config.banker" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"></InputNumber>
                </FormItem>
                <FormItem label="庄对">
                    <InputNumber :min='0' :max="100" v-model="config.hedging" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"></InputNumber>
                </FormItem>
                <FormItem label="余量">
                    <InputNumber :min='0' :max="100" v-model="config.remain" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"></InputNumber>
                </FormItem>
            </Form>
            <div class="btn">
                <Button type="primary" @click="ok" class="confirm">提交</Button>
                <Button type="primary" class="reset" @click="reset">重置</Button>
            </div>
        </div>
    </div>
</template>
<script>
import { configNew, configOne } from "@/service/index";
export default {
  data() {
    return {
      config: {
        banker: 0,
        hedging: 0,
        remain: 0
      }
    };
  },
  methods: {
    ok() {
      configNew({
        ...this.config,
        code: "bfagent"
      }).then(res => {
        if (res.code == 0) {
          this.$Message.success("提交成功");
        }
      });
    },
    reset() {
      this.config = {
        banker: 0,
        hedging: 0,
        remain: 0
      };
    },
    init() {
      configOne({ code: "bfagent" }).then(res => {
        if (res.code == 0) {
          let data = res.payload;
          this.config.banker = data.banker;
          this.config.hedging = data.hedging;
          this.config.remain = data.remain;
        }
      });
    }
  },
  created() {
      this.init()
  }
};
</script>
<style lang="less" scoped>
.config {
  min-height: 89vh;
  .content {
    width: 300px;
    margin: 0 auto;
  }
  h2 {
    margin: 40px;
  }
  .btn {
    margin: 50px;
  }
  .confirm {
    margin-right: 30px;
  }
}
</style>
