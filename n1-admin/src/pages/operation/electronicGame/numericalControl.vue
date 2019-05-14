<template>
  <div class="dayReport">
    <div class="nowList">
      <div>
    <p>
      <Table :columns="columns1" :data="getMys" style="margin-bottom: 5rem"></Table>
    </p>
    <p>
      <Table :columns="columns2" :data="getNoMys"></Table>
    </p> 
  </div>
    </div>
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
          key: "setting",
          align: "center",
          render: (h, params) =>{
           //console.log(window.selfs);
           
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#20a0ff"
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                    title: '操作',
                    content: '确定修改并启用配置？',
                    onOk: () => {
                      httpRequest(
                      "post",
                      "/setGameConfig",
                      { gameType: params.row.gameType,config:{killRateLevel:params.row.killRateLevel}},
                      "prize"
                    )
                        this.$Message.info('操作成功');
                    },
                    onCancel: () => {
                        this.$Message.info('操作取消');
                    }
                    });
                    
                  }
                }
              },
              "修改并启用配置"
            );
          }
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
          key: "setting",
          align: "center",
         
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  cursor: "pointer",
                  color: "#20a0ff"
                },
                on: {
                  click: () => {
                    this.$Modal.confirm({
                    title: '操作',
                    content: '确定修改并启用配置？',
                    onOk: () => {
                      httpRequest(
                      "post",
                      "/setGameConfig",
                      { gameType: params.row.gameType,config:{killRateLevel:params.row.killRateLevel}},
                      "prize"
                    )
                        this.$Message.info('操作成功');
                    },
                    onCancel: () => {
                        this.$Message.info('操作取消');
                    }
                    });
                    
                  }
                }
              },
              "修改并启用配置"
            );
          }
         
        }
      ],
    };
  },
  methods: {
    async getData() {
      let _this = this
      httpRequest(
        "post",
        "/getGameConfig",
        { gameType: 'all'},
        "prize"
      ).then(res => {
        _this.dataList = res.config;
      
      });
      /* let data = [
        {
          _id: "5c7f2dd9837d662b4759404a",
          gameType: "panda",
          killRateLevel: "0"
        },
        {
          _id: "5c7f2dd9f087042b40d70800",
          gameType: "243",
          killRateLevel: "1"
        },
        {
          _id: "5c7f2dd9bb0b8b2b51ad77de",
          gameType: "panda_bonus",
          killRateLevel: "2"
        },
        {
          _id: "5c7f2ddae675162b46ad20a1",
          gameType: "243_bonus",
          killRateLevel: "0"
        },
        {
          _id: "5c7f2ddb8ad5f82b5dff7e06",
          gameType: "tree_bonus",
          killRateLevel: "1"
        },
        {
          _id: "5c7f2ddb9584b92b572e9773",
          gameType: "tree",
          killRateLevel: "2"
        }
      ];
      this.dataList = data; */
    },

  },
  computed: {
    getMys() {
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
    }
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

