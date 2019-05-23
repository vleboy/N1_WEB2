<template>
  <div class="dayReport">
    <div class="nowList">
      <div>
    <p>
      <Table :columns="columns1" :data="mysArr" style="margin-bottom: 1rem" size="small">
        <template slot-scope="{row, index}" slot="prizeOperate">
          <span style="cursor:pointer;color:#20a0ff" @click="prizeOperateConfig(row)">修改并启用配置</span>
        </template>
      </Table>
    </p>
    <p>
      <Table :columns="columns2" :data="noMysArr" size="small">
        <template slot-scope="{row, index}" slot="noOperate">
          <span style="cursor:pointer;color:#20a0ff" @click="prizeOperateConfig(row)">修改并启用配置</span>
        </template>
      </Table>
    </p> 
  </div>
    </div>
    <Spin size="large" fix v-show="spinShow" style="z-index:200;">
      <Icon type="ios-loading" size=64 class="demo-spin-icon-load"></Icon>
      <div style>加载中...</div>
    </Spin>
  </div>
</template>

<script>

import { httpRequest } from "@/service/index";
export default {
  created() {
    this.getData();
    
  },
  data() {
    return {
      spinShow: false,
      dataList: [],
      mysArr: [],
      noMysArr: [],
      columns1: [
        {
          title: "游戏系列-神秘大奖版",
          align: 'center',
          key: "gameType",
         
        },
        {
          title: "数值配表",
          key: "option",
          align: 'center',
          minWidth: 600,

          render: (h, params) => {
            return h(
              "RadioGroup",
              {
                props: {
                  value: params.row.killRateLevel
                },
                on: {
                  "on-change": val => {
                    params.row.killRateLevel = val;
                  }
                }
              },
              [
                h(
                  "Radio",
                  {
                    props: {
                      label: 0
                    }
                  },
                  "配置0-默认配置"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 1
                    }
                  },
                  "配置1-88%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 2
                    }
                  },
                  "配置2-90%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 3
                    }
                  },
                  "配置3-92%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 4
                    }
                  },
                  "配置4-94%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 5
                    }
                  },
                  "配置5-96%"
                )
              ]
            );
          }
        },
        {
          title: "操作",
          slot: "prizeOperate",
          align: "center"
        }
      ],
      columns2: [
        {
          title: "游戏系列-无大奖版",
          key: "gameType",
          align: 'center'
        },
        {
          title: "数值配表",
          key: "option",
          align: "center",
          minWidth: 600,
          render: (h, params) => {
            return h(
              "RadioGroup",
              {
                props: {
                  value: params.row.killRateLevel
                },
                on: {
                  "on-change": val => {
                    params.row.killRateLevel = val;
                  }
                }
              },
              [
                h(
                  "Radio",
                  {
                    props: {
                      label: 0
                    }
                  },
                  "配置0-默认配置"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 1
                    }
                  },
                  "配置1-88%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 2
                    }
                  },
                  "配置2-90%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 3
                    }
                  },
                  "配置3-92%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 4
                    }
                  },
                  "配置4-94%"
                ),
                h(
                  "Radio",
                  {
                    props: {
                      label: 5
                    }
                  },
                  "配置5-96%"
                )
              ]
            );
          }
        },
        {
          title: "操作",
          slot: "noOperate",
          align: "center",
        }
      ],
    };
  },
  methods: {
    /* 神秘大奖系列 */
    //操作
    prizeOperateConfig(row) {
      console.log(row.killRateLevel);
      
      this.$Modal.confirm({
        title: '操作',
        content: '确定修改并启用配置？',
        onOk: () => {
          httpRequest(
            "post",
            "/setGameConfig",
            { gameType: row.gameType,config:{killRateLevel:row.killRateLevel}},
            "prize"
          )
            this.$Message.info('操作成功');
        },
        onCancel: () => {
            this.$Message.info('操作取消');
        }
      })
    },

    async getData() {
      this.spinShow = true
      httpRequest(
        "post",
        "/getGameConfig",
        { gameType: 'all'},
        "prize"
      ).then(res => {
        this.spinShow = false
        res.config.forEach(item => {
          if (item.gameType.indexOf("_") != -1) {
            this.mysArr.push(item);
          }
        })
        res.config.forEach(item => {
          if (item.gameType.indexOf("_") == -1) {
            this.noMysArr.push(item);
          }
        })
      })
    }

  },
  computed: {
    /* getMys() {
      let mysArr = [];
      this.dataList.forEach(item => {
        if (item.gameType.indexOf("_") != -1) {
          mysArr.push(item);
        }
      });
      
      return mysArr;
    },
    getNoMys() {
      let mysArr = [];
      this.dataList.forEach(item => {
        if (item.gameType.indexOf("_") == -1) {
          mysArr.push(item);
        }
      });
      return mysArr;
    } */
  }
};
</script>


<style lang="less" scoped>
.dayReport {
  min-height: 90vh;
  .title {
    font-size: 1.2rem;
    margin: 0.5rem 0 0.5rem;
    font-weight: 600;
    display: inline-block;
  }
  .top {
    display: flex;
    margin-bottom: 1rem;
    .title {
      margin: 0;
    }
    .right {
      margin-left: 2rem;
    }
  }
  .demo-spin-icon-load {
    animation: ani-demo-spin 1s linear infinite;
  }
}
#myChart {
  width: 100%;
  height: 300px;
}
</style>

